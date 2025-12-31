# 🤖 Intelligent Multi-Format Document Q&A System

An advanced **Agentic RAG (Retrieval-Augmented Generation)** system that intelligently processes complex, multi-format documents and answers questions using autonomous AI agents.

[![Python](https://img.shields.io/badge/Python-3.9+-blue.svg)](https://www.python.org/downloads/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.109.0-green.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18.2.0-61dafb.svg)](https://reactjs.org/)
[![LangChain](https://img.shields.io/badge/LangChain-0.1.4-orange.svg)](https://www.langchain.com/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4-412991.svg)](https://openai.com/)

![Demo Screenshot](https://via.placeholder.com/1200x600/1e293b/a78bfa?text=Agentic+RAG+System)

---

## 📋 Table of Contents

- [Features](#-features)
- [Architecture](#-architecture)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running the Application](#-running-the-application)
- [Usage Guide](#-usage-guide)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Technologies Used](#-technologies-used)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 🎯 Core Capabilities
- **Multi-Format Document Support**: PDF, DOCX, TXT files with intelligent parsing
- **Layout-Aware Processing**: Preserves document structure, tables, and images
- **Multi-Agent Architecture**: 4 specialized AI agents working collaboratively
- **Advanced RAG Pipeline**: Hybrid search with dynamic strategy selection
- **Real-Time Agent Visualization**: Watch AI agents work in real-time
- **Source Citations**: Every answer includes sources with page numbers
- **Confidence Scoring**: AI provides confidence scores for reliability

### 🤖 AI Agents

1. **Document Parser Agent** - Analyzes document structure and layout
2. **Query Analyzer Agent** - Understands question intent and complexity
3. **Retrieval Strategist Agent** - Selects optimal search strategy
4. **Response Synthesizer Agent** - Compiles answers with quality verification

### 📊 Document Features

- ✅ Multi-column text extraction
- ✅ Table detection and extraction
- ✅ Image and chart recognition
- ✅ Layout-aware chunking
- ✅ Semantic embedding generation
- ✅ Vector store indexing

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend (React)                     │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │  Document   │  │  Chat        │  │  Agent Activity  │  │
│  │  Upload     │  │  Interface   │  │  Visualization   │  │
│  └─────────────┘  └──────────────┘  └──────────────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │ REST API
┌────────────────────────▼────────────────────────────────────┐
│                    Backend (FastAPI)                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Multi-Agent System                       │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐    │  │
│  │  │  Document  │→ │   Query    │→ │ Retrieval  │    │  │
│  │  │   Parser   │  │  Analyzer  │  │ Strategist │    │  │
│  │  └────────────┘  └────────────┘  └────────────┘    │  │
│  │         │               │                │          │  │
│  │         └───────────────┴────────────────┘          │  │
│  │                         │                            │  │
│  │                  ┌──────▼────────┐                  │  │
│  │                  │   Response    │                  │  │
│  │                  │ Synthesizer   │                  │  │
│  │                  └───────────────┘                  │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              LangChain + OpenAI                      │  │
│  │  ┌─────────────┐  ┌──────────────┐  ┌───────────┐  │  │
│  │  │  Document   │  │   Embeddings │  │  Vector   │  │  │
│  │  │  Processing │  │   (OpenAI)   │  │  Store    │  │  │
│  │  └─────────────┘  └──────────────┘  └───────────┘  │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.9 or higher** - [Download Python](https://www.python.org/downloads/)
- **Node.js 18 or higher** - [Download Node.js](https://nodejs.org/)
- **Git** - [Download Git](https://git-scm.com/)
- **OpenAI API Key** - [Get API Key](https://platform.openai.com/api-keys)

### System Requirements
- **RAM**: 4GB minimum (8GB recommended)
- **Storage**: 2GB free space
- **OS**: Windows 10+, macOS 10.15+, or Linux (Ubuntu 20.04+)

---

## 🚀 Installation

### Step 1: Clone or Create Project

```bash
# Create project directory
mkdir agentic-rag-system
cd agentic-rag-system
```

### Step 2: Backend Setup

```bash
# Create backend directory and structure
mkdir -p backend/app/agents backend/app/services backend/app/utils
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Create requirements.txt
cat > requirements.txt << EOF
fastapi==0.109.0
uvicorn[standard]==0.27.0
python-multipart==0.0.6
python-dotenv==1.0.0
langchain==0.1.4
langchain-openai==0.0.5
langchain-community==0.0.16
openai==1.10.0
chromadb==0.4.22
pypdf==3.17.4
pdfplumber==0.10.3
python-docx==1.1.0
pillow==10.2.0
pytesseract==0.3.10
sentence-transformers==2.3.1
tiktoken==0.5.2
numpy==1.26.3
pydantic==2.5.3
pydantic-settings==2.1.0
aiofiles==23.2.1
EOF

# Install dependencies
pip install -r requirements.txt

# Create necessary directories
mkdir uploads vector_store
```

Copy all Python files from the artifacts into the `backend/app/` directory structure.

### Step 3: Frontend Setup

```bash
# Navigate back to project root
cd ..

# Create React app with Vite
npm create vite@latest frontend -- --template react
cd frontend

# Install dependencies
npm install
npm install axios lucide-react
npm install -D tailwindcss postcss autoprefixer

# Initialize Tailwind CSS
npx tailwindcss init -p
```

Copy all React files from the artifacts into the `frontend/src/` directory structure.

---

## ⚙️ Configuration

### Backend Configuration

Create a `.env` file in the `backend/` directory:

```bash
cd backend
touch .env
```

Add the following configuration to `backend/.env`:

```env
# 🔑 REQUIRED: Add your OpenAI API key here
OPENAI_API_KEY=sk-your-actual-openai-api-key-here

# Optional: Anthropic API key (if you want to use Claude)
ANTHROPIC_API_KEY=your-anthropic-api-key-here

# Directory Settings
UPLOAD_DIR=./uploads
VECTOR_STORE_DIR=./vector_store

# File Upload Settings
MAX_FILE_SIZE=50000000

# OpenAI Model Settings
EMBEDDING_MODEL=text-embedding-3-small
LLM_MODEL=gpt-4-turbo-preview

# Document Processing Settings
CHUNK_SIZE=1000
CHUNK_OVERLAP=200
```

### ⚠️ IMPORTANT: OpenAI API Key

1. **Get your API key**: Visit [OpenAI API Keys](https://platform.openai.com/api-keys)
2. **Create new key**: Click "Create new secret key"
3. **Copy the key**: It looks like `sk-...` (starts with sk-)
4. **Replace in .env**: Replace `sk-your-actual-openai-api-key-here` with your actual key
5. **Keep it secret**: Never commit your API key to version control!

### Frontend Configuration (Optional)

Create `.env` in the `frontend/` directory if you want to customize the API URL:

```env
VITE_API_URL=http://localhost:8000/api
```

---

## 🏃 Running the Application

### Option 1: Run with Two Terminals (Recommended)

#### Terminal 1: Start Backend

```bash
# Navigate to backend directory
cd backend

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Start the backend server
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Expected Output:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

#### Terminal 2: Start Frontend

```bash
# Open new terminal
# Navigate to frontend directory
cd frontend

# Start the frontend development server
npm run dev
```

**Expected Output:**
```
  VITE v5.0.11  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

### Option 2: Run with Scripts

Create startup scripts for convenience:

**Windows (start.bat):**
```batch
@echo off
start cmd /k "cd backend && venv\Scripts\activate && python -m uvicorn app.main:app --reload"
start cmd /k "cd frontend && npm run dev"
```

**macOS/Linux (start.sh):**
```bash
#!/bin/bash
cd backend && source venv/bin/activate && python -m uvicorn app.main:app --reload &
cd frontend && npm run dev &
```

Make it executable:
```bash
chmod +x start.sh
./start.sh
```

### Access the Application

Once both servers are running:

- 🌐 **Frontend**: http://localhost:5173
- 🔧 **Backend API**: http://localhost:8000
- 📚 **API Docs**: http://localhost:8000/docs
- 📖 **ReDoc**: http://localhost:8000/redoc

---

## 📖 Usage Guide

### 1. Upload a Document

1. Open http://localhost:5173 in your browser
2. Click **"Upload Document"** or drag & drop a file
3. Supported formats: PDF, DOCX, TXT (max 50MB)
4. Wait for processing (you'll see progress bar)
5. View document stats in the left panel

### 2. Ask Questions

Once your document is uploaded:

1. Type your question in the chat input
2. Press **Enter** or click **"Send"**
3. Watch the AI agents work in real-time (Agent Activity panel)
4. View the answer with sources and confidence score

### 3. Example Questions

**Factual Questions:**
- "What is the main topic of this document?"
- "Who are the authors?"
- "When was this published?"

**Analytical Questions:**
- "Explain the methodology used"
- "Why is this approach important?"
- "How does this compare to previous work?"

**Data Questions:**
- "What are the key statistics?"
- "Show me data from the tables"
- "What are the performance metrics?"

**Visual Questions:**
- "Describe the diagrams in the document"
- "What does the chart on page 5 show?"

### 4. Understanding Responses

Each AI response includes:
- **Answer**: AI-generated response based on document
- **Confidence Score**: Reliability indicator (70-100%)
- **Query Type**: Classification of your question
- **Retrieval Strategy**: Method used to find information
- **Sources**: Excerpts from the document with page numbers

### 5. Agent Activity

Watch the multi-agent system work:
- **Document Parser**: Analyzes structure
- **Query Analyzer**: Classifies your question
- **Retrieval Strategist**: Selects search method
- **Retrieval Engine**: Searches knowledge base
- **Response Synthesizer**: Generates final answer

---

## 📡 API Documentation

### Base URL
```
http://localhost:8000/api
```

### Endpoints

#### 1. Upload Document
```http
POST /api/upload
Content-Type: multipart/form-data

Request:
- file: File (PDF, DOCX, TXT)

Response:
{
  "doc_id": "uuid",
  "filename": "document.pdf",
  "pages": 10,
  "chunks": 45,
  "tables": 3,
  "images": 5,
  "status": "success",
  "message": "Document processed successfully"
}
```

#### 2. Query Document
```http
POST /api/query
Content-Type: application/json

Request:
{
  "doc_id": "uuid",
  "query": "What is this document about?"
}

Response:
{
  "answer": "The document discusses...",
  "sources": [...],
  "confidence": 0.92,
  "agent_logs": [...],
  "query_type": "factual",
  "retrieval_strategy": "Dense Vector Search"
}
```

#### 3. List Documents
```http
GET /api/documents

Response:
{
  "documents": [
    {
      "doc_id": "uuid",
      "filename": "document.pdf",
      "pages": 10,
      "chunks": 45,
      "tables": 3,
      "images": 5,
      "upload_time": "2024-01-01T00:00:00"
    }
  ]
}
```

#### 4. Get Document Info
```http
GET /api/documents/{doc_id}

Response:
{
  "doc_id": "uuid",
  "filename": "document.pdf",
  "pages": 10,
  "chunks": 45,
  "tables": 3,
  "images": 5,
  "upload_time": "2024-01-01T00:00:00"
}
```

### Interactive API Documentation

Visit http://localhost:8000/docs for interactive Swagger UI documentation where you can test all endpoints.

---

## 📁 Project Structure

```
agentic-rag-system/
│
├── backend/                          # FastAPI Backend
│   ├── venv/                         # Python virtual environment
│   ├── uploads/                      # Uploaded documents
│   ├── vector_store/                 # ChromaDB vector storage
│   │
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                   # FastAPI application
│   │   ├── config.py                 # Configuration settings
│   │   ├── models.py                 # Pydantic models
│   │   │
│   │   ├── agents/                   # AI Agent implementations
│   │   │   ├── __init__.py
│   │   │   ├── document_parser.py    # Document parsing agent
│   │   │   ├── query_analyzer.py     # Query analysis agent
│   │   │   ├── retrieval_strategist.py  # Retrieval strategy agent
│   │   │   └── response_synthesizer.py  # Response generation agent
│   │   │
│   │   ├── services/                 # Business logic services
│   │   │   ├── __init__.py
│   │   │   ├── document_service.py   # Document processing
│   │   │   ├── embedding_service.py  # Embedding generation
│   │   │   └── vector_store.py       # Vector store management
│   │   │
│   │   └── utils/                    # Utility functions
│   │       ├── __init__.py
│   │       └── file_utils.py         # File handling utilities
│   │
│   ├── requirements.txt              # Python dependencies
│   └── .env                          # Environment variables (⚠️ add your API key here)
│
├── frontend/                         # React Frontend
│   ├── node_modules/                 # Node dependencies
│   ├── public/                       # Static assets
│   │
│   ├── src/
│   │   ├── components/               # React components
│   │   │   ├── DocumentUpload.jsx    # Document upload component
│   │   │   ├── DocumentInfo.jsx      # Document info display
│   │   │   ├── AgentActivity.jsx     # Agent activity visualization
│   │   │   └── ChatInterface.jsx     # Chat interface
│   │   │
│   │   ├── services/
│   │   │   └── api.js                # API service layer
│   │   │
│   │   ├── App.jsx                   # Main application component
│   │   ├── main.jsx                  # React entry point
│   │   └── index.css                 # Global styles
│   │
│   ├── index.html                    # HTML template
│   ├── package.json                  # Node dependencies
│   ├── vite.config.js                # Vite configuration
│   ├── tailwind.config.js            # Tailwind CSS config
│   └── postcss.config.js             # PostCSS config
│
└── README.md                         # This file
```

---

## 🛠️ Technologies Used

### Backend
- **FastAPI** - Modern, fast web framework for Python
- **LangChain** - Framework for developing LLM applications
- **OpenAI API** - GPT-4 and embedding models
- **ChromaDB** - Vector database for embeddings
- **PyPDF/PDFPlumber** - PDF processing
- **python-docx** - DOCX processing
- **Pydantic** - Data validation
- **Uvicorn** - ASGI server

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **Lucide React** - Icon library

### AI/ML
- **GPT-4 Turbo** - Language model for responses
- **text-embedding-3-small** - Embedding model
- **Sentence Transformers** - Text embeddings
- **RecursiveCharacterTextSplitter** - Document chunking

---

## 🐛 Troubleshooting

### Backend Issues

#### Issue: "No module named 'app'"
```bash
# Solution: Ensure you're in the backend directory
cd backend
python -m uvicorn app.main:app --reload
```

#### Issue: "OPENAI_API_KEY not found"
```bash
# Check your .env file exists
ls -la .env

# Verify it contains your API key
cat .env | grep OPENAI_API_KEY

# Make sure the key starts with 'sk-'
```

#### Issue: "Port 8000 already in use"
```bash
# Find and kill the process
# Windows:
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# macOS/Linux:
lsof -ti:8000 | xargs kill -9

# Or use a different port:
python -m uvicorn app.main:app --reload --port 8001
```

#### Issue: "Invalid API key"
- Verify your OpenAI API key is correct
- Check you have credits in your OpenAI account
- Ensure the key starts with `sk-`

### Frontend Issues

#### Issue: "Cannot connect to backend"
```bash
# Check if backend is running
curl http://localhost:8000/

# Verify proxy settings in vite.config.js
# Check CORS settings in backend/app/main.py
```

#### Issue: "Module not found"
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### Issue: "Vite not found"
```bash
# Install Vite globally
npm install -g vite

# Or run with npx
npx vite
```

### Common Errors

#### "File too large"
- Files must be under 50MB
- Adjust `MAX_FILE_SIZE` in `.env` if needed

#### "Timeout error"
- Large documents take time to process
- Increase timeout in `frontend/src/services/api.js`

#### "Out of memory"
- Close unnecessary applications
- Reduce `CHUNK_SIZE` in `.env`
- Process smaller documents

### Getting Help

1. Check the logs in both terminals
2. Review the [API documentation](http://localhost:8000/docs)
3. Verify all dependencies are installed
4. Ensure your OpenAI API key is valid and has credits

---

## 🔒 Security Best Practices

1. **Never commit `.env` files** to version control
2. **Keep API keys secret** - don't share them
3. **Use environment variables** for sensitive data
4. **Implement rate limiting** in production
5. **Add authentication** for production deployment
6. **Validate file uploads** to prevent malicious files
7. **Set proper CORS origins** in production

### .gitignore

Add to your `.gitignore`:
```
# Environment variables
.env
.env.local
.env.production

# Python
venv/
__pycache__/
*.pyc
uploads/
vector_store/

# Node
node_modules/
dist/
.DS_Store
```

---

## 🚀 Deployment

### Docker Deployment

Create `Dockerfile` for backend:
```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

Create `docker-compose.yml`:
```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    volumes:
      - ./backend/uploads:/app/uploads
      - ./backend/vector_store:/app/vector_store
  
  frontend:
    build: ./frontend
    ports:
      - "5173:5173"
    depends_on:
      - backend
```

### Cloud Deployment

- **Backend**: Deploy to AWS Lambda, Google Cloud Run, or Heroku
- **Frontend**: Deploy to Vercel, Netlify, or AWS S3 + CloudFront
- **Database**: Use managed vector DB (Pinecone, Weaviate)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow PEP 8 for Python code
- Use ESLint for JavaScript code
- Write descriptive commit messages
- Add tests for new features
- Update documentation

---

## 📝 License

This project is licensed under the MIT License - see below for details:

```
MIT License

Copyright (c) 2024

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
```

---

## 🙏 Acknowledgments

- OpenAI for GPT-4 and embedding models
- LangChain for the RAG framework
- FastAPI for the excellent web framework
- React team for the UI library
- All open-source contributors

---

## 📚 Additional Resources

- [OpenAI Documentation](https://platform.openai.com/docs)
- [LangChain Documentation](https://python.langchain.com/docs/get_started/introduction)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

## 🎯 Roadmap

- [ ] Add support for more document formats (Excel, PPT)
- [ ] Implement document comparison features
- [ ] Add multi-user support with authentication
- [ ] Implement conversation history
- [ ] Add export functionality for answers
- [ ] Support for multiple languages
- [ ] Add speech-to-text for voice queries
- [ ] Implement advanced analytics dashboard
- [ ] Add collaborative features
- [ ] Mobile app development

---

## ⭐ Star History

If you find this project useful, please consider giving it a star on GitHub!

---

## 💡 Tips for Best Results

1. **Document Quality**: Use high-quality PDFs with clear text
2. **File Size**: Start with smaller documents (< 10 pages) for testing
3. **Question Format**: Be specific and clear in your questions
4. **API Costs**: Monitor your OpenAI API usage
5. **Performance**: Adjust chunk size based on document complexity

---

**Made with ❤️ by the Agentic RAG Team**

**🚀 Ready to get started? Follow the [Installation](#-installation) and [Configuration](#-configuration) sections above!**

---

**⚠️ IMPORTANT REMINDER:**
1. Get your OpenAI API key from https://platform.openai.com/api-keys
2. Add it to `backend/.env` file
3. Never commit your API key to version control!

**Happy Document Querying! 📚✨**