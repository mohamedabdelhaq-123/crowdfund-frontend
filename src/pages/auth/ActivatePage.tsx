import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../api/client';
import { CheckCircle, Info, Clock, AlertCircle, Loader2, ArrowRight } from 'lucide-react';

type ActivationStatus = 'loading' | 'success' | 'already' | 'expired' | 'invalid';

const ActivatePage = () => {
  const { token } = useParams<{ token: string }>();
  const [status, setStatus] = useState<ActivationStatus>('loading');
  const [message, setMessage] = useState('');

  const [resendEmail, setResendEmail] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (!token) {
      setStatus('invalid');
      setMessage('No activation token provided.');
      return;
    }

    const activate = async () => {
      try {
        const res = await api.get(`/auth/activate/${token}/`);
        if (res.data.message?.includes('already')) {
          setStatus('already');
        } else {
          setStatus('success');
        }
        setMessage(res.data.message);
      } catch (error: any) {
        const errMsg = error.response?.data?.error || 'Activation failed.';
        if (errMsg.toLowerCase().includes('expired')) {
          setStatus('expired');
        } else {
          setStatus('invalid');
        }
        setMessage(errMsg);
      }
    };

    activate();
  }, [token]);


  const handleResend = async () => {
    if (!resendEmail.trim()) {
      toast.error('Please enter your email address.');
      return;
    }
    setResendLoading(true);
    try {
      await api.post('/auth/resend-activation/', { email: resendEmail });
      toast.success('Activation email sent! Check your inbox.');
      setResendCooldown(120);
      const interval = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) { clearInterval(interval); return 0; }
          return prev - 1;
        });
      }, 1000);
    } catch (error: any) {
      const msg = error.response?.data?.error || 'Could not resend. Try again later.';
      toast.error(msg);
    } finally {
      setResendLoading(false);
    }
  };

  const stateConfig = {
    loading:  { Icon: Loader2,      pulse: true  },
    success:  { Icon: CheckCircle,  pulse: false },
    already:  { Icon: Info,         pulse: false },
    expired:  { Icon: Clock,        pulse: false },
    invalid:  { Icon: AlertCircle,  pulse: false },
  };
  const cfg = stateConfig[status];

  return (
    <div className="bg-surface font-body text-on-surface min-h-screen flex flex-col">
      <main className="flex-grow flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] signature-gradient opacity-5 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[300px] h-[300px] bg-tertiary opacity-5 rounded-full blur-[80px]" />

        <div className="w-full max-w-lg z-10">
          <div className="flex justify-center mb-10">
            <Link to="/" className="font-headline font-extrabold text-3xl tracking-tighter text-on-surface hover:text-primary transition-colors">
              FundEgypt
            </Link>
          </div>

          <div className="bg-surface-container-lowest rounded-xl p-8 md:p-12 shadow-[0_40px_60px_-15px_rgba(47,46,46,0.06)] text-center">
            <div className="relative w-24 h-24 mx-auto mb-8">
              <div className={`absolute inset-0 signature-gradient opacity-10 rounded-full ${cfg.pulse ? 'animate-pulse' : ''}`} />
              <div className={`absolute inset-2 rounded-full flex items-center justify-center ${
                status === 'expired' || status === 'invalid'
                  ? 'bg-error-container/80'
                  : 'signature-gradient'
              }`}>
                <cfg.Icon
                  className={`w-12 h-12 ${
                    status === 'expired' || status === 'invalid' ? 'text-on-error' : 'text-on-primary'
                  } ${status === 'loading' ? 'animate-spin' : ''}`}
                />
              </div>
            </div>

            {status === 'loading' && (
              <>
                <h1 className="font-headline font-bold text-3xl md:text-4xl text-on-surface mb-4 leading-tight">
                  Activating your account…
                </h1>
                <p className="text-on-surface-variant text-lg leading-relaxed px-4">
                  Please wait while we verify your activation link.
                </p>
              </>
            )}

            {status === 'success' && (
              <>
                <h1 className="font-headline font-bold text-3xl md:text-4xl text-on-surface mb-4 leading-tight">
                  Account Activated!
                </h1>
                <p className="text-on-surface-variant text-lg leading-relaxed mb-10 px-4">
                  Your account has been activated successfully! You can now start exploring and supporting projects.
                </p>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center w-full signature-gradient text-on-primary font-headline font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95 group"
                >
                  Go to Login
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </>
            )}

            {status === 'already' && (
              <>
                <h1 className="font-headline font-bold text-3xl md:text-4xl text-on-surface mb-4 leading-tight">
                  Already Activated
                </h1>
                <p className="text-on-surface-variant text-lg leading-relaxed mb-10 px-4">
                  This account is already active. You can go ahead and sign in.
                </p>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center w-full signature-gradient text-on-primary font-headline font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95 group"
                >
                  Go to Login
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </>
            )}

            {status === 'expired' && (
              <>
                <h1 className="font-headline font-bold text-3xl md:text-4xl text-on-surface mb-4 leading-tight">
                  Link Expired
                </h1>
                <p className="text-on-surface-variant text-lg leading-relaxed mb-8 px-4">
                  {message} Enter your email below to receive a fresh activation link.
                </p>

                <div className="space-y-4 text-left">
                  <div className="space-y-1.5">
                    <label className="text-xs font-label font-bold text-on-surface-variant uppercase tracking-wider ml-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={resendEmail}
                      onChange={(e) => setResendEmail(e.target.value)}
                      placeholder="ahmed@example.com"
                      className="w-full px-4 py-3.5 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary/40 focus:bg-surface-container-lowest transition-all placeholder:text-outline-variant"
                    />
                  </div>
                  <button
                    onClick={handleResend}
                    disabled={resendLoading || resendCooldown > 0}
                    className="w-full signature-gradient text-on-primary font-headline font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {resendLoading
                      ? 'Sending…'
                      : resendCooldown > 0
                        ? `Resend available in ${resendCooldown}s`
                        : 'Resend Activation Email'}
                  </button>
                </div>
              </>
            )}

            {status === 'invalid' && (
              <>
                <h1 className="font-headline font-bold text-3xl md:text-4xl text-on-surface mb-4 leading-tight">
                  Invalid Link
                </h1>
                <p className="text-on-surface-variant text-lg leading-relaxed mb-10 px-4">
                  {message} This link may have been tampered with or is no longer valid.
                </p>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center w-full signature-gradient text-on-primary font-headline font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95 group"
                >
                  Back to Register
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </>
            )}


            {status !== 'loading' && (
              <div className="mt-12 pt-8 border-t border-outline-variant/10">
                <p className="font-label text-xs uppercase tracking-widest text-on-surface-variant/60 font-bold mb-4">
                  Need help?
                </p>
                <div className="flex flex-wrap justify-center gap-6">
                  <a href="#" className="text-primary font-medium hover:underline transition-all decoration-2 underline-offset-4">
                    Support Center
                  </a>
                  <a href="#" className="text-primary font-medium hover:underline transition-all decoration-2 underline-offset-4">
                    Community Guide
                  </a>
                </div>
              </div>
            )}
          </div>



          <div className="mt-8 grid grid-cols-3 gap-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="bg-surface-container-low p-4 rounded-lg flex flex-col items-center">
              <span className="font-headline font-bold text-xl text-on-surface">500+</span>
              <span className="font-label text-[10px] uppercase font-bold tracking-tighter">Projects</span>
            </div>
            <div className="bg-surface-container-low p-4 rounded-lg flex flex-col items-center">
              <span className="font-headline font-bold text-xl text-on-surface">EGP 20M</span>
              <span className="font-label text-[10px] uppercase font-bold tracking-tighter">Raised</span>
            </div>
            <div className="bg-surface-container-low p-4 rounded-lg flex flex-col items-center">
              <span className="font-headline font-bold text-xl text-on-surface">1k+</span>
              <span className="font-label text-[10px] uppercase font-bold tracking-tighter">Backers</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ActivatePage;
