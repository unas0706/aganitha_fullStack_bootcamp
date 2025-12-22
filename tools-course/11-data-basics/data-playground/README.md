# Data Playground

This folder demonstrates how different data formats are used in real-world software projects.
Each file represents a common format you will encounter in backend, frontend, DevOps, and cloud environments.

---

## 📁 Folder Structure

data-playground/
├── samples.json
├── samples.csv
├── config.yaml
├── .env.example
└── README.md

---

## 📄 File Explanations

### 1️⃣ samples.json

**What it contains**

- Structured user data using key-value pairs
- Arrays and booleans
- Strict syntax (double quotes, commas, brackets)

**When JSON is used**

- REST & GraphQL APIs
- Frontend ↔ Backend communication
- Database storage (MongoDB)
- Configuration for frontend tools

**Why JSON**

- Language-independent
- Easy to parse
- Standard for web APIs

---

### 2️⃣ samples.csv

**What it contains**

- Same user data in tabular form
- Rows and columns
- Comma-separated values

**When CSV is used**

- Excel / Google Sheets
- Data import/export
- Reports and analytics
- Bulk uploads

**Why CSV**

- Simple
- Human-readable
- Supported everywhere

---

### 3️⃣ config.yaml

**What it contains**

- Application configuration
- Server settings
- Feature flags

**When YAML is used**

- Application configuration
- Docker Compose
- Kubernetes
- CI/CD pipelines (GitHub Actions, GitLab CI)

**Why YAML is good for configs**

- Clean and readable
- Less noisy than JSON
- Supports nested structures easily
- Ideal for humans, not machines only

---

### 4️⃣ .env.example

**What it contains**

- Example environment variables
- No real secrets
- Template for developers

**When .env is used**

- Storing secrets and environment-specific values
- API keys
- Database URLs
- Tokens and credentials

**Why secrets belong in `.env`**

- Keeps secrets out of GitHub
- Different values per environment (dev, staging, prod)
- Prevents accidental leaks
- Follows 12-factor app principles

⚠️ `.env` files should NEVER be committed  
✅ `.env.example` SHOULD be committed

---

## 🧠 Summary

| Format | Purpose                         |
| ------ | ------------------------------- |
| JSON   | APIs, data exchange             |
| YAML   | Configuration & DevOps          |
| CSV    | Reports & spreadsheets          |
| .env   | Secrets & environment variables |

This playground builds strong fundamentals for backend development, DevOps, and cloud-native applications.

---
