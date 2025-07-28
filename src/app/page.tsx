// "use client" habilita a renderização do componente no lado do cliente (Next.js 13+). Sem essa diretiva, o componente seria tratado como estático.
"use client";

// Importa a URL base da API definida em services/api.ts
import { url } from "@/services/api";
// Importa hooks e funções do React
import React, { useState, useEffect, useRef } from "react";
// Importa o cliente do Socket.IO para comunicação em tempo real
import { io } from "socket.io-client";

// Define um componente funcional React chamado ARESComponent
const ARESComponent: React.FC = () => {
  // Estados locais:
  // selectedClient: armazena o cliente selecionado no dropdown (valor inicial: string padrão)
  const [selectedClient, setSelectedClient] =
    useState<string>("Select a Customer");
  // progress: porcentagem de progresso recebida via WebSocket (inicialmente 0)
  const [progress, setProgress] = useState<number>(0);
  // file: armazena o arquivo selecionado pelo usuário (inicialmente null)
  const [file, setFile] = useState<File | null>(null);
  // buttonStyle: classe CSS dinâmica para estilizar o botão de conversão
  const [buttonStyle, setButtonStyle] = useState<string>(
    "flex w-auto h-full cursor-pointer items-center justify-center font-semibold text-3xl rounded-sm align-middle px-4 py-1 text-black bg-gray-300 hover:bg-gray-200 transform transition-colors duration-200 ease-in-out"
  )
  // Cria conexão de WebSocket com o servidor, usando URL especificada
  const socket = io(`http://${url}`); 
  // pages: página selecionada para processar (inicialmente 1)
  const [pages, setPages] = useState<number>(1)
  // id: referência que armazenará um UUID gerado para cada processo
  const id = useRef<string>();

  // Atualiza o estado de pages quando o usuário seleciona a página a processar
  const handlePageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPages(Number(e.target.value));
  };

  // Atualiza o estado de file quando o usuário escolhe um arquivo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
  };

  // Função para selecionar o cliente no dropdown e fechá-lo em seguida
  const selectClient = (client: string) => {
    setSelectedClient(client);
    toggleDropdown();
  };

  // Gera um UUID simples baseado em timestamp + número aleatório
  function generateUUID() {
    return (Date.now() + Math.random()).toString(36);
  }

  // Alterna (show/hide) a exibição do dropdown no DOM
  const toggleDropdown = () => {
    const dropdown = document.getElementById("myDropdown");
    if (dropdown) {
      dropdown.classList.toggle("show");
    }
  };

  // Função que dispara o processo de upload e conversion
  const startProcess = () => {
    // Validação: se nenhum arquivo selecionado, exibe alerta
    if (!file) {
      alert("Por favor, selecione um arquivo.");
      return;
    }
    // Ao iniciar, muda estilo do botão para estado 'processando'
    setButtonStyle("flex w-auto h-full cursor-pointer items-center justify-center font-semibold text-3xl rounded-sm align-middle px-4 py-1 text-black bg-gray-500 transform transition-colors duration-200 ease-in-out")

    // Prepara FormData para envio via fetch
    const formData = new FormData();
    formData.append("file", file);

    // Gera e armazena um UUID único para identificar o processo em progresso
    id.current = generateUUID();

    // Prepara query string com tipo de cliente, número de páginas e id
    const queryParams = new URLSearchParams({
      type: selectedClient,
      nPages: pages.toString(),
      id: id.current || "",
    })
    
    // Executa requisição POST para endpoint /upload
    fetch(`http://${url}/upload?${queryParams}`, {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        // Checa se a resposta HTTP foi bem-sucedida
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        // Converte resposta em Blob para download
        return response.blob();
      })
      .then((blob) => {
        // Cria URL temporária para o blob e dispara download
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = "planilha_final.xlsx";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        setProgress(0); // reseta barra de progresso
      })
      .finally(() => 
        // Após término (sucesso ou falha), restaura estilo original do botão
        setButtonStyle("flex w-auto h-full cursor-pointer items-center justify-center font-semibold text-3xl rounded-sm align-middle px-4 py-1 text-black bg-gray-300 hover:bg-gray-200 transform transition-colors duration-200 ease-in-out")
      )
      .catch((error) => console.error("Error downloading file:", error));
  };

  // useEffect para configurar listener de progresso via WebSocket
  useEffect(() => {
    // Se não houver id definido, não configura listener
    if (!id) return;
    // Aguarda evento 'progress' do servidor
    socket.on("progress", (data: {progress: number, id: string}) => {
      // Só atualiza se o id recebido coincidir com o id deste processo
      if(id.current == data.id) {
        setProgress(data.progress); // Atualiza estado de progresso
      }
    });

    // Cleanup: remove listener ao desmontar componente
    return () => {
      socket.off("progress");
    };
  }, [socket]);

  // Renderização do componente
  return (
    <div className="flex flex-col w-full h-screen bg-[#67A4FF]">
      {/* Cabeçalho com título e subtítulo */}
      <div className="flex flex-col w-full h-auto items-center gap-3">
        <h1 className="text-7xl text-white font-semibold">Brascabos</h1>
        <h2 className="text-5xl text-white">ARES</h2>
      </div>
      {/* Área principal */}
      <div className="flex flex-col w-full h-full items-center mt-7 gap-5">
        {/* Seletor de arquivo */}
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
              onChange={handleFileChange} // chama handler ao mudar arquivo
            />
          </div>
        </div>

        {/* Seção de progresso e controles */}
        <div className="flex flex-col w-[80%] h-auto items-center gap-3">
          <h3 className="flex text-2xl font-semibold">Barra de conclusão</h3>
          {/* Barra de progresso dinâmica */}
          <div className="flex w-full h-[40px] bg-gray-300 rounded-sm relative">
            <div
              className="bg-blue-600 h-full rounded-sm"
              style={{ width: `${progress * 12.5}%` }} // 12.5% por unidade de progresso
            ></div>
            <span className="absolute inset-0 flex items-center justify-center text-white font-semibold">
              {progress * 12.5}%
            </span>
          </div>
          {/* Controles de cliente, página e botão */}
          <div className="flex w-full h-auto items-center justify-between mt-3">
            <div className="flex flex-col items-start w-[300px] h-auto bg-gray-300 rounded-md p-3">
              {/* Dropdown de clientes */}
              <select
                onChange={(e) => selectClient(e.target.value)}
                className="w-full h-auto bg-gray-300 border-none text-2xl px-3 font-semibold text-black rounded-md"
                value={selectedClient} // valor controlado pelo estado
              >
                <option value="Select a Customer" disabled>Selecione um Cliente</option>
                {/* Opções de cliente fixas */}
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

              {/* Input de número de páginas */}
              <div className="flex items-center mt-3">
              <label className="text-lg mr-2">Selecione a página:</label>
              <input
                type="number"
                min={1}
                value={pages}
                onChange={handlePageChange} // chama handler de mudança
                className="w-16 h-10 border border-gray-400 rounded-md text-center"
              />
              </div>

            </div>

            {/* Botão para iniciar o processo de conversão */}
            <button
              onClick={() => startProcess()}
              className={buttonStyle} // estilo dinâmico via estado
            >
              Iniciar Conversão
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Exporta o componente para uso em outras partes da aplicação
export default ARESComponent;
