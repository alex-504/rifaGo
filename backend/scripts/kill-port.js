const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

async function killPort(port) {
  try {
    // Verifica se a porta está em uso
    const { stdout } = await execPromise(`lsof -i :${port}`);
    
    if (stdout) {
      console.log(`Porta ${port} está em uso. Tentando liberar...`);
      
      // Extrai o PID do processo
      const pid = stdout.split('\n')[1]?.split(' ').filter(Boolean)[1];
      
      if (pid) {
        // Mata o processo
        await execPromise(`kill -9 ${pid}`);
        console.log(`Processo ${pid} encerrado. Porta ${port} liberada.`);
      }
    } else {
      console.log(`Porta ${port} está livre.`);
    }
  } catch (error) {
    // Se não houver processo usando a porta, o comando lsof retorna erro
    if (error.code === 1) {
      console.log(`Porta ${port} está livre.`);
    } else {
      console.error('Erro ao verificar porta:', error.message);
      process.exit(1);
    }
  }
}

// Executa a função com a porta 3000
killPort(3000); 