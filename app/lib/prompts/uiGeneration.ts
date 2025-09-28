/**
 * Enhanced AI prompts for generating high-quality UI code
 * Optimized for creating beautiful, accessible, and modern components
 */

export const UI_GENERATION_PROMPTS = {
  base: `You are an expert UI/UX developer specializing in creating beautiful, modern web interfaces. When generating code, always follow these principles:

DESIGN SYSTEM:
- Use the existing Bolt design system with CSS variables (--bolt-elements-*)
- Prefer UnoCSS classes over inline styles
- Use semantic HTML elements for accessibility
- Include proper ARIA labels and roles
- Ensure mobile-first responsive design

COMPONENT PATTERNS:
- Use React functional components with TypeScript
- Implement proper forwardRef for reusable components
- Include comprehensive prop interfaces
- Use the classNames utility for conditional styling
- Follow the existing component structure in the codebase

STYLING GUIDELINES:
- Use rounded-xl for modern corner radius
- Implement smooth transitions (transition-all duration-200)
- Use proper elevation with shadows (shadow-sm, shadow-md, shadow-lg)
- Include hover and focus states for interactive elements
- Use the bolt color palette for consistency

LAYOUT PRINCIPLES:
- Use CSS Grid and Flexbox for layouts
- Implement proper spacing using consistent padding/margin
- Ensure proper visual hierarchy with typography
- Include loading states and error boundaries
- Make components interactive with proper state management`,

  landing: `Create a stunning landing page with modern design principles:

STRUCTURE:
- Hero section with compelling headline and CTA
- Feature section highlighting key benefits
- Social proof or testimonials
- Clear call-to-action sections
- Footer with relevant links

DESIGN:
- Use gradient backgrounds or subtle patterns
- Include beautiful illustrations or images
- Implement smooth animations and micro-interactions
- Use proper typography hierarchy
- Ensure excellent mobile experience

COMPONENTS TO USE:
- HeroSection with variant="centered" or "split"
- FeatureGrid with icons and descriptions
- Card components for testimonials
- Button components with proper variants
- Modern form components for lead capture`,

  dashboard: `Create a professional dashboard interface:

LAYOUT:
- Sidebar navigation with collapsible menu
- Header with user profile and notifications
- Main content area with grid layout
- Status cards showing key metrics
- Data tables with sorting and filtering

COMPONENTS:
- Navigation with active states
- Stat cards with icons and trends
- Data visualization components
- Form components for data input
- Loading skeletons for async content

FUNCTIONALITY:
- Responsive layout that works on all devices
- Interactive elements with proper feedback
- Search and filter capabilities
- Export and sharing options
- Real-time data updates`,

  ecommerce: `Build a modern e-commerce interface:

PRODUCT PAGES:
- Product grid with hover effects
- Detailed product views with image galleries
- Shopping cart with quantity controls
- Checkout process with form validation
- User account management

DESIGN ELEMENTS:
- Product cards with ratings and reviews
- Price displays with discounts
- Category filters and search
- Wishlist functionality
- Payment method selection

USER EXPERIENCE:
- Quick view modals for products
- Smooth animations for cart updates
- Mobile-optimized shopping experience
- Trust signals and security badges
- Shipping and return information`,

  blog: `Create an engaging blog interface:

CONTENT LAYOUT:
- Article list with featured images
- Individual post layout with typography
- Author profiles and bios
- Comment sections with threading
- Category and tag organization

DESIGN:
- Beautiful typography for readability
- Image galleries and media embeds
- Social sharing buttons
- Related posts suggestions
- Newsletter subscription forms

FEATURES:
- Search functionality across posts
- Tag and category filtering
- Reading progress indicators
- Dark/light mode toggle
- Responsive image optimization`,

  forms: `Design beautiful and functional forms:

FORM STRUCTURE:
- Clear field labels and placeholders
- Proper input validation with error messages
- Progressive enhancement for accessibility
- Multi-step forms with progress indicators
- Auto-save functionality

INPUT COMPONENTS:
- Text inputs with floating labels
- Select dropdowns with search
- Checkbox and radio button groups
- File upload with drag-and-drop
- Date and time pickers

USER EXPERIENCE:
- Real-time validation feedback
- Loading states during submission
- Success confirmations
- Error handling and recovery
- Keyboard navigation support`,
};

