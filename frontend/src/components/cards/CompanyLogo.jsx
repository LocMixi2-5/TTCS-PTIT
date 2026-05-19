// ═══════════════════════════════════════════════════
// CompanyLogo — Reusable company logo with real logo fallback
// ═══════════════════════════════════════════════════
import { useState } from 'react';
import { Building2 } from 'lucide-react';
import { getCompanyLogoUrl } from '../../utils/companyLogo';

export default function CompanyLogo({
  company,
  size = 96,
  className = '',
  fallbackClassName = '',
}) {
  const logoUrl = getCompanyLogoUrl(company);
  const [failed, setFailed] = useState(false);
  const [triedFavicon, setTriedFavicon] = useState(false);

  const name = company?.name || company?.company_name || '';

  const handleError = (e) => {
    if (!triedFavicon) {
      // Try Google favicon as second option
      const slug = name.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '');
      e.target.src = `https://www.google.com/s2/favicons?domain=${slug}.com&sz=128`;
      setTriedFavicon(true);
    } else {
      setFailed(true);
    }
  };

  if (!logoUrl || failed) {
    return (
      <div
        className={`flex items-center justify-center rounded-2xl ${fallbackClassName}`}
        style={{
          width: size,
          height: size,
          background: 'linear-gradient(135deg, #4f46e5, #818cf8)',
          border: '2px solid rgba(99,102,241,0.35)',
          flexShrink: 0,
        }}
      >
        <Building2 size={size * 0.4} className="text-white" />
      </div>
    );
  }

  return (
    <img
      src={logoUrl}
      alt={`${name} logo`}
      onError={handleError}
      className={`rounded-2xl object-contain bg-white ${className}`}
      style={{
        width: size,
        height: size,
        padding: size * 0.08,
        border: '2px solid rgba(99,102,241,0.25)',
        boxShadow: '0 4px 16px rgba(99,102,241,0.15)',
        flexShrink: 0,
      }}
    />
  );
}
