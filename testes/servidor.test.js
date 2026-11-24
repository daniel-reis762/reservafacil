/**
 * Testes HTTP: validam o diagnostico do servidor e a resposta para rotas ausentes.
 * Um arquivo SQLite temporario evita modificar a base real de demonstracao.
 */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

const pasta = fs.mkdtempSync(path.join(os.tmpdir(), 'reservafacil-'));
process.env.DB_PATH = path.join(pasta, 'teste.db');
const { abrirBanco } = require('../dados/conexao');
const { aplicarEsquema } = require('../dados/esquema');
const app = require('../app');

let servidor;

test.before(() => {
  const banco = abrirBanco();
  try { aplicarEsquema(banco); } finally { banco.close(); }
  servidor = app.listen(0);
});

test.after(async () => {
  await new Promise((resolve, reject) => servidor.close(erro => erro ? reject(erro) : resolve()));
  fs.rmSync(pasta, { recursive: true, force: true });
});

test('GET /api/health responde 200 e confirma o banco', async () => {
  const resposta = await fetch(`http://127.0.0.1:${servidor.address().port}/api/health`);
  assert.equal(resposta.status, 200);
  assert.deepEqual(await resposta.json(), { status: 'ok', banco: 'conectado' });
});

test('API retorna JSON e 404 para rota inexistente', async () => {
  const resposta = await fetch(`http://127.0.0.1:${servidor.address().port}/api/inexistente`);
  assert.equal(resposta.status, 404);
  assert.match(resposta.headers.get('content-type'), /application\/json/);
});

test('Express serve a pagina HTML inicial', async () => {
  const resposta = await fetch(`http://127.0.0.1:${servidor.address().port}/`);
  assert.equal(resposta.status, 200);
  assert.match(await resposta.text(), /ReservaFácil/);
});
