import { useState } from 'react';
import { useProfile, useMyProjects, useMyDonations, useDeleteAccount, usePublicProfile, usePublicProjects } from '../hooks/useProfileApi';
import { Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearCredentials } from '../store/slices/authSlice';
import type { AppDispatch } from '../store/store';
import toast from 'react-hot-toast';
import EditProfileForm from '../components/profile/EditProfileForm';
import MyProjectsTab from '../components/profile/MyProjectsTab';
import MyDonationsTab from '../components/profile/MyDonationsTab';

type Tab = 'projects' | 'donations' | 'edit';

function ProfilePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const isPublicView = !!id;

  const dispatch = useDispatch<AppDispatch>();

  // Data Queries
  const myProfileQuery = useProfile();
  const publicProfileQuery = usePublicProfile(Number(id));
  const { data: publicProjects } = usePublicProjects(Number(id));

  // Determine which profile is currently active
  const { data: profile, isLoading, error } = isPublicView ? publicProfileQuery : myProfileQuery;

  // Personal data queries (only relevant if not public view)
  const { data: projects } = useMyProjects();
  const { data: donations } = useMyDonations();
  const deleteAccount = useDeleteAccount();

  const [activeTab, setActiveTab] = useState<Tab>(location.pathname.includes('/edit') ? 'edit' : 'projects');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState('');

  const handleDeleteAccount = async () => {
    deleteAccount.mutate(deletePassword, {
      onError: (error: any) => {
        const detail = error.response?.data?.password || error.response?.data?.detail || 'An error occurred';
        setDeleteError(Array.isArray(detail) ? detail[0] : String(detail));
      },
      onSuccess: () => {
        dispatch(clearCredentials());
        toast.success('Account deleted successfully');
        navigate('/');
      }
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="text-center bg-surface-container-lowest p-10 rounded-3xl shadow-ambient max-w-sm w-full">
          <span className="material-symbols-outlined text-5xl text-primary mb-4 block">warning</span>
          <h2 className="text-2xl font-black font-headline text-on-surface mb-2">Unable to Load Profile</h2>
          <p className="text-on-surface-variant mb-6">{isPublicView ? 'This user profile does not exist or is unavailable.' : 'Please log in to view your details.'}</p>
          {!isPublicView && (
            <Link to="/login" className="inline-flex items-center justify-center gap-2 signature-gradient text-on-primary px-6 py-3 rounded-full font-headline font-bold w-full">
              Go to Login
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </Link>
          )}
          {isPublicView && (
            <Link to="/" className="inline-flex items-center justify-center gap-2 bg-surface-container-high text-on-surface px-6 py-3 rounded-full font-headline font-bold w-full mt-4 hover:bg-surface-container-highest transition-colors">
              Return Home
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-container-low font-body">
      <div className="flex max-w-screen-2xl mx-auto">

        {!isPublicView && (
          <aside className="hidden md:flex flex-col gap-2 p-6 h-[calc(100vh-72px)] w-64 bg-surface sticky top-[72px]">
            <div className="mb-8 px-2">
              <p className="font-headline font-bold text-lg text-on-surface">{profile.first_name} {profile.last_name}</p>
              <p className="text-on-surface-variant text-xs font-headline">Member</p>
            </div>
            <nav className="flex flex-col gap-1">
              <Link to="/" className="flex items-center gap-3 p-3 text-on-surface-variant hover:bg-surface-container-low rounded-xl transition-all font-headline text-sm">
                <span className="material-symbols-outlined">dashboard</span> Dashboard
              </Link>
              <button onClick={() => setActiveTab('projects')} className={`flex items-center gap-3 p-3 rounded-xl transition-all font-headline text-sm text-left ${activeTab === 'projects' ? 'bg-surface-container-lowest text-primary font-bold shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-low'}`}>
                <span className="material-symbols-outlined">rocket_launch</span> My Campaigns
              </button>
              <button onClick={() => setActiveTab('donations')} className={`flex items-center gap-3 p-3 rounded-xl transition-all font-headline text-sm text-left ${activeTab === 'donations' ? 'bg-surface-container-lowest text-primary font-bold shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-low'}`}>
                <span className="material-symbols-outlined">volunteer_activism</span> Contributions
              </button>
              <button onClick={() => setActiveTab('edit')} className={`flex items-center gap-3 p-3 rounded-xl transition-all font-headline text-sm text-left ${activeTab === 'edit' ? 'bg-surface-container-lowest text-primary font-bold shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-low'}`}>
                <span className="material-symbols-outlined">settings</span> Settings
              </button>
            </nav>
          </aside>
        )}

        <main className={`flex-1 p-4 md:p-12 min-h-screen ${isPublicView ? 'md:max-w-4xl md:mx-auto' : ''}`}>

          <section className="mb-12">
            <div className={`flex flex-col items-center gap-8 ${isPublicView ? 'md:flex-col md:items-center text-center mt-8' : 'md:flex-row md:items-end md:text-left'}`}>
              <div className="relative group">
                <div className="h-40 w-40 rounded-full bg-surface-container-lowest p-1.5 shadow-2xl overflow-hidden">
                  {profile.profile_pic ? (
                    <img src={profile.profile_pic} alt={`${profile.first_name} ${profile.last_name}`} className="h-full w-full object-cover rounded-full" />
                  ) : (
                    <div className="h-full w-full rounded-full signature-gradient flex items-center justify-center">
                      <span className="text-4xl font-black text-on-primary font-headline">
                        {profile.first_name?.[0]}{profile.last_name?.[0]}
                       </span>
                    </div>
                  )}
                </div>
                {!isPublicView && (
                  <Link
                    to="/profile/edit"
                    className="absolute bottom-2 right-2 h-10 w-10 bg-primary text-on-primary rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform"
                  >
                    <span className="material-symbols-outlined text-xl">edit</span>
                  </Link>
                )}
              </div>
              <div className="flex-1">
                <h1 className="text-4xl md:text-5xl font-black font-headline tracking-tighter text-on-surface mb-2">
                  {profile.first_name} {profile.last_name}
                </h1>
                <p className="text-on-surface-variant font-body max-w-xl leading-relaxed mx-auto md:mx-0">
                  {!isPublicView && profile.email}
                  {profile.country && (
                    <span className="inline-flex items-center gap-1 mt-1 font-bold text-primary">
                      <span className="material-symbols-outlined text-sm">location_on</span>
                      {profile.country}
                    </span>
                  )}
                </p>
                {isPublicView && profile.fb_profile && (
                  <a href={profile.fb_profile} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-[#1877F2]/10 text-[#1877F2] font-bold rounded-lg hover:bg-[#1877F2]/20 transition-colors text-sm">
                    <span className="material-symbols-outlined">link</span> Facebook Profile
                  </a>
                )}
              </div>
            </div>
          </section>

          {isPublicView && (
            <div className="mt-16">
              <h2 className="text-2xl font-black font-headline text-on-surface mb-8 text-center md:text-left">Public Campaigns</h2>
              <MyProjectsTab projects={publicProjects} isPublicView={true} />
            </div>
          )}

          {!isPublicView && (
            <>
              <div className="mb-8 max-w-5xl">
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {(['projects', 'donations', 'edit'] as Tab[]).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-6 py-3 rounded-xl font-headline transition-all whitespace-nowrap ${
                        activeTab === tab
                          ? 'bg-surface-container-lowest shadow-sm text-primary font-bold'
                          : 'hover:bg-surface-container-high text-on-surface-variant font-medium'
                      }`}
                    >
                      {tab === 'projects' && `My Projects (${projects?.length || 0})`}
                      {tab === 'donations' && `My Donations (${donations?.length || 0})`}
                      {tab === 'edit' && 'Edit Profile'}
                    </button>
                  ))}
                </div>
              </div>

              {activeTab === 'projects' && (
                <MyProjectsTab projects={projects} />
              )}

              {activeTab === 'donations' && (
                <MyDonationsTab donations={donations} />
              )}

              {activeTab === 'edit' && (
                <EditProfileForm profile={profile} />
              )}

              {activeTab === 'edit' && (
                <div className="mt-12 p-8 rounded-3xl bg-red-50 border border-red-100 max-w-3xl">
                  <div className="flex gap-4">
                    <span className="material-symbols-outlined text-red-600" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
                    <div>
                      <h4 className="font-headline font-bold text-red-700 mb-1">Account Danger Zone</h4>
                      <p className="text-on-surface-variant text-sm mb-4">Deleting your account is permanent. All your campaign history, contributions, and personal data will be erased from our servers immediately.</p>
                      <button
                        onClick={() => setShowDeleteModal(true)}
                        className="px-6 py-2 bg-red-600 text-white font-bold font-headline text-xs rounded-full hover:bg-red-700 transition-colors"
                      >
                        Request Account Deletion
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

        </main>
      </div>

      {showDeleteModal && !isPublicView && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-surface-container-lowest rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-6 mx-auto">
              <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
            </div>
            <h3 className="text-2xl font-black text-center font-headline text-on-surface mb-2">Delete Account?</h3>
            <p className="text-center text-on-surface-variant mb-6 text-sm">
              This action cannot be undone. Enter your password to confirm.
            </p>
            <input
              type="password"
              value={deletePassword}
              onChange={(e) => { setDeletePassword(e.target.value); setDeleteError(''); }}
              placeholder="Your password"
              className="w-full bg-surface-container-low border-none rounded-2xl p-4 mb-2 focus:ring-2 focus:ring-red-300 font-body text-center tracking-widest placeholder:tracking-normal"
            />
            {deleteError && <p className="text-red-600 text-sm font-medium text-center mb-4">{deleteError}</p>}
            <div className="flex gap-4 mt-8">
              <button
                onClick={() => { setShowDeleteModal(false); setDeletePassword(''); setDeleteError(''); }}
                className="flex-1 py-3.5 rounded-xl text-on-surface-variant font-bold font-headline hover:bg-surface-container-high transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={!deletePassword || deleteAccount.isPending}
                className="flex-1 py-3.5 rounded-xl bg-red-600 text-white font-bold font-headline hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {deleteAccount.isPending ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;;
