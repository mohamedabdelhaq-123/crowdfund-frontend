import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const donationSchema = z.object({
  amount: z.number({ invalid_type_error: "Please enter a valid number" })
    .min(10, 'Donation amount must be at least 10'),
});

type DonationFormData = z.infer<typeof donationSchema>;

export const DonationPage = () => {
  const {
    register,
    handleSubmit,
    setValue, 
    watch,    
    formState: { errors },
  } = useForm<DonationFormData>({
    resolver: zodResolver(donationSchema),
  });

  const currentAmount = watch('amount');

  const onSubmit = (data: DonationFormData) => {
    console.log("Donation Data:", data);
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-surface-container-lowest rounded-xl shadow-ambient p-8 border border-outline-variant/20">
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-on-surface mb-2">
              Select or Enter Amount (EGP)
            </label>
            
            {/* The Quick-Select Buttons */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[50, 100, 500].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setValue('amount', val, { shouldValidate: true })}
                  className={`py-2 text-sm font-bold rounded border transition-all ${
                    currentAmount === val 
                      ? 'bg-primary text-white border-primary' 
                      : 'border-outline-variant/30 hover:bg-surface-container-high'
                  }`}
                >
                  EGP {val}
                </button>
              ))}
            </div>

            {/* The Input Field */}
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant font-bold">£</span>
              <input
                {...register('amount', { valueAsNumber: true })}
                type="number"
                placeholder="0.00"
                className={`w-full pl-10 pr-4 py-4 rounded-md bg-surface-container-low border focus:outline-none transition-all ${
                  errors.amount ? 'border-red-500' : 'border-outline-variant/30 focus:border-primary'
                }`}
              />
            </div>
            {errors.amount && (
              <p className="text-red-500 text-xs mt-2 font-medium">{"Donation amount is required and must be at least 10 EGP"}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full signature-gradient text-white font-bold py-4 rounded-md shadow-lg hover:opacity-90 transition-opacity uppercase tracking-wide"
          >
            Complete Donation
          </button>
        </form>
      </div>
    </div>
  );
};