import { Building2 } from 'lucide-react';

export default function CompanyLogo({
  company,
  size = 96,
  className = '',
  fallbackClassName = '',
}) {
  const name = company?.name || company?.company_name || '';
  const shortName = company?.shortName || '';
  const themeColor = company?.themeColor || '#4f46e5';

  // Lấy initials: Dùng shortName nếu có, nếu không lấy 2 chữ cái đầu của tên
  const initials = shortName || name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || '')
    .join('');

  if (initials) {
    return (
      <div
        className={`flex items-center justify-center font-bold select-none overflow-hidden ${fallbackClassName} ${className}`}
        style={{
          width: size,
          height: size,
          fontSize: size * 0.45,
          color: '#fff',
          flexShrink: 0,
          letterSpacing: '0.02em',
          backgroundColor: themeColor,
          border: '1px solid rgba(0,0,0,0.05)',
        }}
      >
        {initials}
      </div>
    );
  }

  // Fallback nếu không có tên
  return (
    <div
      className={`flex items-center justify-center overflow-hidden ${fallbackClassName} ${className}`}
      style={{
        width: size,
        height: size,
        backgroundColor: themeColor,
        border: '1px solid rgba(0,0,0,0.05)',
        flexShrink: 0,
      }}
    >
      <Building2 size={size * 0.4} className="text-white" />
    </div>
  );
}
