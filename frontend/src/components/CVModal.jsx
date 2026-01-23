import React from 'react';

const CVModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="relative">
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg"
          aria-label="Close CV Modal"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
        <div className="bg-white rounded-lg shadow-xl max-w-4xl mx-4 p-8 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="text-gray-900">
          <h2 className="text-center text-3xl font-bold mb-2">Osmar Alejandro Betancourt Avello</h2>
          <p className="text-center text-xl font-semibold mb-4">Tech Leader & End-to-End AI Platform Engineer (Full Stack · Cloud · DevSecOps · Security · MCPs - Agents)</p>
          <p className="text-center text-base mb-4">
            <strong>Phone:</strong> +584121817101 &nbsp;|&nbsp; <strong>Email:</strong> oaba.dev@gmail.com &nbsp;|&nbsp; <strong>Location:</strong> Caracas, VE
          </p>
          <p className="text-center mb-6">
            <a href="https://www.linkedin.com/in/BetancourtOsmar" className="inline-block mr-2">
              <img alt="LinkedIn" src="https://img.shields.io/badge/-LinkedIn-0A66C2?style=flat&logo=linkedin&logoColor=white" />
            </a>
            <a href="https://github.com/osmarbetancourt" className="inline-block mr-2">
              <img alt="GitHub" src="https://img.shields.io/badge/-GitHub-181717?style=flat&logo=github&logoColor=white" />
            </a>
            <a href="https://www.betancourtosmar.com/" className="inline-block">
              <img alt="Website" src="https://img.shields.io/badge/-Website-0078d4?style=flat&logo=windows&logoColor=white" />
            </a>
          </p>

          <hr className="mb-6" />

          <h3 className="text-2xl font-bold mb-4">📝 Summary</h3>
          <p className="mb-6">
            AI Full Stack Engineer with 4+ years of experience specializing in integration and customization of AI agents and LLMs including OpenAI, Gemini, Hugging Face, and bespoke models within real-world platforms and MCPs. Demonstrates hands on expertise across the entire stack, building robust solutions that bridge cutting edge AI with proven software practices. Areas of proficiency include ETL data pipelines, full-stack development, and DevOps deployment, enabling seamless AI integration into both new and traditional software landscapes.
          </p>

          <h3 className="text-2xl font-bold mb-4">🛠️ Skills & Technologies</h3>
          <table className="w-full mb-6 border-collapse border border-gray-300">
            <tbody>
              <tr>
                <td className="border border-gray-300 p-4 align-top" width="33%">
                  <strong>Python</strong><br />
                  <img src="https://cdn.simpleicons.org/pandas/150458" className="w-4 h-4 inline mr-1" alt="Pandas Logo" /> <strong>Pandas</strong><br />
                  <img src="https://cdn.simpleicons.org/pytorch/EE4C2C" className="w-4 h-4 inline mr-1" alt="PyTorch Logo" /> <strong>PyTorch</strong><br />
                  <strong>LoRA</strong><br />
                  <strong>PEFT</strong><br />
                  <img src="https://cdn.simpleicons.org/huggingface/fcc419" className="w-4 h-4 inline mr-1" alt="HuggingFace Logo" /> <strong>Hugging Face LLMs (Certified)</strong><br />
                  <strong>LLMs</strong> (OpenAI, Gemini, Custom, RAG, Q&A)<br />
                  <strong>ETL Pipelines</strong> (Python, SQL, Pandas)<br />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/5/55/Pinecone-Full-Logo-Black.svg" className="w-4 h-4 inline mr-1" alt="Pinecone Logo" /> <strong>Pinecone</strong><br />
                  <img src="https://cdn.simpleicons.org/unity/000000" className="w-4 h-4 inline mr-1" alt="Unity Logo" /> <strong>Unity 3D</strong><br />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/b/bd/Logo_C_sharp.svg" className="w-4 h-4 inline mr-1" alt="C# Logo" /> <strong>C#</strong><br />
                  <img src="https://cdn.simpleicons.org/googlecloud/4285F4" className="w-4 h-4 inline mr-1" alt="GCP Logo" /> <strong>GCP</strong><br />
                  <img src="https://simpleicons.org/icons/render.svg" className="w-4 h-4 inline mr-1" alt="Render Logo" /> <strong>Render</strong><br />
                  <img src="https://cdn.simpleicons.org/hetzner/D50C2D" className="w-4 h-4 inline mr-1" alt="Hetzner Logo" /> <strong>Hetzner</strong><br />
                </td>
                <td className="border border-gray-300 p-4 align-top" width="33%">
                  <img src="https://cdn.simpleicons.org/docker/2496ED" className="w-4 h-4 inline mr-1" alt="Docker Logo" /> <strong>Docker</strong><br />
                  <img src="https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/docker-compose.png" className="w-4 h-4 inline mr-1" alt="Docker Compose Logo" /> <strong>Docker Compose</strong><br />
                  <img src="https://cdn.simpleicons.org/kubernetes/326CE5" className="w-4 h-4 inline mr-1" alt="Kubernetes Logo" /> <strong>Kubernetes (K8s)</strong><br />
                  <img src="https://raw.githubusercontent.com/cncf/artwork/master/projects/k3s/icon/color/k3s-icon-color.png" className="w-4 h-4 inline mr-1" alt="K3s Logo" /> <strong>K3s</strong><br />
                  <img src="https://cdn.simpleicons.org/postgresql/4169E1" className="w-4 h-4 inline mr-1" alt="Postgres Logo" /> <strong>Postgres</strong><br />
                  <img src="https://cdn.simpleicons.org/mysql/4479A1" className="w-4 h-4 inline mr-1" alt="MySQL Logo" /> <strong>MySQL</strong><br />
                  <img src="https://cdn.simpleicons.org/huggingface/fcc419" className="w-4 h-4 inline mr-1" alt="HuggingFace Logo" /> <strong>MCP (Hugging Face)</strong><br />
                  <img src="https://cdn.simpleicons.org/snowflake/29B5E8" className="w-4 h-4 inline mr-1" alt="Snowflake Logo" /> <strong>Snowflake</strong><br />
                  <img src="https://cdn.simpleicons.org/mongodb/47A248" className="w-4 h-4 inline mr-1" alt="MongoDB Logo" /> <strong>NoSQL</strong><br />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg" className="w-4 h-4 inline mr-1" alt="AWS Logo" /> <strong>AWS</strong><br />
                  <img src="https://cdn.worldvectorlogo.com/logos/aws-cloudformation.svg" className="w-4 h-4 inline mr-1" alt="CloudFormation Logo" /> <strong>AWS CloudFormation</strong><br />
                  <img src="https://cdn.simpleicons.org/jirasoftware/0052CC" className="w-4 h-4 inline mr-1" alt="Jira Logo" /> <strong>JIRA</strong><br />
                  <img src="https://cdn.simpleicons.org/githubactions/2088FF" className="w-4 h-4 inline mr-1" alt="GitHub Actions Logo" /> CI/CD GitHub Actions<br />
                </td>
                <td className="border border-gray-300 p-4 align-top" width="33%">
                  <img src="https://cdn.simpleicons.org/react/61DAFB" className="w-4 h-4 inline mr-1" alt="React Logo" /> <strong>React</strong><br />
                  <img src="https://cdn.simpleicons.org/nextdotjs/000000" className="w-4 h-4 inline mr-1" alt="Next.js Logo" /> <strong>Next.js</strong><br />
                  <img src="https://cdn.simpleicons.org/typescript/3178C6" className="w-4 h-4 inline mr-1" alt="TypeScript Logo" /> <strong>TypeScript</strong><br />
                  <img src="https://cdn.simpleicons.org/javascript/F7DF1E" className="w-4 h-4 inline mr-1" alt="JavaScript Logo" /> <strong>JavaScript</strong><br />
                  <img src="https://cdn.simpleicons.org/huggingface/fcc419" className="w-4 h-4 inline mr-1" alt="HuggingFace Logo" /> <strong>Hugging Face Agents (Certified)</strong><br />
                  <img src="https://cdn.simpleicons.org/django/092E20" className="w-4 h-4 inline mr-1" alt="Django Logo" /> <strong>Django</strong><br />
                  <img src="https://cdn.simpleicons.org/github/181717" className="w-4 h-4 inline mr-1" alt="GitHub Logo" /> <strong>Git & GitHub</strong><br />
                  <img src="https://cdn.simpleicons.org/githubcopilot/939aff" className="w-4 h-4 inline mr-1" alt="GitHub Copilot Logo" /> <strong>Copilot Custom MCPs</strong><br />
                  <strong>Advanced Hybrid RAG</strong><br />
                  <strong>FAISS</strong><br />
                  <strong>Google STT & TTS</strong><br />
                  <img src="https://cdn.simpleicons.org/googlecloud/4285F4" className="w-4 h-4 inline mr-1" alt="Google Vertex AI Logo" /> <strong>Google Vertex AI</strong><br />
                  <img src="https://cdn.simpleicons.org/openai/412991" className="w-4 h-4 inline mr-1" alt="OpenAI Logo" /> <strong>OpenAI SDK</strong><br />
                  <img src="https://cdn.simpleicons.org/rust/000000" className="w-4 h-4 inline mr-1" alt="Rust Logo" /> Rust<br />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/6/60/Tokio_logo.svg" className="w-4 h-4 inline mr-1" alt="Rust Logo" /> Tokio-Axum<br />
                </td>
              </tr>
            </tbody>
          </table>

          <h3 className="text-2xl font-bold mb-4">🚀 Projects</h3>
          <ul className="mb-6">
            <li className="mb-4">
              <strong>AI-Powered Ecommerce Platform (Next.js/Node/LLM)</strong><br />
              Designed and developed an advanced grocery platform that reduced load times from 5–6 seconds to just 60ms across 500+ products. The platform features an AI Agent that lets users manage their cart, get instant product and recipe recommendations, and complete checkout all through natural conversation. Integrated Retrieval Augmented Generation (RAG) and analytics deliver an AI-driven experience and speed that surpass typical online grocery stores.
            </li>
            <li className="mb-4">
              <strong>Designed and built a robust, extensible MCP server with Render Services Integration</strong><br />
              Designed and built a robust, extensible MCP server that bridges modern AI agents (like GitHub Copilot) with any API-powered service. Integrated the Render.com API to dynamically expose cloud infrastructure tools as MCP-compatible endpoints, enabling programmatic control and orchestration via natural language and agent-driven workflows.
            </li>
            <li className="mb-4">
              <strong>Developed a scalable Retrieval Augmented Generation (RAG) System for Knowledge Q&A</strong><br />
              Developed a scalable RAG system using Pinecone, Hugging Face, and custom embedding models for enterprise knowledge search and contextual Q&A. Designed ETL pipelines for document ingestion, achieving sub-second retrieval latency and high-accuracy answers on 100K+ documents.
            </li>
            <li>
              <em>Other projects: Built an Interactive Portfolio with LLM & Generative AI (Django/React, Gemini, custom LLM agents, live Q&A and AI-assisted demos)</em>
            </li>
          </ul>

          <h3 className="text-2xl font-bold mb-4">💼 Professional Experience</h3>
          <div className="mb-6">
            <h4 className="text-xl font-semibold">Tech Leader & End-to-End AI Platform Engineer</h4>
            <p className="text-purple-600"><strong>Moneybook</strong></p>
            <p className="text-gray-600">2025 (August) – Present | Remote</p>
            <ul className="list-disc list-inside mb-4">
              <li>Designed and implemented the full AWS architecture and DevOps strategy for a virtual AI assistant platform focused on bank debt collection.</li>
              <li>Developed the entire backend in Django, containerizing the solution with Docker and K8s, integrating best practices for scalable deployments.</li>
              <li>Engineered a custom AI agent using OpenAI Agents SDK and Model Context Protocol (MCP) for advanced automation and integration.</li>
            </ul>
          </div>
          <div className="mb-6">
            <h4 className="text-xl font-semibold">IT Technical Leader & Senior Jira Analyst</h4>
            <p className="text-purple-600"><strong>Solutions for Everyone S4E</strong></p>
            <p className="text-gray-600">2024 (March) – 2025 (August) | Remote</p>
            <ul className="list-disc list-inside mb-4">
              <li>Led technical projects and teams, software validation, and AI solution design (Jira/Customer ChatBots).</li>
              <li>Delivered robust full-stack software solutions and deployed AI agents within cloud environments.</li>
              <li>Acted as the main technical representative in customer meetings, translating requirements and presenting solutions.</li>
              <li>Mentored and trained new team members, fostering a collaborative environment.</li>
            </ul>
          </div>
          <div className="mb-6">
            <h4 className="text-xl font-semibold">Jira Analyst & AWS Cloud Practitioner</h4>
            <p className="text-purple-600"><strong>Solutions for Everyone S4E</strong></p>
            <p className="text-gray-600">2021 (June) – 2024 (March) | Remote</p>
            <ul className="list-disc list-inside mb-4">
              <li>Led and coordinated technical projects using agile methodologies (Kanban and Scrum) to ensure project continuity and timely delivery.</li>
              <li>Automated key software creation processes, reducing delivery time from 30 hours to 2 hours and significantly increasing team efficiency.</li>
              <li>Provided expert guidance and removed technical roadblocks for the team.</li>
              <li>Managed successful Jira and AWS integrations, collaborating with cross-functional teams.</li>
            </ul>
          </div>

          <h3 className="text-2xl font-bold mb-4">🏅 Certifications</h3>
          <table className="w-full mb-6 border-collapse border border-gray-300">
            <tbody>
              <tr>
                <td className="border border-gray-300 p-4 align-top" width="33%">
                  <ul>
                    <li>Hugging Face Certified: Large Language Models (LLM) Course</li>
                    <li>Hugging Face Certified: Model Context Protocol (MCP) Course</li>
                    <li>Hugging Face Certified: Agents Course</li>
                  </ul>
                </td>
                <td className="border border-gray-300 p-4 align-top" width="33%">
                  <ul>
                    <li>Datacamp Associate AI Engineer for Developers</li>
                    <li>Datacamp Data Engineer in Python</li>
                    <li>Datacamp Professional Data Engineer in Python</li>
                    <li>Datacamp Developing Large Language Models</li>
                  </ul>
                </td>
                <td className="border border-gray-300 p-4 align-top" width="33%">
                  <ul>
                    <li>Atlassian Certified in Managing Jira Projects for Data Center</li>
                    <li>Atlassian Certified in Managing Jira Projects for Cloud</li>
                    <li><em>+50 more IT/AI certifications upon request</em></li>
                  </ul>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </div>
  );
};

export default CVModal;
