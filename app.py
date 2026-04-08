import streamlit as st
import pandas as pd
import numpy as np
import PyPDF2 
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from deep_translator import GoogleTranslator

# Tái sử dụng hàm từ file matching_engine
from matching_engine import clean_text, load_and_prep_data

# --- HÀM HỖ TRỢ ĐỌC PDF ---
def extract_text_from_pdf(uploaded_file):
    try:
        pdf_reader = PyPDF2.PdfReader(uploaded_file)
        text = ""
        for page in pdf_reader.pages:
            extracted = page.extract_text()
            if extracted:
                text += extracted + " "
        return text
    except Exception as e:
        return f"Lỗi đọc file: {e}"
    
# --- CẤU HÌNH TRANG WEB ---
st.set_page_config(page_title="Job Recommender", layout="wide")

# --- SIDEBAR: CÀI ĐẶT ---
st.sidebar.title("⚙️ Cài đặt / Settings")
lang = st.sidebar.radio("Ngôn ngữ / Language:", ("Tiếng Việt", "English"))

st.sidebar.markdown("---")
# Đã sửa lại thanh Slider đầy đủ thông số
min_match_score = st.sidebar.slider(
    "Độ phù hợp tối thiểu (%)" if lang == "Tiếng Việt" else "Minimum Match Score (%)", 
    min_value=0, max_value=100, value=40, step=5
)

# --- TỪ ĐIỂN GIAO DIỆN ---
if lang == "Tiếng Việt":
    ui = {
        "title": "💼 Hệ thống Khuyến nghị Việc làm",
        "desc": "Hệ thống sử dụng AI (NLP) để phân tích CV và tìm ra top việc phù hợp nhất.",
        "tab_pdf": "📄 Tải lên CV (PDF)",
        "tab_manual": "✍️ Nhập thủ công",
        "role": "Vị trí ứng tuyển (VD: Backend Developer, Data Analyst...):",
        "skills": "Các kỹ năng của bạn (Ngăn cách bằng dấu phẩy):",
        "exp": "Mô tả ngắn về kinh nghiệm làm việc:",
        "btn": "🚀 Tìm việc phù hợp",
        "warning_pdf": "Vui lòng tải lên file PDF!",
        "warning_manual": "Vui lòng điền đầy đủ Vị trí ứng tuyển và Kỹ năng!",
        "loading": ">>> AI đang quét và phân tích CV của bạn...",
        "top_k": "🎯 Top công việc phù hợp nhất",
        "loc": "📍 Địa điểm",
        "level": "📈 Cấp độ",
        "match_score_text": "Độ phù hợp",
        "match": "Đúng: Kỹ năng trùng khớp",
        "no_match": "Chú ý: Kỹ năng trùng khớp",
        "no_match_text": "Không tìm thấy từ khóa trực tiếp",
        "job_desc": "Mô tả chi tiết"
    }
else:
    ui = {
        "title": "💼 Job Recommendation System",
        "desc": "System using AI (NLP) to analyze CVs and find the most suitable jobs.",
        "tab_pdf": "📄 Upload CV (PDF)",
        "tab_manual": "✍️ Manual Entry",
        "role": "Position applied for (e.g., Backend Developer...):",
        "skills": "Your skills (separated by commas):",
        "exp": "Brief description of work experience:",
        "btn": "🚀 Find suitable jobs",
        "warning_pdf": "Please upload a PDF file!",
        "warning_manual": "Please fill in the Position applied for and Skills completely!",
        "loading": ">>> AI is scanning your CV...",
        "top_k": "🎯 Top most suitable jobs",
        "loc": "📍 Location",
        "level": "📈 Level",
        "match_score_text": "Match Score",
        "match": "True: Duplicate skills",
        "no_match": "Notice: Duplicate skill",
        "no_match_text": "No direct keyword found",
        "job_desc": "Detailed description"
    }

st.title(ui["title"])
st.markdown(ui["desc"])

# --- TẢI MODEL VÀ DATA ---
@st.cache_resource
def load_model():
    return SentenceTransformer('paraphrase-multilingual-MiniLM-L12-v2')

