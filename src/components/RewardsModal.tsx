import React, { useState } from 'react';
import { X, Gift, Award, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';
import { RewardState, RedeemOption } from '../types';

interface RewardsModalProps {
  isOpen: boolean;
  onClose: () => void;
  rewards: RewardState;
  onRedeem: (option: RedeemOption) => void;
}

export const RewardsModal: React.FC<RewardsModalProps> = ({
  isOpen,
  onClose,
  rewards,
  onRedeem,
}) => {
  const [redeemedCode, setRedeemedCode] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRedeemClick = (option: RedeemOption) => {
    if (rewards.points >= option.costPoints) {
      onRedeem(option);
      setRedeemedCode(`MEDCONNECT-${option.id.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
      <div className="bg-white dark:bg-slate-900 max-w-lg w-full rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5 max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white shadow-md flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-100 block">
              Gamified Health Companion
            </span>
            <h3 className="text-xl font-extrabold font-display">MedConnect Pulse Rewards</h3>
            <p className="text-xs text-amber-100 mt-0.5">Earn points for proactive wellness habits</p>
          </div>
          <div className="text-right bg-white/20 backdrop-blur-md px-3 py-2 rounded-xl border border-white/30">
            <span className="text-[10px] uppercase font-bold text-amber-100 block">Balance</span>
            <span className="text-xl font-black font-display">{rewards.points} PTS</span>
          </div>
        </div>

        {redeemedCode && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 rounded-xl text-xs text-emerald-900 dark:text-emerald-200 space-y-1">
            <p className="font-bold flex items-center gap-1.5 text-emerald-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Reward Voucher Redeemed Successfully!
            </p>
            <p className="font-mono font-extrabold text-sm text-slate-900 dark:text-slate-100 p-2 bg-white dark:bg-slate-800 rounded border border-emerald-200 text-center">
              {redeemedCode}
            </p>
            <p className="text-[10px] text-slate-500 text-center">Show this code at partner hospital billing counter.</p>
          </div>
        )}

        {/* Badges Earned */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-500" /> Badges Earned
          </h4>
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {rewards.badges.map((b) => (
              <span
                key={b}
                className="px-3 py-1.5 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-300 text-xs font-bold rounded-xl whitespace-nowrap shadow-xs flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> {b}
              </span>
            ))}
          </div>
        </div>

        {/* Ways to Earn */}
        <div className="space-y-2 text-xs">
          <h4 className="font-bold uppercase tracking-wider text-slate-400">
            How to Earn Points
          </h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <p className="font-bold text-slate-900 dark:text-slate-100">Complete Health Profile</p>
              <p className="text-[10px] text-emerald-600 font-bold mt-0.5">+100 Points</p>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <p className="font-bold text-slate-900 dark:text-slate-100">Request Appointments</p>
              <p className="text-[10px] text-emerald-600 font-bold mt-0.5">+50 Points</p>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <p className="font-bold text-slate-900 dark:text-slate-100">Read Daily Tips</p>
              <p className="text-[10px] text-emerald-600 font-bold mt-0.5">+10 Points</p>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <p className="font-bold text-slate-900 dark:text-slate-100">Upload Vault Record</p>
              <p className="text-[10px] text-emerald-600 font-bold mt-0.5">+30 Points</p>
            </div>
          </div>
        </div>

        {/* Redeem Options */}
        <div className="space-y-2 text-xs">
          <h4 className="font-bold uppercase tracking-wider text-slate-400">
            Redeem Available Vouchers
          </h4>
          <div className="space-y-2">
            {rewards.redeemOptions.map((opt) => (
              <div
                key={opt.id}
                className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3"
              >
                <div>
                  <p className="font-bold text-slate-900 dark:text-slate-100">{opt.title}</p>
                  <p className="text-[11px] text-slate-500">{opt.description}</p>
                </div>

                <button
                  onClick={() => handleRedeemClick(opt)}
                  disabled={rewards.points < opt.costPoints}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                    rewards.points >= opt.costPoints
                      ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-xs'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  Redeem ({opt.costPoints} pts)
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
