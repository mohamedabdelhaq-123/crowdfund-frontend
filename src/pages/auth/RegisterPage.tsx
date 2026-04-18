import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { useState, useRef } from 'react';
import { Users, Camera } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/client';
import { registerSchema, RegisterFormData } from '../../validation/authSchema';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [profilePicPreview, setProfilePicPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast.error('Only JPG, PNG, or WebP images are allowed.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5 MB.');
      return;
    }

    setSelectedFile(file);
    setProfilePicPreview(URL.createObjectURL(file)); // preview URL
  };

  // builds FormData so the file is sent as multipart
  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);

    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          formData.append(key, value);
        }
      });
      if (selectedFile) {
        formData.append('profile_pic', selectedFile);
      }

      const response = await api.post('/auth/register/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success(response.data.message || 'Registration successful! Check your email.');
      navigate('/login');
    } catch (error: any) {
      if (error.response?.data) {
        const backendErrors = error.response.data;
        Object.entries(backendErrors).forEach(([field, message]) => {
          setError(field as keyof RegisterFormData, {
            type: 'manual',
            message: Array.isArray(message) ? message[0] : message as string,
          });
        });
        toast.error('Please check the form for errors.');
      } else {
        toast.error('Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <main>
        <div className="flex flex-col md:flex-row min-h-screen">
          <div className="hidden md:flex md:w-1/2 bg-surface-container-low relative overflow-hidden items-center justify-center p-12">
            <div className="absolute inset-0 z-0">
              <div className="w-full h-full bg-gradient-to-br from-primary-container/20 to-tertiary-container/20" />
            </div>
            <div className="relative z-10 max-w-lg text-center">
              <div className="mb-8 flex justify-center">
                <div className="w-24 h-24 signature-gradient rounded-3xl flex items-center justify-center shadow-2xl rotate-3">
                  <Users className="text-white w-12 h-12" />
                </div>
              </div>
              <h1 className="font-headline text-5xl font-extrabold text-on-surface tracking-tight mb-6">
                Empower the next <span className="text-primary italic">Egyptian</span> success story.
              </h1>
              <p className="text-lg text-on-surface-variant leading-relaxed mb-8 font-body">
                Connect with local innovators and help turn visionary dreams into reality through community-driven crowdfunding.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm text-left">
                  <span className="text-primary font-headline text-3xl font-bold block mb-1">500+</span>
                  <span className="text-sm font-label text-on-surface-variant uppercase tracking-wider">
                    Projects Funded
                  </span>
                </div>
                <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm text-left">
                  <span className="text-primary font-headline text-3xl font-bold block mb-1">EGP 20M</span>
                  <span className="text-sm font-label text-on-surface-variant uppercase tracking-wider">
                    Raised Locally
                  </span>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-primary-container/20 rounded-full blur-3xl"></div>
          </div>

          <div className="w-full md:w-1/2 bg-surface-container-lowest flex items-center justify-center p-6 md:p-12 lg:p-20">
            <div className="w-full max-w-md">
              <div className="bg-surface-container-low p-1.5 rounded-xl flex mb-10">
                <button className="flex-1 py-3 text-sm font-headline font-bold rounded-lg bg-surface-container-lowest text-on-surface shadow-sm transition-all">
                  Register
                </button>
                <Link 
                  to="/login"
                  className="flex-1 py-3 text-sm font-headline font-semibold text-on-surface-variant hover:text-on-surface transition-all text-center"
                >
                  Login
                </Link>
              </div>

              <header className="mb-8">
                <h2 className="text-3xl font-headline font-extrabold text-on-surface mb-2">
                  Create your account
                </h2>
                <p className="text-on-surface-variant">
                  Start your journey with FundEgypt today.
                </p>
              </header>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-label font-bold text-on-surface-variant uppercase tracking-wider ml-1">
                      First Name
                    </label>
                    <input
                      className={`w-full px-4 py-3.5 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary/40 focus:bg-surface-container-lowest transition-all placeholder:text-outline-variant ${errors.first_name ? 'ring-2 ring-error' : ''}`}
                      placeholder="Ahmed"
                      type="text"
                      {...register('first_name')}
                    />
                    {errors.first_name && (
                      <p className="text-xs text-error mt-1 ml-1">{errors.first_name.message}</p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-label font-bold text-on-surface-variant uppercase tracking-wider ml-1">
                      Last Name
                    </label>
                    <input
                      className={`w-full px-4 py-3.5 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary/40 focus:bg-surface-container-lowest transition-all placeholder:text-outline-variant ${errors.last_name ? 'ring-2 ring-error' : ''}`}
                      placeholder="Mansour"
                      type="text"
                      {...register('last_name')}
                    />
                    {errors.last_name && (
                      <p className="text-xs text-error mt-1 ml-1">{errors.last_name.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-label font-bold text-on-surface-variant uppercase tracking-wider ml-1">
                    Email Address
                  </label>
                  <input
                    className={`w-full px-4 py-3.5 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary/40 focus:bg-surface-container-lowest transition-all placeholder:text-outline-variant ${errors.email ? 'ring-2 ring-error' : ''}`}
                    placeholder="ahmed@example.com"
                    type="email"
                    {...register('email')}
                  />
                  {errors.email && (
                    <p className="text-xs text-error mt-1 ml-1">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-label font-bold text-on-surface-variant uppercase tracking-wider ml-1">
                    Mobile Number
                  </label>
                  <div className="flex">
                    <span className="flex items-center px-4 bg-surface-container-high rounded-l-xl text-on-surface font-semibold text-sm">
                      +20
                    </span>
                    <input
                      className={`flex-1 px-4 py-3.5 bg-surface-container-low border-none rounded-r-xl focus:ring-2 focus:ring-primary/40 focus:bg-surface-container-lowest transition-all placeholder:text-outline-variant ${errors.mobile_number ? 'ring-2 ring-error' : ''}`}
                      placeholder="10 1234 5678"
                      type="tel"
                      {...register('mobile_number')}
                    />
                  </div>
                  {errors.mobile_number && (
                    <p className="text-xs text-error mt-1 ml-1">{errors.mobile_number.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-label font-bold text-on-surface-variant uppercase tracking-wider ml-1">
                      Password
                    </label>
                    <input
                      className={`w-full px-4 py-3.5 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary/40 focus:bg-surface-container-lowest transition-all placeholder:text-outline-variant ${errors.password ? 'ring-2 ring-error' : ''}`}
                      placeholder="••••••••"
                      type="password"
                      {...register('password')}
                    />
                    {errors.password && (
                      <p className="text-xs text-error mt-1 ml-1">{errors.password.message}</p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-label font-bold text-on-surface-variant uppercase tracking-wider ml-1">
                      Confirm
                    </label>
                    <input
                      className={`w-full px-4 py-3.5 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary/40 focus:bg-surface-container-lowest transition-all placeholder:text-outline-variant ${errors.confirm_password ? 'ring-2 ring-error' : ''}`}
                      placeholder="••••••••"
                      type="password"
                      {...register('confirm_password')}
                    />
                    {errors.confirm_password && (
                      <p className="text-xs text-error mt-1 ml-1">{errors.confirm_password.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-label font-bold text-on-surface-variant uppercase tracking-wider ml-1">
                    Profile Picture
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-outline-variant/30 rounded-2xl p-6 bg-surface-container-low/30 hover:bg-surface-container-low transition-colors group cursor-pointer text-center"
                  >
                    {profilePicPreview ? (
                      <div className="flex flex-col items-center gap-2">
                        <img
                          src={profilePicPreview}
                          alt="Preview"
                          className="w-20 h-20 rounded-full object-cover ring-2 ring-primary/30"
                        />
                        <p className="text-xs text-on-surface-variant">
                          Click to change
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <Camera className="text-outline-variant group-hover:text-primary transition-colors mb-2 w-8 h-8" />
                        <p className="text-sm font-medium text-on-surface-variant">
                          Drag and drop or <span className="text-primary font-bold">browse</span>
                        </p>
                        <p className="text-[10px] text-outline mt-1 uppercase tracking-tighter">
                          JPG, PNG (Max 5MB)
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full signature-gradient text-on-primary py-4 rounded-xl font-headline font-bold text-lg shadow-lg shadow-primary/20 active:scale-[0.98] transition-all mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </button>



              </form>

              <footer className="mt-8 text-center">
                <p className="text-sm text-on-surface-variant font-medium">
                  Already have an account?{' '}
                  <Link className="text-primary font-bold hover:underline" to="/login">
                    Sign In
                  </Link>
                </p>
              </footer>
            </div>
          </div>
        </div>
      </main>


    </>
  );
};

export default RegisterPage;