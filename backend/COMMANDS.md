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
  "email": "admin@example.com",
  "password": "your_password_here"
}'
```

### Login (Novo Admin)
```bash
curl -X POST http://localhost:3000/api/auth/login \
-H "Content-Type: application/json" \
-d '{
  "email": "new_admin@example.com",
  "password": "your_password_here"
}'
```

## Usuários

### Listar Usuários
```bash
curl http://localhost:3000/api/users \
-H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Criar Usuário
```bash
curl -X POST http://localhost:3000/api/users \
-H "Authorization: Bearer YOUR_TOKEN_HERE" \
-H "Content-Type: application/json" \
-d '{
  "name": "Example User",
  "email": "user@example.com",
  "password": "your_password_here",
  "role": "client_admin"
}'
```

### Atualizar Usuário
```bash
curl -X PUT http://localhost:3000/api/users/USER_ID \
-H "Authorization: Bearer YOUR_TOKEN_HERE" \
-H "Content-Type: application/json" \
-d '{
  "name": "Updated Name",
  "email": "updated@example.com",
  "password": "your_new_password",
  "role": "app_admin"
}'
```

### Deletar Usuário
```bash
curl -X DELETE http://localhost:3000/api/users/USER_ID \
-H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Clientes

### Listar Clientes
```bash
curl http://localhost:3000/api/clients \
-H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Obter Cliente Específico
```bash
curl http://localhost:3000/api/clients/CLIENT_ID \
-H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Criar Cliente
```bash
curl -X POST http://localhost:3000/api/clients \
-H "Authorization: Bearer YOUR_TOKEN_HERE" \
-H "Content-Type: application/json" \
-d '{
  "name": "Example Company",
  "address": "123 Main St",
  "city": "Example City",
  "state": "EX",
  "phone": "(11) 99999-9999"
}'
```

### Atualizar Cliente
```bash
curl -X PUT http://localhost:3000/api/clients/CLIENT_ID \
-H "Authorization: Bearer YOUR_TOKEN_HERE" \
-H "Content-Type: application/json" \
-d '{
  "name": "Updated Company",
  "address": "456 New St",
  "city": "Example City",
  "state": "EX",
  "phone": "(11) 98888-8888",
  "status": "active"
}'
```

### Deletar Cliente
```bash
curl -X DELETE http://localhost:3000/api/clients/CLIENT_ID \
-H "Authorization: Bearer YOUR_TOKEN_HERE"
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

## Segurança

⚠️ **IMPORTANTE**: 
- Nunca compartilhe ou comite credenciais reais no repositório
- Use variáveis de ambiente para armazenar senhas e tokens
- Mantenha suas credenciais seguras e não as exponha em documentação
- Considere usar um gerenciador de segredos para desenvolvimento

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