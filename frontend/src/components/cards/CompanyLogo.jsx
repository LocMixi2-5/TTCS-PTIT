// ═══════════════════════════════════════════════════
// CompanyLogo — Reusable company logo with real logo fallback
// Thứ tự ưu tiên: logo_url DB → Clearbit → Google Favicon → Icon chữ cái → Building2
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
  const [src, setSrc] = useState(logoUrl);
  const [stage, setStage] = useState(0); // 0=clearbit, 1=favicon, 2=initials, 3=icon
  const [imgFailed, setImgFailed] = useState(false);

  const name = company?.name || company?.company_name || '';
  const website = company?.website || '';

  // Lấy initials từ tên công ty
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || '')
    .join('');

  // Màu gradient dựa trên tên (consistent)
  const hue = (name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) * 47) % 360;
  const gradientStyle = {
    background: `linear-gradient(135deg, hsl(${hue},70%,45%), hsl(${(hue + 40) % 360},80%,60%))`,
  };

  const handleError = () => {
    if (stage === 0) {
      // Thử Google Favicon
      let domain = '';
      if (website) {
        try {
          domain = new URL(website.startsWith('http') ? website : `https://${website}`).hostname.replace(/^www\./, '');
        } catch (_) {}
      }
      if (!domain) {
        const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '');
        domain = `${slug}.com`;
      }
      setSrc(`https://www.google.com/s2/favicons?domain=${domain}&sz=128`);
      setStage(1);
    } else {
      // Google favicon cũng fail → hiện initials
      setImgFailed(true);
    }
  };

  // Hiện initials nếu mọi URL đều fail
  if (imgFailed || (!src && !logoUrl)) {
    if (initials) {
      return (
        <div
          className={`flex items-center justify-center rounded-2xl font-bold select-none ${fallbackClassName}`}
          style={{
            width: size,
            height: size,
            fontSize: size * 0.32,
            color: '#fff',
            flexShrink: 0,
            letterSpacing: '0.02em',
            ...gradientStyle,
            border: '2px solid rgba(255,255,255,0.15)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
          }}
        >
          {initials}
        </div>
      );
    }
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
      src={src}
      alt={`${name} logo`}
      onError={handleError}
      className={`rounded-2xl object-contain bg-white ${className}`}
      style={{
        width: size,
        height: size,
        padding: stage === 1 ? size * 0.12 : size * 0.08, // favicon cần padding lớn hơn
        border: '2px solid rgba(99,102,241,0.25)',
        boxShadow: '0 4px 16px rgba(99,102,241,0.15)',
        flexShrink: 0,
      }}
    />
  );
}
