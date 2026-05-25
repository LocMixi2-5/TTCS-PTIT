import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, ChevronRight, Loader2 } from 'lucide-react';
import CompanyLogo from '../../components/cards/CompanyLogo';
import { companies as mockCompanies, jobs as mockJobs } from '../../data/mockData';

export default function CompaniesPage() {
  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchCompanies = (query = '') => {
    setLoading(true);
    setTimeout(() => {
      let result = mockCompanies;
      if (query) {
        result = result.filter(c => c.name.toLowerCase().includes(query.toLowerCase()));
      }
      // Add job counts manually for the list view
      const enrichedResult = result.map(c => ({
        ...c,
        job_count: mockJobs.filter(j => j.companyId === c.id).length
      }));
      setCompanies(enrichedResult);
      setLoading(false);
    }, 400);
  };

  useEffect(() => { fetchCompanies(); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCompanies(search);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 bg-[#004182]">
      <div className="max-w-6xl mx-auto relative z-10">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-5 border-b border-blue-800/50 pb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              Khám phá Công ty
            </h1>
            <p className="text-blue-200">
              Tìm hiểu môi trường làm việc và cơ hội nghề nghiệp
            </p>
          </div>

          <div className="flex flex-col items-end gap-2 w-full md:w-auto">
            <form onSubmit={handleSearch} className="w-full md:w-80 relative flex items-center">
              <Search
                size={18}
                className="absolute left-3 text-gray-400"
              />
              <input
                type="text"
                placeholder="Tìm kiếm tên công ty..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#002d5c] border border-blue-800 text-white pl-10 pr-20 py-2.5 rounded-lg focus:outline-none focus:border-[#0a66c2] placeholder-gray-400 text-sm"
              />
              <button
                type="submit"
                className="absolute right-1 top-1 bottom-1 bg-[#0a66c2] hover:bg-blue-600 text-white text-sm px-4 rounded-md font-medium transition-colors"
              >
                Search
              </button>
            </form>
            <span className="text-blue-200 text-sm">{mockJobs.length} Việc làm IT tại Việt Nam</span>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 size={40} className="animate-spin text-white" />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            {companies.map((company, i) => (
              <motion.div
                key={company.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <Link
                  to={`/companies/${company.id}`}
                  className="bg-[#002d5c] rounded-xl p-4 flex flex-col h-full hover:bg-[#0f3b6c] border border-blue-900/50 hover:border-[#0a66c2]/50 transition-all group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white rounded-lg p-1 flex items-center justify-center shrink-0">
                        {/* If CompanyLogo component uses full width/height naturally, we wrap it, otherwise adjust inside it */}
                        <div className="w-full h-full relative overflow-hidden flex items-center justify-center">
                           <CompanyLogo company={company} size={40} />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-bold text-sm leading-tight group-hover:text-[#38bdf8] transition-colors truncate">
                          {company.name}
                        </h3>
                        <p className="text-[#38bdf8] text-xs mt-0.5">
                          {company.job_count > 0 ? `${company.job_count} việc làm` : 'Top Công Ty (Company Spotlight)'}
                        </p>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-blue-400 group-hover:text-white transition-colors shrink-0" />
                  </div>
                  
                  <div className="mt-auto pt-2 border-t border-blue-800/30">
                     <p className="text-blue-200/80 text-xs line-clamp-2 leading-relaxed">
                       {company.description || 'Tập đoàn công nghệ hàng đầu.'}
                     </p>
                  </div>
                </Link>
              </motion.div>
            ))}

            {companies.length === 0 && (
              <div className="col-span-full text-center py-16 text-blue-200">
                Không tìm thấy công ty nào phù hợp.
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
