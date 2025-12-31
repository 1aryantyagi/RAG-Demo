import React from 'react';
import { Zap, Loader2, CheckCircle, ChevronUp, ChevronDown, Activity } from 'lucide-react';

const AgentActivity = ({ logs, isExpanded, onToggle }) => {
  const getAgentColor = (agentName) => {
    const colors = {
      'Document Parser': 'text-blue-400',
      'Layout Analyzer': 'text-green-400',
      'Embedding Generator': 'text-purple-400',
      'Query Analyzer': 'text-yellow-400',
      'Retrieval Strategist': 'text-pink-400',
      'Retrieval Engine': 'text-cyan-400',
      'Response Synthesizer': 'text-orange-400',
    };
    return colors[agentName] || 'text-slate-400';
  };

  const getAgentIcon = (status) => {
    if (status === 'active') {
      return <Loader2 className="w-4 h-4 text-blue-400 animate-spin flex-shrink-0" />;
    }
    return <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />;
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20">
      <div 
        className="flex items-center justify-between cursor-pointer group"
        onClick={onToggle}
      >
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-400" />
          Agent Activity
          {logs.length > 0 && (
            <span className="px-2 py-0.5 text-xs bg-purple-500/20 text-purple-300 rounded-full border border-purple-500/30">
              {logs.length}
            </span>
          )}
        </h2>
        <div className="flex items-center gap-2">
          {logs.some(log => log.status === 'active') && (
            <Activity className="w-4 h-4 text-blue-400 animate-pulse" />
          )}
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 group-hover:text-purple-400 transition-colors" />
          ) : (
            <ChevronDown className="w-5 h-5 group-hover:text-purple-400 transition-colors" />
          )}
        </div>
      </div>
      
      {isExpanded && (
        <div className="mt-4 space-y-3 max-h-[500px] overflow-y-auto pr-2 animate-slideUp">
          {logs.length === 0 ? (
            <div className="text-center py-8">
              <Activity className="w-12 h-12 mx-auto text-slate-600 mb-3" />
              <p className="text-slate-400 text-sm">No agent activity yet</p>
              <p className="text-slate-500 text-xs mt-1">Upload a document and ask questions to see agents in action</p>
            </div>
          ) : (
            logs.map((log, idx) => (
              <div 
                key={idx} 
                className="bg-slate-900/50 rounded-lg p-3 border border-slate-700 hover:border-slate-600 transition-all animate-fadeIn"
              >
                <div className="flex items-start gap-3">
                  {getAgentIcon(log.status)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p className={`font-semibold text-sm ${getAgentColor(log.agent)}`}>
                        {log.agent}
                      </p>
                      <span className="text-xs text-slate-500 whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {log.action}
                    </p>
                    {log.details && (
                      <div className="mt-2 p-2 bg-slate-800/50 rounded border border-slate-700/50">
                        <p className="text-xs text-slate-400 leading-relaxed">
                          {log.details}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AgentActivity;