export const COMPONENT_GENERATION_RULES = {
  // Rules for generating consistent, high-quality components
  structure: [
    'Always use TypeScript interfaces for props',
    'Include forwardRef for reusable components',
    'Use proper React.HTMLAttributes extension',
    'Include displayName for debugging',
    'Export individual components and composite exports',
  ],

  styling: [
    'Use the classNames utility from ~/utils/classNames',
    'Prefer CSS variables over hardcoded colors',
    'Include variant props for different styles',
    'Use responsive classes (sm:, md:, lg:, xl:)',
    'Add hover and focus states for interactions',
  ],

  accessibility: [
    'Include proper ARIA labels and roles',
    'Ensure keyboard navigation support',
    'Use semantic HTML elements',
    'Provide proper color contrast',
    'Include screen reader friendly content',
  ],

  performance: [
    'Use React.memo for expensive components',
    'Implement lazy loading for images',
    'Use proper key props in lists',
    'Minimize re-renders with useMemo/useCallback',
    'Include proper loading states',
  ],
};

export const CODE_QUALITY_GUIDELINES = {
  formatting: [
    'Use 2-space indentation',
    'Include proper line breaks for readability',
    'Group related props together',
    'Use consistent naming conventions',
    'Include JSDoc comments for complex logic',
  ],

  imports: [
    'Import React types explicitly',
    'Use relative imports for local components',
    'Group imports by category (React, third-party, local)',
    'Use named imports when possible',
    'Include only necessary imports',
  ],

  exports: [
    'Use named exports for components',
    'Include example usage in comments',
    'Export types and interfaces separately',
    'Provide default props when appropriate',
    'Include component variants and examples',
  ],
};

/**
 * Generate a comprehensive prompt for UI component creation
 */
export function generateUIPrompt(
  componentType: 'landing' | 'dashboard' | 'ecommerce' | 'blog' | 'forms',
  requirements: string,
  additionalContext?: string
): string {
  const basePrompt = UI_GENERATION_PROMPTS.base;
  const specificPrompt = UI_GENERATION_PROMPTS[componentType];

  return `${basePrompt}

SPECIFIC REQUIREMENTS:
${specificPrompt}

USER REQUEST:
${requirements}

${additionalContext ? `ADDITIONAL CONTEXT:\n${additionalContext}` : ''}

Please generate clean, production-ready React/TypeScript code that follows all the guidelines above. Include proper error handling, loading states, and ensure the component is fully accessible and responsive.`;
}

/**
 * Prompts for improving existing code
 */
export const CODE_IMPROVEMENT_PROMPTS = {
  modernize: `Modernize this component to use current best practices:
- Update to modern React patterns (hooks, functional components)
- Improve TypeScript typing with proper interfaces
- Add better accessibility features
- Implement responsive design
- Include proper error boundaries and loading states`,

  optimize: `Optimize this component for better performance:
- Implement React.memo where appropriate
- Use useMemo and useCallback for expensive operations
- Add lazy loading for images and content
- Minimize re-renders
- Improve bundle size`,

  accessibility: `Improve the accessibility of this component:
- Add proper ARIA labels and roles
- Ensure keyboard navigation works properly
- Improve color contrast
- Add screen reader support
- Include focus management`,

  responsive: `Make this component fully responsive:
- Use mobile-first approach
- Add proper breakpoints for different screen sizes
- Ensure touch-friendly interface
- Optimize for different devices
- Test on various screen resolutions`,
};