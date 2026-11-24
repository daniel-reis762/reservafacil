/**
 * Camada de servicos: verifica a disponibilidade do banco para diagnostico.
 * A consulta e simples para nao expor dados internos na resposta publica.
 */
const { abrirBanco } = require('../dados/conexao');

/**
 * Retorna o estado basico de funcionamento da aplicacao.
 * @returns {{status: string, banco: string}} Informacao publica de disponibilidade.
 * @throws {Error} Se a conexao ao banco falhar.
 */
function consultarSaude() {
  const banco = abrirBanco();
  try {
    banco.prepare('SELECT 1 AS ativo').get();
    return { status: 'ok', banco: 'conectado' };
  } finally {
    banco.close();
  }
}

module.exports = { consultarSaude };
