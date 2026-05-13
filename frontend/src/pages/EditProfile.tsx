import { useEffect, useRef, useState } from "react";
import MaterialIcon from "../components/ui/MaterialIcon";
import { useHomigoAuth } from "../components/auth/AuthContext";
import { api } from "../lib/api";

type PageProps = { onNavigate: (page: string) => void };

export default function EditProfile({ onNavigate }: PageProps) {
  const { userId, userProfile } = useHomigoAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [photo, setPhoto] = useState<string | undefined>();
  
  // Lifestyle preferences
  const [smoking, setSmoking] = useState(false);
  const [drinking, setDrinking] = useState(false);
  const [sleepSchedule, setSleepSchedule] = useState("flexible");
  const [cleanliness, setCleanliness] = useState("3");
  
  // Roommate preferences
  const [preferredGender, setPreferredGender] = useState("any");
  const [minAge, setMinAge] = useState(18);
  const [maxAge, setMaxAge] = useState(50);
  const [petFriendly, setPetFriendly] = useState(false);
  const [additionalNotes, setAdditionalNotes] = useState("");
  
  // Preferred locations
  const [locations, setLocations] = useState<string[]>([]);
  const [newLocation, setNewLocation] = useState("");
  
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    api.getUserDetails(userId).then((res: any) => {
      const data = res?.data;
      setEmail(data?.basic_info?.email || userProfile?.email || "");
      setFullName(data?.basic_info?.full_name || "");
      setPhone(data?.basic_info?.phone || "");
      setBio(data?.seeker_profile?.bio || data?.owner_profile?.bio || "");
      setPhoto(data?.basic_info?.profile_photo || userProfile?.imageUrl);
      
      // Lifestyle
      const lifestyle = data?.seeker_profile?.lifestyle_preferences || {};
      const smokingVal = String(lifestyle.smoking || "").toLowerCase();
      const drinkingVal = String(lifestyle.drinking || "").toLowerCase();
      setSmoking(smokingVal === "yes" || smokingVal === "true" || smokingVal === "occasionally");
      setDrinking(drinkingVal === "yes" || drinkingVal === "true" || drinkingVal === "occasionally");
      setSleepSchedule(lifestyle.sleep_schedule || "flexible");
      setCleanliness(String(lifestyle.cleanliness || "3"));
      
      // Roommate preferences
      const roommate = data?.seeker_profile?.roommate_preferences || {};
      setPreferredGender(roommate.preferred_gender || "any");
      setMinAge(roommate.age_range?.min || 18);
      setMaxAge(roommate.age_range?.max || 50);
      setPetFriendly(roommate.pet_friendly || false);
      setAdditionalNotes(roommate.additional_notes || "");
      
      // Locations
      const locs = data?.seeker_profile?.preferred_locations || [];
      setLocations(locs.map((l: any) => l.location_name).filter(Boolean));
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

  const addLocation = () => {
    if (newLocation.trim() && !locations.includes(newLocation.trim())) {
      setLocations([...locations, newLocation.trim()]);
      setNewLocation("");
    }
  };

  const removeLocation = (loc: string) => {
    setLocations(locations.filter(l => l !== loc));
  };

  const handleSave = async () => {
    if (!email.trim()) {
      alert("Email is required");
      return;
    }
    
    console.log("[EditProfile] Saving profile with full_name:", fullName.trim());
    
    setSaving(true);
    try {
      const payload = {
        user_id: userId,
        basic_info: {
          email: email.trim(),
          full_name: fullName.trim(),
          phone: phone.trim(),
          profile_photo: photo,
        },
        seeker_profile: {
          bio: bio.trim() || null,
          lifestyle_preferences: {
            smoking: smoking ? "yes" : "no",
            drinking: drinking ? "yes" : "no",
            sleep_schedule: sleepSchedule,
            cleanliness: cleanliness,
          },
          roommate_preferences: {
            preferred_gender: preferredGender,
            age_range: { min: minAge, max: maxAge },
            pet_friendly: petFriendly,
            additional_notes: additionalNotes.trim() || null,
          },
          preferred_locations: locations.map((loc, idx) => ({
            location_name: loc,
            priority: idx + 1,
          })),
        },
      };
      
      console.log("[EditProfile] Payload:", JSON.stringify(payload, null, 2));
      
      const response = await api.saveUserProfile(payload);
      
      console.log("[EditProfile] Save response:", response);
      
      onNavigate("profile");
    } catch (err) {
      console.error("[EditProfile] Save error:", err);
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

          {/* Lifestyle Preferences */}
          <div className="space-y-4 rounded-xl bg-surface-container-low p-4">
            <h3 className="font-headline text-lg font-bold">Lifestyle Preferences</h3>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={smoking}
                  onChange={(e) => setSmoking(e.target.checked)}
                  className="h-5 w-5"
                />
                <span className="text-sm font-semibold">Smoker</span>
              </label>
              
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={drinking}
                  onChange={(e) => setDrinking(e.target.checked)}
                  className="h-5 w-5"
                />
                <span className="text-sm font-semibold">Social Drinker</span>
              </label>
              
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={petFriendly}
                  onChange={(e) => setPetFriendly(e.target.checked)}
                  className="h-5 w-5"
                />
                <span className="text-sm font-semibold">Pet-friendly</span>
              </label>
            </div>

            <label className="block space-y-2">
              <span className="text-sm font-semibold text-on-surface-variant">Sleep Schedule</span>
              <select
                value={sleepSchedule}
                onChange={(e) => setSleepSchedule(e.target.value)}
                className="w-full"
              >
                <option value="early_bird">Early Bird</option>
                <option value="night_owl">Night Owl</option>
                <option value="flexible">Flexible</option>
              </select>
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-semibold text-on-surface-variant">Cleanliness Level</span>
              <select
                value={cleanliness}
                onChange={(e) => setCleanliness(e.target.value)}
                className="w-full"
              >
                <option value="5">Very Tidy</option>
                <option value="3">Moderately Tidy</option>
                <option value="1">Relaxed</option>
              </select>
            </label>
          </div>

          {/* Roommate Preferences */}
          <div className="space-y-4 rounded-xl bg-surface-container-low p-4">
            <h3 className="font-headline text-lg font-bold">Roommate Preferences</h3>
            
            <label className="block space-y-2">
              <span className="text-sm font-semibold text-on-surface-variant">Preferred Gender</span>
              <select
                value={preferredGender}
                onChange={(e) => setPreferredGender(e.target.value)}
                className="w-full"
              >
                <option value="any">Any</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block space-y-2">
                <span className="text-sm font-semibold text-on-surface-variant">Min Age</span>
                <input
                  type="number"
                  value={minAge}
                  onChange={(e) => setMinAge(Number(e.target.value))}
                  min="18"
                  max="100"
                  className="w-full"
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-semibold text-on-surface-variant">Max Age</span>
                <input
                  type="number"
                  value={maxAge}
                  onChange={(e) => setMaxAge(Number(e.target.value))}
                  min="18"
                  max="100"
                  className="w-full"
                />
              </label>
            </div>

            <label className="block space-y-2">
              <span className="text-sm font-semibold text-on-surface-variant">Additional Notes</span>
              <textarea
                rows={3}
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                placeholder="Any specific requirements or preferences..."
                className="w-full"
              />
            </label>
          </div>

          {/* Preferred Locations */}
          <div className="space-y-4 rounded-xl bg-surface-container-low p-4">
            <h3 className="font-headline text-lg font-bold">Preferred Locations</h3>
            
            <div className="flex gap-2">
              <input
                type="text"
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addLocation())}
                placeholder="Add a location..."
                className="flex-1"
              />
              <button
                type="button"
                onClick={addLocation}
                className="btn-tonal"
              >
                <MaterialIcon name="add" />
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {locations.map((loc) => (
                <span
                  key={loc}
                  className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary"
                >
                  <MaterialIcon name="location_on" className="text-sm" />
                  {loc}
                  <button
                    type="button"
                    onClick={() => removeLocation(loc)}
                    className="ml-1 hover:text-error"
                  >
                    <MaterialIcon name="close" className="text-sm" />
                  </button>
                </span>
              ))}
            </div>
          </div>

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
