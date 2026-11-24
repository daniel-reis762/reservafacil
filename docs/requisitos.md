# Requisitos do ReservaFácil — AP2 individual

## Objetivo

Administrar salas de estudo e reuniao e permitir reservas de horarios sem conflitos. A regra principal e impedir duas reservas confirmadas para a mesma sala, data e horario.

## Atores

- **Usuario:** faz cadastro e login, consulta salas ativas, cria reservas, consulta e cancela suas reservas.
- **Administrador:** faz login, gerencia salas e consulta relatorios e reservas administrativas.

O cadastro publico nao oferece escolha de papel. Administradores de demonstracao sao preparados no seed.

## Recursos e casos de uso

- `usuarios`: nome, e-mail unico, senha em hash e papel.
- `salas`: nome, localizacao, capacidade e situacao ativa/inativa. CRUD completo via API.
- `reservas`: vincula usuario e sala em uma data e faixa de uma hora. Permite registrar, consultar e cancelar sem apagar historico.

## Regras de negocio

- **RN01 — conflito:** duas reservas com status `confirmada` nao podem compartilhar sala, data e hora de inicio. A regra sera verificada no servico e ja possui protecao estrutural por indice unico parcial no SQLite.
- **RN02 — propriedade:** usuario comum so pode consultar detalhes ou cancelar sua propria reserva, usando o ID extraido do JWT no servidor.
- **RN03 — horario valido:** reservas apenas em horas inteiras de 8 a 19, para periodos de uma hora, em datas e horarios futuros, em salas ativas.
- **RN04 — integridade do historico:** salas com reservas nao podem ser excluidas; cancelamento altera status e preserva o registro.

## Banco de dados

Arquivo `dados/schema.sql`, com PK, FK, NOT NULL, CHECK, UNIQUE e indice unico parcial. Ao menos uma consulta com JOIN e uma com agregacao serao disponibilizadas por um servico e consumidas pela API na etapa de relatorios.

## Interface e seguranca

HTML, CSS e JavaScript nativos servidos pelo Express. Uso de `fetch`, `textContent`, quatro estados (carregando, vazio, erro e sucesso) e bloqueio de clique duplo.

Hash bcrypt, JWT, controle de acesso por papel, IDOR, validacao de entradas e mais duas defesas de seguranca: Helmet e limite de tentativas no login.

## Limites do MVP

Nao incluir pagamento, integracao com calendario externo, notificacoes por e-mail, recorrencia semanal ou multiplas horas por reserva. Esses recursos nao sao exigidos e aumentariam o risco de atraso.
