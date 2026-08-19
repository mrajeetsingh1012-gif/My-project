import React, { useState, useEffect } from 'react';
import {
  MOCK_DOCTORS,
  MOCK_HOSPITALS,
  MOCK_BANNERS,
  MOCK_EMERGENCY_ALERTS,
  MOCK_CHRONIC_ALERTS,
  MOCK_APPOINTMENTS,
  MOCK_RECORDS,
  INITIAL_USER
} from './data/mockData';
import {
  Doctor,
  Hospital,
  Banner,
  EmergencyAlert,
  ChronicAlert,
  AppointmentRequest,
  MedicalRecord,
  UserProfile,
  FamilyProfile,
  RewardState,
  RedeemOption
} from './types';
import {
  seedInitialFirestoreData,
  subscribeDoctors,
  subscribeHospitals,
  subscribeBanners,
  subscribeEmergencyAlerts,
  subscribeAppointments,
  subscribeRecords,
  saveAppointmentToDb,
  saveRecordToDb,
  deleteRecordFromDb,
} from './lib/firestoreService';

// UI Components
import { TopAppBar } from './components/TopAppBar';
import { BottomNavBar } from './components/BottomNavBar';
import { NavigationDrawer } from './components/NavigationDrawer';
import { PulseFloatingButton } from './components/PulseFloatingButton';
import { MedConnectPulseModal } from './components/MedConnectPulseModal';
import { BannerCarousel } from './components/BannerCarousel';
import { EmergencyAlertsCard } from './components/EmergencyAlertsCard';
import { HomeSosSection } from './components/HomeSosSection';
import { HomeQuickActions } from './components/HomeQuickActions';
import { HomeHealthSection } from './components/HomeHealthSection';
import { DirectoryPage } from './components/DirectoryPage';
import { DoctorDetailModal } from './components/DoctorDetailModal';
import { HospitalDetailModal } from './components/HospitalDetailModal';
import { AppointmentsPage } from './components/AppointmentsPage';
import { AppointmentRequestModal } from './components/AppointmentRequestModal';
import { PrescriptionViewModal } from './components/PrescriptionViewModal';
import { RecordsVaultPage } from './components/RecordsVaultPage';
import { UploadRecordModal } from './components/UploadRecordModal';
import { EmergencySection } from './components/EmergencySection';
import { ProfilePage } from './components/ProfilePage';
import { FamilyProfilesModal } from './components/FamilyProfilesModal';
import { RewardsModal } from './components/RewardsModal';
import { SettingsModal } from './components/SettingsModal';
import { AdminPortal } from './components/AdminPortal';

