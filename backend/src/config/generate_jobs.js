// ═══════════════════════════════════════════════════
// generate_jobs.js — Sinh jobs phù hợp cho từng công ty
// Usage: node src/config/generate_jobs.js
// ═══════════════════════════════════════════════════
require('dotenv').config({ path: require('path').join(__dirname, '../../../.env') });
const db = require('./database');

// ── Template builder ─────────────────────────────────
function job(title, desc, skills_desc, required_skills, experience_level, location, salary_range) {
  return { title, description: desc, skills_desc, required_skills, experience_level, location, salary_range };
}

// ═══════════════════════════════════════════════════
// JOB CATALOG — theo từng công ty
// Format: companyName → [jobs]
// ═══════════════════════════════════════════════════
const COMPANY_JOBS = {

  // ── FAANG & Big Tech ─────────────────────────────
  'Google': [
    job('Senior Software Engineer, Search Infrastructure',
      `Google Search serves billions of queries daily. You will work on the distributed systems that power Google Search's indexing, ranking, and serving infrastructure.\n\nResponsibilities:\n• Design and implement scalable distributed systems in C++ and Go\n• Optimize low-latency query serving pipelines handling millions of QPS\n• Collaborate with ML researchers to productionize ranking models\n• Drive technical design reviews and mentor engineers\n• Contribute to open-source projects (Abseil, gRPC, Bazel)`,
      `Required: C++17 or Go (5+ years), distributed systems (Borg/Kubernetes), MapReduce/Flume, strong algorithms & data structures (LeetCode Hard). Nice to have: search engine internals, ML model serving, protocol buffers.`,
      ['c++', 'go', 'distributed systems', 'algorithms', 'kubernetes', 'python', 'grpc'], 'Mid-Senior level', 'Remote / Vietnam', '$8,000 - $15,000'),

    job('Machine Learning Engineer, Google DeepMind',
      `Join DeepMind to build the next generation of AI systems. You will design and train large-scale neural networks and deploy them to production serving billions of users.\n\nResponsibilities:\n• Research and implement SOTA deep learning architectures (Transformers, Diffusion models)\n• Scale training to thousands of TPU/GPU chips using JAX and XLA\n• Build evaluation frameworks and safety testing for AI models\n• Collaborate with research scientists to reproduce and extend research papers\n• Productionize models for Google products (Search, Assistant, Cloud)`,
      `Required: PhD or 4+ years ML research/engineering, PyTorch or JAX, deep learning fundamentals (attention, optimization, regularization), strong Python. Nice to have: TPU programming, reinforcement learning, distributed training (FSDP/DeepSpeed), publications at NeurIPS/ICML/ICLR.`,
      ['python', 'machine learning', 'deep learning', 'pytorch', 'tensorflow', 'jax', 'algorithms'], 'Mid-Senior level', 'Hanoi, Vietnam', '$10,000 - $18,000'),

    job('Site Reliability Engineer, Google Cloud',
      `Ensure Google Cloud services maintain 99.99% uptime for millions of enterprise customers. You will bridge software engineering and operations to build reliable, scalable infrastructure.\n\nResponsibilities:\n• Define and track SLOs/SLAs for Google Cloud services\n• Build monitoring, alerting, and incident response systems\n• Automate toil through tooling and infrastructure improvements\n• Conduct post-mortems and drive blameless culture\n• Optimize capacity planning and cost efficiency`,
      `Required: 3+ years SRE/DevOps, Linux internals, Go or Python scripting, monitoring (Prometheus/Grafana), incident management. Nice to have: Kubernetes, Terraform, distributed systems debugging, chaos engineering.`,
      ['go', 'python', 'kubernetes', 'linux', 'monitoring', 'sre', 'terraform', 'devops'], 'Mid-Senior level', 'Ho Chi Minh City, Vietnam', '$7,000 - $12,000'),
  ],

  'Microsoft': [
    job('Principal Software Engineer, Azure Kubernetes Service',
      `Build the world's most widely used managed Kubernetes service. AKS runs critical workloads for Fortune 500 companies and startups alike. You will work on the control plane, networking stack, and storage integration.\n\nResponsibilities:\n• Design and implement features for Azure Kubernetes Service control plane\n• Build integrations with Azure networking (CNI plugins, Virtual Network)\n• Improve cluster autoscaler and node provisioning performance\n• Drive API design for new Kubernetes extensions\n• Work closely with upstream Kubernetes community (SIG membership)`,
      `Required: Go (4+ years), Kubernetes internals (etcd, API server, scheduler, controllers), cloud networking (TCP/IP, DNS, Load Balancing), distributed systems. Nice to have: Azure/AWS experience, Rust, eBPF, contribution to upstream Kubernetes.`,
      ['go', 'kubernetes', 'azure', 'linux', 'distributed systems', 'docker', 'python'], 'Mid-Senior level', 'Hanoi, Vietnam', '$7,000 - $14,000'),

    job('AI/ML Engineer, Copilot Team',
      `Microsoft Copilot is reshaping how people work. Join the team building the AI-powered assistant embedded across Word, Excel, Teams, and GitHub. You will work on RAG pipelines, LLM fine-tuning, and evaluation infrastructure.\n\nResponsibilities:\n• Build and optimize Retrieval-Augmented Generation (RAG) pipelines for enterprise data\n• Fine-tune LLMs (Phi-3, GPT-4) with RLHF and PEFT techniques\n• Design evaluation frameworks for response quality, factuality, and safety\n• Integrate Copilot features with Microsoft 365 APIs\n• A/B test model changes affecting millions of users`,
      `Required: Python (4+ years), LLM APIs (OpenAI/Azure OpenAI), RAG systems, Hugging Face ecosystem. Nice to have: LoRA/QLoRA fine-tuning, semantic search (vector DBs), TypeScript for API integration, Azure ML.`,
      ['python', 'machine learning', 'nlp', 'deep learning', 'pytorch', 'rest api', 'azure'], 'Mid-Senior level', 'Ho Chi Minh City, Vietnam', '$6,000 - $12,000'),

    job('Senior Frontend Engineer, Power Platform',
      `Microsoft Power Platform enables millions of citizen developers to build apps without code. You will build the visual designer experience using React and TypeScript that handles complex canvas interactions, drag-and-drop, and real-time collaboration.\n\nResponsibilities:\n• Build high-performance canvas designer with React 18 and TypeScript\n• Implement real-time collaborative editing (CRDTs, OT algorithms)\n• Optimize rendering performance for complex diagrams (10k+ nodes)\n• Build accessible UI components following WCAG 2.1 AA guidelines\n• Integrate with Power Automate and Dataverse backends`,
      `Required: React (4+ years), TypeScript, complex state management (Redux/Zustand), Canvas API or SVG manipulation, Web Workers, accessibility. Nice to have: CRDT/OT, WebAssembly, Monaco Editor internals, D3.js.`,
      ['react', 'typescript', 'javascript', 'html', 'css', 'redux', 'git'], 'Mid-Senior level', 'Hanoi, Vietnam', '$5,000 - $10,000'),
  ],

  'Amazon Web Services': [
    job('Software Development Engineer, AWS Lambda',
      `AWS Lambda is the world's leading serverless compute platform, executing trillions of function invocations per month. You will work on the virtualization layer, scheduling, and developer experience.\n\nResponsibilities:\n• Build and optimize Lambda's execution environment (Firecracker microVMs)\n• Improve cold start latency through SnapStart and layer caching innovations\n• Design APIs for Lambda extensions and custom runtimes\n• Build tooling for local Lambda simulation (SAM CLI)\n• Drive the Lambda public roadmap with product and customer feedback`,
      `Required: Java or Rust (4+ years), Linux kernel internals (namespaces, cgroups, seccomp), systems programming, AWS Lambda user experience. Nice to have: Firecracker/KVM, eBPF, ARM64 architecture, contributions to CNCF projects.`,
      ['java', 'rust', 'linux', 'aws', 'distributed systems', 'docker', 'python'], 'Mid-Senior level', 'Ho Chi Minh City, Vietnam', '$8,000 - $15,000'),

    job('Cloud Support Engineer, Enterprise',
      `Help AWS enterprise customers architect, migrate, and optimize their cloud infrastructure. You will be a trusted technical advisor solving complex issues across all 200+ AWS services.\n\nResponsibilities:\n• Troubleshoot complex multi-service AWS infrastructure issues\n• Write runbooks, troubleshooting guides, and architectural recommendations\n• Engage with AWS service teams to resolve bugs and feature gaps\n• Conduct architecture reviews for enterprise customer workloads\n• Build automation tools to improve support efficiency`,
      `Required: 3+ years AWS (EC2, VPC, RDS, S3, IAM, CloudFormation), Linux/Windows administration, networking (TCP/IP, BGP, DNS), scripting (Python/Bash). AWS certifications (Solutions Architect Professional or higher preferred).`,
      ['aws', 'linux', 'networking', 'python', 'docker', 'kubernetes', 'terraform'], 'Mid-Senior level', 'Hanoi, Vietnam', '$4,000 - $8,000'),
  ],

  'Meta': [
    job('Software Engineer, Ads Infrastructure',
      `Meta's advertising platform generates $130B+ revenue annually. You will build the real-time bidding, targeting, and delivery systems that serve personalized ads to 3 billion users.\n\nResponsibilities:\n• Design low-latency (p99 < 10ms) ad serving systems in C++ and Hack\n• Build real-time ML inference pipelines for ad ranking and personalization\n• Optimize bid landscape prediction models for auction efficiency\n• Scale distributed systems handling 10M+ RPS globally\n• A/B test algorithmic changes affecting advertiser ROI`,
      `Required: C++ or Java (4+ years), distributed systems, real-time data processing (Flink/Spark), strong algorithms. Nice to have: ML serving, online advertising systems, GraphQL, Rust.`,
      ['c++', 'java', 'distributed systems', 'machine learning', 'python', 'sql', 'algorithms'], 'Mid-Senior level', 'Ho Chi Minh City, Vietnam', '$9,000 - $16,000'),

    job('Research Engineer, FAIR (Fundamental AI Research)',
      `FAIR is Meta's open AI research lab, home to foundational work on LLaMA, DINO, and SAM. You will collaborate with world-class researchers to advance the state of AI through engineering excellence.\n\nResponsibilities:\n• Implement research ideas from papers into scalable PyTorch code\n• Build distributed training infrastructure for 100B+ parameter models\n• Create evaluation benchmarks for vision, language, and multimodal models\n• Open-source research code and collaborate with external community\n• Prototype novel neural architectures and optimization algorithms`,
      `Required: PyTorch (expert), distributed training (DDP/FSDP/DeepSpeed), strong ML fundamentals, Python. Preferred: PhD or publications at NeurIPS/ICML/CVPR/ICLR, GPU programming (CUDA/Triton), JAX.`,
      ['python', 'pytorch', 'machine learning', 'deep learning', 'distributed systems', 'linux', 'algorithms'], 'Mid-Senior level', 'Remote', '$10,000 - $18,000'),
  ],

  'Apple': [
    job('Software Engineer, Core ML Framework',
      `Core ML is the foundation for AI features across iPhone, iPad, Mac, Apple Watch, and Apple TV. You will build the framework that thousands of apps use to run machine learning models on-device.\n\nResponsibilities:\n• Develop Core ML's model compilation and optimization pipeline (MLIR, LLVM)\n• Build runtime execution engines for Apple Neural Engine, GPU, and CPU\n• Implement quantization, pruning, and compression for on-device ML\n• Design Swift and Objective-C APIs for easy ML model integration\n• Profile and optimize energy consumption for battery-sensitive workloads`,
      `Required: C++ (5+ years), compiler/runtime internals (LLVM, MLIR), ML model formats (ONNX, CoreML), performance optimization. Nice to have: Swift, Metal GPU programming, Apple Silicon architecture, RLHF/LLM optimization.`,
      ['c++', 'swift', 'machine learning', 'deep learning', 'python', 'algorithms', 'linux'], 'Mid-Senior level', 'Ho Chi Minh City, Vietnam', '$10,000 - $18,000'),

    job('iOS Software Engineer, Camera & Photos',
      `Apple's Camera app is used by hundreds of millions of people worldwide. You will build the real-time processing pipeline, computational photography features, and Photos library that define the iPhone experience.\n\nResponsibilities:\n• Implement real-time video processing pipelines using AVFoundation and Metal\n• Build computational photography features (Night Mode, Portrait, ProRAW)\n• Optimize image quality algorithms (denoising, HDR fusion, sharpening)\n• Design efficient photo library indexing and ML-based search\n• Write highly optimized Swift and C++ code for battery and thermal constraints`,
      `Required: Swift (5+ years), iOS platform depth (UIKit/SwiftUI, Core Data, GCD), image processing fundamentals, Metal GPU programming. Nice to have: computational photography, AVFoundation, computer vision, SIMD intrinsics.`,
      ['swift', 'ios', 'objective-c', 'xcode', 'algorithms', 'python', 'git'], 'Mid-Senior level', 'Hanoi, Vietnam', '$8,000 - $15,000'),
  ],

  'Nvidia': [
    job('CUDA Software Engineer, Deep Learning Frameworks',
      `NVIDIA powers the AI revolution. You will optimize deep learning kernels for H100/B200 GPUs used by every major AI lab in the world. Your work directly impacts the speed of AI research globally.\n\nResponsibilities:\n• Write and optimize CUDA/C++ kernels for matrix multiplication, attention, and convolution\n• Implement memory-efficient training techniques (gradient checkpointing, flash attention)\n• Build Triton and cuDNN integrations for PyTorch and JAX backends\n• Profile GPU kernel performance using Nsight Systems and Nsight Compute\n• Collaborate with DL framework teams (PyTorch, TensorFlow, JAX) on GPU backend`,
      `Required: CUDA C++ (3+ years), GPU architecture (memory hierarchy, warp execution), deep learning primitives, strong C++ skills. Nice to have: Triton, TensorRT, cuDNN, NCCL, NVLink, GEMM optimization.`,
      ['c++', 'python', 'cuda', 'deep learning', 'machine learning', 'pytorch', 'algorithms'], 'Mid-Senior level', 'Ho Chi Minh City, Vietnam', '$9,000 - $16,000'),

    job('Senior AI Infrastructure Engineer',
      `Build the infrastructure that trains the world's most powerful AI models. You will work on distributed training orchestration, network optimization, and storage systems for large-scale GPU clusters.\n\nResponsibilities:\n• Design and operate GPU supercomputing clusters (thousands of H100s)\n• Optimize collective communication (NCCL, UCX) for all-reduce and pipeline parallelism\n• Build fault-tolerant training orchestration for long-running LLM training jobs\n• Implement high-performance storage systems for checkpointing and dataset loading\n• Monitor cluster health with custom observability tools`,
      `Required: Linux systems programming, InfiniBand/RDMA networking, Python, distributed systems. Nice to have: Kubernetes (GPU scheduling), Lustre/GPFS, SLURM, experience with 1000+ GPU clusters.`,
      ['python', 'linux', 'kubernetes', 'distributed systems', 'docker', 'networking', 'devops'], 'Mid-Senior level', 'Hanoi, Vietnam', '$8,000 - $14,000'),
  ],

  // ── Fintech & Payments ───────────────────────────
  'Stripe': [
    job('Software Engineer, Payments Infrastructure',
      `Stripe processes hundreds of billions of dollars in payments annually. You will build the core payments infrastructure that millions of businesses rely on to accept money globally.\n\nResponsibilities:\n• Design fault-tolerant payment processing pipelines with exactly-once semantics\n• Build bank and card network integrations (Visa, Mastercard, SWIFT, ACH)\n• Implement anti-fraud systems and risk scoring in real-time\n• Ensure PCI DSS compliance across payment data flows\n• Improve payment authorization rates through intelligent retry logic`,
      `Required: Ruby, Go, or Java (4+ years), distributed systems, strong understanding of financial systems (idempotency, eventual consistency), SQL. Nice to have: payment rails (card processing, ACH, SEPA), cryptography, PCI DSS experience.`,
      ['ruby', 'go', 'java', 'distributed systems', 'postgresql', 'rest api', 'redis'], 'Mid-Senior level', 'Ho Chi Minh City, Vietnam', '$7,000 - $13,000'),

    job('Data Engineer, Financial Intelligence',
      `Stripe's data platform processes petabytes of financial transaction data. You will build the pipelines, models, and dashboards that help businesses understand their payments and detect fraud.\n\nResponsibilities:\n• Build real-time streaming pipelines for financial transaction data (Kafka, Flink)\n• Design dimensional data models for financial reporting and analytics\n• Create ML feature pipelines for fraud detection and risk scoring\n• Build self-serve analytics infrastructure for product and finance teams\n• Ensure data quality, governance, and PCI compliance`,
      `Required: Python or Scala, Apache Spark/Flink, SQL (complex queries), data warehousing (dbt, Airflow). Nice to have: Kafka, Trino, financial data modeling, streaming ML, data governance frameworks.`,
      ['python', 'sql', 'spark', 'kafka', 'airflow', 'dbt', 'postgresql'], 'Mid-Senior level', 'Ho Chi Minh City, Vietnam', '$5,000 - $9,000'),
  ],

  'Momo': [
    job('Senior Backend Engineer (Go/Java)',
      `MoMo là ví điện tử số 1 Việt Nam với 30+ triệu người dùng. Bạn sẽ xây dựng core backend cho hệ thống thanh toán xử lý hàng triệu giao dịch mỗi ngày.\n\nTrách nhiệm:\n• Thiết kế và xây dựng microservices xử lý giao dịch thanh toán real-time\n• Tích hợp với ngân hàng, ví điện tử, và hệ thống thẻ (Visa/Mastercard)\n• Xây dựng hệ thống anti-fraud và phát hiện giao dịch bất thường\n• Đảm bảo tính nhất quán dữ liệu trong môi trường phân tán\n• Tối ưu hiệu suất hệ thống đạt throughput 100,000 TPS`,
      `Bắt buộc: Go hoặc Java (Spring Boot) 3+ năm, PostgreSQL/MySQL, Redis, thiết kế microservices, REST API. Ưu tiên: Kafka, Kubernetes, kinh nghiệm fintech/payment, idempotency patterns, circuit breaker.`,
      ['go', 'java', 'postgresql', 'redis', 'kafka', 'microservices', 'docker', 'kubernetes'], 'Mid-Senior level', 'Ho Chi Minh City, Vietnam', '$2,500 - $5,000'),

    job('Mobile Engineer (React Native)',
      `Xây dựng ứng dụng MoMo được 30 triệu người dùng tin dùng hằng ngày. Bạn sẽ phát triển tính năng mới cho iOS và Android, tập trung vào trải nghiệm thanh toán mượt mà và bảo mật.\n\nTrách nhiệm:\n• Phát triển tính năng mới cho ứng dụng MoMo (React Native)\n• Tích hợp thanh toán sinh trắc học (Face ID, vân tay)\n• Tối ưu hiệu suất app: thời gian khởi động, memory, frame rate\n• Triển khai A/B testing và feature flags để thử nghiệm tính năng\n• Đảm bảo bảo mật dữ liệu người dùng theo tiêu chuẩn PCI DSS`,
      `Bắt buộc: React Native 2+ năm, TypeScript, kiến thức iOS/Android native, Redux/MobX. Ưu tiên: React Native New Architecture, biometric authentication, deep linking, Fastlane CI/CD.`,
      ['react native', 'typescript', 'javascript', 'ios', 'android', 'redux', 'rest api'], 'Associate', 'Ho Chi Minh City, Vietnam', '$1,500 - $3,000'),

    job('Data Scientist - Fraud Detection',
      `Bảo vệ 30 triệu người dùng MoMo khỏi gian lận tài chính. Bạn sẽ xây dựng các mô hình ML phát hiện giao dịch bất thường trong thời gian thực.\n\nTrách nhiệm:\n• Xây dựng mô hình phát hiện gian lận real-time (latency < 50ms)\n• Phân tích hành vi người dùng để xác định anomaly\n• Xây dựng feature engineering pipeline từ dữ liệu giao dịch\n• Triển khai mô hình lên production và giám sát drift\n• Cộng tác với team Risk để định nghĩa business rules`,
      `Bắt buộc: Python, Scikit-learn/XGBoost/LightGBM, SQL, thống kê. Ưu tiên: streaming ML (Flink), graph neural networks cho fraud detection, Kafka, kinh nghiệm fintech.`,
      ['python', 'machine learning', 'sql', 'pandas', 'numpy', 'spark', 'kafka'], 'Mid-Senior level', 'Ho Chi Minh City, Vietnam', '$2,000 - $4,000'),
  ],

  'ZaloPay': [
    job('Backend Engineer (Payment Systems)',
      `ZaloPay là ví điện tử của VNG, tích hợp với Zalo - mạng xã hội 70 triệu người dùng. Bạn sẽ xây dựng hệ thống thanh toán scale cao phục vụ hàng triệu giao dịch.\n\nTrách nhiệm:\n• Phát triển và bảo trì hệ thống core payment processing\n• Tích hợp Zalo social graph vào tính năng chuyển tiền P2P\n• Xây dựng API cho đối tác merchant và cổng thanh toán\n• Đảm bảo high availability (99.99% uptime) cho hệ thống thanh toán`,
      `Bắt buộc: Java/Go, Spring Boot, microservices, PostgreSQL, Redis. Ưu tiên: Kafka, hệ thống thanh toán ngân hàng, kinh nghiệm scale cao.`,
      ['java', 'go', 'spring boot', 'postgresql', 'redis', 'kafka', 'docker'], 'Mid-Senior level', 'Ho Chi Minh City, Vietnam', '$2,000 - $4,500'),

    job('Security Engineer - AppSec',
      `Bảo vệ hệ thống ZaloPay và dữ liệu tài chính của người dùng. Bạn sẽ thực hiện security review, penetration testing và xây dựng quy trình DevSecOps.\n\nTrách nhiệm:\n• Thực hiện penetration testing cho mobile app và web API\n• Review code bảo mật và tích hợp SAST/DAST vào CI/CD\n• Phản ứng sự cố bảo mật và điều tra forensics\n• Xây dựng security awareness training cho developer\n• Đảm bảo tuân thủ PCI DSS và tiêu chuẩn bảo mật NHNN`,
      `Bắt buộc: Kiến thức OWASP Top 10, penetration testing, Burp Suite, Python scripting, Android/iOS security. Ưu tiên: CEH/OSCP, kinh nghiệm fintech security, reverse engineering mobile app.`,
      ['python', 'cybersecurity', 'penetration testing', 'linux', 'networking', 'rest api'], 'Mid-Senior level', 'Ho Chi Minh City, Vietnam', '$2,500 - $5,000'),
  ],

  'VNPay': [
    job('Backend Developer - Payment Gateway',
      `VNPAY là cổng thanh toán trực tuyến lớn nhất Việt Nam, xử lý thanh toán cho hàng nghìn merchant và ngân hàng. Bạn sẽ xây dựng và tối ưu hóa cổng thanh toán.\n\nTrách nhiệm:\n• Phát triển API tích hợp thanh toán cho merchant và ngân hàng đối tác\n• Xây dựng module xử lý giao dịch đảm bảo tính nhất quán và an toàn\n• Tối ưu hiệu suất hệ thống, giảm latency giao dịch xuống < 200ms\n• Hỗ trợ kỹ thuật tích hợp cho đối tác merchant`,
      `Bắt buộc: Java/Spring Boot hoặc Node.js, RESTful API, MySQL/PostgreSQL, kiến thức cơ bản về payment. Ưu tiên: kinh nghiệm tích hợp ngân hàng, QR code payment, mã hóa RSA/AES.`,
      ['java', 'spring boot', 'node.js', 'postgresql', 'rest api', 'redis', 'docker'], 'Associate', 'Hanoi, Vietnam', '$1,200 - $2,800'),
  ],

  'Viettel Digital': [
    job('Cloud Solutions Architect',
      `Viettel Digital xây dựng hệ sinh thái cloud và digital services cho doanh nghiệp và chính phủ Việt Nam. Bạn sẽ thiết kế kiến trúc cloud cho các dự án quy mô lớn.\n\nTrách nhiệm:\n• Thiết kế kiến trúc cloud hybrid (Viettel Cloud + AWS/Azure) cho doanh nghiệp\n• Tư vấn cloud migration cho hệ thống chính phủ và doanh nghiệp nhà nước\n• Xây dựng reference architectures cho các ngành: tài chính, y tế, giáo dục\n• Đánh giá và lựa chọn công nghệ phù hợp với yêu cầu bảo mật và chủ quyền dữ liệu`,
      `Bắt buộc: 5+ năm kinh nghiệm cloud (AWS/Azure/GCP), kiến trúc hệ thống, networking, security. Ưu tiên: chứng chỉ cloud architect, kinh nghiệm chính phủ/doanh nghiệp nhà nước, Kubernetes.`,
      ['aws', 'azure', 'kubernetes', 'docker', 'terraform', 'networking', 'linux', 'devops'], 'Director', 'Hanoi, Vietnam', '$3,000 - $6,000'),

    job('5G Network Software Engineer',
      `Viettel là nhà mạng dẫn đầu về 5G tại Việt Nam và Đông Nam Á. Bạn sẽ phát triển phần mềm cho hạ tầng 5G Core Network và Network Slicing.\n\nTrách nhiệm:\n• Phát triển phần mềm cho 5G Core Network (AMF, SMF, UPF) theo chuẩn 3GPP\n• Triển khai Network Function Virtualization (NFV) trên nền tảng OpenStack/Kubernetes\n• Xây dựng API management cho Network as a Service (NaaS)\n• Tối ưu hiệu suất User Plane Function (UPF) xử lý data plane tốc độ cao`,
      `Bắt buộc: C/C++ hoặc Go, networking (TCP/IP, UDP, GTP), Linux kernel, DPDK hoặc eBPF. Ưu tiên: 3GPP standards, OpenStack, Docker/Kubernetes, kinh nghiệm telecom.`,
      ['c++', 'go', 'linux', 'networking', 'docker', 'kubernetes', 'python'], 'Mid-Senior level', 'Hanoi, Vietnam', '$2,000 - $4,500'),
  ],

  // ── Ride-hailing & Delivery ──────────────────────
  'Grab Vietnam': [
    job('Staff Engineer, Maps & Routing Platform',
      `Grab's mapping platform powers millions of rides and deliveries across Southeast Asia every day. You will work on real-time routing, ETA prediction, and geospatial data infrastructure.\n\nResponsibilities:\n• Design routing algorithms (A*, Dijkstra, contraction hierarchies) for real-time optimization\n• Build geospatial data pipelines processing OpenStreetMap and sensor data\n• Implement ETA prediction models combining routing and ML signals\n• Scale the routing platform to handle 100k+ requests per second\n• Lead technical design and mentor senior engineers`,
      `Required: Go or Java (5+ years), geospatial algorithms, distributed systems, real-time data processing. Nice to have: OpenStreetMap, PostGIS, OSRM, ML for time-series prediction, graph algorithms.`,
      ['go', 'java', 'python', 'postgresql', 'algorithms', 'distributed systems', 'machine learning'], 'Mid-Senior level', 'Ho Chi Minh City, Vietnam', '$5,000 - $9,000'),

    job('Data Engineer, Pricing & Incentives',
      `Build the data infrastructure that powers dynamic pricing for millions of Grab rides and deliveries. Your work directly impacts driver earnings and passenger affordability across 8 countries.\n\nResponsibilities:\n• Build real-time streaming pipelines for pricing signal aggregation (Kafka/Flink)\n• Design feature stores for dynamic pricing ML models\n• Create data products for driver incentive optimization\n• Build self-serve analytics for pricing strategy teams\n• Ensure data quality and lineage across the pricing data ecosystem`,
      `Required: Python or Scala, Apache Spark/Flink, SQL, Airflow, data warehouse (Hive/Presto). Nice to have: real-time ML feature serving, Kafka, Trino, experience with pricing/economics data.`,
      ['python', 'spark', 'kafka', 'sql', 'airflow', 'postgresql', 'machine learning'], 'Mid-Senior level', 'Ho Chi Minh City, Vietnam', '$4,000 - $7,000'),
  ],

  'Gojek': [
    job('Backend Engineer, GoFood Platform',
      `GoFood serves millions of food orders daily across Indonesia and Southeast Asia. You will build the merchant platform, menu management, and order fulfillment systems.\n\nResponsibilities:\n• Build scalable APIs for merchant onboarding, menu management, and order processing\n• Design and implement real-time order matching between users, merchants, and drivers\n• Build notification systems for order status updates\n• Improve restaurant discovery through personalization signals\n• Optimize food delivery ETA models`,
      `Required: Go or Java, microservices, PostgreSQL, Redis, Kafka. Nice to have: gRPC, real-time systems, geospatial queries, Kubernetes deployment.`,
      ['go', 'java', 'postgresql', 'redis', 'kafka', 'docker', 'kubernetes', 'rest api'], 'Mid-Senior level', 'Ho Chi Minh City, Vietnam', '$3,000 - $6,000'),

    job('Android Engineer, Super App',
      `Build the Gojek super app experience for millions of users across Southeast Asia. You will work on performance, modularization, and new features for GoRide, GoFood, and GoPay.\n\nResponsibilities:\n• Develop Android features using Kotlin and Jetpack Compose\n• Implement dynamic feature modules to reduce APK size and improve load time\n• Build payment flows with strong security (root detection, certificate pinning)\n• Optimize app startup time and memory consumption\n• Contribute to Gojek's open-source Android libraries`,
      `Required: Kotlin (3+ years), Android SDK, Jetpack (Compose, Room, Navigation, WorkManager), MVVM. Nice to have: Android modularization, eBPF profiling, payment SDK integration, Dagger/Hilt.`,
      ['kotlin', 'android', 'java', 'react native', 'rest api', 'git', 'agile'], 'Mid-Senior level', 'Ho Chi Minh City, Vietnam', '$3,000 - $5,500'),
  ],

  'Be Group': [
    job('Backend Engineer (Node.js/Go)',
      `be là ứng dụng gọi xe Việt Nam phát triển nhanh nhất. Bạn sẽ xây dựng platform công nghệ phục vụ hàng triệu chuyến đi và giao hàng mỗi ngày.\n\nTrách nhiệm:\n• Phát triển microservices cho hệ thống đặt xe, matching tài xế, và định giá\n• Xây dựng real-time notification system cho driver và passenger\n• Tích hợp hệ thống thanh toán (beFinancial) vào ride-hailing platform\n• Tối ưu thuật toán matching tài xế-hành khách`,
      `Bắt buộc: Node.js hoặc Go, PostgreSQL, Redis, REST API. Ưu tiên: Kafka, microservices, real-time systems, kinh nghiệm ride-hailing.`,
      ['node.js', 'go', 'postgresql', 'redis', 'rest api', 'docker', 'microservices'], 'Associate', 'Ho Chi Minh City, Vietnam', '$1,500 - $3,500'),
  ],

  'AhaMove': [
    job('Software Engineer - Logistics Platform',
      `AhaMove là nền tảng giao hàng theo yêu cầu hàng đầu Việt Nam. Bạn sẽ xây dựng hệ thống điều phối đơn hàng và tối ưu hóa lộ trình giao hàng.\n\nTrách nhiệm:\n• Phát triển hệ thống route optimization cho đội shipper\n• Xây dựng APIs cho đối tác tích hợp (merchant, sàn TMĐT)\n• Cải thiện thuật toán phân công đơn hàng cho shipper gần nhất\n• Xây dựng dashboard theo dõi đơn hàng real-time cho merchant`,
      `Bắt buộc: Node.js hoặc Python, PostgreSQL với PostGIS, Redis, REST API. Ưu tiên: geospatial algorithms, routing optimization, Kafka.`,
      ['node.js', 'python', 'postgresql', 'redis', 'rest api', 'algorithms', 'docker'], 'Associate', 'Ho Chi Minh City, Vietnam', '$1,200 - $2,800'),
  ],

  'Giao Hàng Tiết Kiệm': [
    job('Backend Engineer - Warehouse Management',
      `GHTK xử lý hàng triệu đơn hàng mỗi ngày với mạng lưới 1,800+ điểm bưu cục. Bạn sẽ xây dựng hệ thống quản lý kho và vận chuyển quy mô lớn.\n\nTrách nhiệm:\n• Phát triển hệ thống Warehouse Management System (WMS)\n• Xây dựng tracking system theo dõi đơn hàng real-time\n• Tối ưu thuật toán phân loại và điều phối đơn hàng\n• Tích hợp API với các sàn thương mại điện tử (Shopee, Tiki, Lazada)`,
      `Bắt buộc: Java/Spring Boot hoặc Node.js, MySQL/PostgreSQL, Redis. Ưu tiên: Kafka, logistics domain knowledge, barcode/RFID systems.`,
      ['java', 'spring boot', 'postgresql', 'redis', 'rest api', 'docker', 'microservices'], 'Associate', 'Hanoi, Vietnam', '$1,200 - $2,500'),
  ],

  // ── E-commerce ───────────────────────────────────
  'Shopee Vietnam': [
    job('Backend Engineer, Search & Discovery',
      `Shopee's search engine processes hundreds of millions of queries daily. You will build the indexing, ranking, and personalization systems that help 300M+ users find products.\n\nResponsibilities:\n• Build distributed search index using Elasticsearch and custom solutions\n• Implement query understanding (spelling correction, semantic expansion) with NLP\n• Design learning-to-rank systems for product relevance\n• Build A/B testing infrastructure for search ranking experiments\n• Scale the search serving layer to handle traffic spikes during 11.11`,
      `Required: Java or Go (3+ years), Elasticsearch, distributed systems, SQL. Nice to have: NLP for e-commerce (BERT product embeddings), Kafka, Redis, LTR (Learning to Rank).`,
      ['java', 'go', 'elasticsearch', 'postgresql', 'redis', 'machine learning', 'kafka', 'docker'], 'Mid-Senior level', 'Ho Chi Minh City, Vietnam', '$3,000 - $6,000'),

    job('Machine Learning Engineer, Recommendation System',
      `Build recommendation systems that help 300M shoppers discover products they love. Your models run on millions of daily active users and directly impact Shopee's GMV.\n\nResponsibilities:\n• Design and train collaborative filtering and two-tower recommendation models\n• Build real-time feature stores for personalization signals\n• Implement HNSW-based approximate nearest neighbor for product retrieval\n• A/B test recommendation algorithms at massive scale\n• Build multi-objective ranking (CTR, CVR, GMV) with multi-task learning`,
      `Required: Python, PyTorch/TensorFlow, recommender systems fundamentals, SQL. Nice to have: two-tower models, FAISS/HNSW, real-time feature serving, Spark, large-scale distributed training.`,
      ['python', 'machine learning', 'deep learning', 'pytorch', 'sql', 'spark', 'redis'], 'Mid-Senior level', 'Ho Chi Minh City, Vietnam', '$3,500 - $7,000'),
  ],

  'Tiki': [
    job('Platform Engineer - Developer Experience',
      `Tiki's engineering team ships features to millions of customers weekly. You will build the internal developer platform that makes Tiki's 500+ engineers more productive.\n\nResponsibilities:\n• Build and maintain Tiki's internal Kubernetes platform and developer tooling\n• Implement GitOps workflows with ArgoCD for deployment automation\n• Build service mesh and observability stack (Istio, Prometheus, Grafana, Jaeger)\n• Reduce deployment lead time from hours to minutes\n• Build internal developer portal (Backstage) for service catalog`,
      `Required: Kubernetes (admin-level), Go or Python, Helm, CI/CD. Nice to have: ArgoCD, Istio, Backstage, infrastructure-as-code (Terraform/Pulumi), platform engineering experience.`,
      ['kubernetes', 'go', 'python', 'terraform', 'docker', 'ci/cd', 'linux', 'devops'], 'Mid-Senior level', 'Ho Chi Minh City, Vietnam', '$2,500 - $5,000'),

    job('Data Analyst, Growth Analytics',
      `Use data to drive Tiki's growth strategy. You will analyze user behavior, marketing campaigns, and product metrics to help Tiki compete with Shopee and Lazada.\n\nResponsibilities:\n• Build dashboards for DAU/MAU, conversion funnel, and cohort retention analysis\n• Design and analyze A/B experiments for product and marketing features\n• Create attribution models for marketing spend optimization\n• Build forecasting models for inventory and demand planning\n• Present insights to C-suite and product leadership`,
      `Bắt buộc: SQL (advanced), Python (Pandas/visualization), Tableau/Power BI/Looker, thống kê thực nghiệm (A/B testing). Ưu tiên: dbt, Airflow, e-commerce analytics, growth hacking.`,
      ['sql', 'python', 'pandas', 'machine learning', 'tableau', 'postgresql', 'git'], 'Associate', 'Ho Chi Minh City, Vietnam', '$1,500 - $3,000'),
  ],

  'Lazada': [
    job('Software Engineer, Logistics Technology',
      `Lazada là nền tảng TMĐT của Alibaba tại Đông Nam Á. Bạn sẽ xây dựng hệ thống công nghệ logistics quản lý hàng triệu đơn hàng mỗi ngày.\n\nTrách nhiệm:\n• Phát triển hệ thống Order Management System (OMS) và Warehouse Management System\n• Xây dựng integrations với carrier partners (J&T, GHTK, BEST Express)\n• Tối ưu thuật toán fulfillment và route planning\n• Build real-time tracking APIs cho merchant và buyer`,
      `Bắt buộc: Java/Spring Boot hoặc Go, MySQL, Redis, REST API, microservices. Ưu tiên: Alibaba tech stack (RocketMQ, Dubbo), logistics domain, Kafka.`,
      ['java', 'go', 'spring boot', 'mysql', 'redis', 'kafka', 'docker', 'microservices'], 'Mid-Senior level', 'Ho Chi Minh City, Vietnam', '$2,500 - $5,000'),
  ],

  'Sendo': [
    job('Full Stack Developer (Node.js + React)',
      `Sendo là sàn TMĐT Việt Nam kết nối người mua và người bán trên toàn quốc. Bạn sẽ phát triển các tính năng cho nền tảng web và mobile.\n\nTrách nhiệm:\n• Phát triển backend APIs với Node.js và frontend với React\n• Tích hợp hệ thống thanh toán và tính năng flash sale\n• Tối ưu hiệu suất trang web và cải thiện Core Web Vitals\n• Xây dựng seller dashboard và công cụ quản lý sản phẩm`,
      `Bắt buộc: Node.js, React, PostgreSQL, Redis. Ưu tiên: Next.js, TypeScript, Elasticsearch, kinh nghiệm TMĐT.`,
      ['node.js', 'react', 'typescript', 'postgresql', 'redis', 'rest api', 'docker'], 'Associate', 'Ho Chi Minh City, Vietnam', '$1,200 - $2,500'),
  ],

  'Haravan': [
    job('Backend Engineer - Commerce Platform',
      `Haravan là nền tảng TMĐT và omnichannel cho hàng nghìn doanh nghiệp Việt Nam. Bạn sẽ xây dựng core commerce APIs: sản phẩm, đơn hàng, kho hàng, và thanh toán.\n\nTrách nhiệm:\n• Phát triển API platform cho merchant: quản lý sản phẩm, đơn hàng, kho hàng\n• Tích hợp marketplace (Shopee, Lazada, TikTok Shop) qua unified API\n• Xây dựng hệ thống đồng bộ tồn kho real-time\n• Phát triển webhook system để merchant nhận event tự động`,
      `Bắt buộc: Ruby on Rails hoặc Node.js, PostgreSQL, Redis, REST API. Ưu tiên: Shopify APIs, marketplace integrations, event-driven architecture, Sidekiq.`,
      ['ruby', 'node.js', 'postgresql', 'redis', 'rest api', 'docker', 'git'], 'Associate', 'Ho Chi Minh City, Vietnam', '$1,200 - $2,800'),
  ],

  // ── Developer Tools & Infrastructure ────────────
  'Atlassian': [
    job('Senior Software Engineer, Jira Platform',
      `Atlassian's Jira is used by 100,000+ companies to manage software development. You will work on the core Jira platform including the issue tracker, workflow engine, and project configuration.\n\nResponsibilities:\n• Design and build Jira's extensible workflow engine supporting custom workflows\n• Improve issue search with Elasticsearch-powered JQL (Jira Query Language)\n• Build team permissions and enterprise security features (SCIM, SSO, audit logs)\n• Migrate Jira from monolith to microservices architecture on AWS\n• Mentor engineers and drive technical direction for the Jira core team`,
      `Required: Java (5+ years), Spring Framework, Elasticsearch, PostgreSQL, AWS. Nice to have: Forge (Atlassian developer platform), Kotlin, React for admin UI, distributed systems, OpenSearch.`,
      ['java', 'spring boot', 'elasticsearch', 'postgresql', 'aws', 'docker', 'kubernetes'], 'Mid-Senior level', 'Ho Chi Minh City, Vietnam', '$5,000 - $9,000'),

    job('Frontend Engineer, Confluence',
      `Confluence is Atlassian's team knowledge platform used by millions. You will build the rich text editor, page templates, and collaboration features that teams use to document their work.\n\nResponsibilities:\n• Build collaborative rich text editing with ProseMirror or TipTap\n• Implement real-time presence and co-editing (WebSocket, CRDT)\n• Create drag-and-drop page layout builder\n• Build macro/extension framework for third-party content\n• Optimize editor performance for documents with thousands of elements`,
      `Required: React (4+ years), TypeScript, rich text editors (ProseMirror/Slate), WebSockets. Nice to have: CRDT algorithms (Yjs, Automerge), Forge framework, CSS-in-JS, accessibility (ARIA).`,
      ['react', 'typescript', 'javascript', 'html', 'css', 'graphql', 'git', 'rest api'], 'Mid-Senior level', 'Hanoi, Vietnam', '$4,500 - $8,000'),
  ],

  'GitLab': [
    job('Backend Engineer, CI/CD Platform',
      `GitLab CI/CD is used by millions of developers for automated pipelines. You will work on the pipeline execution engine, runner infrastructure, and pipeline configuration features.\n\nResponsibilities:\n• Build and improve GitLab CI/CD pipeline execution engine (Ruby on Rails + Go)\n• Develop GitLab Runner for executing jobs on Kubernetes, Docker, and shell\n• Implement pipeline security features (protected environments, secrets management)\n• Build Auto DevOps for zero-configuration deployments\n• Contribute to GitLab's open-source codebase with community engagement`,
      `Required: Ruby on Rails (3+ years) or Go, PostgreSQL, Redis, Sidekiq, GitLab CI usage experience. Nice to have: Kubernetes, Docker, GitOps (Flux/ArgoCD), SAST/DAST integration.`,
      ['ruby', 'go', 'postgresql', 'redis', 'kubernetes', 'docker', 'ci/cd', 'git'], 'Mid-Senior level', 'Remote (Vietnam)', '$5,000 - $9,000'),

    job('Security Engineer, Product Security',
      `Help GitLab secure the platform used by millions of developers to store their code. You will perform security research, implement security features, and drive the responsible disclosure program.\n\nResponsibilities:\n• Conduct application security reviews for GitLab features (SAST, DAST, dependency scanning)\n• Manage GitLab's HackerOne bug bounty program and triage reports\n• Build security scanning features into the GitLab platform\n• Develop secure coding guidelines and conduct security training\n• Research and remediate vulnerabilities in GitLab's own supply chain`,
      `Required: Application security expertise, penetration testing, Ruby or Python scripting, OWASP knowledge. Nice to have: bug bounty experience, SAST/DAST tools, supply chain security, DevSecOps.`,
      ['python', 'ruby', 'cybersecurity', 'penetration testing', 'linux', 'git', 'docker'], 'Mid-Senior level', 'Remote (Vietnam)', '$5,500 - $9,500'),
  ],

  'GitHub': [
    job('Software Engineer, GitHub Actions',
      `GitHub Actions is used by 15 million+ developers for CI/CD automation. You will build the workflow runtime, action marketplace, and self-hosted runner infrastructure.\n\nResponsibilities:\n• Build and maintain GitHub Actions workflow runtime (TypeScript/Go)\n• Develop the Actions marketplace and action security scanning\n• Build self-hosted runner management for enterprise customers\n• Implement workflow concurrency, caching, and artifact storage at scale\n• Build GitHub Actions extensions for Copilot integration`,
      `Required: TypeScript or Go (3+ years), GitHub Actions user experience, distributed systems, REST APIs. Nice to have: Kubernetes for runner management, security scanning, GitHub API, open-source contribution.`,
      ['typescript', 'go', 'node.js', 'kubernetes', 'docker', 'rest api', 'git', 'ci/cd'], 'Mid-Senior level', 'Remote (Vietnam)', '$6,000 - $10,000'),

    job('Senior Product Designer, Developer Experience',
      `Shape the future of how millions of developers experience GitHub. You will design features for code review, GitHub Copilot, and the next generation of AI-powered development tools.\n\nResponsibilities:\n• Design end-to-end user experiences for code review, PR workflows, and Copilot\n• Conduct user research with developers ranging from students to staff engineers\n• Create high-fidelity prototypes in Figma and test with real users\n• Collaborate with PM, engineering, and data to ship features\n• Define and evolve GitHub's design system (Primer)`,
      `Required: 5+ years product design, Figma expert, user research methods, understanding of developer workflows (Git, code review). Nice to have: developer background, motion design, accessibility (WCAG), design systems.`,
      ['figma', 'design systems', 'user research', 'prototyping', 'javascript', 'html', 'css'], 'Mid-Senior level', 'Remote (Vietnam)', '$5,000 - $9,000'),
  ],

  'Cloudflare': [
    job('Network Engineer, Edge Infrastructure',
      `Cloudflare operates one of the world\'s largest networks with 300+ PoPs globally. You will work on the network routing, peering, and performance optimization that makes the Internet faster and safer.\n\nResponsibilities:\n• Configure and optimize BGP routing across 300+ PoP locations\n• Design and implement Anycast network architecture for DDoS mitigation\n• Build network automation tools for configuration management at scale\n• Analyze traffic patterns and optimize peering relationships with ISPs\n• Respond to network incidents and DDoS attacks in real-time`,
      `Required: BGP, OSPF, networking fundamentals (TCP/IP, DNS, TLS), Linux networking (iptables, XDP, eBPF), Python automation. Nice to have: RPKI, Anycast, IXP peering, large-scale DDoS mitigation.`,
      ['networking', 'linux', 'python', 'devops', 'cybersecurity', 'go', 'algorithms'], 'Mid-Senior level', 'Ho Chi Minh City, Vietnam', '$5,000 - $9,000'),

    job('Software Engineer, Workers (Serverless Edge)',
      `Cloudflare Workers runs JavaScript/Wasm at the edge in 300+ locations. You will build the V8 runtime isolation, developer APIs, and tooling that makes Workers the best serverless platform.\n\nResponsibilities:\n• Develop Cloudflare Workers runtime based on V8 (Rust + C++)\n• Build developer-facing APIs: KV, Durable Objects, R2, AI Gateway\n• Implement security isolation between tenant Workers sandboxes\n• Build Wrangler CLI tooling for local development and deployment\n• Optimize cold start performance and memory consumption`,
      `Required: Rust or C++ (3+ years), JavaScript/V8 internals, systems programming, WebAssembly. Nice to have: V8 embedding, V8 isolates, Service Worker API, Cloudflare Workers development experience.`,
      ['rust', 'c++', 'javascript', 'python', 'linux', 'distributed systems', 'rest api'], 'Mid-Senior level', 'Ho Chi Minh City, Vietnam', '$6,000 - $10,000'),
  ],

  'Palo Alto Networks': [
    job('Software Engineer, Cortex XDR',
      `Palo Alto Networks protects 80,000+ organizations with AI-powered cybersecurity. You will build Cortex XDR — the industry's leading extended detection and response platform.\n\nResponsibilities:\n• Build endpoint detection capabilities for Windows, macOS, and Linux agents (C++)\n• Develop threat analytics using behavioral analysis and ML models\n• Implement real-time alert correlation across endpoints, network, and cloud\n• Build integrations with SIEM platforms and security orchestration tools\n• Design scalable data ingestion for petabyte-scale security telemetry`,
      `Required: C++ or Python (4+ years), cybersecurity concepts (MITRE ATT&CK, malware analysis), Windows/Linux internals, data processing at scale. Nice to have: EDR/XDR internals, malware reverse engineering, YARA rules, ML for security anomaly detection.`,
      ['python', 'c++', 'cybersecurity', 'machine learning', 'linux', 'distributed systems', 'sql'], 'Mid-Senior level', 'Ho Chi Minh City, Vietnam', '$6,000 - $11,000'),

    job('Cloud Security Engineer, SASE Platform',
      `Palo Alto\'s SASE (Secure Access Service Edge) platform protects cloud-first enterprises. You will build the Zero Trust Network Access (ZTNA) and Cloud SWG components.\n\nResponsibilities:\n• Build Zero Trust access control policies for cloud application access\n• Implement SSL inspection and threat prevention at cloud scale\n• Design SaaS security posture management (SSPM) for Microsoft 365, Google Workspace\n• Build API security scanning for shadow IT discovery\n• Develop cloud-native firewall policies for AWS, Azure, GCP`,
      `Required: Cloud security (AWS/Azure/GCP), Python, networking (TLS, HTTP, DNS), Zero Trust architecture. Nice to have: PCNSE certification, CASB/SASE experience, API security, IAM federation (SAML/OIDC).`,
      ['python', 'aws', 'azure', 'networking', 'cybersecurity', 'linux', 'docker'], 'Mid-Senior level', 'Hanoi, Vietnam', '$5,500 - $10,000'),
  ],

  'CrowdStrike': [
    job('Software Engineer, Threat Intelligence Platform',
      `CrowdStrike\'s Threat Intelligence team tracks 200+ nation-state and criminal adversaries. You will build the data platform that collects, enriches, and operationalizes threat intelligence.\n\nResponsibilities:\n• Build intelligence collection pipelines from dark web, malware analysis, and sensor network\n• Develop malware analysis automation using sandbox detonation\n• Build threat actor attribution algorithms using ML clustering\n• Create indicator-of-compromise (IOC) management and sharing APIs (STIX/TAXII)\n• Build intelligence-driven hunting queries for the Falcon platform`,
      `Required: Python (4+ years), cybersecurity fundamentals (malware, threat intel), data pipelines (Kafka/Spark), SQL. Nice to have: malware reverse engineering (IDA Pro, Ghidra), STIX/TAXII, MITRE ATT&CK, dark web OSINT.`,
      ['python', 'cybersecurity', 'machine learning', 'sql', 'kafka', 'linux', 'distributed systems'], 'Mid-Senior level', 'Ho Chi Minh City, Vietnam', '$6,000 - $11,000'),
  ],

  // ── Data & Cloud Infrastructure ──────────────────
  'Snowflake': [
    job('Software Engineer, Query Optimizer',
      `Snowflake\'s query engine processes exabytes of data for thousands of enterprises. You will work on the query optimizer, execution engine, and SQL dialect features.\n\nResponsibilities:\n• Implement cost-based query optimizer improvements for complex join ordering\n• Build vectorized execution engine optimizations (SIMD, cache-friendly layouts)\n• Develop new SQL features: window functions, array types, ML UDFs\n• Improve query compilation latency for interactive analytics workloads\n• Profile and optimize query plans for enterprise customer workloads`,
      `Required: C++ (4+ years), database internals (query optimization, execution engines), strong algorithms and data structures. Nice to have: columnar storage formats (Parquet, Arrow), distributed SQL engines (Trino, DuckDB), LLVM-based code generation.`,
      ['c++', 'python', 'sql', 'algorithms', 'distributed systems', 'java', 'linux'], 'Mid-Senior level', 'Ho Chi Minh City, Vietnam', '$8,000 - $14,000'),

    job('Data Cloud Solutions Engineer',
      `Help Snowflake\'s enterprise customers unlock the full potential of the Data Cloud. You will provide technical guidance on data architecture, migration, and optimization.\n\nResponsibilities:\n• Lead Snowflake migrations for enterprise customers (Oracle, Teradata, Redshift)\n• Design optimal data architecture patterns for Snowflake (clustering, micro-partitioning)\n• Deliver workshops on Snowpark (Python/Java/Scala on Snowflake)\n• Build proof-of-concepts for AI/ML workloads using Snowflake Cortex\n• Create best practices documentation and training materials`,
      `Required: SQL (expert), data warehouse concepts, Python or Scala, cloud platforms (AWS/Azure/GCP). Nice to have: Snowflake SnowPro certification, dbt, Airflow, migration from legacy DW.`,
      ['sql', 'python', 'aws', 'azure', 'spark', 'dbt', 'machine learning'], 'Mid-Senior level', 'Hanoi, Vietnam', '$5,000 - $9,000'),
  ],

  'Databricks': [
    job('Software Engineer, Delta Lake',
      `Delta Lake is the world's most popular open table format with 10M+ downloads per month. You will build the transactional storage layer that powers Databricks Lakehouse.\n\nResponsibilities:\n• Implement ACID transaction support for Delta Lake (optimistic concurrency control)\n• Build Delta Sharing protocol for secure cross-cloud data sharing\n• Develop Delta Lake connectors for Spark, Flink, Hive, and Trino\n• Optimize Delta Log compaction and checkpoint strategies at petabyte scale\n• Contribute to Delta Lake open-source community (Apache project)`,
      `Required: Scala or Java (4+ years), Apache Spark internals, distributed storage systems, ACID transactions. Nice to have: Apache Parquet, Iceberg/Hudi comparison, Rust (Delta Kernel), columnar storage optimization.`,
      ['scala', 'java', 'python', 'spark', 'sql', 'distributed systems', 'algorithms'], 'Mid-Senior level', 'Ho Chi Minh City, Vietnam', '$7,000 - $13,000'),

    job('ML Engineer, Mosaic AI Platform',
      `Build the MLOps infrastructure that data scientists at thousands of companies use to train and deploy ML models. You will work on MLflow, Model Serving, and Feature Engineering.\n\nResponsibilities:\n• Develop MLflow features for experiment tracking, model registry, and deployment\n• Build model serving infrastructure for real-time inference at scale\n• Implement AutoML capabilities for automated feature engineering and model selection\n• Build LLM fine-tuning and evaluation infrastructure using Databricks Mosaic\n• Integrate with enterprise AI governance requirements`,
      `Required: Python (4+ years), MLflow/ML platforms, distributed ML training, Docker/Kubernetes. Nice to have: LLM fine-tuning (LoRA, QLoRA), MLflow internals, Ray/Dask, feature stores (Feast, Tecton).`,
      ['python', 'machine learning', 'deep learning', 'pytorch', 'spark', 'kubernetes', 'docker'], 'Mid-Senior level', 'Hanoi, Vietnam', '$6,000 - $11,000'),
  ],

  'Confluent': [
    job('Software Engineer, Kafka Core',
      `Confluent is built by the creators of Apache Kafka. You will work on the Kafka broker, controller, and replication protocol that processes trillions of events daily.\n\nResponsibilities:\n• Implement Kafka protocol improvements (KRaft consensus, tiered storage)\n• Build Kafka Streams and ksqlDB query engine features\n• Optimize broker throughput and latency for high-frequency trading workloads\n• Develop Kafka Connect framework improvements and connector plugins\n• Contribute to Apache Kafka open-source project (KIPs)`,
      `Required: Java (4+ years), distributed systems (consensus algorithms, replication), storage systems. Nice to have: Apache Kafka contributor, KRaft, tiered storage, network programming (Netty), ZooKeeper.`,
      ['java', 'scala', 'distributed systems', 'kafka', 'algorithms', 'linux', 'python'], 'Mid-Senior level', 'Ho Chi Minh City, Vietnam', '$7,000 - $12,000'),
  ],

  'MongoDB': [
    job('Software Engineer, Query Execution',
      `MongoDB powers 47,000+ customers including Google, Toyota, and Barclays. You will build the query language and execution engine for MongoDB's BSON document model.\n\nResponsibilities:\n• Implement aggregation pipeline stages and query operators in C++\n• Build query plan cache and index selection algorithms\n• Develop MongoDB Atlas Vector Search for AI/ML workloads\n• Improve change streams for real-time data synchronization\n• Work on MongoDB\'s ACID multi-document transaction engine`,
      `Required: C++ (4+ years), database internals (query planning, indexing, storage engines), algorithms. Nice to have: WiredTiger storage engine, distributed query processing, vector search (HNSW), Atlas Search.`,
      ['c++', 'python', 'javascript', 'algorithms', 'distributed systems', 'linux', 'sql'], 'Mid-Senior level', 'Ho Chi Minh City, Vietnam', '$7,000 - $13,000'),
  ],

  'Elastic': [
    job('Software Engineer, Elasticsearch',
      `Elasticsearch powers search for Netflix, GitHub, Wikipedia, and millions of applications. You will work on the core search engine, relevance algorithms, and distributed query processing.\n\nResponsibilities:\n• Implement new query types and relevance scoring improvements (BM25, neural search)\n• Build distributed aggregation execution for real-time analytics\n• Develop Elasticsearch\'s vector search capabilities (kNN, approximate search)\n• Improve cluster resilience and recovery mechanisms\n• Build integrations with Elastic AI Assistant and LLMs for semantic search`,
      `Required: Java (4+ years), search engine internals (inverted index, BM25, vector search), distributed systems (Lucene). Nice to have: Apache Lucene contributor, HNSW/IVF vector indexing, neural/semantic search, OpenSearch.`,
      ['java', 'python', 'elasticsearch', 'distributed systems', 'algorithms', 'linux', 'docker'], 'Mid-Senior level', 'Ho Chi Minh City, Vietnam', '$6,000 - $11,000'),
  ],

  'Datadog': [
    job('Software Engineer, Metrics Platform',
      `Datadog ingests trillions of metrics from millions of hosts daily. You will build the time-series storage engine, query processing, and anomaly detection pipeline.\n\nResponsibilities:\n• Build high-throughput time-series ingestion pipeline (10M+ metrics/second)\n• Develop distributed storage engine for metrics with configurable retention\n• Implement anomaly detection and forecasting algorithms for monitoring\n• Build Datadog Query Language (DQL) execution engine\n• Scale the metrics platform to handle 10x growth`,
      `Required: Go or C++ (4+ years), time-series databases (InfluxDB/Prometheus internals), distributed systems, algorithms. Nice to have: custom TSDB design, streaming aggregation, ML for anomaly detection, columnar storage.`,
      ['go', 'python', 'distributed systems', 'algorithms', 'linux', 'kubernetes', 'docker'], 'Mid-Senior level', 'Ho Chi Minh City, Vietnam', '$6,000 - $11,000'),

    job('Site Reliability Engineer, Cloud Infrastructure',
      `Maintain 99.99% availability for Datadog\'s monitoring platform used by 27,000+ customers. You will build the infrastructure and automation that keeps Datadog running.\n\nResponsibilities:\n• Operate and scale Kubernetes clusters across AWS, GCP, and Azure\n• Build infrastructure automation with Terraform and Ansible\n• Implement chaos engineering to improve system resilience\n• Design and execute disaster recovery procedures\n• Build internal tooling to reduce MTTD and MTTR for incidents`,
      `Required: Kubernetes (expert), Terraform, Go or Python, incident management experience. Nice to have: chaos engineering (Chaos Monkey), eBPF, multi-cloud, capacity planning, SRE metrics (SLI/SLO/SLA).`,
      ['kubernetes', 'terraform', 'go', 'python', 'aws', 'linux', 'devops', 'docker'], 'Mid-Senior level', 'Hanoi, Vietnam', '$5,500 - $10,000'),
  ],

  'HashiCorp': [
    job('Software Engineer, Terraform Core',
      `Terraform is used by 4M+ practitioners to manage cloud infrastructure. You will work on the Terraform core CLI, state management, and provider protocol.\n\nResponsibilities:\n• Build Terraform core planning and apply algorithms (graph-based dependency resolution)\n• Develop HCL language features and the Terraform configuration model\n• Implement improvements to Terraform state management and locking\n• Build Terraform provider SDK and plugin protocol (gRPC)\n• Contribute to Terraform\'s open-source ecosystem`,
      `Required: Go (4+ years), strong algorithms (graph algorithms), cloud APIs (AWS/Azure/GCP). Nice to have: Terraform contributor, HCL parser, Terraform CDK, provider development experience.`,
      ['go', 'terraform', 'aws', 'azure', 'kubernetes', 'docker', 'distributed systems'], 'Mid-Senior level', 'Ho Chi Minh City, Vietnam', '$6,000 - $11,000'),
  ],

  // ── Enterprise Software ──────────────────────────
  'Salesforce': [
    job('Salesforce Developer (Apex/LWC)',
      `Build enterprise CRM solutions on the world\'s #1 CRM platform. You will develop custom Salesforce applications for Fortune 500 customers using Apex, Lightning Web Components, and integration APIs.\n\nResponsibilities:\n• Develop custom Salesforce applications with Apex triggers, classes, and batch jobs\n• Build Lightning Web Components (LWC) for modern Salesforce UI\n• Integrate Salesforce with external systems using REST/SOAP APIs and Platform Events\n• Implement Einstein Analytics dashboards and AI-powered features\n• Design Salesforce architecture following governor limits and best practices`,
      `Bắt buộc: Salesforce (Apex, LWC, SOQL), Salesforce Platform Developer I certification, REST API integration, JavaScript. Ưu tiên: Salesforce Platform Developer II, Einstein Analytics, Flow Builder, AppExchange development.`,
      ['salesforce', 'javascript', 'java', 'rest api', 'sql', 'html', 'css', 'git'], 'Mid-Senior level', 'Ho Chi Minh City, Vietnam', '$2,500 - $5,000'),

    job('AI Engineer, Einstein Platform',
      `Einstein is Salesforce\'s AI layer embedded across all CRM products. You will build LLM-powered features for sales, service, and marketing automation.\n\nResponsibilities:\n• Build Einstein Copilot capabilities using LLMs and RAG for CRM-specific queries\n• Train and fine-tune ML models for lead scoring, opportunity prediction, and churn\n• Develop Einstein Trust Layer for safe AI data handling\n• Build natural language to SOQL query generation\n• A/B test AI features affecting millions of sales reps`,
      `Required: Python (4+ years), LLM APIs (OpenAI/Anthropic), RAG systems, Salesforce Platform knowledge. Nice to have: Salesforce Einstein, LangChain, vector databases, fine-tuning (LoRA), A/B experimentation.`,
      ['python', 'machine learning', 'nlp', 'deep learning', 'pytorch', 'rest api', 'sql'], 'Mid-Senior level', 'Hanoi, Vietnam', '$4,000 - $8,000'),
  ],

  'ServiceNow': [
    job('Platform Developer, Now Platform',
      `ServiceNow\'s Now Platform powers IT operations for 85% of Fortune 500. You will build workflow automation, integration capabilities, and AI-powered features on the platform.\n\nResponsibilities:\n• Develop ServiceNow platform features using JavaScript, GlideScript, and Flow Designer\n• Build REST API integrations with enterprise systems (Jira, Salesforce, SAP)\n• Implement AI/ML-powered features for ITSM automation\n• Design secure and scalable ServiceNow architecture for enterprise customers\n• Build custom UI components with Service Portal and UI Builder`,
      `Bắt buộc: JavaScript, ServiceNow development (Scripted REST APIs, GlideScript, ACL), REST API integration. Ưu tiên: ServiceNow CSA/CAD certification, Flow Designer, Integration Hub, Performance Analytics.`,
      ['javascript', 'java', 'rest api', 'sql', 'html', 'css', 'agile', 'git'], 'Mid-Senior level', 'Ho Chi Minh City, Vietnam', '$3,000 - $6,000'),
  ],

  'SAP': [
    job('SAP S/4HANA Developer (ABAP)',
      `SAP S/4HANA runs the core business operations of the world\'s largest companies. You will develop ABAP extensions, fiori applications, and integrations for enterprise ERP.\n\nResponsibilities:\n• Develop ABAP OO extensions for SAP S/4HANA modules (FI/CO, MM, SD, PP)\n• Build SAP Fiori/UI5 applications for modern web-based ERP interfaces\n• Integrate S/4HANA with external systems using SAP Integration Suite (CPI)\n• Optimize ABAP code for SAP HANA in-memory database performance\n• Configure and customize SAP S/4HANA for Vietnamese business requirements`,
      `Bắt buộc: ABAP (3+ năm), SAP S/4HANA hoặc SAP ECC, ít nhất 1 module (FI/MM/SD). Ưu tiên: ABAP OO, BTP (Business Technology Platform), Fiori/UI5, SAP Integration Suite, chứng chỉ SAP.`,
      ['java', 'javascript', 'sql', 'html', 'css', 'rest api', 'agile', 'git'], 'Mid-Senior level', 'Hanoi, Vietnam', '$2,500 - $5,000'),
  ],

  'Oracle': [
    job('Cloud Engineer - Oracle Cloud Infrastructure',
      `Oracle Cloud Infrastructure (OCI) competes with AWS and Azure for enterprise cloud workloads. You will build and operate cloud services used by banks, telcos, and governments.\n\nResponsibilities:\n• Develop OCI services (Compute, Networking, Database) in Java and Go\n• Build hypervisor-level virtualization improvements (KVM/Xen)\n• Implement OCI Networking features (VCN, FastConnect, Load Balancer)\n• Improve bare metal provisioning automation at data center scale\n• Work on OCI\'s Sovereign Cloud for government compliance`,
      `Required: Java or Go (4+ years), cloud infrastructure internals (virtualization, networking), Linux systems programming. Nice to have: KVM/Xen, DPDK, OCI certifications, experience with cloud networking at scale.`,
      ['java', 'go', 'linux', 'networking', 'kubernetes', 'docker', 'python', 'aws'], 'Mid-Senior level', 'Hanoi, Vietnam', '$4,000 - $8,000'),
  ],

  // ── IT Services & Outsourcing ────────────────────
  'FPT Software': [
    job('Java Software Engineer (Banking Domain)',
      `FPT Software cung cấp dịch vụ công nghệ cho 200+ tập đoàn toàn cầu. Bạn sẽ phát triển hệ thống core banking và fintech cho các ngân hàng Nhật Bản và châu Âu.\n\nTrách nhiệm:\n• Phát triển và bảo trì hệ thống core banking với Java/Spring Boot\n• Tích hợp với swift messaging, card processing systems (Visa/Mastercard)\n• Xây dựng module quản lý vốn vay, tiết kiệm và tài khoản\n• Đảm bảo tuân thủ quy định ngân hàng Nhật Bản và châu Âu\n• Viết unit tests và tài liệu kỹ thuật tiếng Anh/Nhật`,
      `Bắt buộc: Java/Spring Boot (3+ năm), Oracle/PostgreSQL, thiết kế REST API, kiến thức cơ bản banking domain. Ưu tiên: Tiếng Nhật (JLPT N3+), Hibernate, microservices, kinh nghiệm dự án Nhật.`,
      ['java', 'spring boot', 'postgresql', 'rest api', 'docker', 'git', 'agile', 'microservices'], 'Mid-Senior level', 'Ho Chi Minh City, Vietnam', '$1,500 - $3,500'),

    job('QA Engineer - Automation Testing',
      `Xây dựng và duy trì framework kiểm thử tự động cho các dự án outsourcing của FPT Software. Đảm bảo chất lượng sản phẩm cho khách hàng Mỹ, Nhật, và châu Âu.\n\nTrách nhiệm:\n• Thiết kế và xây dựng automation test framework (Selenium/Playwright)\n• Viết test scripts cho web và API testing (REST Assured/Postman)\n• Tích hợp automated tests vào CI/CD pipeline\n• Review test cases và hướng dẫn QA manual tester\n• Báo cáo tiến độ testing và quality metrics cho khách hàng`,
      `Bắt buộc: Selenium hoặc Playwright, Python hoặc Java, Postman/REST API testing, JIRA. Ưu tiên: BDD (Cucumber), performance testing (JMeter), CI/CD (Jenkins), ISTQB certification.`,
      ['selenium', 'python', 'java', 'rest api', 'ci/cd', 'git', 'agile', 'scrum'], 'Associate', 'Hanoi, Vietnam', '$1,000 - $2,200'),

    job('Business Analyst (IT Outsourcing)',
      `Làm cầu nối giữa khách hàng nước ngoài và team phát triển. Bạn sẽ thu thập, phân tích, và chuyển hóa yêu cầu nghiệp vụ thành tài liệu kỹ thuật cho dự án outsourcing.\n\nTrách nhiệm:\n• Thu thập và phân tích yêu cầu từ khách hàng Nhật/Mỹ/châu Âu\n• Viết Business Requirements Document (BRD) và Software Requirements Specification (SRS)\n• Tạo use case diagrams, user stories, và wireframes\n• Làm việc với team dev để ước tính effort và lập kế hoạch dự án\n• Hỗ trợ UAT và đào tạo người dùng cuối`,
      `Bắt buộc: Tiếng Anh IELTS 7.0+, kỹ năng viết tài liệu kỹ thuật, kiến thức cơ bản SDLC, UML diagrams. Ưu tiên: Tiếng Nhật JLPT N3+, Agile/Scrum, SQL cơ bản, Figma/Balsamiq.`,
      ['agile', 'scrum', 'sql', 'rest api', 'git', 'figma', 'algorithms'], 'Associate', 'Ho Chi Minh City, Vietnam', '$1,000 - $2,500'),
  ],

  'VNG Corporation': [
    job('Game Backend Engineer (Zingplay)',
      `VNG là công ty game và internet lớn nhất Việt Nam với Zalo, Zingplay và nhiều sản phẩm khác. Bạn sẽ xây dựng game server cho các tựa game online triệu người chơi.\n\nTrách nhiệm:\n• Xây dựng và tối ưu hóa game server xử lý hàng triệu concurrent connections\n• Implement game logic: matchmaking, anti-cheat, leaderboard, in-game economy\n• Thiết kế realtime multiplayer framework (WebSocket, TCP)\n• Tích hợp payment cho in-game purchase (thẻ cào, thanh toán điện tử)\n• Tối ưu hiệu năng server để giảm latency cho game real-time`,
      `Bắt buộc: Go hoặc C++ hoặc Java, network programming (TCP/WebSocket), Redis, MySQL. Ưu tiên: game server kinh nghiệm, anti-cheat systems, distributed game state, Erlang/Elixir.`,
      ['go', 'c++', 'java', 'redis', 'postgresql', 'networking', 'docker', 'algorithms'], 'Mid-Senior level', 'Ho Chi Minh City, Vietnam', '$2,000 - $4,500'),
  ],

  'KMS Technology': [
    job('DevOps Engineer (AWS/Azure)',
      `KMS Technology cung cấp dịch vụ phần mềm cho thị trường Mỹ. Bạn sẽ xây dựng và vận hành CI/CD pipeline và cloud infrastructure cho các dự án outsourcing.\n\nTrách nhiệm:\n• Thiết kế và xây dựng CI/CD pipeline với Jenkins/GitHub Actions\n• Quản lý AWS/Azure infrastructure với Terraform\n• Cấu hình và monitor Kubernetes clusters\n• Implement security best practices: IAM, VPC, secret management\n• Hỗ trợ dev team trong containerization và deployment`,
      `Bắt buộc: AWS hoặc Azure, Docker, Kubernetes, Terraform, CI/CD (Jenkins/GitHub Actions), Linux. Ưu tiên: chứng chỉ AWS/Azure, Helm, ArgoCD, Ansible, monitoring (Prometheus/Grafana).`,
      ['aws', 'kubernetes', 'docker', 'terraform', 'ci/cd', 'linux', 'python', 'devops'], 'Mid-Senior level', 'Ho Chi Minh City, Vietnam', '$2,000 - $4,000'),

    job('Software Engineer (React + Node.js)',
      `Phát triển sản phẩm SaaS cho khách hàng Mỹ trong lĩnh vực healthcare và fintech. Bạn sẽ xây dựng full-stack features với React và Node.js.\n\nTrách nhiệm:\n• Phát triển user interface với React và TypeScript\n• Xây dựng REST APIs với Node.js (Express/NestJS)\n• Thiết kế database schema với PostgreSQL\n• Viết unit tests và integration tests (Jest, Cypress)\n• Tham gia Agile ceremonies với team USA theo múi giờ chênh lệch`,
      `Bắt buộc: React, Node.js, TypeScript, PostgreSQL, REST API, tiếng Anh tốt. Ưu tiên: NestJS, GraphQL, AWS, automated testing, kinh nghiệm dự án Mỹ.`,
      ['react', 'node.js', 'typescript', 'postgresql', 'rest api', 'docker', 'git', 'agile'], 'Mid-Senior level', 'Ho Chi Minh City, Vietnam', '$1,800 - $3,500'),
  ],

  'NashTech': [
    job('Software Architect / Technical Lead',
      `NashTech là công ty công nghệ toàn cầu Anh-Việt. Bạn sẽ dẫn dắt team kỹ thuật và thiết kế kiến trúc cho các dự án enterprise của khách hàng châu Âu.\n\nTrách nhiệm:\n• Thiết kế kiến trúc microservices cho hệ thống enterprise phức tạp\n• Dẫn dắt team 8-12 engineers, mentoring và technical direction\n• Tư vấn khách hàng về cloud migration và modernization\n• Thực hiện architecture review và đảm bảo code quality\n• Định nghĩa tech stack và engineering standards`,
      `Bắt buộc: 7+ năm engineering, 2+ năm architecture/lead, Java hoặc .NET hoặc Node.js, cloud (AWS/Azure), microservices, tiếng Anh C1. Ưu tiên: Domain-Driven Design, event-driven architecture, chứng chỉ cloud architect.`,
      ['java', 'microservices', 'aws', 'kubernetes', 'docker', 'system design', 'python', 'agile'], 'Director', 'Hanoi, Vietnam', '$3,500 - $7,000'),

    job('Backend Engineer (.NET)',
      `Phát triển enterprise applications cho khách hàng Anh và châu Âu. Bạn sẽ xây dựng backend services với .NET và Microsoft Azure.\n\nTrách nhiệm:\n• Phát triển REST APIs và microservices với ASP.NET Core\n• Tích hợp với Azure services (Service Bus, Functions, Cosmos DB)\n• Thiết kế database schema và optimize queries với SQL Server\n• Viết unit tests và integration tests với xUnit và Moq\n• Tham gia code review và Agile ceremonies với team UK`,
      `Bắt buộc: ASP.NET Core (C#), SQL Server hoặc PostgreSQL, REST API, tiếng Anh tốt. Ưu tiên: Azure, Entity Framework, Azure DevOps, microservices, DDD.`,
      ['c#', 'asp.net', 'sql server', 'azure', 'rest api', 'docker', 'git', 'agile'], 'Mid-Senior level', 'Hanoi, Vietnam', '$1,800 - $3,500'),
  ],

  'Axon Active': [
    job('Agile Coach / Scrum Master',
      `Axon Active là công ty phần mềm Thụy Sĩ-Việt Nam áp dụng Agile thuần túy. Bạn sẽ coaching team development và khách hàng Thụy Sĩ về Agile transformation.\n\nTrách nhiệm:\n• Facilitator cho các Agile ceremonies (Sprint Planning, Daily Scrum, Retrospective)\n• Coach team về Scrum/Kanban và Agile mindset\n• Identify và remove impediments ngăn cản team productivity\n• Đo lường và cải thiện team velocity, quality metrics\n• Làm việc trực tiếp với khách hàng Thụy Sĩ về product backlog và roadmap`,
      `Bắt buộc: Scrum Master kinh nghiệm 2+ năm, CSM hoặc PSM certification, tiếng Anh C1. Ưu tiên: SAFe Agilist, kinh nghiệm coaching nhiều team cùng lúc, Jira/Confluence, kiến thức software development.`,
      ['agile', 'scrum', 'jira', 'git', 'algorithms', 'rest api'], 'Mid-Senior level', 'Da Nang, Vietnam', '$1,500 - $3,000'),
  ],

  'Rikkeisoft': [
    job('PHP Developer (Laravel) - Japan Project',
      `Rikkeisoft chuyên outsource cho thị trường Nhật Bản. Bạn sẽ phát triển web application cho khách hàng Nhật với PHP/Laravel.\n\nTrách nhiệm:\n• Phát triển web application với Laravel framework\n• Thiết kế và tối ưu database MySQL\n• Tích hợp với third-party APIs và hệ thống Nhật Bản\n• Viết unit tests và tài liệu kỹ thuật tiếng Nhật/Anh\n• Giao tiếp với khách hàng Nhật trong các buổi họp online`,
      `Bắt buộc: PHP/Laravel (2+ năm), MySQL, REST API, Git. Ưu tiên: Tiếng Nhật JLPT N4+, Vue.js hoặc React, Redis, Docker.`,
      ['php', 'javascript', 'mysql', 'rest api', 'git', 'docker', 'html', 'css'], 'Associate', 'Hanoi, Vietnam', '$1,000 - $2,200'),
  ],

  'TMA Solutions': [
    job('Embedded Software Engineer (C/C++)',
      `TMA Solutions là công ty gia công phần mềm lớn nhất Việt Nam với 3,500+ kỹ sư. Bạn sẽ phát triển firmware và embedded software cho thiết bị IoT và viễn thông.\n\nTrách nhiệm:\n• Phát triển firmware với C/C++ cho vi điều khiển (STM32, ARM Cortex)\n• Implement giao thức truyền thông: UART, SPI, I2C, CAN, Ethernet\n• Tối ưu bộ nhớ và năng lượng cho thiết bị IoT\n• Viết device drivers và BSP (Board Support Package)\n• Debug hardware/software issues với oscilloscope và JTAG debugger`,
      `Bắt buộc: C/C++ embedded (2+ năm), RTOS (FreeRTOS/Zephyr), ARM Cortex-M, hardware debug. Ưu tiên: Linux embedded, Yocto, Bluetooth/WiFi protocols, AUTOSAR (automotive).`,
      ['c++', 'python', 'linux', 'networking', 'algorithms', 'git'], 'Associate', 'Ho Chi Minh City, Vietnam', '$1,000 - $2,500'),
  ],

  'Luvina Software': [
    job('iOS Developer (Swift)',
      `Luvina Software chuyên phát triển phần mềm cho khách hàng Nhật Bản và châu Âu. Bạn sẽ xây dựng iOS applications cho khách hàng Nhật.\n\nTrách nhiệm:\n• Phát triển iOS app với Swift và SwiftUI/UIKit\n• Tích hợp REST API và xử lý JSON với Codable\n• Implement offline mode với CoreData hoặc Realm\n• Tối ưu performance và memory usage\n• Phối hợp với backend team (Java/Spring Boot) và khách hàng Nhật`,
      `Bắt buộc: Swift (2+ năm), UIKit hoặc SwiftUI, REST API integration, Xcode. Ưu tiên: Tiếng Nhật, SwiftUI, Combine, Push notifications, TestFlight, fastlane.`,
      ['swift', 'ios', 'objective-c', 'rest api', 'git', 'xcode', 'agile'], 'Associate', 'Hanoi, Vietnam', '$1,000 - $2,500'),
  ],

  // ── AI & Research ────────────────────────────────
  'VinAI Research': [
    job('Research Scientist - Computer Vision',
      `VinAI Research là viện nghiên cứu AI hàng đầu Đông Nam Á. Bạn sẽ nghiên cứu và phát triển mô hình Computer Vision ứng dụng cho xe tự lái và nhận dạng đối tượng.\n\nTrách nhiệm:\n• Nghiên cứu và triển khai SOTA object detection, segmentation (YOLO, DETR, SAM)\n• Phát triển mô hình 3D perception cho xe tự lái (LiDAR + Camera fusion)\n• Công bố kết quả tại CVPR, ICCV, ECCV, NeurIPS\n• Xây dựng dataset annotation pipeline và quality control\n• Transfer research models sang production trên NVIDIA Jetson`,
      `Bắt buộc: PyTorch (expert), Computer Vision (object detection, segmentation, depth estimation), PhD hoặc 3+ bài báo top venue. Ưu tiên: 3D perception, CUDA optimization, autonomous driving datasets (KITTI, nuScenes).`,
      ['python', 'pytorch', 'deep learning', 'machine learning', 'c++', 'linux', 'algorithms'], 'Mid-Senior level', 'Hanoi, Vietnam', '$3,000 - $7,000'),

    job('NLP Engineer - Vietnamese Language',
      `Xây dựng các mô hình NLP cho tiếng Việt — ngôn ngữ phức tạp với thanh điệu và ngữ pháp đặc thù. Bạn sẽ train và fine-tune LLMs cho tiếng Việt.\n\nTrách nhiệm:\n• Fine-tune LLMs (LLaMA, Qwen, Gemma) cho tiếng Việt sử dụng LoRA/QLoRA\n• Xây dựng dataset tiếng Việt: thu thập, làm sạch, và annotation\n• Evaluate model trên các benchmark tiếng Việt (VLUE, ViMMRC)\n• Phát triển Text-to-Speech và Speech-to-Text cho tiếng Việt\n• Nghiên cứu low-resource NLP cho ngôn ngữ Đông Nam Á`,
      `Bắt buộc: Python, PyTorch, Hugging Face Transformers, NLP fundamentals. Ưu tiên: LLM fine-tuning (LoRA), tiếng Việt linguistics, speech processing (Whisper, TTS), Vietnamese NLP benchmarks.`,
      ['python', 'pytorch', 'nlp', 'machine learning', 'deep learning', 'tensorflow', 'linux'], 'Mid-Senior level', 'Hanoi, Vietnam', '$2,500 - $5,000'),
  ],

  'Got It': [
    job('AI Engineer - EdTech Platform',
      `Got It là startup AI hàng đầu Việt Nam, xây dựng nền tảng học tập thông minh. Bạn sẽ phát triển AI tutoring systems và automatic question answering.\n\nTrách nhiệm:\n• Xây dựng AI tutoring chatbot sử dụng LLMs và RAG cho subject-specific Q&A\n• Phát triển math problem solving engine kết hợp symbolic AI và LLMs\n• Build intelligent content recommendation cho học sinh\n• Implement plagiarism detection và essay scoring\n• A/B test AI features để tối ưu learning outcomes`,
      `Bắt buộc: Python, PyTorch/Hugging Face, LLM APIs (OpenAI/Anthropic), REST API. Ưu tiên: RAG systems, knowledge graphs, educational AI (EDM), mathematical reasoning với LLMs.`,
      ['python', 'machine learning', 'nlp', 'deep learning', 'pytorch', 'rest api', 'docker'], 'Mid-Senior level', 'Ho Chi Minh City, Vietnam', '$2,000 - $4,500'),
  ],

  // ── Gaming ───────────────────────────────────────
  'Gameloft Vietnam': [
    job('Unity Game Developer',
      `Gameloft là hãng phát triển game mobile nổi tiếng toàn cầu. Bạn sẽ phát triển game mobile AAA với Unity cho iOS và Android, shipped tới 180+ quốc gia.\n\nTrách nhiệm:\n• Phát triển gameplay systems và game mechanics với C# và Unity\n• Tối ưu performance: frame rate, memory, và battery drain trên mobile\n• Implement graphics shaders (HLSL/GLSL) cho visual effects\n• Tích hợp monetization (IAP, rewarded ads) và analytics SDK\n• Collaborate với artists và designers để implement assets vào game`,
      `Bắt buộc: Unity (C#) 2+ năm, kiến thức game development fundamentals (physics, rendering, audio), mobile optimization. Ưu tiên: Unity URP/HDRP, shader programming, Addressables, cinemachine, game design patterns.`,
      ['c#', 'c++', 'python', 'algorithms', 'git', 'agile'], 'Associate', 'Ho Chi Minh City, Vietnam', '$1,200 - $2,800'),

    job('Game Backend Engineer',
      `Xây dựng backend infrastructure cho game online của Gameloft với hàng triệu người chơi. Bạn sẽ phát triển game server, leaderboard, và in-game economy systems.\n\nTrách nhiệm:\n• Phát triển game server handling concurrent players (Node.js/Go)\n• Xây dựng real-time leaderboard với Redis sorted sets\n• Implement in-game shop, currency management, và IAP validation\n• Xây dựng matchmaking system theo skill-based (ELO/TrueSkill)\n• Anti-cheat detection và player ban management`,
      `Bắt buộc: Node.js hoặc Go, Redis, PostgreSQL, REST API. Ưu tiên: WebSocket game servers, game economy design, anti-cheat systems, AWS GameLift.`,
      ['node.js', 'go', 'redis', 'postgresql', 'rest api', 'docker', 'algorithms'], 'Associate', 'Ho Chi Minh City, Vietnam', '$1,500 - $3,000'),
  ],

  'Amanotes': [
    job('Mobile Game Developer (Unity/Flutter)',
      `Amanotes là công ty game âm nhạc #1 thế giới với 2 tỷ lượt tải. Bạn sẽ phát triển music game với Unity hoặc Flutter, tích hợp công nghệ âm nhạc độc quyền.\n\nTrách nhiệm:\n• Phát triển music game features: note detection, beat synchronization, scoring\n• Tích hợp Amanotes SDK âm nhạc vào game mới\n• Tối ưu audio latency và synchronization trên iOS/Android\n• Phát triển level editor tool cho game designers\n• Implement social features: leaderboard, replays, sharing`,
      `Bắt buộc: Unity (C#) hoặc Flutter (Dart), mobile development, game logic programming. Ưu tiên: audio programming (FMOD/Wwise), rhythm game experience, music theory cơ bản.`,
      ['c#', 'dart', 'flutter', 'python', 'git', 'algorithms', 'agile'], 'Associate', 'Ho Chi Minh City, Vietnam', '$1,200 - $2,500'),
  ],

  // ── Fintech/Banking Tech ─────────────────────────
  'Techcombank': [
    job('Senior Software Engineer - Core Banking',
      `Techcombank là ngân hàng tiên phong công nghệ tại Việt Nam. Bạn sẽ phát triển và tích hợp core banking system phục vụ 10+ triệu khách hàng.\n\nTrách nhiệm:\n• Phát triển microservices cho hệ thống ngân hàng lõi (tài khoản, giao dịch, vốn vay)\n• Tích hợp với NAPAS, SWIFT, và các hệ thống liên ngân hàng\n• Xây dựng Open Banking APIs theo chuẩn PSD2/OpenAPI\n• Đảm bảo high availability 99.99% cho hệ thống ngân hàng\n• Tuân thủ quy định NHNN và chuẩn bảo mật ISO 27001`,
      `Bắt buộc: Java/Spring Boot (4+ năm), microservices, PostgreSQL/Oracle, REST API. Ưu tiên: banking domain (core banking, payment), Kafka, Kubernetes, kinh nghiệm ngân hàng Việt Nam.`,
      ['java', 'spring boot', 'postgresql', 'kafka', 'microservices', 'docker', 'kubernetes', 'rest api'], 'Mid-Senior level', 'Hanoi, Vietnam', '$2,000 - $4,500'),

    job('Data Engineer - Banking Analytics',
      `Xây dựng data platform cho Techcombank để phân tích hành vi khách hàng, credit scoring, và fraud detection.\n\nTrách nhiệm:\n• Xây dựng data warehouse cho dữ liệu giao dịch ngân hàng\n• Phát triển ETL pipelines từ core banking sang data lake\n• Xây dựng data models cho credit scoring và customer 360 view\n• Tạo dashboards cho ban lãnh đạo về KPIs kinh doanh\n• Đảm bảo data governance và bảo mật theo quy định NHNN`,
      `Bắt buộc: Python, SQL (advanced), Airflow, data warehouse (Snowflake/BigQuery). Ưu tiên: Spark, Kafka, banking data models, dbt, Power BI/Tableau.`,
      ['python', 'sql', 'spark', 'airflow', 'kafka', 'postgresql', 'machine learning'], 'Mid-Senior level', 'Hanoi, Vietnam', '$2,000 - $4,000'),
  ],

  'VPBank': [
    job('Digital Banking Product Engineer',
      `VPBank Neo là ứng dụng ngân hàng số hướng tới millennials và Gen Z. Bạn sẽ phát triển backend APIs cho tính năng ngân hàng số.\n\nTrách nhiệm:\n• Phát triển APIs cho VPBank Neo app: tài khoản, chuyển tiền, vay tiêu dùng\n• Tích hợp AI credit scoring cho vay tức thì (instant lending)\n• Xây dựng eKYC integration: OCR CCCD, face matching\n• Implement notification system (push, email, SMS) cho banking events\n• Đảm bảo API security theo PCI DSS và quy định NHNN`,
      `Bắt buộc: Java/Spring Boot hoặc Node.js, PostgreSQL, REST API, bảo mật cơ bản (JWT, OAuth2). Ưu tiên: microservices, Kafka, eKYC/OCR integration, banking domain.`,
      ['java', 'spring boot', 'node.js', 'postgresql', 'rest api', 'docker', 'kafka', 'redis'], 'Associate', 'Hanoi, Vietnam', '$1,500 - $3,000'),
  ],

  'Trusting Social': [
    job('ML Engineer - Credit Scoring',
      `Trusting Social dùng AI để cung cấp credit score cho 2 tỷ người không có lịch sử tín dụng truyền thống tại Đông Nam Á và Ấn Độ.\n\nTrách nhiệm:\n• Xây dựng mô hình credit scoring sử dụng alternative data (mobile behavior, social data)\n• Phát triển feature engineering từ dữ liệu điện thoại (app usage, location, call patterns)\n• Triển khai models với low-latency serving (< 100ms) trong fraud detection\n• Đánh giá fairness và bias trong credit scoring models\n• Collaborate với đối tác ngân hàng để calibrate model thresholds`,
      `Bắt buộc: Python, Scikit-learn/XGBoost/LightGBM, SQL, thống kê. Ưu tiên: alternative data credit scoring, survival analysis, model fairness, Spark, deployment (MLflow/BentoML).`,
      ['python', 'machine learning', 'sql', 'pandas', 'numpy', 'spark', 'postgresql'], 'Mid-Senior level', 'Ho Chi Minh City, Vietnam', '$2,500 - $5,000'),
  ],

  // ── Media & Content ──────────────────────────────
  'Cốc Cốc': [
    job('Browser Engine Engineer (C++)',
      `Cốc Cốc là trình duyệt được 25 triệu người Việt Nam sử dụng, xây dựng trên Chromium. Bạn sẽ phát triển tính năng đặc thù Việt Nam và tối ưu engine cho thị trường địa phương.\n\nTrách nhiệm:\n• Phát triển tính năng Việt Nam: tải torrent tích hợp, chặn quảng cáo, tiết kiệm dữ liệu\n• Optimize Chromium rendering engine cho phần cứng mid-range Việt Nam\n• Xây dựng tính năng bảo mật và privacy cho người dùng Việt\n• Contribute Chrome/Chromium codebase và port patches về Cốc Cốc\n• Phát triển browser extensions và native messaging APIs`,
      `Bắt buộc: C++ (4+ năm), Chromium/Blink codebase, browser internals (rendering pipeline, V8, Mojo). Ưu tiên: contributor Chromium, WebAssembly, browser security, V8 optimization.`,
      ['c++', 'python', 'javascript', 'linux', 'algorithms', 'git', 'agile'], 'Mid-Senior level', 'Hanoi, Vietnam', '$2,000 - $4,500'),

    job('Search Algorithm Engineer',
      `Xây dựng search engine tiếng Việt tốt nhất trên Cốc Cốc. Bạn sẽ phát triển indexing, ranking, và query understanding cho tìm kiếm ngôn ngữ Việt.\n\nTrách nhiệm:\n• Cải thiện Vietnamese tokenization và query understanding\n• Xây dựng learning-to-rank models cho search relevance\n• Phát triển spell correction và query suggestion cho tiếng Việt\n• Build knowledge graph cho entity recognition và featured snippets\n• A/B test search ranking changes và đo lường NDCG, MRR metrics`,
      `Bắt buộc: Python, NLP (tokenization, information retrieval), Machine Learning, Elasticsearch. Ưu tiên: Vietnamese NLP, learning-to-rank (LTR), knowledge graphs, query understanding.`,
      ['python', 'machine learning', 'nlp', 'elasticsearch', 'sql', 'pytorch', 'algorithms'], 'Mid-Senior level', 'Hanoi, Vietnam', '$2,000 - $4,000'),
  ],

  'VCCorp': [
    job('Software Engineer - Advertising Platform',
      `VCCorp vận hành các nền tảng quảng cáo số lớn nhất Việt Nam: CafeF, Cafebiz, Soha. Bạn sẽ xây dựng ad serving platform và programmatic advertising system.\n\nTrách nhiệm:\n• Xây dựng Real-Time Bidding (RTB) system cho quảng cáo display\n• Phát triển ad targeting dựa trên audience data và behavioral signals\n• Tối ưu ad fill rate và CPM cho publisher network\n• Xây dựng ad fraud detection system\n• Phát triển reporting dashboard cho advertiser và publisher`,
      `Bắt buộc: Go hoặc Java, Redis, Kafka, PostgreSQL, REST API. Ưu tiên: RTB/programmatic advertising, OpenRTB protocol, ad serving systems, Druid/ClickHouse for analytics.`,
      ['go', 'java', 'redis', 'kafka', 'postgresql', 'rest api', 'docker', 'algorithms'], 'Mid-Senior level', 'Hanoi, Vietnam', '$1,800 - $3,500'),
  ],

  // ── Productivity & HR Tech ───────────────────────
  'Topcv': [
    job('Backend Engineer - Recruitment Platform',
      `TopCV là nền tảng tuyển dụng IT hàng đầu Việt Nam với 5M+ CV và 50K+ nhà tuyển dụng. Bạn sẽ xây dựng hệ thống matching ứng viên và công việc.\n\nTrách nhiệm:\n• Phát triển job recommendation engine sử dụng collaborative filtering\n• Xây dựng CV parsing và skill extraction với NLP\n• Implement full-text search cho job và candidate với Elasticsearch\n• Phát triển notification system cho job alerts\n• Xây dựng API cho ứng dụng mobile iOS/Android`,
      `Bắt buộc: Node.js hoặc Java, Elasticsearch, PostgreSQL, Redis. Ưu tiên: NLP cho CV parsing, recommendation systems, Kafka.`,
      ['node.js', 'java', 'elasticsearch', 'postgresql', 'redis', 'rest api', 'docker', 'machine learning'], 'Mid-Senior level', 'Hanoi, Vietnam', '$1,500 - $3,000'),
  ],

  'Base.vn': [
    job('Full Stack Developer - SaaS Platform',
      `Base.vn là nền tảng quản trị doanh nghiệp số với 10,000+ doanh nghiệp Việt Nam sử dụng. Bạn sẽ phát triển các module HRM, CRM, và project management.\n\nTrách nhiệm:\n• Phát triển features cho Base HRM, Base CRM, và Base Project\n• Xây dựng APIs RESTful và GraphQL cho mobile app\n• Thiết kế database schema cho multi-tenant SaaS\n• Tích hợp third-party: Google Workspace, Slack, payment gateways\n• Xây dựng báo cáo và analytics cho doanh nghiệp`,
      `Bắt buộc: Node.js và React hoặc Vue.js, PostgreSQL, REST API. Ưu tiên: GraphQL, multi-tenant architecture, TypeScript, Redis, Elasticsearch.`,
      ['node.js', 'react', 'typescript', 'postgresql', 'rest api', 'docker', 'graphql', 'redis'], 'Associate', 'Hanoi, Vietnam', '$1,200 - $2,500'),
  ],

  'MISA': [
    job('Backend Developer - Accounting Software',
      `MISA là phần mềm kế toán hàng đầu với 500,000+ doanh nghiệp và hộ kinh doanh sử dụng. Bạn sẽ phát triển MISA SME và MISA AMIS Cloud.\n\nTrách nhiệm:\n• Phát triển module kế toán: sổ cái, nhật ký, báo cáo tài chính\n• Xây dựng hóa đơn điện tử tích hợp theo quy định Thông tư 78\n• Implement tính thuế tự động (VAT, TNCN, TNDN) theo luật Việt Nam\n• Tích hợp với ngân hàng và cổng thuế VNPT/VIETTEL\n• Tối ưu hiệu suất báo cáo cho doanh nghiệp có data lớn`,
      `Bắt buộc: C# hoặc Java, SQL Server hoặc PostgreSQL, REST API. Ưu tiên: kế toán domain knowledge, hóa đơn điện tử, ERP systems, .NET Core.`,
      ['c#', 'java', 'sql server', 'rest api', 'docker', 'git', 'agile'], 'Mid-Senior level', 'Hanoi, Vietnam', '$1,500 - $3,000'),
  ],

  'Softdreams': [
    job('ERP Developer (FAST Software)',
      `Softdreams phát triển phần mềm kế toán E-invoice và FAST ERP. Bạn sẽ phát triển tính năng mới cho hệ thống ERP phục vụ doanh nghiệp vừa và lớn.\n\nTrách nhiệm:\n• Phát triển module ERP: kế toán, mua hàng, bán hàng, kho hàng\n• Xây dựng hóa đơn điện tử theo chuẩn Thông tư 78 và Nghị định 123\n• Implement báo cáo tài chính theo chuẩn VAS và IFRS\n• Tích hợp API với ngân hàng, thuế VNPT, và các sàn TMĐT\n• Hỗ trợ khách hàng kỹ thuật và tùy chỉnh theo yêu cầu`,
      `Bắt buộc: C# hoặc Java, SQL Server, REST API. Ưu tiên: kế toán domain, hóa đơn điện tử, Crystal Reports, kiến thức thuế Việt Nam.`,
      ['c#', 'java', 'sql server', 'rest api', 'html', 'css', 'git'], 'Associate', 'Hanoi, Vietnam', '$1,000 - $2,200'),
  ],

  // ── Infrastructure & Cloud ───────────────────────
  'CMC Technology': [
    job('Cloud Infrastructure Engineer',
      `CMC Technology vận hành một trong những data center lớn nhất Việt Nam và cung cấp dịch vụ cloud cho doanh nghiệp và chính phủ. Bạn sẽ xây dựng và vận hành CMC Cloud.\n\nTrách nhiệm:\n• Xây dựng và vận hành OpenStack-based private cloud cho enterprise\n• Quản lý VMware vSphere và vSAN cho dịch vụ IaaS\n• Implement network virtualization với VMware NSX và Cisco ACI\n• Xây dựng automation cho provisioning và configuration management\n• Đảm bảo SLA 99.99% uptime cho các khách hàng enterprise và chính phủ`,
      `Bắt buộc: Linux (RHEL/CentOS), VMware vSphere, networking (VLAN, BGP, VPN), scripting (Python/Bash). Ưu tiên: OpenStack, Kubernetes, Ansible/Puppet, data center operations.`,
      ['linux', 'python', 'kubernetes', 'docker', 'networking', 'devops', 'terraform', 'aws'], 'Mid-Senior level', 'Hanoi, Vietnam', '$1,800 - $3,500'),
  ],

  // ── Global IT Services ───────────────────────────
  'Bosch Global Software Technologies': [
    job('Automotive Software Engineer (C++/AUTOSAR)',
      `Bosch GST Việt Nam phát triển phần mềm cho xe hơi — từ ECU control software đến ADAS systems. Bạn sẽ làm việc với Bosch Đức để phát triển automotive software.\n\nTrách nhiệm:\n• Phát triển software component cho ECU (Electronic Control Unit) với C/C++\n• Implement AUTOSAR Classic và Adaptive platform software\n• Phát triển ADAS algorithms: lane detection, collision avoidance, park assist\n• Test phần mềm với HIL (Hardware-in-the-Loop) và SIL (Software-in-the-Loop)\n• Tuân thủ tiêu chuẩn ISO 26262 (Functional Safety) và ASPICE`,
      `Bắt buộc: C/C++ (3+ năm), kiến thức nhúng (RTOS, microcontroller), AUTOSAR Basic. Ưu tiên: AUTOSAR Adaptive (C++14/17), ADAS algorithms, ISO 26262, CAN/LIN/Ethernet automotive.`,
      ['c++', 'python', 'linux', 'algorithms', 'git', 'agile'], 'Mid-Senior level', 'Ho Chi Minh City, Vietnam', '$2,000 - $4,500'),

    job('IoT Platform Engineer',
      `Xây dựng IoT platform cho thiết bị Bosch — từ công nghiệp đến smart home. Bạn sẽ phát triển cloud connectivity và edge computing cho hàng triệu thiết bị IoT.\n\nTrách nhiệm:\n• Phát triển IoT device connectivity platform (MQTT, CoAP, AMQP)\n• Xây dựng Bosch IoT Suite trên AWS/Azure\n• Implement edge computing solutions với Docker trên industrial gateways\n• Phát triển digital twin models cho thiết bị công nghiệp\n• Xây dựng OTA update system cho firmware thiết bị IoT`,
      `Bắt buộc: Python hoặc Java, AWS IoT hoặc Azure IoT Hub, MQTT, Docker. Ưu tiên: Kubernetes, edge computing, embedded Linux, digital twin, industrial IoT protocols.`,
      ['python', 'java', 'aws', 'docker', 'kubernetes', 'rest api', 'linux', 'networking'], 'Mid-Senior level', 'Ho Chi Minh City, Vietnam', '$2,000 - $4,000'),
  ],

  'DXC Technology': [
    job('Cloud Migration Engineer',
      `DXC Technology cung cấp dịch vụ IT transformation cho Fortune 500. Bạn sẽ thực hiện cloud migration từ on-premise sang AWS/Azure cho các doanh nghiệp lớn.\n\nTrách nhiệm:\n• Đánh giá và lập kế hoạch migration workloads sang AWS/Azure\n• Refactor ứng dụng monolith sang microservices trước khi migrate\n• Thiết kế cloud architecture theo Well-Architected Framework\n• Thực hiện database migration (Oracle/SQL Server sang cloud-native)\n• Đào tạo client team về cloud best practices`,
      `Bắt buộc: AWS hoặc Azure (Solution Architect level), Terraform, Docker/Kubernetes, scripting. Ưu tiên: chứng chỉ cloud architect, database migration, DevOps practices, tiếng Anh tốt.`,
      ['aws', 'azure', 'kubernetes', 'docker', 'terraform', 'python', 'linux', 'devops'], 'Mid-Senior level', 'Ho Chi Minh City, Vietnam', '$2,500 - $5,000'),
  ],

  'Accenture': [
    job('Technology Consultant - Digital Transformation',
      `Accenture giúp các tập đoàn lớn chuyển đổi số. Bạn sẽ tư vấn và triển khai giải pháp công nghệ cho khách hàng trong các lĩnh vực banking, manufacturing, và retail.\n\nTrách nhiệm:\n• Phân tích quy trình nghiệp vụ và đề xuất giải pháp công nghệ\n• Triển khai ERP (SAP/Oracle) và CRM (Salesforce) cho doanh nghiệp lớn\n• Xây dựng roadmap chuyển đổi số và business case\n• Quản lý dự án và giao tiếp với C-suite của khách hàng\n• Phát triển POC và demo giải pháp công nghệ mới (AI, Cloud, Blockchain)`,
      `Bắt buộc: Kinh nghiệm IT consulting hoặc enterprise software, tiếng Anh C1+, project management. Ưu tiên: SAP/Salesforce, cloud platforms, PMP/PRINCE2, MBA hoặc consulting background.`,
      ['agile', 'scrum', 'aws', 'azure', 'sql', 'rest api', 'java', 'python'], 'Mid-Senior level', 'Ho Chi Minh City, Vietnam', '$2,500 - $5,000'),

    job('Data & AI Consultant',
      `Xây dựng giải pháp AI và phân tích dữ liệu cho khách hàng của Accenture trong các ngành banking, retail, và manufacturing.\n\nTrách nhiệm:\n• Thiết kế data strategy và AI roadmap cho khách hàng enterprise\n• Xây dựng data lake và analytics platform trên AWS/Azure\n• Phát triển ML models cho use cases: demand forecasting, churn prediction, fraud detection\n• Triển khai GenAI solutions (RAG, LLM fine-tuning) cho doanh nghiệp\n• Thuyết trình kết quả và insights cho C-suite`,
      `Bắt buộc: Python, SQL, cloud platforms (AWS/Azure), Machine Learning cơ bản, tiếng Anh tốt. Ưu tiên: Databricks/Snowflake, LLMs/GenAI, Data Science background, consulting experience.`,
      ['python', 'machine learning', 'sql', 'aws', 'azure', 'spark', 'deep learning', 'pandas'], 'Mid-Senior level', 'Ho Chi Minh City, Vietnam', '$2,500 - $5,500'),
  ],

  'Infosys': [
    job('Java Developer - Banking (BFSI)',
      `Infosys là tập đoàn IT Ấn Độ với trung tâm tại Việt Nam phục vụ khách hàng ngân hàng toàn cầu. Bạn sẽ phát triển banking software cho khách hàng châu Âu và Mỹ.\n\nTrách nhiệm:\n• Phát triển microservices cho hệ thống ngân hàng với Java/Spring Boot\n• Tích hợp Finacle core banking platform của Infosys\n• Xây dựng API cho mobile banking và open banking (PSD2)\n• Viết test cases và đảm bảo code quality theo Infosys standards\n• Làm việc với team onsite tại Mỹ/Anh theo mô hình offshore`,
      `Bắt buộc: Java/Spring Boot (3+ năm), microservices, PostgreSQL/Oracle, REST API, tiếng Anh tốt. Ưu tiên: banking domain (core banking, Finacle), Kafka, Docker, kinh nghiệm offshore model.`,
      ['java', 'spring boot', 'postgresql', 'rest api', 'docker', 'kafka', 'microservices', 'git'], 'Mid-Senior level', 'Ho Chi Minh City, Vietnam', '$1,500 - $3,000'),
  ],

  'Tata Consultancy Services': [
    job('Full Stack Developer (Angular + Spring Boot)',
      `TCS là công ty IT lớn nhất Ấn Độ với văn phòng tại Việt Nam. Bạn sẽ phát triển enterprise web applications cho khách hàng manufacturing và retail toàn cầu.\n\nTrách nhiệm:\n• Phát triển frontend với Angular và TypeScript\n• Xây dựng REST APIs với Spring Boot và Java\n• Thiết kế database với Oracle hoặc PostgreSQL\n• Tích hợp với SAP ERP và third-party services\n• Participate trong Agile ceremonies với team global (US, UK, India)`,
      `Bắt buộc: Angular, Java/Spring Boot, Oracle/PostgreSQL, REST API, tiếng Anh giao tiếp. Ưu tiên: TypeScript, Docker, SAP integration, AWS.`,
      ['java', 'spring boot', 'javascript', 'typescript', 'postgresql', 'rest api', 'docker', 'agile'], 'Associate', 'Ho Chi Minh City, Vietnam', '$1,200 - $2,500'),
  ],

  'Fujitsu': [
    job('IT Infrastructure Engineer',
      `Fujitsu là tập đoàn ICT Nhật Bản cung cấp giải pháp enterprise cho chính phủ và doanh nghiệp Nhật. Bạn sẽ xây dựng và vận hành infrastructure cho khách hàng Nhật Bản.\n\nTrách nhiệm:\n• Thiết kế và triển khai IT infrastructure cho doanh nghiệp Nhật\n• Quản lý Windows Server, VMware, và storage (NetApp/EMC)\n• Xây dựng monitoring và alerting với Zabbix hoặc Grafana\n• Migrate on-premise systems sang Fujitsu Cloud (hybrid cloud)\n• Viết tài liệu kỹ thuật tiếng Nhật và tiếng Anh`,
      `Bắt buộc: Windows Server, VMware vSphere, networking (VLAN, VPN), Linux cơ bản. Ưu tiên: Tiếng Nhật JLPT N3+, Azure, PowerShell scripting, ITIL certification.`,
      ['linux', 'networking', 'python', 'docker', 'aws', 'azure', 'devops', 'agile'], 'Associate', 'Hanoi, Vietnam', '$1,200 - $2,500'),
  ],

  // ── Smaller / Misc ───────────────────────────────
  'Samsung R&D': [
    job('Android Platform Engineer',
      `Samsung R&D Institute Vietnam phát triển các tính năng đặc sắc cho Galaxy smartphones. Bạn sẽ phát triển Android platform và hệ điều hành One UI.\n\nTrách nhiệm:\n• Phát triển Android framework features và system services\n• Xây dựng Samsung-specific features cho One UI (SmartThings, DeX, Gaming Hub)\n• Tối ưu hệ điều hành cho bộ xử lý Exynos và Snapdragon\n• Implement AI features on-device với Samsung Neural Processing\n• Contribute vào Android Open Source Project (AOSP)`,
      `Bắt buộc: Java/Kotlin Android (4+ năm), Android Framework và System Services, C++ JNI, Android build system (AOSP). Ưu tiên: Android HAL, kernel driver, Binder IPC, on-device ML (NPU/GPU).`,
      ['kotlin', 'java', 'android', 'c++', 'linux', 'python', 'algorithms', 'git'], 'Mid-Senior level', 'Hanoi, Vietnam', '$3,000 - $6,000'),

    job('AI Research Engineer',
      `Nghiên cứu và phát triển AI cho thiết bị Samsung: camera AI, on-device LLM, và Bixby assistant.\n\nTrách nhiệm:\n• Nghiên cứu on-device ML optimization: quantization, pruning, knowledge distillation\n• Phát triển computational photography algorithms (denoising, super-resolution)\n• Tối ưu LLM inference trên NPU của Exynos cho Galaxy AI features\n• Xây dựng và train models cho Bixby NLU và Bixby Vision\n• Publish kết quả tại CVPR, ICCV, ECCV`,
      `Bắt buộc: Python, PyTorch, Computer Vision hoặc NLP, on-device ML optimization. Ưu tiên: TFLite/ONNX, quantization-aware training, knowledge distillation, Samsung Exynos NPU SDK.`,
      ['python', 'pytorch', 'machine learning', 'deep learning', 'c++', 'linux', 'algorithms'], 'Mid-Senior level', 'Hanoi, Vietnam', '$3,500 - $7,000'),
  ],

  'Intel Vietnam': [
    job('Validation Engineer - CPU Architecture',
      `Intel Vietnam là trung tâm kiểm thử và validation lớn nhất của Intel ngoài Mỹ. Bạn sẽ validate CPU và chipset trước khi sản xuất hàng loạt.\n\nTrách nhiệm:\n• Thiết kế và thực hiện test plans cho CPU validation (functional, performance, power)\n• Phát triển automation frameworks để chạy validation tests\n• Debug hardware/software issues và phân tích root cause\n• Collaborate với design team ở Mỹ và Israel về bug resolution\n• Develop tools để phân tích post-silicon data`,
      `Bắt buộc: Python scripting, Linux, kiến thức computer architecture (CPU pipeline, memory hierarchy), debugging. Ưu tiên: x86 assembly, hardware validation, JTAG, signal integrity, tiếng Anh kỹ thuật.`,
      ['python', 'c++', 'linux', 'algorithms', 'git', 'agile'], 'Associate', 'Ho Chi Minh City, Vietnam', '$1,500 - $3,500'),
  ],

  'IBM': [
    job('Cloud Architect - IBM Cloud / Red Hat OpenShift',
      `IBM cung cấp giải pháp hybrid cloud và AI cho enterprise toàn cầu. Bạn sẽ thiết kế và triển khai IBM Cloud và Red Hat OpenShift cho khách hàng Việt Nam và Đông Nam Á.\n\nTrách nhiệm:\n• Thiết kế kiến trúc hybrid cloud với IBM Cloud và Red Hat OpenShift\n• Migrate enterprise workloads từ on-premise sang IBM Cloud\n• Implement IBM Watson AI services cho khách hàng banking và insurance\n• Xây dựng DevOps pipelines với IBM Tekton và ArgoCD\n• Tư vấn khách hàng về IBM Cloud Satellite và edge computing`,
      `Bắt buộc: Kubernetes/OpenShift, Terraform, AWS/Azure/IBM Cloud, tiếng Anh tốt. Ưu tiên: Red Hat certification, IBM Cloud architect, OpenShift Virtualization, Watson AI APIs.`,
      ['kubernetes', 'docker', 'terraform', 'aws', 'azure', 'linux', 'python', 'devops'], 'Mid-Senior level', 'Hanoi, Vietnam', '$3,000 - $6,000'),
  ],

  'Siemens': [
    job('Software Engineer - Industrial IoT (MindSphere)',
      `Siemens phát triển MindSphere — nền tảng Industrial IoT cho nhà máy thông minh. Bạn sẽ xây dựng cloud services kết nối thiết bị công nghiệp với cloud analytics.\n\nTrách nhiệm:\n• Phát triển MindSphere applications và APIs cho industrial IoT use cases\n• Xây dựng data ingestion pipelines từ PLC/SCADA systems\n• Implement industrial time-series analytics và predictive maintenance\n• Develop digital twin models cho thiết bị nhà máy\n• Integrate MindSphere với SAP Manufacturing và ERP systems`,
      `Bắt buộc: Python hoặc Java, REST API, cloud (AWS/Azure), time-series data. Ưu tiên: MQTT/OPC-UA industrial protocols, industrial IoT platforms, SAP integration, predictive maintenance ML models.`,
      ['python', 'java', 'aws', 'rest api', 'docker', 'kubernetes', 'sql', 'machine learning'], 'Mid-Senior level', 'Ho Chi Minh City, Vietnam', '$2,500 - $5,000'),
  ],

  // ── Social & Communication ───────────────────────
  'ByteDance': [
    job('Algorithm Engineer - Content Recommendation',
      `ByteDance phát triển TikTok — ứng dụng có hệ thống recommendation AI tốt nhất thế giới. Bạn sẽ xây dựng recommendation algorithms cho TikTok Việt Nam và toàn cầu.\n\nTrách nhiệm:\n• Thiết kế và train two-tower retrieval models cho video recommendation\n• Phát triển real-time feature engineering pipeline\n• Implement reinforcement learning cho long-term user engagement optimization\n• A/B test recommendation changes trên hàng triệu người dùng\n• Phân tích user engagement metrics và cải thiện thuật toán`,
      `Bắt buộc: Python, PyTorch/TensorFlow, recommendation systems, SQL, distributed training. Ưu tiên: TikTok/ByteDance internship, real-time feature stores, HNSW, RL for recommendations, Spark.`,
      ['python', 'machine learning', 'deep learning', 'pytorch', 'sql', 'spark', 'algorithms'], 'Mid-Senior level', 'Ho Chi Minh City, Vietnam', '$5,000 - $10,000'),
  ],

  'Sea Limited': [
    job('Software Engineer, Garena Game Platform',
      `Sea Limited vận hành Garena — nền tảng game lớn nhất Đông Nam Á với Free Fire và League of Legends. Bạn sẽ xây dựng gaming platform services.\n\nTrách nhiệm:\n• Phát triển game platform services: account, friends, matchmaking, anti-cheat\n• Xây dựng in-game payment và virtual currency systems\n• Scale backend systems cho hàng triệu concurrent players\n• Implement game analytics pipeline cho gameplay data\n• Build esports tournament platform và ranking systems`,
      `Required: Go or Java (3+ years), PostgreSQL, Redis, Kafka, experience with gaming platforms. Nice to have: real-time multiplayer systems, anti-cheat, payment integration, large-scale distributed systems.`,
      ['go', 'java', 'postgresql', 'redis', 'kafka', 'docker', 'kubernetes', 'algorithms'], 'Mid-Senior level', 'Ho Chi Minh City, Vietnam', '$3,500 - $7,000'),
  ],

  'Shopify': [
    job('Senior Backend Engineer, Core Commerce',
      `Shopify powers 10% of all e-commerce globally. You will build the core commerce APIs — products, orders, checkouts, and inventory — that millions of merchants rely on daily.\n\nResponsibilities:\n• Build and optimize product catalog APIs handling billions of SKUs\n• Design multi-currency, multi-location inventory systems\n• Implement Shopify's GraphQL API surface for admin and storefront\n• Build event-driven webhooks and Flow automation triggers\n• Scale checkout to handle Flash Sale traffic spikes`,
      `Required: Ruby on Rails or Go (4+ years), PostgreSQL, Redis, GraphQL API design, distributed systems. Nice to have: Kafka, Shopify internals, Liquid template engine, Shopify Partner ecosystem.`,
      ['ruby', 'go', 'postgresql', 'redis', 'graphql', 'docker', 'kubernetes', 'rest api'], 'Mid-Senior level', 'Remote (Vietnam)', '$6,000 - $11,000'),
  ],

  'Twilio': [
    job('Software Engineer, Programmable Messaging',
      `Twilio sends 300+ billion messages annually across SMS, WhatsApp, and email. You will build the messaging delivery engine that powers customer communications for companies like Airbnb and Uber.\n\nResponsibilities:\n• Build high-throughput SMS/MMS delivery pipeline (millions messages/minute)\n• Implement carrier-specific routing and failover logic\n• Develop WhatsApp Business API integration\n• Build deliverability monitoring and reporting\n• Create SDKs and code samples for 7 programming languages`,
      `Required: Java or Go (3+ years), distributed systems, messaging protocols (SMPP, HTTP), SQL. Nice to have: SMPP carrier experience, WhatsApp Business API, telephony platforms, multi-region deployment.`,
      ['java', 'go', 'postgresql', 'redis', 'kafka', 'rest api', 'docker', 'distributed systems'], 'Mid-Senior level', 'Ho Chi Minh City, Vietnam', '$5,000 - $9,000'),
  ],

  // ── Catch-all for companies with no specific mapping ─
  'Sun* Inc.': [
    job('Mobile Developer (React Native)',
      `Sun* là công ty công nghệ sáng tạo Nhật-Việt với 4,000+ kỹ sư. Bạn sẽ phát triển mobile apps cho khách hàng Nhật và startup Việt Nam.\n\nTrách nhiệm:\n• Phát triển cross-platform apps với React Native cho khách hàng Nhật\n• Implement complex UI/UX designs từ Figma\n• Tích hợp payment (Stripe, Apple Pay, Google Pay)\n• Viết unit tests với Jest và E2E tests với Detox\n• Collaborate với backend team (Ruby/Go) và khách hàng Nhật`,
      `Bắt buộc: React Native, TypeScript, iOS/Android knowledge, REST API. Ưu tiên: Tiếng Nhật, Redux, Expo, biometric auth, push notifications.`,
      ['react native', 'typescript', 'javascript', 'ios', 'android', 'rest api', 'git', 'agile'], 'Associate', 'Ho Chi Minh City, Vietnam', '$1,500 - $3,000'),
  ],

  'Vingroup': [
    job('Software Engineer - Smart City Platform',
      `Vingroup xây dựng hệ sinh thái Smart City cho Vinhomes và Vinpearl. Bạn sẽ phát triển platform quản lý tòa nhà thông minh và trải nghiệm cư dân.\n\nTrách nhiệm:\n• Phát triển platform IoT quản lý tòa nhà (HVAC, thang máy, camera AI)\n• Xây dựng mobile app cho cư dân: thanh toán phí, đặt tiện ích, an ninh\n• Integrate với các hệ thống Vingroup: VinID, VinShop, VinMec\n• Phát triển AI surveillance với camera nhận dạng khuôn mặt\n• Xây dựng energy management dashboard cho smart building`,
      `Bắt buộc: Java hoặc Go, PostgreSQL, REST API, IoT protocols (MQTT). Ưu tiên: IoT platforms, React Native, computer vision integration, smart building standards.`,
      ['java', 'go', 'postgresql', 'rest api', 'docker', 'kubernetes', 'machine learning', 'redis'], 'Mid-Senior level', 'Hanoi, Vietnam', '$2,000 - $4,000'),
  ],

  'TechNova Vietnam': [
    job('Full Stack Engineer (React + Python)',
      `TechNova Vietnam xây dựng sản phẩm SaaS cho thị trường Đông Nam Á. Bạn sẽ phát triển full-stack features cho nền tảng quản lý dự án và productivity.\n\nTrách nhiệm:\n• Phát triển frontend với React và TypeScript\n• Xây dựng REST APIs với Python (FastAPI/Django)\n• Thiết kế PostgreSQL schema và tối ưu queries\n• Triển khai ứng dụng lên AWS với Docker và Kubernetes\n• Viết unit tests và participate trong code reviews`,
      `Bắt buộc: React, Python (FastAPI/Django), PostgreSQL, REST API, Docker. Ưu tiên: TypeScript, AWS, Kubernetes, Redis, Celery.`,
      ['react', 'python', 'postgresql', 'rest api', 'docker', 'typescript', 'git', 'aws'], 'Associate', 'Ho Chi Minh City, Vietnam', '$1,200 - $2,800'),
  ],

  'CloudSync Solutions': [
    job('DevOps Engineer - Cloud Native',
      `CloudSync Solutions cung cấp giải pháp cloud và DevOps cho SMEs tại Việt Nam. Bạn sẽ xây dựng CI/CD và cloud infrastructure cho khách hàng.\n\nTrách nhiệm:\n• Thiết kế và triển khai CI/CD pipelines cho khách hàng\n• Quản lý Kubernetes clusters trên AWS/GCP cho SME\n• Xây dựng infrastructure as code với Terraform và Ansible\n• Implement monitoring và alerting với Prometheus và Grafana\n• Tư vấn và đào tạo khách hàng về DevOps best practices`,
      `Bắt buộc: AWS hoặc GCP, Docker, Kubernetes, Terraform, CI/CD, Linux. Ưu tiên: GitOps (ArgoCD/Flux), Helm, Python scripting, security (SOC 2).`,
      ['aws', 'kubernetes', 'docker', 'terraform', 'ci/cd', 'linux', 'python', 'devops'], 'Associate', 'Ho Chi Minh City, Vietnam', '$1,500 - $3,000'),
  ],

  'Grab': [
    job('Senior Backend Engineer, GrabFood',
      `Grab's food delivery handles millions of orders daily across Southeast Asia. You will build the order management, restaurant integration, and delivery dispatch systems.\n\nResponsibilities:\n• Design and build restaurant catalog management system at scale\n• Implement real-time order dispatch and delivery ETA optimization\n• Build promotions and voucher engine for GrabFood campaigns\n• Develop merchant analytics dashboard APIs\n• Scale the GrabFood backend for 11.11 and major campaign peaks`,
      `Required: Go or Java (4+ years), PostgreSQL, Redis, Kafka, gRPC. Nice to have: geospatial systems, large-scale food delivery experience, Kubernetes, real-time ETA modeling.`,
      ['go', 'java', 'postgresql', 'redis', 'kafka', 'grpc', 'kubernetes', 'docker'], 'Mid-Senior level', 'Ho Chi Minh City, Vietnam', '$4,500 - $8,000'),
  ],
};

