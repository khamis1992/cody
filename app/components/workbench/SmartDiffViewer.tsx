import { useState, useEffect, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { IconButton } from '~/components/ui/IconButton';

interface SmartDiffViewerProps {
  isVisible: boolean;
  onClose: () => void;
  originalCode: string;
  modifiedCode: string;
  fileName: string;
  language?: string;
  onAcceptChanges?: () => void;
  onRejectChanges?: () => void;
}

interface DiffLine {
  type: 'unchanged' | 'added' | 'removed' | 'modified';
  originalLineNumber?: number;
  modifiedLineNumber?: number;
  content: string;
  originalContent?: string;
}

interface DiffChunk {
  originalStart: number;
  originalLength: number;
  modifiedStart: number;
  modifiedLength: number;
  lines: DiffLine[];
}

export const SmartDiffViewer = ({
  isVisible,
  onClose,
  originalCode,
  modifiedCode,
  fileName,
  language = 'typescript',
  onAcceptChanges,
  onRejectChanges,
}: SmartDiffViewerProps) => {
  const [viewMode, setViewMode] = useState<'unified' | 'split'>('unified');
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [highlightSyntax, setHighlightSyntax] = useState(true);

  const diffChunks = useMemo(() => {
    return computeDiff(originalCode, modifiedCode);
  }, [originalCode, modifiedCode]);

  const stats = useMemo(() => {
    const lines = diffChunks.flatMap(chunk => chunk.lines);
    return {
      added: lines.filter(line => line.type === 'added').length,
      removed: lines.filter(line => line.type === 'removed').length,
      modified: lines.filter(line => line.type === 'modified').length,
      total: lines.length,
    };
  }, [diffChunks]);

  function computeDiff(original: string, modified: string): DiffChunk[] {
    const originalLines = original.split('\n');
    const modifiedLines = modified.split('\n');
    const chunks: DiffChunk[] = [];

    // Simple line-by-line diff algorithm
    let originalIndex = 0;
    let modifiedIndex = 0;
    let currentChunk: DiffChunk | null = null;

    while (originalIndex < originalLines.length || modifiedIndex < modifiedLines.length) {
      const originalLine = originalLines[originalIndex];
      const modifiedLine = modifiedLines[modifiedIndex];

      if (originalLine === modifiedLine) {
        // Lines are identical
        if (currentChunk) {
          chunks.push(currentChunk);
          currentChunk = null;
        }

        if (shouldIncludeContext(originalIndex, modifiedIndex, originalLines, modifiedLines)) {
          const line: DiffLine = {
            type: 'unchanged',
            originalLineNumber: originalIndex + 1,
            modifiedLineNumber: modifiedIndex + 1,
            content: originalLine || '',
          };

          if (!currentChunk) {
            currentChunk = {
              originalStart: originalIndex + 1,
              originalLength: 1,
              modifiedStart: modifiedIndex + 1,
              modifiedLength: 1,
              lines: [line],
            };
          } else {
            currentChunk.lines.push(line);
            currentChunk.originalLength++;
            currentChunk.modifiedLength++;
          }
        }

        originalIndex++;
        modifiedIndex++;
      } else if (originalIndex >= originalLines.length) {
        // Only modified lines remain
        if (!currentChunk) {
          currentChunk = {
            originalStart: originalIndex + 1,
            originalLength: 0,
            modifiedStart: modifiedIndex + 1,
            modifiedLength: 1,
            lines: [],
          };
        }

        currentChunk.lines.push({
          type: 'added',
          modifiedLineNumber: modifiedIndex + 1,
          content: modifiedLine,
        });
        currentChunk.modifiedLength++;
        modifiedIndex++;
      } else if (modifiedIndex >= modifiedLines.length) {
        // Only original lines remain
        if (!currentChunk) {
          currentChunk = {
            originalStart: originalIndex + 1,
            originalLength: 1,
            modifiedStart: modifiedIndex + 1,
            modifiedLength: 0,
            lines: [],
          };
        }

        currentChunk.lines.push({
          type: 'removed',
          originalLineNumber: originalIndex + 1,
          content: originalLine,
        });
        currentChunk.originalLength++;
        originalIndex++;
      } else {
        // Lines are different
        if (!currentChunk) {
          currentChunk = {
            originalStart: originalIndex + 1,
            originalLength: 0,
            modifiedStart: modifiedIndex + 1,
            modifiedLength: 0,
            lines: [],
          };
        }

        // Check if this is a modification or separate add/remove
        const similarity = calculateLineSimilarity(originalLine, modifiedLine);
        if (similarity > 0.6) {
          // Treat as modification
          currentChunk.lines.push({
            type: 'modified',
            originalLineNumber: originalIndex + 1,
            modifiedLineNumber: modifiedIndex + 1,
            content: modifiedLine,
            originalContent: originalLine,
          });
          currentChunk.originalLength++;
          currentChunk.modifiedLength++;
          originalIndex++;
          modifiedIndex++;
        } else {
          // Treat as separate remove and add
          currentChunk.lines.push({
            type: 'removed',
            originalLineNumber: originalIndex + 1,
            content: originalLine,
          });
          currentChunk.lines.push({
            type: 'added',
            modifiedLineNumber: modifiedIndex + 1,
            content: modifiedLine,
          });
          currentChunk.originalLength++;
          currentChunk.modifiedLength++;
          originalIndex++;
          modifiedIndex++;
        }
      }
    }

    if (currentChunk) {
      chunks.push(currentChunk);
    }

    return chunks;
  }

  function shouldIncludeContext(
    originalIndex: number,
    modifiedIndex: number,
    originalLines: string[],
    modifiedLines: string[]
  ): boolean {
    // Include context lines around changes
    const contextSize = 3;

    // Check if we're near a change
    for (let i = Math.max(0, originalIndex - contextSize); i < Math.min(originalLines.length, originalIndex + contextSize); i++) {
      const correspondingModifiedIndex = modifiedIndex + (i - originalIndex);
      if (correspondingModifiedIndex >= 0 && correspondingModifiedIndex < modifiedLines.length) {
        if (originalLines[i] !== modifiedLines[correspondingModifiedIndex]) {
          return true;
        }
      }
    }

    return false;
  }

  function calculateLineSimilarity(line1: string, line2: string): number {
    if (line1 === line2) return 1;
    if (!line1 || !line2) return 0;

    // Simple similarity based on common characters
    const longer = line1.length > line2.length ? line1 : line2;
    const shorter = line1.length > line2.length ? line2 : line1;

    if (longer.length === 0) return 1;

    let matches = 0;
    for (let i = 0; i < shorter.length; i++) {
      if (longer.includes(shorter[i])) {
        matches++;
      }
    }

    return matches / longer.length;
  }

  function highlightInlineDiff(original: string, modified: string) {
    // Simple word-level diff highlighting
    const originalWords = original.split(/(\s+)/);
    const modifiedWords = modified.split(/(\s+)/);

    const result = [];
    let i = 0, j = 0;

    while (i < originalWords.length || j < modifiedWords.length) {
      if (i >= originalWords.length) {
        // Only modified words remain
        result.push(
          <span key={`add-${j}`} className="bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200">
            {modifiedWords[j]}
          </span>
        );
        j++;
      } else if (j >= modifiedWords.length) {
        // Only original words remain (should not happen in modified line)
        i++;
      } else if (originalWords[i] === modifiedWords[j]) {
        // Words are the same
        result.push(<span key={`same-${i}-${j}`}>{originalWords[i]}</span>);
        i++;
        j++;
      } else {
        // Words are different
        result.push(
          <span key={`change-${i}-${j}`} className="bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200">
            {modifiedWords[j]}
          </span>
        );
        i++;
        j++;
      }
    }

    return result;
  }

  const getLineStyle = (type: DiffLine['type']) => {
    switch (type) {
      case 'added':
        return 'bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500';
      case 'removed':
        return 'bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500';
      case 'modified':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500';
      default:
        return 'bg-gray-50 dark:bg-gray-800/50';
    }
  };

  const getLinePrefix = (type: DiffLine['type']) => {
    switch (type) {
      case 'added':
        return '+';
      case 'removed':
        return '-';
      case 'modified':
        return '~';
      default:
        return ' ';
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black bg-opacity-50"
            onClick={onClose}
          />

          {/* Diff Viewer Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-4 z-50 bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col max-w-6xl mx-auto"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Code Diff: {fileName}
                  </h2>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-600 dark:text-gray-400">
                    <span className="text-green-600 dark:text-green-400">+{stats.added} additions</span>
                    <span className="text-red-600 dark:text-red-400">-{stats.removed} deletions</span>
                    {stats.modified > 0 && (
                      <span className="text-yellow-600 dark:text-yellow-400">~{stats.modified} modifications</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <IconButton
                    icon="i-ph:eye"
                    onClick={() => setViewMode(viewMode === 'unified' ? 'split' : 'unified')}
                    title={`Switch to ${viewMode === 'unified' ? 'split' : 'unified'} view`}
                  />
                  <IconButton
                    icon="i-ph:list-numbers"
                    onClick={() => setShowLineNumbers(!showLineNumbers)}
                    className={showLineNumbers ? 'bg-gray-200 dark:bg-gray-700' : ''}
                    title="Toggle line numbers"
                  />
                  <IconButton icon="i-ph:x" onClick={onClose} />
                </div>
              </div>
            </div>

            {/* Diff Content */}
            <div className="flex-1 overflow-auto">
              <div className="font-mono text-sm">
                {diffChunks.map((chunk, chunkIndex) => (
                  <div key={chunkIndex} className="border-b border-gray-200 dark:border-gray-700">
                    {/* Chunk Header */}
                    <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 text-xs text-gray-600 dark:text-gray-400">
                      @@ -{chunk.originalStart},{chunk.originalLength} +{chunk.modifiedStart},{chunk.modifiedLength} @@
                    </div>

                    {/* Chunk Lines */}
                    <div>
                      {chunk.lines.map((line, lineIndex) => (
                        <div
                          key={lineIndex}
                          className={`flex items-start ${getLineStyle(line.type)}`}
                        >
                          {showLineNumbers && (
                            <div className="flex-shrink-0 w-16 px-2 py-1 text-xs text-gray-500 dark:text-gray-400 text-right border-r border-gray-300 dark:border-gray-600">
                              {line.originalLineNumber || ''}
                            </div>
                          )}
                          {showLineNumbers && viewMode === 'split' && (
                            <div className="flex-shrink-0 w-16 px-2 py-1 text-xs text-gray-500 dark:text-gray-400 text-right border-r border-gray-300 dark:border-gray-600">
                              {line.modifiedLineNumber || ''}
                            </div>
                          )}
                          <div className="flex-shrink-0 w-8 px-2 py-1 text-xs text-gray-500 dark:text-gray-400 text-center">
                            {getLinePrefix(line.type)}
                          </div>
                          <div className="flex-1 px-2 py-1 whitespace-pre-wrap break-all">
                            {line.type === 'modified' && line.originalContent ? (
                              highlightInlineDiff(line.originalContent, line.content)
                            ) : (
                              <span>{line.content}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {stats.total} lines changed
                </div>
                <div className="flex gap-2">
                  {onRejectChanges && (
                    <button
                      onClick={onRejectChanges}
                      className="px-4 py-2 text-red-600 dark:text-red-400 border border-red-300 dark:border-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      Reject Changes
                    </button>
                  )}
                  {onAcceptChanges && (
                    <button
                      onClick={onAcceptChanges}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Accept Changes
                    </button>
                  )}
                  <button
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};