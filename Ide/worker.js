//Importando a biblioteca Pyodide
importScripts('https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js');

//Função assíncrona para carregar o Pyodide e executar o código Python recebido
async function loadPyodideAndRun(code) {
  // arregando o Pyodide e definindo as funções de saída padrão (stdout e stderr, para envio da saída ou mensagem de erro do código Python de volta para a thread principal
  let pyodide = await loadPyodide({
    stdout: (text) => {
      self.postMessage({ type: 'output', result: text });
      return;
    },
    stderr: (text) => {
      self.postMessage({ type: 'error', result: text });
      return;
    }
  });

  //Executa o código Python recebido ou captura e envia mensagens de erro em caso de falha
  try {  
    pyodide.runPython(code);
  } catch (err) {
    self.postMessage({ type: 'erro', result: err.message });
  }
}

//Evento que escuta mensagens enviadas da thread principal e chama a função para carregar e executar o código Python recebido
self.onmessage = async (event) => {
  loadPyodideAndRun(event.data);
};
