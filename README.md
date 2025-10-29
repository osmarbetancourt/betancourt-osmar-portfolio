# Betancourt Osmar Portfolio

![License](https://img.shields.io/github/license/osmarbetancourt/betancourt-osmar-portfolio)
![Last Commit](https://img.shields.io/github/last-commit/osmarbetancourt/betancourt-osmar-portfolio)
![Python](https://img.shields.io/badge/python-3.10+-blue)
![React](https://img.shields.io/badge/React-18+-blue)

This repository hosts the source code for Osmar Betancourt's personal portfolio website. It showcases my projects, experience, certifications, and now features advanced AI-powered tools for text, code, and image generation.

## Table of Contents

* [Live Deployment](#live-deployment)
* [Architecture](#architecture)
* [Features](#features)
* [Environment Variables](#environment-variables)
* [Getting Started (Local Development)](#getting-started-local-development)
* [Deployment](#deployment)
* [Content Management](#content-management)
* [Troubleshooting Local Development](#troubleshooting-local-development)
* [Contributing](#contributing)
* [License](#license)

## Live Deployment

This application is fully deployed and accessible online:

* **Frontend (Portfolio Website):** <https://www.betancourtosmar.com/>
  * *(Note: The apex domain `betancourtosmar.com` should redirect to `www.betancourtosmar.com`.)*
* **Backend (API):** Available at its designated API endpoint.
  * *(You can access the browsable API at `/api/projects/` or `/api/chat/`.)*

## Architecture

The project follows a modern decoupled architecture:

* **Frontend:** A dynamic Single Page Application (SPA) built with **React** and **Vite**, styled with **Tailwind CSS**. It consumes data from the backend API.
* **Backend:** A robust API built with **Django** and **Django REST Framework (DRF)**. It manages project data, handles user-uploaded media files, and integrates with multiple AI models.
* **Database:** **PostgreSQL** for persistent data storage.
* **Persistent Storage:** User-uploaded media files (like project images) are stored on **Hetzner** using Docker volumes for durability.
* **Containerization:** Both frontend and backend services are containerized using **Docker** and orchestrated locally with **Docker Compose**.
* **Deployment:** All services are deployed on a **Hetzner** server using Docker Compose for orchestration.
* **Reverse Proxy:** **Caddy** handles domain routing and SSL termination for `www.betancourtosmar.com` (frontend) and `api.betancourtosmar.com` (backend).
* **AI Integration:**
  * **Text & Code Chatbot:** Powered by **Mistral-7B-Instruct-v0.3** and **Google Gemini API** for dynamic text and code generation.
  * **Image Generation:** Generate images from text prompts using generative AI models.
  * **Custom AI Models:** Integrates with Hugging Face for fine-tuned models and custom codegen.

## Features

* **Responsive Design:** Optimized for various screen sizes, from mobile to desktop.
* **Project Showcase:** Dynamically loads and displays portfolio projects with images, descriptions, and links.
* **Experience & Certifications:** Dedicated sections highlighting professional experience and academic achievements.
* **Contact Information:** Easy ways to get in touch.
* **Interactive AI Chatbot:** Live chatbot powered by Mistral-7B v0.3 and Google Gemini, supporting both text and code queries.
* **Code Generation:** Generate code snippets and get coding help via conversational AI.
* **Image Generation:** Create images from text prompts using generative AI.
* **Secure API:** Project management API endpoints are secured, allowing only authenticated users (via Django admin) to create, update, or delete projects.

## Environment Variables

### Backend (`.env` in project root)

```env
# Django Settings
DJANGO_SECRET_KEY=your_very_secret_key_here_for_dev_dont_share
DJANGO_DEBUG=True
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1,.betancourtosmar.com,web,www.betancourtosmar.com,api.betancourtosmar.com
DJANGO_CSRF_TRUSTED_ORIGINS=https://www.betancourtosmar.com,https://betancourtosmar.com
DJANGO_CSRF_COOKIE_SECURE=True

# PostgreSQL Settings (for local Docker container)
POSTGRES_DB=portfolio_db
POSTGRES_USER=admin_portfolio_user
POSTGRES_PASSWORD=your_secure_password_here
POSTGRES_HOST=db
POSTGRES_PORT=5432

# Google Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here

# Hugging Face Model and API Token
HF_MODEL_ID=betancourtosmar/fine-tuned-mistral-django-qa
HF_API_TOKEN=your_huggingface_api_token_here

# reCAPTCHA Secret Key
RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key_here

# Google OAuth Client ID
GOOGLE_CLIENT_ID=your_google_client_id_here

# Additional for production
PINECONE_API_KEY=your_pinecone_api_key_here
PINECONE_HOST=your_pinecone_host_here
RENDER_API_KEY=your_render_api_key_here
```

### Frontend (`frontend/.env.local`)

```env
VITE_APP_BACKEND_URL=https://api.betancourtosmar.com
VITE_APP_FRONTEND_HOSTS=localhost,127.0.0.1,www.betancourtosmar.com,betancourtosmar.com
VITE_RECAPTCHA_SITE_KEY=your_recaptcha_site_key_here
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

* **`GOOGLE_CLIENT_ID`** and **`VITE_GOOGLE_CLIENT_ID`**: Required for Google OAuth login integration.
* **`GEMINI_API_KEY`**: For Google Gemini AI features.
* **`HF_MODEL_ID`** and **`HF_API_TOKEN`**: For custom Hugging Face model integration.
* **`RECAPTCHA_SECRET_KEY`** and **`VITE_RECAPTCHA_SITE_KEY`**: For bot/spam protection.

## Getting Started (Local Development)

To run this project locally using Docker Compose, ensure you have Docker Desktop installed and running.

1. **Clone the repository:**

    ```bash
    git clone https://github.com/osmarbetancourt/betancourt-osmar-portfolio.git
    cd betancourt-osmar-portfolio
    ```

2. **Create `.env` file for Backend:**
    Create a file named `.env` in the root of the `betancourt-osmar-portfolio/` directory (where `docker-compose.yml` is located). **Do NOT commit this file to Git.**
    (See above for required variables.)

3. **Create `.env.local` file for Frontend:**
    Create a file named `.env.local` inside the `frontend/` directory. **Add `/.env.local` to `frontend/.gitignore`.**
    (See above for required variables.)

4. **Build and Run Docker Containers:**

    ```bash
    docker compose build
    docker compose up --force-recreate
    ```

5. **Apply Migrations and Create Superuser (Backend):**
    Open a **new terminal** in the project root (while `docker compose up` is running) and execute:

    ```bash
    docker compose exec web python manage.py migrate
    docker compose exec web python manage.py createsuperuser
    ```

    Follow the prompts to create your admin user.

6. **Access the Applications Locally:**
    * **Frontend:** `http://localhost:5173/`
    * **Backend API:** `http://localhost:8000/api/projects/`
    * **Django Admin:** `http://localhost:8000/admin/`

## Deployment

This project is deployed on Hetzner using GitHub Actions for CI/CD. The deployment process involves:

* **Backend Service:** A Python web service running Django, connected to a PostgreSQL database and persistent Docker volumes for media file storage.
* **Frontend Service:** A Node.js web service running the React application.
* **Database:** PostgreSQL running in a Docker container with persistent volumes.
* **Reverse Proxy:** Caddy handles routing and SSL for custom domains (`www.betancourtosmar.com` for frontend, `api.betancourtosmar.com` for backend). SSL certificates are automatically managed by Caddy.
* **CI/CD:** GitHub Actions workflow (`deploy-production.yml`) handles testing, building, and deploying to the Hetzner server via SSH and Docker Compose.

To deploy manually or trigger the workflow, ensure all environment secrets are set in GitHub Actions settings for the production environment.

## Content Management

* Log in to the Django Admin at `http://localhost:8000/admin/` using your superuser credentials to add, edit, or delete portfolio projects. Images uploaded here will be stored persistently.

## Troubleshooting Local Development

If you still encounter the "Protocol 'http:' not supported. Expected 'https:'" error locally, despite `VITE_APP_BACKEND_URL` being `http://web:8000`, it might indicate a deeper Node.js/Vite proxy issue with protocol handling. As a temporary workaround for local development, you could try explicitly setting `secure: false` and removing the `https` agent logic from `vite.config.js` when `mode === 'development'`, but this is usually not necessary. Ensure all Docker containers are fully rebuilt and recreated.

## Contributing

Feel free to explore the codebase. For any questions or suggestions, please open an issue or contact me directly.

## License

This project is licensed under the **MIT License**.

---

## MIT License

Copyright (c) 2025

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

## What's New

* Upgraded to **Mistral-7B-Instruct-v0.3** for improved chat and codegen.
* Added **code generation** and **image generation** features.
* Integrated Google OAuth for secure login.
* Improved environment variable management and documentation.
* Enhanced AI chatbot with support for both text and code queries.
* Improved deployment and security best practices.
