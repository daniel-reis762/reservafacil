-- Camada de dados: definicao do esquema relacional do ReservaFacil.
-- As restricoes SQL defendem regras fundamentais mesmo em requisicoes concorrentes.

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS usuarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL CHECK (length(trim(nome)) BETWEEN 2 AND 120),
  email TEXT NOT NULL COLLATE NOCASE UNIQUE,
  senha_hash TEXT NOT NULL CHECK (length(senha_hash) >= 50),
  papel TEXT NOT NULL DEFAULT 'usuario'
    CHECK (papel IN ('usuario', 'administrador')),
  criado_em TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS salas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL UNIQUE CHECK (length(trim(nome)) BETWEEN 2 AND 120),
  localizacao TEXT NOT NULL CHECK (length(trim(localizacao)) BETWEEN 2 AND 120),
  capacidade INTEGER NOT NULL CHECK (capacidade BETWEEN 1 AND 300),
  ativa INTEGER NOT NULL DEFAULT 1 CHECK (ativa IN (0, 1)),
  criado_em TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS reservas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  usuario_id INTEGER NOT NULL,
  sala_id INTEGER NOT NULL,
  data_reserva TEXT NOT NULL
    CHECK (data_reserva GLOB '[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]'),
  hora_inicio INTEGER NOT NULL CHECK (hora_inicio BETWEEN 8 AND 19),
  status TEXT NOT NULL DEFAULT 'confirmada'
    CHECK (status IN ('confirmada', 'cancelada')),
  criada_em TEXT NOT NULL DEFAULT (datetime('now')),
  cancelada_em TEXT,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE RESTRICT,
  FOREIGN KEY (sala_id) REFERENCES salas(id) ON DELETE RESTRICT,
  CHECK (status = 'confirmada' OR cancelada_em IS NOT NULL)
);

-- RN01: apenas uma reserva confirmada por sala, dia e horario.
-- O indice parcial libera o horario quando a reserva e cancelada.
CREATE UNIQUE INDEX IF NOT EXISTS uq_reserva_confirmada_por_horario
  ON reservas (sala_id, data_reserva, hora_inicio)
  WHERE status = 'confirmada';

CREATE INDEX IF NOT EXISTS idx_reservas_usuario
  ON reservas (usuario_id, data_reserva);

CREATE INDEX IF NOT EXISTS idx_reservas_sala_data
  ON reservas (sala_id, data_reserva);
