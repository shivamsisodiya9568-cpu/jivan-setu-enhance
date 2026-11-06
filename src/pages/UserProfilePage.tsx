import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Check, 
  Heart, 
  HeartPulse, 
  LocateFixed, 
  MapPin, 
  Phone, 
  Save, 
  ShieldCheck, 
  Sparkles, 
  Trash2, 
  User, 
  Users 
} from 'lucide-react';
import { useJivanSetu } from '../context/JivanSetuContext';
import { BloodGroup, Gender } from '../types/emergency';

const BLOOD_GROUPS: BloodGroup[] = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];

export const UserProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { userProfile, updateProfile, resetAllData, addToast, reports } = useJivanSetu();

  const [fullName, setFullName] = useState(userProfile.fullName || '');
  const [phone, setPhone] = useState(userProfile.phone || '');
  const [location, setLocation] = useState(userProfile.location || '');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>(userProfile.bloodGroup || 'O+');
  const [age, setAge] = useState<number>(userProfile.age || 28);
  const [gender, setGender] = useState<Gender>(userProfile.gender || 'Male');
  const [emergencyContactName, setEmergencyContactName] = useState(userProfile.emergencyContactName || '');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState(userProfile.emergencyContactPhone || '');
  const [emergencyContactRelation, setEmergencyContactRelation] = useState(userProfile.emergencyContactRelation || 'Mother');
  const [conditionInput, setConditionInput] = useState('');
  const [medicalConditions, setMedicalConditions] = useState<string[]>(userProfile.medicalConditions || []);
  const [allergyInput, setAllergyInput] = useState('');
  const [allergies, setAllergies] = useState<string[]>(userProfile.allergies || []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      fullName: fullName.trim(),
      phone: phone.trim(),
      location: location.trim(),
      bloodGroup,
      age: Number(age),
      gender,
      emergencyContactName: emergencyContactName.trim(),
      emergencyContactPhone: emergencyContactPhone.trim(),
      emergencyContactRelation,
      medicalConditions,
      allergies
    });
    addToast('success', 'Profile Updated', 'Your emergency medical profile changes have been saved.');
  };

  const addCondition = () => {
    if (conditionInput.trim() && !medicalConditions.includes(conditionInput.trim())) {
      setMedicalConditions([...medicalConditions, conditionInput.trim()]);
      setConditionInput('');
    }
  };

  const removeCondition = (c: string) => {
    setMedicalConditions(medicalConditions.filter(item => item !== c));
  };

  const addAllergy = () => {
    if (allergyInput.trim() && !allergies.includes(allergyInput.trim())) {
      setAllergies([...allergies, allergyInput.trim()]);
      setAllergyInput('');
    }
  };

  const removeAllergy = (a: string) => {
    setAllergies(allergies.filter(item => item !== a));
  };

  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-navy-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 rounded-xl border border-slate-200 dark:border-navy-800 bg-white dark:bg-navy-900 text-slate-600 hover:text-slate-900 shadow-sm"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Emergency Medical Profile
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Pre-stored credentials automatically passed to 108 paramedics during SOS.
              </p>
            </div>
          </div>

          <Link
            to="/onboarding"
            className="text-xs font-bold text-emergency-600 hover:underline self-start sm:self-auto"
          >
            Restart Guided Onboarding Setup →
          </Link>
        </div>

        {/* Profile Edit Form */}
        <form onSubmit={handleSave} className="space-y-6">

          {/* Section 1: Personal & Contact */}
          <div className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-sm space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-navy-800">
              <User className="w-5 h-5 text-emergency-600" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Identity & Contact Details
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Full Legal Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emergency-500"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Mobile Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emergency-500"
                  required
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Primary Location / Address
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emergency-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 2: Vitals & Blood Group */}
          <div className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-sm space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-navy-800">
              <HeartPulse className="w-5 h-5 text-emergency-600" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Clinical Vitals
              </h2>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Blood Group
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {BLOOD_GROUPS.map((bg) => (
                  <button
                    key={bg}
                    type="button"
                    onClick={() => setBloodGroup(bg)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      bloodGroup === bg
                        ? 'bg-emergency-600 text-white border-emergency-600 shadow-sm'
                        : 'bg-white dark:bg-navy-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-navy-700 hover:border-slate-300'
                    }`}
                  >
                    {bg}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Age (Years)
                </label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(parseInt(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Gender
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as Gender)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-800 text-slate-900 dark:text-white"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Family Emergency Contact */}
          <div className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-sm space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-navy-800">
              <Users className="w-5 h-5 text-amber-500" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Family & Emergency Contact
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Contact Name
                </label>
                <input
                  type="text"
                  value={emergencyContactName}
                  onChange={(e) => setEmergencyContactName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-800 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Relationship
                </label>
                <input
                  type="text"
                  value={emergencyContactRelation}
                  onChange={(e) => setEmergencyContactRelation(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-800 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  value={emergencyContactPhone}
                  onChange={(e) => setEmergencyContactPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-800 text-slate-900 dark:text-white"
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 4: Medical Flags & Allergies */}
          <div className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-sm space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-navy-800">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Medical Conditions & Known Allergies
              </h2>
            </div>

            {/* Conditions Tag Manager */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Medical Conditions
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={conditionInput}
                  onChange={(e) => setConditionInput(e.target.value)}
                  placeholder="e.g. Asthma, Diabetes, Pacemaker"
                  className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-800 text-slate-900 dark:text-white"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addCondition();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={addCondition}
                  className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {medicalConditions.map(c => (
                  <span
                    key={c}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-navy-800 text-slate-700 dark:text-slate-300"
                  >
                    <span>{c}</span>
                    <button type="button" onClick={() => removeCondition(c)} className="hover:text-red-500">
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Allergies Tag Manager */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-navy-800">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Known Drug / Environmental Allergies
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={allergyInput}
                  onChange={(e) => setAllergyInput(e.target.value)}
                  placeholder="e.g. Penicillin, Sulfa, Aspirin"
                  className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-800 text-slate-900 dark:text-white"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addAllergy();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={addAllergy}
                  className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {allergies.map(a => (
                  <span
                    key={a}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300"
                  >
                    <span>{a}</span>
                    <button type="button" onClick={() => removeAllergy(a)} className="hover:text-red-500">
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-emergency-600 hover:bg-emergency-700 text-white font-bold text-sm shadow-lg shadow-red-500/25 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Save Emergency Profile Changes</span>
            </button>

            <button
              type="button"
              onClick={resetAllData}
              className="text-xs text-slate-400 hover:text-red-500 transition-colors"
            >
              Reset to Demo Defaults
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
