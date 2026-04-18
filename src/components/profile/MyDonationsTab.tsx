import { Link } from 'react-router-dom';
import type { DonationItem } from '../../types/profile';

export default function MyDonationsTab({ donations }: { donations: DonationItem[] | undefined }) {
  return (
    <div className="max-w-6xl">
      {(!donations || donations.length === 0) ? (
        <div className="py-16 text-center flex flex-col items-center">
          <div className="w-24 h-24 bg-surface-container rounded-full flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-5xl text-outline-variant">volunteer_activism</span>
          </div>
          <h3 className="text-xl font-bold font-headline text-on-surface mb-2">No donations yet</h3>
          <p className="text-on-surface-variant max-w-sm">Your generosity can change lives. Explore campaigns to fund.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {donations.map((donation) => (
            <div key={donation.id} className="bg-surface-container-lowest rounded-3xl p-6 hover:translate-y-[-4px] hover:shadow-[0_40px_40px_rgba(47,46,46,0.06)] transition-all relative overflow-hidden group border border-transparent hover:border-primary/10">
              <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-surface-container text-[128px] group-hover:scale-110 transition-transform duration-500">volunteer_activism</span>
              <div className="relative z-10">
                <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded-full mb-3 uppercase tracking-widest font-headline">Successful</span>
                <Link to={`/projects/${donation.project}`}>
                  <h4 className="text-lg font-bold font-headline text-on-surface leading-tight mb-1 group-hover:text-primary transition-colors cursor-pointer">{donation.project_name}</h4>
                </Link>
                <p className="text-sm text-on-surface-variant flex items-center gap-1.5 mb-4">
                  <span className="material-symbols-outlined text-base">calendar_today</span>
                  {new Date(donation.created_at).toLocaleDateString()}
                </p>
                <div className="pt-4 border-t border-outline-variant/20">
                  <span className="text-sm text-on-surface-variant font-medium">Donated Amount</span>
                  <p className="text-2xl font-black font-headline text-primary mt-0.5">{donation.amount.toLocaleString()} EGP</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
