// ═══════════════════════════════════════════════════
// reset_jobs.js — Xóa jobs cũ, insert 10 vị trí IT cố định
//
// Usage: node src/config/reset_jobs.js
// ═══════════════════════════════════════════════════
require('dotenv').config({ path: require('path').join(__dirname, '../../../.env') });
const db = require('./database');

// 10 vị trí IT chi tiết — mỗi job có description và skills thực tế
const IT_JOBS = [
  {
    companyName: 'FPT Software',
    title: 'Backend Software Engineer (Python/Node.js)',
    description: `We are looking for a Backend Software Engineer to join our growing engineering team.

You will design, build, and maintain scalable REST APIs and microservices that power our core products used by millions of users.

Responsibilities:
• Design and develop high-performance RESTful APIs using Python (FastAPI/Django) or Node.js (Express)
• Optimize PostgreSQL and MongoDB queries for large-scale data workloads
• Build and maintain Docker containers and deploy to AWS/GCP cloud infrastructure
• Write clean, well-tested code with unit and integration tests (pytest, Jest)
• Participate in code reviews and contribute to engineering best practices
• Collaborate with frontend and mobile teams on API design and integration
• Monitor system health and respond to incidents using observability tools (Datadog, Grafana)

What We Offer:
• Competitive salary up to $3,000/month
• Annual performance bonus
• Remote-friendly work policy
• Budget for courses, conferences, and tech books`,
    skills_desc: `Required:
- 3+ years backend development experience
- Proficient in Python (FastAPI or Django) or Node.js (Express)
- Strong SQL skills — PostgreSQL/MySQL performance tuning
- Experience with Docker, Docker Compose
- RESTful API design principles and best practices
- Git version control workflow (GitFlow or trunk-based)

Nice to have:
- Experience with Redis caching, message queues (RabbitMQ/Kafka)
- Kubernetes / Helm charts deployment
- AWS services (EC2, RDS, S3, Lambda)
- gRPC or GraphQL
- CI/CD pipelines (GitHub Actions, Jenkins)`,
    required_skills: ['python', 'node.js', 'postgresql', 'docker', 'rest api', 'git', 'redis', 'aws'],
    experience_level: 'Mid-Senior level',
    location: 'Ho Chi Minh City, Vietnam',
    salary_range: '$1,500 - $3,000',
  },
  {
    companyName: 'VNG Corporation',
    title: 'Frontend Developer (React / TypeScript)',
    description: `VNG is seeking a talented Frontend Developer to build next-generation web applications for our gaming and digital products ecosystem.

You will work closely with product designers and backend engineers to create intuitive, fast, and beautiful user interfaces.

Responsibilities:
• Build responsive, accessible UI components using React 18 and TypeScript
• Implement pixel-perfect designs from Figma into production-quality code
• Optimize web performance (Core Web Vitals, lazy loading, code splitting)
• Integrate GraphQL and REST APIs with React Query / SWR
• Write unit and E2E tests using Jest, React Testing Library, and Playwright
• Contribute to our internal design system and component library
• Mentor junior developers and review pull requests
• Participate in agile ceremonies (sprint planning, standups, retrospectives)

Why Join VNG:
• Work on products with 10M+ active users
• Modern tech stack (Next.js, Vite, Tailwind CSS)
• Flexible remote/hybrid work arrangements
• Competitive compensation: $1,800 - $3,500/month`,
    skills_desc: `Required:
- 3+ years of frontend development experience
- Expert-level React.js (hooks, context, performance optimization)
- TypeScript — strong typing, generics, utility types
- HTML5, CSS3, responsive design principles
- State management (Zustand, Redux Toolkit, or Jotai)
- Git + CI/CD workflows

Nice to have:
- Next.js App Router (SSR/SSG/ISR)
- Tailwind CSS or CSS-in-JS (Emotion, Styled Components)
- GraphQL + Apollo Client or React Query
- Testing: Jest, Vitest, Playwright
- Micro-frontend architecture
- Web performance optimization (Lighthouse, Web Vitals)`,
    required_skills: ['react', 'typescript', 'javascript', 'html', 'css', 'graphql', 'git', 'tailwind'],
    experience_level: 'Mid-Senior level',
    location: 'Ho Chi Minh City, Vietnam',
    salary_range: '$1,800 - $3,500',
  },
  {
    companyName: 'KMS Technology',
    title: 'DevOps / Cloud Engineer (AWS / Kubernetes)',
    description: `KMS Technology is looking for an experienced DevOps Engineer to help us scale our cloud infrastructure and drive automation across our engineering teams.

As a DevOps Engineer, you will design and maintain CI/CD pipelines, manage cloud resources, and ensure our systems are highly available, secure, and cost-efficient.

Responsibilities:
• Design, provision, and manage AWS infrastructure using Terraform and CloudFormation
• Build and maintain CI/CD pipelines with GitHub Actions, Jenkins, or GitLab CI
• Manage Kubernetes clusters (EKS) for container orchestration
• Implement monitoring, alerting, and observability (Prometheus, Grafana, Datadog)
• Automate routine operational tasks using Python or Bash scripting
• Enforce security best practices: IAM policies, VPC design, secrets management (Vault)
• Optimize cloud costs and resource utilization
• Collaborate with development teams to improve deployment velocity

Benefits:
• Salary: $2,000 - $4,000/month
• AWS certification support and training budget
• 13-month bonus + performance review twice a year`,
    skills_desc: `Required:
- 3+ years DevOps/SRE/Cloud engineering experience
- AWS (EC2, EKS, RDS, S3, CloudFront, Lambda, IAM)
- Kubernetes (kubectl, Helm, cluster management)
- Infrastructure as Code: Terraform (required) + Ansible (preferred)
- CI/CD: GitHub Actions, Jenkins, or GitLab CI
- Docker containerization and image optimization
- Linux system administration and shell scripting (Bash)
- Monitoring: Prometheus + Grafana or Datadog

Nice to have:
- AWS Solutions Architect / DevOps Engineer certification
- HashiCorp Vault for secrets management
- Service mesh: Istio or Linkerd
- ArgoCD / Flux for GitOps workflows
- Python for automation scripting`,
    required_skills: ['aws', 'kubernetes', 'docker', 'terraform', 'ci/cd', 'linux', 'python', 'devops'],
    experience_level: 'Mid-Senior level',
    location: 'Hanoi, Vietnam (Hybrid)',
    salary_range: '$2,000 - $4,000',
  },
  {
    companyName: 'VinAI Research',
    title: 'Data Scientist / Machine Learning Engineer',
    description: `VinAI Research is one of Asia's top AI research institutes. We are hiring Data Scientists and ML Engineers to work on cutting-edge AI products including computer vision, NLP, and autonomous driving systems.

Responsibilities:
• Design and implement machine learning models for production use cases
• Conduct exploratory data analysis (EDA) on large, complex datasets
• Train, fine-tune, and evaluate deep learning models (CNNs, Transformers, LLMs)
• Build ML pipelines for data preprocessing, feature engineering, model training, and evaluation
• Deploy models to production using MLflow, BentoML, or FastAPI
• Collaborate with AI researchers to translate research papers into production systems
• Write technical documentation and present findings to stakeholders
• Monitor model performance and implement retraining pipelines

Research Areas:
• Large Language Models (LLM) and Retrieval-Augmented Generation (RAG)
• Computer Vision (object detection, segmentation, OCR)
• Speech Recognition and Synthesis
• Recommendation Systems`,
    skills_desc: `Required:
- 3+ years ML/Data Science experience
- Python proficiency: NumPy, Pandas, Scikit-learn
- Deep Learning frameworks: PyTorch (required) or TensorFlow
- Experience training and fine-tuning neural networks
- Strong understanding of ML fundamentals (optimization, regularization, evaluation metrics)
- SQL for data querying and analysis
- Git version control

Nice to have:
- Hugging Face Transformers, PEFT, LoRA for LLM fine-tuning
- MLOps: MLflow, DVC, Weights & Biases
- Distributed training (PyTorch DDP, DeepSpeed)
- Vector databases (Pinecone, Milvus, Weaviate)
- Experience with Spark or Hadoop for big data
- Publications in top ML conferences (NeurIPS, ICML, ICCV, ACL)`,
    required_skills: ['python', 'machine learning', 'deep learning', 'pytorch', 'tensorflow', 'sql', 'pandas', 'numpy'],
    experience_level: 'Mid-Senior level',
    location: 'Hanoi, Vietnam',
    salary_range: '$2,500 - $5,000',
  },
  {
    companyName: 'Shopee Vietnam',
    title: 'Mobile Developer (React Native / Flutter)',
    description: `Shopee is Southeast Asia's leading e-commerce platform with 300M+ users. We are looking for Mobile Developers to build fast, reliable, and beautiful experiences on iOS and Android.

You will work on features used by millions of daily active users in Vietnam and across the region.

Responsibilities:
• Develop cross-platform mobile applications using React Native or Flutter
• Implement complex UI animations and interactions with native performance
• Integrate with backend APIs (REST/GraphQL) and handle real-time data
• Optimize app performance: startup time, memory usage, rendering
• Write unit tests and automated UI tests (Detox, Flutter Test)
• Collaborate with iOS/Android native engineers for hybrid features
• Review code and mentor junior mobile developers
• Participate in A/B testing and feature flag rollouts

What You Get:
• Competitive salary: $1,500 - $3,000/month
• Annual performance bonus up to 4 months salary
• MacBook Pro provided
• Flexible working hours`,
    skills_desc: `Required:
- 2+ years mobile development with React Native or Flutter
- Strong JavaScript/TypeScript (React Native) or Dart (Flutter)
- Understanding of iOS (Swift) and Android (Kotlin) native modules
- State management: Redux/MobX (React Native) or Bloc/Riverpod (Flutter)
- RESTful API integration and async programming
- App Store / Google Play deployment process
- Performance profiling and optimization

Nice to have:
- React Native New Architecture (JSI, Fabric, TurboModules)
- Flutter animations (AnimationController, Rive)
- Push notifications (Firebase Cloud Messaging)
- Deep linking and universal links
- Offline-first architecture with SQLite or Hive
- CI/CD for mobile: Fastlane, Bitrise, or Codemagic`,
    required_skills: ['react native', 'flutter', 'javascript', 'typescript', 'ios', 'android', 'dart', 'rest api'],
    experience_level: 'Associate',
    location: 'Ho Chi Minh City, Vietnam',
    salary_range: '$1,500 - $3,000',
  },
  {
    companyName: 'Tiki',
    title: 'Full Stack Engineer (Node.js + React)',
    description: `Tiki is Vietnam's trusted e-commerce platform. Our engineering team moves fast, ships features weekly, and builds systems that handle millions of transactions daily.

We need a Full Stack Engineer who is comfortable working across the entire product stack — from database design to pixel-perfect UI.

Responsibilities:
• Build and ship full-featured product modules end-to-end (backend API + frontend UI)
• Design PostgreSQL/MySQL schemas for new features
• Develop REST APIs with Node.js (Express or Fastify)
• Build responsive React interfaces with great UX
• Write comprehensive tests: unit, integration, and E2E
• Review code, maintain documentation, and champion code quality
• Debug production issues and optimize system performance
• Collaborate cross-functionally with product, design, and data teams`,
    skills_desc: `Required:
- 3+ years of full-stack web development
- Node.js backend: Express.js or Fastify
- React frontend: hooks, context, performance patterns
- TypeScript on both frontend and backend
- Relational databases: PostgreSQL or MySQL
- REST API design and documentation (OpenAPI/Swagger)
- Docker for local development
- Git and GitHub-based workflows

Nice to have:
- Next.js for SSR/SSG
- Redis for caching and session management
- Message queues: BullMQ, RabbitMQ, or Kafka
- AWS or GCP cloud deployment experience
- GraphQL APIs
- Microservices architecture`,
    required_skills: ['node.js', 'react', 'typescript', 'postgresql', 'docker', 'rest api', 'javascript', 'git'],
    experience_level: 'Mid-Senior level',
    location: 'Ho Chi Minh City, Vietnam',
    salary_range: '$2,000 - $4,000',
  },
  {
    companyName: 'Cloudflare',
    title: 'Cybersecurity Engineer (Penetration Testing)',
    description: `Cloudflare secures and accelerates the Internet for over 20% of all web traffic. Our security team is seeking a Cybersecurity Engineer to help protect our customers and infrastructure from evolving threats.

Responsibilities:
• Conduct penetration testing and vulnerability assessments on web apps, APIs, and infrastructure
• Perform red team exercises and simulate real-world attack scenarios
• Review and audit application source code for security vulnerabilities (OWASP Top 10)
• Configure and manage SIEM platforms (Splunk, Elastic SIEM) for threat detection
• Develop custom security tools and automation scripts in Python
• Respond to security incidents and perform root cause analysis (SOC Tier 2/3)
• Maintain and improve firewall rules, WAF policies, and network access controls
• Provide security consulting to engineering teams during product development
• Write detailed penetration testing reports with remediation recommendations`,
    skills_desc: `Required:
- 3+ years information security or penetration testing experience
- Strong Python scripting for security automation
- Web application penetration testing (Burp Suite, OWASP ZAP)
- Network security tools: Nmap, Metasploit, Wireshark
- Linux system internals and privilege escalation techniques
- SIEM platforms: Splunk, IBM QRadar, or Elastic SIEM
- Firewall and network security configuration

Nice to have:
- CEH, OSCP, CISSP, or GPEN certification
- Cloud security: AWS Security Hub, Azure Sentinel
- Container security: Docker/Kubernetes security scanning
- Threat modeling methodologies (STRIDE, PASTA)
- Experience with bug bounty programs (HackerOne, Bugcrowd)
- Reverse engineering and malware analysis`,
    required_skills: ['python', 'linux', 'penetration testing', 'cybersecurity', 'networking', 'siem', 'docker'],
    experience_level: 'Mid-Senior level',
    location: 'Remote (Vietnam)',
    salary_range: '$2,500 - $5,000',
  },
  {
    companyName: 'Axon Active',
    title: 'QA Automation Engineer (Selenium / Playwright)',
    description: `Axon Active follows Agile/Scrum methodology and works with Swiss clients on cutting-edge software projects. We are looking for a QA Automation Engineer to ensure product quality through automated testing strategies.

Responsibilities:
• Design and implement automated test frameworks for web, API, and mobile applications
• Write and maintain E2E tests using Selenium WebDriver, Playwright, or Cypress
• Build API test suites using Postman, RestAssured, or pytest
• Integrate automated tests into CI/CD pipelines (Jenkins, GitHub Actions)
• Perform performance and load testing with JMeter or K6
• Collaborate with developers in Test-Driven Development (TDD) workflows
• Track and manage defects using JIRA and maintain test documentation
• Conduct exploratory and regression testing for new features
• Mentor developers on testing best practices`,
    skills_desc: `Required:
- 2+ years QA automation experience
- Proficiency with Selenium WebDriver or Playwright
- API testing: Postman, RestAssured, or pytest-requests
- Programming skills: Python or JavaScript/TypeScript
- Test management tools: JIRA, TestRail, or Zephyr
- CI/CD integration: Jenkins, GitHub Actions, or GitLab CI
- Git version control

Nice to have:
- Cypress or Puppeteer for JavaScript E2E testing
- BDD frameworks: Cucumber (Gherkin), Behave
- Mobile test automation: Appium
- Performance testing: Apache JMeter or K6
- Docker for test environment setup
- ISTQB certification`,
    required_skills: ['selenium', 'python', 'javascript', 'ci/cd', 'git', 'rest api', 'agile', 'scrum'],
    experience_level: 'Associate',
    location: 'Da Nang, Vietnam (Hybrid)',
    salary_range: '$1,200 - $2,500',
  },
  {
    companyName: 'Grab Vietnam',
    title: 'AI / NLP Engineer (LLM & Generative AI)',
    description: `Grab is Southeast Asia's leading superapp. Our AI team is at the forefront of applying large language models and NLP to solve real-world problems in ride-hailing, food delivery, and financial services.

We are hiring an AI/NLP Engineer to develop and productionize AI solutions.

Responsibilities:
• Design and implement NLP solutions: entity extraction, sentiment analysis, intent classification, summarization
• Fine-tune pre-trained language models (BERT, RoBERTa, LLaMA, Mistral) using PEFT/LoRA
• Build RAG (Retrieval-Augmented Generation) pipelines for knowledge-intensive tasks
• Evaluate model performance with appropriate metrics (F1, ROUGE, BLEU, human evaluation)
• Deploy models as scalable FastAPI microservices
• Collaborate with data engineers to build training data pipelines
• Monitor model performance in production and implement retraining strategies
• Stay current with latest AI/NLP research (arXiv, top conferences)`,
    skills_desc: `Required:
- 3+ years NLP/ML engineering experience
- Deep expertise in Python ML ecosystem: Transformers, PyTorch, scikit-learn
- Experience fine-tuning LLMs (BERT/GPT family) with Hugging Face
- Text processing pipelines: tokenization, embeddings, vector search
- Vector databases: Pinecone, Weaviate, Milvus, or Chroma
- FastAPI or Flask for model serving
- Strong mathematical background: linear algebra, probability, statistics

Nice to have:
- LangChain or LlamaIndex for RAG pipelines
- Parameter-efficient fine-tuning: LoRA, QLoRA, Prefix Tuning
- MLOps tools: MLflow, DVC, Weights & Biases
- Experience with GPT-4, Claude, or Gemini APIs
- Research publications or open-source NLP contributions
- Distributed training: DeepSpeed, FSDP`,
    required_skills: ['python', 'nlp', 'pytorch', 'machine learning', 'deep learning', 'tensorflow', 'rest api', 'docker'],
    experience_level: 'Mid-Senior level',
    location: 'Ho Chi Minh City, Vietnam',
    salary_range: '$3,000 - $6,000',
  },
  {
    companyName: 'NashTech',
    title: 'Software Architect / Technical Lead',
    description: `NashTech is a global technology company delivering digital solutions to enterprises across Asia-Pacific and Europe. We are looking for a Software Architect / Tech Lead to guide engineering teams and define the technical direction for our client projects.

Responsibilities:
• Define and own the technical architecture for complex software systems
• Lead a team of 5-10 engineers in an Agile/Scrum environment
• Conduct architecture reviews, technology selection, and trade-off analysis
• Design microservices, event-driven systems, and distributed architectures
• Establish coding standards, CI/CD practices, and DevOps culture
• Mentor senior and mid-level engineers through technical challenges
• Collaborate with clients and product managers to translate requirements into architecture
• Drive cloud migration and modernization initiatives (monolith → microservices)
• Ensure non-functional requirements: scalability, reliability, security, and performance`,
    skills_desc: `Required:
- 7+ years software engineering, 2+ years architecture or tech lead role
- Deep expertise in at least one primary language: Java (Spring Boot), Go, or Python
- Microservices design patterns and distributed systems
- Cloud platforms: AWS, GCP, or Azure (architect-level knowledge)
- Containerization: Docker, Kubernetes, service mesh
- Event-driven architecture: Apache Kafka or AWS SNS/SQS
- API gateway patterns, API security (OAuth2, JWT)
- System design: CAP theorem, CQRS, Event Sourcing

Nice to have:
- AWS Solutions Architect Professional or Azure Solutions Architect certification
- Domain-Driven Design (DDD) methodology
- Site Reliability Engineering (SRE) practices
- GraphQL API design
- Experience leading teams across multiple time zones
- Contributing to open-source projects`,
    required_skills: ['java', 'microservices', 'aws', 'kubernetes', 'docker', 'system design', 'python', 'agile'],
    experience_level: 'Director',
    location: 'Hanoi, Vietnam',
    salary_range: '$4,000 - $8,000',
  },
];

