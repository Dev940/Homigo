import { useEffect, useRef, useState } from "react";
import MaterialIcon from "../components/ui/MaterialIcon";
import { useHomigoAuth } from "../components/auth/AuthContext";
import { api } from "../lib/api";

type PageProps = { onNavigate: (page: string) => void };

export default function EditProfile({ onNavigate }: PageProps) {
  const { userId, userProfile } = useHomigoAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [photo, setPhoto] = useState<string | undefined>();
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    api.getUserDetails(userId).then((res: any) => {
      const data = res?.data;
      setFullName(data?.basic_info?.full_name || "");
      setPhone(data?.basic_info?.phone || "");
      setBio(data?.seeker_profile?.bio || data?.owner_profile?.bio || "");
      setPhoto(data?.basic_info?.profile_photo || userProfile?.imageUrl);
    }).catch(() => {});
  }, [userId, userProfile]);

  const handleFile = async (file?: File) => {
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    const localPreview = URL.createObjectURL(file);
    setPhoto(localPreview);
    try {
      const cloudinaryUrl = await api.uploadImage(file, "homigo/profiles");
      setPhoto(cloudinaryUrl);
    } catch {
      setUploadError("Upload failed — please try again.");
      setPhoto(photo);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.saveUserProfile({
        user_id: userId,
        basic_info: {
          full_name: fullName.trim(),
          phone: phone.trim(),
          profile_photo: photo,
        },
        seeker_profile: bio.trim() ? { bio: bio.trim() } : undefined,
      });
      onNavigate("profile");
    } catch {
      alert("Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-container-low pt-16">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-6 flex items-center gap-4">
          <button onClick={() => onNavigate("profile")} className="btn-tonal flex h-10 w-10 items-center justify-center rounded-full p-0">
            <MaterialIcon name="arrow_back" />
          </button>
          <h1 className="font-headline text-3xl font-extrabold">Edit Profile</h1>
        </div>

        <div className="card space-y-6">
          {/* Profile Photo */}
          <div>
            <label className="mb-3 block text-sm font-semibold text-on-surface-variant">Profile Photo</label>
            <div className="flex items-center gap-6">
              <div className="relative">
                {photo ? (
                  <img src={photo} alt="Profile" className="h-24 w-24 rounded-full object-cover ring-4 ring-surface-container" />
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
                    <MaterialIcon name="person" className="text-4xl text-primary" fill />
                  </div>
                )}
                {uploading && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40">
                    <MaterialIcon name="sync" className="animate-spin text-xl text-white" />
                  </div>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  disabled={uploading}
                  className="btn-tonal"
                >
                  <MaterialIcon name="upload" className="text-lg" />
                  {uploading ? "Uploading..." : "Change Photo"}
                </button>
                {photo && (
                  <button
                    type="button"
                    onClick={() => setPhoto(undefined)}
                    disabled={uploading}
                    className="btn-outlined text-error"
                  >
                    <MaterialIcon name="delete" className="text-lg" />
                    Remove
                  </button>
                )}
              </div>
            </div>
            {uploadError && <p className="mt-2 text-xs font-semibold text-error">{uploadError}</p>}
            <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
          </div>

          {/* Full Name */}
          <label className="block space-y-2">
            <span className="text-sm font-semibold text-on-surface-variant">Full Name</span>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full"
            />
          </label>

          {/* Phone */}
          <label className="block space-y-2">
            <span className="text-sm font-semibold text-on-surface-variant">Phone Number</span>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full"
            />
          </label>

          {/* Bio */}
          <label className="block space-y-2">
            <span className="text-sm font-semibold text-on-surface-variant">Bio</span>
            <textarea
              rows={5}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself..."
              className="w-full"
            />
          </label>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => onNavigate("profile")}
              className="btn-outlined"
              disabled={saving || uploading}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="btn-primary"
              disabled={saving || uploading}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
