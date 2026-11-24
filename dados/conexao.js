/**
 * Camada de dados: fornece conexoes SQLite para as operacoes persistentes.
 * A ativacao de chaves estrangeiras preserva os relacionamentos entre tabelas.
 */
const fs = require('node:fs');
const path = require('node:path');
const Database = require('better-sqlite3');
require('dotenv').config({ quiet: true });

/**
 * Abre o banco local configurado para a aplicacao.
 * @param {string} [caminhoBanco] Caminho opcional para o arquivo SQLite.
 * @returns {import('better-sqlite3').Database} Conexao com chaves estrangeiras ativas.
 * @throws {Error} Quando nao e possivel criar o diretorio ou abrir o banco.
 */
function abrirBanco(caminhoBanco = process.env.DB_PATH || path.join(__dirname, 'reservafacil.db')) {
  const caminhoResolvido = path.resolve(caminhoBanco);
  fs.mkdirSync(path.dirname(caminhoResolvido), { recursive: true });
  const banco = new Database(caminhoResolvido, { timeout: 5000 });
  banco.pragma('foreign_keys = ON');
  return banco;
}

module.exports = { abrirBanco };
