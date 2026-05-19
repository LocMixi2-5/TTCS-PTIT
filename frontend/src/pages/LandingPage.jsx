// ═══════════════════════════════════════════════════
// Landing Page — Hero section + Features
// ═══════════════════════════════════════════════════
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Upload, Brain, Target, Shield, Zap, BarChart3, ArrowRight, Sparkles } from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'AI Phân tích CV',
    desc: 'Mô hình SBERT đa ngôn ngữ trích xuất kỹ năng & kinh nghiệm từ CV của bạn trong vài giây.',
    color: 'from-violet-500 to-purple-600',
  },
  {
    icon: Target,
    title: 'Gợi ý chính xác',
    desc: 'Vector Search tìm kiếm trong hàng triệu công việc với độ chính xác vượt trội so với keyword search.',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    icon: BarChart3,
    title: 'Explainable AI',
    desc: 'Hiển thị rõ ràng kỹ năng trùng khớp, kỹ năng cần bổ sung giữa CV và job description.',
    color: 'from-amber-500 to-orange-600',
  },
  {
    icon: Shield,
    title: 'Bảo mật dữ liệu',
    desc: 'CV được xử lý an toàn, mã hóa JWT, không chia sẻ dữ liệu với bên thứ ba.',
    color: 'from-sky-500 to-blue-600',
  },
  {
    icon: Zap,
    title: 'Xử lý tức thì',
    desc: 'Pipeline AI xử lý từ upload đến kết quả trong dưới 10 giây, kể cả với file PDF nhiều trang.',
    color: 'from-pink-500 to-rose-600',
  },
  {
    icon: Upload,
    title: 'Đa phiên bản CV',
    desc: 'Upload nhiều CV, so sánh kết quả gợi ý giữa các phiên bản để tối ưu cơ hội việc làm.',
    color: 'from-cyan-500 to-teal-600',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Ambient Background */}
      <div className="ambient-bg" />

      {/* ─── Hero Section ─────────────────────────── */}
      <section className="relative pt-32 pb-20 px-4">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 mb-8"
          >
            <Sparkles size={14} className="text-primary-400" />
            <span className="text-sm font-medium text-primary-300">Powered by SBERT + Vector Database</span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold leading-tight mb-6"
          >
            Tìm việc phù hợp
            <br />
            <span className="gradient-text">bằng sức mạnh AI</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed text-balance"
            style={{ color: 'var(--text-secondary)' }}
          >
            Upload CV → AI phân tích kỹ năng → So khớp với hàng triệu công việc.
            Nhận gợi ý chính xác nhất với điểm phù hợp và giải thích chi tiết.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/register"
              className="btn-primary text-base flex items-center gap-2 px-8 py-4"
            >
              <Upload size={18} />
              Upload CV ngay
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/login"
              className="btn-ghost text-base px-8 py-4"
            >
              Đã có tài khoản? Đăng nhập
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex items-center justify-center gap-8 mt-16"
          >
            {[
              { value: '1M+', label: 'Công việc' },
              { value: '<10s', label: 'Thời gian xử lý' },
              { value: '384D', label: 'Vector Dimension' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-display font-bold" style={{ color: 'var(--text-primary)' }}>{stat.value}</div>
                <div className="text-sm" style={{ color: 'var(--text-muted)' }}>{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Decorative Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent-600/10 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* ─── How It Works ─────────────────────────── */}
      <section className="py-20 px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              Cách hoạt động
            </h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              3 bước đơn giản để tìm được công việc phù hợp nhất với kỹ năng của bạn
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: '01', title: 'Upload CV', desc: 'Kéo thả file PDF hoặc nhập thông tin thủ công', icon: '📄' },
              { step: '02', title: 'AI Xử lý', desc: 'SBERT vector hóa → Pinecone tìm kiếm trong milliseconds', icon: '🧠' },
              { step: '03', title: 'Nhận kết quả', desc: 'Danh sách top công việc phù hợp với giải thích chi tiết', icon: '🎯' },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="glass-card p-8 text-center group hover:border-primary-500/20 transition-all duration-300"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <div className="text-xs font-bold text-primary-400 mb-2">{item.step}</div>
                <h3 className="text-xl font-display font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>{item.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Features Grid ────────────────────────── */}
      <section className="py-20 px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              Tính năng nổi bật
            </h2>
            <p style={{ color: 'var(--text-secondary)' }} className="max-w-xl mx-auto">
              Được xây dựng bằng công nghệ AI & Vector Database tiên tiến nhất
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                className="glass-card p-6 group hover:border-white/[0.1] transition-all duration-300"
              >
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                  <feature.icon size={20} className="text-white" />
                </div>
                <h3 className="text-lg font-display font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>{feature.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── Footer CTA ──────────────────────────── */}
      <section className="py-20 px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center glass-card p-12">
          <h2 className="text-3xl font-display font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            Sẵn sàng tìm việc mơ ước?
          </h2>
          <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>
            Tạo tài khoản miễn phí và upload CV đầu tiên ngay hôm nay.
          </p>
          <Link to="/register" className="btn-primary text-base px-8 py-4 inline-flex items-center gap-2">
            <Sparkles size={18} />
            Bắt đầu miễn phí
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4" style={{ borderTop: '1px solid var(--border-divider)' }}>
        <div className="max-w-6xl mx-auto text-center text-sm" style={{ color: 'var(--text-muted)' }}>
          © 2026 JobAI — Hệ thống gợi ý việc làm thông minh. Built with React + SBERT + Milvus.
        </div>
      </footer>
    </div>
  );
}
