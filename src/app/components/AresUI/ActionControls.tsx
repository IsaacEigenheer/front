import { Zap } from "lucide-react";
import React from "react";

interface ActionControlsProps {
  clients: string[];
  selectedClient: string;
  isProcessing: boolean;
  onClientChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onStartProcess: () => void;
}

const ActionControls: React.FC<ActionControlsProps> = ({
  clients,
  selectedClient,
  isProcessing,
  onClientChange,
  onStartProcess,
}) => {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Client Selection */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 shadow-2xl">
        <h3 className="text-xl font-semibold mb-4 text-slate-200">
          Seleção de Cliente
        </h3>
        <select
          value={selectedClient}
          onChange={onClientChange}
          className="w-full bg-slate-900 border border-slate-600 text-white rounded-xl px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        >
          <option value="Select a Customer" disabled>
            Selecione um Cliente
          </option>
          {clients.map((client) => (
            <option key={client} value={client}>
              {client}
            </option>
          ))}
        </select>
      </div>

      {/* Action Button */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 shadow-2xl flex items-center">
        <button
          onClick={onStartProcess}
          disabled={isProcessing || selectedClient === "Select a Customer"}
          className={`w-full h-16 rounded-xl font-bold text-xl transition-all duration-300 flex items-center justify-center gap-3 ${
            isProcessing || selectedClient === "Select a Customer"
              ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
          }`}
        >
          {isProcessing ? (
            <>
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Processando...
            </>
          ) : (
            <>
              <Zap className="w-6 h-6" />
              Iniciar Conversão
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ActionControls;