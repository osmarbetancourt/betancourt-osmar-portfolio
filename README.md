# Betancourt Osmar Portfolio

This repository hosts the source code for Osmar Betancourt's personal portfolio website. It showcases my projects, experience, and certifications, along with an interactive AI chatbot.

## Table of Contents

* [Live Deployment](#live-deployment)
* [Architecture](#architecture)
* [Features](#features)
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
* **Backend:** A robust API built with **Django** and **Django REST Framework (DRF)**. It manages project data, handles user-uploaded media files, and integrates with the Google Gemini AI.
* **Database:** **PostgreSQL** for persistent data storage.
* **Persistent Storage:** User-uploaded media files (like project images) are stored on a **Render Persistent Disk** for durability.
* **Containerization:** Both frontend and backend services are containerized using **Docker** and orchestrated locally with **Docker Compose**.
* **Deployment:** All services are deployed on **Render**, leveraging its capabilities for web services, databases, and persistent disks.
* **AI Integration:** Features an interactive **AI Chatbot** powered by the **Google Gemini API** for dynamic interactions, and also integrates with the **Mistral-7B-Instruct-v0.2** model for a custom AI chat experience.

## Features

* **Responsive Design:** Optimized for various screen sizes, from mobile to desktop.
* **Project Showcase:** Dynamically loads and displays portfolio projects with images, descriptions, and links.
* **Experience & Certifications:** Dedicated sections highlighting professional experience and academic achievements.
* **Contact Information:** Easy ways to get in touch.
* **Interactive AI Chatbot:** A live chatbot powered by Google Gemini, integrated directly into the portfolio.
* **Secure API:** Project management API endpoints are secured, allowing only authenticated users (via Django admin) to create, update, or delete projects.

## Getting Started (Local Development)

To run this project locally using Docker Compose, ensure you have Docker Desktop installed and running.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/osmarbetancourt/betancourt-osmar-portfolio.git
    cd betancourt-osmar-portfolio
    ```

2.  **Create `.env` file for Backend:**
    Create a file named `.env` in the root of the `betancourt-osmar-portfolio/` directory (where `docker-compose.yml` is located). **Do NOT commit this file to Git.**
    ```
    # Django Settings
    DJANGO_SECRET_KEY=your_very_secret_key_here_for_dev_dont_share
    DJANGO_DEBUG=True
    DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1,.betancourtosmar.com,web # 'web' for Docker Compose internal network

    # PostgreSQL Settings (for local Docker container)
    POSTGRES_DB=django_db
    POSTGRES_USER=django_user
    POSTGRES_PASSWORD=django_password
    POSTGRES_HOST=db
    POSTGRES_PORT=5432

    # Google Gemini API Key (for local AI chatbot functionality)
    GEMINI_API_KEY=your_gemini_api_key_here

    # Hugging Face Inference API Token (for custom AI model)
    HF_API_TOKEN=your_huggingface_api_token_here

    # reCAPTCHA Secret Key (for backend verification)
    RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key_here

    # CSRF Settings for Local Admin Access (if needed)
    DJANGO_CSRF_COOKIE_SECURE=False
    DJANGO_CSRF_TRUSTED_ORIGINS=http://localhost:8000,http://127.0.0.1:8000
    ```
    * **`DJANGO_SECRET_KEY`**: Replace with a random string.
    * **`GEMINI_API_KEY`**: Obtain your API key from Google AI Studio.
    * **`HF_API_TOKEN`**: Obtain your API token from Hugging Face for model inference.
    * **`RECAPTCHA_SECRET_KEY`**: Obtain your reCAPTCHA secret key from Google reCAPTCHA Admin console.

3.  **Create `.env.local` file for Frontend:**
    Create a file named `.env.local` inside the `frontend/` directory. **Add `/.env.local` to `frontend/.gitignore`.**
    ```
    VITE_APP_BACKEND_URL=http://web:8000
    VITE_APP_FRONTEND_HOSTS=localhost,127.0.0.1
    VITE_RECAPTCHA_SITE_KEY=your_recaptcha_site_key_here
    ```
    * **`VITE_RECAPTCHA_SITE_KEY`**: Obtain your reCAPTCHA site key from Google reCAPTCHA Admin console. This is a public key.

4.  **Build and Run Docker Containers:**
    ```bash
    docker compose build
    docker compose up --force-recreate # --force-recreate ensures latest env vars are picked up
    ```

5.  **Apply Migrations and Create Superuser (Backend):**
    Open a **new terminal** in the project root (while `docker compose up` is running) and execute:
    ```bash
    docker compose exec web python manage.py migrate
    docker compose exec web python manage.py createsuperuser
    ```
    Follow the prompts to create your admin user.

6.  **Access the Applications Locally:**
    * **Frontend:** `http://localhost:5173/`
    * **Backend API:** `http://localhost:8000/api/projects/`
    * **Django Admin:** `http://localhost:8000/admin/` (Login here to manage projects)

## Deployment

This project is deployed on Render. The deployment process involves:

* **Backend Service:** A Python web service running Django, connected to a Render PostgreSQL database and a **Persistent Disk** for media file storage.
* **Frontend Service:** A Node.js web service running the React application.
* **Custom Domains:** Configured to use `www.betancourtosmar.com` for the frontend. SSL certificates are automatically managed by Render.

## Content Management

* Log in to the Django Admin at `http://localhost:8000/admin/` using your superuser credentials to add, edit, or delete portfolio projects. Images uploaded here will be stored persistently.

## Troubleshooting Local Development

If you still encounter the "Protocol 'http:' not supported. Expected 'https:'" error locally, despite `VITE_APP_BACKEND_URL` being `http://web:8000`, it might indicate a deeper Node.js/Vite proxy issue with protocol handling. As a temporary workaround for local development, you could try explicitly setting `secure: false` and removing the `https` agent logic from `vite.config.js` when `mode === 'development'`, but this is usually not necessary. Ensure all Docker containers are fully rebuilt and recreated.

## Contributing

Feel free to explore the codebase. For any questions or suggestions, please open an issue or contact me directly.

## License

This project is licensed under the **MIT License**.

---

**MIT License**

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