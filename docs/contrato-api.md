# Contrato inicial da API REST

Este documento registra as rotas **planejadas**. Na etapa 02 apenas `GET /api/health` esta implementada.

| Metodo | Rota | Resultado esperado | Papel | Etapa |
| --- | --- | --- | --- | --- |
| GET | `/api/health` | 200, 500 | Publico | Implementada |
| POST | `/api/auth/cadastro` | 201, 400, 409 | Publico | Planejada |
| POST | `/api/auth/login` | 200, 400, 401, 429 | Publico | Planejada |
| GET | `/api/salas` | 200, 401 | Autenticado | Planejada |
| GET | `/api/salas/:id` | 200, 401, 404 | Autenticado | Planejada |
| POST | `/api/salas` | 201, 400, 401, 403, 409 | Administrador | Planejada |
| PUT | `/api/salas/:id` | 200, 400, 401, 403, 404, 409 | Administrador | Planejada |
| DELETE | `/api/salas/:id` | 204, 401, 403, 404, 409 | Administrador | Planejada |
| GET | `/api/reservas` | 200, 401 | Dono das reservas | Planejada |
| GET | `/api/reservas/:id` | 200, 401, 404 | Dono da reserva | Planejada |
| POST | `/api/reservas` | 201, 400, 401, 404, 409 | Usuario autenticado | Planejada |
| PATCH | `/api/reservas/:id/cancelar` | 200, 401, 404, 409 | Dono da reserva | Planejada |
| GET | `/api/admin/reservas` | 200, 401, 403 | Administrador | Planejada |
| GET | `/api/relatorios/salas` | 200, 401, 403 | Administrador | Planejada |

## Formatos definidos para as proximas etapas

- `POST /api/auth/cadastro`: `{ "nome": "...", "email": "...", "senha": "..." }`. O papel e sempre definido como `usuario` pelo servidor.
- `POST /api/auth/login`: `{ "email": "...", "senha": "..." }`.
- `POST /api/reservas`: `{ "sala_id": 1, "data_reserva": "2026-12-03", "hora_inicio": 14 }`.
- Horario: uma hora por reserva, com inicio inteiro de 8 a 19. `20` nao e horario valido para inicio.
- Data: formato `AAAA-MM-DD`, validado tambem no servidor; nao permitir dias/horarios passados.
- Erros: JSON com `erro`; conflitos retornam 409; falta de autenticacao 401; permissao negada 403.
- IDOR: o identificador do usuario nao pode ser aceito do corpo ou query string para acessar reservas de outro usuario. A identidade vem do token verificado.
- Exclusao de sala com historico: 409, preservando as referencias em `reservas`.
- O contrato completo, incluindo exemplos de respostas e tratamento de erros, sera ampliado conforme cada funcionalidade for implementada e testada.
