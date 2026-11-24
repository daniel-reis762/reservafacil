# Decisoes tecnicas registradas

1. **Reservas de uma hora:** uma reserva usa hora inicial inteira de 8 a 19, reduzindo a complexidade dos conflitos sem alterar o objetivo do projeto.
2. **Historico preservado:** o cancelamento altera o status e preenche `cancelada_em`; o horario fica livre para outra reserva.
3. **Integridade concorrente:** um indice UNIQUE parcial garante que duas operacoes simultaneas nao confirmem o mesmo slot; a camada de servico traduz o conflito em HTTP 409.
4. **Identidade pelo JWT:** um usuario comum nao escolhe qual `usuario_id` consultar ou cancelar. O servidor confere a propriedade da reserva.
5. **Datas locais:** a validacao de passado/futuro sera realizada pela camada de servicos, usando a zona de negocio configurada, nao somente o formato protegido por CHECK no SQL.
6. **Demonstracao sem segredos:** o seed inclui duas contas ficticias com senhas publicas de teste. O JWT_SECRET e fornecido apenas pelo .env local.
7. **Documentacao incremental:** as rotas ainda inexistentes estao identificadas como planejadas no contrato, para nao confundir proposta com implementacao.
