// ═══════════════════════════════════════════════════
// Company Logo Utilities
// Fetches real company logos via Clearbit & Google favicon APIs
// ═══════════════════════════════════════════════════

/**
 * Map well-known Vietnamese/global companies to their domain
 * for accurate logo resolution
 */
const COMPANY_DOMAIN_MAP = {
  // Vietnamese tech companies
  'vng': 'vng.com.vn',
  'vng corporation': 'vng.com.vn',
  'fpt': 'fpt.com.vn',
  'fpt software': 'fpt-software.com',
  'fpt corporation': 'fpt.com.vn',
  'vingroup': 'vingroup.net',
  'viettel': 'viettel.com.vn',
  'viettel group': 'viettel.com.vn',
  'momo': 'momo.vn',
  'zalopay': 'zalopay.vn',
  'tiki': 'tiki.vn',
  'shopee': 'shopee.vn',
  'lazada': 'lazada.vn',
  'grab': 'grab.com',
  'be group': 'be.com.vn',
  'vnpay': 'vnpay.vn',
  'techcombank': 'techcombank.com.vn',
  'vietcombank': 'vietcombank.com.vn',
  'vpbank': 'vpbank.com.vn',
  'mb bank': 'mbbank.com.vn',
  'mbbank': 'mbbank.com.vn',
  'acb bank': 'acb.com.vn',
  'acb': 'acb.com.vn',
  'sacombank': 'sacombank.com',
  'bidv': 'bidv.com.vn',
  'vietinbank': 'vietinbank.vn',
  'agribank': 'agribank.com.vn',
  'ncb': 'ncb-bank.vn',
  'national citizen bank': 'ncb-bank.vn',
  'tpbank': 'tpb.vn',
  'hdbank': 'hdbank.com.vn',
  'pvcombank': 'pvcombank.com.vn',
  'navisoft': 'navisoft.vn',
  'nashtech': 'nashtechglobal.com',
  'axon active': 'axonactive.com',
  'dxc technology': 'dxc.com',
  'bosch': 'bosch.com',
  'bosch global software': 'bosch.com',
  'samsung': 'samsung.com',
  'intel': 'intel.com',
  'microsoft': 'microsoft.com',
  'google': 'google.com',
  'meta': 'meta.com',
  'amazon': 'amazon.com',
  'apple': 'apple.com',
  'ibm': 'ibm.com',
  'oracle': 'oracle.com',
  'sap': 'sap.com',
  'siemens': 'siemens.com',
  'hitachi': 'hitachi.com',
  'fujitsu': 'fujitsu.com',
  'nec': 'nec.com',
  'toshiba': 'toshiba.com',
  'panasonic': 'panasonic.com',
  'lg': 'lg.com',
  'lg electronics': 'lg.com',
  'galaxy holdings': 'galaxyholdings.com.vn',
  'got it': 'got-it.ai',
  'sun asterisk': 'sun-asterisk.com',
  'sun*': 'sun-asterisk.com',
  'topica': 'topica.net',
  'kms technology': 'kms-technology.com',
  'kms': 'kms-technology.com',
  'cmc technology': 'cmctelecom.vn',
  'cmc': 'cmctelecom.vn',
  'pvt': 'pvt.com.vn',
  'vccorp': 'vccorp.vn',
  'tomochain': 'tomochain.com',
  'kyber network': 'kyber.network',
  'ahamove': 'ahamove.com',
  'logivan': 'logivan.com',
  'vnlogi': 'vnlogi.com',
  'ghtk': 'ghtk.vn',
  'giao hang tiet kiem': 'ghtk.vn',
  'vietjet': 'vietjetair.com',
  'vietnam airlines': 'vietnamairlines.com',
  'bamboo airways': 'bambooairways.com',
  'vinfast': 'vinfastautomotive.com',
  'vinhomes': 'vinhomes.vn',
  'masan': 'masangroup.com',
  'thegioididong': 'thegioididong.com',
  'the gioi di dong': 'thegioididong.com',
  'bachhoaxanh': 'bachhoaxanh.com',
  'bach hoa xanh': 'bachhoaxanh.com',
};

/**
 * Normalize company name to find domain
 */
function normalizeName(name) {
  return name?.toLowerCase().trim().replace(/[.,|]/g, '').replace(/\s+/g, ' ') || '';
}

/**
 * Try to extract domain from company name
 */
function getDomainFromName(companyName) {
  const normalized = normalizeName(companyName);

  // Direct match
  if (COMPANY_DOMAIN_MAP[normalized]) return COMPANY_DOMAIN_MAP[normalized];

  // Partial match
  for (const [key, domain] of Object.entries(COMPANY_DOMAIN_MAP)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return domain;
    }
  }

  // Guess domain: "Acme Corp" → "acmecorp.com"
  const slug = normalized
    .replace(/\b(corporation|corp|company|co|ltd|limited|group|holdings|jsc|llc|inc|vn|vietnam)\b/g, '')
    .trim()
    .replace(/\s+/g, '');
  return slug ? `${slug}.com` : null;
}

/**
 * Build logo URL using Clearbit logo API (highest quality, free, no API key needed)
 * Falls back to Google favicon if domain found
 */
export function getCompanyLogoUrl(company) {
  // If already has a logo URL stored in DB
  if (company?.logo_url && company.logo_url.startsWith('http')) {
    return company.logo_url;
  }

  const name = company?.name || company?.company_name || '';
  const website = company?.website;

  let domain = null;

  // 1. Extract from website URL
  if (website) {
    try {
      domain = new URL(website.startsWith('http') ? website : `https://${website}`).hostname
        .replace(/^www\./, '');
    } catch (_) {}
  }

  // 2. Look up in map
  if (!domain) domain = getDomainFromName(name);

  // 3. Use Clearbit Logo API (works great, free)
  if (domain) {
    return `https://logo.clearbit.com/${domain}`;
  }

  return null;
}

/**
 * React hook to get company logo with fallback
 */
export function useCompanyLogo(company, fallbackIcon = null) {
  const logoUrl = getCompanyLogoUrl(company);
  return {
    logoUrl,
    hasLogo: !!logoUrl,
    onError: (e) => {
      // Fallback to Google favicon
      const name = company?.name || '';
      const domain = getDomainFromName(name);
      if (domain && e.target.src !== `https://www.google.com/s2/favicons?domain=${domain}&sz=128`) {
        e.target.src = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
        e.target.style.padding = '12px';
      } else {
        e.target.style.display = 'none';
        if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
      }
    }
  };
}
