import { Upload, FileText, CheckCircle } from "lucide-react";
import React from "react";

interface FileUploadProps {
  mode: string;
  file1: File | null;
  file2: File | null;
  page1: number;
  page2: number;
  onFile1Change: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFile2Change: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPage1Change: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPage2Change: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({
  mode,
  file1,
  file2,
  page1,
  page2,
  onFile1Change,
  onFile2Change,
  onPage1Change,
  onPage2Change,
}) => {
  return (
    <div className="mb-8">
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 shadow-2xl">
        <h3 className="text-2xl font-semibold mb-6 flex items-center gap-3">
          <Upload className="w-7 h-7 text-blue-400" />
          Upload de Arquivos
        </h3>
        <div className="space-y-6">
          {/* First File */}
          <div className="group">
            <div className="bg-slate-900/50 border-2 border-dashed border-slate-600 rounded-xl p-6 hover:border-blue-500 transition-all duration-300">
              <div className="flex items-center justify-between gap-6">
                <div className="flex items-center gap-4 flex-1">
                  <FileText className="w-8 h-8 text-slate-400 group-hover:text-blue-400 transition-colors" />
                  {mode === "revision" && (
                    <text>Revisão 1</text>
                  )}
                  <div className="flex-1">
                    <input
                      type="file"
                      onChange={onFile1Change}
                      className="w-full text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer"
                    />
                    {file1 && (
                      <p className="text-sm text-green-400 mt-1 flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        {file1.name}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-slate-300 font-medium">Página:</label>
                  <input
                    type="number"
                    min={1}
                    value={page1}
                    onChange={onPage1Change}
                    className="w-20 bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Second File (only in revision mode) */}
          {mode === "revision" && (
            <div className="group animate-in slide-in-from-top duration-300">
              <div className="bg-slate-900/50 border-2 border-dashed border-slate-600 rounded-xl p-6 hover:border-purple-500 transition-all duration-300">
                <div className="flex items-center justify-between gap-6">
                  <div className="flex items-center gap-4 flex-1">
                    <FileText className="w-8 h-8 text-slate-400 group-hover:text-purple-400 transition-colors" />
                    Revisão 2
                    <div className="flex-1 justify-center">
                      <input
                        type="file"
                        onChange={onFile2Change}
                        className="w-full text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700 file:cursor-pointer"
                      />
                      {file2 && (
                        <p className="text-sm text-green-400 mt-1 flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" />
                          {file2.name}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-slate-300 font-medium">Página:</label>
                    <input
                      type="number"
                      min={1}
                      value={page2}
                      onChange={onPage2Change}
                      className="w-20 bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUpload;