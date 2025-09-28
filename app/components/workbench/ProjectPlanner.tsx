import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { IconButton } from '~/components/ui/IconButton';

interface ProjectPlannerProps {
  isVisible: boolean;
  onClose: () => void;
  initialPrompt?: string;
  onPlanGenerated: (plan: ProjectPlan) => void;
}

interface TaskItem {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  estimatedTime: string;
  dependencies: string[];
  status: 'pending' | 'in-progress' | 'completed';
  category: 'design' | 'frontend' | 'backend' | 'testing' | 'deployment';
}

interface ProjectPlan {
  title: string;
  description: string;
  estimatedDuration: string;
  techStack: string[];
  phases: Array<{
    name: string;
    description: string;
    tasks: TaskItem[];
    estimatedTime: string;
  }>;
  architecture: {
    components: string[];
    dataFlow: string;
    apiEndpoints: string[];
  };
}

const TECH_STACK_OPTIONS = [
  'React', 'TypeScript', 'Node.js', 'Express', 'Next.js', 'Vite',
  'TailwindCSS', 'PostgreSQL', 'MongoDB', 'Redis', 'Docker',
  'AWS', 'Vercel', 'Supabase', 'Prisma', 'tRPC', 'GraphQL'
];

const PROJECT_TEMPLATES = [
  {
    type: 'webapp',
    name: 'Web Application',
    description: 'Full-stack web application with user authentication',
    phases: ['Planning', 'Design', 'Frontend', 'Backend', 'Testing', 'Deployment']
  },
  {
    type: 'landing',
    name: 'Landing Page',
    description: 'Marketing website with modern design',
    phases: ['Design', 'Frontend', 'Content', 'SEO', 'Deployment']
  },
  {
    type: 'dashboard',
    name: 'Admin Dashboard',
    description: 'Data visualization and management interface',
    phases: ['Planning', 'Design', 'Components', 'Integration', 'Testing']
  },
  {
    type: 'api',
    name: 'REST API',
    description: 'Backend API with database integration',
    phases: ['Planning', 'Database Design', 'API Development', 'Documentation', 'Testing']
  }
];

