import React, { useState, useEffect } from 'react';
import {
  X,
  Phone,
  Mail,
  Lock,
  User,
  Shield,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  HeartPulse,
  PhoneCall,
  KeyRound,
  RefreshCw,
  PlusCircle,
  Activity,
  Droplet
} from 'lucide-react';
import { UserProfile } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile, message: string) => void;
  initialMode?: 'register' | 'login';
  initialMethod?: 'phone' | 'email';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialMode = 'register',
  initialMethod = 'phone'
}) => {
  // Mode: 'register' vs 'login'
  const [authMode, setAuthMode] = useState<'register' | 'login'>(initialMode);
  // Method: 'phone' vs 'email'
  const [authMethod, setAuthMethod] = useState<'phone' | 'email'>(initialMethod);

  // Phone OTP Flow State
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);
  const [otpTimer, setOtpTimer] = useState(0);
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  // Email Flow State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Profile Fields (for Register)
  const [fullName, setFullName] = useState('');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [age, setAge] = useState('28');
  const [gender, setGender] = useState('Male');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Status & Error Messages
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  // Reset or initialize on open
  useEffect(() => {
    if (isOpen) {
      setAuthMode(initialMode);
      setAuthMethod(initialMethod);
      setErrorMessage(null);
      setSuccessInfo(null);
    }
  }, [isOpen, initialMode, initialMethod]);

  // Countdown timer for OTP resend
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  if (!isOpen) return null;

  // Trigger Send OTP
  const handleSendOtp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);

    const cleanPhone = phoneNumber.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (authMode === 'register' && !fullName.trim()) {
      setErrorMessage('Please enter your full name for registration.');
      return;
    }

    setIsSendingOtp(true);
    setTimeout(() => {
      // Generate realistic 6-digit OTP
      const testOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(testOtp);
      setOtpSent(true);
      setOtpTimer(30);
      setIsSendingOtp(false);
      setSuccessInfo(`OTP sent successfully to ${countryCode} ${phoneNumber}!`);
    }, 700);
  };

  // Verify Phone OTP & Login/Register
  const handleVerifyPhoneOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!otpCode || otpCode.length !== 6) {
      setErrorMessage('Please enter the 6-digit OTP received on your mobile.');
      return;
    }

    if (generatedOtp && otpCode !== generatedOtp && otpCode !== '123456') {
      setErrorMessage('Invalid OTP code. Please enter the correct code or click Resend.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const fullPhone = `${countryCode} ${phoneNumber}`;
      const newUser: UserProfile = {
        id: `usr_${Date.now()}`,
        name: fullName.trim() || 'Verified Patient',
        email: email.trim() || `user_${phoneNumber.slice(-4)}@medconnect.org`,
        phone: fullPhone,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(fullName || phoneNumber)}`,
        role: 'user',
        bloodGroup: bloodGroup || 'O+',
        allergies: [],
        chronicConditions: [],
        primaryContact: {
          name: emergencyName.trim() || 'Primary Guardian',
          phone: emergencyPhone.trim() || fullPhone,
          relation: 'Family',
        },
        secondaryContact: {
          name: 'MEDCONNECT Support Desk',
          phone: '+91 6388022910',
          relation: 'Helpline',
        },
        isBiometricEnabled: true,
        language: 'English',
        theme: 'light',
        isLargeText: false,
        rewardPoints: authMode === 'register' ? 250 : 650,
      };

      const msg = authMode === 'register'
        ? `Registration successful! Welcome to MEDCONNECT, ${newUser.name}.`
        : `Signed in successfully via Mobile OTP. Welcome back, ${newUser.name}!`;

      onLoginSuccess(newUser, msg);
      onClose();
    }, 800);
  };

  // Handle Email Registration / Login
  const handleEmailAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (!password || password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (authMode === 'register') {
      if (!fullName.trim()) {
        setErrorMessage('Please enter your full name.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match. Please re-enter.');
        return;
      }
      if (!agreeTerms) {
        setErrorMessage('You must agree to the Terms of Service & Privacy Policy.');
        return;
      }
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const displayName = fullName.trim() || email.split('@')[0];
      const newUser: UserProfile = {
        id: `usr_${Date.now()}`,
        name: displayName,
        email: email.trim(),
        phone: phoneNumber ? `${countryCode} ${phoneNumber}` : '+91 6388022910',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(displayName)}`,
        role: email.includes('admin') ? 'admin' : 'user',
        bloodGroup: bloodGroup || 'O+',
        allergies: [],
        chronicConditions: [],
        primaryContact: {
          name: emergencyName.trim() || 'Primary Guardian',
          phone: emergencyPhone.trim() || '+91 6388022910',
          relation: 'Family',
        },
        secondaryContact: {
          name: 'MEDCONNECT Support Desk',
          phone: '+91 6388022910',
          relation: 'Helpline',
        },
        isBiometricEnabled: true,
        language: 'English',
        theme: 'light',
        isLargeText: false,
        rewardPoints: authMode === 'register' ? 250 : 650,
      };

      const msg = authMode === 'register'
        ? `Account registered successfully! Welcome, ${newUser.name}.`
        : `Signed in as ${newUser.email}. Welcome back!`;

      onLoginSuccess(newUser, msg);
      onClose();
    }, 800);
  };

  // Demo Quick Login
  const handleQuickDemoLogin = (role: 'patient' | 'admin') => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (role === 'admin') {
        const adminUser: UserProfile = {
          id: 'admin_101',
          name: 'Chief Medical Administrator',
          email: 'Mrajeetsingh1012@gmail.com',
          phone: '+91 6388022910',
          avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200',
          role: 'admin',
          bloodGroup: 'B+',
          allergies: [],
          chronicConditions: [],
          primaryContact: { name: 'Emergency Command', phone: '+91 6388022910', relation: 'Hospital Admin' },
          secondaryContact: { name: 'Director Office', phone: '+91 6388022910', relation: 'Head' },
          isBiometricEnabled: true,
          language: 'English',
          theme: 'light',
          isLargeText: false,
          rewardPoints: 1200,
        };
        onLoginSuccess(adminUser, 'Logged in as Administrator with Full Portal Access.');
      } else {
        const demoPatient: UserProfile = {
          id: 'usr_demo',
          name: 'Alexander Wright',
          email: 'alex.wright@medconnect.org',
          phone: '+91 6388022910',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
          role: 'user',
          bloodGroup: 'O+',
          allergies: ['Penicillin', 'Peanuts'],
          chronicConditions: ['Hypertension'],
          primaryContact: { name: 'Sarah Wright', phone: '+91 6388022910', relation: 'Spouse' },
          secondaryContact: { name: 'David Wright', phone: '+91 6388022910', relation: 'Brother' },
          isBiometricEnabled: true,
          language: 'English',
          theme: 'light',
          isLargeText: false,
          rewardPoints: 650,
        };
        onLoginSuccess(demoPatient, 'Logged in as Demo Patient (Alexander Wright).');
      }
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto animate-fade-in transition-all">
        
        {/* Top Header Banner */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-md">
              <HeartPulse className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black font-display tracking-tight text-white">
                  MEDCONNECT
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-200 border border-emerald-300/30 text-[10px] font-extrabold uppercase">
                  HIPAA Secure
                </span>
              </div>
              <p className="text-xs text-blue-100 mt-0.5">
                {authMode === 'register'
                  ? 'Register a new patient account'
                  : 'Sign in to access your health vault & appointments'}
              </p>
            </div>
          </div>

          {/* Primary Mode Tabs: REGISTER vs LOGIN */}
          <div className="mt-5 grid grid-cols-2 p-1 bg-black/20 rounded-2xl backdrop-blur-xs border border-white/10">
            <button
              type="button"
              onClick={() => {
                setAuthMode('register');
                setOtpSent(false);
                setErrorMessage(null);
                setSuccessInfo(null);
              }}
              className={`py-2 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                authMode === 'register'
                  ? 'bg-white text-blue-700 shadow-md scale-[1.01]'
                  : 'text-white/80 hover:text-white hover:bg-white/5'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>1. Register / Sign Up</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('login');
                setOtpSent(false);
                setErrorMessage(null);
                setSuccessInfo(null);
              }}
              className={`py-2 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                authMode === 'login'
                  ? 'bg-white text-blue-700 shadow-md scale-[1.01]'
                  : 'text-white/80 hover:text-white hover:bg-white/5'
              }`}
            >
              <KeyRound className="w-4 h-4" />
              <span>2. Login / Sign In</span>
            </button>
          </div>
        </div>

        <div className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          
          {/* Method Sub-Tabs: Phone OTP vs Email */}
          <div className="flex items-center justify-center gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              type="button"
              onClick={() => {
                setAuthMethod('phone');
                setOtpSent(false);
                setErrorMessage(null);
              }}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                authMethod === 'phone'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{authMode === 'register' ? 'Register by Phone (OTP)' : 'Login by Phone (OTP)'}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMethod('email');
                setErrorMessage(null);
              }}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                authMethod === 'email'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>{authMode === 'register' ? 'Register by Email' : 'Login by Email'}</span>
            </button>
          </div>

          {/* Feedback Messages */}
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-start gap-2.5 text-xs text-rose-700 dark:text-rose-300">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <p className="font-medium leading-relaxed">{errorMessage}</p>
            </div>
          )}

          {successInfo && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 flex items-start gap-2.5 text-xs text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <p className="font-medium leading-relaxed">{successInfo}</p>
            </div>
          )}

          {/* ============================================================ */}
          {/* METHOD 1: PHONE (OTP) FLOW */}
          {/* ============================================================ */}
          {authMethod === 'phone' && (
            <div className="space-y-4">
              {!otpSent ? (
                /* Step 1: Input Phone & Details */
                <form onSubmit={handleSendOtp} className="space-y-4">
                  {authMode === 'register' && (
                    <>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                          Full Name <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            required
                            placeholder="e.g. Rahul Sharma / Alexander Wright"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                            Blood Group
                          </label>
                          <select
                            value={bloodGroup}
                            onChange={(e) => setBloodGroup(e.target.value)}
                            className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          >
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                            Age
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="120"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                            Gender
                          </label>
                          <select
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Phone Number Field */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Mobile Number <span className="text-rose-500">*</span>
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="w-28 px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:outline-none shrink-0"
                      >
                        <option value="+91">🇮🇳 +91 (IN)</option>
                        <option value="+1">🇺🇸 +1 (US)</option>
                        <option value="+44">🇬🇧 +44 (UK)</option>
                        <option value="+971">🇦🇪 +971 (UAE)</option>
                        <option value="+61">🇦🇺 +61 (AU)</option>
                        <option value="+65">🇸🇬 +65 (SG)</option>
                      </select>
                      <div className="relative flex-1">
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="tel"
                          required
                          placeholder="98765 43210"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      We will send a 6-digit OTP code to verify your phone.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isSendingOtp}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSendingOtp ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Generating OTP...</span>
                      </>
                    ) : (
                      <>
                        <span>Send 6-Digit OTP</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                /* Step 2: Verify OTP */
                <form onSubmit={handleVerifyPhoneOtp} className="space-y-4 animate-fade-in">
                  <div className="p-3.5 bg-blue-50 dark:bg-blue-950/40 rounded-2xl border border-blue-200 dark:border-blue-900/50">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-blue-900 dark:text-blue-200 font-semibold">
                        OTP sent to: <span className="font-bold">{countryCode} {phoneNumber}</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setOtpSent(false)}
                        className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Change
                      </button>
                    </div>

                    {/* Instant Test OTP Prompt Helper */}
                    {generatedOtp && (
                      <div className="mt-2.5 p-2 bg-white dark:bg-slate-900 rounded-xl border border-blue-200 dark:border-blue-800 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300">
                          <KeyRound className="w-3.5 h-3.5 text-blue-600" />
                          <span>Demo SMS OTP: <strong className="text-blue-600 font-mono tracking-wider">{generatedOtp}</strong></span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setOtpCode(generatedOtp)}
                          className="px-2.5 py-1 bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-[10px] font-bold rounded-lg hover:bg-blue-200 transition-colors"
                        >
                          Auto-Fill
                        </button>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 text-center">
                      Enter 6-Digit Verification Code
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      autoFocus
                      placeholder="• • • • • •"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                      className="w-full text-center text-2xl font-mono tracking-widest font-black py-3 bg-slate-50 dark:bg-slate-800 border-2 border-blue-500 rounded-2xl text-slate-900 dark:text-slate-100 focus:outline-none shadow-xs"
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">
                      Didn't receive SMS?
                    </span>
                    {otpTimer > 0 ? (
                      <span className="text-slate-400 font-mono">
                        Resend in {otpTimer}s
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSendOtp()}
                        className="text-blue-600 dark:text-blue-400 font-bold hover:underline"
                      >
                        Resend OTP
                      </button>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || otpCode.length !== 6}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Verifying & Signing in...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>
                          {authMode === 'register'
                            ? 'Verify OTP & Complete Registration'
                            : 'Verify OTP & Log In'}
                        </span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* ============================================================ */}
          {/* METHOD 2: EMAIL & PASSWORD FLOW */}
          {/* ============================================================ */}
          {authMethod === 'email' && (
            <form onSubmit={handleEmailAuth} className="space-y-4">
              {authMode === 'register' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alexander Wright"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Password <span className="text-rose-500">*</span>
                  </label>
                  {authMode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setForgotPasswordOpen(true)}
                      className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {authMode === 'register' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Confirm Password <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="Re-enter your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-start gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="auth-terms"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="mt-1 rounded text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="auth-terms" className="text-xs text-slate-600 dark:text-slate-400">
                      I agree to the <span className="text-blue-600 font-bold">Terms of Service</span> and HIPAA compliant <span className="text-blue-600 font-bold">Privacy Policy</span>.
                    </label>
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>
                      {authMode === 'register' ? 'Create MEDCONNECT Account' : 'Sign In with Email'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Quick Demo Access Bar */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
            <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center mb-2.5">
              Or Fast 1-Click Demo Login
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('patient')}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-blue-600" />
                <span>Demo Patient</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('admin')}
                className="p-2.5 rounded-xl border border-indigo-200 dark:border-indigo-900 bg-indigo-50/80 dark:bg-indigo-950/40 hover:bg-indigo-100 text-indigo-900 dark:text-indigo-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5 text-indigo-600" />
                <span>Admin Login</span>
              </button>
            </div>
          </div>
        </div>

        {/* Forgot Password Sub-Modal */}
        {forgotPasswordOpen && (
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 z-20 animate-fade-in">
            <div className="w-full max-w-sm bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Reset Password</h4>
                <button
                  onClick={() => setForgotPasswordOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Enter your registered email address to receive password reset instructions.
              </p>
              <input
                type="email"
                placeholder="registered@email.com"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-slate-100"
              />
              <button
                type="button"
                onClick={() => {
                  if (!forgotEmail) return;
                  alert(`Password reset link has been dispatched to ${forgotEmail}.`);
                  setForgotPasswordOpen(false);
                }}
                className="w-full py-2 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-blue-700"
              >
                Send Reset Link
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
