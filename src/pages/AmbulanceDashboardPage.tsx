import React, { useState } from 'react';
import { 
  Activity, 
  AlertCircle, 
  AlertOctagon, 
  Ambulance, 
  Building2, 
  Check, 
  CheckCircle2, 
  Clock, 
  Compass, 
  MapPin, 
  Navigation, 
  PhoneCall, 
  ShieldAlert, 
  Stethoscope, 
  User, 
  X, 
  XCircle 
} from 'lucide-react';
import { useJivanSetu } from '../context/JivanSetuContext';
import { EmergencyReport, EmergencyStatus } from '../types/emergency';
import { PriorityBadge } from '../components/common/PriorityBadge';
import { LeafletMap } from '../components/map/LeafletMap';

export const AmbulanceDashboardPage: React.FC = () => {
  const { reports, ambulances, hospitals, updateStatus, addToast } = useJivanSetu();

  // Selected unit: Eagle-1 ALS
  const activeAmbulance = ambulances[0];
  const [selectedReportId, setSelectedReportId] = useState<string>(reports[0]?.id || '');
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const currentReport = reports.find(r => r.id === selectedReportId) || reports[0];
  const targetHospital = hospitals.find(h => h.id === currentReport?.assignedHospitalId) || hospitals[0];

  // Metrics
  const activeReports = reports.filter(r => r.status !== 'Completed' && r.status !== 'Rejected');
  const pendingRequests = reports.filter(r => r.status === 'Received');
  const completedCount = reports.filter(r => r.status === 'Completed').length;
  const criticalCount = reports.filter(r => r.priority === 'RED').length;

  const handleStatusTransition = (newStatus: EmergencyStatus) => {
    if (!currentReport) return;
    const actor = `${activeAmbulance.paramedicName} (${activeAmbulance.callSign})`;
    updateStatus(currentReport.id, newStatus, actor, `Status advanced to ${newStatus}`);
  };

  const handleRejectAssignment = () => {
    if (!currentReport || !rejectReason.trim()) {
      addToast('warning', 'Decline Reason Required', 'Please specify a operational or clinical reason.');
      return;
    }
    const actor = `${activeAmbulance.paramedicName} (${activeAmbulance.callSign})`;
    updateStatus(currentReport.id, 'Rejected', actor, `Decline note: ${rejectReason}`, {
      rejectionReason: rejectReason
    });
    setRejectModalOpen(false);
    setRejectReason('');
  };

  const handleSendPreAlert = () => {
    if (!currentReport) return;
    updateStatus(
      currentReport.id,
      currentReport.status,
      activeAmbulance.paramedicName,
      'Direct Digital Pre-Alert transmitted to destination hospital ER.',
      {
        hospitalPreAlertSent: true,
        hospitalPreAlertTime: new Date().toISOString()
      }
    );
    addToast('success', 'Hospital Pre-Alert Dispatched', `Alert notified to ${targetHospital.name}.`);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy-950 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Dashboard Top Header */}
        <div className="bg-white dark:bg-navy-900 rounded-2xl p-6 border border-slate-200 dark:border-navy-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-600">
              <Ambulance className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-navy-950 dark:text-white">
                  108 EMS Ambulance Dispatch Console
                </h1>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                  Unit Active
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Call Sign: <strong className="text-slate-700 dark:text-slate-200">{activeAmbulance.callSign}</strong> ({activeAmbulance.vehicleNumber}) • Paramedic: {activeAmbulance.paramedicName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch md:self-auto">
            <button
              onClick={handleSendPreAlert}
              className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-emergency-600 hover:bg-emergency-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-red-500/20"
            >
              <Building2 className="w-4 h-4" />
              <span>Notify Hospital Pre-Alert</span>
            </button>
          </div>
        </div>

        {/* Prototype Disclaimer Banner */}
        <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-xs text-amber-800 dark:text-amber-300 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold uppercase tracking-wider text-[10px] px-2 py-0.5 rounded bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200">
              Simulated Services
            </span>
            <span>
              Demo 108 ALS Ambulance Console. Operates in simulation mode for prototype testing. For real-life emergencies, call 112.
            </span>
          </div>
          <span className="text-[11px] font-semibold text-slate-500 hidden sm:inline">
            Official Emergency Fallback: Dial 112
          </span>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Active Emergencies</span>
            <div className="text-2xl font-extrabold text-navy-950 dark:text-white mt-1">{activeReports.length}</div>
            <span className="text-[11px] text-amber-600 font-semibold">{pendingRequests.length} pending assignment</span>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Critical Priority RED</span>
            <div className="text-2xl font-extrabold text-red-600 mt-1">{criticalCount}</div>
            <span className="text-[11px] text-slate-400">Immediate ALS requirement</span>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Fleet Response Base</span>
            <div className="text-xs font-bold text-navy-950 dark:text-white mt-2 truncate">{activeAmbulance.baseStation}</div>
            <span className="text-[11px] text-emerald-600 font-semibold">GPS Synced</span>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Completed Handouts</span>
            <div className="text-2xl font-extrabold text-emerald-600 mt-1">{completedCount}</div>
            <span className="text-[11px] text-slate-400">Successfully transported</span>
          </div>
        </div>

        {/* Main Work Area: Request Queue (Left) & Active Case Detail (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Emergency Requests Queue (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-navy-950 dark:text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-emergency-600" />
                <span>Emergency Dispatch Queue ({reports.length})</span>
              </h3>
            </div>

            <div className="space-y-3 max-h-[680px] overflow-y-auto pr-1">
              {reports.map((rep) => {
                const isSelected = rep.id === selectedReportId;
                return (
                  <div
                    key={rep.id}
                    onClick={() => setSelectedReportId(rep.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-amber-50/80 dark:bg-navy-900 border-amber-500 shadow-md ring-2 ring-amber-500/20'
                        : 'bg-white dark:bg-navy-900/60 border-slate-200 dark:border-navy-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
                            {rep.id}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded font-bold uppercase bg-slate-100 dark:bg-navy-800 text-slate-700 dark:text-slate-300">
                            {rep.status}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-navy-950 dark:text-white mt-1">
                          {rep.emergencyType}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                          {rep.location.address}
                        </p>
                      </div>
                      <PriorityBadge priority={rep.priority} size="sm" />
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-navy-800 flex items-center justify-between text-[11px] text-slate-500">
                      <span>Casualties: <strong>{rep.victimCount}</strong></span>
                      <span>ETA ~ {rep.etaMinutes || 5} min</span>
                      <span className="text-amber-600 dark:text-amber-400 font-bold">Inspect Case →</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Case Details & Operations (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {currentReport ? (
              <div className="bg-white dark:bg-navy-900 p-6 rounded-2xl border border-slate-200 dark:border-navy-800 shadow-sm space-y-6">
                
                {/* Header: Title, Priority, Emergency Controls */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-navy-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-slate-300">
                        {currentReport.id}
                      </span>
                      <span className="text-xs text-slate-400">
                        Logged {new Date(currentReport.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <h2 className="text-lg font-extrabold text-navy-950 dark:text-white mt-1">
                      {currentReport.emergencyType}
                    </h2>
                  </div>

                  <div className="flex items-center gap-2">
                    <PriorityBadge priority={currentReport.priority} size="md" />
                  </div>
                </div>

                {/* Workflow Status Advance Bar */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Operational Dispatch Stage
                    </span>
                    <span className="text-xs font-extrabold text-emergency-600 uppercase">
                      Current: {currentReport.status}
                    </span>
                  </div>

                  {/* Actions for Paramedic */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {currentReport.status === 'Received' && (
                      <>
                        <button
                          onClick={() => handleStatusTransition('Accepted')}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow"
                        >
                          <Check className="w-4 h-4" /> Accept Assignment
                        </button>
                        <button
                          onClick={() => setRejectModalOpen(true)}
                          className="px-4 py-2 bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300 rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-red-200"
                        >
                          <X className="w-4 h-4" /> Decline
                        </button>
                      </>
                    )}

                    {currentReport.status === 'Accepted' && (
                      <button
                        onClick={() => handleStatusTransition('En Route')}
                        className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow"
                      >
                        <Navigation className="w-4 h-4" /> Start Route (En Route)
                      </button>
                    )}

                    {currentReport.status === 'En Route' && (
                      <button
                        onClick={() => handleStatusTransition('Arrived')}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow"
                      >
                        <MapPin className="w-4 h-4" /> Confirm Arrived at Scene
                      </button>
                    )}

                    {currentReport.status === 'Arrived' && (
                      <button
                        onClick={() => handleStatusTransition('Patient Transporting')}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow"
                      >
                        <Ambulance className="w-4 h-4" /> Begin Transport to ER
                      </button>
                    )}

                    {currentReport.status === 'Patient Transporting' && (
                      <button
                        onClick={() => handleStatusTransition('Completed')}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Complete Handover at Hospital
                      </button>
                    )}

                    {currentReport.status === 'Completed' && (
                      <span className="px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-xs font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Case Concluded & Logged
                      </span>
                    )}
                  </div>
                </div>

                {/* Map Preview for Route */}
                <div>
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-2">
                    Navigation Route: Ambulance ➔ Scene ({currentReport.location.address}) ➔ {targetHospital.name}
                  </span>
                  <LeafletMap
                    emergencyLocation={currentReport.location}
                    ambulanceLocation={activeAmbulance.currentLocation}
                    hospitalLocation={targetHospital.location}
                    height="240px"
                  />
                </div>

                {/* Patient Clinical Profile & Warning Signs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 space-y-2">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Reported Clinical Parameters</span>
                    <div><strong>Consciousness:</strong> {currentReport.consciousness}</div>
                    <div><strong>Breathing:</strong> {currentReport.breathing}</div>
                    <div><strong>Hemorrhage:</strong> {currentReport.severeBleeding}</div>
                    <div><strong>Suspected:</strong> {currentReport.suspectedInjuries.join(', ') || 'General trauma'}</div>
                    {currentReport.additionalNotes && (
                      <div className="italic text-slate-500">"{currentReport.additionalNotes}"</div>
                    )}
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 space-y-2">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Caller Contact</span>
                    <div><strong>Name:</strong> {currentReport.reporterName}</div>
                    <div className="flex items-center justify-between">
                      <span><strong>Phone:</strong> {currentReport.reporterPhone}</span>
                      <a href={`tel:${currentReport.reporterPhone}`} className="text-emergency-600 font-bold hover:underline">
                        Call Caller
                      </a>
                    </div>
                    <div className="pt-2 border-t border-slate-200 dark:border-navy-800">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">Receiving Facility</span>
                      <strong>{targetHospital.name}</strong>
                      <div className="text-[11px] text-slate-500">ER Hotline: {targetHospital.emergencyContact}</div>
                    </div>
                  </div>
                </div>

                {/* Equipment Recommendation Checklist (Informational safety) */}
                <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-navy-950 border border-blue-200 dark:border-blue-900/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-blue-900 dark:text-blue-300 font-bold text-xs">
                      <Stethoscope className="w-4 h-4 text-blue-600" />
                      <span>Suggested Equipment Preparation (Pre-Arrival Information)</span>
                    </div>
                    <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold">
                      Informational Only • Medical Professional Discretion
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {currentReport.recommendedEquipment.map((eq, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-white dark:bg-navy-900 border border-blue-100 dark:border-navy-800 text-xs">
                        <div className="flex items-center justify-between">
                          <strong className="text-slate-800 dark:text-slate-200">{eq.name}</strong>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                            eq.priority === 'CRITICAL' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {eq.priority}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{eq.rationale}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* SBAR Structured Handover Summary */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 space-y-2 text-xs">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Structured Clinical SBAR Summary
                  </span>
                  <div><strong className="text-navy-950 dark:text-white">Situation:</strong> {currentReport.sbarSummary.situation}</div>
                  <div><strong className="text-navy-950 dark:text-white">Background:</strong> {currentReport.sbarSummary.background}</div>
                  <div><strong className="text-navy-950 dark:text-white">Assessment:</strong> {currentReport.sbarSummary.assessment}</div>
                  <div><strong className="text-navy-950 dark:text-white">Recommendation:</strong> {currentReport.sbarSummary.recommendation}</div>
                </div>

              </div>
            ) : (
              <div className="p-8 text-center text-slate-400 bg-white dark:bg-navy-900 rounded-2xl border border-slate-200 dark:border-navy-800">
                Select an emergency incident to view telemetry.
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Reject Modal */}
      {rejectModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-navy-900 rounded-2xl p-6 max-w-md w-full border border-slate-200 dark:border-navy-800 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-navy-950 dark:text-white">
              Decline Emergency Assignment
            </h3>
            <p className="text-xs text-slate-500">
              Please enter mandatory operational reason for declining this assignment (e.g. vehicle mechanical fault, engaged with prior resuscitation).
            </p>
            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Specify reason..."
              className="w-full p-3 rounded-xl border border-slate-300 dark:border-navy-700 text-xs bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white focus:outline-none"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setRejectModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-navy-700 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectAssignment}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold"
              >
                Confirm Decline
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
