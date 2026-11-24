/**
 * Camada de dados: aplica o schema.sql para preparar o banco SQLite.
 * A inicializacao pode ser repetida sem recriar os registros existentes.
 */
const fs = require('node:fs');
const path = require('node:path');
const { abrirBanco } = require('./conexao');

/**
 * Cria as tabelas e os indices previstos no modelo relacional.
 * @param {import('better-sqlite3').Database} banco Conexao SQLite aberta.
 * @returns {void}
 * @throws {Error} Caso a execucao do SQL falhe.
 */
function aplicarEsquema(banco) {
  const sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  banco.exec(sql);
}

if (require.main === module) {
  const banco = abrirBanco();
  try {
    aplicarEsquema(banco);
    process.stdout.write('Banco inicializado com sucesso.\n');
  } finally {
    banco.close();
  }
}

module.exports = { aplicarEsquema };
