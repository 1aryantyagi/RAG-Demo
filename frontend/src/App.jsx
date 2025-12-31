import React, { useState, useEffect } from 'react';
import { Brain, AlertCircle, Wifi, WifiOff } from 'lucide-react';
import DocumentUpload from './components/DocumentUpload';
import DocumentInfo from './components/DocumentInfo';
import AgentActivity from './components/AgentActivity';
import ChatInterface from './components/ChatInterface';
import { uploadDocument, queryDocument, checkHealth } from './services/api';

function App() {
  const [currentDoc, setCurrentDoc] = useState(null);
  const [messages, setMessages] = useState([]);
  const [query, setQuery] = useState('');
  const [processing, setProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [agentLogs, setAgentLogs] = useState([]);
  const [showAgentPanel, setShowAgentPanel] = useState(true);
  const [backendStatus, setBackendStatus] = useState('checking');
  const [error, setError] = useState(null);

  // Check backend health on mount
  useEffect(() => {
    const checkBackend = async () => {
      try {
        await checkHealth();
        setBackendStatus('online');
      } catch (err) {
        setBackendStatus('offline');
        setError('Cannot connect to backend. Please ensure the backend server is running on http://localhost:8000');
      }
    };
    
    checkBackend();
    const interval = setInterval(checkBackend, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  const handleUpload = async (file) => {
    setProcessing(true);
    setUploadProgress(0);
    setAgentLogs([]);
    setError(null);

    try {
      const result = await uploadDocument(file, (progress) => {
        setUploadProgress(Math.min(progress, 90)); // Cap at 90% until complete
      });
      
      setUploadProgress(100);

      const docInfo = {
        doc_id: result.doc_id,
        filename: result.filename,
        pages: result.pages,
        chunks: result.chunks,
        tables: result.tables,
        images: result.images,
        upload_time: new Date().toISOString()
      };

      setCurrentDoc(docInfo);

      setMessages(prev => [...prev, {
        type: 'system',
        content: `✅ Document "${result.filename}" processed successfully!\n\n📊 Analysis:\n• ${result.pages} pages indexed\n• ${result.chunks} semantic chunks created\n• ${result.tables} tables detected\n• ${result.images} images found\n\nReady to answer your questions!`
      }]);

      setTimeout(() => setUploadProgress(0), 2000);
    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = error.response?.data?.detail || error.message || 'Failed to upload document. Please try again.';
      setError(errorMessage);
      setMessages(prev => [...prev, {
        type: 'error',
        content: errorMessage
      }]);
      setUploadProgress(0);
    } finally {
      setProcessing(false);
    }
  };

  const handleQuery = async () => {
    if (!query.trim() || !currentDoc || processing) return;

    const userQuery = query;
    setQuery('');
    setMessages(prev => [...prev, { type: 'user', content: userQuery }]);
    setProcessing(true);
    setAgentLogs([]);
    setError(null);

    try {
      const result = await queryDocument(currentDoc.doc_id, userQuery);

      // Add agent logs with animation
      if (result.agent_logs && result.agent_logs.length > 0) {
        setAgentLogs(result.agent_logs);
      }

      // Add response
      setMessages(prev => [...prev, {
        type: 'assistant',
        content: result.answer,
        sources: result.sources || [],
        confidence: result.confidence,
        query_type: result.query_type,
        retrieval_strategy: result.retrieval_strategy
      }]);
    } catch (error) {
      console.error('Query error:', error);
      const errorMessage = error.response?.data?.detail || error.message || 'Failed to process query. Please try again.';
      setError(errorMessage);
      setMessages(prev => [...prev, {
        type: 'error',
        content: errorMessage
      }]);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Backend Status Banner */}
      {backendStatus === 'offline' && (
        <div className="bg-red-900/50 border-b border-red-500/50 px-6 py-3">
          <div className="container mx-auto max-w-7xl flex items-center gap-3">
            <WifiOff className="w-5 h-5 text-red-400" />
            <p className="text-sm text-red-200">
              Backend server is offline. Please start the backend server at http://localhost:8000
            </p>
          </div>
        </div>
      )}

      {backendStatus === 'online' && (
        <div className="bg-green-900/30 border-b border-green-500/30 px-6 py-2">
          <div className="container mx-auto max-w-7xl flex items-center gap-2">
            <Wifi className="w-4 h-4 text-green-400" />
            <p className="text-xs text-green-300">
              Connected to backend
            </p>
          </div>
        </div>
      )}

      <div className="container mx-auto p-6 max-w-7xl">
        {/* Header */}
        <div className="mb-8 animate-fadeIn">
          <div className="flex items-center gap-3 mb-2">
            <div className="relative">
              <Brain className="w-10 h-10 text-purple-400" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                Intelligent Document Q&A System
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                Powered by Multi-Agent RAG Architecture
              </p>
            </div>
          </div>
          <p className="text-slate-300 text-lg">
            🤖 Agentic RAG with Multi-Modal Understanding • 🔍 Advanced Retrieval • 📊 Layout-Aware Parsing
          </p>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-6 bg-red-900/30 border border-red-500/30 rounded-lg p-4 animate-fadeIn">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-200 mb-1">Error</p>
                <p className="text-sm text-red-300">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-red-400 hover:text-red-300"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel */}
          <div className="lg:col-span-1 space-y-6">
            <DocumentUpload 
              onUpload={handleUpload}
              processing={processing}
              uploadProgress={uploadProgress}
            />
            
            <DocumentInfo document={currentDoc} />
            
            <AgentActivity 
              logs={agentLogs}
              isExpanded={showAgentPanel}
              onToggle={() => setShowAgentPanel(!showAgentPanel)}
            />
          </div>

          {/* Right Panel */}
          <div className="lg:col-span-2">
            <ChatInterface 
              messages={messages}
              query={query}
              setQuery={setQuery}
              onSend={handleQuery}
              processing={processing}
              currentDoc={currentDoc}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-slate-800 text-center">
          <p className="text-sm text-slate-500">
            Built with FastAPI, LangChain, OpenAI, React, and Tailwind CSS
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;