@st.cache_data
def load_data():
    return load_and_prep_data()

@st.cache_data
def get_job_embeddings(_model_, _df_jobs_):
    return _model_.encode(_df_jobs_['cleaned_text'].tolist(), show_progress_bar=False)

with st.spinner(">>> Đang khởi tạo hệ thống AI / Loading AI System..."):
    model = load_model()
    df_jobs = load_data()
    if df_jobs is not None:
        job_embeddings = get_job_embeddings(model, df_jobs)
        
# --- GIAO DIỆN CHÍNH ---
if df_jobs is not None:
    # Chia giao diện thành 2 Tab cho chuyên nghiệp
    tab_pdf, tab_manual = st.tabs([ui["tab_pdf"], ui["tab_manual"]])
    
    cv_full_text = ""
    cv_skills_list = []
    run_search = False

    # TAB 1: Tải PDF
    with tab_pdf:
        uploaded_file = st.file_uploader("Kéo thả file CV của bạn vào đây (.pdf)", type=["pdf"])
        if st.button(ui["btn"], key="btn_pdf", type="primary"):
            if uploaded_file is None:
                st.warning(ui["warning_pdf"])
            else:
                raw_text = extract_text_from_pdf(uploaded_file)
                cv_full_text = raw_text
                run_search = True

    # TAB 2: Nhập tay
    with tab_manual:
        cv_role = st.text_input(ui["role"])
        cv_skills = st.text_area(ui["skills"])
        cv_exp = st.text_area(ui["exp"])

        if st.button(ui["btn"], key="btn_manual", type="primary"):
            if not cv_role or not cv_skills:
                st.warning(ui["warning_manual"])
            else:
                cv_full_text = f"{cv_role} {cv_skills} {cv_exp}"
                cv_skills_list = [s.strip().lower() for s in cv_skills.split(",")]
                run_search = True

    # --- XỬ LÝ LÕI AI ---
    if run_search and cv_full_text:
        with st.spinner(ui["loading"]):
            cv_cleaned = clean_text(cv_full_text)

            cv_embedding = model.encode([cv_cleaned])
            similarities = cosine_similarity(cv_embedding, job_embeddings)[0]

            top_k = 10
            top_indices = np.argsort(similarities)[::-1][:top_k]

            st.markdown("---")
            st.subheader(ui["top_k"].format(top_k))

            found_any = False

            for rank, idx in enumerate(top_indices, 1):
                match_score = similarities[idx] * 100
                
                # ÁP DỤNG SLIDER LỌC ĐIỂM: Chỉ in ra những công việc đạt đủ ngưỡng
                if match_score >= min_match_score:
                    found_any = True
                    job = df_jobs.iloc[idx]
                    job_text_lower = str(job['full_text']).lower()
                    
                    matched_skills = [skill for skill in cv_skills_list if skill and skill in job_text_lower]
                    
                    with st.expander(f"🏆 Top {rank}: {job['job_title']} - {ui['match_score_text']}: {match_score:.1f}%"):
                        st.write(f"**{ui['loc']}:** {job['location']}")
                        st.write(f"**{ui['level']}:** {job['experience_level']}")

                        if matched_skills:
                            st.success(f"**{ui['match']}:** {', '.join(matched_skills).title()}")
                        else:
                            st.warning(f"**{ui['no_match']}:** {ui['no_match_text']}")

                        st.write(f"**{ui['job_desc']}:**")
                        short_desc = job['job_description'][:600] + "..."

                        if lang == "Tiếng Việt":
                            try:
                                translated_desc = GoogleTranslator(source='en', target='vi').translate(short_desc)
                                st.info(translated_desc)
                            except Exception:
                                st.write(short_desc)
                                st.caption("Lỗi kết nối dịch thuật / Translation error")
                        else:
                            st.write(short_desc)
                            
            if not found_any:
                st.info("Không có công việc nào đạt mức độ phù hợp tối thiểu. Hãy thử kéo thanh trượt Slider xuống thấp hơn!")
else:
    st.error("Không thể tải dữ liệu công việc. Vui lòng kiểm tra lại thư mục data.")