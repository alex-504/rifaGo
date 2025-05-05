## PostGres commands


<!-- ## Gerenciamento do Serviço PostgreSQL -->

# Iniciar o serviço
brew services start postgresql@14

# Parar o serviço
brew services stop postgresql@14

# Reiniciar o serviço
brew services restart postgresql@14

# Ver status do serviço
brew services list


<!-- ## Comandos de Banco de Dados  -->

# Criar um novo banco de dados
createdb nome_do_banco

# Deletar um banco de dados
dropdb nome_do_banco

# Listar todos os bancos de dados
psql -l

# Conectar a um banco específico
psql nome_do_banco

<!-- Comandos dentro do psql (quando você já está conectado): -->

-- Listar todas as tabelas
\dt

-- Descrever uma tabela específica
\d nome_da_tabela

-- Listar todos os usuários/roles
\du

-- Sair do psql
\q

-- Limpar a tela
\! clear

-- Ver a versão do PostgreSQL
SELECT version();

<!-- Comandos de Usuário -->

-- Criar um novo usuário
CREATE USER nome_usuario WITH PASSWORD 'your_secure_password_here';

-- Alterar senha de um usuário
ALTER USER nome_usuario WITH PASSWORD 'your_new_secure_password_here';

-- Dar privilégios a um usuário
GRANT ALL PRIVILEGES ON DATABASE nome_do_banco TO nome_usuario;

<!-- Comandos de Backup e Restauração -->
# Fazer backup de um banco
pg_dump nome_do_banco > backup.sql

# Restaurar um banco de um backup
psql nome_do_banco < backup.sql



<!-- Comandos de Troubleshooting: -->

# Ver logs do PostgreSQL
tail -f /opt/homebrew/var/log/postgresql@14.log

# Ver processos do PostgreSQL
ps aux | grep postgres

# Verificar se o PostgreSQL está rodando na porta padrão
lsof -i :5432


<!-- Comandos Úteis para Desenvolvimento: -->

-- Ver todas as conexões ativas
SELECT * FROM pg_stat_activity;

-- Matar uma conexão específica
SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE pid = numero_do_pid;

-- Ver tamanho do banco de dados
SELECT pg_size_pretty(pg_database_size('nome_do_banco'));

-- Ver tamanho de uma tabela
SELECT pg_size_pretty(pg_total_relation_size('nome_da_tabela'));


<!-- Comandos de Manutenção: -->

-- Vacuum (limpeza e otimização)
VACUUM FULL;

-- Reindexar uma tabela
REINDEX TABLE nome_da_tabela;

-- Analisar uma tabela
ANALYZE nome_da_tabela;


============================

## Hierarquia
* Eu como deve (`app_admin`), poderei criar e gerenciar empresas (`Client`)
* Cada empresa poderá ter seus motoristas (`Driver`)
* Os motoristas poderão cadastrar clientes finais (`EndClient`)


A estrutura mostra:
1. Admin do App (Você)
- Controla todo o sistema
- Cadastra as empresas clientes
2. Admin do Cliente (Empresa)
- Gerencia sua própria empresa
- Controla motoristas e vendas
3. Motorista (Vendedor)
- Faz as vendas
- Cadastra clientes finais
4. Cliente Final
- Consumidor final
- Apenas dados armazenados


⚠️ **IMPORTANTE**: 
- Nunca use senhas fracas em produção
- Use senhas fortes com pelo menos 12 caracteres
- Inclua letras maiúsculas, minúsculas, números e caracteres especiais
- Considere usar um gerenciador de senhas para gerar e armazenar senhas seguras