async function resetJobs() {
  console.log('🔄 Đang reset dữ liệu jobs...\n');

  // 1. Xóa dữ liệu liên quan trước
  console.log('   🗑  Xóa recommendations cũ...');
  await db('recommendations').del();

  console.log('   🗑  Xóa bookmarks cũ...');
  await db('bookmarks').del();

  console.log('   🗑  Xóa tracking events cũ...');
  await db('user_tracking_events').del();

  console.log('   🗑  Xóa jobs cũ...');
  await db('jobs').del();

  // 2. Lấy danh sách công ty từ DB
  const companies = await db('companies').select('id', 'name', 'logo_url', 'website');
  const companyMap = {};
  companies.forEach(c => { companyMap[c.name.toLowerCase()] = c; });

  console.log(`\n✅ Tìm thấy ${companies.length} công ty trong DB`);

  // 3. Insert 10 IT jobs
  const jobsToInsert = [];

  for (const job of IT_JOBS) {
    // Tìm công ty phù hợp
    const company = companyMap[job.companyName.toLowerCase()];
    if (!company) {
      console.warn(`   ⚠️  Không tìm thấy công ty: "${job.companyName}" — bỏ qua`);
      continue;
    }

    const skillsArray = job.required_skills;
    const cleanedText = `${job.title} ${job.description} ${job.skills_desc}`
      .toLowerCase()
      .replace(/[^a-z0-9\s#+\-.]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 10000);

    jobsToInsert.push({
      title: job.title,
      description: job.description,
      skills_desc: job.skills_desc,
      required_skills: `{${skillsArray.join(',')}}`,
      experience_level: job.experience_level,
      location: job.location,
      salary_range: job.salary_range,
      company_id: company.id,
      company_name: company.name,
      job_url: company.website,
      is_active: true,
      indexed_in_pinecone: false,
      cleaned_text: cleanedText,
    });

    console.log(`   ➕ [${job.experience_level}] ${job.title} @ ${company.name}`);
  }

  if (jobsToInsert.length > 0) {
    await db('jobs').insert(jobsToInsert);
    console.log(`\n✅ Đã insert ${jobsToInsert.length}/10 vị trí IT thành công!`);
  }

  // Summary
  const total = await db('jobs').count('id as count').first();
  console.log(`\n📊 Tổng số jobs trong DB: ${total.count}`);
  console.log('\n💡 Gợi ý: Khởi động lại AI worker để reindex các jobs mới!');
  process.exit(0);
}

resetJobs().catch(err => {
  console.error('❌ Lỗi:', err.message);
  process.exit(1);
});
