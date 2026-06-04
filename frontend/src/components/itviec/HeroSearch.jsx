import { MapPin, Search, Upload } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobsAPI } from '../../services/api';
import { useJobTracking } from '../../hooks/useJobTracking';

export default function HeroSearch({ onSearch }) {
  const [keyword, setKeyword] = useState('');
  const [city, setCity] = useState('');
  const [suggestions, setSuggestions] = useState(['React', 'Java', 'Python', 'AWS']);
  const navigate = useNavigate();
  const { trackSearch } = useJobTracking();

  useEffect(() => {
    jobsAPI.getSuggestions()
      .then(res => {
        if (res.data && res.data.suggestions) {
          setSuggestions(res.data.suggestions);
        }
      })
      .catch(err => console.error('Failed to fetch suggestions:', err));
  }, []);

  const handleSearch = () => {
    if (keyword.trim() || city.trim()) {
      trackSearch(keyword, { city });
    }
    if (onSearch) {
      onSearch({ keyword, city });
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setKeyword(suggestion);
    trackSearch(suggestion, { city, source: 'suggestion' });
    if (onSearch) {
      onSearch({ keyword: suggestion, city });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <section className="w-full bg-gradient-to-r from-[#002d5c] to-[#004182] py-16 px-4 md:px-8">
      <div className="max-w-5xl mx-auto flex flex-col items-center">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-8 text-center leading-tight">
          Sự nghiệp IT vững chắc <br className="md:hidden" /> Bắt đầu từ đây
        </h1>
        
        {/* Search Bar Container */}
        <div className="w-full bg-white rounded-lg p-2 flex flex-col md:flex-row shadow-2xl items-center gap-2">
          
          {/* Location Selector */}
          <div className="flex items-center gap-2 w-full md:w-48 pl-4 pr-2 py-2 border-b md:border-b-0 md:border-r border-gray-200 shrink-0">
            <MapPin size={20} className="text-[#0a66c2]" />
            <select 
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full bg-transparent outline-none text-gray-700 font-medium cursor-pointer appearance-none"
            >
              <option value="">Tất cả địa điểm</option>
              <option value="Ho Chi Minh">Hồ Chí Minh</option>
              <option value="Ha Noi">Hà Nội</option>
              <option value="Da Nang">Đà Nẵng</option>
            </select>
          </div>

          {/* Keyword Input */}
          <div className="flex-1 flex items-center w-full px-4 py-2">
            <input 
              type="text" 
              placeholder="Nhập kỹ năng, chức danh hoặc tên công ty..." 
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-transparent outline-none text-gray-800 placeholder-gray-400 font-medium"
            />
          </div>

          {/* Search Button */}
          <button 
            onClick={handleSearch}
            className="w-full md:w-auto bg-[#0a66c2] hover:bg-[#004182] text-white font-bold py-3 px-8 rounded-md transition-colors flex items-center justify-center gap-2 shrink-0"
          >
            <Search size={20} />
            Tìm kiếm
          </button>
          
          <div className="hidden md:block w-px h-8 bg-gray-200 mx-1"></div>

          {/* Upload CV Button */}
          <button 
            onClick={() => navigate('/dashboard')}
            className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-md transition-colors flex items-center justify-center gap-2 shrink-0"
          >
            <Upload size={20} />
            Upload CV (AI Match)
          </button>
        </div>

        {/* Popular Keywords */}
        <div className="mt-6 flex flex-wrap justify-center gap-2 text-sm text-blue-100">
          <span>Gợi ý:</span>
          {suggestions.map((suggestion, index) => (
            <button 
              key={index} 
              onClick={() => handleSuggestionClick(suggestion)} 
              className="hover:text-white underline decoration-white/30 underline-offset-4"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
