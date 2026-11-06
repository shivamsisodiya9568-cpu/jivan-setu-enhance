import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  Ambulance, 
  EmergencyReport, 
  EmergencyStatus, 
  EmergencyType,
  Hospital, 
  LanguageCode, 
  UserRole,
  UserProfile,
  AuthUser,
  ServiceReview
} from '../types/emergency';
import { JIVAN_SETU_EVENT, StorageService, DEFAULT_USER_PROFILE, DEFAULT_AUTH_USER } from '../services/storageService';
import { evaluateEmergencyTriage, TriageInput } from '../services/triageEngine';

interface NotificationToast {
  id: string;
  type: 'info' | 'success' | 'warning' | 'danger';
  title: string;
  message: string;
}

interface JivanSetuContextType {
  role: UserRole;
  language: LanguageCode;
  reports: EmergencyReport[];
  activeReport: EmergencyReport | null;
  ambulances: Ambulance[];
  hospitals: Hospital[];
  toasts: NotificationToast[];
  userProfile: UserProfile;
  authUser: AuthUser | null;
  reviews: ServiceReview[];
  setRole: (role: UserRole) => void;
  setLanguage: (lang: LanguageCode) => void;
  setActiveReportId: (id: string) => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  login: (email: string, role?: UserRole) => void;
  logout: () => void;
  submitReview: (review: Omit<ServiceReview, 'id' | 'createdAt'>) => void;
  submitReport: (input: TriageInput & {
    reporterName?: string;
    reporterPhone?: string;
    location: { lat: number; lng: number; address: string; landmark?: string };
    patientGender?: 'Male' | 'Female' | 'Other' | 'Unknown';
  }) => EmergencyReport;
  submitQuickSos: (params: {
    location: { lat: number; lng: number; address: string; landmark?: string };
    emergencyType?: EmergencyType;
    callerPhone?: string;
    conditionSummary?: string;
  }) => EmergencyReport;
  triggerProfileSos: (params?: {
    emergencyType?: EmergencyType;
    customLocation?: { lat: number; lng: number; address: string; landmark?: string };
    conditionSummary?: string;
  }) => EmergencyReport;
  updatePatientInfo: (id: string, updates: Partial<EmergencyReport>) => EmergencyReport | undefined;
  updateStatus: (
    id: string,
    status: EmergencyStatus,
    actor: string,
    note: string,
    extra?: Partial<EmergencyReport>
  ) => void;
  acknowledgeHospitalPreAlert: (reportId: string, notes: string, items: string[]) => void;
  resetAllData: () => void;
  addToast: (type: NotificationToast['type'], title: string, message: string) => void;
  removeToast: (id: string) => void;
}

const JivanSetuContext = createContext<JivanSetuContextType | undefined>(undefined);

