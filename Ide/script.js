const editor = CodeMirror.fromTextArea(document.getElementById("editor"), {
    mode: "python",
    lineNumbers: true,
    theme: "default", 
    indentUnit: 4, 
    indentWithTabs: true, 
  });
  
  // Configurando o botão RUN/STOP
  const runButton = document.getElementById("run");
  const consoleOutput = document.getElementById("console");
  let worker;
  
  function startWorker(code) {
    if (typeof Worker !== "undefined") {
      if (worker === undefined) {
        worker = new Worker("worker.js");
      }
  
      worker.onmessage = function (event) {
        const { type, result } = event.data;
        if (type === "output") {
          appendOutput(result);
        } else if (type === "error") {
          appendError(result);
        }
      };
  
      worker.postMessage(code);
    } else {
      appendError("Web Workers não suportados pelo navegador.");
    }
  }
  
  function stopWorker() {
    if (worker) {
      worker.terminate();
      worker = undefined;
    }
  }
  
  function appendOutput(text) {
    consoleOutput.innerHTML += `<div style="color: #eee;">${text}</div>`;
    consoleOutput.scrollTop = consoleOutput.scrollHeight; // Rolagem automática para o final
  }
  
  function appendError(text) {
    consoleOutput.innerHTML += `<div style="color: red;">${text}</div>`;
    consoleOutput.scrollTop = consoleOutput.scrollHeight; // Rolagem automática para o final
  }
  function clearConsole() {
    consoleOutput.innerHTML = "";
  }
  // Evento para o botão RUN
  runButton.addEventListener("click", () => {
    if (runButton.textContent === "RUN") {
      clearConsole()
      runButton.textContent = "STOP";
      startWorker(editor.getValue());
    } else {
      runButton.textContent = "RUN";
      stopWorker();
    }
  });
  
  