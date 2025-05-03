# Comandos do RifaGo

## Iniciar o Servidor
```bash
cd backend
node src/server.js
```

## Autenticação

### Login (Admin Padrão)
```bash
curl -X POST http://localhost:3000/api/auth/login \
-H "Content-Type: application/json" \
-d '{
  "email": "admin@rifago.com",
  "password": "admin123"
}'
```

### Login (Novo Admin)
```bash
curl -X POST http://localhost:3000/api/auth/login \
-H "Content-Type: application/json" \
-d '{
  "email": "alexandre.ealimentos@gmail.com",
  "password": "2211"
}'
```

## Usuários

### Listar Usuários
```bash
curl http://localhost:3000/api/users \
-H "Authorization: Bearer SEU_TOKEN_AQUI"
```

### Criar Usuário
```bash
curl -X POST http://localhost:3000/api/users \
-H "Authorization: Bearer SEU_TOKEN_AQUI" \
-H "Content-Type: application/json" \
-d '{
  "name": "Cliente Teste",
  "email": "cliente@teste.com",
  "password": "senha123",
  "role": "client_admin"
}'
```

### Atualizar Usuário
```bash
curl -X PUT http://localhost:3000/api/users/ID_DO_USUARIO \
-H "Authorization: Bearer SEU_TOKEN_AQUI" \
-H "Content-Type: application/json" \
-d '{
  "name": "Novo Nome",
  "email": "novo@email.com",
  "password": "novasenha",
  "role": "app_admin"
}'
```

### Deletar Usuário
```bash
curl -X DELETE http://localhost:3000/api/users/ID_DO_USUARIO \
-H "Authorization: Bearer SEU_TOKEN_AQUI"
```

## Clientes

### Listar Clientes
```bash
curl http://localhost:3000/api/clients \
-H "Authorization: Bearer SEU_TOKEN_AQUI"
```

### Obter Cliente Específico
```bash
curl http://localhost:3000/api/clients/ID_DO_CLIENTE \
-H "Authorization: Bearer SEU_TOKEN_AQUI"
```

### Criar Cliente
```bash
curl -X POST http://localhost:3000/api/clients \
-H "Authorization: Bearer SEU_TOKEN_AQUI" \
-H "Content-Type: application/json" \
-d '{
  "name": "Empresa ABC",
  "address": "Rua Principal, 123",
  "city": "São Paulo",
  "state": "SP",
  "phone": "(11) 99999-9999"
}'
```

### Atualizar Cliente
```bash
curl -X PUT http://localhost:3000/api/clients/ID_DO_CLIENTE \
-H "Authorization: Bearer SEU_TOKEN_AQUI" \
-H "Content-Type: application/json" \
-d '{
  "name": "Empresa ABC Atualizada",
  "address": "Rua Nova, 456",
  "city": "São Paulo",
  "state": "SP",
  "phone": "(11) 98888-8888",
  "status": "active"
}'
```

### Deletar Cliente
```bash
curl -X DELETE http://localhost:3000/api/clients/ID_DO_CLIENTE \
-H "Authorization: Bearer SEU_TOKEN_AQUI"
```

## Dicas de Uso

1. **Obter Token**:
   - Faça login primeiro para obter o token
   - Copie o token da resposta
   - Use o token em todas as requisições subsequentes

2. **Testar Conexão**:
   - Use `curl http://localhost:3000/` para verificar se o servidor está rodando
   - Deve retornar: `{"message": "API RifaGo funcionando!"}`

3. **Verificar Erros**:
   - Se receber erro 401: Token inválido ou expirado
   - Se receber erro 403: Sem permissão para a ação
   - Se receber erro 404: Rota não encontrada

4. **Dicas de Debug**:
   - Use `-v` no curl para ver detalhes da requisição: `curl -v ...`
   - Verifique se o servidor está rodando na porta correta
   - Confirme se está no diretório correto antes de executar os comandos

## Próximos Passos

1. Implementar CRUD de Produtos
   - Criar modelo de dados
   - Implementar rotas
   - Adicionar validações

2. Implementar CRUD de Galpões
   - Criar modelo de dados
   - Implementar rotas
   - Adicionar validações

3. Desenvolver Frontend
   - Configurar projeto React
   - Implementar autenticação
   - Criar interface de usuários 