import { ArrowLeftIcon } from "lucide-react";
import { Button } from "./button";
import { useNavigate } from "@tanstack/react-router";

export interface BackButtonProps {
  /**
   * The path to navigate to when clicked
   * @default '/tables'
   */
  to?: string;
  
  /**
   * Optional label for the button
   * @default 'Quay lại'
   */
  label?: string;
  
  /**
   * Optional className for the button
   */
  className?: string;
}

export function BackButton({ 
  to = '/tables', 
  label = 'Quay lại',
  className = ''
}: BackButtonProps) {
  const navigate = useNavigate();
  
  return (
    <Button 
      variant="ghost" 
      size="sm" 
      className={`flex items-center gap-1 ${className}`}
      onClick={() => navigate({ to })}
    >
      <ArrowLeftIcon size={16} />
      {label}
    </Button>
  );
}
