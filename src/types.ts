export type ThemeMode = 'light' | 'dark' | 'system';
export type RecordCategory = 'Prescription' | 'Lab Report' | 'Discharge Summary' | 'Vaccination' | 'Other';
export type AppointmentStatus = 'pending' | 'confirmed' | 'rescheduled' | 'cancelled' | 'completed';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  role: 'user' | 'admin';
  bloodGroup: string;
  allergies: string[];
  chronicConditions: string[];
  primaryContact: { name: string; phone: string; relation: string };
  secondaryContact: { name: string; phone: string; relation: string };
  pinCode?: string;
  isBiometricEnabled: boolean;
  language: string;
  theme: ThemeMode;
  isLargeText: boolean;
  rewardPoints: number;
  subscriptionPlan?: 'free' | 'plus';
  subscriptionPeriod?: 'monthly' | 'yearly';
  subscriptionExpiresAt?: string;
}

export interface PricingPlan {
  id: 'free' | 'plus';
  name: string;
  badge?: string;
  tagline: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: { text: string; included: boolean; isPlusOnly?: boolean }[];
}

export interface FamilyProfile {
  id: string;
  userId?: string;
  name: string;
  relationship: string;
  age: number;
  gender: string;
  bloodGroup: string;
  allergies?: string[];
  chronicConditions?: string[];
}

export interface Doctor {
  id: string;
  name: string;
  photo: string;
  qualification: string;
  specialty: string;
  experienceYears: number;
  languages: string[];
  fee: number;
  hospitalId: string;
  hospitalName: string;
  rating: number;
  availableDays: string[];
  timeSlots: string[];
  bio: string;
}

export interface Hospital {
  id: string;
  name: string;
  photo: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  emergencyPhone: string;
  services: string[];
  latitude: number;
  longitude: number;
  distanceKm?: number;
}

export interface AppointmentRequest {
  id: string;
  userId?: string;
  userName?: string;
  patientName: string;
  familyProfileId?: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  hospitalId: string;
  hospitalName: string;
  date: string;
  timeSlot: string;
  status: AppointmentStatus;
  reason: string;
  notes?: string;
  prescriptionSummary?: {
    summary: string;
    diagnosis: string;
    medicines: Array<{ name: string; dosage: string; duration: string }>;
    advice: string;
    date: string;
  };
  createdAt: string;
}

export interface MedicalRecord {
  id: string;
  userId: string;
  familyProfileId?: string;
  title: string;
  category: RecordCategory;
  recordDate: string;
  fileUrl?: string;
  fileName: string;
  fileSize: string;
  doctorName?: string;
  notes?: string;
  isDownloadedOffline: boolean;
  uploadedAt: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  badge?: string;
  actionUrl?: string;
  isActive: boolean;
  priority: number;
}

export interface EmergencyAlert {
  id: string;
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'info';
  date: string;
  active: boolean;
}

export interface ChronicAlert {
  id: string;
  title: string;
  description: string;
  reminderTime: string;
  active: boolean;
}

export interface RewardOffer {
  id: string;
  title: string;
  category: string;
  pointsCost: number;
  code: string;
  expiryDate: string;
  discountDescription: string;
  isRedeemed?: boolean;
}

export interface RedeemOption {
  id: string;
  title: string;
  description: string;
  costPoints: number;
  type: string;
  discountAmount?: number;
}

export interface RewardState {
  points: number;
  badges: string[];
  redeemOptions: RedeemOption[];
}

export interface RewardTransaction {
  id: string;
  date: string;
  title: string;
  points: number;
  type: 'earned' | 'redeemed';
}

export interface SosLog {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  latitude: number;
  longitude: number;
  address: string;
  contactsNotified: string[];
  timestamp: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'appointment' | 'prescription' | 'health' | 'reward' | 'announcement' | 'emergency';
  date: string;
  read: boolean;
}

export interface FeedbackItem {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface PulseMessage {
  id: string;
  sender: 'user' | 'pulse';
  text: string;
  timestamp: string;
  imageUrl?: string;
  isDisclaimer?: boolean;
}

export interface FirstAidGuide {
  id: string;
  title: string;
  icon: string;
  description: string;
  steps: string[];
  warning: string;
}
