# Abrir e validar a etapa 02 no VS Code

1. Extraia o ZIP e abra a pasta `reservafacil-etapa-02` no VS Code em **Arquivo > Abrir Pasta**.
2. Abra o terminal integrado (`Ctrl + crase`) e verifique `node --version` (Node 22 ou superior).
3. Execute `npm install`.
4. Duplique `.env.example` para `.env` (arquivo local ignorado pelo Git). Preencha `DEMO_ADMIN_PASSWORD=AdminTeste@2026` e `DEMO_USUARIO_PASSWORD=UsuarioTeste@2026` apenas no `.env` local. As demais chaves podem ficar vazias: o servidor usa porta 3000 e banco `dados/reservafacil.db`. Para implementar o login futuramente, defina `JWT_SECRET` forte e aleatorio.
5. Execute `npm run seed`. O script prepara o esquema e inclui dados ficticios; pode ser repetido sem duplicar registros.
6. Execute `npm test`. Todos os testes da etapa 02 devem passar antes de prosseguir.
7. Execute `npm start` e abra `http://localhost:3000`.
8. Confira a resposta de `http://localhost:3000/api/health`: `{"status":"ok","banco":"conectado"}`.

**Nesta etapa nao fazer commit, push ou PR.** Primeiro conferir o funcionamento no ambiente local e os requisitos com o enunciado. As funcionalidades de cadastro, login, CRUD de salas, reservas, relatorios e controles de acesso ainda nao estao implementadas.
