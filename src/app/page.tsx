"use client";

import { url } from "@/services/api";
import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

const ARESComponent: React.FC = () => {
  const [selectedClient, setSelectedClient] =
    useState<string>("Select a Customer");
  const [progress, setProgress] = useState<number>(0);
  const [file, setFile] = useState<File | null>(null);
  const [buttonStyle, setButtonStyle] = useState<string>("flex w-auto h-full cursor-pointer items-center justify-center font-semibold text-3xl rounded-sm align-middle px-4 py-1 text-black bg-gray-300 hover:bg-gray-200 transform transition-colors duration-200 ease-in-out")
  const socket = io(`http://${url}`); 
  const [pages, setPages] = useState<number>(1)
  const [id, setId] = useState<string>()

  const handlePageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPages(Number(e.target.value));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
  };

  const selectClient = (client: string) => {
    setSelectedClient(client);
    toggleDropdown();
  };

  const toggleDropdown = () => {
    const dropdown = document.getElementById("myDropdown");
    if (dropdown) {
      dropdown.classList.toggle("show");
    }
  };

  const startProcess = () => {
    if (!file) {
      alert("Por favor, selecione um arquivo.");
      return;
    }
    setButtonStyle("flex w-auto h-full cursor-pointer items-center justify-center font-semibold text-3xl rounded-sm align-middle px-4 py-1 text-black bg-gray-500 transform transition-colors duration-200 ease-in-out")
    const formData = new FormData();
    formData.append("file", file);

    const queryParams = {
      type: selectedClient,
      nPages: pages.toString(),
      id: crypto.randomUUID()
    }

    setId(queryParams.id)

    fetch(`http://${url}/upload?${queryParams}`, {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.blob(); // Converte a resposta em um Blob
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob); // Cria uma URL para o blob
        const a = document.createElement("a"); // Cria um elemento <a>
        a.style.display = "none";
        a.href = url;
        a.download = "planilha_final.xlsx"; // Nome do arquivo para download
        document.body.appendChild(a);
        a.click(); // Simula o clique no link
        window.URL.revokeObjectURL(url); // Limpa a URL criada
        setProgress(0);
      })
      .finally(() => setButtonStyle("flex w-auto h-full cursor-pointer items-center justify-center font-semibold text-3xl rounded-sm align-middle px-4 py-1 text-black bg-gray-300 hover:bg-gray-200 transform transition-colors duration-200 ease-in-out"))
      .catch((error) => console.error("Error downloading file:", error));
     
  };


  useEffect(() => {
    socket.on("progress", (data: {progress: number, id: string}) => {
      if(id == data.id) {
      setProgress(data.progress); // Atualiza o progresso recebido do WebSocket
      }
    });

    return () => {
      socket.off("progress"); // Limpa o listener quando o componente é desmontado
    };
  }, [socket]);

  return (
    <div className="flex flex-col w-full h-screen bg-[#67A4FF]">
      <div className="flex flex-col w-full h-auto items-center gap-3">
        <h1 className="text-7xl text-white font-semibold">Brascabos</h1>
        <h2 className="text-5xl text-white">ARES</h2>
      </div>
      <div className="flex flex-col w-full h-full items-center mt-7 gap-5">
        <div className="flex w-[80%] h-[60%] bg-gray-300 p-2 rounded-md">
          <div className="flex w-full h-full bg-white rounded-md items-center justify-center">
            <input
              type="file"
              className="block w-auto h-[40px] text-sm text-gray-500 
                 file:mr-4 file:py-2 file:px-4 
                 file:rounded-md file:border-0
                 file:text-sm file:font-semibold
                 file:bg-blue-50 file:text-blue-700
                 hover:file:bg-blue-100"
              onChange={handleFileChange}
            />
          </div>
        </div>

        <div className="flex flex-col w-[80%] h-auto items-center gap-3">
          <h3 className="flex text-2xl font-semibold">Barra de conclusão</h3>
          <div className="flex w-full h-[40px] bg-gray-300 rounded-sm relative">
            <div
              className="bg-blue-600 h-full rounded-sm"
              style={{ width: `${progress * 12.5}%` }} // Define a largura da barra com base no progresso
            ></div>
            <span className="absolute inset-0 flex items-center justify-center text-white font-semibold">
              {progress * 12.5}%
            </span>
          </div>
          <div className="flex w-full h-auto items-center justify-between mt-3">
            <div className="flex flex-col items-start w-[300px] h-auto bg-gray-300 rounded-md p-3">
              <select
                onChange={(e) => selectClient(e.target.value)}
                className="w-full h-auto bg-gray-300 border-none text-2xl px-3 font-semibold text-black rounded-md"
                value={selectedClient}
              >
                <option value="Select a Customer" disabled>Selecione um Cliente</option>
                <option value="HPE">HPE</option>
                <option value="Jacto">Jacto</option>
                <option value="Caterpillar">Caterpillar</option>
                <option value="CNH">CNH</option>
                <option value="AGCO">AGCO</option>
                <option value="Komatsu">Komatsu</option>
                <option value="John Deere">John Deere</option>
                <option value="Whirlpool">Whirlpool</option>
                <option value="Electrolux">Electrolux</option>
                <option value="JCB">JCB</option>
                <option value="Embraco">Embraco</option>
              </select>

              <div className="flex items-center mt-3">
              <label className="text-lg mr-2">Selecione a página:</label>
              <input
                type="number"
                min={1}
                value={pages}
                onChange={handlePageChange}
                className="w-16 h-10 border border-gray-400 rounded-md text-center"
              />
              </div>

            </div>

            <button
              onClick={() => startProcess()}
              className={buttonStyle}
            >
              Iniciar Conversão
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ARESComponent;
