import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AlertCircle, Eye, EyeOff, Lock } from "lucide-react";

interface PasswordFieldWithToggleProps {
  id: string;
  label: string;
  placeholder: string;
  error?: { message?: string };
  register?: any;
}

export function PasswordFieldWithToggle({
  id,
  label,
  placeholder,
  error,
  register,
}: PasswordFieldWithToggleProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Lock className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 z-10" />
        <Input
          id={id}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          {...register}
          className="pl-10 pr-20"
        />
        
        {/* Error icon - positioned to the right */}
        {error && (
          <AlertCircle className="h-4 w-4 text-red-500 absolute right-12 top-1/2 -translate-y-1/2 z-10" />
        )}
        
        {/* Show/Hide password toggle - always at the far right */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-transparent z-10"
          onClick={() => setShowPassword(!showPassword)}
          tabIndex={-1}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4 text-gray-500" />
          ) : (
            <Eye className="h-4 w-4 text-gray-500" />
          )}
        </Button>
      </div>
      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {error.message}
        </p>
      )}
    </div>
  );
}