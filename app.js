/**
 * Camada HTTP: configura o Express, serve os arquivos estaticos e monta as rotas.
 * A responsabilidade por regras de negocio permanece fora deste arquivo.
 */
const path = require('node:path');
const express = require('express');
const helmet = require('helmet');
const rotaHealth = require('./rotas/health');
const { abrirBanco } = require('./dados/conexao');
const { aplicarEsquema } = require('./dados/esquema');
require('dotenv').config({ quiet: true });

const app = express();
app.disable('x-powered-by');
app.use(helmet());
app.use(express.json({ limit: '32kb' }));
app.use(express.static(path.join(__dirname, 'publico')));
app.use('/api/health', rotaHealth);

// APIs desconhecidas devolvem JSON, sem expor detalhes internos.
app.use('/api', (req, res) => {
  res.status(404).json({ erro: 'Rota nao encontrada.' });
});

// Um unico middleware converte falhas inesperadas em respostas HTTP controladas.
app.use((erro, req, res, next) => {
  if (res.headersSent) return next(erro);
  if (erro instanceof SyntaxError && erro.status === 400 && 'body' in erro) {
    return res.status(400).json({ erro: 'JSON invalido.' });
  }
  console.error('Erro inesperado:', erro.message);
  return res.status(500).json({ erro: 'Erro interno do servidor.' });
});

if (require.main === module) {
  const banco = abrirBanco();
  try {
    aplicarEsquema(banco);
  } finally {
    banco.close();
  }

  const porta = Number.parseInt(process.env.PORT || '3000', 10);
  if (!Number.isInteger(porta) || porta < 1 || porta > 65535) {
    throw new Error('PORT deve ser um numero entre 1 e 65535.');
  }
  app.listen(porta, () => {
    process.stdout.write(`ReservaFacil disponivel em http://localhost:${porta}\n`);
  });
}

module.exports = app;
