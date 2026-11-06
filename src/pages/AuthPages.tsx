import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Ambulance, 
  ArrowRight, 
  Building2, 
  Check, 
  HeartPulse, 
  Lock, 
  Mail, 
  Phone, 
  ShieldCheck, 
  User, 
  Users 
} from 'lucide-react';
import { useJivanSetu } from '../context/JivanSetuContext';
import { UserRole } from '../types/emergency';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, setRole, addToast } = useJivanSetu();

  const [email, setEmail] = useState('aarav.sharma@example.com');
  const [password, setPassword] = useState('password123');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, 'bystander');
    navigate('/dashboard');
  };

  const handleQuickRoleLogin = (role: UserRole, targetEmail: string, route: string) => {
    login(targetEmail, role);
    setRole(role);
    addToast('success', `Switched to ${role.toUpperCase()}`, `Logged in as authorized ${role} operator.`);
    navigate(route);
  };

  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-navy-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto space-y-8">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emergency-600 to-red-500 flex items-center justify-center mx-auto shadow-lg shadow-red-500/25">
            <HeartPulse className="w-8 h-8 text-white stroke-[2.5]" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Sign in to Jivan Setu
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Smart Emergency Response Platform connecting Citizens, Ambulances & Hospitals
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white dark:bg-navy-900 p-8 rounded-3xl border border-slate-200 dark:border-navy-800 shadow-sm space-y-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Email or Mobile Number
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emergency-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emergency-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-emergency-600 hover:bg-emergency-700 text-white font-bold text-xs shadow-md shadow-red-500/25 transition-all"
            >
              Sign In to Emergency Account
            </button>
          </form>

          {/* Quick Demo Logins for Hackathon Assessment */}
          <div className="pt-4 border-t border-slate-100 dark:border-navy-800 space-y-2.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block text-center">
              One-Click Role Demonstration Logins
            </span>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickRoleLogin('bystander', 'aarav.sharma@example.com', '/dashboard')}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-navy-700 hover:border-emergency-500 hover:bg-slate-50 dark:hover:bg-navy-800 text-left flex items-center gap-2"
              >
                <Users className="w-4 h-4 text-blue-500 shrink-0" />
                <div>
                  <div className="font-bold text-slate-800 dark:text-slate-200">Citizen Profile</div>
                  <div className="text-[10px] text-slate-400">Aarav Sharma</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickRoleLogin('ambulance', 'paramedic.ritu@ems108.gov.in', '/ambulance')}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-navy-700 hover:border-amber-500 hover:bg-slate-50 dark:hover:bg-navy-800 text-left flex items-center gap-2"
              >
                <Ambulance className="w-4 h-4 text-amber-500 shrink-0" />
                <div>
                  <div className="font-bold text-slate-800 dark:text-slate-200">108 Paramedic</div>
                  <div className="text-[10px] text-slate-400">Eagle-1 ALS</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickRoleLogin('hospital', 'er.doctor@aiims.edu.in', '/hospital')}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-navy-700 hover:border-emerald-500 hover:bg-slate-50 dark:hover:bg-navy-800 text-left flex items-center gap-2"
              >
                <Building2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <div>
                  <div className="font-bold text-slate-800 dark:text-slate-200">AIIMS Trauma ER</div>
                  <div className="text-[10px] text-slate-400">Charge Nurse</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickRoleLogin('admin', 'dispatch.admin@jivansetu.in', '/ambulance')}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-navy-700 hover:border-purple-500 hover:bg-slate-50 dark:hover:bg-navy-800 text-left flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-purple-500 shrink-0" />
                <div>
                  <div className="font-bold text-slate-800 dark:text-slate-200">EMS Dispatch</div>
                  <div className="text-[10px] text-slate-400">Super Admin</div>
                </div>
              </button>
            </div>
          </div>

          <div className="text-center pt-2 text-xs text-slate-500">
            <span>New to Jivan Setu? </span>
            <Link to="/register" className="font-bold text-emergency-600 hover:underline">
              Create an account
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, updateProfile, addToast } = useJivanSetu();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) {
      addToast('warning', 'Fields Required', 'Please enter your name and phone number.');
      return;
    }

    updateProfile({
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      isOnboarded: false
    });

    login(email || `${phone}@jivansetu.local`, 'bystander');
    addToast('success', 'Account Registered', 'Proceeding to Duolingo-style setup wizard.');
    navigate('/onboarding');
  };

  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-navy-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto space-y-8">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emergency-600 to-red-500 flex items-center justify-center mx-auto shadow-lg shadow-red-500/25">
            <HeartPulse className="w-8 h-8 text-white stroke-[2.5]" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Create Jivan Setu Account
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Set up your permanent emergency profile in less than 2 minutes.
          </p>
        </div>

        {/* Register Card */}
        <div className="bg-white dark:bg-navy-900 p-8 rounded-3xl border border-slate-200 dark:border-navy-800 shadow-sm space-y-6">
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Full Legal Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Aarav Sharma"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emergency-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Mobile Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emergency-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Email Address (Optional)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="aarav@example.com"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emergency-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emergency-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-emergency-600 hover:bg-emergency-700 text-white font-bold text-xs shadow-md shadow-red-500/25 transition-all mt-2"
            >
              <span>Continue to Step-by-Step Onboarding</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center pt-2 text-xs text-slate-500">
            <span>Already have an account? </span>
            <Link to="/login" className="font-bold text-emergency-600 hover:underline">
              Sign in
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
