# Betancourt Osmar Portfolio

This repository hosts the source code for Betancourt Osmar's personal portfolio website, built with Django and deployed using Docker on Render.

## Project Overview

This portfolio aims to showcase my skills, projects, and professional experience. It will feature:

* **Interactive Sections:** Demonstrating various technical skills.
* **Project Showcase:** Detailed descriptions and links to past projects.
* **Contact Form:** For inquiries and collaborations.
* **Blog/Articles (Future):** Potentially a section for technical articles or insights.

## Technologies Used

* **Backend:** Django (Python Web Framework)
* **Database:** PostgreSQL
* **Containerization:** Docker, Docker Compose
* **Deployment:** Render
* **AI Integration:** Google Gemini API (for interactive elements, e.g., a chatbot or content generation)

## Getting Started (Local Development)

To run this project locally using Docker Compose, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-github-username/betancourtosmarportfolio.git](https://github.com/your-github-username/betancourtosmarportfolio.git)
    cd betancourtosmar_portfolio
    ```
2.  **Install Docker Desktop:**
    Make sure you have Docker Desktop installed and running on your machine.
    [Download Docker Desktop](https://www.docker.com/products/docker-desktop/)

3.  **Create `.env_dev` file:**
    Create a file named `.env_dev` in the root of the project (`betancourtosmar_portfolio/`) and populate it with your local environment variables. **Do NOT commit this file to Git.**
    ```
    # Example content for .env_dev (replace with your actual values)
    DJANGO_SECRET_KEY=your_development_secret_key
    DJANGO_DEBUG=True
    DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1

    POSTGRES_DB=django_db
    POSTGRES_USER=django_user
    POSTGRES_PASSWORD=django_password
    POSTGRES_HOST=db
    POSTGRES_PORT=5432

    GEMINI_API_KEY=
    ```

4.  **Build and Run Docker Containers:**
    ```bash
    docker compose build
    docker compose up
    ```
    This will build the Docker images and start the Django web service and PostgreSQL database.

5.  **Apply Migrations and Create Superuser:**
    Open a **new terminal** in the project root (while `docker compose up` is running) and execute:
    ```bash
    docker compose exec web python manage.py migrate
    docker compose exec web python manage.py createsuperuser
    ```

6.  **Access the Application:**
    Open your web browser and navigate to `http://localhost:8000/`. You should see the Django welcome page. The admin interface will be at `http://localhost:8000/admin/`.

## Deployment

This project is configured for deployment on Render. Details on the Render `render.yaml` and deployment process will be added here as the project matures.