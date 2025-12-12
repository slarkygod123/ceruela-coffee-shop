import { User, Upload, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ProfilePictureUploadProps {
  profilePicture: string | null;
  uploading: boolean;
  currentEmail: string;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ProfilePictureUpload({
  profilePicture,
  uploading,
  currentEmail,
  onImageUpload,
}: ProfilePictureUploadProps) {
  return (
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
        <Label htmlFor="profile-upload" className="cursor-pointer flex justify-center">
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
          onChange={onImageUpload}
          disabled={uploading}
        />
        <p className="text-xs text-gray-500 text-center mt-2">
          JPEG, PNG (max 5MB)
        </p>
      </div>
    </div>
  );
}