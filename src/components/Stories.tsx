'use client';

import {
  Terminal,
  Activity,
  CheckCircle2,
  X,
  Sparkles,
  Copy,
  Check,
  Building2,
  Compass,
} from "lucide-react";
import { useState, useMemo, useCallback } from "react";
import TileReveal, { type TileRevealItem } from "./TileReveal";

// Import 3D generated artworks
import springImg from "../assets/skills/Gemini_Generated_Image_vvmerwvvmerwvvme.jfif";
import dataImg from "../assets/skills/Gemini_Generated_Image_lwkqb8lwkqb8lwkq.jfif";
import secImg from "../assets/skills/Gemini_Generated_Image_qhg3uwqhg3uwqhg3.jfif";
import reactImg from "../assets/skills/Gemini_Generated_Image_xja5cjxja5cjxja5.jfif";
import cloudImg from "../assets/skills/Gemini_Generated_Image_o2u6eoo2u6eoo2u6.jfif";
import javaImg from "../assets/skills/Gemini_Generated_Image_f0oygtf0oygtf0oy.jfif";
import aiImg from "../assets/skills/Gemini_Generated_Image_jpum48jpum48jpum.jfif";
import dbImg from "../assets/skills/Gemini_Generated_Image_qmybnmqmybnmqmyb.jfif";

export interface DevelopmentWork {
  id: string;
  title: string;
  catchphrase: string;
  company: string;
  role: string;
  date: string;
  category: string;
  badgeCode: string;
  image: string;
  challenge: string;
  contribution: string;
  outcome: string;
  technologies: string[];
  metrics: { label: string; val: string; sub?: string }[];
  terminalSnippet: string;
  architectureNodes?: string[];
}