export const ProjectPlanner = ({
  isVisible,
  onClose,
  initialPrompt = '',
  onPlanGenerated,
}: ProjectPlannerProps) => {
  const [step, setStep] = useState(1);
  const [prompt, setPrompt] = useState(initialPrompt);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [selectedTechStack, setSelectedTechStack] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<ProjectPlan | null>(null);

  const analyzePrompt = useCallback((userPrompt: string) => {
    // Simple prompt analysis to suggest template and tech stack
    const lowerPrompt = userPrompt.toLowerCase();

    let suggestedTemplate = '';
    let suggestedTech: string[] = [];

    if (lowerPrompt.includes('dashboard') || lowerPrompt.includes('admin')) {
      suggestedTemplate = 'dashboard';
      suggestedTech = ['React', 'TypeScript', 'TailwindCSS', 'Node.js'];
    } else if (lowerPrompt.includes('landing') || lowerPrompt.includes('marketing')) {
      suggestedTemplate = 'landing';
      suggestedTech = ['React', 'TypeScript', 'TailwindCSS', 'Vercel'];
    } else if (lowerPrompt.includes('api') || lowerPrompt.includes('backend')) {
      suggestedTemplate = 'api';
      suggestedTech = ['Node.js', 'Express', 'PostgreSQL', 'Prisma'];
    } else {
      suggestedTemplate = 'webapp';
      suggestedTech = ['React', 'TypeScript', 'TailwindCSS', 'Node.js', 'PostgreSQL'];
    }

    setSelectedTemplate(suggestedTemplate);
    setSelectedTechStack(suggestedTech);
  }, []);

  useEffect(() => {
    if (initialPrompt) {
      analyzePrompt(initialPrompt);
    }
  }, [initialPrompt, analyzePrompt]);

  const generateProjectPlan = async () => {
    setIsGenerating(true);

    // Simulate AI planning (in real implementation, this would call an AI service)
    await new Promise(resolve => setTimeout(resolve, 2000));

    const template = PROJECT_TEMPLATES.find(t => t.type === selectedTemplate) || PROJECT_TEMPLATES[0];

    const plan: ProjectPlan = {
      title: extractProjectTitle(prompt),
      description: prompt,
      estimatedDuration: calculateDuration(selectedTechStack, template.phases.length),
      techStack: selectedTechStack,
      phases: template.phases.map((phaseName, index) => ({
        name: phaseName,
        description: generatePhaseDescription(phaseName, prompt),
        estimatedTime: `${Math.ceil((index + 1) * 1.5)} days`,
        tasks: generatePhaseTasks(phaseName, prompt, selectedTechStack)
      })),
      architecture: {
        components: generateComponents(selectedTechStack, prompt),
        dataFlow: generateDataFlow(selectedTemplate),
        apiEndpoints: generateApiEndpoints(prompt, selectedTemplate)
      }
    };

    setGeneratedPlan(plan);
    setIsGenerating(false);
    onPlanGenerated(plan);
  };

  const extractProjectTitle = (prompt: string): string => {
    const words = prompt.split(' ').slice(0, 5).join(' ');
    return words.charAt(0).toUpperCase() + words.slice(1);
  };

  const calculateDuration = (techStack: string[], phaseCount: number): string => {
    const baseTime = phaseCount * 2;
    const complexity = techStack.length > 5 ? 1.5 : 1.2;
    return `${Math.ceil(baseTime * complexity)} days`;
  };

  const generatePhaseDescription = (phase: string, prompt: string): string => {
    const descriptions: Record<string, string> = {
      'Planning': 'Define requirements, create user stories, and plan the project structure',
      'Design': 'Create wireframes, mockups, and design system components',
      'Frontend': 'Implement user interface components and client-side functionality',
      'Backend': 'Build server logic, APIs, and database integration',
      'Testing': 'Write and execute unit tests, integration tests, and end-to-end tests',
      'Deployment': 'Set up CI/CD pipeline and deploy to production environment'
    };
    return descriptions[phase] || `Work on ${phase.toLowerCase()} phase`;
  };

  const generatePhaseTasks = (phase: string, prompt: string, techStack: string[]): TaskItem[] => {
    const baseTasks: Record<string, TaskItem[]> = {
      'Planning': [
        {
          id: '1',
          title: 'Requirements Analysis',
          description: 'Analyze user requirements and define project scope',
          priority: 'high',
          estimatedTime: '2 hours',
          dependencies: [],
          status: 'pending',
          category: 'design'
        }
      ],
      'Design': [
        {
          id: '2',
          title: 'Create Wireframes',
          description: 'Design basic layout and user flow',
          priority: 'high',
          estimatedTime: '4 hours',
          dependencies: ['1'],
          status: 'pending',
          category: 'design'
        }
      ],
      'Frontend': [
        {
          id: '3',
          title: 'Setup React App',
          description: 'Initialize React application with TypeScript',
          priority: 'high',
          estimatedTime: '1 hour',
          dependencies: ['2'],
          status: 'pending',
          category: 'frontend'
        }
      ]
    };

    return baseTasks[phase] || [];
  };

  const generateComponents = (techStack: string[], prompt: string): string[] => {
    const baseComponents = ['App', 'Layout', 'Header', 'Footer'];
    if (techStack.includes('React')) {
      baseComponents.push('Router', 'ErrorBoundary');
    }
    return baseComponents;
  };

  const generateDataFlow = (template: string): string => {
    const flows: Record<string, string> = {
      'webapp': 'User → Frontend → API → Database → Response',
      'landing': 'User → Static Site → Contact Form → Email Service',
      'dashboard': 'User → Auth → Dashboard → API → Data Visualization',
      'api': 'Client → API Gateway → Business Logic → Database'
    };
    return flows[template] || flows['webapp'];
  };

  const generateApiEndpoints = (prompt: string, template: string): string[] => {
    const baseEndpoints = ['/api/health'];
    if (template === 'webapp' || template === 'dashboard') {
      baseEndpoints.push('/api/auth/login', '/api/auth/logout', '/api/users');
    }
    return baseEndpoints;
  };

  const toggleTechStack = (tech: string) => {
    setSelectedTechStack(prev =>
      prev.includes(tech)
        ? prev.filter(t => t !== tech)
        : [...prev, tech]
    );
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

          {/* Project Planner Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-4 z-50 bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col max-w-4xl mx-auto"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    AI Project Planner
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Generate a structured development plan for your project
                  </p>
                </div>
                <IconButton icon="i-ph:x" onClick={onClose} />
              </div>

              {/* Step Progress */}
              <div className="flex items-center mt-6">
                {[1, 2, 3].map((stepNumber) => (
                  <div key={stepNumber} className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        step >= stepNumber
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      {stepNumber}
                    </div>
                    {stepNumber < 3 && (
                      <div
                        className={`w-16 h-1 mx-2 ${
                          step > stepNumber ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Project Description
                    </label>
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Describe your project idea in detail..."
                      className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Project Type
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {PROJECT_TEMPLATES.map((template) => (
                        <button
                          key={template.type}
                          onClick={() => setSelectedTemplate(template.type)}
                          className={`p-4 text-left border rounded-lg transition-colors ${
                            selectedTemplate === template.type
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                          }`}
                        >
                          <div className="font-medium text-gray-900 dark:text-gray-100">
                            {template.name}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {template.description}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Technology Stack
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {TECH_STACK_OPTIONS.map((tech) => (
                        <button
                          key={tech}
                          onClick={() => toggleTechStack(tech)}
                          className={`p-2 text-sm rounded-lg border transition-colors ${
                            selectedTechStack.includes(tech)
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                              : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400'
                          }`}
                        >
                          {tech}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                      Selected Technologies
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedTechStack.map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded text-sm"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  {isGenerating ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mb-4" />
                      <p className="text-gray-600 dark:text-gray-400">Generating project plan...</p>
                    </div>
                  ) : generatedPlan ? (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                          {generatedPlan.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                          Estimated Duration: {generatedPlan.estimatedDuration}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {generatedPlan.phases.map((phase, index) => (
                          <div
                            key={index}
                            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                          >
                            <h4 className="font-medium text-gray-900 dark:text-gray-100">
                              {phase.name}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {phase.description}
                            </p>
                            <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                              {phase.estimatedTime}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <button
                        onClick={generateProjectPlan}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Generate Project Plan
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-between">
                <button
                  onClick={() => setStep(Math.max(1, step - 1))}
                  disabled={step === 1}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => {
                    if (step < 3) {
                      setStep(step + 1);
                    } else {
                      onClose();
                    }
                  }}
                  disabled={step === 1 && !prompt.trim()}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {step === 3 ? 'Close' : 'Next'}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};