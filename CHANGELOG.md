# 📋 CHANGELOG — Job Recommender System

> File này ghi lại tất cả thay đổi quan trọng trong hệ thống.
> Mục đích: đọc nhanh để nắm bối cảnh, không cần đọc lại toàn bộ codebase.

---

## [2026-06-03 v2] — Tracking Logic Overhaul + Demo Visibility

### 🧠 Ý tưởng cốt lõi: "Dopamine TTL"
Tracking data sống 5-10 phút — giống dopamine. Tương tác mới → đề xuất "hưng phấn" (job được đẩy lên top). Hết thời gian → reset baseline. Điều này tạo ra vòng lặp phản hồi nhanh cho demo.

### 🔴 Fix Critical: Dwell Timer prefix `view_detail_` (Bug)

**Trước đó**: `JobDetailModal` gọi `tracker.startDwellTimer("view_detail_5")` → Backend kiểm tra `isNaN()` → `job_id = null`. Toàn bộ dwell data từ modal detail **bị mất**.

**Sau fix**: Dùng `tracker.startDwellTimer(job.id)` trực tiếp. Thêm `trackClick()` khi mở modal.

### 🟠 Fix: SuperHotJobCard dwell time (Logic sai)

**Trước đó**: `useJobDwellTime(job.id, true)` — 20+ cards mount cùng lúc → 20 timers chạy → tất cả ghi `DEEP_READ`. Data vô nghĩa.

**Sau fix**: Dùng `IntersectionObserver` (threshold 50%) — chỉ track khi card **thực sự visible** trong viewport. Bỏ qua dwell < 500ms.

### ✅ Tính năng mới: TrackingInsightsPanel

Floating panel góc dưới phải hiển thị realtime:
- 📊 Session stats: events by type (CLICK, DWELL, BOOKMARK, APPLY, SEARCH)
- 🧠 Engagement distribution: Lướt qua / Đọc lướt / Đọc kỹ
- 🔥 Top skills trending (từ server DB)
- ⚡ Top jobs quan tâm nhất (sorted by affinity score)
- ⏱️ Dopamine TTL info
- 🔄 Nút "Cập nhật đề xuất" (trigger feed refresh)

### ✅ Tính năng mới: Auto-refresh Feed (30 giây)

LandingPage tự động gọi `/api/jobs/feed` mỗi 30 giây (silent, không loading spinner). User thấy job re-order theo tracking data.

### ✅ Tính năng mới: Tracking Stats API

`GET /api/tracking/stats` trả về:
- `events_by_type`: Breakdown CLICK/DWELL/BOOKMARK/APPLY/SEARCH
- `engagement_distribution`: GLANCE / SKIM / DEEP_READ
- `avg_dwell_seconds`: Thời gian đọc trung bình
- `top_skills`: Skills trending từ jobs đã tương tác
- `top_interacted_jobs`: Jobs có affinity score cao nhất
- `ttl_info`: TTL minutes + oldest/newest event timestamp

### ✅ Fix: SEARCH event tracking

`HeroSearch` giờ gọi `trackSearch(keyword, { city })` khi search hoặc click suggestion. Backend đã accept `SEARCH` từ trước nhưng frontend chưa gửi.

#### Files thay đổi:

| File | Thay đổi |
|---|---|
| `frontend/src/tracking/TrackingSDK.js` | Thêm `trackSearch()`, `getSessionStats()`, `onStatsChange()`, duplicate timer guard, min dwell 500ms |
| `frontend/src/hooks/useJobTracking.js` | Refactor `useJobDwellTime` → IntersectionObserver. Thêm `useTrackingStats` hook |
| `frontend/src/components/itviec/JobDetailModal.jsx` | Fix prefix bug, thêm `trackClick()` khi mở modal |
| `frontend/src/components/itviec/SuperHotJobCard.jsx` | Dùng `cardRef` + IntersectionObserver thay `true` |
| `frontend/src/components/itviec/HeroSearch.jsx` | Thêm `trackSearch()` khi search/click suggestion |
| `frontend/src/components/itviec/TrackingInsightsPanel.jsx` | **[NEW]** Floating panel tracking insights |
| `frontend/src/pages/LandingPage.jsx` | Auto-refresh feed 30s, tích hợp TrackingInsightsPanel |
| `frontend/src/pages/ResultsPage.jsx` | Fix `useJobDwellTime` dùng ref |
| `frontend/src/services/api.js` | Thêm `trackingAPI.getStats()` |
| `frontend/src/index.css` | Thêm `.tracking-panel-*` CSS classes |
| `backend/src/routes/tracking.js` | **[NEW]** `GET /api/tracking/stats` endpoint |

---

## [2026-06-03] — Job Detail Modal + Tracking Integration

### ✅ Tính năng mới: Xem chi tiết Job từ Landing Page

**Vấn đề**: Ở trang Landing Page (Việc làm IT), click vào job card không hiện chi tiết.

**Giải pháp**: Tạo modal popup xem chi tiết Job, đồng nhất giao diện với CompanyDetailsPage.

#### Files thay đổi:

| File | Thay đổi |
|---|---|
| `frontend/src/components/itviec/JobDetailModal.jsx` | **[NEW]** Modal popup xem chi tiết Job |
| `frontend/src/components/itviec/SuperHotJobCard.jsx` | Thêm prop `onJobClick`, `e.stopPropagation()` cho nút xem lương |
| `frontend/src/pages/LandingPage.jsx` | Tích hợp `JobDetailModal`, state `selectedJob` |
| `frontend/src/index.css` | Xóa CSS custom `.job-modal-*` (không cần, dùng chung design system) |