const DEVELOPMENT_WORKS: DevelopmentWork[] = [
  {
    id: "spring-microservices",
    title: "Core Banking Spring Boot Microservices",
    catchphrase:
      "Java 17 & Spring Boot microservices handling high-throughput transactional flows with sub-50ms latency.",
    company: "Fintech",
    role: "Software Engineer",
    date: "2024",
    category: "High-Throughput API Mesh",
    badgeCode: "ENG-API-01",
    image: springImg,
    challenge:
      "High-traffic fintech APIs required resilient scaling under sudden load bursts, token-bucket request throttling, complete historical data-change audits, and automated rolling deployments on OpenShift clusters.",
    contribution:
      "At Fintech, I architected Java 17+ and Spring Boot REST APIs with JPA/Hibernate connection pooling, integrated Hibernate Envers historical revision stores, and standardized token-bucket rate limiting. Authored Helm charts to automate repeatable OpenShift deployments.",
    outcome:
      "Achieved 99.99% operational SLA with immutable audit trails, guaranteed zero-downtime rolling updates, and sub-50ms P99 latency under heavy production traffic.",
    technologies: [
      "Java 17+",
      "Spring Boot REST",
      "Hibernate Envers",
      "OpenShift",
      "Helm",
      "Oracle / PostgreSQL",
      "Token-Bucket Throttling",
    ],
    metrics: [
      { label: "P99 Latency", val: "< 50ms", sub: "Fast Response" },
      { label: "Audit Accuracy", val: "100%", sub: "Immutable Delts" },
      { label: "Uptime SLA", val: "99.99%", sub: "Zero-Downtime" },
    ],
    terminalSnippet: `@Audited
@Entity
public class FinancialFeedEntity extends AuditableRecord {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long transactionId;
  
  @Column(nullable = false)
  private BigDecimal settledAmount;
  // Hibernate Envers guarantees immutable temporal revisions
}`,
    architectureNodes: [
      "React 19 Frontend",
      "OAuth 2.0 Gateway",
      "Spring Boot Mesh",
      "Hibernate Envers Store",
      "OpenShift Pods",
    ],
  },
  {
    id: "multicloud-etl",
    title: "Multi-Cloud Automated ETL & Airflow DAGs",
    catchphrase:
      "Automated enterprise data ingestion pipelines processing 10TB+ daily across AWS and Azure.",
    company: "Infosys Ltd.",
    role: "Systems Engineer",
    date: "2023",
    category: "Cloud Data Engineering",
    badgeCode: "DAT-ETL-02",
    image: dataImg,
    challenge:
      "Fragmented, manual data ingestion steps caused data discrepancies and compute delays when processing multi-terabyte analytical feeds across heterogeneous cloud infrastructures.",
    contribution:
      "At Infosys, I built automated ETL DAGs using Python, Apache Airflow (MWAA), and DBT across AWS EC2 and Azure Data Factory. Integrated dynamic Jinja-templated SQL generators and serverless Lambdas to transform unstructured feeds automatically.",
    outcome:
      "Reduced pipeline runtimes by 40%, eliminated manual transformation errors, and delivered automated daily analytical feeds of 10TB+ across enterprise data marts.",
    technologies: [
      "Python 3",
      "Apache Airflow (MWAA)",
      "DBT Core",
      "AWS Lambda",
      "Azure Data Factory",
      "Jinja2",
      "AWS EC2",
    ],
    metrics: [
      { label: "Runtime Reduction", val: "40%", sub: "Compute Boost" },
      { label: "Daily Data Ingested", val: "10TB+", sub: "Scalable Feed" },
      { label: "Failure Rate", val: "0.01%", sub: "High Reliability" },
    ],
    terminalSnippet: `with DAG("enterprise_cloud_etl_pipeline",
     schedule_interval="0 2 * * *",
     default_args=default_args) as dag:
  ingest_blob = AzureBlobStorageHook(...)
  transform_dbt = DbtRunOperator(...)
  validate_feed = PythonOperator(...)
  ingest_blob >> transform_dbt >> validate_feed`,
    architectureNodes: [
      "Query Console",
      "Azure Serverless",
      "Amazon MWAA",
      "DBT Engine",
      "AWS Secrets Manager",
    ],
  },
  {
    id: "oauth-security",
    title: "OAuth 2.0 Security Mesh & Zero-Trust Auth",
    catchphrase:
      "End-to-end cryptographic OAuth 2.0 framework securing multi-tier React and Spring microservices.",
    company: "Fintech",
    role: "Software Engineer",
    date: "2024",
    category: "Zero-Trust Architecture",
    badgeCode: "SEC-AUTH-03",
    image: secImg,
    challenge:
      "Every API endpoint required strict cryptographic authentication and fine-grained role permissions without subjecting enterprise users to repetitive sign-in friction.",
    contribution:
      "Engineered an end-to-end OAuth 2.0 authorization framework unifying the React frontend and Spring Boot backend services. Implemented seamless JWT token rotation, secure HttpOnly cookie handling, and route-level authorization guards.",
    outcome:
      "Established zero-trust endpoint protection, eliminated session hijacking vectors, and enabled frictionless authenticated navigation across all microservices.",
    technologies: [
      "OAuth 2.0",
      "Spring Security",
      "JWT Token Rotation",
      "React Auth Guards",
      "RBAC Controls",
      "HttpOnly Cookies",
    ],
    metrics: [
      { label: "Auth Vulnerabilities", val: "0", sub: "Strict Verification" },
      { label: "Session Security", val: "Zero-Trust", sub: "HttpOnly + JWT" },
      { label: "Token Rotation", val: "Automated", sub: "Silent Refresh" },
    ],
    terminalSnippet: `@Configuration
@EnableWebSecurity
public class SecurityMeshConfig {
  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    return http
      .oauth2ResourceServer(oauth2 -> oauth2.jwt(Customizer.withDefaults()))
      .authorizeHttpRequests(auth -> auth.anyRequest().authenticated())
      .build();
  }
}`,
    architectureNodes: [
      "React Auth Guard",
      "Identity Provider",
      "Spring Resource Server",
      "JWT Validator",
    ],
  },
  {
    id: "frontend-modernization",
    title: "Vite Acceleration & Strict TypeScript Architecture",
    catchphrase:
      "Re-engineered legacy frontend into high-speed Vite + TypeScript architecture with AG Grid virtualization.",
    company: "Enterprise Platform",
    role: "Frontend Architect",
    date: "2024",
    category: "Frontend Modernization",
    badgeCode: "UI-VITE-04",
    image: reactImg,
    challenge:
      "A legacy enterprise UI suffered from multi-minute Webpack compilation times, untyped spaghetti state, and outdated component libraries that caused frequent production runtime errors.",
    contribution:
      "Migrated the entire frontend stack from legacy Webpack to Vite with strict TypeScript, upgraded React 19 packages, integrated AG Grid virtualization for tens of thousands of rows, and standardized error-boundary modals.",
    outcome:
      "Achieved instantaneous hot-module replacement (HMR), 85% faster production bundle builds, eliminated undefined runtime crashes with strict types, and elevated user experience.",
    technologies: [
      "React 19",
      "Vite",
      "TypeScript Strict",
      "AG Grid Virtualization",
      "Tailwind CSS",
      "Error Boundaries",
    ],
    metrics: [
      { label: "Build Acceleration", val: "85%", sub: "Vite Bundler" },
      { label: "Type Coverage", val: "100%", sub: "Zero Any Types" },
      { label: "HMR Startup", val: "< 200ms", sub: "Instant Dev Flow" },
    ],
    terminalSnippet: `// Modern typed Vite architecture
export const useEnterpriseGrid = <T extends GridRecord>(schema: Schema<T>) => {
  const [data, setData] = useState<T[]>([]);
  // Strict compiler typing guarantees zero runtime null errors
  return { data, count: data.length, isLoaded: true };
};`,
    architectureNodes: [
      "TypeScript AST",
      "Vite Rollup Engine",
      "Virtual AG Grid",
      "Error Boundary",
    ],
  },
  {
    id: "openshift-mesh",
    title: "OpenShift Container Mesh & Helm Infrastructure",
    catchphrase:
      "Declarative Helm deployment charts and automated container topologies across OpenShift clusters.",
    company: "Fintech",
    role: "Software Engineer",
    date: "2024",
    category: "Cloud Orchestration",
    badgeCode: "OPS-MESH-05",
    image: cloudImg,
    challenge:
      "Microservices required reproducible, parameterized environment provisioning and zero-downtime rolling deployments across regulated enterprise banking clusters.",
    contribution:
      "Standardized Helm release definitions, health-check probes, ingress traffic splitting, and pod autoscaling policies on Red Hat OpenShift, tying them directly into continuous deployment pipelines.",
    outcome:
      "Automated 100% of deployment routines, enabled sub-minute rollbacks, and guaranteed zero-downtime microservice upgrades in production.",
    technologies: [
      "Red Hat OpenShift",
      "Kubernetes",
      "Helm 3",
      "Docker",
      "CI/CD Automation",
      "Ingress Routing",
    ],
    metrics: [
      { label: "Deployment Automation", val: "100%", sub: "Hands-Free" },
      { label: "Rollback Time", val: "< 60s", sub: "Fast Revert" },
      { label: "Deployment Downtime", val: "0s", sub: "Rolling Upgrades" },
    ],
    terminalSnippet: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: banking-microservice
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0`,
    architectureNodes: [
      "Helm Template",
      "OpenShift Cluster",
      "Ingress Controller",
      "Pod AutoScaler",
    ],
  },
  {
    id: "envers-auditing",
    title: "Regulatory Envers Temporal Revision Ledger",
    catchphrase:
      "Historical snapshot engine capturing every database change with cryptographic author attribution.",
    company: "Fintech",
    role: "Software Engineer",
    date: "2024",
    category: "Regulatory Auditing",
    badgeCode: "AUD-LEDGER-06",
    image: javaImg,
    challenge:
      "Financial regulators mandated comprehensive temporal audits capturing every modification delta, user principal, and timestamp without degrading transactional throughput.",
    contribution:
      "Architected complete revision-tracking architecture using Hibernate Envers. Every database insert, update, or delete automatically persists immutable temporal snapshot deltas with cryptographic author attribution.",
    outcome:
      "Zero overhead on critical write path using asynchronous revision listener dispatch, 100% compliance with financial regulatory inspection, and sub-10ms query execution.",
    technologies: [
      "Hibernate Envers",
      "Java 17",
      "Spring Data JPA",
      "Temporal Querying",
      "Oracle DB",
      "Security Auditing",
    ],
    metrics: [
      { label: "Audit Compliance", val: "100%", sub: "Regulatory Grade" },
      { label: "Temporal Query Time", val: "< 10ms", sub: "Indexed Delts" },
      { label: "Write Overhead", val: "0%", sub: "Async Dispatch" },
    ],
    terminalSnippet: `@Entity
@RevisionEntity(SecurityRevisionListener.class)
public class AuditRevisionEntity extends DefaultRevisionEntity {
    @Column(name = "principal_user_id", nullable = false)
    private String principalUserId;
    
    @Column(name = "correlation_id", nullable = false)
    private String correlationId;
}`,
    architectureNodes: [
      "JPA Entity Listener",
      "Async Dispatcher",
      "Audit Revision Table",
      "Temporal Reconstructor",
    ],
  },
  {
    id: "distributed-ai",
    title: "Big Data & Distributed Predictive Analytics",
    catchphrase:
      "Distributed data pipelines and statistical modeling algorithms analyzing multi-dimensional features.",
    company: "National College of Ireland",
    role: "Data Analytics Master's",
    date: "2023",
    category: "Machine Learning & AI",
    badgeCode: "AI-DATA-07",
    image: aiImg,
    challenge:
      "Processing high-dimensional datasets required parallel computing, scalable ETL architectures, and rigorous statistical model validation.",
    contribution:
      "Built distributed data pipelines using Python, PySpark, and scikit-learn. Implemented cross-validation, feature normalization, and automated metric dashboards for predictive modeling.",
    outcome:
      "Graduated with First Class Honours; developed predictive pipelines capable of scaling seamlessly across distributed compute nodes.",
    technologies: [
      "Python 3",
      "PySpark",
      "Scikit-Learn",
      "Distributed Computing",
      "ETL Pipelines",
      "Pandas / NumPy",
    ],
    metrics: [
      { label: "Academic Standing", val: "First Class", sub: "Honours Grade" },
      { label: "Dataset Features", val: "100+", sub: "Normalized Vars" },
      { label: "Model Accuracy", val: "94.2%", sub: "Cross-Validated" },
    ],
    terminalSnippet: `def train_distributed_pipeline(features_df):
    pipeline = Pipeline(stages=[encoder, vectorizer, scaler, estimator])
    model = pipeline.fit(train_df)
    predictions = model.transform(test_df)
    return evaluate_metrics(predictions)`,
    architectureNodes: [
      "Raw Data Lake",
      "PySpark Normalizer",
      "Model Pipeline",
      "Evaluation Dashboard",
    ],
  },
  {
    id: "concurrent-ledger",
    title: "High-Concurrency Database Architecture",
    catchphrase:
      "Optimistic locking, composite indexing, and sub-10ms query execution across PostgreSQL & Oracle.",
    company: "Financial Systems",
    role: "Database Engineer",
    date: "2024",
    category: "Data Mesh & Concurrency",
    badgeCode: "DB-ARCH-08",
    image: dbImg,
    challenge:
      "Simultaneous ledger updates across concurrent users risked dirty reads and deadlocks without comprehensive concurrency isolation.",
    contribution:
      "Designed multi-version concurrency control (MVCC) policies, composite indexing, partitioned tables, and Liquibase database migrations.",
    outcome:
      "Maintained absolute consistency across millions of transactions with zero deadlocks and sub-10ms query responses.",
    technologies: [
      "PostgreSQL",
      "Oracle DB",
      "Liquibase",
      "MVCC",
      "Optimistic Locking",
      "Composite Indexing",
    ],
    metrics: [
      { label: "Deadlock Incidents", val: "0", sub: "Safe Concurrency" },
      { label: "Query Execution", val: "< 10ms", sub: "Composite Indices" },
      { label: "Migration Reliability", val: "100%", sub: "Liquibase DDL" },
    ],
    terminalSnippet: `@Version
private Long version; // Optimistic locking guarantees concurrent record safety

@Index(name = "idx_tx_lookup", columnList = "account_id, created_at")
private String accountLookupIndex;`,
    architectureNodes: [
      "Concurrent Transactions",
      "MVCC Engine",
      "Liquibase Schema",
      "Partitioned Storage",
    ],
  },
];

export function Stories() {
  const [selectedWork, setSelectedWork] = useState<DevelopmentWork | null>(null);
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [activeModalTab, setActiveModalTab] = useState<
    "overview" | "code" | "metrics"
  >("overview");

  // Prepare tile items for TileReveal
  const tileItems: TileRevealItem[] = useMemo(() => {
    return DEVELOPMENT_WORKS.map((work) => ({
      id: work.id,
      image: work.image,
      title: work.title,
      badge: work.badgeCode,
      company: work.company,
    }));
  }, []);

  const handleTileClick = useCallback((index: number) => {
    const work = DEVELOPMENT_WORKS[index % DEVELOPMENT_WORKS.length];
    setSelectedWork(work);
    setActiveModalTab("overview");
  }, []);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  return (
    <div className="relative w-full bg-transparent overflow-hidden">
      {/* 
        ========================================================================
        REACT BITS TILE REVEAL:
        - Image tiles fly in on scroll to assemble in the grid
        - As the user continues scrolling, tiles zoom & disperse outward
        - Dispersal reveals the centered headline catchphrase explaining what Ronu did
        - Tiles are fully interactive: clicking any tile opens the detailed work modal!
        ======================================================================== 
      */}
      <TileReveal
        items={tileItems}
        columns={4}
        gap={16}
        gridWidth={960}
        tileAspect={1.22}
        tileRadius={16}
        grayscale={false}
        direction="alternate"
        stagger={0.02}
        overlap={0.7}
        zoom={1.12}
        spread={0.8}
        scrollLength={0.85}
        scrub={0.2}
        contentGap={20}
        onTileClick={handleTileClick}
        className="w-full"
        headline={
          <div className="space-y-3 max-w-2xl mx-auto px-4 select-none relative">
            {/* Ambient soft frosted backdrop so text is crystal clear */}
            <div className="absolute inset-0 bg-background/85 dark:bg-[#20252B]/90 backdrop-blur-md rounded-3xl -m-4 sm:-m-6 -z-10 border border-border/40 shadow-xl" />

            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono font-semibold bg-primary/15 border border-primary/30 text-primary">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>Enterprise Development Portfolio</span>
            </div>

            {/* Expressive catchphrase headline of what Ronu did */}
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif font-black tracking-tight text-foreground leading-[1.14]">
              <span className="text-primary italic font-serif">
                Scaling Production Impact.
              </span>
            </h2>

            <p className="mx-auto max-w-lg text-xs sm:text-sm text-muted-foreground font-mono leading-relaxed">
              High-throughput fintech microservices at Fintech • Multi-cloud automated ETL data meshes at Infosys.
            </p>
          </div>
        }
      >
        {/* Revealed interaction guide and telemetry pills */}
        <div className="flex flex-col items-center gap-3">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-border/60 bg-card/90 backdrop-blur-md text-xs font-mono text-foreground shadow-md transition-all hover:border-primary/50">
            <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
            <span>Click any tile to inspect architecture, metrics & code</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono text-muted-foreground/80">
            <span>8 Production Blueprints</span>
            <span>•</span>
            <span>Fintech & Infosys</span>
            <span>•</span>
            <span>Java 17 • Python • React</span>
          </div>
        </div>
      </TileReveal>

      {/* 
        ========================================================================
        INTERACTIVE WORK INSPECTION MODAL:
        - Triggered when users click ANY tile in the TileReveal sequence
        - Displays complete technical specs: Challenge, Contribution, Code, Metrics
        ======================================================================== 
      */}
      {selectedWork && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={selectedWork.title}
          className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200"
          onClick={() => setSelectedWork(null)}
        >
          <div
            className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-card border border-border/60 shadow-2xl relative text-foreground p-6 sm:p-8 space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Close Button */}
            <button
              onClick={() => setSelectedWork(null)}
              aria-label="Close work details"
              className="absolute top-5 right-5 w-9 h-9 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer transition-all border border-border/40"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header: Image, Badges & Title */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 border-b border-border/50 pb-6">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shrink-0 border border-primary/25 shadow-md bg-black/20">
                <img
                  src={selectedWork.image}
                  alt={selectedWork.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-1.5 flex-1 pr-6">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider bg-primary/15 text-primary border border-primary/30">
                    {selectedWork.badgeCode}
                  </span>
                  <span className="text-xs font-mono text-muted-foreground flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-primary" />
                    {selectedWork.company}
                  </span>
                  <span className="text-xs font-mono text-muted-foreground">
                    • {selectedWork.role}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-serif font-black tracking-tight text-foreground">
                  {selectedWork.title}
                </h3>

                <p className="text-xs sm:text-sm font-mono text-primary/90">
                  {selectedWork.catchphrase}
                </p>
              </div>
            </div>

            {/* Modal Navigation Sub-Tabs */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-black/5 dark:bg-white/5 border border-border/40 text-xs font-mono">
              {[
                { id: "overview", label: "Overview & Impact", icon: Activity },
                { id: "code", label: "Code Architecture", icon: Terminal },
                { id: "metrics", label: "Key Telemetry", icon: CheckCircle2 },
              ].map((tab) => {
                const TabIcon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveModalTab(tab.id as typeof activeModalTab)}
                    className={`flex-1 px-3 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer text-xs ${
                      activeModalTab === tab.id
                        ? "bg-primary text-primary-foreground font-bold shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <TabIcon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* TAB 1: OVERVIEW & DELIVERED IMPACT */}
            {activeModalTab === "overview" && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="p-4 sm:p-5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-border/40 space-y-2">
                  <div className="text-[10px] font-mono font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-primary" />
                    <span>The Engineering Challenge</span>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {selectedWork.challenge}
                  </p>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-border/40 space-y-2">
                  <div className="text-[10px] font-mono font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                    <span>Delivered Solution & Contribution</span>
                  </div>
                  <p className="text-xs sm:text-sm text-foreground leading-relaxed">
                    {selectedWork.contribution}
                  </p>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-primary/5 border border-primary/20 space-y-2">
                  <div className="text-[10px] font-mono font-bold text-primary uppercase tracking-wider">
                    Measurable Production Outcome
                  </div>
                  <p className="text-xs sm:text-sm text-foreground/90 font-medium leading-relaxed">
                    {selectedWork.outcome}
                  </p>
                </div>
              </div>
            )}

            {/* TAB 2: CODE ARCHITECTURE & TERMINAL */}
            {activeModalTab === "code" && (
              <div className="space-y-4 animate-in fade-in duration-200">
                {selectedWork.architectureNodes && (
                  <div className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-border/40 space-y-2.5">
                    <div className="text-[10px] font-mono font-bold text-primary uppercase tracking-wider">
                      Architectural Data Flow Pipeline
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {selectedWork.architectureNodes.map((node, i) => (
                        <div key={node} className="flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded-lg text-xs font-mono bg-card border border-border/60 text-foreground font-semibold">
                            {node}
                          </span>
                          {i < (selectedWork.architectureNodes?.length || 0) - 1 && (
                            <span className="text-primary font-mono text-xs">→</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="rounded-2xl border border-border/60 bg-[#1A1F26] text-stone-200 overflow-hidden shadow-lg">
                  <div className="flex items-center justify-between px-4 py-2.5 bg-[#14181E] border-b border-border/30 text-xs font-mono text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                      <span className="ml-2 text-stone-300 font-semibold">
                        {selectedWork.title.toLowerCase().replace(/\s+/g, "-")}.java
                      </span>
                    </div>

                    <button
                      onClick={() => handleCopyCode(selectedWork.terminalSnippet)}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 text-stone-300 text-xs font-mono transition-colors cursor-pointer"
                    >
                      {copiedSnippet ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-primary" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  <pre className="p-4 sm:p-5 text-xs font-mono overflow-x-auto leading-relaxed text-[#D2E2EE]">
                    <code>{selectedWork.terminalSnippet}</code>
                  </pre>
                </div>
              </div>
            )}

            {/* TAB 3: KEY TELEMETRY & PRODUCTION METRICS */}
            {activeModalTab === "metrics" && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {selectedWork.metrics.map((m) => (
                    <div
                      key={m.label}
                      className="p-4 rounded-2xl bg-card border border-border/60 shadow-sm space-y-1 text-center sm:text-left"
                    >
                      <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider block">
                        {m.label}
                      </span>
                      <div className="text-2xl font-mono font-black text-primary">
                        {m.val}
                      </div>
                      {m.sub && (
                        <div className="text-[10px] font-mono text-muted-foreground">
                          {m.sub}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-border/40 space-y-2">
                  <div className="text-[10px] font-mono font-bold text-primary uppercase tracking-wider">
                    High-Reliability Architectural Guarantee
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed font-mono">
                    Validated under rigorous integration testing with automated SonarQube
                    static analysis, zero-defect deployment pipelines, and temporal revision
                    verification.
                  </p>
                </div>
              </div>
            )}

            {/* Modal Footer: Tech Stack Badges */}
            <div className="border-t border-border/50 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-1.5">
                {selectedWork.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-muted/50 border border-border/50 text-muted-foreground"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <button
                onClick={() => setSelectedWork(null)}
                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-mono text-xs font-bold transition-all hover:opacity-90 self-end sm:self-auto cursor-pointer"
              >
                Close Spec
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default Stories;
