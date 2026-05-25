import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import HeroSearch from '../components/itviec/HeroSearch';
import CompanySpotlight from '../components/itviec/CompanySpotlight';
import JobListingHeader from '../components/itviec/JobListingHeader';
import SuperHotJobCard from '../components/itviec/SuperHotJobCard';
import { companies, jobs } from '../data/mockData';
import { X, FileText, Upload } from 'lucide-react';

export default function LandingPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCity, setSearchCity] = useState('');
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);

  const handleSearch = ({ keyword, city }) => {
    setSearchQuery(keyword || '');
    setSearchCity(city || '');
    setSelectedCompanyId(null); // Reset company filter on new text search
  };

  const handleCompanyClick = (companyId) => {
    if (selectedCompanyId === companyId) {
      setSelectedCompanyId(null); // Toggle off
    } else {
      setSelectedCompanyId(companyId);
    }
  };

  const filteredJobs = useMemo(() => {
    let result = jobs;

    if (selectedCompanyId) {
      result = result.filter(j => j.companyId === selectedCompanyId);
    }

    if (searchCity) {
      result = result.filter(j => j.location && j.location.includes(searchCity));
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(j => {
        const company = companies.find(c => c.id === j.companyId);
        const matchTitle = j.title.toLowerCase().includes(q);
        const matchCompany = company && company.name.toLowerCase().includes(q);
        const matchTags = j.tags.some(t => t.toLowerCase().includes(q));
        return matchTitle || matchCompany || matchTags;
      });
    }

    return result;
  }, [searchQuery, searchCity, selectedCompanyId]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pt-16">
      {/* The global Navbar now handles the Navy Blue ITviec style across the whole app. */}
      <style>{`
        body { background-color: #f9fafb !important; color: #111827 !important; }
      `}</style>
      
      {/* Hero / Search Section */}
      <HeroSearch onSearch={handleSearch} />

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-4 md:px-8 py-10">
        
        {/* Top Companies Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#002d5c] mb-6">Nhà Tuyển Dụng Hàng Đầu</h2>
          <div className="grid grid-cols-1 gap-6">
            {companies.map(company => {
              const companyJobs = jobs.filter(j => j.companyId === company.id);
              return (
                <CompanySpotlight 
                  key={company.id} 
                  company={company} 
                  featuredJobs={companyJobs}
                  isSelected={selectedCompanyId === company.id}
                  onClick={handleCompanyClick}
                />
              );
            })}
          </div>
        </section>

        {/* Job Listings Section */}
        <section>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-4">
            <h2 className="text-2xl font-bold text-[#002d5c]">Việc Làm Nổi Bật</h2>
            
            {/* Filter Status Indicator */}
            {(searchQuery || searchCity || selectedCompanyId) && (
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-600">
                  Hiển thị <span className="font-bold text-[#0a66c2]">{filteredJobs.length}</span> việc làm 
                  {selectedCompanyId && ` cho ${companies.find(c => c.id === selectedCompanyId)?.name}`}
                  {searchQuery && ` từ khóa "${searchQuery}"`}
                  {searchCity && ` tại "${searchCity}"`}
                </span>
                <button 
                  onClick={() => { setSearchQuery(''); setSearchCity(''); setSelectedCompanyId(null); }}
                  className="flex items-center gap-1 text-xs font-bold text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-2 py-1 rounded transition-colors shrink-0"
                >
                  <X size={14} /> Bỏ lọc
                </button>
              </div>
            )}
          </div>
          
          <JobListingHeader totalJobs={filteredJobs.length} />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredJobs.length > 0 ? (
                filteredJobs.map(job => (
                  <SuperHotJobCard 
                    key={job.id} 
                    job={job} 
                    company={companies.find(c => c.id === job.companyId)} 
                  />
                ))
              ) : (
                <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-lg border border-dashed border-gray-300">
                  Không tìm thấy việc làm phù hợp với tiêu chí của bạn.
                </div>
              )}
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="w-full bg-[#002d5c] border-t border-[#004182] py-12 mt-12 text-center text-blue-200 text-sm">
        <p>© 2026 JobAI. Tích hợp hệ thống phân tích ngữ nghĩa AI SBERT. All rights reserved.</p>
      </footer>
    </div>
  );
}
