import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AlertCircle, Clock, MailWarning } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/client';
import { loginSchema, LoginFormData } from '../../validation/authSchema';
import { setCredentials } from '../../store/slices/authSlice';
import type { AppDispatch } from '../../store/store';
import { useSearchParams } from 'react-router-dom';


const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState(false);

  const [showResend, setShowResend] = useState(false);
  const [resendEmail, setResendEmail] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);


  const [searchParams] = useSearchParams();
  const sessionExpired = searchParams.get('reason') === 'session_expired';
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setShowResend(false); // reset resend state on every new attempt

    try {
      await api.post('/auth/login/', data);

      // when cookies are set =>fetch user data and update Redux store
      const meRes = await api.get('/auth/me/');
      dispatch(setCredentials(meRes.data));

      toast.success('Welcome back!');
      navigate('/'); // redirect to homepage on success
    } catch (error: any) {
      const res = error.response;

      if (res?.data?.not_activated) {
        // account exists + correct password but not activated
        setShowResend(true);
        setResendEmail(data.email);
        setError('root', {
          type: 'manual',
          message: 'Your account is not activated. Check your email or resend the activation link below.',
        });
      } else if (res?.data) {
        // wrong email or password (generic message)
        const msg =
          res.data.error?.[0] ||
          res.data.error ||
          res.data.non_field_errors?.[0] ||
          'Invalid email or password.';
        setError('root', { type: 'manual', message: msg });
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    try {
      await api.post('/auth/resend-activation/', { email: resendEmail });
      toast.success('Activation email sent! Check your inbox.');

      setResendCooldown(120);       // start a 120-second cooldown to match the backend's 2-minute cooldown
      const interval = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error: any) {
      const msg = error.response?.data?.error || 'Could not resend. Please try again later.';
      toast.error(msg);
    } finally {
      setResendLoading(false);
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
                <div className="w-24 h-24 signature-gradient rounded-3xl flex items-center justify-center shadow-2xl -rotate-3">
                  <MailWarning className="w-12 h-12 text-white" strokeWidth={2.25} />
                </div>
              </div>
              <h1 className="font-headline text-5xl font-extrabold text-on-surface tracking-tight mb-6">
                Welcome back, <span className="text-primary italic">changemaker</span>.
              </h1>
              <p className="text-lg text-on-surface-variant leading-relaxed mb-8 font-body">
                Sign in to join a community that’s building Egypt’s future—one idea at a time.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm text-left">
                  <span className="text-primary font-headline text-3xl font-bold block mb-1">Real Stories</span>
                  <span className="text-sm font-label text-on-surface-variant uppercase tracking-wider">
                    See the difference you make
                  </span>
                </div>
                <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm text-left">
                  <span className="text-primary font-headline text-3xl font-bold block mb-1">Project First</span>
                  <span className="text-sm font-label text-on-surface-variant uppercase tracking-wider">
                    Every click fuels a vision
                  </span>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-tertiary-container/20 rounded-full blur-3xl"></div>
          </div>

          <div className="w-full md:w-1/2 bg-surface-container-lowest flex items-center justify-center p-6 md:p-12 lg:p-20">
            <div className="w-full max-w-md">
              <div className="bg-surface-container-low p-1.5 rounded-xl flex mb-10">
                <Link
                  to="/register"
                  className="flex-1 py-3 text-sm font-headline font-semibold text-on-surface-variant hover:text-on-surface transition-all text-center"
                >
                  Register
                </Link>
                <button className="flex-1 py-3 text-sm font-headline font-bold rounded-lg bg-surface-container-lowest text-on-surface shadow-sm transition-all">
                  Login
                </button>
              </div>

              <header className="mb-8">
                <h2 className="text-3xl font-headline font-extrabold text-on-surface mb-2">
                  Sign in to your account
                </h2>
                <p className="text-on-surface-variant">
                  Enter your credentials to access FundEgypt.
                </p>
              </header>

                {sessionExpired && (
                <div className="bg-tertiary-container/30 p-4 rounded-xl text-sm flex items-center gap-3 mb-4">
                  <Clock className="w-5 h-5 shrink-0" />
                  <span>Your session expired. Please log in again.</span>
                </div>
                )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {errors.root && (
                  <div
                    className={`p-4 rounded-xl text-sm font-medium ${
                      showResend
                        ? 'bg-tertiary-container/30 text-on-tertiary-container'
                        : 'bg-error-container/30 text-on-error-container'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {showResend ? (
                        <MailWarning className="w-5 h-5 mt-0.5 shrink-0" />
                      ) : (
                        <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
                      )}
                      <span>{errors.root.message}</span>
                    </div>
                  </div>
                )}

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
                  <div className="ml-1 mr-1">
                    <label className="text-xs font-label font-bold text-on-surface-variant uppercase tracking-wider">
                      Password
                    </label>
                  </div>
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

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full signature-gradient text-on-primary py-4 rounded-xl font-headline font-bold text-lg shadow-lg shadow-primary/20 active:scale-[0.98] transition-all mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </button>

                {showResend && (
                  <div className="bg-surface-container-low rounded-xl p-5 mt-2 text-center space-y-3">
                    <p className="text-sm text-on-surface-variant">
                      Didn't get the email? Request a new activation link.
                    </p>
                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={resendLoading || resendCooldown > 0}
                      className="text-sm font-headline font-bold text-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {resendLoading
                        ? 'Sending...'
                        : resendCooldown > 0
                          ? `Resend available in ${resendCooldown}s`
                          : 'Resend Activation Email'}
                    </button>
                  </div>
                )}
              </form>

              <footer className="mt-8 text-center">
                <p className="text-sm text-on-surface-variant font-medium">
                  Don't have an account?{' '}
                  <Link className="text-primary font-bold hover:underline" to="/register">
                    Create One
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

export default LoginPage;
