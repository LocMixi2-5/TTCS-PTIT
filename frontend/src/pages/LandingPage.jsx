import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HeroSearch from '../components/itviec/HeroSearch';
import CompanySpotlight from '../components/itviec/CompanySpotlight';
import JobListingHeader from '../components/itviec/JobListingHeader';
import SuperHotJobCard from '../components/itviec/SuperHotJobCard';
import { companies as mockCompanies, jobs as mockJobs } from '../data/mockData';
import { jobsAPI } from '../services/api';
import useAuthStore from '../stores/authStore';
import { X, Loader2 } from 'lucide-react';

export default function LandingPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCity, setSearchCity] = useState('');
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);

  // Real jobs from API (with match scores from latest CV)
  const [apiJobs, setApiJobs] = useState([]);
  const [hasCv, setHasCv] = useState(false);
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);
  const { isAuthenticated } = useAuthStore();

  // Fetch real jobs from backend
  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoadingJobs(true);
      try {
        const { data } = await jobsAPI.getFeed();
        setApiJobs(data.jobs || []);
        setHasCv(data.has_cv || false);
      } catch (err) {
        console.warn('Could not fetch job feed, using mock data:', err.message);
        setApiJobs([]);
        setHasCv(false);
      } finally {
        setIsLoadingJobs(false);
      }
    };

    fetchJobs();
  }, [isAuthenticated]);

  // Build the display jobs: use API data when available, 
  // falling back to mock data structure for compatibility
  const displayJobs = useMemo(() => {
    if (apiJobs.length > 0) {
      return apiJobs.map((j) => ({
        id: j.id,
        companyId: j.company_id,
        title: j.title,
        location: j.location || '',
        salary: j.salary_range || 'Thương lượng',
        tags: j.required_skills || [],
        matchScore: j.match_score != null ? parseFloat(j.match_score) : null,
        description: j.description,
        experience_level: j.experience_level,
        _companyName: j.company_name,
        _logoUrl: j.logo_url,
      }));
    }
    return mockJobs.map((j) => ({
      ...j,
      matchScore: null,
    }));
  }, [apiJobs]);

  // Build company lookup from API jobs
  const apiCompanyMap = useMemo(() => {
    const map = {};
    apiJobs.forEach((j) => {
      if (j.company_id && !map[j.company_id]) {
        const mockMatch = mockCompanies.find(
          (mc) => mc.name.toLowerCase() === (j.company_name || '').toLowerCase()
        );
        if (mockMatch) {
          map[j.company_id] = { ...mockMatch, id: j.company_id };
        } else {
          map[j.company_id] = {
            id: j.company_id,
            name: j.company_name,
            logo: j.logo_url,
            shortName: j.company_name ? j.company_name.substring(0, 2).toUpperCase() : 'NA',
            themeColor: '#0a66c2',
          };
        }
      }
    });
    return map;
  }, [apiJobs]);

  // Calculate top companies dynamically based on API jobs
  const topCompanies = useMemo(() => {
    if (apiJobs.length === 0) return mockCompanies.slice(0, 14);

    const counts = {};
    apiJobs.forEach(j => {
      if (!j.company_id) return;
      counts[j.company_id] = (counts[j.company_id] || 0) + 1;
    });

    const sortedIds = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
    return sortedIds.slice(0, 14).map(id => apiCompanyMap[id]).filter(Boolean);
  }, [apiJobs, apiCompanyMap]);

  const handleSearch = ({ keyword, city }) => {
    setSearchQuery(keyword || '');
    setSearchCity(city || '');
    setSelectedCompanyId(null);
  };

  const handleCompanyClick = (companyId) => {
    if (selectedCompanyId === companyId) {
      setSelectedCompanyId(null);
    } else {
      setSelectedCompanyId(companyId);
    }
  };

  const filteredJobs = useMemo(() => {
    let result = displayJobs;

    if (selectedCompanyId) {
      result = result.filter(j => j.companyId === selectedCompanyId);
    }

    if (searchCity) {
      result = result.filter(j => j.location && j.location.includes(searchCity));
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(j => {
        const matchTitle = j.title.toLowerCase().includes(q);
        const matchCompany = (j._companyName || '').toLowerCase().includes(q);
        const matchTags = (j.tags || []).some(t => t.toLowerCase().includes(q));
        return matchTitle || matchCompany || matchTags;
      });
    }

    if (hasCv) {
      result = [...result].sort((a, b) => {
        const scoreA = a.matchScore || 0;
        const scoreB = b.matchScore || 0;
        return scoreB - scoreA;
      });
    }

    return result;
  }, [displayJobs, searchQuery, searchCity, selectedCompanyId, hasCv]);

  // Helper: get company object for a job
  const getCompany = (job) => {
    if (job.companyId && apiCompanyMap[job.companyId]) {
      return apiCompanyMap[job.companyId];
    }
    return mockCompanies.find(c => c.id === job.companyId) || {
      id: job.companyId,
      name: job._companyName || 'Unknown',
      shortName: (job._companyName || 'NA').substring(0, 2).toUpperCase(),
      themeColor: '#0a66c2',
    };
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pt-16">
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
            {topCompanies.map(company => {
              const companyJobs = displayJobs.filter(j => j.companyId === company.id);
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
            <div>
              <h2 className="text-2xl font-bold text-[#002d5c]">
                {hasCv ? 'Việc Làm Phù Hợp Với CV Của Bạn' : 'Việc Làm Nổi Bật'}
              </h2>
              {hasCv && (
                <p className="text-sm text-gray-500 mt-1">
                  Điểm match được tính dựa trên CV mới nhất của bạn
                </p>
              )}
            </div>
            
            {/* Filter Status Indicator */}
            {(searchQuery || searchCity || selectedCompanyId) && (
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-600">
                  Hiển thị <span className="font-bold text-[#0a66c2]">{filteredJobs.length}</span> việc làm 
                  {selectedCompanyId && ` cho ${mockCompanies.find(c => c.id === selectedCompanyId)?.name || ''}`}
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
          
          {isLoadingJobs ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={32} className="animate-spin text-[#0a66c2]" />
              <span className="ml-3 text-gray-500 font-medium">Đang tải việc làm...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
              <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredJobs.length > 0 ? (
                  filteredJobs.map(job => (
                    <SuperHotJobCard 
                      key={job.id} 
                      job={job} 
                      company={getCompany(job)} 
                    />
                  ))
                ) : (
                  <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-lg border border-dashed border-gray-300">
                    Không tìm thấy việc làm phù hợp với tiêu chí của bạn.
                  </div>
                )}
              </div>
            </div>
          )}
        </section>

      </main>

      {/* Footer */}
      <footer className="w-full bg-[#002d5c] border-t border-[#004182] py-12 mt-12 text-center text-blue-200 text-sm">
        <p>© 2026 JobAI. Tích hợp hệ thống phân tích ngữ nghĩa AI SBERT. All rights reserved.</p>
      </footer>
    </div>
  );
}
