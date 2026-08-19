import {
  collection,
  doc,
  setDoc,
  getDocs,
  getDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  limit,
} from 'firebase/firestore';
import { db } from './firebase';
import {
  Doctor,
  Hospital,
  Banner,
  EmergencyAlert,
  AppointmentRequest,
  MedicalRecord,
  UserProfile,
} from '../types';
import {
  MOCK_DOCTORS,
  MOCK_HOSPITALS,
  MOCK_BANNERS,
  MOCK_EMERGENCY_ALERTS,
  MOCK_APPOINTMENTS,
  MOCK_RECORDS,
  INITIAL_USER,
} from '../data/mockData';

// Admin Config Interface
export interface AdminConfig {
  adminId: string;
  adminPasscode: string;
  secretApiKey?: string;
  customEndpoint?: string;
  enableReducedApiUsage: boolean;
  lastUpdated: string;
}

export const DEFAULT_ADMIN_CONFIG: AdminConfig = {
  adminId: 'admin@medconnect.org',
  adminPasscode: 'MEDCONNECT#2026',
  secretApiKey: '',
  customEndpoint: '',
  enableReducedApiUsage: true,
  lastUpdated: new Date().toISOString(),
};

/**
 * Helper to seed initial collections if Firestore is empty on initial boot
 */
export async function seedInitialFirestoreData() {
  try {
    const doctorsSnap = await getDocs(collection(db, 'doctors'));
    if (doctorsSnap.empty) {
      console.log('Seeding initial Firestore doctors...');
      for (const docItem of MOCK_DOCTORS) {
        await setDoc(doc(db, 'doctors', docItem.id), docItem);
      }
    }

    const hospSnap = await getDocs(collection(db, 'hospitals'));
    if (hospSnap.empty) {
      console.log('Seeding initial Firestore hospitals...');
      for (const hosp of MOCK_HOSPITALS) {
        await setDoc(doc(db, 'hospitals', hosp.id), hosp);
      }
    }

    const bannerSnap = await getDocs(collection(db, 'banners'));
    if (bannerSnap.empty) {
      console.log('Seeding initial Firestore banners...');
      for (const banner of MOCK_BANNERS) {
        await setDoc(doc(db, 'banners', banner.id), banner);
      }
    }

    const alertSnap = await getDocs(collection(db, 'emergencyAlerts'));
    if (alertSnap.empty) {
      console.log('Seeding initial Firestore alerts...');
      for (const alert of MOCK_EMERGENCY_ALERTS) {
        await setDoc(doc(db, 'emergencyAlerts', alert.id), alert);
      }
    }

    const configDoc = await getDoc(doc(db, 'adminConfigs', 'global'));
    if (!configDoc.exists()) {
      await setDoc(doc(db, 'adminConfigs', 'global'), DEFAULT_ADMIN_CONFIG);
    }
  } catch (err) {
    console.warn('Firestore seeding or connection note:', err);
  }
}

// 1. Doctors CRUD
export function subscribeDoctors(callback: (doctors: Doctor[]) => void) {
  try {
    const colRef = collection(db, 'doctors');
    return onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: Doctor[] = [];
          snapshot.forEach((d) => list.push(d.data() as Doctor));
          callback(list);
        } else {
          callback(MOCK_DOCTORS);
        }
      },
      (err) => {
        console.warn('Doctors listener fallback:', err);
        callback(MOCK_DOCTORS);
      }
    );
  } catch (e) {
    callback(MOCK_DOCTORS);
    return () => {};
  }
}

export async function saveDoctorToDb(doctor: Doctor) {
  try {
    await setDoc(doc(db, 'doctors', doctor.id), doctor);
  } catch (e) {
    console.error('Error saving doctor to Firestore:', e);
  }
}

export async function deleteDoctorFromDb(id: string) {
  try {
    await deleteDoc(doc(db, 'doctors', id));
  } catch (e) {
    console.error('Error deleting doctor from Firestore:', e);
  }
}

// 2. Hospitals CRUD
export function subscribeHospitals(callback: (hospitals: Hospital[]) => void) {
  try {
    const colRef = collection(db, 'hospitals');
    return onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: Hospital[] = [];
          snapshot.forEach((d) => list.push(d.data() as Hospital));
          callback(list);
        } else {
          callback(MOCK_HOSPITALS);
        }
      },
      (err) => {
        console.warn('Hospitals listener fallback:', err);
        callback(MOCK_HOSPITALS);
      }
    );
  } catch (e) {
    callback(MOCK_HOSPITALS);
    return () => {};
  }
}

export async function saveHospitalToDb(hospital: Hospital) {
  try {
    await setDoc(doc(db, 'hospitals', hospital.id), hospital);
  } catch (e) {
    console.error('Error saving hospital to Firestore:', e);
  }
}

export async function deleteHospitalFromDb(id: string) {
  try {
    await deleteDoc(doc(db, 'hospitals', id));
  } catch (e) {
    console.error('Error deleting hospital from Firestore:', e);
  }
}

