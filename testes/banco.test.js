/**
 * Testes do banco: verificam as restricoes SQL e os dados de demonstracao.
 * Cada caso utiliza um banco isolado em memoria para evitar alteracoes locais.
 */
const test = require('node:test');
const assert = require('node:assert/strict');
const Database = require('better-sqlite3');
const bcrypt = require('bcrypt');
const { aplicarEsquema } = require('../dados/esquema');
const { popularBanco } = require('../dados/seed');

/**
 * Prepara um banco SQLite em memoria com o esquema do projeto.
 * @returns {import('better-sqlite3').Database} Banco pronto para testes.
 */
function novoBanco() {
  const banco = new Database(':memory:');
  banco.pragma('foreign_keys = ON');
  aplicarEsquema(banco);
  return banco;
}

/**
 * Registra usuarios e salas validos para testar reservas.
 * @param {import('better-sqlite3').Database} banco Banco isolado de testes.
 * @returns {{usuarioId: number, salaId: number}} Identificadores dos registros.
 */
function criarBase(banco) {
  const usuarioId = banco.prepare("INSERT INTO usuarios (nome,email,senha_hash) VALUES (?,?,?)")
    .run('Usuario Base', 'teste@reservafacil.test', '$2b$12$' + 'a'.repeat(53)).lastInsertRowid;
  const salaId = banco.prepare("INSERT INTO salas (nome,localizacao,capacidade) VALUES (?,?,?)")
    .run('Sala Principal', 'Biblioteca', 6).lastInsertRowid;
  return { usuarioId, salaId };
}

test('cria as tres tabelas do modelo relacional', () => {
  const banco = novoBanco();
  try {
    const tabelas = banco.prepare("SELECT name FROM sqlite_master WHERE type = 'table'").all().map(item => item.name);
    for (const tabela of ['usuarios', 'salas', 'reservas']) assert.ok(tabelas.includes(tabela));
  } finally { banco.close(); }
});

test('bloqueia reservas duplicadas do mesmo horario com indice parcial', () => {
  const banco = novoBanco();
  try {
    const { usuarioId, salaId } = criarBase(banco);
    const inserir = banco.prepare('INSERT INTO reservas (usuario_id,sala_id,data_reserva,hora_inicio) VALUES (?,?,?,?)');
    inserir.run(usuarioId, salaId, '2026-12-03', 14);
    assert.throws(() => inserir.run(usuarioId, salaId, '2026-12-03', 14), /UNIQUE constraint failed/);
    assert.equal(banco.prepare('SELECT COUNT(*) AS total FROM reservas').get().total, 1);
  } finally { banco.close(); }
});

test('cancelamento libera o horario sem apagar o historico', () => {
  const banco = novoBanco();
  try {
    const { usuarioId, salaId } = criarBase(banco);
    const inserir = banco.prepare('INSERT INTO reservas (usuario_id,sala_id,data_reserva,hora_inicio) VALUES (?,?,?,?)');
    const primeira = inserir.run(usuarioId, salaId, '2026-12-03', 14).lastInsertRowid;
    banco.prepare("UPDATE reservas SET status = 'cancelada', cancelada_em = datetime('now') WHERE id = ?").run(primeira);
    inserir.run(usuarioId, salaId, '2026-12-03', 14);
    assert.equal(banco.prepare('SELECT COUNT(*) AS total FROM reservas').get().total, 2);
  } finally { banco.close(); }
});

test('exige chave estrangeira valida nas reservas', () => {
  const banco = novoBanco();
  try {
    const { salaId } = criarBase(banco);
    assert.throws(
      () => banco.prepare('INSERT INTO reservas (usuario_id,sala_id,data_reserva,hora_inicio) VALUES (?,?,?,?)').run(9999, salaId, '2026-12-03', 10),
      /FOREIGN KEY constraint failed/
    );
  } finally { banco.close(); }
});

test('impede horarios fora da faixa permitida', () => {
  const banco = novoBanco();
  try {
    const { usuarioId, salaId } = criarBase(banco);
    assert.throws(
      () => banco.prepare('INSERT INTO reservas (usuario_id,sala_id,data_reserva,hora_inicio) VALUES (?,?,?,?)').run(usuarioId, salaId, '2026-12-03', 20),
      /CHECK constraint failed/
    );
  } finally { banco.close(); }
});

test('impede usuarios com e-mails duplicados independente de maiusculas', () => {
  const banco = novoBanco();
  try {
    criarBase(banco);
    assert.throws(
      () => banco.prepare('INSERT INTO usuarios (nome,email,senha_hash) VALUES (?,?,?)').run('Outra Pessoa', 'TESTE@reservafacil.test', '$2b$12$' + 'a'.repeat(53)),
      /UNIQUE constraint failed/
    );
  } finally { banco.close(); }
});

test('seed e repetivel e grava senhas em hash bcrypt', () => {
  const banco = novoBanco();
  try {
    const senhas = { admin: 'AdminTeste@2026', usuario: 'UsuarioTeste@2026' };
    const primeira = popularBanco(banco, senhas);
    const segunda = popularBanco(banco, senhas);
    assert.deepEqual(primeira, { usuarios: 2, salas: 3 });
    assert.deepEqual(segunda, primeira);
    const admin = banco.prepare('SELECT senha_hash FROM usuarios WHERE email = ?').get('admin@reservafacil.test');
    assert.notEqual(admin.senha_hash, 'AdminTeste@2026');
    assert.ok(bcrypt.compareSync('AdminTeste@2026', admin.senha_hash));
  } finally { banco.close(); }
});

test('consulta relacional JOIN e agregacao GROUP BY podem ser executadas', () => {
  const banco = novoBanco();
  try {
    const { usuarioId, salaId } = criarBase(banco);
    banco.prepare('INSERT INTO reservas (usuario_id,sala_id,data_reserva,hora_inicio) VALUES (?,?,?,?)').run(usuarioId, salaId, '2026-12-03', 9);
    const relatorio = banco.prepare(`
      SELECT s.nome, COUNT(r.id) AS total_reservas
      FROM salas AS s
      LEFT JOIN reservas AS r ON r.sala_id = s.id
      GROUP BY s.id, s.nome
    `).all();
    assert.deepEqual(relatorio, [{ nome: 'Sala Principal', total_reservas: 1 }]);
  } finally { banco.close(); }
});
