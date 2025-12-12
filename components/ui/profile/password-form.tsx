// components/profile/password-form.tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Loader2 } from "lucide-react";
import { UseFormRegister, FieldErrors, UseFormHandleSubmit } from "react-hook-form";
import { resetPasswordSchemaType } from "@/lib/helper/validation/change-password-schema";
import { FormFieldWithIcon } from "./form-field-with-icon";
import { PasswordRequirements } from "./password-requirements";
import { PasswordFieldWithToggle } from "./password-field-with-toggle";

interface PasswordFormProps {
  watchedNewPassword: string;
  isUpdatingPassword: boolean;
  register: UseFormRegister<resetPasswordSchemaType>;
  errors: FieldErrors<resetPasswordSchemaType>;
  handleSubmit: UseFormHandleSubmit<resetPasswordSchemaType>;
  onSubmit: (data: resetPasswordSchemaType) => Promise<void>;
}

export function PasswordForm({
  watchedNewPassword,
  isUpdatingPassword,
  register,
  errors,
  handleSubmit,
  onSubmit,
}: PasswordFormProps) {
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>
            Update your password to keep your account secure
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current Password - No toggle */}
          <FormFieldWithIcon
            id="current-password"
            label="Current Password"
            type="password"
            placeholder="Enter current password"
            icon={<Lock className="h-4 w-4 text-gray-400" />}
            error={errors.currentPassword}
            register={register("currentPassword")}
          />

          {/* New Password - With toggle */}
          <PasswordFieldWithToggle
            id="password"
            label="New Password"
            placeholder="Enter new password"
            error={errors.password}
            register={register("password")}
          />

          {/* Confirm New Password - With toggle */}
          <PasswordFieldWithToggle
            id="confirmPassword"
            label="Confirm New Password"
            placeholder="Confirm new password"
            error={errors.confirmPassword}
            register={register("confirmPassword")}
          />

          {watchedNewPassword && <PasswordRequirements password={watchedNewPassword} />}

          <Button
            type="submit"
            disabled={isUpdatingPassword}
            className="w-full"
          >
            {isUpdatingPassword ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Password"
            )}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}