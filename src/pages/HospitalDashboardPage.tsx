import React, { useState } from 'react';
import { 
  Activity, 
  AlertCircle, 
  Ambulance, 
  Bed, 
  Building2, 
  Check, 
  CheckCircle2, 
  Clock, 
  Droplets, 
  HeartPulse, 
  PhoneCall, 
  ShieldAlert, 
  Stethoscope, 
  User 
} from 'lucide-react';
import { useJivanSetu } from '../context/JivanSetuContext';
import { PriorityBadge } from '../components/common/PriorityBadge';
import { LeafletMap } from '../components/map/LeafletMap';

export const HospitalDashboardPage: React.FC = () => {
  const { reports, hospitals, ambulances, acknowledgeHospitalPreAlert, updateStatus, addToast } = useJivanSetu();

  // Active hospital: AIIMS Apex Trauma
  const hospital = hospitals[0];
  const [selectedReportId, setSelectedReportId] = useState<string>(reports[0]?.id || '');
  const [prepModalOpen, setPrepModalOpen] = useState(false);
  const [prepNotes, setPrepNotes] = useState('Trauma Bay 1 ready. Neuro-surgeon & Orthopedic on call. 2 Units O-negative matched.');
  const [selectedItems, setSelectedItems] = useState<string[]>([
    'Trauma Resuscitation Bay 1',
    'Blood Bank Cross-match',
    'Head CT Scan Standby',
    'Ventilator Ready'
  ]);

  const currentReport = reports.find(r => r.id === selectedReportId) || reports[0];
  const assignedAmb = ambulances.find(a => a.id === currentReport?.assignedAmbulanceId) || ambulances[0];

  // Incoming alerts for this hospital
  const incomingReports = reports.filter(r => r.assignedHospitalId === hospital.id && r.status !== 'Completed');
  const criticalIncoming = incomingReports.filter(r => r.priority === 'RED');

  const handleAcknowledge = () => {
    if (!currentReport) return;
    acknowledgeHospitalPreAlert(currentReport.id, prepNotes, selectedItems);
    setPrepModalOpen(false);
  };

  const handleConfirmArrival = () => {
    if (!currentReport) return;
    updateStatus(
      currentReport.id,
      'Completed',
      `${hospital.shortName} Trauma Reception`,
      'Patient arrived at Emergency Department. Formal medical admission begun.'
    );
    addToast('success', 'Patient Received at ER', 'Emergency handover successfully finalized.');
  };

  const prepChecklistOptions = [
    'Trauma Resuscitation Bay 1',
    'Blood Bank Cross-match (O-)',
    'Head CT Scan Standby',
    'Endotracheal Intubation Cart',
    'Cardiothoracic Surgery On-Call',
    'Orthopedic Trauma Team Alerted',
    'Pediatric Emergency Specialist'
  ];

  const toggleChecklistItem = (item: string) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter(i => i !== item));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy-950 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Top ER Header */}
        <div className="bg-white dark:bg-navy-900 rounded-2xl p-6 border border-slate-200 dark:border-navy-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-600">
              <Building2 className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-navy-950 dark:text-white">
                  {hospital.name}
                </h1>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300">
                  Apex Level 1 Trauma
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                ER Hotline: <strong className="text-slate-700 dark:text-slate-200">{hospital.traumaHotline}</strong> • {hospital.location.address}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch md:self-auto">
            {currentReport && (
              <button
                onClick={() => setPrepModalOpen(true)}
                className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Update Bay Readiness / Pre-Alert</span>
              </button>
            )}
          </div>
        </div>

        {/* Prototype Disclaimer Banner */}
        <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-xs text-amber-800 dark:text-amber-300 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold uppercase tracking-wider text-[10px] px-2 py-0.5 rounded bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200">
              Prototype Workflow
            </span>
            <span>
              Simulated pre-arrival information transfer for prototype demonstration. Does not claim actual bed or admission confirmation.
            </span>
          </div>
          <span className="text-[11px] font-semibold text-slate-500 hidden sm:inline">
            Official Emergency Fallback: Dial 112
          </span>
        </div>

        {/* Hospital Resource Capacity Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">ICU Bed Availability</span>
              <Bed className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-2xl font-extrabold text-navy-950 dark:text-white mt-1">
              {hospital.availableIcuBeds} <span className="text-xs font-normal text-slate-400">/ {hospital.totalIcuBeds} Free</span>
            </div>
            <span className="text-[11px] text-emerald-600 font-semibold">Trauma ICU Ready</span>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Trauma Bays</span>
              <Activity className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-extrabold text-emerald-600 mt-1">
              {hospital.availableTraumaBays} Open
            </div>
            <span className="text-[11px] text-slate-400">Resuscitation bays primed</span>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">O- Blood Reserves</span>
              <Droplets className="w-4 h-4 text-red-500" />
            </div>
            <div className="text-2xl font-extrabold text-red-600 mt-1">
              {hospital.bloodAvailability['O-']} Units
            </div>
            <span className="text-[11px] text-slate-400">Universal donor available</span>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Incoming Inbound</span>
              <Ambulance className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-extrabold text-amber-500 mt-1">
              {incomingReports.length} Cases
            </div>
            <span className="text-[11px] text-red-600 font-semibold">{criticalIncoming.length} Critical RED</span>
          </div>
        </div>

        {/* Work Area: Inbound Alert Queue (Left) & Clinical Handover Detail (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left: Incoming Emergency Alerts List (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-navy-950 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>Incoming Pre-Alert Queue ({incomingReports.length})</span>
            </h3>

            <div className="space-y-3 max-h-[680px] overflow-y-auto pr-1">
              {incomingReports.map((rep) => {
                const isSelected = rep.id === selectedReportId;
                return (
                  <div
                    key={rep.id}
                    onClick={() => setSelectedReportId(rep.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-emerald-50/80 dark:bg-navy-900 border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                        : 'bg-white dark:bg-navy-900/60 border-slate-200 dark:border-navy-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
                            {rep.id}
                          </span>
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 dark:bg-navy-800 text-slate-700 dark:text-slate-300">
                            {rep.status}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-navy-950 dark:text-white mt-1">
                          {rep.emergencyType}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          Patient: {rep.patientName || 'Unidentified'} ({rep.patientAge ? `${rep.patientAge}y` : 'Adult'}, {rep.patientGender})
                        </p>
                      </div>
                      <PriorityBadge priority={rep.priority} size="sm" />
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-navy-800 flex items-center justify-between text-[11px]">
                      <span className="text-emergency-600 font-extrabold font-mono">
                        ETA: ~{rep.etaMinutes || 5} min
                      </span>
                      <span className="text-slate-500">
                        {rep.hospitalPreAlertAcknowledged ? (
                          <span className="text-emerald-600 font-bold flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> Acknowledged
                          </span>
                        ) : (
                          <span className="text-amber-600 font-bold animate-pulse">
                            Needs Acknowledgment
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Hospital Clinical Telemetry & Action View (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {currentReport ? (
              <div className="bg-white dark:bg-navy-900 p-6 rounded-2xl border border-slate-200 dark:border-navy-800 shadow-sm space-y-6">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-navy-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-slate-300">
                        {currentReport.id}
                      </span>
                      <span className="text-xs font-bold text-emerald-600">
                        Ambulance Status: {currentReport.status}
                      </span>
                    </div>
                    <h2 className="text-lg font-extrabold text-navy-950 dark:text-white mt-1">
                      {currentReport.emergencyType} — Inbound
                    </h2>
                  </div>

                  <div className="flex items-center gap-2">
                    <PriorityBadge priority={currentReport.priority} size="md" />
                  </div>
                </div>

                {/* Pre-Alert Status Box */}
                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <strong className="text-xs font-bold text-emerald-900 dark:text-emerald-200 block">
                      Hospital Pre-Alert Status: {currentReport.hospitalPreAlertAcknowledged ? 'Confirmed & Prepared' : 'Pending ER Acknowledgment'}
                    </strong>
                    <p className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-0.5">
                      {currentReport.hospitalPreparationNotes || 'Click update below to set trauma bay readiness notes.'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPrepModalOpen(true)}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                    >
                      Update Preparation
                    </button>
                    {currentReport.status !== 'Completed' && (
                      <button
                        onClick={handleConfirmArrival}
                        className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
                      >
                        Confirm Handover
                      </button>
                    )}
                  </div>
                </div>

                {/* Patient SBAR Structured Handover Summary */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-navy-800">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      SBAR Emergency Physician Handover
                    </span>
                    <span className="text-[11px] text-slate-400">Standardized Medical Format</span>
                  </div>
                  <div><strong className="text-navy-950 dark:text-white">Situation:</strong> {currentReport.sbarSummary.situation}</div>
                  <div><strong className="text-navy-950 dark:text-white">Background:</strong> {currentReport.sbarSummary.background}</div>
                  <div><strong className="text-navy-950 dark:text-white">Assessment:</strong> {currentReport.sbarSummary.assessment}</div>
                  <div><strong className="text-navy-950 dark:text-white">Recommendation:</strong> {currentReport.sbarSummary.recommendation}</div>
                </div>

                {/* Patient Vitals & Clinical Warning Signs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 space-y-2">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Reported Vitals & Neurological</span>
                    <div><strong>Consciousness:</strong> {currentReport.consciousness}</div>
                    <div><strong>Breathing:</strong> {currentReport.breathing}</div>
                    <div><strong>Hemorrhage:</strong> {currentReport.severeBleeding}</div>
                    <div><strong>Suspected Injuries:</strong> {currentReport.suspectedInjuries.join(', ') || 'Polytrauma'}</div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 space-y-2">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Transporting Ambulance EMS</span>
                    <div><strong>Unit:</strong> {assignedAmb.callSign}</div>
                    <div><strong>Vehicle No:</strong> {assignedAmb.vehicleNumber}</div>
                    <div><strong>Paramedic:</strong> {assignedAmb.paramedicName}</div>
                    <div className="flex items-center justify-between pt-1">
                      <span><strong>Phone:</strong> {assignedAmb.phone}</span>
                      <a href={`tel:${assignedAmb.phone}`} className="text-emerald-600 font-bold hover:underline">
                        Call Unit
                      </a>
                    </div>
                  </div>
                </div>

                {/* Map Route Tracking */}
                <div>
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-2">
                    Ambulance Telemetry Tracking to Hospital ER
                  </span>
                  <LeafletMap
                    emergencyLocation={currentReport.location}
                    ambulanceLocation={assignedAmb.currentLocation}
                    hospitalLocation={hospital.location}
                    height="230px"
                  />
                </div>

              </div>
            ) : (
              <div className="p-8 text-center text-slate-400 bg-white dark:bg-navy-900 rounded-2xl border border-slate-200 dark:border-navy-800">
                No active incoming pre-alerts.
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Preparation Modal */}
      {prepModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-navy-900 rounded-2xl p-6 max-w-lg w-full border border-slate-200 dark:border-navy-800 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-navy-950 dark:text-white">
              Update Trauma Bay Preparation Checklist
            </h3>
            <p className="text-xs text-slate-500">
              Select items being pre-arranged in the emergency department for this incoming patient.
            </p>

            <div className="space-y-2">
              {prepChecklistOptions.map((opt) => (
                <label key={opt} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(opt)}
                    onChange={() => toggleChecklistItem(opt)}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Preparation Instructions / Physician Notes:
              </label>
              <textarea
                rows={2}
                value={prepNotes}
                onChange={(e) => setPrepNotes(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-navy-700 text-xs bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setPrepModalOpen(false)}
                className="px-4 py-2 rounded-xl border text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleAcknowledge}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow"
              >
                Confirm Readiness & Pre-Alert
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
