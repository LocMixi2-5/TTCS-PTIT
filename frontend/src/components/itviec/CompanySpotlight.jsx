import { ArrowRight, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import CompanyLogo from '../cards/CompanyLogo';

export default function CompanySpotlight({ company, featuredJobs = [], isSelected, onClick }) {
  if (!company) return null;

  return (
    <div 
      onClick={() => onClick && onClick(company.id)}
      className={`w-full bg-white rounded-xl shadow-sm border p-6 flex flex-col md:flex-row gap-6 transition-all cursor-pointer group ${isSelected ? 'border-[#38bdf8] shadow-md shadow-[#38bdf8]/10 ring-1 ring-[#38bdf8]' : 'border-gray-200 hover:border-[#0a66c2]/30 hover:shadow-md'}`}
    >
      
      {/* Left: Logo */}
      <div className="shrink-0 flex justify-center items-start">
        <div className="shadow-sm rounded-lg overflow-hidden bg-white p-1 border border-gray-100">
          <CompanyLogo company={company} size={88} className="rounded-lg" />
        </div>
      </div>

      {/* Center: Info */}
      <div className="flex-1 flex flex-col justify-center">
        <h2 className={`text-xl font-bold mb-2 transition-colors ${isSelected ? 'text-[#0a66c2]' : 'text-[#002d5c] group-hover:text-[#0a66c2]'}`}>
          {company.name}
        </h2>
        <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
          <MapPin size={16} className="text-[#0a66c2]" />
          <span>{company.location}</span>
        </div>
        <p className="text-gray-600 text-sm line-clamp-2">
          {company.description}
        </p>
      </div>

      {/* Right: Jobs */}
      <div className="flex-1 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6 flex flex-col justify-center">
        <h3 className="text-sm font-semibold text-[#002d5c] mb-3 uppercase tracking-wider">Tuyển dụng nổi bật</h3>
        {featuredJobs.length > 0 ? (
          <ul className="space-y-3">
            {featuredJobs.slice(0, 3).map((job) => (
              <li key={job.id} className="group/job">
                <div className="flex items-start gap-2 text-sm text-gray-700 hover:text-[#0a66c2] transition-colors font-medium">
                  <ArrowRight size={16} className="text-[#0a66c2] shrink-0 mt-0.5 group-hover/job:translate-x-1 transition-transform" />
                  <span className="line-clamp-1">{job.title}</span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500 italic">Đang cập nhật...</p>
        )}
      </div>

    </div>
  );
}
