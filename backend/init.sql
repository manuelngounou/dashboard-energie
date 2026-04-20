-- Script d'initialisation de la base de données
-- Table des consommations énergétiques

CREATE TABLE IF NOT EXISTS consommation (
    id SERIAL PRIMARY KEY,
    date_mesure DATE NOT NULL,
    kwh NUMERIC(10, 2) NOT NULL,
    appareil VARCHAR(255),
    commentaire TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertion de données de test
INSERT INTO consommation (date_mesure, kwh, appareil, commentaire) VALUES
    ('2026-04-15', 12.50, 'Chauffage', 'Jour 1'),
    ('2026-04-16', 15.30, 'Chauffage', 'Jour 2'),
    ('2026-04-17', 10.20, 'Éclairage', 'Jour 3'),
    ('2026-04-18', 18.75, 'Chauffage', 'Jour 4'),
    ('2026-04-19', 14.00, 'Éclairage', 'Jour 5')
ON CONFLICT DO NOTHING;