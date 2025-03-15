//Inicializando o editor de código usando CodeMirror, definindo alguns parâmetros
const editor = CodeMirror.fromTextArea(document.getElementById("editor"), {
  mode: "python",       
  lineNumbers: true,    
  theme: "default",      
  indentUnit: 4,         
  indentWithTabs: true,  
});

//Seleciona o botão de execução e a área de saída do console
const runButton = document.getElementById("run");
const consoleOutput = document.getElementById("console");

//Variável do WebWorker
let worker; 

//Função para iniciar um Web Worker e executar código Python. Verifica se o navegador suporta e cria um caso não exista previamente
function startWorker(code) {
  if (typeof Worker !== "undefined") { 
      if (worker === undefined) { 
          worker = new Worker("worker.js");
      }

      //Definindo o que acontece ao receber mensagens do worker
      worker.onmessage = function (event) {
          const { type, result } = event.data;
          if (type === "output") {
              appendOutput(result); 
          } else if (type === "error") {
              appendError(result); 
          }
      };

      //Envia o código Python para o worker executar
      worker.postMessage(code);
  } else {
      appendError("Web Workers não suportados pelo navegador.");
  }
}

//Função para parar o Web Worker
function stopWorker() {
  if (worker) {
      worker.terminate(); 
      worker = undefined; 
  }
}

//Adiciona um texto ao console na cor padrao
function appendOutput(text) {
  consoleOutput.innerHTML += `<div style="color: #eee;">${text}</div>`;
  consoleOutput.scrollTop = consoleOutput.scrollHeight;
}

//Adiciona um texto ao console na cor vermelha (para erros)
function appendError(text) {
  consoleOutput.innerHTML += `<div style="color: red;">${text}</div>`;
  consoleOutput.scrollTop = consoleOutput.scrollHeight;
}

//Limpa a saída do console
function clearConsole() {
  consoleOutput.innerHTML = "";
}

//Evento de clique no botão RUN/STOP. 
//Altera o botão RUN para STOP e vice-versa
//Inicio o Worker com o código recebido do editor
//Ou encerra.
runButton.addEventListener("click", () => {
  if (runButton.textContent === "RUN") {
      clearConsole();
      runButton.textContent = "STOP"; 
      startWorker(editor.getValue()); 
  } else {
      runButton.textContent = "RUN"; 
      stopWorker();
  }
});
