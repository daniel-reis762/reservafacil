/**
 * Camada HTTP: disponibiliza a rota publica de verificacao do servidor.
 * Erros sao encaminhados ao tratamento centralizado da aplicacao.
 */
const { Router } = require('express');
const { consultarSaude } = require('../servicos/health');
const router = Router();

router.get('/', (req, res, next) => {
  try {
    res.status(200).json(consultarSaude());
  } catch (erro) {
    next(erro);
  }
});

module.exports = router;
