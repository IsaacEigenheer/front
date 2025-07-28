"use client";

import React, { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { url } from "@/services/api";

import Header from "./Header";
import ModeSelector from "./ModeSelector";
import FileUpload from "./FileUpload";
import ProgressBar from "./ProgressBar";
import ActionControls from "./ActionControls";

const ARESComponent: React.FC = () => {
  const [selectedClient, setSelectedClient] = useState<string>("Select a Customer");
  const [mode, setMode] = useState<string>("extraction");
  const [progress, setProgress] = useState<number>(0);
  const [file1, setFile1] = useState<File | null>(null);
  const [file2, setFile2] = useState<File | null>(null);
  const [page1, setPage1] = useState<number>(1);
  const [page2, setPage2] = useState<number>(1);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  
  const id = useRef<string>();
  const socket = useRef<Socket>();

  useEffect(() => {
    // Inicializa a conexão com o socket
    socket.current = io(`http://${url}`);

    // Listener de progresso
    socket.current.on("progress", (data: { progress: number; id: string }) => {
      // Atualiza o progresso apenas se o ID da mensagem do socket corresponder ao ID do processo atual
      if (id.current === data.id) {
        setProgress(data.progress);
      }
    });

    // Função de limpeza para desconectar o socket quando o componente for desmontado
    return () => {
      socket.current?.disconnect();
    };
  }, []);


  const handleModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMode(e.target.value);
  };

  const handleFile1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile1(e.target.files?.[0] || null);
  };

  const handleFile2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile2(e.target.files?.[0] || null);
  };

  const handlePage1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPage1(Number(e.target.value));
  };

  const handlePage2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPage2(Number(e.target.value));
  };
  
  const handleClientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedClient(e.target.value);
  };
  
  function generateUUID() {
    return (Date.now() + Math.random()).toString(36);
  }

  const startProcess = () => {
    if (!file1 || (mode === "revision" && !file2)) {
      alert("Por favor, selecione os arquivos necessários.");
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    
    const formData = new FormData();
    formData.append("file1", file1);
    if (mode === "revision") {
      formData.append("file2", file2!);
    }

    id.current = generateUUID();

    const params: Record<string, string> = {
      type: selectedClient,
      id: id.current || "",
    };
    
    if (mode === "extraction") {
      params.page = page1.toString();
      params.revision = "false";
    } else {
      params.page1 = page1.toString();
      params.page2 = page2.toString();
      params.revision = "true";
    }

    const queryParams = new URLSearchParams(params);

    // Lógica de API real com fetch
    fetch(`http://${url}/upload?${queryParams}`, {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`A resposta da rede não foi 'ok'. Status: ${response.statusText}`);
        }
        return response.blob();
      })
      .then((blob) => {
        // Simula o download do arquivo retornado pela API
        const urlBlob = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = urlBlob;
        a.download = "planilha_final.xlsx";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(urlBlob);
        setProgress(100); // Marca como 100% ao concluir o download
      })
      .catch((error) => {
        console.error("Erro ao processar ou baixar o arquivo:", error);
        alert("Ocorreu um erro durante o processo. Verifique o console para mais detalhes.");
      })
      .finally(() => {
        // Independentemente de sucesso ou falha, finaliza o estado de processamento
        setIsProcessing(false);
      });
  };

  const clients = [
    "HPE", "Jacto", "Caterpillar", "CNH", "AGCO", "Komatsu", 
    "John Deere", "Whirlpool", "Electrolux", "JCB", "Embraco"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white">
      <Header />
      <main className="max-w-6xl mx-auto px-8 py-16">
        <ModeSelector mode={mode} onModeChange={handleModeChange} />
        <FileUpload
          mode={mode}
          file1={file1}
          file2={file2}
          page1={page1}
          page2={page2}
          onFile1Change={handleFile1Change}
          onFile2Change={handleFile2Change}
          onPage1Change={handlePage1Change}
          onPage2Change={handlePage2Change}
        />
        <ProgressBar progress={progress} isProcessing={isProcessing} />
        <ActionControls
          clients={clients}
          selectedClient={selectedClient}
          isProcessing={isProcessing}
          onClientChange={handleClientChange}
          onStartProcess={startProcess}
        />
      </main>
    </div>
  );
};

export default ARESComponent;