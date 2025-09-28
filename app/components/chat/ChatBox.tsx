import React from 'react';
import { ClientOnly } from 'remix-utils/client-only';
import { classNames } from '~/utils/classNames';
import { PROVIDER_LIST } from '~/utils/constants';
import { ModelSelector } from '~/components/chat/ModelSelector';
import { APIKeyManager } from './APIKeyManager';
import { LOCAL_PROVIDERS } from '~/lib/stores/settings';
import FilePreview from './FilePreview';
import { ScreenshotStateManager } from './ScreenshotStateManager';
import { SendButton } from './SendButton.client';
import { IconButton } from '~/components/ui/IconButton';
import { toast } from 'react-toastify';
import { SpeechRecognitionButton } from './SpeechRecognition';
import { SupabaseConnection } from './SupabaseConnection';
import { ExpoQrModal } from '~/components/workbench/ExpoQrModal';
import styles from './BaseChat.module.scss';
import type { ProviderInfo } from '~/types/model';
import { ColorSchemeDialog } from '~/components/ui/ColorSchemeDialog';
import type { DesignScheme } from '~/types/design-scheme';
import type { ElementInfo } from '~/components/workbench/Inspector';
import { McpTools } from './MCPTools';

interface ChatBoxProps {
  isModelSettingsCollapsed: boolean;
  setIsModelSettingsCollapsed: (collapsed: boolean) => void;
  provider: any;
  providerList: any[];
  modelList: any[];
  apiKeys: Record<string, string>;
  isModelLoading: string | undefined;
  onApiKeysChange: (providerName: string, apiKey: string) => void;
  uploadedFiles: File[];
  imageDataList: string[];
  textareaRef: React.RefObject<HTMLTextAreaElement> | undefined;
  input: string;
  handlePaste: (e: React.ClipboardEvent) => void;
  TEXTAREA_MIN_HEIGHT: number;
  TEXTAREA_MAX_HEIGHT: number;
  isStreaming: boolean;
  handleSendMessage: (event: React.UIEvent, messageInput?: string) => void;
  isListening: boolean;
  startListening: () => void;
  stopListening: () => void;
  chatStarted: boolean;
  exportChat?: () => void;
  qrModalOpen: boolean;
  setQrModalOpen: (open: boolean) => void;
  handleFileUpload: () => void;
  setProvider?: ((provider: ProviderInfo) => void) | undefined;
  model?: string | undefined;
  setModel?: ((model: string) => void) | undefined;
  setUploadedFiles?: ((files: File[]) => void) | undefined;
  setImageDataList?: ((dataList: string[]) => void) | undefined;
  handleInputChange?: ((event: React.ChangeEvent<HTMLTextAreaElement>) => void) | undefined;
  handleStop?: (() => void) | undefined;
  enhancingPrompt?: boolean | undefined;
  enhancePrompt?: (() => void) | undefined;
  chatMode?: 'discuss' | 'build';
  setChatMode?: (mode: 'discuss' | 'build') => void;
  designScheme?: DesignScheme;
  setDesignScheme?: (scheme: DesignScheme) => void;
  selectedElement?: ElementInfo | null;
  setSelectedElement?: ((element: ElementInfo | null) => void) | undefined;
  isColorSchemeDialogOpen?: boolean;
  onColorSchemeDialogOpenChange?: (isOpen: boolean) => void;
  onColorSchemeSave?: (scheme: DesignScheme) => void;
}

export const ChatBox: React.FC<ChatBoxProps> = (props) => {
  return (
    <div className="bg-slate-800/30 backdrop-blur-md border border-cyan-400/30 rounded-full p-2 shadow-lg shadow-cyan-500/10 flex items-center w-full max-w-3xl mx-auto glow-border-cyan">
      <div className="flex-grow flex flex-col pl-4">
          <textarea
            ref={props.textareaRef}
          className="bg-transparent text-white placeholder-slate-400 border-none outline-none resize-none leading-tight text-base w-full h-12 p-2"
          placeholder="Start a conversation...
What kind of app should we build?"
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault();
              if (props.isStreaming) {
                props.handleStop?.();
              } else {
                props.handleSendMessage?.(event);
              }
            }
          }}
          value={props.input}
          onChange={(event) => {
            props.handleInputChange?.(event);
          }}
          onPaste={props.handlePaste}
        />
      </div>

      <SpeechRecognitionButton
        isListening={props.isListening}
        onStart={props.startListening}
        onStop={props.stopListening}
        disabled={props.isStreaming}
      />

      <ColorSchemeDialog
        designScheme={props.designScheme}
        setDesignScheme={props.setDesignScheme}
        isOpen={props.isColorSchemeDialogOpen}
        onOpenChange={props.onColorSchemeDialogOpenChange}
        onSave={props.onColorSchemeSave}
      />

          <button
        className="flex-shrink-0 w-12 h-12 bg-cyan-500 rounded-full flex items-center justify-center text-white hover:bg-cyan-600 transition-colors disabled:bg-slate-700 disabled:text-slate-400"
            onClick={(e) => {
              if (props.isStreaming) {
                props.handleStop?.();
          } else if (props.input.length > 0 || props.uploadedFiles.length > 0) {
                props.handleSendMessage?.(e);
              }
            }}
        disabled={!props.input && props.uploadedFiles.length === 0}
          >
        <div className="i-ph:paper-plane-tilt-fill text-xl"></div>
          </button>
    </div>
  );
};
