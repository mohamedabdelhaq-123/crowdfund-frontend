import { useRef, useState, useEffect } from 'react';
import { useUpdateProfile } from '../../hooks/useProfileApi';
import type { UpdateProfileData, UserProfile } from '../../types/profile';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { checkAuth } from '../../store/slices/authSlice';
import type { AppDispatch } from '../../store/store';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

export default function EditProfileForm({ profile }: { profile: UserProfile }) {
  const dispatch = useDispatch<AppDispatch>();
  const updateProfile = useUpdateProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(profile.profile_pic || null);
  const [formData, setFormData] = useState<UpdateProfileData>({
    first_name: profile.first_name,
    last_name: profile.last_name,
    mobile_number: profile.mobile_number,
    birthdate: profile.birthdate || '',
    fb_profile: profile.fb_profile || '',
    country: profile.country || '',
  });

  useEffect(() => {
    setFormData({
      first_name: profile.first_name,
      last_name: profile.last_name,
      mobile_number: profile.mobile_number,
      birthdate: profile.birthdate || '',
      fb_profile: profile.fb_profile || '',
      country: profile.country || '',
    });
    setAvatarPreview(profile.profile_pic || null);
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, profile_pic: file });
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile.mutateAsync(formData);
      await dispatch(checkAuth()).unwrap();
      toast.success('Profile updated successfully!');
    } catch {
      toast.error('Failed to update profile.');
    }
  };

  return (
    <div className="max-w-3xl bg-surface-container-lowest rounded-[2rem] p-8 md:p-12 shadow-sm border border-outline-variant/10">
      <h2 className="text-3xl font-headline font-black tracking-tight text-on-surface mb-8">Personal Information</h2>

      <div className="flex items-center gap-6 mb-10">
        <div
          onClick={() => fileInputRef.current?.click()}
          className="h-20 w-20 rounded-full overflow-hidden cursor-pointer group relative bg-surface-container-low flex-shrink-0"
        >
          {avatarPreview ? (
            <>
              <img src={avatarPreview} alt="Avatar" className="h-full w-full object-cover group-hover:opacity-40 transition-opacity" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-on-surface">edit</span>
              </div>
            </>
          ) : (
            <div className="h-full w-full signature-gradient flex items-center justify-center text-on-primary group-hover:opacity-80 transition-opacity">
              <span className="material-symbols-outlined text-2xl">add_a_photo</span>
            </div>
          )}
        </div>
        <div>
          <p className="font-headline font-bold text-on-surface text-sm">Profile Photo</p>
          <p className="text-on-surface-variant text-xs">Click to change your avatar</p>
        </div>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label="First Name" name="first_name" value={formData.first_name} onChange={handleChange} />
          <Input label="Last Name" name="last_name" value={formData.last_name} onChange={handleChange} />
          <Input label="Phone Number" name="mobile_number" type="tel" value={formData.mobile_number} onChange={handleChange} />
          <Input label="Birthdate" name="birthdate" type="date" value={formData.birthdate} onChange={handleChange} />
        </div>

        <Input label="Country" name="country" value={formData.country} onChange={handleChange} placeholder="Egypt" />

        <div className="space-y-2">
          <Input label="Email Address" name="email" value={profile.email} disabled={true} />
          <p className="text-[10px] text-on-surface-variant ml-2">Email cannot be changed.</p>
        </div>

        <Input label="Facebook Profile" name="fb_profile" type="url" value={formData.fb_profile} onChange={handleChange} placeholder="https://facebook.com/username" />

        <div className="pt-4 flex flex-col md:flex-row gap-4 items-center justify-between">
          <Button
            type="submit"
            isLoading={updateProfile.isPending}
            className="w-full md:w-auto shadow-primary/20 shadow-lg"
          >
            {updateProfile.isPending ? 'Saving...' : 'Save Profile Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
}
