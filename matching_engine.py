import pandas as pd
import json
import re
import numpy as np
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

# 1.Các hàm tiền xử lý
def clean_text(text):
    # Làm sạch văn bản: xóa HTML, ký tự thừa, đưa về chữ thường
    if pd.isna(text):
        return ""
    
    text = str(text).lower()
    text = re.sub(r'<[^>]+>', ' ', text)
    text = re.sub(r'[^a-z0-9\s#\+\-\.]', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

# 2.Hàm tải và chuẩn bị
def load_and_prep_data():
    print("Đang tải dữ liệu...")
    try:
        #Đọc file với engine 'python' để tránh lỗi do dữ liệu không đồng nhất
        df_jobs = pd.read_csv('data/linkedin_job_postings.csv', on_bad_lines='skip',engine='python')

        # 1.Chọn đúng cột thực tế có trong file
        actual_cols = ['title', 'description', 'skills_desc', 'formatted_experience_level', 'location']
        df_jobs = df_jobs[actual_cols].dropna(subset=['description'])

        # 2. Đổi tên cột lại cho khớp với code thuật toán dưới
        df_jobs = df_jobs.rename(columns={
            'title': 'job_title',
            'description': 'job_description',
            'skills_desc': 'skills_desc',
            'formatted_experience_level': 'experience_level',
            'location': 'location'
        })

        # 3. Gộp thông tin và làm sạch văn bản
        df_jobs['full_text'] = df_jobs['job_description'] + " " + df_jobs['skills_desc'].fillna('')
        df_jobs['cleaned_text'] = df_jobs['full_text'].apply(clean_text)

        # Lấy 1000 dòng đầu tiên để test
        return df_jobs.head(1000)
    except FileNotFoundError:
        print("LỖI: không thấy file data/linkedin_job_postings.csv")
        return None
    
# 3.Khởi tạo mô hình và chạy thuật toán
def main():
    #3.1 Tải dữ liệu jobs
    df_jobs = load_and_prep_data()
    if df_jobs is None: return

    #3.2 Khởi tạo SBERT
    print(">>> Đang khởi tạo mô hình NLP (SBERT)...")
    model = SentenceTransformer('paraphrase-multilingual-MiniLM-L12-v2')

    #3.3 Vector hóa dữ liệu jobs
    print(">>> Đang chuyển đổi Jobs thành Vectors (Embedding)...")
    job_embeddings = model.encode(df_jobs['cleaned_text'].tolist(), show_progress_bar = True)

    #3.4 Đọc dữ liệu CV từ file JSON
    print(">>> Đang đọc dữ liệu CV từ file JSON...")
    with open('data/mock_cvs.json', 'r', encoding = 'utf-8') as f:
        cv_data = json.load(f)

    #3.5 So khớp CV đầu tiên
    for i in range(len(cv_data)):
        target_cv = cv_data[i]
        cv_full_text = target_cv['target_role'] + " " + " ".join(target_cv['skills']) + " " + target_cv['experience_summary']
        cv_cleaned = clean_text(cv_full_text)

        # Vector hóa CV
        cv_embedding = model.encode([cv_cleaned])

        #Tính Cosine Similarity
        similarities = cosine_similarity(cv_embedding, job_embeddings)[0]

        #Lấy top 5 công việc phù hợp nhất
        top_k = 5
        top_indices = np.argsort(similarities)[::-1][:top_k]
        
        print(f"\n=== KẾT QUẢ TÌM KIẾM CHO CV: {target_cv['candidate_id']} ({target_cv['target_role']}) ===")
        for rank, idx in enumerate(top_indices, 1):
            match_score = similarities[idx] * 100
            job = df_jobs.iloc[idx]
            print(f"Top {rank} - Độ phù hợp: {match_score:.2f}%")
            print(f"Vị trí: {job['job_title']} | Địa điểm: {job['location']}")
            print("-" * 40)
            print()

if __name__ == "__main__":
    main()