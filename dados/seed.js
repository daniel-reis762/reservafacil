/**
 * Camada de dados: insere contas e salas exclusivamente para demonstracao local.
 * Senhas de demonstracao sao transformadas em hash bcrypt antes da persistencia.
 */
const bcrypt = require('bcrypt');
const { abrirBanco } = require('./conexao');
const { aplicarEsquema } = require('./esquema');

/**
 * Preenche o banco com dados de demonstracao sem duplicar registros existentes.
 * @param {{admin: string, usuario: string}} [senhas] Senhas de demonstracao nao versionadas.
 * @returns {{usuarios: number, salas: number}} Total atual dos registros basicos.
 * @throws {Error} Se houver falha de restricao ou persistencia.
 */
function popularBanco(banco, senhas = {
  admin: process.env.DEMO_ADMIN_PASSWORD,
  usuario: process.env.DEMO_USUARIO_PASSWORD,
}) {
  if (!senhas.admin || !senhas.usuario || senhas.admin.length < 12 || senhas.usuario.length < 12) {
    throw new Error('Defina DEMO_ADMIN_PASSWORD e DEMO_USUARIO_PASSWORD com ao menos 12 caracteres no .env.');
  }
  const usuarios = [
    { nome: 'Administrador de Teste', email: 'admin@reservafacil.test', senha: senhas.admin, papel: 'administrador' },
    { nome: 'Usuario de Teste', email: 'usuario@reservafacil.test', senha: senhas.usuario, papel: 'usuario' },
  ];
  const salas = [
    { nome: 'Sala de Estudos A', localizacao: 'Biblioteca, terreo', capacidade: 6 },
    { nome: 'Sala de Estudos B', localizacao: 'Biblioteca, terreo', capacidade: 4 },
    { nome: 'Sala de Reunioes', localizacao: 'Bloco Academico, primeiro andar', capacidade: 12 },
  ];

  const inserirUsuario = banco.prepare(`
    INSERT INTO usuarios (nome, email, senha_hash, papel)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(email) DO NOTHING
  `);
  const inserirSala = banco.prepare(`
    INSERT INTO salas (nome, localizacao, capacidade)
    VALUES (?, ?, ?)
    ON CONFLICT(nome) DO NOTHING
  `);

  // A transacao impede que o seed deixe o banco parcialmente preenchido.
  const inserirDados = banco.transaction(() => {
    for (const usuario of usuarios) {
      const existente = banco.prepare('SELECT 1 FROM usuarios WHERE email = ?').get(usuario.email);
      if (!existente) {
        inserirUsuario.run(usuario.nome, usuario.email, bcrypt.hashSync(usuario.senha, 12), usuario.papel);
      }
    }
    for (const sala of salas) {
      inserirSala.run(sala.nome, sala.localizacao, sala.capacidade);
    }
  });
  inserirDados();

  return {
    usuarios: banco.prepare('SELECT COUNT(*) AS total FROM usuarios').get().total,
    salas: banco.prepare('SELECT COUNT(*) AS total FROM salas').get().total,
  };
}

if (require.main === module) {
  const banco = abrirBanco();
  try {
    aplicarEsquema(banco);
    const total = popularBanco(banco);
    process.stdout.write(`Seed aplicado: ${total.usuarios} usuarios e ${total.salas} salas.\n`);
  } finally {
    banco.close();
  }
}

module.exports = { popularBanco };
