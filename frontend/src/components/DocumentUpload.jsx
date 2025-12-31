import React, { useRef, useState } from 'react';
import { Upload, Loader2, CheckCircle, AlertCircle, FileText } from 'lucide-react';

const DocumentUpload = ({ onUpload, processing, uploadProgress }) => {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    handleFile(file);
  };

  const handleFile = (file) => {
    if (file) {
      const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
      const maxSize = 50 * 1024 * 1024; // 50MB

      if (!validTypes.includes(file.type)) {
        alert('Please upload a PDF, DOCX, or TXT file');
        return;
      }

      if (file.size > maxSize) {
        alert('File size must be less than 50MB');
        return;
      }

      setSelectedFile(file);
      onUpload(file);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Upload className="w-5 h-5 text-purple-400" />
        Document Upload
      </h2>
      
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx,.txt"
        onChange={handleFileSelect}
        className="hidden"
        disabled={processing}
      />
      
      {/* Drag and Drop Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer
          ${dragActive ? 'border-purple-500 bg-purple-500/10' : 'border-slate-600 hover:border-purple-400'}
          ${processing ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        onClick={() => !processing && fileInputRef.current?.click()}
      >
        {processing ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-12 h-12 text-purple-400 animate-spin" />
            <p className="text-slate-300">Processing document...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <Upload className="w-12 h-12 text-purple-400" />
            <div>
              <p className="text-slate-300 font-medium">
                Drop your document here or click to browse
              </p>
              <p className="text-sm text-slate-500 mt-1">
                PDF, DOCX, or TXT (max 50MB)
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Selected File Info */}
      {selectedFile && !processing && (
        <div className="mt-4 p-3 bg-slate-900/50 rounded-lg border border-slate-700">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-blue-400 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{selectedFile.name}</p>
              <p className="text-xs text-slate-400">{formatFileSize(selectedFile.size)}</p>
            </div>
            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
          </div>
        </div>
      )}

      {/* Upload Progress */}
      {uploadProgress > 0 && uploadProgress < 100 && (
        <div className="mt-4 animate-fadeIn">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-300">Processing...</span>
            <span className="text-purple-400 font-medium">{uploadProgress}%</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2.5 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2.5 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Upload Complete */}
      {uploadProgress === 100 && (
        <div className="mt-4 p-3 bg-green-900/30 border border-green-500/30 rounded-lg animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <p className="text-sm text-green-200">Document uploaded successfully!</p>
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="mt-4 p-3 bg-blue-900/20 border border-blue-500/20 rounded-lg">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-blue-200">
            <p className="font-medium mb-1">Supported features:</p>
            <ul className="list-disc list-inside space-y-0.5 text-blue-300/80">
              <li>Multi-column layouts</li>
              <li>Tables and charts</li>
              <li>Images and diagrams</li>
              <li>Complex document structures</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentUpload;