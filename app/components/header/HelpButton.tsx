import { Button } from '../ui/Button';

interface HelpButtonProps {
  onClick?: () => void;
}

export const HelpButton = ({ onClick }: HelpButtonProps) => {
  return (
    <Button variant="ghost" className="flex items-center gap-2 text-left justify-start" onClick={onClick}>
      <div className="i-ph:question-bold" />
      Help & Documentation
    </Button>
  );
};