// ═══════════════════════════════════════════════════
// Helper: build cleaned_text
// ═══════════════════════════════════════════════════
function buildCleanedText(title, description, skills_desc) {
  return `${title} ${description} ${skills_desc}`
    .toLowerCase()
    .replace(/[^\w\s#+\-.]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, 10000);
}

// ═══════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════
async function generateJobs() {
  console.log('🚀 Đang sinh jobs phù hợp cho từng công ty...\n');

  // Lấy danh sách công ty
  const companies = await db('companies').select('id', 'name', 'logo_url', 'website');
  const companyMap = {};
  companies.forEach(c => { companyMap[c.name.toLowerCase().trim()] = c; });

  let inserted = 0;
  let skipped = 0;

  for (const [companyName, jobs] of Object.entries(COMPANY_JOBS)) {
    const company = companyMap[companyName.toLowerCase().trim()];
    if (!company) {
      console.warn(`  ⚠️  Không tìm thấy: "${companyName}"`);
      skipped++;
      continue;
    }

    const rows = jobs.map(j => ({
      title: j.title,
      description: j.description,
      skills_desc: j.skills_desc,
      required_skills: `{${j.required_skills.join(',')}}`,
      experience_level: j.experience_level,
      location: j.location,
      salary_range: j.salary_range,
      company_id: company.id,
      company_name: company.name,
      job_url: company.website,
      is_active: true,
      indexed_in_pinecone: false,
      cleaned_text: buildCleanedText(j.title, j.description, j.skills_desc),
    }));

    await db('jobs').insert(rows);
    inserted += rows.length;
    console.log(`  ✅ ${company.name} (${rows.length} vị trí): ${rows.map(r => r.title.split(' ').slice(0, 4).join(' ')).join(' | ')}`);
  }

  const total = await db('jobs').count('id as count').first();
  console.log(`\n${'═'.repeat(55)}`);
  console.log(`📊 Tổng jobs trong DB: ${total.count}`);
  console.log(`✅ Đã thêm: ${inserted} jobs cho ${Object.keys(COMPANY_JOBS).length - skipped} công ty`);
  console.log(`💡 Khởi động lại AI worker để reindex!`);
  process.exit(0);
}

generateJobs().catch(err => {
  console.error('❌ Lỗi:', err.message);
  process.exit(1);
});
