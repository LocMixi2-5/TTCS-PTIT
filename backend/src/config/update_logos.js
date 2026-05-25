// ═══════════════════════════════════════════════════
// update_logos.js — Cập nhật logo_url công ty sang logo thật (Clearbit)
//
// Usage: node src/config/update_logos.js
// ═══════════════════════════════════════════════════
require('dotenv').config({ path: require('path').join(__dirname, '../../../.env') });

const db = require('./database');

// Map tên công ty → logo Clearbit thật
const LOGO_MAP = {
  // ── Công ty hiện có ──
  'FPT Software':         'https://logo.clearbit.com/fpt-software.com',
  'VNG Corporation':      'https://logo.clearbit.com/vng.com.vn',
  'Tiki':                 'https://logo.clearbit.com/tiki.vn',
  'Shopee Vietnam':       'https://logo.clearbit.com/shopee.vn',
  'Shopee':               'https://logo.clearbit.com/shopee.com',
  'MoMo':                 'https://logo.clearbit.com/momo.vn',
  'Momo':                 'https://logo.clearbit.com/momo.vn',
  'ZaloPay':              'https://logo.clearbit.com/zalopay.vn',
  'VNPay':                'https://logo.clearbit.com/vnpay.vn',
  'VNPAY':                'https://logo.clearbit.com/vnpay.vn',
  'Viettel Digital':      'https://logo.clearbit.com/viettel.com.vn',
  'Gojek':                'https://logo.clearbit.com/gojek.com',
  'Be Group':             'https://logo.clearbit.com/be.com.vn',
  'AhaMove':              'https://logo.clearbit.com/ahamove.com',
  'Giao Hàng Tiết Kiệm': 'https://logo.clearbit.com/ghtk.vn',
  'Cốc Cốc':             'https://logo.clearbit.com/coccoc.com',

  // ── Công ty IT Việt Nam mới ──
  'KMS Technology':                    'https://logo.clearbit.com/kms-technology.com',
  'NashTech':                          'https://logo.clearbit.com/nashtechglobal.com',
  'Axon Active':                       'https://logo.clearbit.com/axonactive.com',
  'Bosch Global Software Technologies':'https://logo.clearbit.com/bosch.com',
  'Rikkeisoft':                        'https://logo.clearbit.com/rikkeisoft.com',
  'TMA Solutions':                     'https://logo.clearbit.com/tmasolutions.com',
  'Luvina Software':                   'https://logo.clearbit.com/luvina.net',
  'Base.vn':                           'https://logo.clearbit.com/base.vn',
  'MISA':                              'https://logo.clearbit.com/misa.vn',
  'CMC Technology':                    'https://logo.clearbit.com/cmctelecom.vn',
  'VCCorp':                            'https://logo.clearbit.com/vccorp.vn',
  'Grab Vietnam':                      'https://logo.clearbit.com/grab.com',
  'Grab':                              'https://logo.clearbit.com/grab.com',
  'Techcombank':                       'https://logo.clearbit.com/techcombank.com.vn',
  'VPBank':                            'https://logo.clearbit.com/vpbank.com.vn',
  'Got It':                            'https://logo.clearbit.com/got-it.ai',
  'Sun* Inc.':                         'https://logo.clearbit.com/sun-asterisk.com',
  'Vingroup':                          'https://logo.clearbit.com/vingroup.net',
  'VinAI Research':                    'https://logo.clearbit.com/vinai.io',
  'Sendo':                             'https://logo.clearbit.com/sendo.vn',
  'Haravan':                           'https://logo.clearbit.com/haravan.com',
  'Topcv':                             'https://logo.clearbit.com/topcv.vn',
  'Softdreams':                        'https://logo.clearbit.com/softdreams.vn',
  'Trusting Social':                   'https://logo.clearbit.com/trustingsocial.com',
  'Amanotes':                          'https://logo.clearbit.com/amanotes.com',
  'Gameloft Vietnam':                  'https://logo.clearbit.com/gameloft.com',

  // ── Công ty IT Quốc tế ──
  'Google':                   'https://logo.clearbit.com/google.com',
  'Microsoft':                'https://logo.clearbit.com/microsoft.com',
  'Amazon Web Services':      'https://logo.clearbit.com/aws.amazon.com',
  'Meta':                     'https://logo.clearbit.com/meta.com',
  'Apple':                    'https://logo.clearbit.com/apple.com',
  'Samsung R&D':              'https://logo.clearbit.com/samsung.com',
  'Intel Vietnam':            'https://logo.clearbit.com/intel.com',
  'IBM':                      'https://logo.clearbit.com/ibm.com',
  'Oracle':                   'https://logo.clearbit.com/oracle.com',
  'SAP':                      'https://logo.clearbit.com/sap.com',
  'Siemens':                  'https://logo.clearbit.com/siemens.com',
  'Fujitsu':                  'https://logo.clearbit.com/fujitsu.com',
  'DXC Technology':           'https://logo.clearbit.com/dxc.com',
  'Accenture':                'https://logo.clearbit.com/accenture.com',
  'Infosys':                  'https://logo.clearbit.com/infosys.com',
  'Tata Consultancy Services':'https://logo.clearbit.com/tcs.com',
  'Atlassian':                'https://logo.clearbit.com/atlassian.com',
  'Salesforce':               'https://logo.clearbit.com/salesforce.com',
  'ServiceNow':               'https://logo.clearbit.com/servicenow.com',
  'Sea Limited':              'https://logo.clearbit.com/sea.com',
  'Lazada':                   'https://logo.clearbit.com/lazada.vn',
  'ByteDance':                'https://logo.clearbit.com/bytedance.com',
  'Nvidia':                   'https://logo.clearbit.com/nvidia.com',
  'Shopify':                  'https://logo.clearbit.com/shopify.com',
  'Stripe':                   'https://logo.clearbit.com/stripe.com',
  'Twilio':                   'https://logo.clearbit.com/twilio.com',
  'Datadog':                  'https://logo.clearbit.com/datadoghq.com',
  'HashiCorp':                'https://logo.clearbit.com/hashicorp.com',
  'Elastic':                  'https://logo.clearbit.com/elastic.co',
  'MongoDB':                  'https://logo.clearbit.com/mongodb.com',
  'Confluent':                'https://logo.clearbit.com/confluent.io',
  'Snowflake':                'https://logo.clearbit.com/snowflake.com',
  'Databricks':               'https://logo.clearbit.com/databricks.com',
  'GitLab':                   'https://logo.clearbit.com/gitlab.com',
  'GitHub':                   'https://logo.clearbit.com/github.com',
  'Cloudflare':               'https://logo.clearbit.com/cloudflare.com',
  'Palo Alto Networks':       'https://logo.clearbit.com/paloaltonetworks.com',
  'CrowdStrike':              'https://logo.clearbit.com/crowdstrike.com',
};

