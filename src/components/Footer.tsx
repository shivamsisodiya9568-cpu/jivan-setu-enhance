import React from 'react';
import { Link } from 'react-router-dom';
import { HeartPulse, PhoneCall, ShieldAlert, Award, Star } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 text-sm">
      {/* Top Banner: Medical & Legal Safety */}
      <div className="bg-slate-950/80 border-b border-slate-800 px-4 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-red-400 font-semibold">
            <ShieldAlert className="w-4 h-4 shrink-0 text-emergency-500" />
            <span>
              Official Indian Emergency Services: Dial 112 for All Emergencies | 108 for Medical Ambulance | 102 for Maternity Care
            </span>
          </div>
          <div className="flex items-center gap-3 text-slate-400">
            <span className="text-emerald-400 font-medium">Jivan Setu v2.0</span>
            <span>•</span>
            <span className="text-slate-400">Healthcare Emergency Network</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand & Vision */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emergency-600 flex items-center justify-center text-white shadow-md shadow-red-500/20">
                <HeartPulse className="w-5 h-5" />
              </div>
              <span className="text-lg font-black text-white tracking-tight">
                JIVAN <span className="text-emergency-500">SETU</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every second counts in medical crises. Jivan Setu connects victims with nearby ambulances and transfers patient vitals to hospitals before arrival.
            </p>
            <div className="pt-1">
              <a
                href="tel:112"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emergency-600/20 border border-emergency-500/30 text-emergency-400 font-bold text-xs hover:bg-emergency-600 hover:text-white transition"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                Emergency Hotline: 112
              </a>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Citizen Tools
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link to="/onboarding" className="hover:text-white transition">
                  Duolingo-style Onboarding Setup
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-white transition">
                  User Health Dashboard
                </Link>
              </li>
              <li>
                <Link to="/sos" className="hover:text-emergency-400 transition font-bold text-red-300">
                  1-Tap SOS Emergency Dispatch
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-white transition">
                  Emergency Medical Profile
                </Link>
              </li>
              <li>
                <Link to="/first-aid" className="hover:text-white transition">
                  First Aid Procedures
                </Link>
              </li>
            </ul>
          </div>

          {/* Emergency Stakeholder Portals */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Portals & Services
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link to="/ambulance" className="hover:text-amber-400 transition flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  108 Ambulance Dispatch Console
                </Link>
              </li>
              <li>
                <Link to="/hospital" className="hover:text-emerald-400 transition flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Hospital Trauma ER Pre-Alert
                </Link>
              </li>
              <li>
                <Link to="/reviews" className="hover:text-white transition flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  Hospital & Ambulance Reviews
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition">
                  Staff & Bystander Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Notice & Disclaimer */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Important Medical Disclaimer
            </h4>
            <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-xs space-y-2 text-slate-400">
              <p>
                <strong>Prototype Notice:</strong> Jivan Setu is a medical coordination prototype. Ambulances and hospitals are simulated for demonstration.
              </p>
              <p className="text-[11px] text-slate-400">
                In real medical emergencies, dial <strong>112</strong> or <strong>108</strong> directly from any mobile or landline across India.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            &copy; {new Date().getFullYear()} Jivan Setu Emergency Response System. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Clean Healthcare Design</span>
            <span>•</span>
            <span>Minimal & Accessible</span>
            <span>•</span>
            <span>Fast Emergency Dispatch</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
