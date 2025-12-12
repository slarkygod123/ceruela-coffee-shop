"use client"
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { resetPasswordSchema, resetPasswordSchemaType } from "@/lib/helper/validation/change-password-schema";
import { resetEmailSchema, resetEmailSchemaType } from "@/lib/helper/validation/change-email-schema";

interface UseProfileProps {
  isLoggedIn: boolean;
  authEmail: string | null;
  userId: number | null;
  profile_picture: string | null;
}

export function useProfile({ isLoggedIn, authEmail, userId, profile_picture }: UseProfileProps) {
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
    defaultValues: { email: authEmail || "" },
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
  const currentEmail = watchEmail("email");

  const fetchUserData = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

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
      } else {
        // If API returns success: false
        setEmailValue("email", authEmail || "");
        setProfilePicture(profile_picture || null);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setEmailValue("email", authEmail || "");
      setProfilePicture(profile_picture || null);
    } finally {
      setLoading(false);
    }
  };

  // Add useEffect to fetch data when component mounts
  useEffect(() => {
    if (isLoggedIn && userId) {
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, [isLoggedIn, userId]); // Only depend on isLoggedIn and userId

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

      if (data.success) {
        const uploadedUrl = data.data.url || data.data.secure_url;
        setProfilePicture(uploadedUrl);
        toast.success("Profile picture updated successfully!");
        
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

    if (data.email === authEmail) {
      toast.error("No changes to update");
      return;
    }

    try {
      const response = await fetch("/api/profile/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, email: data.email }),
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
        headers: { "Content-Type": "application/json" },
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

  return {
    loading,
    uploading,
    profilePicture,
    currentEmail,
    watchedNewPassword,
    isEmailChanged: currentEmail !== authEmail,
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
    fetchUserData,
  };
}