import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Save, Loader2, AlertCircle } from "lucide-react";
import { UseFormRegister, FieldErrors, UseFormHandleSubmit } from "react-hook-form";
import { resetEmailSchemaType } from "@/lib/helper/validation/change-email-schema";
import { FormFieldWithIcon } from "./form-field-with-icon";

interface EmailFormProps {
  isEmailChanged: boolean;
  isUpdatingEmail: boolean;
  register: UseFormRegister<resetEmailSchemaType>;
  errors: FieldErrors<resetEmailSchemaType>;
  handleSubmit: UseFormHandleSubmit<resetEmailSchemaType>;
  onSubmit: (data: resetEmailSchemaType) => Promise<void>;
}

export function EmailForm({
  isEmailChanged,
  isUpdatingEmail,
  register,
  errors,
  handleSubmit,
  onSubmit,
}: EmailFormProps) {
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>
            Update your account details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <FormFieldWithIcon
            id="email"
            label="Email Address"
            type="email"
            placeholder="your@email.com"
            icon={<Mail className="h-4 w-4 text-gray-400" />}
            error={errors.email}
            register={register("email")}
          />
          
          {isEmailChanged && (
            <p className="text-xs text-amber-600">
              Note: Changing your email will require verification.
            </p>
          )}

          <Button
            type="submit"
            disabled={isUpdatingEmail || !isEmailChanged}
            className="w-full"
          >
            {isUpdatingEmail ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Update Email
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}