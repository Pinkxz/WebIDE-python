importScripts('https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js'); // Carrega o Pyodide

async function loadPyodideAndRun(code) {
  let pyodide = await loadPyodide({
    stdout: (text) => {
      self.postMessage({ type: 'output', result: text })
      return
    },
    stderr: (text) => {
      self.postMessage({ type: 'error', result: text })
      return
    }
  });
  try {
    pyodide.runPython(code);

  } catch (err) {
    self.postMessage({ type: 'error', result: err.message });
  }
}

self.onmessage = async (event) => {
  loadPyodideAndRun(event.data)
};
