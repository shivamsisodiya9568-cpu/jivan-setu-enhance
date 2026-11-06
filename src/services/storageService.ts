import { Ambulance, EmergencyReport, Hospital, EmergencyStatus, UserProfile, AuthUser, ServiceReview } from '../types/emergency';
import { evaluateEmergencyTriage } from './triageEngine';

const STORAGE_KEYS = {
  REPORTS: 'jivan_setu_reports_v2',
  AMBULANCES: 'jivan_setu_ambulances_v2',
  HOSPITALS: 'jivan_setu_hospitals_v2',
  ACTIVE_REPORT_ID: 'jivan_setu_active_report_id',
  USER_PROFILE: 'jivan_setu_user_profile_v2',
  AUTH_USER: 'jivan_setu_auth_user_v2',
  REVIEWS: 'jivan_setu_reviews_v2'
};

export const JIVAN_SETU_EVENT = 'jivan_setu_data_change';

function notifyChange() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(JIVAN_SETU_EVENT));
  }
}

// Default Seed Hospitals (e.g. realistic New Delhi / NCR medical hub)
const SEED_HOSPITALS: Hospital[] = [
  {
    id: 'HOSP-AIIMS-01',
    name: 'All India Institute of Medical Sciences (AIIMS) Apex Trauma Centre',
    shortName: 'AIIMS Apex Trauma',
    category: 'Apex Trauma Center',
    emergencyContact: '+91 11 2658 8500',
    traumaHotline: '011-2659-3333',
    location: {
      lat: 28.5672,
      lng: 77.2100,
      address: 'Ring Road, Safdarjung Enclave, New Delhi, Delhi 110029',
      landmark: 'Near Safdarjung Flyover'
    },
    availableIcuBeds: 6,
    totalIcuBeds: 30,
    availableTraumaBays: 3,
    bloodAvailability: {
      'O-': 8,
      'O+': 24,
      'A+': 18,
      'B+': 22,
      'AB+': 11
    },
    specialties: ['Level 1 Polytrauma', 'Neuro-trauma Surgery', 'Emergency Cardiothoracic', 'Severe Burn Unit', 'Pediatric ICU']
  },
  {
    id: 'HOSP-SJ-02',
    name: 'Safdarjung Hospital Emergency & Super-Specialty Block',
    shortName: 'Safdarjung ER',
    category: 'Super-Specialty Government',
    emergencyContact: '+91 11 2616 5060',
    traumaHotline: '011-2616-8336',
    location: {
      lat: 28.5709,
      lng: 77.2078,
      address: 'Ansari Nagar West, New Delhi, Delhi 110029',
      landmark: 'Opposite AIIMS Metro Gate 2'
    },
    availableIcuBeds: 4,
    totalIcuBeds: 25,
    availableTraumaBays: 2,
    bloodAvailability: {
      'O-': 5,
      'O+': 19,
      'A+': 14,
      'B+': 16,
      'AB+': 8
    },
    specialties: ['Comprehensive Burn Care', 'Orthopedic Trauma', 'Maxillofacial Surgery', 'Vascular Surgery']
  },
  {
    id: 'HOSP-RML-03',
    name: 'Dr. Ram Manohar Lohia Hospital Emergency Care Centre',
    shortName: 'Dr. RML Hospital',
    category: 'District Hospital',
    emergencyContact: '+91 11 2336 5525',
    traumaHotline: '011-2340-4286',
    location: {
      lat: 28.6256,
      lng: 77.2023,
      address: 'Baba Kharak Singh Marg, Connaught Place, New Delhi 110001',
      landmark: 'Near Gurudwara Bangla Sahib'
    },
    availableIcuBeds: 5,
    totalIcuBeds: 20,
    availableTraumaBays: 2,
    bloodAvailability: {
      'O-': 4,
      'O+': 15,
      'A+': 10,
      'B+': 12,
      'AB+': 6
    },
    specialties: ['Emergency Resuscitation', 'Toxicology & Poison Control', 'Acute Stroke Unit', 'Cardiac Catheterization']
  }
];