#### Chi tiết kỹ thuật:

**JobDetailModal.jsx**:
- Sử dụng `framer-motion` (`AnimatePresence`) cho animation mở/đóng — giống `ApplyModal`
- Backdrop: `rgba(0,0,0,0.7)` + `backdrop-filter: blur(8px)`
- Container: `glass-card` + CSS variables (`--bg-card`, `--border-card`...) — hỗ trợ dark/light mode
- 3 sections giống hệt `JobDetailCard` trong `CompanyDetailsPage`:
  1. **Job Description** — icon `BookOpen`, bullets `CheckCircle2`, class `job-detail-section`
  2. **Skills & Experience** — icon `Code2`, `skill-tag--matched`, badge cấp độ tím
  3. **Môi trường làm việc** — icon `Laptop`, grid 2x2 emoji cards
- Nút "Apply Now" mở `ApplyModal`
- **Tracking**: `startDwellTimer(view_detail_{id})` khi mở, `stopDwellTimer()` khi đóng
- Đóng bằng: nút X, click overlay, phím Escape
- Lock body scroll khi mở

**SuperHotJobCard.jsx**:
- `onJobClick` prop: truyền từ `LandingPage` để mở modal
- Nút "Click để xem mức lương": thêm `e.stopPropagation()` để không mở modal
- Nút "Ứng tuyển ngay": đã có `e.stopPropagation()` từ trước

---

## Kiến trúc hiện tại (tóm tắt nhanh)

```
Frontend (React :5173)
├── TrackingSDK.js      → Buffer events, flush mỗi 5s
├── useJobTracking.js   → React hooks: trackClick, trackApply, trackBookmark
├── useJobDwellTime.js  → Auto start/stop dwell timer
├── LandingPage         → Job feed + JobDetailModal
├── ResultsPage         → AI recommendations + Explainable AI
├── DashboardPage       → Upload/manage CVs
└── CompanyDetailsPage  → Company details + JobDetailCard (expand inline)

Backend (Node.js :3000)
├── POST /api/tracking/events   → Lưu events vào PostgreSQL
├── GET  /api/jobs/feed         → Job feed + match scores (nếu có CV)
├── GET  /api/recommendations   → AI recommendations cho CV
├── POST /api/cv/upload         → Upload CV → trigger AI matching
└── POST /api/jobs/:id/apply-cv → CV vs 1 Job → instant score

AI Worker (FastAPI :8000)
├── POST /api/ai/match          → CV → SBERT → Milvus → Top-K jobs
├── POST /api/ai/match-job      → CV vs 1 Job → Score
└── Services: SBERT (384-dim), Milvus Lite, pdfplumber

Database
├── PostgreSQL: users, jobs, cvs, recommendations, bookmarks, user_tracking_events
└── Milvus Lite: Job vectors 384-dim
```

### Tracking Events đang thu thập:

| Event | Nơi trigger | Payload chính |
|---|---|---|
| `CLICK` | SuperHotJobCard, JobCard (Results) | job_id, position, match_score |
| `DWELL_TIME` | SuperHotJobCard (visible), JobCard (expand), JobDetailModal (open→close) | job_id, dwell_ms, engagement (GLANCE/SKIM/DEEP_READ) |
| `BOOKMARK` | JobCard (Results) | job_id, action (ADD/REMOVE) |
| `APPLY` | SuperHotJobCard, JobCard (Results), apply-cv endpoint | job_id, applied_via |

### ⚠️ GAP đã được giải quyết:
**Tracking data được thu thập nhưng KHÔNG được sử dụng cho đề xuất.** -> **ĐÃ FIX (Hybrid Recommender)**

*Chi tiết thay đổi (Backend)*:
- Sửa đổi `GET /api/jobs/feed` và `GET /api/recommendations/:cvId` để sử dụng CTE tính điểm tương tác:
  - `job_popularity`: Dựa trên tổng lượng events của tất cả users.
  - `user_affinity`: Dựa trên hành vi cá nhân (`APPLY` +15, `BOOKMARK` +10, `DWELL_TIME` +2, `CLICK` +1).
- Ranking được tính toán lại qua công thức `final_score`: `(0.7 * SBERT_match) + (0.1 * Popularity) + (0.2 * Affinity)`.
- **Hiển thị ngẫu nhiên (Cold-start):** Các job chưa có tracking và chưa có match_score sẽ được sắp xếp ngẫu nhiên (`ORDER BY RANDOM()`) để tránh việc luôn hiển thị các job giống nhau.
- **Thời gian sống của Đề xuất (TTL):** TTL auto-cleanup bảng `user_tracking_events` là **2 phút**. Các tương tác cũ hơn 2 phút sẽ tự động bị xóa để nhường chỗ cho dữ liệu mới, giúp đề xuất luôn tươi mới. Cleanup chạy mỗi 30 giây.
*Chi tiết thay đổi (Frontend)*:
- Sửa lỗi TrackingSDK bị mất sự kiện Dwell Time khi reload/đóng tab. Đã tích hợp `visibilitychange` và `navigator.sendBeacon` để đảm bảo data tracking luôn được đẩy về server an toàn trước khi trình duyệt hủy trang.
- **Gợi ý từ khóa động (HeroSearch):** Phần gợi ý tìm kiếm (`Gợi ý: React, Java...`) không còn hardcode nữa. Khi user có data tracking, hệ thống sẽ tự động quét các kỹ năng (`required_skills`) từ các Job mà user đã tương tác nhiều nhất và đẩy lên làm từ khóa gợi ý!
