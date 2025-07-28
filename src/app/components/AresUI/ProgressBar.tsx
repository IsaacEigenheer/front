import React from "react";

interface ProgressBarProps {
  progress: number;
  isProcessing: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, isProcessing }) => {
  return (
    <div className="mb-8">
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 shadow-2xl">
        <h3 className="text-xl font-semibold mb-4 text-slate-200">
          Progresso da Conversão
        </h3>
        <div className="relative">
          <div className="w-full h-4 bg-slate-900 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              {isProcessing && <div className="absolute inset-0 bg-white/20 animate-pulse"></div>}
            </div>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-slate-400">
              {isProcessing ? 'Processando...' : 'Pronto para iniciar'}
            </span>
            <span className="text-sm font-semibold text-white">
              {Math.round(progress)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;