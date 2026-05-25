import { MapPin, DollarSign, CheckCircle } from 'lucide-react';
import { useState } from 'react';

export default function SuperHotJobCard({ job, company }) {
  const [showSalary, setShowSalary] = useState(false);
  const [isApplied, setIsApplied] = useState(false);

  if (!job || !company) return null;

  const isHighMatch = job.matchScore >= 85;

  return (
    <div className={`w-full bg-white rounded-lg shadow-sm border transition-all relative p-5 flex flex-col h-full group ${isHighMatch ? 'border-[#38bdf8]/30 hover:border-[#38bdf8]' : 'border-gray-200 hover:border-[#0a66c2]'}`}>
      
      {/* AI Match Score Badge */}
      <div className={`absolute -top-3 -left-3 text-xs font-bold px-3 py-1 rounded-sm shadow-md uppercase tracking-wider flex items-center gap-1 ${isHighMatch ? 'bg-gradient-to-r from-[#002d5c] to-[#0a66c2] text-white' : 'bg-orange-500 text-white'}`}>
        {isHighMatch ? '⚡ NỔI BẬT' : '🔥 PHÙ HỢP'}
      </div>

      <div className="absolute top-3 right-3">
        <div className={`text-xs font-bold px-2 py-1 rounded-md ${isHighMatch ? 'text-emerald-600 bg-emerald-50 border border-emerald-200' : 'text-orange-600 bg-orange-50 border border-orange-200'}`}>
          {job.matchScore}% Match
        </div>
      </div>

      <div className="flex gap-4 mt-2">
        {/* Logo */}
        <div className="w-16 h-16 shrink-0 rounded-md border border-gray-100 p-1 flex items-center justify-center bg-white shadow-sm overflow-hidden">
          <img 
            src={company.logo} 
            alt={company.name} 
            className="w-full h-full object-contain text-xs font-bold text-gray-400 text-center flex items-center justify-center break-words"
          />
        </div>

        {/* Content */}
        <div className="flex-1 pr-12">
          <h3 className="font-bold text-[#002d5c] text-lg group-hover:text-[#0a66c2] transition-colors line-clamp-2 leading-tight mb-1">
            {job.title}
          </h3>
          <p className="text-sm font-medium text-gray-600 mb-3">{company.name}</p>
          
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <DollarSign size={16} className="text-[#0a66c2] shrink-0" />
              {!showSalary ? (
                <button 
                  onClick={() => setShowSalary(true)}
                  className="text-[#002d5c] font-semibold bg-[#e8f3ff] px-2 py-0.5 rounded cursor-pointer hover:bg-blue-100 transition-colors"
                >
                  Click để xem mức lương
                </button>
              ) : (
                <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 animate-in fade-in zoom-in duration-300">
                  {job.salary}
                </span>
              )}
            </div>
            <div className="flex items-start gap-2">
              <MapPin size={16} className="text-gray-400 shrink-0 mt-0.5" />
              <span className="line-clamp-1">{job.location}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="mt-4 flex flex-wrap gap-2">
        {job.tags.map((tag, idx) => (
          <span key={idx} className="px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-md border border-gray-200">
            {tag}
          </span>
        ))}
      </div>

      {/* Apply Button */}
      <div className="mt-auto pt-5">
        <button 
          onClick={() => setIsApplied(true)}
          disabled={isApplied}
          className={`block w-full text-center py-2.5 rounded-md font-bold transition-all text-sm uppercase tracking-wide border flex items-center justify-center gap-2 ${
            isApplied 
            ? 'bg-emerald-50 text-emerald-600 border-emerald-200 cursor-not-allowed'
            : 'text-[#0a66c2] border-[#0a66c2] hover:bg-[#0a66c2] hover:text-white'
          }`}
        >
          {isApplied ? (
            <>
              <CheckCircle size={18} /> Đã ứng tuyển
            </>
          ) : (
            'Ứng tuyển ngay'
          )}
        </button>
      </div>
    </div>
  );
}
