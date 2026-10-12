import {
  Briefcase,
  Calendar,
  MapPin,
  CheckCircle2,
  Cpu,
  Terminal,
  Activity,
  ArrowUpRight,
  X,
  Sparkles,
} from "lucide-react";
import { useState, useMemo } from "react";
import { Badge } from "./ui/badge";
import ChromaGrid, { type ChromaItem } from "./ChromaGrid";

// Import 3D Tech Blueprint Artworks
import springImg from "../assets/skills/Gemini_Generated_Image_vvmerwvvmerwvvme.jfif";
import dataImg from "../assets/skills/Gemini_Generated_Image_lwkqb8lwkqb8lwkq.jfif";
import javaImg from "../assets/skills/Gemini_Generated_Image_f0oygtf0oygtf0oy.jfif";
import secImg from "../assets/skills/Gemini_Generated_Image_qhg3uwqhg3uwqhg3.jfif";
import cloudImg from "../assets/skills/Gemini_Generated_Image_o2u6eoo2u6eoo2u6.jfif";

interface ExperienceItem {
  id: string;
  title: string;
  company: string;
  location: string;
  period: string;
  isCurrent?: boolean;
  roleBadge: string;
  summary: string;
  technologies: string[];
  metrics: { label: string; val: string; sub?: string }[];
  achievements: string[];
}

export interface DevelopmentWorkSlide {
  id: string;
  company: string;
  role: string;
  badgeCode: string;
  title: string;
  shortBio: string;
  image: string;
  technologies: string[];
  metrics: { label: string; val: string; sub?: string }[];
  color: {
    primary: string;
    accent: string;
    glow: string;
    border: string;
    chipBg: string;
  };
  architecture: {
    title: string;
    description: string;
    nodes: { name: string; role: string; type: "client" | "gateway" | "service" | "db" | "cloud" }[];
  };
  keyPillars: {
    title: string;
    story: string;
    bullets: string[];
  }[];
  codeSnippet?: {
    filename: string;
    language: string;
    code: string;
  };
}

function calculateExperienceYears(startDate: string): number {
  const start = new Date(startDate);
  const now = new Date();
  const elapsedMs = now.getTime() - start.getTime();
  return elapsedMs / (1000 * 60 * 60 * 24 * 365.25);
}

function formatExperienceYears(startDate: string): string {
  const years = calculateExperienceYears(startDate);
  if (years >= 1) {
    return `${years.toFixed(1).replace(/\.0$/, "")}+ Yrs`;
  }
  return `${Math.max(1, Math.round(years * 12))} Months`;
}

const EXPERIENCES: ExperienceItem[] = [
  {
    id: "fintech",
    title: "Senior Software Developer",
    company: "Fintech",
    location: "Dublin, Ireland",
    period: "July 2023 – Present",
    isCurrent: true,
    roleBadge: "ENTERPRISE CORE // FINANCIAL BACKBONE",
    summary:
      "Spearheading enterprise-grade financial backbones, mission-critical Spring Boot microservices, immutable audit ledgers, and responsive React web portals under strict zero-defect financial regulatory standards.",
    technologies: [
      "Java 17+",
      "Spring Boot 3",
      "React 19",
      "TypeScript",
      "Hibernate Envers",
      "Red Hat OpenShift",
      "Helm",
      "PostgreSQL",
      "REST APIs",
      "OAuth 2.0",
      "Python",
    ],
    metrics: [
      { label: "Platform SLA", val: "99.99%", sub: "High Availability" },
      { label: "P99 API Latency", val: "< 50ms", sub: "Optimized Throughput" },
      { label: "Audit Accuracy", val: "100%", sub: "Hibernate Envers" },
      { label: "Daily Req", val: "10M+", sub: "Production Volume" },
    ],
    achievements: [
      "Developed and maintained RESTful APIs using Java Spring Boot, JPA, and Hibernate for high-traffic financial applications, ensuring scalability, low-latency throughput, and system resilience.",
      "Implemented comprehensive entity auditing with Hibernate Envers to monitor data changes, generate audit trails, and maintain immutable historical records for compliance.",
      "Built a Spring Boot console application to automate daily financial data feed generation, improving workflow efficiency and eliminating manual operations.",
      "Refactored React.js front-end code to remove unused components and simplify spaghetti architecture, improving code maintainability and user response times.",
      "Created dynamic, responsive front-end interfaces using React.js, Vite, and TypeScript, delivering streamlined user experience across core trading workflows.",
      "Implemented end-to-end OAuth 2.0 authentication and RBAC authorization for both backend (Spring Boot) and frontend (React), enforcing zero-trust security.",
      "Developed Python automation scripts to streamline repetitive operational tasks, accelerating data reconciliation and reporting.",
      "Participated actively in Agile ceremonies, backlog grooming, and collaborated with cross-functional global engineering teams to deliver features on schedule.",
      "Conducted rigorous peer code reviews, profiling, and proactive refactoring of performance-critical bottlenecks to guarantee zero-defect releases.",
    ],
  },
  {
    id: "infosys",
    title: "Systems Engineer",
    company: "Infosys Ltd.",
    location: "India",
    period: "Dec 2019 – Jan 2022",
    isCurrent: false,
    roleBadge: "CLOUD PLATFORMS // ETL PIPELINES",
    summary:
      "Architected cloud-native ETL data pipelines and serverless automation frameworks across AWS and Azure, orchestrating high-volume transformations and dynamic query engines.",
    technologies: [
      "Python 3",
      "AWS EC2",
      "AWS Lambda",
      "Amazon MWAA",
      "Azure Data Factory",
      "DBT",
      "Azure Functions",
      "AWS Secrets Manager",
      "SQL",
      "Flask",
    ],
    metrics: [
      { label: "Transform Volume", val: "10TB+", sub: "Daily Throughput" },
      { label: "Pipeline Reliability", val: "99.9%", sub: "Managed Airflow" },
      { label: "SQL Query Gen", val: "Sub-Sec", sub: "Jinja Templates" },
      { label: "Manual Effort", val: "-80%", sub: "Automated Workflows" },
    ],
    achievements: [
      "Developed and tested web applications hosted on Amazon EC2 to orchestrate ETL workflows using Python, AWS Lambda functions, and DBT, ensuring efficient and reliable data transformation following Agile practices.",
      "Built and managed production ETL workflows using Amazon Managed Workflows for Apache Airflow (MWAA) and Azure Data Factory to automate pipeline orchestration and scheduling.",
      "Engineered dynamic SQL query generation using Python, Jinja templates, Azure serverless functions, and Blob storage driven by frontend user parameters, delivering automated and flexible data processing.",
      "Gained hands-on experience across cloud technologies including AWS Secrets Manager, Flask APIs, and Django to build secure backend services and data pipelines.",
    ],
  },
];

