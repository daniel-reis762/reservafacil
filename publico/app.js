/**
 * Camada de interface: consulta o estado da API e atualiza o DOM.
 * Dados externos sao inseridos com textContent para evitar interpretacao de HTML.
 */
const elementoEstado = document.getElementById('estado-api');

/**
 * Busca o estado do servidor e informa o resultado ao usuario.
 * @returns {Promise<void>} Resolucao apos atualizar a mensagem de estado.
 */
async function verificarServidor() {
  elementoEstado.textContent = 'Carregando...';
  try {
    const resposta = await fetch('/api/health');
    if (!resposta.ok) throw new Error('Servidor indisponivel.');
    const dados = await resposta.json();
    // A verificacao de resposta vazia evita mostrar sucesso sem informacao valida.
    elementoEstado.textContent = dados.status === 'ok'
      ? 'Conexão estabelecida. Banco de dados disponível.'
      : 'Nenhuma informação de status foi recebida.';
  } catch (erro) {
    elementoEstado.textContent = 'Não foi possível consultar o servidor.';
  }
}

verificarServidor();
