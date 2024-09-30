# Daily DevOps

**Daily DevOps** is a webpage hosted on [JordanWhite.dev](https://jordanwhite.dev) that showcases daily DevOps tips and facts. The project features a frontend, backend API, scheduler, and infrastructure managed using Google Cloud Platform (GCP) and automated with GitHub Actions. 

## Features

- **Frontend**: Written in JavaScript and Bootstrap, displaying daily DevOps content fetched from Firestore.
- **Backend API**: Built with Python Flask, which interacts with a Firestore database to fetch DevOps tips.
- **Python Scheduler**: Runs on a weekly cron job to pull fresh content from OpenAI and store it in the Firestore database.
- **Infrastructure as Code (IaC)**: Terraform manages domain, DNS, SSL, and Cloud Run services for the frontend and backend.
- **Automation Pipelines**: GitHub Actions automate the build, test, and deployment processes, including Terraform deployment and Docker image handling.

## Architecture

1. **Frontend**:
   - Built using HTML, JavaScript, and Bootstrap.
   - Displays daily DevOps tips pulled from Firestore via the backend API.
   - Deployed to Google Cloud Run and served via HTTPS using GCP Load Balancer.

2. **Backend**:
   - Flask API written in Python.
   - Pulls content from Firestore, structured as daily DevOps tips.
   - Deployed to Google Cloud Run and Dockerized, with images pushed to Artifactory.

3. **Scheduler**:
   - Python scheduler runs on a cron job (once per week).
   - Uses OpenAI's API to generate new DevOps content.
   - Stores the new content in Firestore for the frontend to display.

4. **Infrastructure**:
   - Managed using Terraform.
   - Terraform handles the following:
     - Domain and DNS management via Google Cloud.
     - SSL certificates for HTTPS.
     - Deployment of frontend and backend services to Google Cloud Run.
     - The Terraform state file is stored in a GCP bucket.

5. **CI/CD Pipelines**:
   - GitHub Actions for automation.
   - Automates the build and deployment of Docker images for both frontend and backend.
   - Infrastructure is provisioned using Terraform before application deployment.
   - Secrets such as GCP Service Account JSON, OpenAI keys, thread ID, and agent ID are securely stored in GitHub Action secrets.

## Tech Stack

- **Frontend**: JavaScript, HTML, Bootstrap
- **Backend API**: Python, Flask
- **Scheduler**: Python, OpenAI API
- **Database**: Firestore
- **Infrastructure**: Terraform, Google Cloud (Cloud Run, Load Balancer, Cloud DNS, SSL)
- **Containerization**: Docker, Artifactory
- **Automation**: GitHub Actions