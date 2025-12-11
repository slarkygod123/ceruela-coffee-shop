// app/profile/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/lib/store/useAuth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  Mail,
  Lock,
  Upload,
  Save,
  Loader2,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import {
  resetPasswordSchema,
  resetPasswordSchemaType,
} from "@/lib/helper/validation/change-password-schema";
import {
  resetEmailSchema,
  resetEmailSchemaType,
} from "@/lib/helper/validation/change-email-schema";

export default function ProfilePage() {
  const { isLoggedIn, email: authEmail, profile_picture, userId } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);

  // Email form
  const {
    register: registerEmail,
    handleSubmit: handleEmailSubmit,
    formState: { errors: emailErrors, isSubmitting: isUpdatingEmail },
    setValue: setEmailValue,
    watch: watchEmail,
  } = useForm<resetEmailSchemaType>({
    resolver: zodResolver(resetEmailSchema),
    defaultValues: {
      email: authEmail || "",
    },
    mode: "onChange",
  });

  // Password form
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors, isSubmitting: isUpdatingPassword },
    reset: resetPasswordForm,
    watch: watchPassword,
  } = useForm<resetPasswordSchemaType>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      currentPassword: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const watchedNewPassword = watchPassword("password");

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login?redirect=/profile");
      return;
    }

    fetchUserData();
  }, [isLoggedIn, router, userId]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/profile?userId=${userId}`);

      if (!response.ok) {
        setEmailValue("email", authEmail || "");
        setProfilePicture(profile_picture || null);
        setLoading(false);
        return;
      }

      const data = await response.json();

      if (data.success) {
        setUserData(data.data);
        setEmailValue("email", data.data.email || authEmail);
        setProfilePicture(data.data.profile_picture || profile_picture);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setEmailValue("email", authEmail || "");
      setProfilePicture(profile_picture || null);
    } finally {
      setLoading(false);
    }
  };
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userId) return;
  
    const allowedTypes = ["image/jpeg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Invalid file type. Please upload jpeg or png images.");
      return;
    }
  
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size too large. Maximum size is 5MB.");
      return;
    }
  
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", userId.toString());
  
    try {
      const response = await fetch("/api/profile/upload", {
        method: "POST",
        body: formData,
      });
  
      const data = await response.json();
      console.log("Upload API response:", data); // Add this
  
      if (data.success) {
        const uploadedUrl = data.data.url || data.data.secure_url;
        console.log("Uploaded URL:", uploadedUrl); // Add this
        setProfilePicture(uploadedUrl);
        toast.success("Profile picture updated successfully!");
        
        // Force a small delay before fetching to ensure DB is updated
        setTimeout(() => {
          fetchUserData();
        }, 500);
      } else {
        toast.error(data.error || "Failed to upload image");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const onEmailSubmit = async (data: resetEmailSchemaType) => {
    if (!userId) return;

    // Don't update if email hasn't changed
    if (data.email === authEmail) {
      toast.error("No changes to update");
      return;
    }

    try {
      const response = await fetch("/api/profile/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          email: data.email,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Email updated successfully!");
        fetchUserData();
      } else {
        toast.error(result.error || "Failed to update email");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update email");
    }
  };

  const onPasswordSubmit = async (data: resetPasswordSchemaType) => {
    if (!userId) return;

    try {
      const response = await fetch("/api/profile/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          currentPassword: data.currentPassword,
          newPassword: data.password,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Password updated successfully!");
        resetPasswordForm();
      } else {
        toast.error(result.error || "Failed to update password");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update password");
    }
  };

  // Helper function to render password requirements with real-time feedback
  const PasswordRequirements = () => {
    const password = watchedNewPassword || "";

    const requirements = [
      { text: "At least 8 characters", met: password.length >= 8 },
      { text: "One uppercase letter (A-Z)", met: /[A-Z]/.test(password) },
      { text: "One lowercase letter (a-z)", met: /[a-z]/.test(password) },
      { text: "One number (0-9)", met: /[0-9]/.test(password) },
      { text: "One special character", met: /[^A-Za-z0-9]/.test(password) },
      { text: "No spaces", met: !password.includes(" ") },
    ];

    return (
      <div className="text-sm space-y-1 mt-4">
        <p className="font-medium text-gray-700 mb-2">Password Requirements:</p>
        <ul className="space-y-1">
          {requirements.map((req, index) => (
            <li
              key={index}
              className={`flex items-center gap-2 ${
                req.met ? "text-green-600" : "text-gray-600"
              }`}
            >
              <div
                className={`h-2 w-2 rounded-full ${
                  req.met ? "bg-green-500" : "bg-gray-300"
                }`}
              />
              <span>{req.text}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
      </div>
    );
  }

  const currentEmail = watchEmail("email");
  const isEmailChanged = currentEmail !== authEmail;

  return (
    <div className="min-h-screen bg-amber-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-amber-900 mb-8">My Profile</h1>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Column - Profile Picture */}
          <div className="md:col-span-1">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    {profilePicture ? (
                      <img
                        src={profilePicture}
                        alt="Profile"
                        className="h-48 w-48 rounded-full object-cover border-4 border-amber-200"
                      />
                    ) : (
                      <div className="h-48 w-48 rounded-full bg-gray-100 border-4 border-amber-200 flex items-center justify-center">
                        <User className="h-20 w-20 text-gray-400" />
                      </div>
                    )}
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-gray-600">{currentEmail}</p>
                  </div>

                  <div className="w-full">
                    <Label
                      htmlFor="profile-upload"
                      className="cursor-pointer flex justify-center"
                    >
                      <div className="flex items-center justify-center gap-2 bg-amber-100 text-amber-700 hover:bg-amber-200 px-4 py-2 rounded-md transition-colors">
                        <Upload className="h-4 w-4" />
                        {uploading ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          "Change Picture"
                        )}
                      </div>
                    </Label>
                    <Input
                      id="profile-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                      disabled={uploading}
                    />
                    <p className="text-xs text-gray-500 text-center mt-2">
                      JPEG, PNG (max 5MB)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Profile Settings */}
          <div className="md:col-span-2">
            <Tabs defaultValue="account" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger
                  value="account"
                  className="flex items-center gap-2"
                >
                  <User className="h-4 w-4" />
                  Account
                </TabsTrigger>
                <TabsTrigger
                  value="security"
                  className="flex items-center gap-2"
                >
                  <Lock className="h-4 w-4" />
                  Security
                </TabsTrigger>
              </TabsList>

              {/* Email Tab */}
              {/* Email Tab */}
              <TabsContent value="account">
                <form onSubmit={handleEmailSubmit(onEmailSubmit)}>
                  <Card>
                    <CardHeader>
                      <CardTitle>Account Information</CardTitle>
                      <CardDescription>
                        Update your account details
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <div className="relative">
                          <Mail className="h-4 w-4 text-gray-400 absolute left-3 top-3 z-10" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="your@email.com"
                            {...registerEmail("email")}
                            className="pl-10"
                          />
                          {emailErrors.email && (
                            <AlertCircle className="h-4 w-4 text-red-500 absolute right-3 top-3" />
                          )}
                        </div>
                        {emailErrors.email && (
                          <p className="text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {emailErrors.email.message}
                          </p>
                        )}
                        {isEmailChanged && (
                          <p className="text-xs text-amber-600">
                            Note: Changing your email will require verification.
                          </p>
                        )}
                      </div>

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
              </TabsContent>

              {/* Password Tab */}
              <TabsContent value="security">
                <form onSubmit={handlePasswordSubmit(onPasswordSubmit)}>
                  <Card>
                    <CardHeader>
                      <CardTitle>Change Password</CardTitle>
                      <CardDescription>
                        Update your password to keep your account secure
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Current Password */}
                      <div className="space-y-2">
                        <Label htmlFor="current-password">
                          Current Password
                        </Label>
                        <div className="relative">
                          <Lock className="h-4 w-4 text-gray-400 absolute left-3 top-3 z-10" />
                          <Input
                            id="current-password"
                            type="password"
                            placeholder="Enter current password"
                            {...registerPassword("currentPassword")}
                            className="pl-10"
                          />
                          {passwordErrors.currentPassword && (
                            <AlertCircle className="h-4 w-4 text-red-500 absolute right-3 top-3" />
                          )}
                        </div>
                        {passwordErrors.currentPassword && (
                          <p className="text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {passwordErrors.currentPassword.message}
                          </p>
                        )}
                      </div>

                      {/* New Password */}
                      <div className="space-y-2">
                        <Label htmlFor="password">New Password</Label>
                        <div className="relative">
                          <Input
                            id="password"
                            type="password"
                            placeholder="Enter new password"
                            {...registerPassword("password")}
                          />
                          {passwordErrors.password && (
                            <AlertCircle className="h-4 w-4 text-red-500 absolute right-3 top-3" />
                          )}
                        </div>
                        {passwordErrors.password &&
                          passwordErrors.password.message && (
                            <p className="text-sm text-red-600 flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {passwordErrors.password.message}
                            </p>
                          )}
                      </div>

                      {/* Confirm Password */}
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">
                          Confirm New Password
                        </Label>
                        <div className="relative">
                          <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="Confirm new password"
                            {...registerPassword("confirmPassword")}
                          />
                          {passwordErrors.confirmPassword && (
                            <AlertCircle className="h-4 w-4 text-red-500 absolute right-3 top-3" />
                          )}
                        </div>
                        {passwordErrors.confirmPassword &&
                          passwordErrors.confirmPassword.message && (
                            <p className="text-sm text-red-600 flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {passwordErrors.confirmPassword.message}
                            </p>
                          )}
                      </div>

                      {/* Password Requirements */}
                      {watchedNewPassword && <PasswordRequirements />}

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
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
