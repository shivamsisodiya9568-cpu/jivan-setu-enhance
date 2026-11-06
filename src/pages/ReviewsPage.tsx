import React, { useState } from 'react';
import { 
  Ambulance, 
  Building2, 
  CheckCircle2, 
  Filter, 
  MessageSquare, 
  Plus, 
  ShieldCheck, 
  Star, 
  ThumbsUp, 
  X 
} from 'lucide-react';
import { useJivanSetu } from '../context/JivanSetuContext';
import { ServiceReview } from '../types/emergency';

const TAG_SUGGESTIONS = [
  'Rapid Arrival (< 5 min)',
  'Paramedic Professionalism',
  'Life Support Oxygen',
  'Pre-Alert Bay Ready',
  'Clean Ambulance',
  'Gentle Patient Care',
  'Smooth Handover',
  'Calm Communication'
];

export const ReviewsPage: React.FC = () => {
  const { reviews, submitReview, ambulances, hospitals, userProfile, addToast } = useJivanSetu();

  const [activeFilter, setActiveFilter] = useState<'all' | 'hospital' | 'ambulance'>('all');
  const [modalOpen, setModalOpen] = useState(false);

  // Form State
  const [targetType, setTargetType] = useState<'hospital' | 'ambulance'>('ambulance');
  const [targetId, setTargetId] = useState<string>(ambulances[0]?.id || '');
  const [rating, setRating] = useState<number>(5);
  const [selectedTags, setSelectedTags] = useState<string[]>(['Rapid Arrival (< 5 min)']);
  const [comment, setComment] = useState('');
  const [authorName, setAuthorName] = useState(userProfile.fullName || 'Verified Patient');

  const filteredReviews = reviews.filter((r) => {
    if (activeFilter === 'all') return true;
    return r.targetType === activeFilter;
  });

  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
    : '5.0';

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      addToast('warning', 'Comment Required', 'Please share a brief note about the emergency care.');
      return;
    }

    let targetName = '';
    if (targetType === 'ambulance') {
      const amb = ambulances.find(a => a.id === targetId) || ambulances[0];
      targetName = `${amb.callSign} (${amb.vehicleNumber})`;
    } else {
      const hosp = hospitals.find(h => h.id === targetId) || hospitals[0];
      targetName = hosp.name;
    }

    submitReview({
      targetType,
      targetId,
      targetName,
      authorName: authorName.trim() || 'Anonymous Bystander',
      rating,
      tags: selectedTags,
      comment: comment.trim(),
      verifiedRescue: true
    });

    setModalOpen(false);
    setComment('');
  };

  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-navy-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Emergency Service Reviews
              </h1>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                ★ {averageRating} / 5.0
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Community experiences with 108 ambulance teams and hospital emergency trauma units.
            </p>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emergency-600 hover:bg-emergency-700 text-white font-bold text-sm shadow-md shadow-red-500/20 transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            <Plus className="w-4 h-4" />
            <span>Write a Review</span>
          </button>
        </div>

        {/* Aggregate Metrics Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center font-black text-xl">
              ★
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                {averageRating}
              </div>
              <div className="text-xs text-slate-500 font-medium">Overall Care Rating</div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center">
              <Ambulance className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                4.2 min
              </div>
              <div className="text-xs text-slate-500 font-medium">Avg. Reported Response Time</div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                100%
              </div>
              <div className="text-xs text-slate-500 font-medium">Verified Incident Feedback</div>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2">
          {(['all', 'ambulance', 'hospital'] as const).map((filter) => {
            const isSelected = activeFilter === filter;
            const labels = {
              all: `All Reviews (${reviews.length})`,
              ambulance: `Ambulance Units (${reviews.filter(r => r.targetType === 'ambulance').length})`,
              hospital: `Hospital Trauma Units (${reviews.filter(r => r.targetType === 'hospital').length})`
            };
            return (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                  isSelected
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-sm'
                    : 'bg-white dark:bg-navy-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-navy-800 hover:bg-slate-50'
                }`}
              >
                {labels[filter]}
              </button>
            );
          })}
        </div>

        {/* Reviews List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredReviews.map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-sm flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      item.targetType === 'ambulance'
                        ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600'
                        : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600'
                    }`}>
                      {item.targetType === 'ambulance' ? (
                        <Ambulance className="w-5 h-5" />
                      ) : (
                        <Building2 className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                        {item.targetName}
                      </h4>
                      <span className="text-[11px] text-slate-400 capitalize">
                        {item.targetType} Service
                      </span>
                    </div>
                  </div>

                  {/* Star Rating Display */}
                  <div className="flex items-center gap-0.5 text-amber-500 shrink-0">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className={`text-sm ${i < item.rating ? 'opacity-100' : 'opacity-20'}`}>
                        ★
                      </span>
                    ))}
                  </div>
                </div>

                {/* Review Text */}
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  "{item.comment}"
                </p>

                {/* Tags */}
                {item.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {item.tags.map(tag => (
                      <span
                        key={tag}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-slate-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Author & Verification Footer */}
              <div className="pt-3 border-t border-slate-100 dark:border-navy-800 flex items-center justify-between text-[11px] text-slate-400">
                <div className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{item.authorName}</span>
                </div>
                <span>{new Date(item.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Review Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white dark:bg-navy-900 rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 dark:border-navy-800 shadow-2xl space-y-6">
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Submit Service Review
                  </h3>
                  <p className="text-xs text-slate-500">
                    Help other citizens and improve emergency quality
                  </p>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-navy-800 text-slate-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Type Selection */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setTargetType('ambulance');
                      setTargetId(ambulances[0]?.id || '');
                    }}
                    className={`p-3 rounded-2xl text-xs font-bold border transition-all flex items-center justify-center gap-2 ${
                      targetType === 'ambulance'
                        ? 'border-emergency-600 bg-red-50 text-emergency-700'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    <Ambulance className="w-4 h-4" />
                    <span>Ambulance Service</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setTargetType('hospital');
                      setTargetId(hospitals[0]?.id || '');
                    }}
                    className={`p-3 rounded-2xl text-xs font-bold border transition-all flex items-center justify-center gap-2 ${
                      targetType === 'hospital'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    <Building2 className="w-4 h-4" />
                    <span>Hospital Trauma Care</span>
                  </button>
                </div>

                {/* Target Unit Dropdown */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Select Specific Facility / Unit
                  </label>
                  <select
                    value={targetId}
                    onChange={(e) => setTargetId(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emergency-500"
                  >
                    {targetType === 'ambulance'
                      ? ambulances.map(a => (
                          <option key={a.id} value={a.id}>
                            {a.callSign} - {a.driverName} ({a.vehicleNumber})
                          </option>
                        ))
                      : hospitals.map(h => (
                          <option key={h.id} value={h.id}>
                            {h.name} - {h.category}
                          </option>
                        ))}
                  </select>
                </div>

                {/* Star Rating Selection */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Rating (1 to 5 Stars)
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`text-2xl transition-transform hover:scale-125 ${
                          star <= rating ? 'text-amber-500' : 'text-slate-200 dark:text-navy-700'
                        }`}
                      >
                        ★
                      </button>
                    ))}
                    <span className="text-xs font-bold text-slate-600 ml-2">
                      {rating} Star{rating > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>

                {/* Tags */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Quick Highlights
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {TAG_SUGGESTIONS.map((tag) => {
                      const isSelected = selectedTags.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => toggleTag(tag)}
                          className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-all ${
                            isSelected
                              ? 'bg-emergency-50 border-emergency-300 text-emergency-700'
                              : 'bg-white dark:bg-navy-800 border-slate-200 text-slate-600 hover:border-slate-300'
                          }`}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Comment Text */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Your Experience & Care Details
                  </label>
                  <textarea
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Describe how the response team performed, arrival speed, and emergency care..."
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emergency-500"
                    required
                  />
                </div>

                {/* Author Name */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Your Display Name
                  </label>
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-800 text-slate-900 dark:text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-emergency-600 hover:bg-emergency-700 text-white font-bold text-xs shadow-md shadow-red-500/25 transition-all mt-2"
                >
                  Publish Verified Review
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
