const axios = require('axios');

const API_URL = 'http://127.0.0.1:3000/api';

async function testAuth() {
  try {
    console.log('Testando autenticação...\n');

    // Teste de login
    console.log('1. Testando login com credenciais válidas...');
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: 'admin@rifago.com',
      password: 'your_secure_password_here',
    });
    console.log('Login bem-sucedido!');
    console.log('Token recebido:', loginResponse.data.token);
    console.log('Dados do usuário:', loginResponse.data.user);
    console.log('\n');

    // Teste de logout
    console.log('2. Testando logout...');
    const logoutResponse = await axios.post(
      `${API_URL}/auth/logout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${loginResponse.data.token}`,
        },
      }
    );
    console.log('Logout bem-sucedido!');
    console.log('Resposta:', logoutResponse.data);
    console.log('\n');

    // Teste de login com credenciais inválidas
    console.log('3. Testando login com credenciais inválidas...');
    try {
      await axios.post(`${API_URL}/auth/login`, {
        email: 'admin@rifago.com',
        password: 'senha_errada',
      });
    } catch (error) {
      console.log('Erro esperado:', error.response.data.error);
    }

    console.log('\nTodos os testes concluídos!');
  } catch (error) {
    console.error('Erro durante os testes:', error.response?.data || error.message);
  }
}

testAuth(); 