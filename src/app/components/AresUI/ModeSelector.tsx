import { Settings } from "lucide-react";
import React from "react";

interface ModeSelectorProps {
  mode: string;
  onModeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const ModeSelector: React.FC<ModeSelectorProps> = ({ mode, onModeChange }) => {
  return (
    <div className="mb-8">
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center gap-4">
          <Settings className="w-6 h-6 text-blue-400" />
          <label className="text-xl font-semibold text-slate-200">Modo de Operação:</label>
          <select
            value={mode}
            onChange={onModeChange}
            className="bg-slate-900 border border-slate-600 text-white rounded-xl px-4 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="extraction">Extração</option>
            <option value="revision">Comparar Revisões</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ModeSelector;