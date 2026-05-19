// ═══════════════════════════════════════════════════
// CompaniesPage — Company listing with real logos & theme support
// ═══════════════════════════════════════════════════
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Building2, Briefcase, Loader2 } from 'lucide-react';
import axios from 'axios';
import CompanyLogo from '../../components/cards/CompanyLogo';

export default function CompaniesPage() {
  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchCompanies = async (query = '') => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:3000/api/companies?q=${query}`, {
        withCredentials: true,
      });
      setCompanies(res.data);
    } catch (error) {
      console.error('Failed to fetch companies', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCompanies(); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCompanies(search);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="ambient-bg" />
      <div className="max-w-7xl mx-auto relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-5"
        >
          <div>
            <h1 className="text-3xl sm:text-4xl font-display font-bold gradient-text mb-2">
              Khám phá Công ty
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              Tìm hiểu môi trường làm việc và cơ hội nghề nghiệp
            </p>
          </div>

          <form onSubmit={handleSearch} className="w-full md:w-96 relative">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2"
              style={{ color: 'var(--text-muted)' }}
            />
            <input
              type="text"
              placeholder="Tìm kiếm tên công ty..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10 py-2.5 text-sm"
              id="company-search-input"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 btn-primary text-xs px-3 py-1.5"
            >
              Tìm
            </button>
          </form>
        </motion.div>

        {/* Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 size={40} className="animate-spin text-primary-400" />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          >
            {companies.map((company, i) => (
              <motion.div
                key={company.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <Link
                  to={`/companies/${company.id}`}
                  className="glass-card p-5 flex flex-col gap-4 hover:border-primary-500/30 hover:shadow-lg hover:shadow-primary-500/10 transition-all group block"
                >
                  <div className="flex items-center gap-3">
                    <CompanyLogo company={company} size={56} />
                    <div className="flex-1 min-w-0">
                      <h3
                        className="text-sm font-semibold group-hover:text-primary-400 transition-colors line-clamp-1"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {company.name}
                      </h3>
                      <span
                        className="inline-flex items-center gap-1 text-xs mt-1 px-2 py-0.5 rounded-full"
                        style={{
                          background: 'rgba(99,102,241,0.12)',
                          color: '#818cf8',
                          border: '1px solid rgba(99,102,241,0.2)',
                        }}
                      >
                        <Briefcase size={10} />
                        {company.job_count || 0} việc làm
                      </span>
                    </div>
                  </div>
                  <p
                    className="text-xs leading-relaxed line-clamp-2"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {company.description || 'Chưa có mô tả chi tiết cho công ty này.'}
                  </p>
                </Link>
              </motion.div>
            ))}

            {companies.length === 0 && (
              <div className="col-span-full text-center py-16">
                <Building2 size={40} className="mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
                <p style={{ color: 'var(--text-secondary)' }}>
                  Không tìm thấy công ty nào phù hợp.
                </p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