export const JivanSetuProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<UserRole>('bystander');
  const [language, setLanguageState] = useState<LanguageCode>('en');
  const [reports, setReports] = useState<EmergencyReport[]>([]);
  const [ambulances, setAmbulances] = useState<Ambulance[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [activeReportId, setActiveReportIdState] = useState<string | null>(null);
  const [toasts, setToasts] = useState<NotificationToast[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_USER_PROFILE);
  const [authUser, setAuthUser] = useState<AuthUser | null>(DEFAULT_AUTH_USER);
  const [reviews, setReviews] = useState<ServiceReview[]>([]);

  // Reload data from StorageService
  const refreshData = () => {
    const r = StorageService.getReports();
    const a = StorageService.getAmbulances();
    const h = StorageService.getHospitals();
    const activeId = StorageService.getActiveReportId();
    const p = StorageService.getUserProfile();
    const u = StorageService.getAuthUser();
    const revs = StorageService.getReviews();

    setReports(r);
    setAmbulances(a);
    setHospitals(h);
    setUserProfile(p);
    setAuthUser(u);
    setReviews(revs);

    if (u && u.role && u.role !== role) {
      setRoleState(u.role);
    }

    if (activeId) {
      setActiveReportIdState(activeId);
    } else if (r.length > 0) {
      setActiveReportIdState(r[0].id);
    }
  };

  useEffect(() => {
    StorageService.init();
    refreshData();

    // Listen for cross-component / cross-tab changes
    const handler = () => {
      refreshData();
    };

    window.addEventListener(JIVAN_SETU_EVENT, handler);
    return () => {
      window.removeEventListener(JIVAN_SETU_EVENT, handler);
    };
  }, []);

  const addToast = (type: NotificationToast['type'], title: string, message: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 6000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    if (authUser) {
      StorageService.setAuthUser({ ...authUser, role: newRole });
    }
    addToast('info', 'Active Portal Switched', `Switched to ${newRole.toUpperCase()} view.`);
  };

  const setLanguage = (newLang: LanguageCode) => {
    setLanguageState(newLang);
  };

  const setActiveReportId = (id: string) => {
    StorageService.setActiveReportId(id);
    setActiveReportIdState(id);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    const current = StorageService.getUserProfile();
    const updated: UserProfile = {
      ...current,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    StorageService.saveUserProfile(updated);
    refreshData();
    addToast('success', 'Profile Updated', 'Saved emergency profile synchronized.');
  };

  const login = (email: string, preferredRole?: UserRole) => {
    const prof = StorageService.getUserProfile();
    const userRole = preferredRole || 'bystander';
    const user: AuthUser = {
      id: prof.id || 'USER-DEF-01',
      name: prof.fullName || 'Citizen User',
      email,
      role: userRole,
      profile: prof
    };
    StorageService.setAuthUser(user);
    setRoleState(userRole);
    refreshData();
    addToast('success', 'Signed In', `Welcome back, ${user.name}!`);
  };

  const logout = () => {
    StorageService.setAuthUser(null);
    setRoleState('bystander');
    refreshData();
    addToast('info', 'Signed Out', 'You have been logged out.');
  };

  const submitReview = (newRev: Omit<ServiceReview, 'id' | 'createdAt'>) => {
    const review: ServiceReview = {
      ...newRev,
      id: `REV-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    StorageService.addReview(review);
    refreshData();
    addToast('success', 'Review Submitted', 'Thank you! Your feedback helps emergency responders.');
  };

  const submitReport = (input: TriageInput & {
    reporterName?: string;
    reporterPhone?: string;
    location: { lat: number; lng: number; address: string; landmark?: string };
    patientGender?: 'Male' | 'Female' | 'Other' | 'Unknown';
  }): EmergencyReport => {
    const triage = evaluateEmergencyTriage(input);

    // Generate unique ID: JS-YYYY-XXXX
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newId = `JS-${new Date().getFullYear()}-${randomSuffix}`;

    // Select nearest hospital and ambulance
    const assignedAmb = ambulances.find(a => a.status === 'Available') || ambulances[0];
    const assignedHosp = hospitals[0];

    const safeReporterName = input.reporterName?.trim() || 'Anonymous Bystander';
    const safeReporterPhone = input.reporterPhone?.trim() || 'Not provided';

    const newReport: EmergencyReport = {
      id: newId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      reporterName: safeReporterName,
      reporterPhone: safeReporterPhone,
      emergencyType: input.emergencyType,
      patientName: input.patientName,
      patientAge: input.patientAge,
      patientGender: input.patientGender || 'Unknown',
      victimCount: input.victimCount || 1,
      consciousness: input.consciousness,
      breathing: input.breathing,
      severeBleeding: input.severeBleeding,
      suspectedInjuries: input.suspectedInjuries || [],
      additionalNotes: input.additionalNotes || '',
      location: input.location,
      priority: triage.priority,
      priorityScore: triage.priorityScore,
      priorityReason: triage.priorityReason,
      warningSigns: triage.warningSigns,
      clinicalFlags: triage.clinicalFlags,
      status: 'Received',
      statusHistory: [
        {
          status: 'Received',
          timestamp: new Date().toISOString(),
          actor: `${safeReporterName} (Jivan Setu User)`,
          note: `Incident registered with priority ${triage.priority}. Emergency ID generated.`
        }
      ],
      assignedAmbulanceId: assignedAmb?.id,
      assignedHospitalId: assignedHosp?.id,
      hospitalPreAlertSent: triage.priority === 'RED',
      hospitalPreAlertAcknowledged: false,
      recommendedEquipment: triage.recommendedEquipment,
      sbarSummary: triage.sbarSummary,
      etaMinutes: triage.priority === 'RED' ? 5 : 8,
      distanceKm: 2.1
    };

    StorageService.saveReport(newReport);
    refreshData();

    addToast(
      triage.priority === 'RED' ? 'danger' : 'warning',
      `Emergency Transmitted: ${newId}`,
      `Classified as ${triage.priority}. Ambulance ${assignedAmb?.callSign || '108 Unit'} notified.`
    );

    return newReport;
  };

  const submitQuickSos = (params: {
    location: { lat: number; lng: number; address: string; landmark?: string };
    emergencyType?: EmergencyType;
    callerPhone?: string;
    conditionSummary?: string;
  }): EmergencyReport => {
    return submitReport({
      emergencyType: params.emergencyType || 'Other Acute Medical',
      reporterName: 'Emergency SOS Requester',
      reporterPhone: params.callerPhone || 'Not provided',
      location: params.location,
      consciousness: 'Alert & Responsive',
      breathing: 'Gasping / Struggling',
      severeBleeding: 'None',
      suspectedInjuries: [],
      victimCount: 1,
      additionalNotes: params.conditionSummary || 'Immediate 1-Tap SOS ambulance booking triggered from Home Screen.'
    });
  };

  // Automated 1-Tap SOS using saved UserProfile
  const triggerProfileSos = (params?: {
    emergencyType?: EmergencyType;
    customLocation?: { lat: number; lng: number; address: string; landmark?: string };
    conditionSummary?: string;
  }): EmergencyReport => {
    const prof = StorageService.getUserProfile();
    const fallbackLocation = {
      lat: 28.5630,
      lng: 77.2085,
      address: prof.location || 'Green Park Extension, New Delhi, Delhi 110016',
      landmark: 'Registered Residential Address'
    };

    const locationToUse = params?.customLocation || prof.geoLocation || fallbackLocation;

    const medicalSummary = [
      `Blood Group: ${prof.bloodGroup}`,
      `Age: ${prof.age} (${prof.gender})`,
      `Emergency Contact: ${prof.emergencyContactName} (${prof.emergencyContactPhone} - ${prof.emergencyContactRelation})`,
      prof.medicalConditions?.length ? `Medical Conditions: ${prof.medicalConditions.join(', ')}` : null,
      prof.allergies?.length ? `Known Allergies: ${prof.allergies.join(', ')}` : null
    ].filter(Boolean).join(' | ');

    const combinedNotes = `${params?.conditionSummary || '1-Tap Emergency SOS Dispatched.'}\n[SAVED PATIENT PROFILE: ${medicalSummary}]`;

    return submitReport({
      emergencyType: params?.emergencyType || 'Cardiac Arrest / Chest Pain',
      reporterName: prof.fullName,
      reporterPhone: prof.phone,
      patientName: prof.fullName,
      patientAge: prof.age,
      patientGender: prof.gender === 'Unknown' ? 'Male' : prof.gender,
      location: locationToUse,
      consciousness: 'Alert & Responsive',
      breathing: 'Gasping / Struggling',
      severeBleeding: 'None',
      suspectedInjuries: [],
      victimCount: 1,
      additionalNotes: combinedNotes
    });
  };

  const updatePatientInfo = (id: string, updates: Partial<EmergencyReport>): EmergencyReport | undefined => {
    const updated = StorageService.updateReportPatientInfo(id, updates);
    if (updated) {
      refreshData();
      addToast('success', 'Patient Vitals Synchronized', `Emergency record ${id} updated with clinical info.`);
    }
    return updated;
  };

  const updateStatus = (
    id: string,
    status: EmergencyStatus,
    actor: string,
    note: string,
    extra?: Partial<EmergencyReport>
  ) => {
    StorageService.updateReportStatus(id, status, actor, note, extra);
    refreshData();
    addToast('info', `Status Updated: ${status}`, `${actor}: ${note}`);
  };

  const acknowledgeHospitalPreAlert = (reportId: string, notes: string, items: string[]) => {
    StorageService.acknowledgeHospitalPreAlert(reportId, notes, items);
    refreshData();
    addToast('success', 'Pre-Alert Acknowledged', 'Emergency department trauma bay prepared.');
  };

  const resetAllData = () => {
    StorageService.resetAll();
    refreshData();
    addToast('info', 'System Reset', 'Restored original demo dataset with sample emergencies.');
  };

  const activeReport = reports.find(r => r.id === activeReportId) || reports[0] || null;

  return (
    <JivanSetuContext.Provider
      value={{
        role,
        language,
        reports,
        activeReport,
        ambulances,
        hospitals,
        toasts,
        userProfile,
        authUser,
        reviews,
        setRole,
        setLanguage,
        setActiveReportId,
        updateProfile,
        login,
        logout,
        submitReview,
        submitReport,
        submitQuickSos,
        triggerProfileSos,
        updatePatientInfo,
        updateStatus,
        acknowledgeHospitalPreAlert,
        resetAllData,
        addToast,
        removeToast
      }}
    >
      {children}
    </JivanSetuContext.Provider>
  );
};

export function useJivanSetu() {
  const ctx = useContext(JivanSetuContext);
  if (!ctx) {
    throw new Error('useJivanSetu must be used within JivanSetuProvider');
  }
  return ctx;
}
