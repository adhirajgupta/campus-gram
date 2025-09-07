# Open Source Project Documentation

## Introduction

Welcome to the **Open Source University Deployment Project**!

This project allows universities and developers to:

* Deploy the platform on their own server using **Encore**
* Customize features, UI, and backend functionality
* Run it independently without relying on a central server

**Key Features:**

* Fully deployable on Encore
* Customizable backend and frontend
* Open-source and community-driven

***

## Prerequisites

Before you start, make sure you have the following installed and set up:

* **Node.js** (v18+) – [Download Node.js](https://nodejs.org/en/download/)
* **Git** – [Download Git](https://git-scm.com/downloads)
* **Encore account** – [Sign up on Encore](https://encore.dev/)
* Basic knowledge of Git commands

**Optional but recommended:**

* **Docker** – for local testing

***

## Getting Started

Follow these steps to set up the project locally and connect it to Encore.

### 1. Clone the Repository

```bash
git clone <campus-gram-repository-url>
cd <project-folder>
```

### 2. Login to Encore&#x20;

```bash
encore auth signup # If you haven't created an Encore Cloud account
encore auth login # If you've already created an Encore Cloud account
```

* You may be prompted to log in to your Encore account.

### 3. Create a Project

```
encore app create
```

* This will set up your Encore project in the current directory.

### 3. Connect to Git

```bash
git init
git remote add origin <repository-url>
git add .
git commit -m "Initial commit"
git push -u origin main
```

* This ensures your project is version-controlled and synced with Git.

***

## Deployment

Deploying your project on Encore is simple:

### 1. Deploy to Encore

```bash
git remote add encore encore://<app-id>
```

* App-id will be present in the file encore.app
* Encore will now build your project&#x20;

### 2. Verify Deployment

* Open Encore in your browser and login to your account
* Confirm that your project is running correctly.

### 3. Pushing to Encore

```
git add -A .
git commit -m 'Commit message'
git push encore
```

* Pushes changes to encore instead of github

### 4. Deploying in Encore Website&#x20;

* Under Environments > \<project-name> > Overview click on deploy&#x20;
* There should be an API and Frontend link generated in the Overview page

### 5. Running the Page

* Replace the ENV link with your backend link generated
* Edit the vite.config.ts

```
server: {
  host: '0.0.0.0',
  port: // some port number
  allowedHosts: [
    "all" // Replace with your backend link to make more secure
  ],
  cors:true,
    origin: // your frontend link
}

```

***

## Customization

You can customize the project according to your university’s needs.

### Backend

* Add or modify API endpoints
* Update database models or logic

### Frontend

* Change UI components
* Update styles and layouts
* Modify text, forms, and navigation

### Environment Configuration

* Use `.env` files for environment-specific settings (API keys, database URLs, etc.)
* Keep sensitive data out of your Git repository

***

## Contributing

We welcome contributions! Here’s how to get started:

1. **Fork the repository**
2. **Create a feature branch**

```bash
git checkout -b feature/your-feature
```

3. **Make changes and commit**

```bash
git add .
git commit -m "Add your feature"
```

4. **Push the branch**

```bash
git push origin feature/your-feature
```

5. **Submit a Pull Request** on GitHub

***

## Troubleshooting

Here are solutions to common issues:

* **Encore deployment errors:** Check your `encore.json` and ensure your project is initialized correctly.
* **Git push/pull issues:** Make sure your remote repository URL is correct and you have permission to push.
* **Local environment problems:** Ensure Node.js and dependencies are installed properly.

***

## Additional Resources

* [Encore Documentation](https://encore.dev/docs)
* [GitBook Guides](https://www.gitbook.com/)
* [Node.js Documentation](https://nodejs.org/en/docs/)
* [Git Documentation](https://git-scm.com/doc)