// Xây dựng logo từ website nếu có
function buildClearbitUrl(website) {
  if (!website) return null;
  try {
    const url = new URL(website.startsWith('http') ? website : `https://${website}`);
    const domain = url.hostname.replace(/^www\./, '');
    return `https://logo.clearbit.com/${domain}`;
  } catch {
    return null;
  }
}

async function updateLogos() {
  console.log('🔄 Đang cập nhật logo công ty trong DB...');

  const companies = await db('companies').select('id', 'name', 'logo_url', 'website');
  console.log(`   Tìm thấy ${companies.length} công ty.`);

  let updated = 0;

  for (const company of companies) {
    const isOldLogo = company.logo_url && company.logo_url.includes('ui-avatars.com');
    const hasRealLogo = company.logo_url && company.logo_url.includes('clearbit.com');

    if (hasRealLogo) {
      // Đã có logo Clearbit — bỏ qua
      console.log(`   ✅ ${company.name} — đã có logo Clearbit`);
      continue;
    }

    // 1. Thử từ LOGO_MAP (tên khớp)
    let newLogoUrl = LOGO_MAP[company.name];

    // 2. Thử build từ website
    if (!newLogoUrl) {
      newLogoUrl = buildClearbitUrl(company.website);
    }

    if (newLogoUrl) {
      await db('companies').where('id', company.id).update({ logo_url: newLogoUrl });
      console.log(`   🔄 ${company.name} → ${newLogoUrl}`);
      updated++;
    } else {
      console.log(`   ⚠️  ${company.name} — không tìm được logo`);
    }
  }

  console.log(`\n✅ Cập nhật xong! Đã cập nhật ${updated}/${companies.length} công ty.`);
  process.exit(0);
}

updateLogos().catch((err) => {
  console.error('❌ Lỗi:', err.message);
  process.exit(1);
});
