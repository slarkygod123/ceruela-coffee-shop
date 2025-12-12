"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/store/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { useProfile } from "@/hooks/useProfile";
import { LoadingState } from "@/components/ui/profile/loading-state";
import { ProfileTabs } from "@/components/ui/profile/profile-tabs";
import { EmailForm } from "@/components/ui/profile/email-form";
import { PasswordForm } from "@/components/ui/profile/password-form";
import { ProfilePictureUpload } from "@/components/ui/profile/profile-picture-upload";
import { useMounted } from "@/hooks/useMounted";
import { useEffect, useState } from "react"; 

export default function ProfilePage() {
  const [isClient, setIsClient] = useState(false); 
  const router = useRouter();
  const { isLoggedIn, email: authEmail, profile_picture, userId } = useAuth();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && !isLoggedIn) {
      router.push("/login?redirect=/profile");
    }
  }, [isClient, isLoggedIn, router]);

  const {
    loading,
    uploading,
    profilePicture,
    currentEmail,
    watchedNewPassword,
    isEmailChanged,
    isUpdatingEmail,
    isUpdatingPassword,
    registerEmail,
    registerPassword,
    emailErrors,
    passwordErrors,
    handleEmailSubmit,
    handlePasswordSubmit,
    handleImageUpload,
    onEmailSubmit,
    onPasswordSubmit,
  } = useProfile({
    isLoggedIn,
    authEmail,
    userId,
    profile_picture,
  });

  if (!isClient) return null;
  if (!isLoggedIn) return null;

  const mounted = useMounted();
  if (!mounted) return null;
  if (loading) return <LoadingState />;

  return (
    <div className="min-h-screen bg-amber-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-amber-900 mb-8">My Profile</h1>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Column - Profile Picture */}
          <div className="md:col-span-1">
            <Card>
              <CardContent className="pt-6">
                <ProfilePictureUpload
                  profilePicture={profilePicture}
                  uploading={uploading}
                  currentEmail={currentEmail}
                  onImageUpload={handleImageUpload}
                />
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Profile Settings */}
          <div className="md:col-span-2">
            <ProfileTabs
              accountTab={
                <EmailForm
                  isEmailChanged={isEmailChanged}
                  isUpdatingEmail={isUpdatingEmail}
                  register={registerEmail}
                  errors={emailErrors}
                  handleSubmit={handleEmailSubmit}
                  onSubmit={onEmailSubmit}
                />
              }
              securityTab={
                <PasswordForm
                  watchedNewPassword={watchedNewPassword}
                  isUpdatingPassword={isUpdatingPassword}
                  register={registerPassword}
                  errors={passwordErrors}
                  handleSubmit={handlePasswordSubmit}
                  onSubmit={onPasswordSubmit}
                />
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}