// Default Seed Ambulances
const SEED_AMBULANCES: Ambulance[] = [
  {
    id: 'AMB-108-DEL-01',
    vehicleNumber: 'DL 01 EM 1081',
    callSign: 'Eagle-1 (ALS)',
    type: 'Advanced Life Support (ALS)',
    driverName: 'Rajesh Kumar Sharma',
    paramedicName: 'Ritu Vashishta, EMT-P',
    phone: '+91 98765 43210',
    status: 'Available',
    baseStation: 'South Delhi Emergency Hub - Ring Road',
    currentLocation: {
      lat: 28.5600,
      lng: 77.2180,
      address: 'AIIMS Flyover Base, South Extension, New Delhi'
    },
    equipment: ['Zoll X Series Defibrillator', 'Hamilton T1 Transport Ventilator', 'Arterial Tourniquet Pack', 'Spinal Immobilization Kit', 'Suction Unit']
  },
  {
    id: 'AMB-108-DEL-02',
    vehicleNumber: 'DL 02 EM 1082',
    callSign: 'Falcon-2 (ALS)',
    type: 'Advanced Life Support (ALS)',
    driverName: 'Mohd. Imran',
    paramedicName: 'Sunil Negi, EMT-P',
    phone: '+91 98111 22334',
    status: 'Available',
    baseStation: 'Connaught Place Station - Central Delhi',
    currentLocation: {
      lat: 28.6310,
      lng: 77.2190,
      address: 'Outer Circle, Connaught Place, New Delhi'
    },
    equipment: ['Lifepak 15 Defibrillator', 'Oxygen Delivery System', 'Traction Splint Set', 'Advanced Airway Intubation Kit']
  },
  {
    id: 'AMB-108-DEL-03',
    vehicleNumber: 'DL 03 BLS 1083',
    callSign: 'Cheetah-3 (BLS)',
    type: 'Basic Life Support (BLS)',
    driverName: 'Virendra Singh',
    paramedicName: 'Amit Verma, EMT-B',
    phone: '+91 98222 33445',
    status: 'Available',
    baseStation: 'Safdarjung South Depot',
    currentLocation: {
      lat: 28.5750,
      lng: 77.1980,
      address: 'Green Park Extension, New Delhi'
    },
    equipment: ['AED Philips HeartStart', 'First-Aid Trauma Dressings', 'Collapsible Stretcher', 'Basic O2 Canister']
  }
];

export const DEFAULT_USER_PROFILE: UserProfile = {
  id: 'USER-DEF-01',
  fullName: 'Aarav Sharma',
  email: 'aarav.sharma@example.com',
  phone: '+91 98765 43210',
  location: 'Green Park Extension, New Delhi, Delhi 110016',
  geoLocation: {
    lat: 28.5584,
    lng: 77.2028,
    address: 'Green Park Extension, New Delhi, Delhi 110016',
    landmark: 'Near Green Park Metro'
  },
  bloodGroup: 'O+',
  age: 29,
  gender: 'Male',
  emergencyContactName: 'Sunita Sharma',
  emergencyContactPhone: '+91 98111 22334',
  emergencyContactRelation: 'Mother',
  medicalConditions: ['Mild Asthma'],
  allergies: ['Penicillin'],
  isOnboarded: true,
  avatarSeed: 'aarav',
  createdAt: '2026-01-15T09:00:00.000Z',
  updatedAt: new Date().toISOString()
};

export const DEFAULT_AUTH_USER: AuthUser = {
  id: 'USER-DEF-01',
  name: 'Aarav Sharma',
  email: 'aarav.sharma@example.com',
  role: 'bystander',
  profile: DEFAULT_USER_PROFILE
};

