# Checklist AP2 — conferência antes de cada entrega

## Requisitos e processo
- [x] Tema distinto de votacao e hotelaria.
- [x] Projeto individual, atores e regras definidos.
- [ ] Repositorio publico no GitHub e verificacao em janela anonima.
- [ ] `develop`, `feature/...` e PRs reais no repositorio.
- [ ] Commits frequentes e descritivos no padrao Conventional Commits.
- [ ] Nenhum arquivo `.env`, banco local ou `node_modules` versionado.

## JavaScript e API
- [ ] Validacao rigorosa de dados de entrada (tipo, formato, limites).
- [ ] Rotas por recurso usando `Router`.
- [ ] Middleware proprio, tratamento centralizado e todos os status exigidos.
- [ ] Dois recursos relacionados e CRUD completo de salas pela interface.
- [ ] Pelo menos duas regras de negocio efetivamente verificadas no servidor.

## Dados
- [x] `schema.sql` com PK, FK, NOT NULL e CHECK/UNIQUE.
- [x] Indice que impede duas reservas confirmadas no mesmo horario.
- [x] `seed.js` com usuarios e salas de demonstracao.
- [ ] JOIN e agregacao expostos em funcionalidades reais da API.
- [ ] Todas as consultas dos futuros recursos parametrizadas.

## Interface e seguranca
- [ ] Front-end consumindo as funcionalidades reais com `fetch`.
- [ ] Quatro estados de tela em cada consulta.
- [ ] Dados externos exibidos com `textContent`.
- [ ] Prevencao de clique duplo nos formularios.
- [ ] Cadastro e login, senhas bcrypt, JWT e dois papeis.
- [ ] Rotas por papel e verificacao de propriedade (IDOR).
- [x] Helmet configurado no servidor.
- [ ] Limitacao de tentativas aplicada no `/api/auth/login`.

## Documentacao e apresentacao
- [ ] Cabeçalhos e JSDoc revisados em todos os arquivos aplicaveis.
- [ ] README final com instalacao, usuarios, contrato, banco, regras e medidas de seguranca.
- [ ] Projeto inicializa a partir de um clone limpo seguindo o README.
- [ ] Demonstrar as regras recusando operacoes invalidas.
- [ ] Versao final integrada na branch `main`.
- [ ] Tag `ap2-entrega` publicada e hash coletado.
- [ ] Formulario do AVA enviado ate 07/12/2026 as 23h59.

**Nota:** itens marcados representam artefatos ja preparados nesta etapa, nao a conclusao de toda a aplicacao.
