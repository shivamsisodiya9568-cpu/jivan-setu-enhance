import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Heart, 
  HeartPulse, 
  MapPin, 
  Phone, 
  ShieldCheck, 
  Sparkles, 
  User, 
  Users, 
  AlertTriangle,
  LocateFixed
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useJivanSetu } from '../context/JivanSetuContext';
import { BloodGroup, Gender, UserProfile } from '../types/emergency';

const BLOOD_GROUPS: BloodGroup[] = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];

const COMMON_CONDITIONS = [
  'Asthma / Respiratory',
  'Diabetes',
  'Hypertension / BP',
  'Heart Condition',
  'Epilepsy / Seizures',
  'None'
];

const COMMON_ALLERGIES = [
  'Penicillin / Antibiotics',
  'Aspirin / NSAIDs',
  'Sulfa Drugs',
  'Latex',
  'Peanuts / Food',
  'No Known Allergies'
];

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { userProfile, updateProfile, addToast } = useJivanSetu();

  const [step, setStep] = useState<number>(1);
  const totalSteps = 5;

  // Form State initialized from existing profile if any
  const [fullName, setFullName] = useState(userProfile.fullName || '');
  const [location, setLocation] = useState(userProfile.location || '');
  const [geoLocation, setGeoLocation] = useState(userProfile.geoLocation);
  const [isLocating, setIsLocating] = useState(false);
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>(userProfile.bloodGroup || 'O+');
  const [age, setAge] = useState<number>(userProfile.age || 28);
  const [gender, setGender] = useState<Gender>(userProfile.gender || 'Male');
  const [phone, setPhone] = useState(userProfile.phone || '');
  const [emergencyContactName, setEmergencyContactName] = useState(userProfile.emergencyContactName || '');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState(userProfile.emergencyContactPhone || '');
  const [emergencyContactRelation, setEmergencyContactRelation] = useState(userProfile.emergencyContactRelation || 'Mother');
  const [medicalConditions, setMedicalConditions] = useState<string[]>(userProfile.medicalConditions || []);
  const [allergies, setAllergies] = useState<string[]>(userProfile.allergies || []);

  const detectLocation = () => {
    if (!navigator.geolocation) {
      addToast('warning', 'Location Unavailable', 'Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const detected = {
          lat,
          lng,
          address: `GPS: ${lat.toFixed(4)}, ${lng.toFixed(4)} (Current Location)`,
          landmark: 'Auto-detected via GPS',
          accuracyMeters: pos.coords.accuracy
        };
        setGeoLocation(detected);
        if (!location) {
          setLocation('Auto-Detected Current Location (Delhi NCR)');
        }
        addToast('success', 'GPS Coordinates Locked', 'Accurate emergency location saved.');
      },
      () => {
        setIsLocating(false);
        addToast('info', 'Manual Location', 'Please enter your area or address manually.');
      },
      { timeout: 8000 }
    );
  };

  const toggleCondition = (item: string) => {
    if (item === 'None') {
      setMedicalConditions(['None']);
      return;
    }
    const filtered = medicalConditions.filter(c => c !== 'None');
    if (filtered.includes(item)) {
      setMedicalConditions(filtered.filter(c => c !== item));
    } else {
      setMedicalConditions([...filtered, item]);
    }
  };

  const toggleAllergy = (item: string) => {
    if (item === 'No Known Allergies') {
      setAllergies(['No Known Allergies']);
      return;
    }
    const filtered = allergies.filter(a => a !== 'No Known Allergies');
    if (filtered.includes(item)) {
      setAllergies(filtered.filter(a => a !== item));
    } else {
      setAllergies([...filtered, item]);
    }
  };

  const handleNext = () => {
    if (step === 1 && !fullName.trim()) {
      addToast('warning', 'Name Required', 'Please enter your full name to proceed.');
      return;
    }
    if (step === 2 && !location.trim()) {
      addToast('warning', 'Location Required', 'Please provide your primary residential or current area.');
      return;
    }
    if (step === 4 && (!phone.trim() || !emergencyContactPhone.trim())) {
      addToast('warning', 'Contacts Required', 'Please enter both your phone and emergency contact.');
      return;
    }

    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleComplete = () => {
    const updated: Partial<UserProfile> = {
      fullName: fullName.trim(),
      location: location.trim(),
      geoLocation: geoLocation || {
        lat: 28.5630,
        lng: 77.2085,
        address: location.trim()
      },
      bloodGroup,
      age: Number(age) || 25,
      gender,
      phone: phone.trim(),
      emergencyContactName: emergencyContactName.trim() || 'Emergency Contact',
      emergencyContactPhone: emergencyContactPhone.trim(),
      emergencyContactRelation,
      medicalConditions,
      allergies,
      isOnboarded: true
    };

    updateProfile(updated);

    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 }
    });

    addToast('success', 'Profile Activated', 'Your emergency medical shield is now active!');
    setTimeout(() => {
      navigate('/dashboard');
    }, 1200);
  };

  const progressPercentage = Math.round((step / totalSteps) * 100);

  return (
    <div className="min-h-screen bg-white dark:bg-navy-950 flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8">
      {/* Top Header with Duolingo-style Progress Bar */}
      <div className="max-w-xl mx-auto w-full mb-8">
        <div className="flex items-center justify-between gap-4 mb-3">
          <button
            onClick={handleBack}
            disabled={step === 1}
            className={`p-2 rounded-xl border border-slate-200 dark:border-navy-800 transition-colors ${
              step === 1 
                ? 'opacity-30 cursor-not-allowed text-slate-400' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-navy-900'
            }`}
            aria-label="Go Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Progress bar container */}
          <div className="flex-1 bg-slate-100 dark:bg-navy-800 h-3 rounded-full overflow-hidden p-0.5">
            <div 
              className="bg-emergency-600 h-full rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 min-w-[50px] text-right">
            {step} / {totalSteps}
          </span>
        </div>

        <div className="flex items-center justify-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emergency-600 dark:text-emergency-400">
          <HeartPulse className="w-4 h-4 text-emergency-600" />
          <span>Jivan Setu Emergency Shield Setup</span>
        </div>
      </div>

      {/* Main Step Content Card */}
      <div className="max-w-xl mx-auto w-full flex-1 flex flex-col justify-center">
        
        {/* STEP 1: Full Name */}
        {step === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900/40 text-emergency-600 flex items-center justify-center mx-auto shadow-sm">
                <User className="w-8 h-8" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                What is your name?
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
                First responders will see your verified identity when an emergency SOS is triggered.
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Full Legal Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Aarav Sharma"
                className="w-full px-4 py-3.5 text-base rounded-2xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emergency-500 focus:border-transparent transition-all shadow-sm"
                autoFocus
              />
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-800 text-xs text-slate-600 dark:text-slate-400 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                Your identity is securely encrypted. It is only transmitted to authorized 108 paramedics and hospital trauma teams during an active crisis.
              </span>
            </div>
          </div>
        )}

        {/* STEP 2: Location */}
        {step === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 text-blue-600 flex items-center justify-center mx-auto shadow-sm">
                <MapPin className="w-8 h-8" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Where are you based?
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
                Your home base or regular neighborhood helps assign the closest ambulance station.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Residential Area / City
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Green Park Extension, South Delhi, Delhi 110016"
                  className="w-full px-4 py-3.5 text-base rounded-2xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emergency-500 focus:border-transparent transition-all shadow-sm"
                  autoFocus
                />
              </div>

              {/* 1-Tap GPS Detection Button */}
              <button
                type="button"
                onClick={detectLocation}
                disabled={isLocating}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border border-slate-300 dark:border-navy-700 hover:border-emergency-500 dark:hover:border-emergency-500 bg-slate-50 dark:bg-navy-900 hover:bg-red-50/40 text-slate-700 dark:text-slate-200 text-sm font-semibold transition-all group"
              >
                <LocateFixed className={`w-4 h-4 text-emergency-600 ${isLocating ? 'animate-spin' : 'group-hover:scale-110'}`} />
                <span>{isLocating ? 'Acquiring GPS Satellite Lock...' : 'Auto-Detect Current GPS Location'}</span>
              </button>

              {geoLocation && (
                <div className="text-xs text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 p-3 rounded-xl border border-emerald-200 dark:border-emerald-900 flex items-center gap-2">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>GPS Coordinates Captured: {geoLocation.lat.toFixed(4)}, {geoLocation.lng.toFixed(4)}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 3: Blood Group & Age & Gender */}
        {step === 3 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900/40 text-emergency-600 flex items-center justify-center mx-auto shadow-sm">
                <Heart className="w-8 h-8 fill-emergency-600" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Vital Medical Profile
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
                Blood banks cross-match donor units prior to ER arrival based on this exact data.
              </p>
            </div>

            {/* Blood Group Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Select Your Blood Group
              </label>
              <div className="grid grid-cols-4 gap-2.5">
                {BLOOD_GROUPS.map((bg) => {
                  const isSelected = bloodGroup === bg;
                  return (
                    <button
                      key={bg}
                      type="button"
                      onClick={() => setBloodGroup(bg)}
                      className={`py-3 px-2 rounded-2xl font-bold text-base transition-all border ${
                        isSelected
                          ? 'bg-emergency-600 text-white border-emergency-600 shadow-md shadow-red-500/20 scale-[1.02]'
                          : 'bg-white dark:bg-navy-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-navy-700 hover:border-emergency-300 hover:bg-slate-50'
                      }`}
                    >
                      {bg}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Age & Gender Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Age (Years)
                </label>
                <input
                  type="number"
                  min={1}
                  max={120}
                  value={age}
                  onChange={(e) => setAge(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 text-base rounded-2xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emergency-500 transition-all shadow-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Gender
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['Male', 'Female', 'Other'] as Gender[]).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGender(g)}
                      className={`py-3 rounded-2xl text-xs font-bold transition-all border ${
                        gender === g
                          ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-sm'
                          : 'bg-white dark:bg-navy-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-navy-700 hover:bg-slate-50'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Emergency Contacts */}
        {step === 4 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/40 text-amber-600 flex items-center justify-center mx-auto shadow-sm">
                <Users className="w-8 h-8" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Emergency Contacts
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
                In an accident or trauma, your family member is notified alongside 108 dispatch.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Your Mobile Number
                </label>
                <div className="relative">
                  <Phone className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-12 pr-4 py-3.5 text-base rounded-2xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emergency-500 transition-all shadow-sm"
                    autoFocus
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-navy-800 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-emergency-600">
                  Primary Family / Emergency Contact
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400">
                      Contact Name
                    </label>
                    <input
                      type="text"
                      value={emergencyContactName}
                      onChange={(e) => setEmergencyContactName(e.target.value)}
                      placeholder="e.g. Sunita Sharma"
                      className="w-full px-3.5 py-3 text-sm rounded-xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emergency-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400">
                      Relation
                    </label>
                    <select
                      value={emergencyContactRelation}
                      onChange={(e) => setEmergencyContactRelation(e.target.value)}
                      className="w-full px-3.5 py-3 text-sm rounded-xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emergency-500"
                    >
                      <option value="Mother">Mother</option>
                      <option value="Father">Father</option>
                      <option value="Spouse">Spouse / Partner</option>
                      <option value="Sibling">Brother / Sister</option>
                      <option value="Child">Son / Daughter</option>
                      <option value="Friend">Friend / Colleague</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400">
                    Emergency Contact Phone
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={emergencyContactPhone}
                      onChange={(e) => setEmergencyContactPhone(e.target.value)}
                      placeholder="+91 98111 22334"
                      className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emergency-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Medical Conditions & Allergies */}
        {step === 5 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/40 text-purple-600 flex items-center justify-center mx-auto shadow-sm">
                <Sparkles className="w-8 h-8" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Allergies & Medical Flags
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
                Prevents fatal drug interactions when paramedics administer emergency medications.
              </p>
            </div>

            {/* Pre-existing Conditions */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Pre-existing Conditions (Select all that apply)
              </label>
              <div className="flex flex-wrap gap-2">
                {COMMON_CONDITIONS.map((c) => {
                  const selected = medicalConditions.includes(c);
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => toggleCondition(c)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all border ${
                        selected
                          ? 'bg-emergency-50 dark:bg-emergency-950/50 text-emergency-700 dark:text-emergency-300 border-emergency-300 dark:border-emergency-700 ring-1 ring-emergency-400'
                          : 'bg-white dark:bg-navy-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-navy-700 hover:border-slate-300'
                      }`}
                    >
                      {selected && <Check className="w-3.5 h-3.5 inline mr-1" />}
                      {c}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Known Allergies */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Known Drug & Food Allergies
              </label>
              <div className="flex flex-wrap gap-2">
                {COMMON_ALLERGIES.map((a) => {
                  const selected = allergies.includes(a);
                  return (
                    <button
                      key={a}
                      type="button"
                      onClick={() => toggleAllergy(a)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all border ${
                        selected
                          ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700 ring-1 ring-amber-400'
                          : 'bg-white dark:bg-navy-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-navy-700 hover:border-slate-300'
                      }`}
                    >
                      {selected && <Check className="w-3.5 h-3.5 inline mr-1" />}
                      {a}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-800 text-xs text-slate-500 flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
              <span>You can modify or add more conditions anytime from your profile settings.</span>
            </div>
          </div>
        )}

      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="max-w-xl mx-auto w-full pt-8">
        <button
          onClick={handleNext}
          className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-emergency-600 hover:bg-emergency-700 text-white font-bold text-base shadow-lg shadow-red-500/25 hover:shadow-red-500/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
        >
          <span>{step === totalSteps ? 'Activate Emergency Shield' : 'Continue'}</span>
          <ArrowRight className="w-5 h-5" />
        </button>

        {step === 1 && (
          <p className="text-center text-xs text-slate-400 mt-3">
            Takes less than 60 seconds • Saved once, protected forever
          </p>
        )}
      </div>
    </div>
  );
};
