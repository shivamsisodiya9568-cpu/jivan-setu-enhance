export type PriorityLevel = 'RED' | 'YELLOW' | 'GREEN';

export type EmergencyStatus = 
  | 'Received' 
  | 'Accepted' 
  | 'Ambulance Assigned' 
  | 'En Route' 
  | 'Arrived' 
  | 'Patient Transporting' 
  | 'Completed' 
  | 'Rejected';

export type UserRole = 'bystander' | 'ambulance' | 'hospital' | 'admin';

export type LanguageCode = 'en' | 'hi';

export type ConsciousnessLevel = 
  | 'Alert & Responsive' 
  | 'Responds to Voice' 
  | 'Responds to Pain Only' 
  | 'Unresponsive / Unconscious';

export type BreathingStatus = 
  | 'Normal' 
  | 'Gasping / Struggling' 
  | 'Rapid Shallow' 
  | 'Not Breathing';

export type BleedingLevel = 
  | 'Severe - Spurting / Uncontrolled' 
  | 'Moderate - Continuous Flow' 
  | 'Minor / Controlled' 
  | 'None';

export type EmergencyType = 
  | 'Road Accident' 
  | 'Cardiac Arrest / Chest Pain' 
  | 'Severe Trauma & Bleeding' 
  | 'Respiratory Distress / Choking' 
  | 'Stroke / Neurological' 
  | 'Severe Burn' 
  | 'Pregnancy & Labor Emergency' 
  | 'Fall / Fracture' 
  | 'Poisoning / Snakebite' 
  | 'Other Acute Medical';

export interface GeoLocation {
  lat: number;
  lng: number;
  address: string;
  landmark?: string;
  accuracyMeters?: number;
}

export interface EquipmentRecommendation {
  name: string;
  category: 'AIRWAY' | 'CIRCULATION' | 'IMMOBILIZATION' | 'DIAGNOSTIC' | 'MEDICATION_SUPPORT';
  priority: 'CRITICAL' | 'ESSENTIAL' | 'SUPPORT';
  rationale: string;
}

export interface SbarSummary {
  situation: string;
  background: string;
  assessment: string;
  recommendation: string;
}

export interface StatusHistoryEntry {
  status: EmergencyStatus;
  timestamp: string;
  actor: string;
  note: string;
}

export interface EmergencyReport {
  id: string; // e.g. JS-2026-8942
  createdAt: string;
  updatedAt: string;
  reporterName: string;
  reporterPhone: string;
  emergencyType: EmergencyType;
  patientName?: string;
  patientAge?: number;
  patientGender?: 'Male' | 'Female' | 'Other' | 'Unknown';
  victimCount: number;
  
  // Clinical Questionnaire
  consciousness: ConsciousnessLevel;
  breathing: BreathingStatus;
  severeBleeding: BleedingLevel;
  suspectedInjuries: string[];
  additionalNotes?: string;

  // Location
  location: GeoLocation;

  // Smart Patient Priority Output
  priority: PriorityLevel;
  priorityScore: number;
  priorityReason: string;
  warningSigns: string[];
  clinicalFlags: string[];

  // Operational Status
  status: EmergencyStatus;
  statusHistory: StatusHistoryEntry[];
  
  // Dispatch Coordination
  assignedAmbulanceId?: string;
  assignedHospitalId?: string;
  rejectionReason?: string;
  
  // Hospital Pre-Alert
  hospitalPreAlertSent: boolean;
  hospitalPreAlertAcknowledged: boolean;
  hospitalPreAlertTime?: string;
  hospitalPreparationNotes?: string;
  hospitalPreparationItems?: string[];

  // Clinical Decisions & SBAR
  recommendedEquipment: EquipmentRecommendation[];
  sbarSummary: SbarSummary;
  
  // ETA simulation
  etaMinutes?: number;
  distanceKm?: number;
}

export interface Ambulance {
  id: string; // e.g. AMB-108-DEL-01
  vehicleNumber: string;
  callSign: string;
  type: 'Advanced Life Support (ALS)' | 'Basic Life Support (BLS)' | 'Patient Transport (PTS)';
  driverName: string;
  paramedicName: string;
  phone: string;
  status: 'Available' | 'Assigned' | 'En Route' | 'At Scene' | 'Transporting' | 'Maintenance';
  currentLocation: GeoLocation;
  currentEmergencyId?: string;
  baseStation: string;
  equipment: string[];
}

export interface Hospital {
  id: string;
  name: string;
  shortName: string;
  category: 'Apex Trauma Center' | 'Super-Specialty Government' | 'Multi-Specialty Private' | 'District Hospital';
  emergencyContact: string;
  traumaHotline: string;
  location: GeoLocation;
  availableIcuBeds: number;
  totalIcuBeds: number;
  availableTraumaBays: number;
  bloodAvailability: {
    'O-': number;
    'O+': number;
    'A+': number;
    'B+': number;
    'AB+': number;
  };
  specialties: string[];
  distanceKmFromCenter?: number;
}

export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | 'Unknown';
export type Gender = 'Male' | 'Female' | 'Other' | 'Unknown';

export interface UserProfile {
  id: string;
  fullName: string;
  email?: string;
  phone: string;
  location: string;
  geoLocation?: GeoLocation;
  bloodGroup: BloodGroup;
  age: number;
  gender: Gender;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;
  medicalConditions: string[];
  allergies: string[];
  isOnboarded: boolean;
  avatarSeed?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  profile?: UserProfile;
}

export interface ServiceReview {
  id: string;
  targetType: 'hospital' | 'ambulance';
  targetId: string;
  targetName: string;
  authorName: string;
  rating: number; // 1 to 5
  tags: string[];
  comment: string;
  createdAt: string;
  verifiedRescue?: boolean;
}
