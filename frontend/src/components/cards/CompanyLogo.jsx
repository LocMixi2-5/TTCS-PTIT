// ═══════════════════════════════════════════════════
// CompanyLogo — Reusable company logo with initials
// Luôn hiển thị 2 chữ cái đặc trưng với màu nền của công ty
// ═══════════════════════════════════════════════════
import { Building2 } from 'lucide-react';
import { companies as mockCompanies } from '../../data/mockData';

export function getCompanyTheme(company) {
  const name = company?.name || company?.company_name || '';
  
  const mockCompany = mockCompanies.find(
    c => c.id === company?.id || c.name.toLowerCase() === name.toLowerCase()
  );

  const shortName = mockCompany?.shortName || company?.shortName || '';
  const themeColor = mockCompany?.themeColor || company?.themeColor;

  const initials = shortName || name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || '')
    .join('');

  let styleProps = {};
  const hue = (name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) * 47) % 360;
  
  if (themeColor) {
    styleProps = { backgroundColor: themeColor };
  } else {
    styleProps = { background: `linear-gradient(135deg, hsl(${hue},70%,45%), hsl(${(hue + 40) % 360},80%,60%))` };
  }

  return { initials, styleProps, themeColor: themeColor || `hsl(${hue},70%,45%)` };
}

export default function CompanyLogo({
  company,
  size = 96,
  className = '',
  fallbackClassName = '',
}) {
  const name = company?.name || company?.company_name || '';
  
  // Lấy style và thông tin từ helper
  const { initials, styleProps } = getCompanyTheme(company);

  if (initials) {
    return (
      <div
        className={`flex items-center justify-center rounded-2xl font-bold select-none ${fallbackClassName} ${className}`}
        style={{
          width: size,
          height: size,
          fontSize: size * 0.45,
          color: '#fff',
          flexShrink: 0,
          letterSpacing: '0.02em',
          ...styleProps,
          border: '1px solid rgba(255,255,255,0.15)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
        }}
      >
        {initials}
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-center rounded-2xl ${fallbackClassName} ${className}`}
      style={{
        width: size,
        height: size,
        ...styleProps,
        border: '1px solid rgba(255,255,255,0.15)',
        flexShrink: 0,
      }}
    >
      <Building2 size={size * 0.4} className="text-white" />
    </div>
  );
}
