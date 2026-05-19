# ═══════════════════════════════════════════════════
# Text Processor — Clean text & Extract skills
#
# Ported from the original matching_engine.py:
# - clean_text(): Remove HTML, normalize whitespace
# - extract_skills(): Find known skill keywords in text
# ═══════════════════════════════════════════════════
import re


# ─── Known Skills Dictionary ─────────────────────
# Used for keyword-based skill extraction from CV text
KNOWN_SKILLS = [
    # Programming Languages
    'python', 'javascript', 'typescript', 'java', 'c++', 'c#', 'go', 'golang',
    'rust', 'ruby', 'php', 'swift', 'kotlin', 'scala', 'r', 'matlab', 'perl',
    # Frontend
    'react', 'reactjs', 'angular', 'vue', 'vuejs', 'svelte', 'next.js', 'nextjs',
    'html', 'css', 'sass', 'less', 'tailwind', 'bootstrap', 'jquery',
    # Backend
    'node.js', 'nodejs', 'express', 'django', 'flask', 'fastapi', 'spring',
    'spring boot', 'asp.net', 'laravel', 'rails', 'ruby on rails',
    # Databases
    'sql', 'postgresql', 'postgres', 'mysql', 'mongodb', 'redis', 'elasticsearch',
    'dynamodb', 'cassandra', 'sqlite', 'oracle', 'sql server',
    # Cloud & DevOps
    'docker', 'kubernetes', 'k8s', 'aws', 'azure', 'gcp', 'google cloud',
    'terraform', 'ansible', 'jenkins', 'ci/cd', 'github actions', 'gitlab ci',
    'nginx', 'apache', 'linux', 'unix', 'bash',
    # AI/ML
    'machine learning', 'deep learning', 'nlp', 'natural language processing',
    'computer vision', 'tensorflow', 'pytorch', 'keras', 'scikit-learn',
    'transformers', 'hugging face', 'llm', 'openai', 'langchain',
    # Data
    'data analysis', 'data science', 'data engineering', 'etl',
    'pandas', 'numpy', 'spark', 'pyspark', 'hadoop', 'kafka', 'airflow',
    'power bi', 'tableau', 'looker', 'dbt',
    # Tools & Practices
    'git', 'github', 'gitlab', 'jira', 'confluence', 'figma',
    'agile', 'scrum', 'kanban', 'tdd', 'devops', 'microservices',
    'rest api', 'restful', 'graphql', 'grpc', 'websocket',
    # Soft Skills
    'communication', 'leadership', 'problem solving', 'teamwork',
    'project management', 'critical thinking', 'analytical',
]


def clean_text(text: str) -> str:
    """
    Clean and normalize text for embedding.
    
    Ported from matching_engine.py clean_text():
    - Lowercase
    - Remove HTML tags
    - Remove non-alphanumeric characters (keep #, +, -, .)
    - Normalize whitespace
    
    Args:
        text: Raw text to clean
        
    Returns:
        Cleaned, normalized text
    """
    if not text:
        return ""

    text = str(text).lower()
    text = re.sub(r'<[^>]+>', ' ', text)           # Remove HTML tags
    text = re.sub(r'[^a-z0-9\s#\+\-\.]', ' ', text)  # Keep alphanumeric + special chars
    text = re.sub(r'\s+', ' ', text).strip()        # Normalize whitespace
    return text


def extract_skills(text: str) -> list[str]:
    """
    Extract known skill keywords from text.
    
    Uses a dictionary-based approach to find skills mentioned
    in CV or job description text.
    
    Args:
        text: Raw text to scan for skills
        
    Returns:
        List of found skill names (lowercase)
    """
    if not text:
        return []

    text_lower = text.lower()
    found_skills = []

    for skill in KNOWN_SKILLS:
        # Use word boundary check to avoid partial matches
        # e.g., "r" shouldn't match inside "react"
        if len(skill) <= 2:
            # For very short skills (like "r"), require word boundaries
            pattern = r'\b' + re.escape(skill) + r'\b'
            if re.search(pattern, text_lower):
                found_skills.append(skill)
        else:
            if skill in text_lower:
                found_skills.append(skill)

    # Deduplicate while preserving order
    return list(dict.fromkeys(found_skills))