const SEED_REVIEWS: ServiceReview[] = [
  {
    id: 'REV-01',
    targetType: 'hospital',
    targetId: 'HOSP-AIIMS-01',
    targetName: 'AIIMS Apex Trauma Centre',
    authorName: 'Dr. Ritu Vashishta, EMT-P',
    rating: 5,
    tags: ['Rapid Handoff', 'Trauma Bay Ready', 'Cardiothoracic Support'],
    comment: 'The digital pre-alert arrived 6 minutes prior to our ambulance. By the time we backed into the bay, neurosurgery and the blood bank were fully mobilized. Exemplary coordination.',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    verifiedRescue: true
  },
  {
    id: 'REV-02',
    targetType: 'ambulance',
    targetId: 'AMB-108-DEL-01',
    targetName: 'Eagle-1 (ALS) - 108 Emergency Unit',
    authorName: 'Sunita Sharma',
    rating: 5,
    tags: ['4 Min Arrival', 'Calm Paramedic', 'High-Flow Oxygen'],
    comment: 'When my son collapsed with acute breathing difficulty, 1-tap SOS tracked our location automatically. Paramedics arrived in 4 minutes and saved his life.',
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    verifiedRescue: true
  },
  {
    id: 'REV-03',
    targetType: 'hospital',
    targetId: 'HOSP-SJ-02',
    targetName: 'Safdarjung Hospital Emergency & Super-Specialty',
    authorName: 'Mohd. Imran, Driver',
    rating: 4,
    tags: ['Dedicated Bay', 'Burn Unit', 'Clean Handover'],
    comment: 'Security and triage reception cleared the emergency lane immediately upon digital signal arrival. Very smooth patient transfer.',
    createdAt: new Date(Date.now() - 6 * 86400000).toISOString(),
    verifiedRescue: true
  },
  {
    id: 'REV-04',
    targetType: 'ambulance',
    targetId: 'AMB-108-DEL-02',
    targetName: 'Falcon-2 (ALS) - Connaught Place Hub',
    authorName: 'Rohan Sharma',
    rating: 5,
    tags: ['ECG en Route', 'Direct Cath Lab Alert', 'Professional'],
    comment: 'Transmitted mother’s 12-lead ECG directly to Dr. RML hospital while in transit. Cath lab was waiting for us with zero waiting room delay.',
    createdAt: new Date(Date.now() - 9 * 86400000).toISOString(),
    verifiedRescue: true
  }
];

