// ═══════════════════════════════════════════════════
// Dashboard Page — CV Manager
// Upload, manage multiple CV versions, view processing status
// ═══════════════════════════════════════════════════
import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import {
  Upload, FileText, Trash2, Eye, Clock, CheckCircle2,
  XCircle, Loader2, Plus, RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import { cvAPI } from '../services/api';

function StatusBadge({ status }) {
  const config = {
    completed: { icon: CheckCircle2, label: 'Hoàn tất', cls: 'status-badge--completed' },
    processing: { icon: Loader2, label: 'Đang xử lý...', cls: 'status-badge--processing' },
    pending: { icon: Clock, label: 'Đang chờ', cls: 'status-badge--pending' },
    failed: { icon: XCircle, label: 'Lỗi', cls: 'status-badge--failed' },
  };
  const c = config[status] || config.pending;
  return (
    <span className={`status-badge ${c.cls}`}>
      <c.icon size={12} className={status === 'processing' ? 'animate-spin' : ''} />
      {c.label}
    </span>
  );
}

function CVUploadDropzone({ onUploadComplete }) {
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsUploading(true);
    try {
      await cvAPI.upload(file);
      toast.success('CV đã được upload thành công!');
      onUploadComplete?.();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Upload Failed');
    } finally {
      setIsUploading(false);
    }
  }, [onUploadComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
    disabled: isUploading,
  });

  return (
    <div
      {...getRootProps()}
      className={`relative border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-300 ${
        isDragActive
          ? 'border-primary-500 bg-primary-500/10'
          : isUploading
            ? 'border-surface-700 bg-surface-900/50 cursor-not-allowed'
            : 'border-white/[0.08] hover:border-primary-500/40 hover:bg-primary-500/[0.03]'
      }`}
      id="cv-upload-dropzone"
    >
      <input {...getInputProps()} />
      {isUploading ? (
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={40} className="text-primary-400 animate-spin" />
          <p className="text-surface-200 font-medium">Đang upload và xử lý...</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-2xl bg-primary-500/10 flex items-center justify-center">
            <Upload size={28} className="text-primary-400" />
          </div>
          <div>
            <p className="text-white font-medium mb-1">
              {isDragActive ? 'Thả file vào đây...' : 'Kéo thả file CV (PDF) hoặc nhấn để chọn'}
            </p>
            <p className="text-surface-400 text-sm">Tối đa 10MB • Chỉ chấp nhận file PDF</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const [cvList, setCvList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCVs = async () => {
    try {
      const { data } = await cvAPI.list();
      setCvList(data.cvs || []);
    } catch (err) {
      toast.error('Không thể tải danh sách CV');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCVs();
    // Poll for processing updates
    const interval = setInterval(fetchCVs, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleDelete = async (cvId) => {
    if (!confirm('Xóa CV này? Kết quả gợi ý liên quan cũng sẽ bị xóa.')) return;
    try {
      await cvAPI.delete(cvId);
      toast.success('CV đã được xóa');
      fetchCVs();
    } catch (err) {
      toast.error('Không thể xóa CV');
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="ambient-bg" />
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-display font-bold text-white mb-2">📄 Quản lý CV</h1>
          <p className="text-surface-300">Upload và quản lý nhiều phiên bản CV để so sánh kết quả gợi ý</p>
        </motion.div>

        {/* Upload Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <CVUploadDropzone onUploadComplete={fetchCVs} />
        </motion.div>

        {/* CV List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-display font-semibold text-white">
              CV đã upload ({cvList.length})
            </h2>
            <button onClick={fetchCVs} className="btn-ghost text-xs flex items-center gap-1.5">
              <RefreshCw size={12} />
              Làm mới
            </button>
          </div>

          {isLoading ? (
            <div className="glass-card p-12 text-center">
              <Loader2 size={32} className="text-primary-400 animate-spin mx-auto mb-3" />
              <p className="text-surface-300">Đang tải...</p>
            </div>
          ) : cvList.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <FileText size={48} className="text-surface-600 mx-auto mb-4" />
              <p className="text-surface-300 mb-2">Chưa có CV nào</p>
              <p className="text-surface-400 text-sm">Upload CV đầu tiên để bắt đầu nhận gợi ý việc làm</p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {cvList.map((cv, index) => (
                <motion.div
                  key={cv.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: index * 0.05 }}
                  layout
                  className="glass-card p-5 flex items-center gap-5 group hover:border-white/[0.1] transition-all"
                >
                  {/* File Icon */}
                  <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center flex-shrink-0">
                    <FileText size={22} className="text-primary-400" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-medium truncate">{cv.filename}</h3>
                    <div className="flex items-center gap-3 mt-1.5">
                      <StatusBadge status={cv.processing_status} />
                      <span className="text-xs text-surface-400">
                        {new Date(cv.created_at).toLocaleDateString('vi-VN', {
                          day: '2-digit', month: '2-digit', year: 'numeric',
                          hour: '2-digit', minute: '2-digit',
                        })}
                      </span>
                    </div>
                    {cv.extracted_skills && cv.extracted_skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {cv.extracted_skills.slice(0, 5).map((skill) => (
                          <span key={skill} className="skill-tag skill-tag--matched">{skill}</span>
                        ))}
                        {cv.extracted_skills.length > 5 && (
                          <span className="text-xs text-surface-400">+{cv.extracted_skills.length - 5}</span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {cv.processing_status === 'completed' && (
                      <Link
                        to={`/results/${cv.id}`}
                        className="btn-primary text-sm flex items-center gap-1.5 px-4 py-2"
                      >
                        <Eye size={14} />
                        Xem kết quả
                      </Link>
                    )}
                    <button
                      onClick={() => handleDelete(cv.id)}
                      className="p-2.5 rounded-xl text-surface-400 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                      title="Xóa CV"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}
