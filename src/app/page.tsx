"use client";

import React, { useState } from "react";
import "./style.css";

const ARESComponent: React.FC = () => {
  const [selectedClient, setSelectedClient] =
    useState<string>("Select a Customer");
  const [pageNumber, setPageNumber] = useState<number | string>("");
  const [progress, setProgress] = useState<number>(0);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
  };

  const selectClient = (client: string) => {
    setSelectedClient(client);
    toggleDropdown(); // Fecha o dropdown após a seleção
  };

  const handlePageNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPageNumber(value ? parseInt(value) : "");
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

    // Configura o FormData para enviar o arquivo
    const formData = new FormData();
    formData.append("file", file); // 'file' é o campo esperado pelo backend

    fetch("http://localhost:7001/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Sucesso:", data);
        // Você pode atualizar o progresso ou exibir uma mensagem de sucesso
      })
      .catch((error) => {
        console.error("Erro ao enviar arquivo:", error);
      });

    // Simula o progresso da barra
    let progressValue = 0;
    const interval = setInterval(() => {
      progressValue += 10;
      setProgress(progressValue);
      if (progressValue >= 100) {
        clearInterval(interval);
      }
    }, 500);
  };

  const startProcess2 = () => {
    fetch("http://localhost:7001/upload/start-python", {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Sucesso:", data);
      })
      .catch((error) => {
        console.error("Erro ao enviar arquivo:", error);
      });
  };

  const downloadExcel = () => {
    const url = "http://localhost:7001/upload/download-excel";
  
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.blob(); // Converte a resposta em um Blob
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob); // Cria uma URL para o blob
        const a = document.createElement('a'); // Cria um elemento <a>
        a.style.display = 'none';
        a.href = url;
        a.download = 'planilha_final.xlsx'; // Nome do arquivo para download
        document.body.appendChild(a);
        a.click(); // Simula o clique no link
        window.URL.revokeObjectURL(url); // Limpa a URL criada
      })
      .catch((error) => console.error("Error downloading file:", error));
  };
  
  

  return (
    <div className="main-container">
      <div className="header">
        <h1 className="maintittle">ARES</h1>
        <div className="stroke"></div>
      </div>

      <div className="drawingcontainer">
        <h3 className="h3">Drawing View</h3>
        <div className="drawingView" id="filePreview">
          <button id="folderbutton">
            <img className="icon" src="./src/folder.ico" alt="folder icon" />
          </button>
          <input type="file" onChange={handleFileChange} />
        </div>
      </div>

      <div className="bottomcontainer">
        <div className="settings-container">
          <h3 className="h3">Settings</h3>
          <div className="settings-1">
            <div className="settings-2">
              <div className="dropdown">
                <button
                  id="dropdownButton"
                  onClick={toggleDropdown}
                  className="dropbtn"
                >
                  {selectedClient}
                </button>
                <div id="myDropdown" className="dropdown-content">
                  <a onClick={() => selectClient("HPE")}>HPE</a>
                  <a onClick={() => selectClient("Jacto")}>Jacto</a>
                  <a onClick={() => selectClient("Caterpillar")}>Caterpillar</a>
                  <a onClick={() => selectClient("CNH")}>CNH</a>
                  <a onClick={() => selectClient("AGCO")}>AGCO</a>
                  <a onClick={() => selectClient("Komatsu")}>Komatsu</a>
                  <a onClick={() => selectClient("John Deere")}>John Deere</a>
                  <a onClick={() => selectClient("Whirlpool")}>Whirlpool</a>
                  <a onClick={() => selectClient("Electrolux")}>Electrolux</a>
                  <a onClick={() => selectClient("JCB")}>JCB</a>
                  <a onClick={() => selectClient("Embraco")}>Embraco</a>
                </div>
              </div>

              <input
                id="pgs-number"
                placeholder="Page number"
                type="number"
                value={pageNumber}
                onChange={handlePageNumberChange}
              />
            </div>
          </div>
        </div>

        <div className="separate"></div>

        <div className="files-container">
          <h3 className="h3">Files</h3>
          <div id="files">{file && <p>{file.name}</p>}</div>
        </div>
      </div>

      <div className="button-container">
        <button id="start-button" onClick={startProcess}>
          process1
        </button>
        <button id="start-button" onClick={startProcess2}>
          process2
        </button>
        <button id="start-button" onClick={downloadExcel}>
          downloadExcel
        </button>
      </div>

      <div id="progress-bar-container">
        <div id="progress-bar" style={{ width: `${progress}%` }}></div>
        <h3 id="progress-bar-text">{progress}%</h3>
      </div>
    </div>
  );
};

export default ARESComponent;
