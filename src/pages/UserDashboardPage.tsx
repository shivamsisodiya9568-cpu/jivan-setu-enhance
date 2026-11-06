import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Activity, 
  AlertCircle, 
  AlertTriangle, 
  Ambulance, 
  ArrowRight, 
  Building2, 
  Check, 
  ChevronRight, 
  Clock, 
  Edit3, 
  Heart, 
  HeartPulse, 
  LifeBuoy, 
  LocateFixed, 
  MapPin, 
  Phone, 
  PhoneCall, 
  ShieldCheck, 
  Star, 
  User, 
  Users 
} from 'lucide-react';
import { useJivanSetu } from '../context/JivanSetuContext';
import { PriorityBadge } from '../components/common/PriorityBadge';

export const UserDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { userProfile, reports, ambulances, hospitals, triggerProfileSos, addToast } = useJivanSetu();

  const [isActivatingSos, setIsActivatingSos] = useState(false);

  // Filter latest or active report for this user
  const userReports = reports.filter(
    r => r.reporterName === userProfile.fullName || r.patientName === userProfile.fullName
  );
  const activeIncident = userReports.find(
    r => r.status !== 'Completed' && r.status !== 'Rejected'
  ) || reports.find(r => r.status !== 'Completed' && r.status !== 'Rejected');

  const handleQuickSos = () => {
    setIsActivatingSos(true);
    setTimeout(() => {
      const rep = triggerProfileSos();
      setIsActivatingSos(false);
      navigate(`/status/${rep.id}`);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-navy-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Top Header & Greeting */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Hello, {userProfile.fullName ? userProfile.fullName.split(' ')[0] : 'Citizen'}
              </h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                Shield Active
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Your medical emergency profile is saved and synchronized with nearest response units.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/profile"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition-colors shadow-sm"
            >
              <Edit3 className="w-4 h-4 text-slate-500" />
              <span>Edit Profile</span>
            </Link>

            <a
              href="tel:112"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 transition-colors shadow-sm"
            >
              <PhoneCall className="w-4 h-4 text-emergency-500" />
              <span>Call 112 Fallback</span>
            </a>
          </div>
        </div>

        {/* Central SOS Emergency Trigger Banner */}
        <div className="bg-gradient-to-br from-red-500 to-emergency-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-red-500/15 relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-3 max-w-xl text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider text-white">
                <HeartPulse className="w-4 h-4 text-white animate-pulse" />
                <span>Instant 1-Tap SOS Dispatch</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
                Are you or someone near you in a medical crisis?
              </h2>
              <p className="text-white/85 text-sm">
                Tapping SOS immediately transmits your saved blood group (<strong className="text-white">{userProfile.bloodGroup}</strong>), emergency contacts, and live GPS location to nearest 108 ALS ambulances and trauma hospitals.
              </p>
            </div>

            {/* Giant SOS Button */}
            <div className="shrink-0 flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={handleQuickSos}
                disabled={isActivatingSos}
                className="w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-white text-emergency-700 hover:bg-red-50 font-black text-2xl sm:text-3xl tracking-wider shadow-2xl flex flex-col items-center justify-center gap-1 transition-all duration-300 hover:scale-105 active:scale-95 group focus:outline-none ring-8 ring-white/20"
              >
                <span className="font-extrabold text-2xl tracking-widest text-emergency-600 group-hover:scale-110 transition-transform">
                  {isActivatingSos ? 'DISPATCHING...' : 'SOS'}
                </span>
                <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                  1-Tap Rescue
                </span>
              </button>
              <Link
                to="/sos"
                className="text-xs text-white/90 hover:text-white underline font-semibold mt-1"
              >
                Or open full emergency screen →
              </Link>
            </div>
          </div>
        </div>

        {/* 2-Column Grid: Active Incident & Emergency Health Shield */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left Column (2 Cols): Active Emergency Status */}
          <div className="lg:col-span-2 space-y-6">

            {/* Active Incident Card */}
            <div className="bg-white dark:bg-navy-900 rounded-3xl p-6 border border-slate-200 dark:border-navy-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-navy-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-950/40 text-emergency-600 flex items-center justify-center">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      Live Emergency Status
                    </h3>
                    <p className="text-xs text-slate-500">
                      Real-time dispatch coordination updates
                    </p>
                  </div>
                </div>

                {activeIncident && (
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-navy-800 text-slate-700 dark:text-slate-300">
                    {activeIncident.id}
                  </span>
                )}
              </div>

              {activeIncident ? (
                <div className="space-y-4 pt-1">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Incident Type</div>
                      <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                        {activeIncident.emergencyType}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <PriorityBadge priority={activeIncident.priority} />
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                        {activeIncident.status}
                      </span>
                    </div>
                  </div>

                  {/* Location & ETA */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-navy-800/50 border border-slate-100 dark:border-navy-800 text-xs">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-emergency-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-slate-700 dark:text-slate-200">Incident Scene:</span>
                        <p className="text-slate-500 line-clamp-1">{activeIncident.location.address}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-slate-700 dark:text-slate-200">Estimated Arrival:</span>
                        <p className="text-slate-500">
                          {activeIncident.etaMinutes ? `~${activeIncident.etaMinutes} minutes away` : 'Calculating ETA...'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Link to Full Tracker */}
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-slate-500">
                      Assigned to 108 Rapid Unit • Pre-Alert active
                    </span>
                    <Link
                      to={`/status/${activeIncident.id}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-emergency-600 hover:text-emergency-700"
                    >
                      <span>Open Live Interactive Tracking</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-navy-800 text-slate-400 flex items-center justify-center mx-auto">
                    <Check className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    No Active Emergencies
                  </h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    You have no ongoing emergency requests. Your saved profile is ready on standby.
                  </p>
                </div>
              )}
            </div>

            {/* Quick Actions Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link
                to="/first-aid"
                className="p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 hover:border-emergency-300 dark:hover:border-navy-700 transition-all shadow-sm hover:shadow-md group"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <LifeBuoy className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emergency-600 transition-colors">
                  First Aid Guides
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  CPR, bleeding control, and choking instructions
                </p>
              </Link>

              <Link
                to="/reviews"
                className="p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 hover:border-emergency-300 dark:hover:border-navy-700 transition-all shadow-sm hover:shadow-md group"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <Star className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emergency-600 transition-colors">
                  Hospital Reviews
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Rate ambulance response and trauma care
                </p>
              </Link>

              <Link
                to="/ambulance"
                className="p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 hover:border-emergency-300 dark:hover:border-navy-700 transition-all shadow-sm hover:shadow-md group"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <Ambulance className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emergency-600 transition-colors">
                  108 Unit View
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Explore how paramedics receive your profile
                </p>
              </Link>
            </div>
          </div>

          {/* Right Column (1 Col): Saved Emergency Shield Summary */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-navy-900 rounded-3xl p-6 border border-slate-200 dark:border-navy-800 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-navy-800">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emergency-600" />
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Emergency Shield
                  </h3>
                </div>
                <Link
                  to="/profile"
                  className="text-xs font-semibold text-emergency-600 hover:underline"
                >
                  Edit
                </Link>
              </div>

              {/* Vitals Summary */}
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900/30">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Blood Group</span>
                  <div className="text-2xl font-black text-emergency-600 mt-0.5">
                    {userProfile.bloodGroup || 'Unknown'}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-navy-800 border border-slate-100 dark:border-navy-800">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Age / Gender</span>
                  <div className="text-base font-bold text-slate-800 dark:text-slate-100 mt-1">
                    {userProfile.age} yrs • {userProfile.gender}
                  </div>
                </div>
              </div>

              {/* Key Details List */}
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-400 font-medium">Home Location</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                    {userProfile.location || 'Not set'}
                  </p>
                </div>

                <div>
                  <span className="text-slate-400 font-medium">Primary Emergency Contact</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                    {userProfile.emergencyContactName} ({userProfile.emergencyContactRelation})
                  </p>
                  <p className="text-emergency-600 font-mono mt-0.5">
                    {userProfile.emergencyContactPhone}
                  </p>
                </div>

                {userProfile.medicalConditions?.length > 0 && (
                  <div>
                    <span className="text-slate-400 font-medium">Medical Flags</span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {userProfile.medicalConditions.map(c => (
                        <span key={c} className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-navy-800 text-slate-700 dark:text-slate-300 font-medium">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {userProfile.allergies?.length > 0 && (
                  <div>
                    <span className="text-slate-400 font-medium">Allergies</span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {userProfile.allergies.map(a => (
                        <span key={a} className="px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 font-medium">
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-navy-800 text-center">
                <span className="text-[11px] text-slate-400">
                  Pre-hospital transfer enabled for nearest trauma centres
                </span>
              </div>
            </div>

            {/* Simulated Demo Disclaimer Badge */}
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
              <span>
                <strong>Simulated Prototype:</strong> All ambulance response units and hospital alerts are simulated for demonstration. For real-life emergency services, dial <strong>112</strong> immediately.
              </span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
