import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Activity, 
  AlertOctagon, 
  Ambulance, 
  Building2, 
  ChevronDown, 
  HeartPulse, 
  LifeBuoy, 
  Menu, 
  PhoneCall, 
  ShieldCheck, 
  Star, 
  User, 
  Users, 
  X 
} from 'lucide-react';
import { useJivanSetu } from '../context/JivanSetuContext';
import { UserRole } from '../types/emergency';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const { role, setRole, userProfile } = useJivanSetu();
  const location = useLocation();

  const roleLabels: Record<UserRole, { label: string; icon: any; color: string; route: string }> = {
    bystander: { label: 'Citizen Dashboard', icon: Users, color: 'text-blue-500', route: '/dashboard' },
    ambulance: { label: '108 Paramedic', icon: Ambulance, color: 'text-amber-500', route: '/ambulance' },
    hospital: { label: 'AIIMS Trauma ER', icon: Building2, color: 'text-emerald-500', route: '/hospital' },
    admin: { label: 'Dispatch Admin', icon: ShieldCheck, color: 'text-purple-500', route: '/ambulance' }
  };

  const currentRoleConfig = roleLabels[role] || roleLabels.bystander;

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-navy-950/95 backdrop-blur-md border-b border-slate-200/80 dark:border-navy-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand Identity */}
          <Link to="/" className="flex items-center gap-3 group focus:outline-none">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emergency-600 to-red-500 flex items-center justify-center shadow-md shadow-red-500/20 group-hover:scale-105 transition-transform duration-200">
              <HeartPulse className="w-5 h-5 text-white stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                  JIVAN <span className="text-emergency-600">SETU</span>
                </span>
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-red-100 text-emergency-700 dark:bg-red-950/60 dark:text-red-300">
                  EMS
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium hidden sm:inline -mt-0.5">
                Emergency Response Platform
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-semibold text-slate-600 dark:text-slate-300">
            <Link
              to="/"
              className={`px-3 py-2 rounded-xl transition-colors ${
                location.pathname === '/' 
                  ? 'text-emergency-600 font-bold bg-red-50 dark:bg-red-950/30' 
                  : 'hover:text-slate-900 hover:bg-slate-50 dark:hover:bg-navy-900'
              }`}
            >
              Home
            </Link>

            <Link
              to="/dashboard"
              className={`px-3 py-2 rounded-xl transition-colors ${
                location.pathname === '/dashboard'
                  ? 'text-emergency-600 font-bold bg-red-50 dark:bg-red-950/30'
                  : 'hover:text-slate-900 hover:bg-slate-50 dark:hover:bg-navy-900'
              }`}
            >
              Dashboard
            </Link>

            <Link
              to="/sos"
              className={`px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5 ${
                location.pathname === '/sos'
                  ? 'text-emergency-600 font-bold bg-red-50 dark:bg-red-950/30'
                  : 'hover:text-emergency-600 hover:bg-slate-50 dark:hover:bg-navy-900'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emergency-600 animate-pulse" />
              <span>SOS Emergency</span>
            </Link>

            <Link
              to="/ambulance"
              className={`px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5 ${
                location.pathname === '/ambulance'
                  ? 'text-amber-600 font-bold bg-amber-50 dark:bg-amber-950/30'
                  : 'hover:text-slate-900 hover:bg-slate-50 dark:hover:bg-navy-900'
              }`}
            >
              <Ambulance className="w-4 h-4 text-amber-500" />
              <span>108 Ambulance</span>
            </Link>

            <Link
              to="/hospital"
              className={`px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5 ${
                location.pathname === '/hospital'
                  ? 'text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950/30'
                  : 'hover:text-slate-900 hover:bg-slate-50 dark:hover:bg-navy-900'
              }`}
            >
              <Building2 className="w-4 h-4 text-emerald-500" />
              <span>Hospital ER</span>
            </Link>

            <Link
              to="/reviews"
              className={`px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5 ${
                location.pathname === '/reviews'
                  ? 'text-emergency-600 font-bold bg-red-50 dark:bg-red-950/30'
                  : 'hover:text-slate-900 hover:bg-slate-50 dark:hover:bg-navy-900'
              }`}
            >
              <Star className="w-4 h-4 text-amber-400" />
              <span>Reviews</span>
            </Link>
          </nav>

          {/* Right Action Tools: Role Switcher & Profile & SOS CTA */}
          <div className="flex items-center gap-3">
            
            {/* Role Demo Switcher Dropdown */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className="px-3 py-2 rounded-xl border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-900 text-xs font-bold flex items-center gap-2 hover:border-slate-300 transition-all text-slate-700 dark:text-slate-200"
              >
                <currentRoleConfig.icon className={`w-3.5 h-3.5 ${currentRoleConfig.color}`} />
                <span className="max-w-[120px] truncate">{currentRoleConfig.label}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {roleMenuOpen && (
                <div 
                  className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-navy-900 shadow-2xl border border-slate-200 dark:border-navy-700 py-2 z-50 animate-fadeIn"
                  onMouseLeave={() => setRoleMenuOpen(false)}
                >
                  <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Switch Active Persona (Demo)
                  </div>
                  {(Object.keys(roleLabels) as UserRole[]).map((r) => {
                    const item = roleLabels[r];
                    const Icon = item.icon;
                    return (
                      <Link
                        key={r}
                        to={item.route}
                        onClick={() => {
                          setRole(r);
                          setRoleMenuOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2.5 transition-colors ${
                          role === r
                            ? 'bg-red-50 dark:bg-red-950/40 text-emergency-600 font-bold'
                            : 'hover:bg-slate-50 dark:hover:bg-navy-800 text-slate-700 dark:text-slate-200'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${item.color}`} />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Profile Avatar / Link */}
            <Link
              to="/profile"
              className="p-2 rounded-xl border border-slate-200 dark:border-navy-700 hover:bg-slate-50 dark:hover:bg-navy-900 text-slate-700 dark:text-slate-200 transition-colors flex items-center gap-2"
              title="My Emergency Profile"
            >
              <User className="w-4 h-4 text-slate-500" />
              <span className="text-xs font-bold hidden sm:inline">
                {userProfile.fullName ? userProfile.fullName.split(' ')[0] : 'Profile'}
              </span>
            </Link>

            {/* Primary SOS CTA Button */}
            <Link
              to="/sos"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emergency-600 hover:bg-emergency-700 text-white font-black text-xs sm:text-sm tracking-wider shadow-md shadow-red-500/25 hover:shadow-red-500/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              <AlertOctagon className="w-4 h-4 stroke-[2.5] animate-pulse" />
              <span>SOS DISPATCH</span>
            </Link>

            {/* Mobile menu hamburger button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-navy-900"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-navy-800 bg-white dark:bg-navy-950 px-4 pt-3 pb-6 space-y-2 animate-fadeIn">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50"
          >
            Home
          </Link>
          <Link
            to="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50"
          >
            User Dashboard
          </Link>
          <Link
            to="/sos"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-bold text-emergency-600 bg-red-50 dark:bg-red-950/30"
          >
            SOS Emergency Launch
          </Link>
          <Link
            to="/ambulance"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-semibold text-amber-700 hover:bg-amber-50"
          >
            108 Ambulance Console
          </Link>
          <Link
            to="/hospital"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
          >
            Hospital Trauma ER
          </Link>
          <Link
            to="/reviews"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50"
          >
            Service Reviews
          </Link>
          <Link
            to="/profile"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50"
          >
            My Emergency Profile
          </Link>

          <div className="pt-3 border-t border-slate-200 dark:border-navy-800">
            <a
              href="tel:112"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-900 text-white font-bold text-xs"
            >
              <PhoneCall className="w-4 h-4 text-emergency-500" />
              <span>Official 112 Emergency Fallback</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
