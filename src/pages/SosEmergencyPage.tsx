import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Activity, 
  AlertCircle, 
  AlertOctagon, 
  AlertTriangle, 
  Ambulance, 
  ArrowLeft, 
  Building2, 
  Check, 
  CheckCircle2, 
  Clock, 
  Heart, 
  HeartPulse, 
  LocateFixed, 
  MapPin, 
  Phone, 
  PhoneCall, 
  ShieldAlert, 
  ShieldCheck, 
  User, 
  Users, 
  X 
} from 'lucide-react';
import { useJivanSetu } from '../context/JivanSetuContext';
import { EmergencyReport, EmergencyType } from '../types/emergency';
import { LeafletMap } from '../components/map/LeafletMap';

const EMERGENCY_TYPES: { type: EmergencyType; label: string; icon: string; description: string }[] = [
  { type: 'Cardiac Arrest / Chest Pain', label: 'Heart Attack / Chest Pain', icon: '❤️', description: 'Severe chest tightness, radiating pain, breathlessness' },
  { type: 'Road Accident', label: 'Road Accident / Crash', icon: '🚗', description: 'Vehicular collision, highway trauma, pedestrian hit' },
  { type: 'Severe Trauma & Bleeding', label: 'Severe Bleeding & Trauma', icon: '🩸', description: 'Uncontrolled bleeding, deep puncture, fall from height' },
  { type: 'Respiratory Distress / Choking', label: 'Choking / Breathing Trouble', icon: '🫁', description: 'Gasping, airway obstruction, acute asthma attack' },
  { type: 'Stroke / Neurological', label: 'Stroke / Brain Emergency', icon: '🧠', description: 'Facial drooping, arm weakness, speech slurring' },
  { type: 'Pregnancy & Labor Emergency', label: 'Maternity / Labor Crisis', icon: '🤰', description: 'Active contractions, water break, fetal distress' },
  { type: 'Poisoning / Snakebite', label: 'Poisoning / Snakebite', icon: '⚠️', description: 'Toxic chemical ingestion, reptile bite, overdose' },
  { type: 'Other Acute Medical', label: 'Other Critical Medical', icon: '🚨', description: 'Unconscious collapse, acute high fever, severe pain' }
];

