import React from 'react';
import { FileText, Table, FileImage, Calendar, Hash, FileBox } from 'lucide-react';

const DocumentInfo = ({ document }) => {
  if (!document) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-purple-400" />
          Document Info
        </h2>
        <div className="text-center py-8">
          <FileBox className="w-12 h-12 mx-auto text-slate-600 mb-3" />
          <p className="text-slate-400 text-sm">No document uploaded yet</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20 animate-fadeIn">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <FileText className="w-5 h-5 text-purple-400" />
        Current Document
      </h2>
      
      <div className="space-y-4">
        {/* Document Name */}
        <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-700">
          <p className="text-xs text-slate-400 mb-1">Document Name</p>
          <p className="font-medium text-sm truncate" title={document.filename}>
            {document.filename}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-700">
            <div className="flex items-center gap-2 mb-1">
              <FileText className="w-4 h-4 text-blue-400" />
              <p className="text-xs text-slate-400">Pages</p>
            </div>
            <p className="text-xl font-bold text-blue-400">{document.pages}</p>
          </div>

          <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-700">
            <div className="flex items-center gap-2 mb-1">
              <Hash className="w-4 h-4 text-purple-400" />
              <p className="text-xs text-slate-400">Chunks</p>
            </div>
            <p className="text-xl font-bold text-purple-400">{document.chunks}</p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Table className="w-4 h-4 text-emerald-400" />
                <span className="text-sm">Tables</span>
              </div>
              <span className="font-bold text-emerald-400">{document.tables}</span>
            </div>
          </div>

          <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileImage className="w-4 h-4 text-amber-400" />
                <span className="text-sm">Images</span>
              </div>
              <span className="font-bold text-amber-400">{document.images}</span>
            </div>
          </div>
        </div>

        {/* Upload Time */}
        <div className="pt-3 border-t border-slate-700">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Calendar className="w-3.5 h-3.5" />
            <span>Uploaded: {formatDate(document.upload_time)}</span>
          </div>
        </div>

        {/* Document ID */}
        <div className="p-2 bg-slate-900/30 rounded text-xs text-slate-500 font-mono truncate">
          ID: {document.doc_id}
        </div>
      </div>
    </div>
  );
};

export default DocumentInfo;