const ARCHITECTURE_BLUEPRINTS: DevelopmentWorkSlide[] = [
  {
    id: "fintech-core",
    company: "Fintech",
    role: "Senior Software Developer",
    badgeCode: "ENTERPRISE CORE // FINANCIAL BACKBONE",
    title: "High-Throughput Financial REST Services & Immutable Audits",
    shortBio:
      "Enterprise financial backbones, mission-critical Spring Boot REST services, and high-performance React frontends under strict zero-defect regulatory compliance.",
    image: springImg,
    technologies: [
      "Java 17+",
      "Spring Boot 3",
      "React 19",
      "TypeScript",
      "Hibernate Envers",
      "Red Hat OpenShift",
      "Helm",
      "PostgreSQL",
    ],
    metrics: [
      { label: "Platform SLA", val: "99.99%", sub: "High Availability" },
      { label: "P99 API Latency", val: "< 50ms", sub: "Optimized Throughput" },
      { label: "Audit Accuracy", val: "100%", sub: "Hibernate Envers" },
      { label: "Daily Transactions", val: "10M+ Req", sub: "Enterprise Scale" },
    ],
    color: {
      primary: "#426A8C",
      accent: "#2D4C66",
      glow: "rgba(66, 106, 140, 0.35)",
      border: "rgba(66, 106, 140, 0.45)",
      chipBg: "rgba(66, 106, 140, 0.12)",
    },
    architecture: {
      title: "Enterprise Resilient Microservices Mesh",
      description:
        "High-throughput transactional architecture decoupling frontend consumers from core ledger systems through zero-trust security and immutable historical revision stores.",
      nodes: [
        { name: "React 19 SPA (Vite + TS)", role: "Client Portal Layer", type: "client" },
        { name: "OAuth 2.0 Security Gateway", role: "RBAC & Cryptographic Handshake", type: "gateway" },
        { name: "Spring Boot Microservices Cluster", role: "Transactional Processing Mesh", type: "service" },
        { name: "Hibernate Envers Audit Store", role: "Immutable Historical Ledger", type: "db" },
        { name: "Red Hat OpenShift & Helm", role: "Kubernetes Container Mesh", type: "cloud" },
      ],
    },
    keyPillars: [
      {
        title: "Zero-Defect Financial Core Services",
        story:
          "Engineered resilient, multi-threaded Spring Boot REST microservices handling millions of daily events. Standardized validation, error masking, and graceful degradations to achieve 99.99% availability.",
        bullets: [
          "Implemented comprehensive connection pooling and JPA performance indexing.",
          "Decoupled asynchronous operations using concurrent task executors and circuit breakers.",
          "Streamlined zero-downtime rolling updates via OpenShift Helm release charts.",
        ],
      },
      {
        title: "Regulatory Entity Auditing (Hibernate Envers)",
        story:
          "Architected complete revision-tracking architecture using Hibernate Envers. Every database insert, update, or delete automatically persists immutable temporal snapshot deltas with cryptographic author attribution.",
        bullets: [
          "Zero overhead on critical write path using asynchronous revision listener dispatch.",
          "100% compliance with financial regulatory inspection and data-lineage mandates.",
          "Sub-10ms query execution on historical temporal reconstruction queries.",
        ],
      },
    ],
    codeSnippet: {
      filename: "AuditRevisionListener.java",
      language: "java",
      code: `@Entity
@RevisionEntity(SecurityRevisionListener.class)
public class AuditRevisionEntity extends DefaultRevisionEntity {
    @Column(name = "principal_user_id", nullable = false)
    private String principalUserId;
    
    @Column(name = "client_ip", nullable = false)
    private String clientIp;
    
    @Column(name = "correlation_id", nullable = false)
    private String correlationId;
    
    // Immutable snapshot of caller context across transactions
}`,
    },
  },
  {
    id: "infosys-etl",
    company: "Infosys Ltd.",
    role: "Systems Engineer",
    badgeCode: "CLOUD DATA MESH // MULTI-CLOUD PIPELINE",
    title: "Multi-Cloud ETL Orchestration & Dynamic SQL Synthesis",
    shortBio:
      "Automated enterprise data ingestion pipelines processing 10TB+ daily using AWS EC2, MWAA Managed Airflow, Azure Data Factory, DBT, and serverless Jinja query generation.",
    image: dataImg,
    technologies: [
      "Python 3",
      "AWS EC2",
      "Amazon MWAA",
      "Azure Data Factory",
      "DBT",
      "AWS Lambda",
      "Azure Functions",
      "AWS Secrets Manager",
    ],
    metrics: [
      { label: "Daily Data Ingestion", val: "10TB+", sub: "Scalable Throughput" },
      { label: "Query Synthesis", val: "< 80ms", sub: "Dynamic SQL Engine" },
      { label: "Manual Effort Reduced", val: "80%", sub: "Automated DAGs" },
      { label: "Pipeline Reliability", val: "99.9%", sub: "MWAA Managed DAGs" },
    ],
    color: {
      primary: "#527C9F",
      accent: "#3A5C78",
      glow: "rgba(82, 124, 159, 0.35)",
      border: "rgba(82, 124, 159, 0.45)",
      chipBg: "rgba(82, 124, 159, 0.12)",
    },
    architecture: {
      title: "Bi-Cloud Ingestion & Dynamic Transformation Fabric",
      description:
        "Unified data mesh running automated DAG orchestrations between AWS EC2/MWAA and Azure Data Factory, transforming unstructured source feeds into high-speed analytics tables.",
      nodes: [
        { name: "Frontend Query Console", role: "User Parameter Input Surface", type: "client" },
        { name: "Azure Serverless Functions", role: "Jinja Template Engine", type: "service" },
        { name: "Amazon MWAA (Airflow)", role: "DAG Dependency Scheduler", type: "gateway" },
        { name: "DBT Model Transformations", role: "In-Warehouse Compute", type: "service" },
        { name: "AWS Secrets Manager", role: "Zero-Trust Credential Store", type: "db" },
      ],
    },
    keyPillars: [
      {
        title: "Dynamic SQL Query Synthesis with Jinja2",
        story:
          "Eliminated hundreds of brittle manual SQL scripts by inventing a dynamic Jinja query generation engine. Business analysts select parameters in the frontend; Azure serverless functions compile optimized SQL transforms.",
        bullets: [
          "Saved over 80% of analyst preparation time with parameterized template pipelines.",
          "Automatic SQL syntax sanitization protecting against injection attacks.",
          "Integrated seamless output serialization directly into Azure Blob storage.",
        ],
      },
      {
        title: "Enterprise Airflow & Azure Data Factory Mesh",
        story:
          "Engineered end-to-end resilient DAGs running across Amazon Managed Airflow and Azure Data Factory. Integrated automatic exponential backoff retry policies and Slack alerts.",
        bullets: [
          "Orchestrated complex multi-stage dependency graphs across hybrid cloud silos.",
          "Sub-minute failure notification via AWS SNS and webhook notifications.",
          "Secured all database credentials using AWS Secrets Manager with zero plain text tokens.",
        ],
      },
    ],
    codeSnippet: {
      filename: "dynamic_sql_generator.py",
      language: "python",
      code: `import jinja2
from azure.storage.blob import BlobServiceClient

def generate_partitioned_query(table_name: str, filters: dict, group_cols: list) -> str:
    template_str = """
    SELECT {{ group_cols | join(', ') }}, COUNT(*) as total_records
    FROM {{ table_name }}
    WHERE 1=1
    {% for key, val in filters.items() %}
      AND {{ key }} = '{{ val }}'
    {% endfor %}
    GROUP BY {{ group_cols | join(', ') }}
    """
    env = jinja2.Environment(autoescape=True)
    template = env.from_string(template_str)
    return template.render(table_name=table_name, filters=filters, group_cols=group_cols)`,
    },
  },
  {
    id: "fintech-console",
    company: "Fintech",
    role: "Senior Software Developer",
    badgeCode: "AUTOMATION ENGINE // REAL-TIME DISPATCH",
    title: "Spring Boot Console Automation & Feed Dispatcher",
    shortBio:
      "Automated data feed generation and high-volume dispatch pipeline converting manual operational procedures into unattended Spring Boot console workers.",
    image: javaImg,
    technologies: [
      "Java 17+",
      "Spring Boot 3",
      "Spring Batch",
      "Cron Scheduling",
      "PostgreSQL",
      "Linux Shell",
      "OpenShift",
    ],
    metrics: [
      { label: "Dispatch Frequency", val: "Real-time", sub: "Scheduled Cron" },
      { label: "Manual Interventions", val: "Zero", sub: "100% Unattended" },
      { label: "Execution Time", val: "3.2s", sub: "Parallel Chunking" },
      { label: "Data Integrity", val: "100%", sub: "Cryptographic Checksum" },
    ],
    color: {
      primary: "#52606D",
      accent: "#3B4854",
      glow: "rgba(82, 96, 109, 0.35)",
      border: "rgba(82, 96, 109, 0.45)",
      chipBg: "rgba(82, 96, 109, 0.12)",
    },
    architecture: {
      title: "Scheduled High-Concurrency Dispatch Engine",
      description:
        "Headless Spring Boot automation container deployed as an OpenShift scheduled job, pulling ledger feeds and streaming verified records to downstream consumers.",
      nodes: [
        { name: "OpenShift CronJob Spec", role: "Trigger & Execution Controller", type: "cloud" },
        { name: "Spring Boot Console App", role: "Headless Batch Runtime", type: "service" },
        { name: "Database Cursor Stream", role: "Chunked Record Extractor", type: "db" },
        { name: "Checksum Verifier", role: "Payload Security Validator", type: "gateway" },
        { name: "SFTP / API Transport", role: "Downstream Egress Target", type: "client" },
      ],
    },
    keyPillars: [
      {
        title: "Autonomous Feed Generation",
        story:
          "Replaced manual reporting steps with an event-driven Spring Boot console application. The application reads transactional records in streamed chunks, verifies cryptographic hash signatures, and dispatches feeds without manual intervention.",
        bullets: [
          "Zero human operator bottlenecks across daily reconciliation cycles.",
          "Fault-tolerant chunk processing that resumes interrupted runs without duplication.",
          "Integrated Prometheus metrics capturing records per second and memory utilization.",
        ],
      },
    ],
  },
  {
    id: "auth-shield",
    company: "Fintech",
    role: "Senior Software Developer",
    badgeCode: "ZERO-TRUST // IDENTITY SHIELD",
    title: "OAuth 2.0 Full-Stack Security & RBAC Gateway",
    shortBio:
      "Enterprise zero-trust authentication and fine-grained role-based access control protecting critical financial APIs across Spring Boot and React applications.",
    image: secImg,
    technologies: [
      "Spring Security 6",
      "OAuth 2.0 / OIDC",
      "JWT Validation",
      "React 19 Security",
      "PKCE Handshake",
      "CSRF Shields",
    ],
    metrics: [
      { label: "Auth Handshake", val: "< 15ms", sub: "Fast Crypto Validation" },
      { label: "Security Vulnerabilities", val: "0", sub: "Strict Sonar / Fortify" },
      { label: "Token Life Cycle", val: "Rotating", sub: "Short-Lived Claims" },
      { label: "RBAC Enforcements", val: "100%", sub: "Method-Level Guards" },
    ],
    color: {
      primary: "#6388A6",
      accent: "#4A6D8A",
      glow: "rgba(99, 136, 166, 0.35)",
      border: "rgba(99, 136, 166, 0.45)",
      chipBg: "rgba(99, 136, 166, 0.12)",
    },
    architecture: {
      title: "End-to-End Cryptographic Token Exchange",
      description:
        "Rigorous PKCE authentication flow between React SPA and enterprise Identity Provider, validated seamlessly by Spring Boot resource servers.",
      nodes: [
        { name: "React Browser Context", role: "PKCE Challenge Generator", type: "client" },
        { name: "Enterprise IDP", role: "Authorization Server & JWKS", type: "gateway" },
        { name: "Spring Security Filter Chain", role: "Bearer JWT Introspector", type: "service" },
        { name: "Method Security (@PreAuthorize)", role: "Fine-Grained Role Guard", type: "service" },
        { name: "Audit Security Trail", role: "Access Log Recorder", type: "db" },
      ],
    },
    keyPillars: [
      {
        title: "Rigorous Zero-Trust Enforcement",
        story:
          "Secured all incoming API traffic with cryptographically signed tokens. Replaced long-lived sessions with automatic silent refresh rotations and method-level security guards.",
        bullets: [
          "Zero plain text credentials stored in browser localStorage or cookies.",
          "Dynamic permission evaluation supporting complex departmental segregation of duties.",
          "Passed all internal ethical hacking penetration audits with zero findings.",
        ],
      },
    ],
  },
  {
    id: "devops-mesh",
    company: "Fintech",
    role: "Senior Software Developer",
    badgeCode: "CONTAINER PLATFORMS // OPENSHIFT HELM",
    title: "OpenShift Helm Deployments & CI/CD Pipeline Automation",
    shortBio:
      "Modernized container orchestration and automated GitOps release workflows deploying microservices onto Red Hat OpenShift Kubernetes clusters.",
    image: cloudImg,
    technologies: [
      "Red Hat OpenShift",
      "Helm 3 Charts",
      "Kubernetes",
      "Docker Containers",
      "Jenkins CI/CD",
      "SonarQube",
      "Splunk Monitoring",
    ],
    metrics: [
      { label: "Deployment Downtime", val: "0 min", sub: "Rolling Deployments" },
      { label: "Build to Deploy Time", val: "4.5m", sub: "Optimized Pipelines" },
      { label: "Container Startup", val: "1.8s", sub: "JVM JIT Optimized" },
      { label: "Health Checks", val: "100%", sub: "Liveness / Readiness" },
    ],
    color: {
      primary: "#465B6E",
      accent: "#304252",
      glow: "rgba(70, 91, 110, 0.35)",
      border: "rgba(70, 91, 110, 0.45)",
      chipBg: "rgba(70, 91, 110, 0.12)",
    },
    architecture: {
      title: "Resilient Kubernetes Production Ingress & Pod Mesh",
      description:
        "High-availability OpenShift deployment blueprint leveraging parameterized Helm charts, automated horizontal pod autoscalers, and zero-downtime rolling upgrades.",
      nodes: [
        { name: "Jenkins Declarative Pipeline", role: "Build & Image Builder", type: "service" },
        { name: "Enterprise Image Registry", role: "Immutable Digest Store", type: "cloud" },
        { name: "OpenShift Helm Controller", role: "Declarative Release Manager", type: "gateway" },
        { name: "Kubernetes Pod Replica Set", role: "Multi-Zone High Availability", type: "service" },
        { name: "Splunk & Prometheus Mesh", role: "Real-time Telemetry & Logs", type: "db" },
      ],
    },
    keyPillars: [
      {
        title: "Standardized Helm Packaging",
        story:
          "Consolidated dozens of disparate Kubernetes deployment manifests into unified, reusable Helm charts with environment-specific values overlays.",
        bullets: [
          "Eliminated environment configuration drift across SIT, UAT, and Production.",
          "Built-in health probes ensure traffic only routes to fully warmed JVM instances.",
          "Single-command rollback capabilities for ultimate production peace of mind.",
        ],
      },
    ],
  },
];

