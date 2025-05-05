#!/bin/bash

# Backup do repositório
cp -r . ../rifaGo_backup_2

# Substituir senhas e chaves por valores seguros
git filter-repo --force \
  --replace-text <(cat <<EOF
admin123==>your_secure_password_here
2211==>your_secure_password_here
senha123==>your_secure_password_here
novasenha==>your_secure_password_here
changeme123==>your_secure_password_here
test123==>your_secure_password_here
rifago-secret-key==>your_secure_jwt_secret_here
postgres==>your_secure_db_password_here
EOF
)

# Forçar garbage collection
git gc --aggressive --prune=now 