export const SosEmergencyPage: React.FC = () => {
  const navigate = useNavigate();
  const { userProfile, triggerProfileSos, ambulances, hospitals, addToast } = useJivanSetu();

  const [selectedType, setSelectedType] = useState<EmergencyType>('Cardiac Arrest / Chest Pain');
  const [gpsLocation, setGpsLocation] = useState({
    lat: userProfile.geoLocation?.lat || 28.5630,
    lng: userProfile.geoLocation?.lng || 77.2085,
    address: userProfile.location || 'Green Park Extension, New Delhi, Delhi 110016',
    landmark: 'Live GPS Pin',
    accuracyMeters: 12
  });
  const [isLocating, setIsLocating] = useState(false);
  const [locationLocked, setLocationLocked] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [activeReport, setActiveReport] = useState<EmergencyReport | null>(null);

  // Auto-request GPS on page load
  useEffect(() => {
    requestLiveGps();
  }, []);

  // Countdown timer for safe SOS dispatch
  useEffect(() => {
    if (countdown === null) return;
    if (countdown <= 0) {
      dispatchSosNow();
      return;
    }
    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const requestLiveGps = () => {
    if (!navigator.geolocation) {
      addToast('warning', 'GPS Unsupported', 'Please enter your location manually.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        setLocationLocked(true);
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setGpsLocation({
          lat,
          lng,
          address: userProfile.location || `Live GPS Coordinates: ${lat.toFixed(4)}, ${lng.toFixed(4)}`,
          landmark: 'Auto-detected via Mobile Geolocation',
          accuracyMeters: Math.round(pos.coords.accuracy)
        });
        addToast('success', 'Satellite GPS Locked', 'Accurate emergency coordinates acquired.');
      },
      () => {
        setIsLocating(false);
        setLocationLocked(false);
        addToast('info', 'Default Location Used', 'Using your registered address.');
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const startCountdown = () => {
    setCountdown(3);
  };

  const cancelCountdown = () => {
    setCountdown(null);
    addToast('info', 'SOS Cancelled', 'Emergency dispatch sequence aborted.');
  };

  const dispatchSosNow = () => {
    setCountdown(null);
    const rep = triggerProfileSos({
      emergencyType: selectedType,
      customLocation: gpsLocation,
      conditionSummary: `Emergency 1-Tap SOS launched for ${selectedType}.`
    });
    setActiveReport(rep);
    addToast('danger', 'EMERGENCY DISPATCHED', `Incident ${rep.id} broadcast to 108 units.`);
  };

  const assignedAmb = ambulances.find(a => a.id === activeReport?.assignedAmbulanceId) || ambulances[0];
  const assignedHosp = hospitals.find(h => h.id === activeReport?.assignedHospitalId) || hospitals[0];

  return (
    <div className="min-h-screen bg-white dark:bg-navy-950 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Back Link & Title */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Dashboard</span>
          </button>

          <a
            href="tel:112"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm"
          >
            <PhoneCall className="w-3.5 h-3.5 text-emergency-500" />
            <span>Official Emergency: Dial 112</span>
          </a>
        </div>

        {/* IF SOS NOT YET DISPATCHED: Show Emergency Setup & Big SOS Trigger */}
        {!activeReport ? (
          <div className="space-y-6">

            {/* Profile Auto-Retrieval Banner */}
            <div className="bg-slate-50 dark:bg-navy-900 rounded-3xl p-5 border border-slate-200 dark:border-navy-800 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-950/60 text-emergency-600 flex items-center justify-center font-black text-xl shrink-0">
                    {userProfile.bloodGroup || 'O+'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {userProfile.fullName}
                      </h3>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                        Profile Auto-Attached
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Age: {userProfile.age} • Gender: {userProfile.gender} • Emergency Contact: {userProfile.emergencyContactName} ({userProfile.emergencyContactPhone})
                    </p>
                  </div>
                </div>

                {/* GPS Status Indicator */}
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button
                    onClick={requestLiveGps}
                    disabled={isLocating}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50"
                  >
                    <LocateFixed className={`w-3.5 h-3.5 text-emergency-600 ${isLocating ? 'animate-spin' : ''}`} />
                    <span>{locationLocked ? 'GPS Locked' : 'Refresh GPS'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Emergency Type Selector */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Select Nature of Emergency
                </label>
                <span className="text-xs text-slate-400">Tap to select condition</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {EMERGENCY_TYPES.map((item) => {
                  const isSelected = selectedType === item.type;
                  return (
                    <button
                      key={item.type}
                      type="button"
                      onClick={() => setSelectedType(item.type)}
                      className={`p-4 rounded-2xl text-left border transition-all ${
                        isSelected
                          ? 'border-emergency-600 bg-red-50/60 dark:bg-red-950/30 ring-2 ring-emergency-500/30 shadow-sm'
                          : 'border-slate-200 dark:border-navy-800 bg-white dark:bg-navy-900 hover:border-slate-300'
                      }`}
                    >
                      <div className="text-2xl mb-1.5">{item.icon}</div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                        {item.label}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                        {item.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Pulsating Mega SOS Dispatch Area */}
            <div className="py-8 text-center space-y-4">
              {countdown === null ? (
                <div className="flex flex-col items-center">
                  <div className="relative">
                    {/* Pulsing rings */}
                    <div className="absolute inset-0 rounded-full bg-red-500/20 animate-ping" />
                    <div className="absolute -inset-4 rounded-full bg-red-500/10 animate-pulse" />
                    
                    <button
                      type="button"
                      onClick={startCountdown}
                      className="relative z-10 w-44 h-44 rounded-full bg-gradient-to-tr from-emergency-600 to-red-500 text-white font-black text-3xl tracking-widest shadow-2xl shadow-red-500/40 hover:scale-105 active:scale-95 transition-all duration-300 flex flex-col items-center justify-center gap-1 focus:outline-none ring-8 ring-red-100 dark:ring-red-950/60"
                    >
                      <HeartPulse className="w-10 h-10 animate-pulse" />
                      <span className="font-black text-3xl tracking-widest">SOS</span>
                      <span className="text-[10px] tracking-wider font-bold opacity-80 uppercase">
                        Press to Trigger
                      </span>
                    </button>
                  </div>

                  <p className="text-xs text-slate-500 mt-6 max-w-sm">
                    3-second cancellation countdown prevents accidental activation before emergency transmission.
                  </p>
                </div>
              ) : (
                /* Countdown Safety Mode */
                <div className="flex flex-col items-center space-y-4 animate-fadeIn">
                  <div className="w-44 h-44 rounded-full bg-emergency-600 text-white font-black text-6xl flex items-center justify-center shadow-2xl ring-8 ring-red-300 animate-pulse">
                    {countdown}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Transmitting SOS in {countdown} seconds...
                  </h3>
                  <button
                    type="button"
                    onClick={cancelCountdown}
                    className="px-6 py-2.5 rounded-full border border-slate-300 text-slate-700 font-bold text-sm hover:bg-slate-100 transition-colors"
                  >
                    Cancel Dispatch
                  </button>
                </div>
              )}
            </div>

            {/* Simulated Prototype Clear Label */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-800 text-xs text-slate-500 text-center">
              <span>
                Demonstration platform: Coordinates are broadcast to the demo 108 Ambulance Unit and AIIMS Apex Trauma console. For real emergency response, dial 112 directly.
              </span>
            </div>

          </div>
        ) : (
          /* IF SOS DISPATCHED: Show Live Tracking & Status Progression */
          <div className="space-y-6 animate-fadeIn">

            {/* Emergency Dispatched Banner */}
            <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-3xl p-6 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
                <Check className="w-6 h-6 stroke-[3]" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                Emergency Transmitted Successfully!
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                Incident ID: <strong className="font-mono text-emerald-700 dark:text-emerald-300">{activeReport.id}</strong> • Paramedics dispatched with saved patient profile.
              </p>
            </div>

            {/* Assigned Ambulance & Hospital Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Ambulance Card */}
              <div className="p-5 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-sm space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center">
                    <Ambulance className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">
                      Dispatched Ambulance
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {assignedAmb.callSign}
                    </h3>
                  </div>
                </div>

                <div className="text-xs space-y-1.5 text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-navy-800">
                  <div className="flex justify-between">
                    <span>Vehicle:</span>
                    <strong className="font-mono">{assignedAmb.vehicleNumber}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Paramedic:</span>
                    <strong>{assignedAmb.paramedicName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Arrival:</span>
                    <strong className="text-emergency-600 font-bold">~{activeReport.etaMinutes || 5} mins</strong>
                  </div>
                </div>

                <a
                  href={`tel:${assignedAmb.phone}`}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs transition-colors shadow-sm"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Paramedic ({assignedAmb.phone})</span>
                </a>
              </div>

              {/* Destination Hospital Card */}
              <div className="p-5 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-sm space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                      Pre-Alerted Hospital
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {assignedHosp.name}
                    </h3>
                  </div>
                </div>

                <div className="text-xs space-y-1.5 text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-navy-800">
                  <div className="flex justify-between">
                    <span>ER Trauma Hotline:</span>
                    <strong className="font-mono">{assignedHosp.traumaHotline}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Pre-Arrival Status:</span>
                    <span className="text-emerald-600 font-bold">
                      {activeReport.hospitalPreAlertAcknowledged ? 'Trauma Bay Ready' : 'Alert Transmitted'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Transferred Data:</span>
                    <span>Blood {userProfile.bloodGroup}, Age {userProfile.age}</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-navy-800 text-[11px] text-slate-500">
                  Hospital emergency team has received your medical summary and is preparing ahead of arrival.
                </div>
              </div>

            </div>

            {/* Interactive Leaflet Map Tracker */}
            <div className="rounded-3xl overflow-hidden border border-slate-200 dark:border-navy-800 shadow-sm bg-white dark:bg-navy-900 p-4 space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emergency-600" />
                  <span>Live Dispatch Route</span>
                </div>
                <span className="text-slate-400">Distance: {activeReport.distanceKm || 2.1} km</span>
              </div>

              <div className="h-64 rounded-2xl overflow-hidden">
                <LeafletMap
                  emergencyLocation={activeReport.location}
                  ambulanceLocation={assignedAmb.currentLocation}
                  hospitalLocation={assignedHosp.location}
                  height="100%"
                />
              </div>
            </div>

            {/* Dispatch Status Milestone Progression */}
            <div className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Dispatch Milestones
              </h3>

              <div className="space-y-3">
                {activeReport.statusHistory.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                      ✓
                    </div>
                    <div>
                      <div className="font-bold text-slate-800 dark:text-slate-200">
                        {step.status} - <span className="font-normal text-slate-500">{new Date(step.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <p className="text-slate-500">{step.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4">
              <button
                type="button"
                onClick={() => setActiveReport(null)}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors"
              >
                Create New SOS Test Request
              </button>

              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs transition-colors shadow-sm"
              >
                Back to Dashboard
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
