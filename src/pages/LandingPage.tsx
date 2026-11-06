import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Activity, 
  AlertOctagon, 
  Ambulance, 
  ArrowRight, 
  Building2, 
  Check, 
  CheckCircle2, 
  Clock, 
  Heart, 
  HeartPulse, 
  LifeBuoy, 
  LocateFixed, 
  MapPin, 
  Phone, 
  PhoneCall, 
  ShieldCheck, 
  Sparkles, 
  Star, 
  Users 
} from 'lucide-react';
import { useJivanSetu } from '../context/JivanSetuContext';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { userProfile, triggerProfileSos, reviews, setRole, addToast } = useJivanSetu();

  const [isTriggering, setIsTriggering] = useState(false);

  const handleInstantSos = () => {
    setIsTriggering(true);
    setTimeout(() => {
      const rep = triggerProfileSos();
      setIsTriggering(false);
      navigate(`/status/${rep.id}`);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-navy-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Subtle background ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-red-500/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          
          {/* Trust pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-800 text-xs font-semibold text-slate-600 dark:text-slate-300 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emergency-600 animate-pulse" />
            <span>Emergency Response Platform • Indian Healthcare Coordination</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-950 dark:text-white leading-[1.15]">
            Emergency Care, <br className="hidden sm:inline" />
            <span className="text-emergency-600">Synchronized Before Arrival.</span>
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Jivan Setu connects patients in critical moments with nearby 108 ambulances and hospitals, automatically transmitting saved blood groups and live GPS before the ambulance arrives.
          </p>

          {/* Primary Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            
            {/* Prominent SOS Trigger */}
            <button
              onClick={handleInstantSos}
              disabled={isTriggering}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-emergency-600 hover:bg-emergency-700 text-white font-extrabold text-base tracking-wide shadow-xl shadow-red-500/25 hover:shadow-red-500/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 group focus:outline-none ring-4 ring-red-100 dark:ring-red-950"
            >
              <AlertOctagon className="w-5 h-5 text-white animate-pulse" />
              <span>{isTriggering ? 'TRANSMITTING SOS...' : '1-TAP EMERGENCY SOS'}</span>
            </button>

            {/* Duolingo Onboarding Link */}
            <Link
              to="/onboarding"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-slate-50 dark:bg-navy-900 hover:bg-slate-100 dark:hover:bg-navy-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-navy-700 font-bold text-sm transition-all shadow-sm"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Set Up Emergency Shield (60s)</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </Link>
          </div>

          {/* Quick reassurance note */}
          <p className="text-xs text-slate-400 pt-1">
            Zero registration barrier during emergencies • Pre-saved profiles save up to 9 critical minutes
          </p>
        </div>
      </section>

      {/* 2. THREE-STEP MINIMAL FLOW */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50/70 dark:bg-navy-900/40 border-y border-slate-100 dark:border-navy-800">
        <div className="max-w-5xl mx-auto space-y-12">
          
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              How Jivan Setu Works
            </h2>
            <p className="text-sm text-slate-500 max-w-lg mx-auto">
              A frictionless 3-stage protocol designed for the golden hour of emergency medicine.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Step 1 */}
            <div className="p-7 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800 shadow-sm space-y-3">
              <div className="w-11 h-11 rounded-2xl bg-red-50 dark:bg-red-950/40 text-emergency-600 flex items-center justify-center font-black text-base">
                01
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Save Health Profile Once
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Enter your blood group, age, known allergies, and primary emergency contact once. You never have to re-enter this in a panic.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-7 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800 shadow-sm space-y-3">
              <div className="w-11 h-11 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center font-black text-base">
                02
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                1-Tap SOS with Live GPS
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                When an accident or heart emergency occurs, 1 tap transmits your exact satellite coordinates to the nearest available 108 ambulance.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-7 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800 shadow-sm space-y-3">
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center font-black text-base">
                03
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Hospital Pre-Arrival Handoff
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                While the ambulance is en route, the receiving trauma bay prepares blood units, surgeon on-call, and CT scanners before the patient arrives.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 3. SIMULATED OPERATOR STAKEHOLDER PORTALS */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emergency-600">
                Interactive Multi-Role Experience
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
                Explore Healthcare Stakeholder Views
              </h2>
            </div>
            <p className="text-xs text-slate-500 max-w-xs">
              Switch roles to experience how paramedics and ER doctors coordinate with zero friction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Citizen Portal */}
            <Link
              to="/dashboard"
              onClick={() => setRole('bystander')}
              className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 hover:border-emergency-300 dark:hover:border-navy-700 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-emergency-600 transition-colors">
                Citizen Dashboard
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Manage your medical profile, view live emergency dispatch progress, and access first aid guides.
              </p>
              <div className="pt-4 flex items-center gap-1.5 text-xs font-bold text-emergency-600">
                <span>Open Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>

            {/* Ambulance 108 Portal */}
            <Link
              to="/ambulance"
              onClick={() => setRole('ambulance')}
              className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 hover:border-amber-300 dark:hover:border-navy-700 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Ambulance className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-amber-600 transition-colors">
                108 Ambulance Unit
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Live dispatch queue, patient blood group & allergy telemetry, route map, and hospital pre-alert trigger.
              </p>
              <div className="pt-4 flex items-center gap-1.5 text-xs font-bold text-amber-600">
                <span>Open 108 Console</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>

            {/* Hospital ER Trauma Portal */}
            <Link
              to="/hospital"
              onClick={() => setRole('hospital')}
              className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 hover:border-emerald-300 dark:hover:border-navy-700 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                Hospital Trauma ER
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Pre-arrival alerts, incoming patient vitals, trauma bay readiness checklists, and ambulance ETA tracking.
              </p>
              <div className="pt-4 flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                <span>Open Hospital ER</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>

          </div>

        </div>
      </section>

      {/* 4. VERIFIED COMMUNITY REVIEWS TEASER */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50/70 dark:bg-navy-900/40 border-t border-slate-100 dark:border-navy-800">
        <div className="max-w-5xl mx-auto space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                Verified Feedback
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
                Hospital & Ambulance Care Reviews
              </h2>
            </div>
            <Link
              to="/reviews"
              className="text-xs font-bold text-emergency-600 hover:underline flex items-center gap-1"
            >
              <span>View all reviews ({reviews.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.slice(0, 2).map((item) => (
              <div
                key={item.id}
                className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900 dark:text-white">
                      {item.targetName}
                    </span>
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-slate-400">
                      {item.targetType}
                    </span>
                  </div>
                  <div className="text-amber-500 text-xs">
                    {'★'.repeat(item.rating)}
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 italic">
                  "{item.comment}"
                </p>

                <div className="text-[11px] text-slate-400 flex items-center justify-between pt-2 border-t border-slate-100 dark:border-navy-800">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{item.authorName}</span>
                  <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. CTA SHIELD BANNER */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto rounded-3xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 p-8 sm:p-12 text-center space-y-6 shadow-2xl">
          <div className="w-12 h-12 rounded-2xl bg-emergency-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-red-500/25">
            <HeartPulse className="w-6 h-6" />
          </div>
          <div className="space-y-2 max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Protect Your Loved Ones Today
            </h2>
            <p className="text-slate-300 dark:text-slate-600 text-xs sm:text-sm">
              It takes 60 seconds to configure your Emergency Shield. In an unexpected incident, your blood group and live GPS are ready instantly.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/onboarding"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-emergency-600 hover:bg-emergency-700 text-white font-bold text-sm shadow-lg shadow-red-500/25 transition-all"
            >
              Start Free Setup
            </Link>

            <Link
              to="/dashboard"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl border border-slate-700 dark:border-slate-300 text-white dark:text-slate-900 font-bold text-sm hover:bg-white/10 dark:hover:bg-slate-100 transition-all"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
