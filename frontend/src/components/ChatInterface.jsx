import React, { useRef, useEffect, useState } from 'react';
import { 
  MessageSquare, 
  Search, 
  Loader2, 
  Database, 
  CheckCircle, 
  AlertCircle,
  Eye,
  Send,
  Sparkles
} from 'lucide-react';

const ChatInterface = ({ 
  messages, 
  query, 
  setQuery, 
  onSend, 
  processing, 
  currentDoc 
}) => {
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!processing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [processing]);

  const handleSend = () => {
    if (query.trim() && !processing && currentDoc) {
      onSend();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const exampleQuestions = [
    "What is the main topic of this document?",
    "Summarize the key findings",
    "What tables are mentioned?",
    "Explain the methodology used"
  ];

  return (
    <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl border border-purple-500/20 flex flex-col h-[calc(100vh-180px)]">
      {/* Chat Header */}
      <div className="p-6 border-b border-slate-700 bg-gradient-to-r from-slate-800/80 to-slate-900/80">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-purple-400" />
              Interactive Q&A
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              {currentDoc ? `Ask questions about ${currentDoc.filename}` : 'Upload a document to get started'}
            </p>
          </div>
          {messages.length > 0 && (
            <div className="text-xs text-slate-400">
              {messages.filter(m => m.type === 'assistant').length} answers
            </div>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center max-w-md">
              <Database className="w-16 h-16 mx-auto mb-4 text-slate-600" />
              <h3 className="text-xl font-semibold mb-2">No conversations yet</h3>
              <p className="text-slate-400 mb-6">
                Upload a document to start asking questions
              </p>
              
              {currentDoc && (
                <div className="space-y-3">
                  <p className="text-sm text-slate-500 mb-3">Try asking:</p>
                  <div className="grid gap-2">
                    {exampleQuestions.map((question, idx) => (
                      <button
                        key={idx}
                        onClick={() => setQuery(question)}
                        className="text-left px-4 py-2 bg-slate-900/50 hover:bg-slate-900 border border-slate-700 hover:border-purple-500/50 rounded-lg text-sm text-slate-300 transition-all"
                      >
                        <Sparkles className="w-3 h-3 inline mr-2 text-purple-400" />
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg, idx) => (
              <MessageBubble key={idx} message={msg} />
            ))}
            {processing && (
              <div className="flex justify-start">
                <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 max-w-2xl">
                  <div className="flex items-center gap-3">
                    <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
                    <span className="text-sm text-slate-300">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-6 border-t border-slate-700 bg-slate-900/50">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                currentDoc 
                  ? "Ask a question about your document..." 
                  : "Upload a document first..."
              }
              disabled={!currentDoc || processing}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
              <Search className="w-5 h-5" />
            </div>
          </div>
          <button
            onClick={handleSend}
            disabled={!currentDoc || !query.trim() || processing}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-medium hover:from-purple-500 hover:to-pink-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-purple-500/25"
          >
            {processing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="hidden sm:inline">Processing</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span className="hidden sm:inline">Send</span>
              </>
            )}
          </button>
        </div>
        
        {currentDoc && (
          <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Ready to answer questions about {currentDoc.filename}</span>
          </div>
        )}
      </div>
    </div>
  );
};

const MessageBubble = ({ message }) => {
  if (message.type === 'system') {
    return (
      <div className="flex justify-start animate-fadeIn">
        <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4 max-w-2xl">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-200 leading-relaxed">{message.content}</p>
          </div>
        </div>
      </div>
    );
  }

  if (message.type === 'error') {
    return (
      <div className="flex justify-start animate-fadeIn">
        <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-4 max-w-2xl">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-200 mb-1">Error</p>
              <p className="text-sm text-red-300">{message.content}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (message.type === 'user') {
    return (
      <div className="flex justify-end animate-fadeIn">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-4 max-w-2xl shadow-lg">
          <p className="text-sm leading-relaxed">{message.content}</p>
        </div>
      </div>
    );
  }

  // Assistant message
  return (
    <div className="flex justify-start animate-fadeIn">
      <div className="bg-slate-900/70 border border-slate-700 rounded-lg p-4 max-w-3xl shadow-xl">
        <p className="text-sm mb-4 whitespace-pre-wrap leading-relaxed text-slate-200">
          {message.content}
        </p>
        
        {/* Metadata Section */}
        <div className="space-y-3">
          {/* Confidence Score */}
          {message.confidence && (
            <div className="pb-3 border-b border-slate-700">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-slate-400 font-medium">Confidence Score</span>
                <span className={`font-bold ${
                  message.confidence >= 0.9 ? 'text-green-400' :
                  message.confidence >= 0.7 ? 'text-yellow-400' :
                  'text-orange-400'
                }`}>
                  {(message.confidence * 100).toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    message.confidence >= 0.9 ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                    message.confidence >= 0.7 ? 'bg-gradient-to-r from-yellow-500 to-amber-500' :
                    'bg-gradient-to-r from-orange-500 to-red-500'
                  }`}
                  style={{ width: `${message.confidence * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Query Type and Strategy */}
          {(message.query_type || message.retrieval_strategy) && (
            <div className="pb-3 border-b border-slate-700">
              <div className="flex flex-wrap gap-2">
                {message.query_type && (
                  <span className="text-xs px-3 py-1.5 bg-purple-900/40 border border-purple-500/30 rounded-full text-purple-300 font-medium">
                    📋 {message.query_type}
                  </span>
                )}
                {message.retrieval_strategy && (
                  <span className="text-xs px-3 py-1.5 bg-blue-900/40 border border-blue-500/30 rounded-full text-blue-300 font-medium">
                    🎯 {message.retrieval_strategy}
                  </span>
                )}
              </div>
            </div>
          )}
          
          {/* Sources */}
          {message.sources && message.sources.length > 0 && (
            <div>
              <p className="text-xs text-slate-400 mb-3 flex items-center gap-2 font-medium">
                <Eye className="w-4 h-4" />
                Sources & Citations ({message.sources.length})
              </p>
              <div className="space-y-2">
                {message.sources.map((source, sidx) => (
                  <SourceCard key={sidx} source={source} index={sidx} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const SourceCard = ({ source, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const getRelevanceColor = (relevance) => {
    if (relevance >= 0.9) return 'text-green-400 bg-green-500/10';
    if (relevance >= 0.8) return 'text-emerald-400 bg-emerald-500/10';
    if (relevance >= 0.7) return 'text-yellow-400 bg-yellow-500/10';
    return 'text-orange-400 bg-orange-500/10';
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'table': return '📊';
      case 'image': return '🖼️';
      default: return '📄';
    }
  };

  return (
    <div className="bg-slate-800/60 rounded-lg p-3 border border-slate-700/50 hover:border-slate-600 transition-all">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-lg">{getTypeIcon(source.type)}</span>
          <div className="flex-1 min-w-0">
            <span className="font-medium text-sm text-purple-300">
              Page {source.page}
            </span>
            <span className="text-xs text-slate-500 ml-2">• {source.type}</span>
          </div>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap ${getRelevanceColor(source.relevance)}`}>
          {(source.relevance * 100).toFixed(0)}%
        </span>
      </div>
      
      <p className={`text-xs text-slate-300 leading-relaxed ${!isExpanded && source.content.length > 150 ? 'line-clamp-2' : ''}`}>
        {source.content}
      </p>
      
      {source.content.length > 150 && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-purple-400 hover:text-purple-300 mt-2 font-medium"
        >
          {isExpanded ? 'Show less' : 'Show more'}
        </button>
      )}
    </div>
  );
};

export default ChatInterface;