export function App() {
  // Navigation & Role State
  const [currentTab, setCurrentTab] = useState<
    'home' | 'directory' | 'appointments' | 'records' | 'emergency' | 'profile' | 'admin'
  >('home');
  const [userRole, setUserRole] = useState<'patient' | 'admin'>('patient');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isPulseOpen, setIsPulseOpen] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  // App Data State (Synced in Real-Time with Firestore)
  const [doctors, setDoctors] = useState<Doctor[]>(MOCK_DOCTORS);
  const [hospitals, setHospitals] = useState<Hospital[]>(MOCK_HOSPITALS);
  const [banners, setBanners] = useState<Banner[]>(MOCK_BANNERS);
  const [emergencyAlerts, setEmergencyAlerts] = useState<EmergencyAlert[]>(MOCK_EMERGENCY_ALERTS);
  const [chronicAlerts, setChronicAlerts] = useState<ChronicAlert[]>(MOCK_CHRONIC_ALERTS);
  const [appointments, setAppointments] = useState<AppointmentRequest[]>(MOCK_APPOINTMENTS);
  const [records, setRecords] = useState<MedicalRecord[]>(MOCK_RECORDS);
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [familyProfiles, setFamilyProfiles] = useState<FamilyProfile[]>([
    {
      id: 'fam_1',
      name: 'Sarah Wright',
      relationship: 'Spouse',
      age: 36,
      gender: 'Female',
      bloodGroup: 'A+',
      allergies: ['Penicillin'],
    },
    {
      id: 'fam_2',
      name: 'Leo Wright',
      relationship: 'Child',
      age: 8,
      gender: 'Male',
      bloodGroup: 'O+',
      allergies: [],
    }
  ]);
  const [rewards, setRewards] = useState<RewardState>({
    points: 650,
    badges: ['Profile Complete', 'Health Tip Reader', 'Vault Master', 'Appointment Pro'],
    redeemOptions: [
      {
        id: 'rew_1',
        title: '$15 Consultation Discount Voucher',
        description: 'Redeemable for any in-person specialist consultation fee.',
        costPoints: 300,
        type: 'consultation_discount',
        discountAmount: 15,
      },
      {
        id: 'rew_2',
        title: 'Free Annual Preventive Health Checkup',
        description: 'Includes ECG, Blood Sugar, and Lipid screening at partner hospitals.',
        costPoints: 500,
        type: 'free_checkup',
      },
      {
        id: 'rew_3',
        title: '$10 Pharmacy Partner Gift Card',
        description: 'Valid for prescription medicines at verified network pharmacies.',
        costPoints: 200,
        type: 'pharmacy_voucher',
        discountAmount: 10,
      }
    ]
  });

  // Accessibility State
  const [accessibilitySettings, setAccessibilitySettings] = useState({
    darkMode: false,
    largeText: false,
    highContrast: false,
  });

  // Modal Detail States
  const [selectedDoctorForDetail, setSelectedDoctorForDetail] = useState<Doctor | null>(null);
  const [selectedHospitalForDetail, setSelectedHospitalForDetail] = useState<Hospital | null>(null);
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [requestModalInitialDoc, setRequestModalInitialDoc] = useState<Doctor | null>(null);
  const [selectedPrescriptionApp, setSelectedPrescriptionApp] = useState<AppointmentRequest | null>(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [familyModalOpen, setFamilyModalOpen] = useState(false);
  const [rewardsModalOpen, setRewardsModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Firestore Real-Time Synchronization & Seeding on Mount
  useEffect(() => {
    // Seed default data if collections are empty
    seedInitialFirestoreData();

    // Subscribe to Firestore collections
    const unsubDoctors = subscribeDoctors((docs) => {
      if (docs && docs.length > 0) setDoctors(docs);
    });

    const unsubHospitals = subscribeHospitals((hosps) => {
      if (hosps && hosps.length > 0) setHospitals(hosps);
    });

    const unsubBanners = subscribeBanners((bns) => {
      if (bns && bns.length > 0) setBanners(bns);
    });

    const unsubAlerts = subscribeEmergencyAlerts((alrts) => {
      if (alrts && alrts.length > 0) setEmergencyAlerts(alrts);
    });

    const unsubAppointments = subscribeAppointments((appts) => {
      if (appts && appts.length > 0) setAppointments(appts);
    });

    const unsubRecords = subscribeRecords((recs) => {
      if (recs && recs.length > 0) setRecords(recs);
    });

    return () => {
      unsubDoctors();
      unsubHospitals();
      unsubBanners();
      unsubAlerts();
      unsubAppointments();
      unsubRecords();
    };
  }, []);

  // Network offline listener
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Dark mode effect
  useEffect(() => {
    if (accessibilitySettings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [accessibilitySettings.darkMode]);

  // Handlers for Appointment Creation & Management (Syncs with Firestore)
  const handleCreateAppointment = async (reqData: any) => {
    const newApp: AppointmentRequest = {
      id: `app_${Date.now()}`,
      doctorId: reqData.doctorId,
      doctorName: reqData.doctorName,
      specialty: reqData.specialty,
      hospitalId: reqData.hospitalId,
      hospitalName: reqData.hospitalName,
      patientName: reqData.patientName,
      familyProfileId: reqData.familyProfileId,
      date: reqData.date,
      timeSlot: reqData.timeSlot,
      status: 'pending',
      reason: reqData.reason,
      createdAt: new Date().toISOString().split('T')[0],
    };

    // Save to Firestore
    await saveAppointmentToDb(newApp);

    setAppointments((prev) => [newApp, ...prev]);

    // Award rewards points for booking
    setRewards((prev) => ({
      ...prev,
      points: prev.points + 50,
    }));

    setToastMessage(`In-person appointment booked with Dr. ${newApp.doctorName}! (+50 pts) Saved to Firestore.`);
    setCurrentTab('appointments');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    setTimeout(() => {
      setToastMessage(null);
    }, 5000);
  };

  const handleCancelAppointment = async (id: string) => {
    const target = appointments.find((a) => a.id === id);
    if (target) {
      const updated = { ...target, status: 'cancelled' as const };
      await saveAppointmentToDb(updated);
    }
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'cancelled' } : a))
    );
  };

  const handleRescheduleAppointment = async (id: string, newDate: string, newSlot: string) => {
    const target = appointments.find((a) => a.id === id);
    if (target) {
      const updated = { ...target, date: newDate, timeSlot: newSlot, status: 'pending' as const };
      await saveAppointmentToDb(updated);
    }
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, date: newDate, timeSlot: newSlot, status: 'pending' } : a))
    );
  };

  // Handlers for Medical Record Upload & Delete (Syncs with Firestore)
  const handleUploadRecord = async (recordData: any) => {
    const newRec: MedicalRecord = {
      id: `rec_${Date.now()}`,
      userId: user.id,
      title: recordData.title,
      category: recordData.category,
      recordDate: recordData.recordDate,
      doctorName: recordData.doctorName,
      fileName: recordData.fileName,
      fileSize: recordData.fileSize,
      fileUrl: '#',
      uploadedAt: new Date().toISOString().split('T')[0],
      isDownloadedOffline: true,
      notes: recordData.notes,
    };

    // Save to Firestore
    await saveRecordToDb(newRec);

    setRecords((prev) => [newRec, ...prev]);

    // Award reward points for upload
    setRewards((prev) => ({
      ...prev,
      points: prev.points + 30,
    }));
  };

  const handleDeleteRecord = async (id: string) => {
    await deleteRecordFromDb(id);
    setRecords((prev) => prev.filter((r) => r.id !== id));
  };

  const handleToggleOfflineRecord = (id: string) => {
    setRecords((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isDownloadedOffline: true } : r))
    );
  };

  // Family Member Management
  const handleAddFamilyProfile = (profileData: any) => {
    const newFam: FamilyProfile = {
      id: `fam_${Date.now()}`,
      name: profileData.name,
      relationship: profileData.relationship,
      age: profileData.age,
      gender: profileData.gender,
      bloodGroup: profileData.bloodGroup,
      allergies: profileData.allergies,
    };
    setFamilyProfiles([...familyProfiles, newFam]);
  };

  const handleRemoveFamilyProfile = (id: string) => {
    setFamilyProfiles((prev) => prev.filter((f) => f.id !== id));
  };

  // Rewards Redeem Handler
  const handleRedeemReward = (option: RedeemOption) => {
    if (rewards.points >= option.costPoints) {
      setRewards((prev) => ({
        ...prev,
        points: prev.points - option.costPoints,
      }));
    }
  };

  // User Updates
  const handleUpdateUser = (updatedProps: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...updatedProps }));
  };

  return (
    <div
      className={`min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200 ${
        accessibilitySettings.largeText ? 'text-lg' : ''
      } ${accessibilitySettings.highContrast ? 'contrast-125' : ''}`}
    >
      {/* Top App Bar Header */}
      <TopAppBar
        currentTab={currentTab}
        onOpenDrawer={() => setIsDrawerOpen(true)}
        userRole={userRole}
        onToggleRole={(role) => setUserRole(role)}
        onOpenEmergency={() => setCurrentTab('emergency')}
        onOpenProfile={() => setCurrentTab('profile')}
        onOpenSettings={() => setSettingsModalOpen(true)}
        isOffline={isOffline}
      />

      {/* Slide-out Navigation Drawer */}
      <NavigationDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        currentTab={currentTab}
        activeTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          setIsDrawerOpen(false);
        }}
        setActiveTab={(tab) => {
          setCurrentTab(tab as any);
          setIsDrawerOpen(false);
        }}
        user={user}
        userRole={userRole}
        onToggleRole={(role) => setUserRole(role)}
        onOpenPulse={() => setIsPulseOpen(true)}
        onOpenAdmin={() => setCurrentTab('admin')}
        onOpenSettings={() => setSettingsModalOpen(true)}
        onOpenEmergency={() => setCurrentTab('emergency')}
        onOpenRewards={() => setRewardsModalOpen(true)}
        onOpenAppointments={() => setCurrentTab('appointments')}
        onOpenFamilyModal={() => setFamilyModalOpen(true)}
        onOpenNotifications={() => setSettingsModalOpen(true)}
        onOpenAuth={() => setSettingsModalOpen(true)}
        onOpenRecords={() => {
          setCurrentTab('records');
          setIsDrawerOpen(false);
        }}
        onOpenProfile={() => {
          setCurrentTab('profile');
          setIsDrawerOpen(false);
        }}
      />

      {/* Main Content View Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-4 mb-20 space-y-6">
        {/* Success Toast Notification */}
        {toastMessage && (
          <div className="p-4 rounded-2xl bg-emerald-600 text-white shadow-lg flex items-center justify-between gap-3 animate-fade-in font-bold text-xs sm:text-sm">
            <span>{toastMessage}</span>
            <button
              onClick={() => setToastMessage(null)}
              className="px-2 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-xs"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* VIEW 1: HOME DASHBOARD */}
        {currentTab === 'home' && (
          <div className="space-y-6 animate-fade-in">
            {/* Banner Carousel */}
            <BannerCarousel
              banners={banners}
              onOpenPulse={() => setIsPulseOpen(true)}
              onOpenDirectory={() => setCurrentTab('directory')}
              onOpenRecords={() => setCurrentTab('records')}
            />

            {/* Emergency & Chronic Alerts Cards */}
            <EmergencyAlertsCard
              emergencyAlerts={emergencyAlerts}
              chronicAlerts={chronicAlerts}
              onOpenEmergency={() => setCurrentTab('emergency')}
              onOpenChronic={() => setCurrentTab('emergency')}
            />

            {/* Central SOS Wheel & Emergency Dialing Section */}
            <HomeSosSection
              onTriggerSOS={() => setCurrentTab('emergency')}
            />

            {/* Quick Action Shortcuts */}
            <HomeQuickActions
              onOpenDirectory={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setCurrentTab('directory');
              }}
              onOpenAppointments={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setCurrentTab('appointments');
                setRequestModalOpen(true);
              }}
              onOpenRecords={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setCurrentTab('records');
              }}
              onOpenEmergency={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setCurrentTab('emergency');
              }}
            />

            {/* Health Section Dashboard */}
            <HomeHealthSection
              appointments={appointments}
              records={records}
              onOpenAppointments={() => setCurrentTab('appointments')}
              onOpenRecords={() => setCurrentTab('records')}
              onOpenDirectory={() => setCurrentTab('directory')}
              onSelectPrescription={(app) => setSelectedPrescriptionApp(app)}
            />
          </div>
        )}

        {/* VIEW 2: DIRECTORY */}
        {currentTab === 'directory' && (
          <div className="animate-fade-in">
            <DirectoryPage
              doctors={doctors}
              hospitals={hospitals}
              onSelectDoctor={(doc) => setSelectedDoctorForDetail(doc)}
              onSelectHospital={(hosp) => setSelectedHospitalForDetail(hosp)}
              onRequestAppointment={(doc) => {
                setRequestModalInitialDoc(doc);
                setRequestModalOpen(true);
              }}
            />
          </div>
        )}

        {/* VIEW 3: APPOINTMENTS */}
        {currentTab === 'appointments' && (
          <div className="animate-fade-in">
            <AppointmentsPage
              appointments={appointments}
              onOpenRequestModal={(doc) => {
                setRequestModalInitialDoc(doc || null);
                setRequestModalOpen(true);
              }}
              onCancelRequest={handleCancelAppointment}
              onRescheduleRequest={handleRescheduleAppointment}
              onViewPrescription={(app) => setSelectedPrescriptionApp(app)}
            />
          </div>
        )}

        {/* VIEW 4: RECORDS VAULT */}
        {currentTab === 'records' && (
          <div className="animate-fade-in">
            <RecordsVaultPage
              records={records}
              onOpenUploadModal={() => setUploadModalOpen(true)}
              onDeleteRecord={handleDeleteRecord}
              onToggleOffline={handleToggleOfflineRecord}
              isOffline={isOffline}
            />
          </div>
        )}

        {/* VIEW 5: EMERGENCY SOS */}
        {currentTab === 'emergency' && (
          <div className="animate-fade-in">
            <EmergencySection
              user={user}
              hospitals={hospitals}
            />
          </div>
        )}

        {/* VIEW 6: USER PROFILE */}
        {currentTab === 'profile' && (
          <div className="animate-fade-in">
            <ProfilePage
              user={user}
              familyProfiles={familyProfiles}
              rewards={rewards}
              onUpdateUser={handleUpdateUser}
              onOpenFamilyModal={() => setFamilyModalOpen(true)}
              onOpenRewardsModal={() => setRewardsModalOpen(true)}
              onLogout={() => alert('Signed out of session.')}
              accessibilitySettings={accessibilitySettings}
              onToggleDarkMode={() =>
                setAccessibilitySettings((prev) => ({ ...prev, darkMode: !prev.darkMode }))
              }
              onToggleLargeText={() =>
                setAccessibilitySettings((prev) => ({ ...prev, largeText: !prev.largeText }))
              }
              onToggleHighContrast={() =>
                setAccessibilitySettings((prev) => ({ ...prev, highContrast: !prev.highContrast }))
              }
            />
          </div>
        )}

        {/* VIEW 7: ADMIN PORTAL WITH SECURITY LOGIN GATE */}
        {currentTab === 'admin' && (
          <div className="animate-fade-in">
            <AdminPortal
              doctors={doctors}
              hospitals={hospitals}
              banners={banners}
              emergencyAlerts={emergencyAlerts}
              onAddDoctor={(newDoc) => setDoctors([newDoc, ...doctors])}
              onDeleteDoctor={(id) => setDoctors((prev) => prev.filter((d) => d.id !== id))}
              onAddHospital={(newHosp) => setHospitals([newHosp, ...hospitals])}
              onDeleteHospital={(id) => setHospitals((prev) => prev.filter((h) => h.id !== id))}
              onToggleBanner={(id) =>
                setBanners((prev) =>
                  prev.map((b) => (b.id === id ? { ...b, isActive: !b.isActive } : b))
                )
              }
              onToggleEmergencyAlert={(id) =>
                setEmergencyAlerts((prev) =>
                  prev.map((a) => (a.id === id ? { ...a, active: !a.active } : a))
                )
              }
              onClose={() => setCurrentTab('home')}
              userRole={userRole === 'admin' ? 'admin' : 'user'}
              onSwitchRole={(role) => setUserRole(role === 'admin' ? 'admin' : 'patient')}
            />
          </div>
        )}
      </main>

      {/* Pulse Floating Action Button (MedConnect Pulse AI) */}
      <PulseFloatingButton onClick={() => setIsPulseOpen(true)} />

      {/* Bottom Navigation Bar */}
      <BottomNavBar
        currentTab={currentTab}
        activeTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        setActiveTab={(tab) => setCurrentTab(tab)}
        userRole={userRole}
      />

      {/* MODALS */}

      {/* MedConnect Pulse Modal */}
      <MedConnectPulseModal
        isOpen={isPulseOpen}
        onClose={() => setIsPulseOpen(false)}
        user={user}
        onOpenEmergency={() => {
          setIsPulseOpen(false);
          setCurrentTab('emergency');
        }}
      />

      {/* Doctor Detail Modal */}
      <DoctorDetailModal
        doctor={selectedDoctorForDetail}
        onClose={() => setSelectedDoctorForDetail(null)}
        onRequestAppointment={(doc) => {
          setSelectedDoctorForDetail(null);
          setRequestModalInitialDoc(doc);
          setRequestModalOpen(true);
        }}
      />

      {/* Hospital Detail Modal */}
      <HospitalDetailModal
        hospital={selectedHospitalForDetail}
        onClose={() => setSelectedHospitalForDetail(null)}
      />

      {/* Request Appointment Modal */}
      <AppointmentRequestModal
        isOpen={requestModalOpen}
        onClose={() => setRequestModalOpen(false)}
        doctors={doctors}
        hospitals={hospitals}
        familyProfiles={familyProfiles}
        initialDoctor={requestModalInitialDoc}
        onSubmitRequest={handleCreateAppointment}
      />

      {/* Prescription View Modal */}
      <PrescriptionViewModal
        appointment={selectedPrescriptionApp}
        onClose={() => setSelectedPrescriptionApp(null)}
      />

      {/* Upload Record Modal */}
      <UploadRecordModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onUpload={handleUploadRecord}
      />

      {/* Family Profiles Modal */}
      <FamilyProfilesModal
        isOpen={familyModalOpen}
        onClose={() => setFamilyModalOpen(false)}
        familyProfiles={familyProfiles}
        onAddFamilyProfile={handleAddFamilyProfile}
        onRemoveFamilyProfile={handleRemoveFamilyProfile}
      />

      {/* Rewards Modal */}
      <RewardsModal
        isOpen={rewardsModalOpen}
        onClose={() => setRewardsModalOpen(false)}
        rewards={rewards}
        onRedeem={handleRedeemReward}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
        user={user}
        accessibilitySettings={accessibilitySettings}
        onToggleDarkMode={() =>
          setAccessibilitySettings((prev) => ({ ...prev, darkMode: !prev.darkMode }))
        }
        onToggleLargeText={() =>
          setAccessibilitySettings((prev) => ({ ...prev, largeText: !prev.largeText }))
        }
        onToggleHighContrast={() =>
          setAccessibilitySettings((prev) => ({ ...prev, highContrast: !prev.highContrast }))
        }
        onNavigateToProfile={() => setCurrentTab('profile')}
        onLogout={() => alert('Signed out of session.')}
        isOffline={isOffline}
        userRole={userRole === 'admin' ? 'admin' : 'user'}
        onSwitchRole={(role) => setUserRole(role === 'admin' ? 'admin' : 'patient')}
        onOpenAdminConsole={() => {
          setSettingsModalOpen(false);
          setCurrentTab('admin');
        }}
      />
    </div>
  );
}

export default App;