// 3. Banners CRUD
export function subscribeBanners(callback: (banners: Banner[]) => void) {
  try {
    const colRef = collection(db, 'banners');
    return onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: Banner[] = [];
          snapshot.forEach((d) => list.push(d.data() as Banner));
          list.sort((a, b) => (a.priority || 0) - (b.priority || 0));
          callback(list);
        } else {
          callback(MOCK_BANNERS);
        }
      },
      (err) => {
        console.warn('Banners listener fallback:', err);
        callback(MOCK_BANNERS);
      }
    );
  } catch (e) {
    callback(MOCK_BANNERS);
    return () => {};
  }
}

export async function saveBannerToDb(banner: Banner) {
  try {
    await setDoc(doc(db, 'banners', banner.id), banner);
  } catch (e) {
    console.error('Error saving banner to Firestore:', e);
  }
}

// 4. Emergency Alerts CRUD
export function subscribeEmergencyAlerts(callback: (alerts: EmergencyAlert[]) => void) {
  try {
    const colRef = collection(db, 'emergencyAlerts');
    return onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: EmergencyAlert[] = [];
          snapshot.forEach((d) => list.push(d.data() as EmergencyAlert));
          callback(list);
        } else {
          callback(MOCK_EMERGENCY_ALERTS);
        }
      },
      (err) => {
        console.warn('Emergency alerts listener fallback:', err);
        callback(MOCK_EMERGENCY_ALERTS);
      }
    );
  } catch (e) {
    callback(MOCK_EMERGENCY_ALERTS);
    return () => {};
  }
}

export async function saveEmergencyAlertToDb(alert: EmergencyAlert) {
  try {
    await setDoc(doc(db, 'emergencyAlerts', alert.id), alert);
  } catch (e) {
    console.error('Error saving alert to Firestore:', e);
  }
}

// 5. Appointments CRUD
export function subscribeAppointments(callback: (appointments: AppointmentRequest[]) => void) {
  try {
    const colRef = collection(db, 'appointments');
    return onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: AppointmentRequest[] = [];
          snapshot.forEach((d) => list.push(d.data() as AppointmentRequest));
          callback(list);
        } else {
          callback(MOCK_APPOINTMENTS);
        }
      },
      (err) => {
        console.warn('Appointments listener fallback:', err);
        callback(MOCK_APPOINTMENTS);
      }
    );
  } catch (e) {
    callback(MOCK_APPOINTMENTS);
    return () => {};
  }
}

export async function saveAppointmentToDb(appointment: AppointmentRequest) {
  try {
    await setDoc(doc(db, 'appointments', appointment.id), appointment);
  } catch (e) {
    console.error('Error saving appointment to Firestore:', e);
  }
}

export async function deleteAppointmentFromDb(id: string) {
  try {
    await deleteDoc(doc(db, 'appointments', id));
  } catch (e) {
    console.error('Error deleting appointment from Firestore:', e);
  }
}

// 6. Medical Records CRUD
export function subscribeRecords(callback: (records: MedicalRecord[]) => void) {
  try {
    const colRef = collection(db, 'records');
    return onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: MedicalRecord[] = [];
          snapshot.forEach((d) => list.push(d.data() as MedicalRecord));
          callback(list);
        } else {
          callback(MOCK_RECORDS);
        }
      },
      (err) => {
        console.warn('Records listener fallback:', err);
        callback(MOCK_RECORDS);
      }
    );
  } catch (e) {
    callback(MOCK_RECORDS);
    return () => {};
  }
}

export async function saveRecordToDb(record: MedicalRecord) {
  try {
    await setDoc(doc(db, 'records', record.id), record);
  } catch (e) {
    console.error('Error saving record to Firestore:', e);
  }
}

export async function deleteRecordFromDb(id: string) {
  try {
    await deleteDoc(doc(db, 'records', id));
  } catch (e) {
    console.error('Error deleting record from Firestore:', e);
  }
}

// 7. Admin Global Configuration & Secret API Key Management
export function subscribeAdminConfig(callback: (config: AdminConfig) => void) {
  try {
    const docRef = doc(db, 'adminConfigs', 'global');
    return onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          callback(snapshot.data() as AdminConfig);
        } else {
          callback(DEFAULT_ADMIN_CONFIG);
        }
      },
      (err) => {
        console.warn('Admin config listener fallback:', err);
        callback(DEFAULT_ADMIN_CONFIG);
      }
    );
  } catch (e) {
    callback(DEFAULT_ADMIN_CONFIG);
    return () => {};
  }
}

export async function saveAdminConfigToDb(config: AdminConfig) {
  try {
    await setDoc(doc(db, 'adminConfigs', 'global'), {
      ...config,
      lastUpdated: new Date().toISOString(),
    });
  } catch (e) {
    console.error('Error saving admin config to Firestore:', e);
  }
}
