import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import { ReactNode } from "react";

interface FormFieldWithIconProps {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  icon: ReactNode;
  error?: { message?: string };
  register?: any;
}

export function FormFieldWithIcon({
  id,
  label,
  type,
  placeholder,
  icon,
  error,
  register,
}: FormFieldWithIconProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <div className="absolute left-3 top-3 z-10">{icon}</div>
        <Input
          id={id}
          type={type}
          placeholder={placeholder}
          {...register}
          className="pl-10"
        />
        {error && (
          <AlertCircle className="h-4 w-4 text-red-500 absolute right-3 top-3" />
        )}
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