import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  Crown,
  ShieldCheck,
  Zap,
  HeartHandshake,
  Activity,
  Brain,
  FileSpreadsheet,
  Clock,
  ChevronRight,
  ArrowRight,
  Gift,
  X,
  CreditCard,
  Check,
  AlertCircle
} from 'lucide-react';
import { UserProfile } from '../types';

interface PremiumMembershipModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onUpgradeSuccess: (plan: 'plus', period: 'monthly' | 'yearly') => void;
}

export const PremiumMembershipModal: React.FC<PremiumMembershipModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpgradeSuccess,
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCheckoutSuccess, setShowCheckoutSuccess] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');

  if (!isOpen) return null;

  const isAlreadyPlus = user.subscriptionPlan === 'plus';

  const handleSubscribe = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setShowCheckoutSuccess(true);
      setTimeout(() => {
        onUpgradeSuccess('plus', billingCycle);
        setShowCheckoutSuccess(false);
        onClose();
      }, 1500);
    }, 1200);
  };

  const featureComparison = [
    {
      feature: 'Core Doctor & Hospital Directory',
      free: true,
      plus: true,
      description: 'Search specialists and emergency centers',
    },
    {
      feature: 'SOS Emergency Panic Button & GPS Alert',
      free: true,
      plus: true,
      description: 'Instant broadcast to saved guardian contacts',
    },
    {
      feature: 'Medical Records & Prescriptions Storage',
      free: 'Up to 5 Records',
      plus: 'Unlimited Records & Cloud Sync',
      description: 'Safe storage for lab reports and discharge summaries',
    },
    {
      feature: 'PULSE AI Medical Assistant',
      free: 'Standard triage (5 queries/day)',
      plus: 'Unlimited 24x7 Deep AI Health Diagnostics',
      highlight: true,
      description: 'Instant symptom checking, report explanation & lab insights',
    },
    {
      feature: 'Priority Doctor Appointment Slots',
      free: false,
      plus: true,
      highlight: true,
      description: 'First-in-line VIP booking & expedited OPD confirmations',
    },
    {
      feature: 'Comprehensive Family Vault',
      free: '1 Member',
      plus: 'Up to 6 Family Members',
      description: 'Dedicated profiles with vaccination & allergy tracking',
    },
    {
      feature: 'Vitals Predictive Risk Alerts & Trend Reports',
      free: false,
      plus: true,
      highlight: true,
      description: 'Smart AI analysis for BP, Glucose & Heart Rate fluctuations',
    },
    {
      feature: 'Automated Medicine Refill & Interaction Checks',
      free: false,
      plus: true,
      description: 'Proactive dosage reminders & contraindication warnings',
    },
    {
      feature: '24x7 Dedicated VIP Telehealth Concierge',
      free: false,
      plus: true,
      highlight: true,
      description: 'Direct priority dialer with certified medical officers',
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon / Banner */}
        <div className="relative bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-700 p-6 sm:p-8 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-300/30 text-amber-200 text-xs font-bold uppercase tracking-wider mb-3">
              <Crown className="w-3.5 h-3.5 text-amber-300" />
              <span>MEDCONNECT Memberships</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Elevate Your Healthcare Experience
            </h2>
            <p className="text-blue-100 text-sm sm:text-base mt-1.5">
              Choose the plan that fits you and your family. Upgrade to unlock intelligent health-management tools.
            </p>
          </div>

          {/* Billing Cycle Toggle */}
          <div className="mt-6 inline-flex p-1 bg-black/25 backdrop-blur-md rounded-2xl border border-white/15">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                billingCycle === 'monthly'
                  ? 'bg-white text-slate-900 shadow-md'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                billingCycle === 'yearly'
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <span>Yearly Billing</span>
              <span className="px-2 py-0.5 rounded-full bg-slate-900 text-amber-300 text-[10px] font-extrabold">
                Save ~16%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Row */}
        <div className="p-6 sm:p-8 space-y-8 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* FREE PLAN CARD */}
            <div className="rounded-2xl p-6 border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850/50 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold uppercase tracking-wider">
                    FREE
                  </span>
                  {!isAlreadyPlus && (
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      Current Plan
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-4">
                  Essential Companion
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Essential healthcare companion for routine needs
                </p>

                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                    ₹0
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    / forever
                  </span>
                </div>

                <div className="mt-6 space-y-3 pt-6 border-t border-slate-200 dark:border-slate-800">
                  <div className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Doctor & Hospital Directory Search</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>SOS Emergency Alerts & Broadcast</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Basic Health Records Storage (5 items)</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-slate-500 dark:text-slate-400">
                    <XCircle className="w-4 h-4 text-slate-300 dark:text-slate-600 shrink-0 mt-0.5" />
                    <span>Limited AI Health Assistance</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-slate-500 dark:text-slate-400">
                    <XCircle className="w-4 h-4 text-slate-300 dark:text-slate-600 shrink-0 mt-0.5" />
                    <span>Standard appointment booking queue</span>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button
                  disabled
                  className="w-full py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-bold text-xs bg-transparent cursor-default"
                >
                  {!isAlreadyPlus ? 'Active Default Plan' : 'Free Tier'}
                </button>
              </div>
            </div>

            {/* PLUS PLAN CARD (HIGHLIGHTED) */}
            <div className="relative rounded-2xl p-6 border-2 border-blue-600 dark:border-blue-500 bg-gradient-to-b from-blue-50/80 to-indigo-50/30 dark:from-blue-950/40 dark:to-slate-900 shadow-xl flex flex-col justify-between">
              {/* Best Value Badge */}
              <div className="absolute -top-3.5 right-6 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-extrabold text-[11px] uppercase tracking-wider shadow-md flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Best Value</span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-lg bg-blue-600 text-white text-xs font-black uppercase tracking-wider flex items-center gap-1">
                    <Crown className="w-3.5 h-3.5" />
                    PLUS
                  </span>
                  <span className="text-xs font-extrabold text-blue-700 dark:text-blue-400">
                    MEDCONNECT Plus
                  </span>
                </div>

                <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 mt-4">
                  Intelligent Health-Management Tools
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  Comprehensive intelligence, predictive alerts & VIP medical access
                </p>

                {/* Price Display */}
                <div className="mt-4">
                  {billingCycle === 'monthly' ? (
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-black text-slate-900 dark:text-slate-100">
                        ₹99
                      </span>
                      <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                        / month
                      </span>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-black text-slate-900 dark:text-slate-100">
                          ₹999
                        </span>
                        <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                          / year
                        </span>
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-md">
                          Save ~16%
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Equivalent to only ₹83/month billed annually
                      </p>
                    </div>
                  )}
                </div>

                {/* Plus Key Features */}
                <div className="mt-6 space-y-3 pt-6 border-t border-blue-200 dark:border-blue-900/60">
                  <div className="flex items-start gap-2.5 text-xs text-slate-900 dark:text-slate-100 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                    <span>Unlimited PULSE AI Medical Consultations (24x7)</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-slate-900 dark:text-slate-100 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                    <span>Priority VIP OPD & Doctor Booking Slots</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-slate-900 dark:text-slate-100 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                    <span>Unlimited Encrypted Health Records & Cloud Sync</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-slate-900 dark:text-slate-100 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                    <span>Multi-Family Health Vault (Up to 6 Members)</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-slate-900 dark:text-slate-100 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                    <span>AI Vitals Predictive Risk Trends & Anomaly Alerts</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-6 pt-4">
                {isAlreadyPlus ? (
                  <div className="w-full py-3 rounded-xl bg-emerald-600 text-white font-extrabold text-sm text-center flex items-center justify-center gap-2 shadow-md">
                    <Check className="w-4 h-4" />
                    <span>You are a MEDCONNECT Plus Member</span>
                  </div>
                ) : (
                  <button
                    onClick={handleSubscribe}
                    disabled={isProcessing}
                    className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 active:scale-[0.98] transition-all cursor-pointer"
                  >
                    {isProcessing ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Activating MEDCONNECT Plus...</span>
                      </div>
                    ) : (
                      <>
                        <Crown className="w-4 h-4 text-amber-300" />
                        <span>
                          Upgrade to Plus — {billingCycle === 'monthly' ? '₹99/mo' : '₹999/yr'}
                        </span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Detailed Comparison Table */}
          <div className="mt-8 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-4 bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                  Feature-by-Feature Plan Matrix
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Detailed comparison between Free and MEDCONNECT Plus
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs font-extrabold">
                <span className="text-slate-600 dark:text-slate-400">FREE</span>
                <span className="text-blue-600 dark:text-blue-400">PLUS</span>
              </div>
            </div>

            <div className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900">
              {featureComparison.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    item.highlight ? 'bg-blue-50/40 dark:bg-blue-950/20' : ''
                  }`}
                >
                  <div className="max-w-md">
                    <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                      {item.feature}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {item.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-8 text-xs font-semibold">
                    {/* Free column */}
                    <div className="w-24 text-center">
                      {typeof item.free === 'boolean' ? (
                        item.free ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" />
                        ) : (
                          <XCircle className="w-4 h-4 text-slate-300 dark:text-slate-600 mx-auto" />
                        )
                      ) : (
                        <span className="text-[11px] text-slate-600 dark:text-slate-400">
                          {item.free}
                        </span>
                      )}
                    </div>

                    {/* Plus column */}
                    <div className="w-28 text-center font-bold text-blue-700 dark:text-blue-400">
                      {typeof item.plus === 'boolean' ? (
                        item.plus ? (
                          <div className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-extrabold">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Included</span>
                          </div>
                        ) : (
                          <XCircle className="w-4 h-4 text-slate-300 mx-auto" />
                        )
                      ) : (
                        <span className="text-[11px] bg-blue-100 dark:bg-blue-950 px-2 py-0.5 rounded-md">
                          {item.plus}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Security & Guarantee Note */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>
                <strong>Zero Risk</strong>: Cancel anytime from your account settings. 100% Secure encrypted transaction.
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <CreditCard className="w-4 h-4 text-slate-400" />
              <span className="text-[11px] font-bold">UPI / Cards / NetBanking</span>
            </div>
          </div>
        </div>

        {/* Success Modal Overlay when upgrade completes */}
        {showCheckoutSuccess && (
          <div className="absolute inset-0 bg-white/95 dark:bg-slate-900/95 flex flex-col items-center justify-center p-6 text-center animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 shadow-lg">
              <Crown className="w-8 h-8 text-amber-500 animate-bounce" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100">
              Welcome to MEDCONNECT Plus!
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-sm">
              Your account has been upgraded to Plus with intelligent health-management tools unlocked.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