// Pre-seeded realistic emergency reports for instant student demo
function generateSeedReports(): EmergencyReport[] {
  const t1 = evaluateEmergencyTriage({
    emergencyType: 'Road Accident',
    consciousness: 'Responds to Pain Only',
    breathing: 'Gasping / Struggling',
    severeBleeding: 'Severe - Spurting / Uncontrolled',
    suspectedInjuries: ['Head Trauma', 'Spinal / Neck Injury', 'Limb Fracture'],
    victimCount: 2,
    patientName: 'Arun Patel (Driver)',
    patientAge: 32,
    additionalNotes: 'Motorcycle collided with highway divider. Significant blood loss, helmet cracked.'
  });

  const report1: EmergencyReport = {
    id: 'JS-2026-9041',
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    reporterName: 'Vikram Mehta (Bystander)',
    reporterPhone: '+91 98711 00223',
    emergencyType: 'Road Accident',
    patientName: 'Arun Patel',
    patientAge: 32,
    patientGender: 'Male',
    victimCount: 2,
    consciousness: 'Responds to Pain Only',
    breathing: 'Gasping / Struggling',
    severeBleeding: 'Severe - Spurting / Uncontrolled',
    suspectedInjuries: ['Head Trauma', 'Spinal / Neck Injury', 'Limb Fracture'],
    additionalNotes: 'Motorcycle collided with highway divider. Significant blood loss, helmet cracked.',
    location: {
      lat: 28.5630,
      lng: 77.2085,
      address: 'Near Safdarjung Flyover, Ring Road Northbound, New Delhi',
      landmark: '50m before Safdarjung Bus Depot'
    },
    priority: t1.priority,
    priorityScore: t1.priorityScore,
    priorityReason: t1.priorityReason,
    warningSigns: t1.warningSigns,
    clinicalFlags: t1.clinicalFlags,
    status: 'En Route',
    statusHistory: [
      {
        status: 'Received',
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        actor: 'JIVAN SETU Emergency Gateway',
        note: 'Emergency report logged via public responder interface.'
      },
      {
        status: 'Accepted',
        timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
        actor: 'Paramedic Ritu Vashishta (Eagle-1 ALS)',
        note: 'Assigned crew acknowledged critical RED priority.'
      },
      {
        status: 'En Route',
        timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
        actor: 'Driver Rajesh Kumar',
        note: 'Ambulance dispatched. Siren active, estimated 4 mins to scene.'
      }
    ],
    assignedAmbulanceId: 'AMB-108-DEL-01',
    assignedHospitalId: 'HOSP-AIIMS-01',
    hospitalPreAlertSent: true,
    hospitalPreAlertAcknowledged: true,
    hospitalPreAlertTime: new Date(Date.now() - 6 * 60 * 1000).toISOString(),
    hospitalPreparationNotes: 'Trauma Bay 1 cleared. Neuro-surgeon alerted. Blood bank preparing 2 units O-negative.',
    hospitalPreparationItems: ['Trauma Bay 1', 'Blood Bank (2x O-)', 'Head CT on standby', 'Cervical Collar ready'],
    recommendedEquipment: t1.recommendedEquipment,
    sbarSummary: t1.sbarSummary,
    etaMinutes: 4,
    distanceKm: 1.8
  };

  const t2 = evaluateEmergencyTriage({
    emergencyType: 'Cardiac Arrest / Chest Pain',
    consciousness: 'Alert & Responsive',
    breathing: 'Rapid Shallow',
    severeBleeding: 'None',
    suspectedInjuries: [],
    victimCount: 1,
    patientName: 'Smt. Kamla Devi',
    patientAge: 58,
    additionalNotes: 'Severe crushing chest pain radiating to left shoulder and jaw for 40 minutes. Cold sweating.'
  });

  const report2: EmergencyReport = {
    id: 'JS-2026-9042',
    createdAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    reporterName: 'Rohan Sharma (Son)',
    reporterPhone: '+91 99990 12345',
    emergencyType: 'Cardiac Arrest / Chest Pain',
    patientName: 'Smt. Kamla Devi',
    patientAge: 58,
    patientGender: 'Female',
    victimCount: 1,
    consciousness: 'Alert & Responsive',
    breathing: 'Rapid Shallow',
    severeBleeding: 'None',
    suspectedInjuries: ['Crushing Retrosternal Chest Pain', 'Diaphoresis'],
    additionalNotes: 'Severe crushing chest pain radiating to left shoulder and jaw for 40 minutes. Cold sweating.',
    location: {
      lat: 28.6280,
      lng: 77.2140,
      address: 'Block B, Connaught Place, New Delhi',
      landmark: 'Near Rajiv Chowk Metro Gate 5'
    },
    priority: t2.priority,
    priorityScore: t2.priorityScore,
    priorityReason: t2.priorityReason,
    warningSigns: t2.warningSigns,
    clinicalFlags: t2.clinicalFlags,
    status: 'Patient Transporting',
    statusHistory: [
      {
        status: 'Received',
        timestamp: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
        actor: 'Gateway',
        note: 'Report received.'
      },
      {
        status: 'Accepted',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        actor: 'Falcon-2 Crew',
        note: 'ALS unit accepted.'
      },
      {
        status: 'Arrived',
        timestamp: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
        actor: 'Paramedic Sunil Negi',
        note: 'Arrived at scene. Administered supplemental O2, 12-lead ECG confirmed STEMI.'
      },
      {
        status: 'Patient Transporting',
        timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        actor: 'Falcon-2 Crew',
        note: 'Transporting to Dr. RML Hospital Cath Lab.'
      }
    ],
    assignedAmbulanceId: 'AMB-108-DEL-02',
    assignedHospitalId: 'HOSP-RML-03',
    hospitalPreAlertSent: true,
    hospitalPreAlertAcknowledged: true,
    hospitalPreAlertTime: new Date(Date.now() - 9 * 60 * 1000).toISOString(),
    hospitalPreparationNotes: 'Cath Lab on standby. Cardiologist Dr. Sen notified.',
    hospitalPreparationItems: ['Cath Lab activation', 'Aspirin/Ticagrelor protocol ready', 'Heparin IV line'],
    recommendedEquipment: t2.recommendedEquipment,
    sbarSummary: t2.sbarSummary,
    etaMinutes: 6,
    distanceKm: 2.4
  };

  return [report1, report2];
}

