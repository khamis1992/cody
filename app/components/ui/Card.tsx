import { forwardRef, type ReactNode } from 'react';
import { classNames } from '~/utils/classNames';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined' | 'filled';
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(({
  className,
  variant = 'default',
  size = 'md',
  interactive = false,
  ...props
}, ref) => {
  const variantClasses = {
    default: 'border-bolt-elements-borderColor bg-bolt-elements-background-depth-1 shadow-sm',
    elevated: 'border-bolt-elements-borderColor bg-bolt-elements-background-depth-1 shadow-lg',
    outlined: 'border-2 border-bolt-elements-borderColor bg-transparent shadow-none',
    filled: 'border-bolt-elements-borderColor bg-bolt-elements-background-depth-2 shadow-sm',
  };

  const sizeClasses = {
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-8',
  };

  const interactiveClasses = interactive
    ? 'cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]'
    : '';

  return (
    <div
      ref={ref}
      className={classNames(
        'rounded-xl border text-bolt-elements-textPrimary transition-all duration-200',
        variantClasses[variant],
        sizeClasses[size],
        interactiveClasses,
        className,
      )}
      {...props}
    />
  );
});
Card.displayName = 'Card';

const CardHeader = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => {
  return <div ref={ref} className={classNames('flex flex-col space-y-1.5 pb-6', className)} {...props} />;
});
CardHeader.displayName = 'CardHeader';

const CardTitle = forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => {
    return (
      <h3
        ref={ref}
        className={classNames('text-xl font-semibold leading-none tracking-tight text-bolt-elements-textPrimary', className)}
        {...props}
      />
    );
  },
);
CardTitle.displayName = 'CardTitle';

const CardDescription = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => {
    return <p ref={ref} className={classNames('text-sm text-bolt-elements-textSecondary leading-relaxed', className)} {...props} />;
  },
);
CardDescription.displayName = 'CardDescription';

const CardContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => {
  return <div ref={ref} className={classNames('pt-0', className)} {...props} />;
});
CardContent.displayName = 'CardContent';

const CardFooter = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={classNames('flex items-center pt-6', className)} {...props} />
));
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
