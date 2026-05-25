// ═══════════════════════════════════════════════════
// add_companies.js — Thêm các công ty IT mới vào DB (không xóa dữ liệu cũ)
//
// Usage: node src/config/add_companies.js
// ═══════════════════════════════════════════════════
require('dotenv').config({ path: require('path').join(__dirname, '../../../.env') });

const db = require('./database');

const NEW_COMPANIES = [
  // ── Công ty IT Việt Nam ──────────────────────────────
  {
    name: 'KMS Technology',
    logo_url: 'https://logo.clearbit.com/kms-technology.com',
    description: 'Công ty phần mềm và dịch vụ IT chuyên về kiểm thử, phát triển sản phẩm.',
    website: 'https://kms-technology.com',
  },
  {
    name: 'NashTech',
    logo_url: 'https://logo.clearbit.com/nashtechglobal.com',
    description: 'Tập đoàn công nghệ toàn cầu, trung tâm R&D lớn tại Việt Nam.',
    website: 'https://nashtechglobal.com',
  },
  {
    name: 'Axon Active',
    logo_url: 'https://logo.clearbit.com/axonactive.com',
    description: 'Công ty phần mềm Agile hàng đầu, hợp tác Thụy Sĩ - Việt Nam.',
    website: 'https://axonactive.com',
  },
  {
    name: 'Bosch Global Software Technologies',
    logo_url: 'https://logo.clearbit.com/bosch.com',
    description: 'Trung tâm phát triển phần mềm nhúng và IoT của Tập đoàn Bosch.',
    website: 'https://bosch.com',
  },
  {
    name: 'Rikkeisoft',
    logo_url: 'https://logo.clearbit.com/rikkeisoft.com',
    description: 'Công ty phần mềm offshore, chuyên outsourcing cho thị trường Nhật Bản.',
    website: 'https://rikkeisoft.com',
  },
  {
    name: 'TMA Solutions',
    logo_url: 'https://logo.clearbit.com/tmasolutions.com',
    description: 'Công ty gia công phần mềm lớn nhất Việt Nam, thành lập từ 1997.',
    website: 'https://tmasolutions.com',
  },
  {
    name: 'Luvina Software',
    logo_url: 'https://logo.clearbit.com/luvina.net',
    description: 'Công ty phần mềm chuyên outsourcing cho Nhật Bản và Châu Âu.',
    website: 'https://luvina.net',
  },
  {
    name: 'Base.vn',
    logo_url: 'https://logo.clearbit.com/base.vn',
    description: 'Nền tảng quản trị doanh nghiệp số toàn diện cho SME.',
    website: 'https://base.vn',
  },
  {
    name: 'MISA',
    logo_url: 'https://logo.clearbit.com/misa.vn',
    description: 'Phần mềm kế toán và quản lý doanh nghiệp hàng đầu Việt Nam.',
    website: 'https://misa.vn',
  },
  {
    name: 'CMC Technology',
    logo_url: 'https://logo.clearbit.com/cmctelecom.vn',
    description: 'Tập đoàn công nghệ đa ngành — viễn thông, cloud, an ninh mạng.',
    website: 'https://cmctelecom.vn',
  },
  {
    name: 'VCCorp',
    logo_url: 'https://logo.clearbit.com/vccorp.vn',
    description: 'Tập đoàn truyền thông và công nghệ nội dung số.',
    website: 'https://vccorp.vn',
  },
  {
    name: 'Grab Vietnam',
    logo_url: 'https://logo.clearbit.com/grab.com',
    description: 'Siêu ứng dụng vận tải và giao đồ ăn hàng đầu Đông Nam Á.',
    website: 'https://grab.com',
  },
  {
    name: 'Techcombank',
    logo_url: 'https://logo.clearbit.com/techcombank.com.vn',
    description: 'Ngân hàng tiên phong chuyển đổi số tại Việt Nam.',
    website: 'https://techcombank.com.vn',
  },
  {
    name: 'VPBank',
    logo_url: 'https://logo.clearbit.com/vpbank.com.vn',
    description: 'Ngân hàng thương mại cổ phần tập trung vào công nghệ và fintech.',
    website: 'https://vpbank.com.vn',
  },
  {
    name: 'Got It',
    logo_url: 'https://logo.clearbit.com/got-it.ai',
    description: 'Startup AI hàng đầu Việt Nam, chuyên nền tảng hỏi đáp trực tuyến.',
    website: 'https://got-it.ai',
  },
  {
    name: 'Sun* Inc.',
    logo_url: 'https://logo.clearbit.com/sun-asterisk.com',
    description: 'Công ty công nghệ sáng tạo Nhật - Việt, chuyên Mobile & Web.',
    website: 'https://sun-asterisk.com',
  },
  {
    name: 'Vingroup',
    logo_url: 'https://logo.clearbit.com/vingroup.net',
    description: 'Tập đoàn kinh tế đa ngành, chủ sở hữu VinAI và VinBigData.',
    website: 'https://vingroup.net',
  },
  {
    name: 'VinAI Research',
    logo_url: 'https://logo.clearbit.com/vinai.io',
    description: 'Viện nghiên cứu AI hàng đầu châu Á thuộc Tập đoàn Vingroup.',
    website: 'https://vinai.io',
  },
  {
    name: 'Sendo',
    logo_url: 'https://logo.clearbit.com/sendo.vn',
    description: 'Sàn thương mại điện tử Việt Nam, kết nối người mua và người bán.',
    website: 'https://sendo.vn',
  },
  {
    name: 'Haravan',
    logo_url: 'https://logo.clearbit.com/haravan.com',
    description: 'Nền tảng thương mại điện tử và omnichannel cho doanh nghiệp.',
    website: 'https://haravan.com',
  },
  {
    name: 'Topcv',
    logo_url: 'https://logo.clearbit.com/topcv.vn',
    description: 'Nền tảng tuyển dụng và việc làm IT hàng đầu Việt Nam.',
    website: 'https://topcv.vn',
  },
  {
    name: 'Softdreams',
    logo_url: 'https://logo.clearbit.com/softdreams.vn',
    description: 'Công ty phần mềm kế toán hóa đơn điện tử E-invoice.',
    website: 'https://softdreams.vn',
  },
  {
    name: 'Trusting Social',
    logo_url: 'https://logo.clearbit.com/trustingsocial.com',
    description: 'Startup fintech - AI chuyên credit scoring và digital lending.',
    website: 'https://trustingsocial.com',
  },
  {
    name: 'Amanotes',
    logo_url: 'https://logo.clearbit.com/amanotes.com',
    description: 'Công ty game âm nhạc mobile hàng đầu thế giới tại Việt Nam.',
    website: 'https://amanotes.com',
  },
  {
    name: 'Gameloft Vietnam',
    logo_url: 'https://logo.clearbit.com/gameloft.com',
    description: 'Hãng phát triển game mobile nổi tiếng, studio lớn tại Hà Nội.',
    website: 'https://gameloft.com',
  },

  // ── Công ty IT Quốc tế ──────────────────────────────
  {
    name: 'Google',
    logo_url: 'https://logo.clearbit.com/google.com',
    description: 'Tập đoàn công nghệ toàn cầu — Search, Cloud, AI, Android.',
    website: 'https://google.com',
  },
  {
    name: 'Microsoft',
    logo_url: 'https://logo.clearbit.com/microsoft.com',
    description: 'Tập đoàn phần mềm và Cloud hàng đầu thế giới — Azure, Office 365.',
    website: 'https://microsoft.com',
  },
  {
    name: 'Amazon Web Services',
    logo_url: 'https://logo.clearbit.com/aws.amazon.com',
    description: 'Nền tảng điện toán đám mây lớn nhất thế giới.',
    website: 'https://aws.amazon.com',
  },
  {
    name: 'Meta',
    logo_url: 'https://logo.clearbit.com/meta.com',
    description: 'Tập đoàn mạng xã hội và Metaverse — Facebook, Instagram, WhatsApp.',
    website: 'https://meta.com',
  },
  {
    name: 'Apple',
    logo_url: 'https://logo.clearbit.com/apple.com',
    description: 'Tập đoàn công nghệ tiêu dùng hàng đầu — iPhone, Mac, iOS.',
    website: 'https://apple.com',
  },
  {
    name: 'Samsung R&D',
    logo_url: 'https://logo.clearbit.com/samsung.com',
    description: 'Trung tâm nghiên cứu phát triển của Samsung tại Hà Nội và TP.HCM.',
    website: 'https://samsung.com',
  },
  {
    name: 'Intel Vietnam',
    logo_url: 'https://logo.clearbit.com/intel.com',
    description: 'Tập đoàn bán dẫn và chip hàng đầu thế giới.',
    website: 'https://intel.com',
  },
  {
    name: 'IBM',
    logo_url: 'https://logo.clearbit.com/ibm.com',
    description: 'Tập đoàn công nghệ — AI Watson, Hybrid Cloud, Blockchain.',
    website: 'https://ibm.com',
  },
  {
    name: 'Oracle',
    logo_url: 'https://logo.clearbit.com/oracle.com',
    description: 'Nền tảng cơ sở dữ liệu và Cloud ERP hàng đầu thế giới.',
    website: 'https://oracle.com',
  },
  {
    name: 'SAP',
    logo_url: 'https://logo.clearbit.com/sap.com',
    description: 'Phần mềm ERP và quản trị doanh nghiệp số hàng đầu.',
    website: 'https://sap.com',
  },
  {
    name: 'Siemens',
    logo_url: 'https://logo.clearbit.com/siemens.com',
    description: 'Tập đoàn công nghệ công nghiệp — IoT, tự động hóa, phần mềm.',
    website: 'https://siemens.com',
  },
  {
    name: 'Fujitsu',
    logo_url: 'https://logo.clearbit.com/fujitsu.com',
    description: 'Tập đoàn ICT Nhật Bản — Cloud, AI, Cybersecurity.',
    website: 'https://fujitsu.com',
  },
  {
    name: 'DXC Technology',
    logo_url: 'https://logo.clearbit.com/dxc.com',
    description: 'Công ty dịch vụ IT toàn cầu, chuyên outsourcing và tư vấn.',
    website: 'https://dxc.com',
  },
  {
    name: 'Accenture',
    logo_url: 'https://logo.clearbit.com/accenture.com',
    description: 'Công ty tư vấn và dịch vụ công nghệ toàn cầu hàng đầu.',
    website: 'https://accenture.com',
  },
  {
    name: 'Infosys',
    logo_url: 'https://logo.clearbit.com/infosys.com',
    description: 'Tập đoàn IT Ấn Độ, cung cấp dịch vụ phần mềm và tư vấn.',
    website: 'https://infosys.com',
  },
  {
    name: 'Tata Consultancy Services',
    logo_url: 'https://logo.clearbit.com/tcs.com',
    description: 'Công ty dịch vụ IT và tư vấn lớn nhất Ấn Độ.',
    website: 'https://tcs.com',
  },
  {
    name: 'Atlassian',
    logo_url: 'https://logo.clearbit.com/atlassian.com',
    description: 'Công ty phần mềm cộng tác — Jira, Confluence, Bitbucket.',
    website: 'https://atlassian.com',
  },
  {
    name: 'Salesforce',
    logo_url: 'https://logo.clearbit.com/salesforce.com',
    description: 'Nền tảng CRM đám mây số 1 thế giới.',
    website: 'https://salesforce.com',
  },
  {
    name: 'ServiceNow',
    logo_url: 'https://logo.clearbit.com/servicenow.com',
    description: 'Nền tảng quản lý quy trình doanh nghiệp và IT Service.',
    website: 'https://servicenow.com',
  },
  {
    name: 'Sea Limited',
    logo_url: 'https://logo.clearbit.com/sea.com',
    description: 'Tập đoàn internet Đông Nam Á — Shopee, Garena, SeaMoney.',
    website: 'https://sea.com',
  },
  {
    name: 'Lazada',
    logo_url: 'https://logo.clearbit.com/lazada.vn',
    description: 'Nền tảng thương mại điện tử của Alibaba tại Đông Nam Á.',
    website: 'https://lazada.vn',
  },
  {
    name: 'ByteDance',
    logo_url: 'https://logo.clearbit.com/bytedance.com',
    description: 'Công ty công nghệ Trung Quốc — TikTok, CapCut, Lark.',
    website: 'https://bytedance.com',
  },
  {
    name: 'Nvidia',
    logo_url: 'https://logo.clearbit.com/nvidia.com',
    description: 'Công ty chip GPU và AI hàng đầu, dẫn đầu kỷ nguyên AI.',
    website: 'https://nvidia.com',
  },
  {
    name: 'Grab',
    logo_url: 'https://logo.clearbit.com/grab.com',
    description: 'Siêu ứng dụng công nghệ đa dịch vụ hàng đầu Đông Nam Á.',
    website: 'https://grab.com',
  },
  {
    name: 'Shopify',
    logo_url: 'https://logo.clearbit.com/shopify.com',
    description: 'Nền tảng thương mại điện tử và thanh toán toàn cầu.',
    website: 'https://shopify.com',
  },
  {
    name: 'Stripe',
    logo_url: 'https://logo.clearbit.com/stripe.com',
    description: 'Nền tảng xử lý thanh toán trực tuyến hàng đầu thế giới.',
    website: 'https://stripe.com',
  },
  {
    name: 'Twilio',
    logo_url: 'https://logo.clearbit.com/twilio.com',
    description: 'Nền tảng cloud communications — SMS, Voice, Video API.',
    website: 'https://twilio.com',
  },
  {
    name: 'Datadog',
    logo_url: 'https://logo.clearbit.com/datadoghq.com',
    description: 'Nền tảng monitoring và observability cho hệ thống cloud.',
    website: 'https://datadoghq.com',
  },
  {
    name: 'HashiCorp',
    logo_url: 'https://logo.clearbit.com/hashicorp.com',
    description: 'Công ty cung cấp công cụ hạ tầng — Terraform, Vault, Consul.',
    website: 'https://hashicorp.com',
  },
  {
    name: 'Elastic',
    logo_url: 'https://logo.clearbit.com/elastic.co',
    description: 'Công ty phát triển Elasticsearch — search, observability, security.',
    website: 'https://elastic.co',
  },
  {
    name: 'MongoDB',
    logo_url: 'https://logo.clearbit.com/mongodb.com',
    description: 'Công ty cơ sở dữ liệu NoSQL hàng đầu thế giới.',
    website: 'https://mongodb.com',
  },
  {
    name: 'Confluent',
    logo_url: 'https://logo.clearbit.com/confluent.io',
    description: 'Nền tảng data streaming dựa trên Apache Kafka.',
    website: 'https://confluent.io',
  },
  {
    name: 'Snowflake',
    logo_url: 'https://logo.clearbit.com/snowflake.com',
    description: 'Nền tảng cloud data warehouse hàng đầu cho phân tích dữ liệu.',
    website: 'https://snowflake.com',
  },
  {
    name: 'Databricks',
    logo_url: 'https://logo.clearbit.com/databricks.com',
    description: 'Nền tảng dữ liệu và AI thống nhất, phát triển Apache Spark.',
    website: 'https://databricks.com',
  },
  {
    name: 'GitLab',
    logo_url: 'https://logo.clearbit.com/gitlab.com',
    description: 'Nền tảng DevSecOps toàn diện — CI/CD, code review, security.',
    website: 'https://gitlab.com',
  },
  {
    name: 'GitHub',
    logo_url: 'https://logo.clearbit.com/github.com',
    description: 'Nền tảng lưu trữ code và cộng tác phát triển phần mềm của Microsoft.',
    website: 'https://github.com',
  },
  {
    name: 'Cloudflare',
    logo_url: 'https://logo.clearbit.com/cloudflare.com',
    description: 'Công ty bảo mật web, CDN và network infrastructure toàn cầu.',
    website: 'https://cloudflare.com',
  },
  {
    name: 'Palo Alto Networks',
    logo_url: 'https://logo.clearbit.com/paloaltonetworks.com',
    description: 'Công ty an ninh mạng hàng đầu thế giới — firewall, SASE, XDR.',
    website: 'https://paloaltonetworks.com',
  },
  {
    name: 'CrowdStrike',
    logo_url: 'https://logo.clearbit.com/crowdstrike.com',
    description: 'Nền tảng bảo mật endpoint và threat intelligence đám mây.',
    website: 'https://crowdstrike.com',
  },
];

async function addCompanies() {
  console.log('➕ Đang thêm các công ty IT mới vào DB...');

  // Lấy tên công ty đã có
  const existing = await db('companies').select('name');
  const existingNames = new Set(existing.map((c) => c.name.toLowerCase().trim()));

  // Lọc chỉ những công ty chưa có
  const toInsert = NEW_COMPANIES.filter(
    (c) => !existingNames.has(c.name.toLowerCase().trim())
  );

  if (toInsert.length === 0) {
    console.log('✅ Tất cả công ty đã tồn tại trong DB. Không cần thêm.');
    process.exit(0);
  }

  console.log(`   Sẽ thêm ${toInsert.length} công ty mới (bỏ qua ${NEW_COMPANIES.length - toInsert.length} đã có):`);
  toInsert.forEach((c) => console.log(`   ➕ ${c.name}`));

  await db('companies').insert(toInsert);

  console.log(`\n✅ Đã thêm thành công ${toInsert.length} công ty IT mới vào DB!`);
  process.exit(0);
}

addCompanies().catch((err) => {
  console.error('❌ Lỗi:', err.message);
  process.exit(1);
});
