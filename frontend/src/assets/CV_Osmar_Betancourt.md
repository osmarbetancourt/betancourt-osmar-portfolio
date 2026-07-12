<h2 align="center" style="font-size:1.6em">Osmar Alejandro Betancourt Avello</h2>
<p align="center" style="font-size:1.1em"><b>Tech Leader & End-to-End AI Platform Engineer (Full Stack · Cloud · DevSecOps · Security · MCPs & Agents)</b></p>
<p align="center" style="font-size:0.95em">
  <b>Phone:</b> +584121817101 &nbsp;|&nbsp; <b>Email:</b> oaba.dev@gmail.com &nbsp;|&nbsp; <b>Location:</b> Caracas, VE
</p>
<p align="center">
  <a href="https://www.linkedin.com/in/BetancourtOsmar">
    <img alt="LinkedIn" src="https://img.shields.io/badge/-LinkedIn-0A66C2?style=flat&logo=linkedin&logoColor=white"/>
  </a>
  <a href="https://github.com/osmarbetancourt">
    <img alt="GitHub" src="https://img.shields.io/badge/-GitHub-181717?style=flat&logo=github&logoColor=white"/>
  </a>
  <a href="https://www.betancourtosmar.com/">
    <img alt="Website" src="https://img.shields.io/badge/-Website-0078d4?style=flat&logo=windows&logoColor=white"/>
  </a>
</p>

---

## 📝 Summary

End-to-end AI platform engineer and software-agency founder with 5+ years of experience. I architect and ship production systems across the whole stack: self-hosted Kubernetes handling millions of requests/day, multi-service backends (Django, Rust, Node), native iOS/Android apps, and AI-agent/LLM integrations (OpenAI, Anthropic, Gemini, MCP). Equally at home in cloud/IaC, CI/CD, observability, and DevSecOps, owning delivery from architecture to operations.

---

## 🛠️ Skills & Technologies

**AI / ML & Agents**: Python, PyTorch, Pandas · LLMs: OpenAI SDK & Agents SDK, Anthropic Claude, Google Gemini, Vertex AI, custom models · Model Context Protocol (MCP): custom MCP servers, Copilot MCPs · Fine-tuning: LoRA, PEFT, Hugging Face *(Certified)* · RAG & vector search: Advanced Hybrid RAG, Pinecone, FAISS, pgvector, sentence-transformers · Vision & speech: Google MediaPipe, Apple Vision, Google STT/TTS, OCR · Data: ETL pipelines (Python/SQL/Pandas), Splink record linkage, statsmodels

**Backend & Languages**: Python (Django, async DRF/adrf, FastAPI) · Rust (Axum, Tokio, SeaORM) · Node.js (Express) · C# · Task queues: Celery, BullMQ, arq · ORMs & validation: SQLAlchemy, Drizzle, Prisma, Pydantic, Zod · Auth & security: OAuth 2.1 + PKCE, JWT, reCAPTCHA/Turnstile · Integrations: Stripe, WhatsApp Cloud API, Playwright/Selenium, WeasyPrint/Gotenberg

**Frontend**: React, Next.js, TypeScript, JavaScript, Vite · TanStack Query/Table, Zustand, Redux Toolkit · Tailwind CSS, shadcn/ui, Framer Motion, GSAP · three.js, MapLibre/Leaflet, Recharts, Monaco Editor · Unity 3D

**Native Mobile**: iOS: Swift/SwiftUI (WidgetKit, HealthKit, watchOS, on-device Apple Intelligence & Vision) · Android: Kotlin/Jetpack Compose · React Native / Expo

**Databases**: PostgreSQL (+ pgvector, PgBouncer), MySQL, MongoDB · Snowflake, BigQuery, ClickHouse, DuckDB · Valkey/Redis

**DevOps, Cloud & Self-Hosted Infra**: Docker, Kubernetes (K8s), K3s · AWS (+ CloudFormation), GCP, Hetzner, Render · Cloudflare (Workers, R2, Pages, Turnstile) · Terraform/OpenTofu · Caddy, Nginx, HAProxy · CI/CD: GitHub Actions, GHCR · Observability: Prometheus, Grafana, Loki · Security in CI: CodeQL, Semgrep, Gitleaks, OWASP ZAP · Self-hosted services: own mail server (Mailu), Vaultwarden, Outline wiki

---

## 🚀 Projects

