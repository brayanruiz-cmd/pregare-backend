-- ============================================================================
-- PREGARE APP — Database Schema Initialization
-- Compatible with MySQL 8.0+ / MySQL 9.x / MariaDB
-- ============================================================================

CREATE DATABASE IF NOT EXISTS pregare CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE pregare;

-- Desactivar temporalmente foreign keys para recreación segura si se requiere
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------------------------------------------------------
-- 1. Dominio: Usuarios y Autenticación
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS notification_logs;
DROP TABLE IF EXISTS streak_activity_logs;
DROP TABLE IF EXISTS streaks;
DROP TABLE IF EXISTS user_highlights;
DROP TABLE IF EXISTS user_reading_progress;
DROP TABLE IF EXISTS user_saved_topics;
DROP TABLE IF EXISTS topic_practices;
DROP TABLE IF EXISTS topics;
DROP TABLE IF EXISTS user_completed_devotionals;
DROP TABLE IF EXISTS devotionals;
DROP TABLE IF EXISTS user_saved_declarations;
DROP TABLE IF EXISTS declaration_topics;
DROP TABLE IF EXISTS declarations;
DROP TABLE IF EXISTS user_preferences;
DROP TABLE IF EXISTS refresh_tokens;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NULL,
  provider ENUM('email', 'google') DEFAULT 'email',
  google_id VARCHAR(255) NULL,
  gender ENUM('mujeres', 'hombres') DEFAULT 'mujeres',
  fcm_token TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_users_email (email),
  INDEX idx_users_google_id (google_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE refresh_tokens (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  token_hash VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_refresh_tokens_user (user_id),
  INDEX idx_refresh_tokens_hash (token_hash)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE user_preferences (
  user_id VARCHAR(36) PRIMARY KEY,
  written_for ENUM('mujeres', 'hombres') DEFAULT 'mujeres',
  selected_topics JSON NULL,
  preferred_translation VARCHAR(20) DEFAULT 'NIV',
  text_size ENUM('small', 'medium', 'large') DEFAULT 'medium',
  morning_notification_enabled BOOLEAN DEFAULT TRUE,
  notification_time TIME DEFAULT '06:15:00',
  timezone VARCHAR(100) DEFAULT 'America/Bogota',
  weekly_summary_enabled BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 2. Dominio: Declaraciones de Fe
-- ----------------------------------------------------------------------------
CREATE TABLE declarations (
  id VARCHAR(36) PRIMARY KEY,
  scripture_text TEXT NOT NULL,
  scripture_reference VARCHAR(100) NOT NULL,
  declaration_text TEXT NOT NULL,
  topic VARCHAR(50) NOT NULL,
  gender ENUM('mujeres', 'hombres', 'todos') NOT NULL DEFAULT 'todos',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_declarations_gender_topic (gender, topic)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE declaration_topics (
  declaration_id VARCHAR(36) NOT NULL,
  topic_slug VARCHAR(50) NOT NULL,
  PRIMARY KEY (declaration_id, topic_slug),
  FOREIGN KEY (declaration_id) REFERENCES declarations(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE user_saved_declarations (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  declaration_id VARCHAR(36) NOT NULL,
  saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE KEY uq_user_declaration (user_id, declaration_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (declaration_id) REFERENCES declarations(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 3. Dominio: Devocionales
-- ----------------------------------------------------------------------------
CREATE TABLE devotionals (
  id VARCHAR(36) PRIMARY KEY,
  day_number INT NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  duration_minutes INT DEFAULT 2,
  verse_text TEXT NOT NULL,
  verse_reference VARCHAR(100) NOT NULL,
  reflection_text TEXT NOT NULL,
  prayer_text TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE user_completed_devotionals (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  devotional_id VARCHAR(36) NOT NULL,
  completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_user_completed_dev (user_id, devotional_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (devotional_id) REFERENCES devotionals(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 4. Dominio: Explore & Temas de Apoyo
-- ----------------------------------------------------------------------------
CREATE TABLE topics (
  id VARCHAR(36) PRIMARY KEY,
  sort_order INT DEFAULT 0,
  tag VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  subtitle VARCHAR(255) NULL,
  description TEXT NOT NULL,
  scripture_quote TEXT NULL,
  scripture_reference VARCHAR(100) NULL,
  video_duration_minutes INT DEFAULT 8,
  youtube_query VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE topic_practices (
  id VARCHAR(36) PRIMARY KEY,
  topic_id VARCHAR(36) NOT NULL,
  step_number INT NOT NULL,
  instruction_text TEXT NOT NULL,
  
  FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE user_saved_topics (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  topic_id VARCHAR(36) NOT NULL,
  saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE KEY uq_user_topic (user_id, topic_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 5. Dominio: Lectura Bíblica y Marcadores
-- ----------------------------------------------------------------------------
CREATE TABLE user_reading_progress (
  user_id VARCHAR(36) NOT NULL,
  book_id VARCHAR(50) NOT NULL,
  last_chapter INT NOT NULL DEFAULT 1,
  last_verse INT NOT NULL DEFAULT 1,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  PRIMARY KEY (user_id, book_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE user_highlights (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  book_id VARCHAR(50) NOT NULL,
  chapter INT NOT NULL,
  verse_number INT NOT NULL,
  verse_text TEXT NOT NULL,
  version VARCHAR(20) DEFAULT 'NIV',
  color_hex VARCHAR(10) DEFAULT '#F7EBD2',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_user_highlights (user_id, book_id, chapter),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE verse_collections (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  title VARCHAR(100) NOT NULL,
  description VARCHAR(255) NULL,
  color_hex VARCHAR(10) DEFAULT '#B58D3D',
  is_private BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_verse_collections_user (user_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE verse_collection_items (
  id VARCHAR(36) PRIMARY KEY,
  collection_id VARCHAR(36) NOT NULL,
  user_id VARCHAR(36) NOT NULL,
  book_id VARCHAR(50) NOT NULL,
  book_name VARCHAR(100) NOT NULL DEFAULT '',
  chapter INT NOT NULL,
  verse_number INT NOT NULL,
  verse_text TEXT NOT NULL,
  version VARCHAR(20) DEFAULT 'RVR1960',
  color_hex VARCHAR(10) DEFAULT '#F7EBD2',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_collection_items_col (collection_id),
  INDEX idx_collection_items_user (user_id),
  INDEX idx_collection_items_verse (user_id, book_id, chapter, verse_number),
  FOREIGN KEY (collection_id) REFERENCES verse_collections(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 6. Dominio: Gamificación (Rachas) & Notificaciones
-- ----------------------------------------------------------------------------
CREATE TABLE streaks (
  user_id VARCHAR(36) PRIMARY KEY,
  current_streak_days INT DEFAULT 0,
  longest_streak INT DEFAULT 0,
  total_days_active INT DEFAULT 0,
  last_check_in_date DATE NULL,
  declarations_spoken_count INT DEFAULT 0,
  chapters_read_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE streak_activity_logs (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  activity_date DATE NOT NULL,
  declarations_read INT DEFAULT 0,
  chapters_read INT DEFAULT 0,
  devotional_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE KEY uq_user_activity_date (user_id, activity_date),
  INDEX idx_activity_user_month (user_id, activity_date),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE notification_logs (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  title VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  opened BOOLEAN DEFAULT FALSE,
  opened_at TIMESTAMP NULL,
  
  INDEX idx_notif_user_date (user_id, sent_at),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================================
-- Datos Iniciales de Ejemplo (Seed Data)
-- ============================================================================

-- Declaraciones iniciales
INSERT INTO declarations (id, scripture_text, scripture_reference, declaration_text, topic, gender) VALUES
('decl-1', '“Todo lo puedo en Cristo que me fortalece.”', 'Filipenses 4:13', 'Camino con fuerza y confianza hoy. Cristo empodera cada paso que doy.', 'Fortaleza', 'todos'),
('decl-2', '“El Señor es mi pastor; nada me faltará.”', 'Salmos 23:1', 'Estoy completamente provisto. En la presencia de Dios no me falta ningún bien.', 'Provisión', 'todos'),
('decl-3', '“Y la paz de Dios, que sobrepasa todo entendimiento, guardará vuestros corazones y vuestros pensamientos en Cristo Jesús.”', 'Filipenses 4:7', 'La paz guarda mi corazón y mi mente. Lo que no puedo controlar, lo pongo en manos de Dios.', 'Paz', 'todos'),
('decl-4', '“Porque no nos ha dado Dios espíritu de cobardía, sino de poder, de amor y de dominio propio.”', '2 Timoteo 1:7', 'El miedo no tiene voz en mis decisiones. Soy guiado por el amor, el poder y la claridad.', 'Valentía', 'todos');

-- Devocionales iniciales
INSERT INTO devotionals (id, day_number, title, duration_minutes, verse_text, verse_reference, reflection_text, prayer_text) VALUES
('dev-1', 1, 'Finding Peace in Uncertainty', 2, '“Y la paz de Dios, que sobrepasa todo entendimiento, guardará vuestros corazones y vuestros pensamientos en Cristo Jesús.”', 'Filipenses 4:7', 'Pablo escribió esto desde la prisión, no desde la comodidad. No promete que la situación se resolverá de inmediato, sino que promete una paz que llega antes que la respuesta. Esa es una firmeza diferente: no la ausencia de incertidumbre, sino una guardia colocada alrededor de tus pensamientos mientras dura la espera.', 'Padre, hoy no tengo todas las respuestas y te pido paz de todos modos. Guarda mi mente mientras confío y espero en ti. Amén.'),
('dev-2', 2, 'The Cost of Carrying It Alone', 2, '“Echa sobre el Señor tu carga, y él te sustentará.”', 'Salmos 55:22', 'A menudo cargamos con pesos que nunca fueron diseñados para que los lleváramos solos.', 'Señor, hoy te entrego mis cargas y decido descansar en tu sustento.'),
('dev-3', 3, 'What Obedience Looks Like on a Tuesday', 3, '“El que es fiel en lo muy poco, también en lo más es fiel.”', 'Lucas 16:10', 'La fidelidad no siempre se mide en grandes victorias públicas, sino en las decisiones silenciosas de cada día ordinario.', 'Señor, ayúdame a ser fiel en los pequeños detalles de hoy.');

-- Temas iniciales
INSERT INTO topics (id, sort_order, tag, title, subtitle, description, scripture_quote, scripture_reference, video_duration_minutes, youtube_query) VALUES
('top-1', 1, 'Ansiedad', 'When your mind will not settle', 'Three practices for the days your mind will not settle · 8 min video', 'La ansiedad rara vez se anuncia; llega como una mente llena, poca paciencia o una noche sin dormir. La Escritura no te pide fingir que no existe, te invita a entregarla.', '“Echando toda vuestra ansiedad sobre él, porque él tiene cuidado de vosotros.”', '1 Pedro 5:7', 8, 'Pregare ansiedad paz confianza'),
('top-2', 2, 'Propósito', 'Walking in Clarity and Faith', 'Discovering God\'s direction for your daily walk', 'El propósito no es un destino lejano, es la fidelidad con la que caminas hoy.', '“Porque yo sé los pensamientos que tengo acerca de vosotros, dice el Señor...”', 'Jeremías 29:11', 6, 'Pregare proposito direccion dios');

-- Pasos prácticos para el tema 1
INSERT INTO topic_practices (id, topic_id, step_number, instruction_text) VALUES
('tp-1', 'top-1', 1, 'Nombra lo que sientes en voz alta antes de buscar una solución humana.'),
('tp-2', 'top-1', 2, 'Escribe una sola frase de lo que estás entregando a Dios hoy.'),
('tp-3', 'top-1', 3, 'Declara Filipenses 4:7 cada mañana durante siete días consecutivos.');
