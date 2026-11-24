# ReservaFácil — Sistema Web de Reserva de Salas

Projeto individual de **Linguagens e Tecnologias para Desenvolvimento Web** (AP2). O sistema proposto permite que usuarios reservem salas de estudo e reuniao, enquanto administradores gerenciam o cadastro das salas. A regra principal impede duas reservas confirmadas para a mesma sala, data e hora.

**Situacao atual:** etapa 02, estrutura inicial de servidor e dados. A API funcional nesta versao e apenas `GET /api/health`. Cadastro, login, CRUD, reservas e relatorios estao planejados, nao implementados. Consulte [docs/contrato-api.md](docs/contrato-api.md).

## Tecnologias

- Node.js 22 ou superior, JavaScript, Express, Helmet.
- SQLite com `better-sqlite3`.
- HTML, CSS e JavaScript puro, servidos pelo Express.
- Bibliotecas instaladas para as etapas seguintes: bcrypt, jsonwebtoken e express-rate-limit.

## Atores e casos de uso

- **Usuario:** cadastro e login, consulta de salas, reserva, consulta e cancelamento de suas reservas.
- **Administrador:** login, CRUD de salas, visualizacao administrativa de reservas e relatorio por sala.

Os casos de uso acima sao o escopo da entrega final, ainda em desenvolvimento.

## Instalar e executar esta etapa

1. Instale o Node.js 22 ou superior.
2. Na pasta do projeto, execute `npm install`.
3. Copie `.env.example` para `.env` e preencha `DEMO_ADMIN_PASSWORD=AdminTeste@2026` e `DEMO_USUARIO_PASSWORD=UsuarioTeste@2026` **somente no arquivo local `.env`**. As demais chaves podem ficar vazias nesta etapa.
4. Execute `npm run seed` para criar o banco e os dados de demonstracao.
5. Execute `npm test` para verificar o banco e a API inicial.
6. Execute `npm start` e abra `http://localhost:3000`.
7. Acesse `http://localhost:3000/api/health` para confirmar a conexao com SQLite.

Scripts: `npm run db:init` cria somente o esquema; `npm run seed` cria esquema e dados; `npm test` executa testes automatizados; `npm run dev` inicia o servidor em modo de desenvolvimento.

## Variaveis de ambiente

| Chave | Uso |
| --- | --- |
| `PORT` | Porta HTTP, opcional nesta etapa (padrao 3000) |
| `DB_PATH` | Caminho do SQLite, opcional (padrao `dados/reservafacil.db`) |
| `JWT_SECRET` | Chave secreta exigida na futura etapa de autenticacao; somente em `.env` local |
| `JWT_EXPIRES_IN` | Prazo futuro de expiracao dos tokens |
| `APP_TIMEZONE` | Zona de horario utilizada para validar reservas futuras |
| `NODE_ENV` | Identifica o ambiente de execucao |
| `DEMO_ADMIN_PASSWORD` | Senha publica de demonstracao do administrador, apenas no `.env` |
| `DEMO_USUARIO_PASSWORD` | Senha publica de demonstracao do usuario comum, apenas no `.env` |

Nao versionar `.env`. O arquivo `.env.example` contem apenas nomes das chaves, sem valores.

## Usuarios de demonstracao

O seed prepara contas ficticias usando as duas senhas definidas apenas no `.env`; no SQLite ficam guardados exclusivamente os hashes bcrypt. **O login ainda nao esta implementado nesta etapa.**

| Papel | E-mail de demonstracao | Senha de demonstracao |
| --- | --- | --- |
| Administrador | `admin@reservafacil.test` | `AdminTeste@2026` |
| Usuario | `usuario@reservafacil.test` | `UsuarioTeste@2026` |

Essas credenciais sao publicas e destinadas somente a testes locais; nao devem ser reutilizadas em ambiente real.

## Modelo de dados

- `usuarios`: PK `id`, email UNIQUE sem diferenca de caixa, hash da senha e papel validado por CHECK.
- `salas`: PK `id`, nome UNIQUE, capacidade validada por CHECK e indicador de disponibilidade.
- `reservas`: PK `id`, FK `usuario_id` e `sala_id`, data, hora inicial e status. O indice unico parcial em `(sala_id, data_reserva, hora_inicio)` impede reservas confirmadas duplicadas; o cancelamento preserva o historico e libera o horario.

Arquivo de referencia: [`dados/schema.sql`](dados/schema.sql). O seed fica em [`dados/seed.js`](dados/seed.js).

## API disponivel nesta etapa

| Metodo | Rota | Status | Papel |
| --- | --- | --- | --- |
| `GET` | `/api/health` | `200` (ou `500` se houver erro) | Publico |

As demais rotas e codigos HTTP estao descritos como **planejados**, nao implementados, em [docs/contrato-api.md](docs/contrato-api.md).

## Regras de negocio e seguranca

- **RN01 (planejada no servico):** impedir duas reservas confirmadas no mesmo dia e horario. A protecao de dados ja consta de [`dados/schema.sql`](dados/schema.sql).
- **RN02 (planejada):** impedir que um usuario consulte ou cancele reserva de outra pessoa (IDOR), usando identidade do JWT, sem confiar no ID fornecido pelo cliente.
- **RN03 (planejada):** impedir reserva no passado, horarios fora da faixa ou em sala inativa.
- **RN04 (planejada):** impedir exclusao de sala com historico, retornando conflito HTTP 409.
- **Helmet (implementado):** cabecalhos de protecao definidos em [`app.js`](app.js).
- **SQL parametrizado (implementado nos comandos de seed e testes):** valores enviados em parametros, evitando interpolar dados em SQL.
- **Bcrypt (implementado no seed):** demonstracao de senha em hash em [`dados/seed.js`](dados/seed.js).
- **JWT, autorizacao e limitacao de login:** dependencias previstas, comportamento ainda nao implementado.

## Documentacao e testes

- [Requisitos e regras](docs/requisitos.md)
- [Contrato da API](docs/contrato-api.md)
- [Decisoes tecnicas](docs/decisoes.md)
- [Checklist da AP2](docs/checklist-ap2.md)
- [Guia VS Code](docs/guia-vscode.md)

Arquivos em `testes/` verificam restricoes do SQLite, seed, consulta relacional e rota HTTP de diagnostico.

## Limites atuais e conhecidos

Nao ha login ou operacoes de reserva nesta versao; o front-end apresenta apenas a conexao inicial. O indice unico protege o horario no banco, mas as respostas de erro de negocio e a validacao de datas futuras ainda serao implementadas nos servicos. A consulta JOIN/agregacao foi validada em teste, mas ainda nao e disponibilizada pela API.

## Entrega da AP2

O novo enunciado exige repositorio individual e publico, branches e Pull Requests, README completo, codigo comentado e entrega **no formulario do AVA ate 07/12/2026 as 23h59**. A versao final deve estar na `main`, marcada com tag `ap2-entrega`, acompanhada do hash informado no formulario. Nenhum commit ou PR faz parte desta etapa preparatoria.