- **High-Traffic Real-Time Emergency-Response Platform**: *self-hosted Kubernetes, ~3M requests/day, zero downtime*  
  Architected and operated a public crisis-mapping platform that sustained **~3M requests/day (measured in Cloudflare) with no downtime** during a live disaster. Provisioned the k3s cluster **as code (OpenTofu)** and tuned autoscaling for spikes (**HPA 3→30 API pods** plus a cluster-autoscaler). Shielded Postgres with **PgBouncer** and a **Cloudflare + Valkey caching/rate-limit edge**, with full Prometheus/Grafana/Loki observability and a DevSecOps CI pipeline. *Stack: Next.js · Express · Drizzle/Postgres · BullMQ · Valkey · k3s · OpenTofu · Cloudflare.*

- **Multi-Domain Work-Management & Analytics Platform**: *32-service Django backend, AWS IaC*  
  Built a ClickUp/Jira-class internal platform spanning **32 domain services** (billing, boards, HR, automation, analytics, permissions, Jira/GitHub integrations). Deployed on **AWS defined entirely in CloudFormation**: EC2 Auto Scaling Group behind an ALB, RDS Postgres with a **streaming read-replica**, ElastiCache, S3, and CloudFront, plus Celery workers and a scraping service. *Stack: Django · Celery · Postgres (+replica) · Valkey · Next.js · AWS CloudFormation.*

- **Native iOS App with On-Device Computer Vision & Real-Time Voice**  
  Shipped a native SwiftUI app (iOS 18) performing **on-device face-landmark analysis with Apple Vision + AVFoundation**: no server round-trip, fully private, plus a real-time SSE stream, live voice assistant, and Siri App Intent. *Stack: Swift/SwiftUI · Vision · AVFoundation · SSE · Siri Intents.*

<sub>Also: Rust (Axum/SeaORM) analytics SaaS · native Android (Kotlin/Compose) app · custom MCP servers with hand-rolled OAuth 2.1 + PKCE · a commerce platform cut from 5–6s to ~60ms page loads · self-hosted mail, secrets, and wiki.</sub>

---

## 💼 Professional Experience

**Founder & Principal Engineer**  
_DreamIT Software · end-to-end software consultancy & development agency_  
2026 (January) – Present  
- Founded an end-to-end software agency ("if you can dream it, we can build it") delivering full platforms for clients, from architecture and cloud infrastructure to backend, frontend, native mobile, and ongoing operations.
- Architected and shipped production systems across a wide stack: high-traffic platforms on self-hosted Kubernetes, multi-service backends (Django, Rust/Axum, Node), native iOS/Android apps, and AI-agent integrations.
- Own the full delivery lifecycle solo or lead: cloud/IaC (AWS CloudFormation, OpenTofu), CI/CD, observability (Prometheus/Grafana/Loki), and DevSecOps, while acting as the direct technical contact for clients.

**Tech Leader & End-to-End AI Platform Engineer**  
_Moneybook_  
2025 (August) – 2026 (January)  
- Designed and implemented the full AWS architecture and DevOps strategy for a virtual AI assistant platform focused on bank debt collection.
- Developed the entire backend in Django, containerizing the solution with Docker and K8s, integrating best practices for scalable deployments.
- Engineered a custom AI agent using OpenAI Agents SDK and Model Context Protocol (MCP) for advanced automation and integration.

**IT Technical Leader & Senior Jira Analyst**  
_Solutions for Everyone S4E_ · 2024 (March) – 2025 (August)  
- Led technical teams, software validation, and AI solution design (Jira / customer chatbots); delivered full-stack solutions and deployed AI agents in cloud environments.
- Main technical representative in customer meetings, translating requirements into solutions; mentored new team members.

**Jira Analyst & AWS Cloud Practitioner**  
_Solutions for Everyone S4E_ · 2021 (June) – 2024 (March)  
- Coordinated technical projects with agile methodologies (Kanban/Scrum) and managed Jira + AWS integrations across cross-functional teams.
- Automated key software-creation processes, **cutting delivery time from 30 hours to 2 hours**.

---

## 🏅 Certifications

**Hugging Face** (Certified): Large Language Models · Model Context Protocol (MCP) · Agents · **DataCamp:** Associate AI Engineer, Data Engineer, Professional Data Engineer, Developing LLMs · **Atlassian:** Managing Jira Projects (Data Center & Cloud) · *+50 more IT/AI certifications on request*

---