export const StorageService = {
  // Initialization
  init(): void {
    if (typeof window === 'undefined') return;

    if (!localStorage.getItem(STORAGE_KEYS.HOSPITALS)) {
      localStorage.setItem(STORAGE_KEYS.HOSPITALS, JSON.stringify(SEED_HOSPITALS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.AMBULANCES)) {
      localStorage.setItem(STORAGE_KEYS.AMBULANCES, JSON.stringify(SEED_AMBULANCES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.REPORTS)) {
      localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(generateSeedReports()));
    }
    if (!localStorage.getItem(STORAGE_KEYS.USER_PROFILE)) {
      localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(DEFAULT_USER_PROFILE));
    }
    if (!localStorage.getItem(STORAGE_KEYS.AUTH_USER)) {
      localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(DEFAULT_AUTH_USER));
    }
    if (!localStorage.getItem(STORAGE_KEYS.REVIEWS)) {
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(SEED_REVIEWS));
    }
  },

  // Reset to sample data
  resetAll(): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.HOSPITALS, JSON.stringify(SEED_HOSPITALS));
    localStorage.setItem(STORAGE_KEYS.AMBULANCES, JSON.stringify(SEED_AMBULANCES));
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(generateSeedReports()));
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(DEFAULT_USER_PROFILE));
    localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(DEFAULT_AUTH_USER));
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(SEED_REVIEWS));
    notifyChange();
  },

  // Reports
  getReports(): EmergencyReport[] {
    if (typeof window === 'undefined') return [];
    this.init();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REPORTS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  getReportById(id: string): EmergencyReport | undefined {
    return this.getReports().find(r => r.id === id);
  },

  saveReport(report: EmergencyReport): void {
    const list = this.getReports();
    const index = list.findIndex(r => r.id === report.id);
    if (index >= 0) {
      list[index] = { ...report, updatedAt: new Date().toISOString() };
    } else {
      list.unshift(report);
    }
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(list));
    localStorage.setItem(STORAGE_KEYS.ACTIVE_REPORT_ID, report.id);
    notifyChange();
  },

  updateReportStatus(
    id: string,
    newStatus: EmergencyStatus,
    actor: string,
    note: string,
    extraFields?: Partial<EmergencyReport>
  ): EmergencyReport | undefined {
    const list = this.getReports();
    const index = list.findIndex(r => r.id === id);
    if (index < 0) return undefined;

    const current = list[index];
    const historyEntry = {
      status: newStatus,
      timestamp: new Date().toISOString(),
      actor,
      note
    };

    const updated: EmergencyReport = {
      ...current,
      ...extraFields,
      status: newStatus,
      updatedAt: new Date().toISOString(),
      statusHistory: [...(current.statusHistory || []), historyEntry]
    };

    list[index] = updated;
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(list));
    notifyChange();
    return updated;
  },

  updateReportPatientInfo(
    id: string,
    updates: Partial<EmergencyReport>
  ): EmergencyReport | undefined {
    const list = this.getReports();
    const index = list.findIndex(r => r.id === id);
    if (index < 0) return undefined;

    const current = list[index];
    const updated: EmergencyReport = {
      ...current,
      ...updates,
      updatedAt: new Date().toISOString(),
      statusHistory: [
        ...(current.statusHistory || []),
        {
          status: current.status,
          timestamp: new Date().toISOString(),
          actor: 'Emergency Responder / Bystander',
          note: 'Patient clinical information updated and synchronized.'
        }
      ]
    };

    list[index] = updated;
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(list));
    notifyChange();
    return updated;
  },

  getActiveReportId(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_REPORT_ID);
  },

  setActiveReportId(id: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.ACTIVE_REPORT_ID, id);
    notifyChange();
  },

  // Ambulances
  getAmbulances(): Ambulance[] {
    if (typeof window === 'undefined') return [];
    this.init();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.AMBULANCES);
      return data ? JSON.parse(data) : SEED_AMBULANCES;
    } catch {
      return SEED_AMBULANCES;
    }
  },

  getAmbulanceById(id: string): Ambulance | undefined {
    return this.getAmbulances().find(a => a.id === id);
  },

  updateAmbulanceStatus(id: string, status: Ambulance['status'], extra?: Partial<Ambulance>): void {
    const list = this.getAmbulances();
    const index = list.findIndex(a => a.id === id);
    if (index >= 0) {
      list[index] = { ...list[index], status, ...extra };
      localStorage.setItem(STORAGE_KEYS.AMBULANCES, JSON.stringify(list));
      notifyChange();
    }
  },

  // Hospitals
  getHospitals(): Hospital[] {
    if (typeof window === 'undefined') return [];
    this.init();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HOSPITALS);
      return data ? JSON.parse(data) : SEED_HOSPITALS;
    } catch {
      return SEED_HOSPITALS;
    }
  },

  getHospitalById(id: string): Hospital | undefined {
    return this.getHospitals().find(h => h.id === id);
  },

  acknowledgeHospitalPreAlert(
    reportId: string, 
    notes: string, 
    items: string[]
  ): EmergencyReport | undefined {
    return this.updateReportStatus(
      reportId,
      'Accepted', // or keep existing status, setting preAlert acknowledged
      'Emergency Department Charge Nurse',
      `Hospital Pre-Alert Acknowledged. Action plan: ${notes}`,
      {
        hospitalPreAlertAcknowledged: true,
        hospitalPreparationNotes: notes,
        hospitalPreparationItems: items
      }
    );
  },

  // User Profile
  getUserProfile(): UserProfile {
    if (typeof window === 'undefined') return DEFAULT_USER_PROFILE;
    this.init();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      return data ? JSON.parse(data) : DEFAULT_USER_PROFILE;
    } catch {
      return DEFAULT_USER_PROFILE;
    }
  },

  saveUserProfile(profile: UserProfile): void {
    if (typeof window === 'undefined') return;
    const updated = { ...profile, updatedAt: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(updated));
    
    // Also sync with AuthUser if same ID
    const auth = this.getAuthUser();
    if (auth && auth.id === profile.id) {
      this.setAuthUser({ ...auth, name: profile.fullName, profile: updated });
    }
    notifyChange();
  },

  // Auth User
  getAuthUser(): AuthUser | null {
    if (typeof window === 'undefined') return DEFAULT_AUTH_USER;
    this.init();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
      return data ? JSON.parse(data) : DEFAULT_AUTH_USER;
    } catch {
      return DEFAULT_AUTH_USER;
    }
  },

  setAuthUser(user: AuthUser | null): void {
    if (typeof window === 'undefined') return;
    if (user) {
      localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
    }
    notifyChange();
  },

  // Reviews
  getReviews(): ServiceReview[] {
    if (typeof window === 'undefined') return [];
    this.init();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REVIEWS);
      return data ? JSON.parse(data) : SEED_REVIEWS;
    } catch {
      return SEED_REVIEWS;
    }
  },

  addReview(review: ServiceReview): void {
    const list = this.getReviews();
    list.unshift(review);
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(list));
    notifyChange();
  },

  // Legacy compatibility helpers
  getCleanupSettings(): any {
    return { enabled: false };
  },
  getAllProgress(): any {
    return {};
  },
  getLatestProgress(): any {
    return null;
  },
  saveProgress(_a?: any, _b?: any): void {},
  saveCleanupSettings(_settings: any): void {}
};

export const storageService = StorageService;