export function Experience() {
  const [activeTab, setActiveTab] = useState<"timeline" | "blueprints">("timeline");
  const [activeBlueprintId, setActiveBlueprintId] = useState<string>("fintech-core");
  const [inspectModalSlide, setInspectModalSlide] = useState<DevelopmentWorkSlide | null>(null);

  const activeBlueprint =
    ARCHITECTURE_BLUEPRINTS.find((b) => b.id === activeBlueprintId) ||
    ARCHITECTURE_BLUEPRINTS[0];

  // Map 5 Architectural Blueprints into ChromaGrid items
  const chromaItems: ChromaItem[] = useMemo(() => {
    return ARCHITECTURE_BLUEPRINTS.map((work) => ({
      id: work.id,
      image: work.image,
      title: work.title,
      subtitle: work.shortBio,
      badge: work.badgeCode,
      company: work.company,
      role: work.role,
      accent: work.color.primary,
      borderColor: work.color.primary,
      metrics: work.metrics,
      technologies: work.technologies,
      isActive: work.id === activeBlueprintId,
      onClick: () => {
        setActiveBlueprintId(work.id);
      },
    }));
  }, [activeBlueprintId]);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 min-h-screen bg-transparent relative select-none">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* =========================================================================
            HEADER & VIEW MODE SWITCHER
           ========================================================================= */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border/60">
          <div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground">
              Professional Experience
            </h2>
            <div className="flex items-center gap-3 mt-3">
              <span className="text-xs font-mono font-bold text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-md">
                DUBLIN, IRELAND • {formatExperienceYears("2019-12-01")} TOTAL CAREER
              </span>
              <span className="text-xs font-mono text-muted-foreground hidden sm:inline">
                Fintech Senior Software Developer & Infosys Systems Engineer
              </span>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center p-1 rounded-xl bg-card/80 border border-border/60 backdrop-blur-md shadow-sm shrink-0">
            <button
              onClick={() => setActiveTab("timeline")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                activeTab === "timeline"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Full Career Dossier</span>
            </button>
            <button
              onClick={() => setActiveTab("blueprints")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                activeTab === "blueprints"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Development Works (5)</span>
            </button>
          </div>
        </div>

        {/* =========================================================================
            EXECUTIVE CAREER METRICS RIBBON
           ========================================================================= */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: "Years in Industry",
              val: formatExperienceYears("2019-12-01"),
              sub: "Enterprise Engineering",
              color: "text-primary",
            },
            {
              label: "Global Enterprise",
              val: "Fintech",
              sub: "Fintech Dublin",
              color: "text-foreground",
            },
            {
              label: "Cloud & Systems",
              val: "Infosys",
              sub: "Cloud & Data Pipelines",
              color: "text-primary/90",
            },
            {
              label: "Core Architecture",
              val: "Java / React",
              sub: "Spring Boot, OpenShift, AWS",
              color: "text-primary",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="p-4 rounded-2xl bg-card/60 backdrop-blur-xl border border-border/50 shadow-sm flex flex-col justify-between"
            >
              <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                {stat.label}
              </span>
              <div className={`text-2xl sm:text-3xl font-black my-1.5 ${stat.color}`}>
                {stat.val}
              </div>
              <span className="text-[11px] font-mono text-muted-foreground">
                {stat.sub}
              </span>
            </div>
          ))}
        </div>

        {/* =========================================================================
            VIEW 1: FULL CAREER DOSSIER & PROFESSIONAL SUMMARY (DEFAULT)
           ========================================================================= */}
        {activeTab === "timeline" && (
          <div className="space-y-10">
            {/* Executive Summary Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-card/90 via-card/60 to-transparent border border-border/70 backdrop-blur-xl shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
              <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-primary">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span>Executive Professional Summary</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-foreground">
                  Senior Full-Stack Software Developer & Enterprise Systems Architect
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-4xl">
                  Experienced Software Developer with over 6 years of expertise architecting high-throughput financial backbones, mission-critical Spring Boot RESTful services, and modern reactive frontends under strict zero-defect regulatory compliance at <strong className="text-foreground">Fintech</strong>. Proven background in cloud ETL data engineering, automated pipeline orchestration with AWS Managed Airflow and Azure Data Factory at <strong className="text-foreground">Infosys Ltd.</strong>, and implementing zero-trust OAuth 2.0 authorization back-to-front. Dedicated to clean architecture, sub-50ms API response times, and automated containerized delivery on Red Hat OpenShift.
                </p>
              </div>
            </div>

            {/* Comprehensive Company Career Stops */}
            <div className="space-y-8">
              {EXPERIENCES.map((exp, index) => (
                <div
                  key={exp.id}
                  className="rounded-3xl border border-border/60 bg-card/85 dark:bg-[#20252B]/85 backdrop-blur-xl p-6 sm:p-8 shadow-xl relative overflow-hidden transition-all hover:border-primary/40"
                >
                  {/* Subtle top iridescent hairline */}
                  <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

                  {/* Header Row */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-border/50">
                    <div>
                      <div className="flex flex-wrap items-center gap-2.5 mb-2">
                        <span className="text-[10px] font-mono font-bold tracking-widest px-2.5 py-1 rounded-md uppercase bg-primary/10 text-primary border border-primary/20">
                          {exp.roleBadge}
                        </span>
                        {exp.isCurrent && (
                          <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-md uppercase bg-primary/15 text-primary border border-primary/30 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                            CURRENT ROLE
                          </span>
                        )}
                        <span className="text-xs font-mono text-muted-foreground">
                          CAREER STOP 0{index + 1}
                        </span>
                      </div>

                      <h3 className="text-2xl sm:text-3xl font-black text-foreground">
                        {exp.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 text-sm font-semibold text-muted-foreground mt-1">
                        <span className="text-primary font-bold text-base">{exp.company}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1 font-normal text-xs font-mono">
                          <MapPin className="w-3.5 h-3.5 text-primary" />
                          {exp.location}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 font-normal text-xs font-mono">
                          <Calendar className="w-3.5 h-3.5 text-primary" />
                          {exp.period}
                        </span>
                      </div>
                    </div>

                    {/* Live Metrics Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono">
                      {exp.metrics.map((m, mIdx) => (
                        <div
                          key={mIdx}
                          className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-border/40 text-left"
                        >
                          <div className="text-base sm:text-lg font-black text-primary">
                            {m.val}
                          </div>
                          <div className="text-[9px] uppercase text-muted-foreground">
                            {m.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Summary */}
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed my-5">
                    {exp.summary}
                  </p>

                  {/* Full Un-truncated Accomplishments List */}
                  <div className="space-y-3 pt-2 pb-6 border-b border-border/50">
                    <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-3">
                      <Briefcase className="w-3.5 h-3.5 text-primary" />
                      <span>Production Engineering Achievements & Responsibilities</span>
                    </div>
                    <ul className="grid gap-3">
                      {exp.achievements.map((item, itemIdx) => (
                        <li
                          key={itemIdx}
                          className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground group"
                        >
                          <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5 transition-transform group-hover:scale-110" />
                          <span className="text-foreground/90">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Technologies Tags */}
                  <div className="pt-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap gap-1.5">
                      {exp.technologies.map((tech) => (
                        <Badge
                          key={tech}
                          variant="secondary"
                          className="rounded-lg border border-border/50 bg-black/5 dark:bg-white/5 px-2.5 py-1 text-xs font-mono font-medium text-foreground/80"
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>

                    <button
                      onClick={() => {
                        const targetWork = ARCHITECTURE_BLUEPRINTS.find(
                          (w) => w.company.toLowerCase().includes(exp.id) || w.id.includes(exp.id)
                        );
                        if (targetWork) {
                          setInspectModalSlide(targetWork);
                        }
                      }}
                      className="px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 text-primary hover:bg-primary/10 transition-all cursor-pointer border border-primary/30"
                    >
                      <Cpu className="w-3.5 h-3.5" />
                      <span>Inspect Architecture Blueprint</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            VIEW 2: DEVELOPMENT WORKS ARCHITECTURAL BLUEPRINTS WITH CHROMA GRID
           ========================================================================= */}
        {activeTab === "blueprints" && (
          <div className="space-y-10 animate-in fade-in duration-300">
            {/* ChromaGrid Section Header & Controller */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-card/70 dark:bg-[#20252B]/70 border border-border/60 backdrop-blur-xl">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-foreground flex items-center gap-2.5">
                    <Sparkles className="w-5 h-5 text-primary" />
                    <span>Development Works Matrix</span>
                  </h3>
                  <p className="text-xs font-mono text-muted-foreground mt-1">
                    Powered by React Bits Chroma Grid • Move cursor to reveal color spotlight • Click card to inspect topology
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0 font-mono text-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                  <span className="text-foreground font-bold">5 ARCHITECTURAL BLUEPRINTS</span>
                </div>
              </div>

              {/* The Interactive ChromaGrid from React Bits */}
              <ChromaGrid
                items={chromaItems}
                columns={3}
                minCardWidth={280}
                gap={16}
                radius={320}
                softness={0.65}
                damping={0.4}
                fadeOut={0.6}
                glow={0.65}
                borderGlow={1}
                aspectRatio="16 / 10"
                cardRadius={22}
                onItemClick={(item) => {
                  if (item.id) setActiveBlueprintId(item.id);
                }}
              />
            </div>

            {/* Selected Blueprint Feature Showcase */}
            <div
              className="rounded-3xl p-6 sm:p-10 border bg-card/85 dark:bg-[#20252B]/90 backdrop-blur-2xl shadow-2xl space-y-8 relative overflow-hidden transition-all duration-500"
              style={{
                borderColor: activeBlueprint.color.primary,
                boxShadow: `0 0 50px -15px ${activeBlueprint.color.glow}`,
              }}
            >
              {/* Header */}
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-6 border-b border-border/50">
                <div className="space-y-2">
                  <div
                    className="text-xs font-mono font-bold tracking-widest uppercase"
                    style={{ color: activeBlueprint.color.primary }}
                  >
                    {activeBlueprint.badgeCode}
                  </div>
                  <h3 className="text-2xl sm:text-4xl font-black text-foreground">
                    {activeBlueprint.title}
                  </h3>
                  <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                    <span style={{ color: activeBlueprint.color.primary }}>{activeBlueprint.company}</span>
                    <span>•</span>
                    <span>{activeBlueprint.role}</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl pt-2">
                    {activeBlueprint.shortBio}
                  </p>
                </div>

                <button
                  onClick={() => setInspectModalSlide(activeBlueprint)}
                  className="px-5 py-3 rounded-2xl text-xs font-mono font-bold flex items-center gap-2 text-white cursor-pointer shadow-lg hover:scale-105 transition-all self-start shrink-0"
                  style={{ backgroundColor: activeBlueprint.color.primary }}
                >
                  <Cpu className="w-4 h-4" />
                  <span>Inspect Full Blueprint Topology</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
                {activeBlueprint.metrics.map((m, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-border/40"
                  >
                    <div
                      className="text-xl sm:text-2xl font-black"
                      style={{ color: activeBlueprint.color.primary }}
                    >
                      {m.val}
                    </div>
                    <div className="text-[10px] uppercase text-muted-foreground mt-1">
                      {m.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Live Mesh Nodes */}
              <div className="space-y-3">
                <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-primary" />
                  <span>Distributed Architecture Mesh Topology</span>
                </div>
                <div className="grid sm:grid-cols-5 gap-3">
                  {activeBlueprint.architecture.nodes.map((node, nIdx) => (
                    <div
                      key={nIdx}
                      className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-border/50 flex flex-col justify-between space-y-2 group hover:border-primary/50 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-muted-foreground">
                          NODE 0{nIdx + 1}
                        </span>
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: activeBlueprint.color.primary }}
                        />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-foreground leading-tight">
                          {node.name}
                        </div>
                        <div className="text-[10px] text-muted-foreground mt-0.5">
                          {node.role}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technical Pillars */}
              <div className="grid md:grid-cols-2 gap-4">
                {activeBlueprint.keyPillars.map((pillar, pIdx) => (
                  <div
                    key={pIdx}
                    className="p-5 rounded-2xl bg-black/5 dark:bg-white/5 border border-border/40 space-y-3"
                  >
                    <h4 className="text-sm font-bold text-foreground">{pillar.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {pillar.story}
                    </p>
                    <ul className="space-y-1.5 border-t border-border/30 pt-3">
                      {pillar.bullets.map((b, bIdx) => (
                        <li key={bIdx} className="text-xs text-muted-foreground flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Verified Code Snippet Console */}
              {activeBlueprint.codeSnippet && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5 text-primary" />
                      Verified Implementation: {activeBlueprint.codeSnippet.filename}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-primary">
                      {activeBlueprint.codeSnippet.language}
                    </span>
                  </div>
                  <pre className="p-4 rounded-2xl bg-black/85 border border-border/60 text-[11px] font-mono text-slate-200 overflow-x-auto leading-relaxed">
                    <code>{activeBlueprint.codeSnippet.code}</code>
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* =========================================================================
          DETAILED ARCHITECTURE BLUEPRINT MODAL
         ========================================================================= */}
      {inspectModalSlide && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setInspectModalSlide(null)}
        >
          <div
            className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-card dark:bg-[#20252B] border p-6 sm:p-10 shadow-2xl space-y-8 relative"
            style={{ borderColor: inspectModalSlide.color.primary }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Close Button */}
            <button
              onClick={() => setInspectModalSlide(null)}
              aria-label="Close modal"
              className="absolute top-6 right-6 w-9 h-9 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="border-b border-border/50 pb-6 pr-10">
              <div
                className="text-xs font-mono font-bold tracking-widest uppercase mb-1.5"
                style={{ color: inspectModalSlide.color.primary }}
              >
                {inspectModalSlide.badgeCode}
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-foreground">
                {inspectModalSlide.architecture.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-2 max-w-2xl leading-relaxed">
                {inspectModalSlide.architecture.description}
              </p>
            </div>

            {/* System Topology Diagram */}
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-mono uppercase tracking-widest text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-primary" />
                  Distributed Mesh Topology
                </span>
                <span className="text-primary flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  Active Production Circuit
                </span>
              </div>

              <div className="grid sm:grid-cols-5 gap-3">
                {inspectModalSlide.architecture.nodes.map((node, nIdx) => (
                  <div
                    key={nIdx}
                    className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-border/50 flex flex-col justify-between space-y-3 relative group hover:border-primary/50 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-muted-foreground">
                        NODE 0{nIdx + 1}
                      </span>
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: inspectModalSlide.color.primary }}
                      />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-foreground leading-tight">
                        {node.name}
                      </div>
                      <div className="text-[10px] text-muted-foreground mt-1">
                        {node.role}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Pillars */}
            <div className="space-y-4">
              <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-primary" />
                Technical Pillars & Engineering Impact
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {inspectModalSlide.keyPillars.map((pillar, pIdx) => (
                  <div
                    key={pIdx}
                    className="p-5 rounded-2xl bg-black/5 dark:bg-white/5 border border-border/40 space-y-3"
                  >
                    <h4 className="text-sm font-bold text-foreground">{pillar.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {pillar.story}
                    </p>
                    <ul className="space-y-1.5 border-t border-border/30 pt-3">
                      {pillar.bullets.map((b, bIdx) => (
                        <li
                          key={bIdx}
                          className="text-xs text-muted-foreground flex items-start gap-2"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Verified Code Snippet Console */}
            {inspectModalSlide.codeSnippet && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Terminal className="w-4 h-4 text-primary" />
                    Verified Implementation: {inspectModalSlide.codeSnippet.filename}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-primary">
                    {inspectModalSlide.codeSnippet.language}
                  </span>
                </div>
                <pre className="p-4 rounded-2xl bg-black/85 border border-border/50 text-[11px] font-mono text-slate-200 overflow-x-auto leading-relaxed">
                  <code>{inspectModalSlide.codeSnippet.code}</code>
                </pre>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
