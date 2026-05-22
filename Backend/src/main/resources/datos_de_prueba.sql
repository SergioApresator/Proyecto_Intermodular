-- =====================================================================
-- RATE MY GAME - DATOS DE PRUEBA Y DEMOSTRACIÓN (SEMILLA SQL)
-- =====================================================================

SET NAMES 'utf8mb4';
SET CHARACTER SET utf8mb4;

SET FOREIGN_KEY_CHECKS = 0;

DELETE FROM respuesta_voto;
DELETE FROM resena_voto;
DELETE FROM respuesta;
DELETE FROM resena;
DELETE FROM lista;
DELETE FROM usuario;
DELETE FROM videojuego_plataforma;
DELETE FROM videojuego_tag;
DELETE FROM videojuego_genero;
DELETE FROM plataforma;
DELETE FROM tag;
DELETE FROM genero;
DELETE FROM screenshot;
DELETE FROM videojuego;

ALTER TABLE respuesta_voto AUTO_INCREMENT = 1;
ALTER TABLE resena_voto AUTO_INCREMENT = 1;
ALTER TABLE respuesta AUTO_INCREMENT = 1;
ALTER TABLE resena AUTO_INCREMENT = 1;
ALTER TABLE lista AUTO_INCREMENT = 1;
ALTER TABLE usuario AUTO_INCREMENT = 1;
ALTER TABLE plataforma AUTO_INCREMENT = 1;
ALTER TABLE tag AUTO_INCREMENT = 1;
ALTER TABLE genero AUTO_INCREMENT = 1;
ALTER TABLE screenshot AUTO_INCREMENT = 1;

SET FOREIGN_KEY_CHECKS = 1;

-- =====================================================================
-- 0. TABLA: videojuego (Juegos mockeados para evitar errores de FK)
-- =====================================================================
INSERT INTO videojuego (ID, NAME, RATING, METACRITIC, RELEASED, BACKGROUND_IMAGE, added_count, description) VALUES
(3328, 'The Witcher 3: Wild Hunt', 4.66, 92, '2026-02-10', 'https://media.rawg.io/media/games/618/618c2031a07bbff6b4e611f10db53968.jpg', 15000, 
'The Witcher 3: Wild Hunt es un juego de rol de mundo abierto ambientado en un universo fantástico visualmente impresionante, lleno de decisiones importantes y consecuencias impactantes. En The Witcher, juegas como Geralt de Rivia, un cazador de monstruos profesional que busca a la niña de la profecía en un vasto mundo abierto rico en ciudades comerciales, islas piratas, peligrosos pasos de montaña y cuevas olvidadas por explorar.'),

(5679, 'The Elder Scrolls V: Skyrim', 4.42, 94, '2026-11-11', 'https://media.rawg.io/media/games/7a2/7a211ae4e93d9ef961e6af72d4cf60c8.jpg', 12000, 
'The Elder Scrolls V: Skyrim revoluciona la fantasía épica en mundos abiertos. Skyrim recrea un mundo virtual completo listo para ser explorado de la forma que tú elijas. Juega con cualquier tipo de personaje que puedas imaginar and haz lo que quieras; la legendaria libertad de elección, narración y aventura de The Elder Scrolls cobra vida como nunca antes.'),

(326243, 'Elden Ring', 4.58, 96, '2026-03-15', 'https://media.rawg.io/media/games/b29/b294fdd866dcdb643e7bab370a552855.jpg', 14500, 
'ELDEN RING es un juego de rol y acción de fantasía desarrollado por FromSoftware Inc. y producido por Bandai Namco Entertainment Inc. Ambientado en un mundo lleno de misterios y peligros, surge la nueva gran epopeya de fantasía creada por Hidetaka Miyazaki y George R. R. Martin. Explora las Tierras Intermedias, desvela los misterios del poder del Círculo de Elden y conviértete en el Señor de Elden.'),

(41494, 'Cyberpunk 2077', 4.15, 86, '2026-05-01', 'https://media.rawg.io/media/games/26d/26d4437715bee6013b1c7c99021e5312.jpg', 11000, 
'Cyberpunk 2077 es un RPG de acción y aventura en mundo abierto ambientado en la megalópolis de Night City, donde encarnas a V, un mercenario cyberpunk que busca un implante único que permite alcanzar la inmortalidad. Personaliza las mejoras cibernéticas de tu personaje, su estilo de juego y explora una ciudad colosal donde tus decisiones dan forma a la historia.'),

(22509, 'Minecraft', 4.43, 83, '2011-11-18', 'https://media.rawg.io/media/games/b4e/b4e4c73d5aa4ec66bbf75375c4847a2b.jpg', 20000, 
'Minecraft es un juego sobre colocar bloques y salir de aventuras. Explora mundos generados aleatoriamente y construye cosas increíbles, desde la más simple de las casas hasta el más grandioso de los castillos. Juega en modo creativo con recursos ilimitados o adéntrate en el mundo en el modo supervivencia, fabricando armas y armaduras para defenderte de peligrosas criaturas.'),

(22511, 'The Legend of Zelda: Breath of the Wild', 4.6, 97, '2017-03-03', 'https://media.rawg.io/media/games/cc1/cc19f15bdad2a39d89201af334fa25d3.jpg', 18000, 
'Entra en un mundo de descubrimientos, exploración y aventura en The Legend of Zelda: Breath of the Wild, un nuevo juego de la aclamada saga que rompe barreras. Viaja por praderas, bosques y cumbres montañosas mientras descubres qué ha sido del reino en ruinas de Hyrule en esta increíble aventura al aire libre.'),

(9767, 'Hollow Knight', 4.4, 90, '2026-03-25', 'https://media.rawg.io/media/games/4cf/4cfc743cfc84e5b44450dc506716cf00.jpg', 13000, 
'Hollow Knight es una aventura de acción clásica en 2D ambientada en un vasto mundo interconectado. Explora cavernas serpenteantes, ciudades antiguas y páramos mortales; lucha contra criaturas corruptas y entabla amistad con extraños bichos; y resuelve los antiguos misterios ocultos en el corazón del reino abandonado bajo tierra.'),

(58175, 'God of War', 4.59, 94, '2026-12-05', 'https://media.rawg.io/media/games/4be/4be6a6ad0364751a96229c56bf69be59.jpg', 14000, 
'Tras vengar la muerte de los dioses olímpicos, Kratos vive ahora en el reino de las deidades y monstruos nórdicos. En este mundo hostil y despiadado, debe luchar para sobrevivir y enseñar a su hijo Atreus a hacer lo mismo. Esta nueva versión de God of War deconstruye los elementos definitorios de la serie para ofrecer una aventura narrativa íntima y visualmente espectacular.'),

(4200, 'Portal 2', 4.61, 95, '2011-04-18', 'https://media.rawg.io/media/games/328/3283c77c5de214eb02fce6b37ea0c465.jpg', 16000, 
'Portal 2 introduce un elenco de nuevos personajes dinámicos, elementos de rompecabezas frescos y un conjunto mucho mayor de cámaras de prueba retorcidas. Los jugadores explorarán áreas nunca antes vistas de los Laboratorios Aperture Science y se reunirán con GLaDOS, la compañera informática mortalmente inventiva de la primera entrega.'),

(324997, "Baldur's Gate III", 4.8, 96, '2026-04-20', 'https://media.rawg.io/media/games/699/69907ecf13f172e9e144069769c3be73.jpg', 17000, 
'Reúne a tu grupo y regresa a los Reinos Olvidados en una historia de compañerismo y traición, sacrificio y supervivencia, y la tentación del poder absoluto. Misteriosas habilidades despiertan dentro de ti, extraídas de un parásito de azotamentes implantado en tu cerebro. Elige entre una amplia variedad de razas y clases, y escribe tu propio destino en Baldur''s Gate 3.'),

(274755, 'Hades', 4.4, 93, '2026-09-17', 'https://media.rawg.io/media/games/1f4/1f47a270b8f241e4676b14d39ec620f7.jpg', 12500, 
'Hades es un juego de exploración de mazmorras rogue-like que combina los mejores aspectos de los aclamados títulos de Supergiant, incluida la acción trepidante de Bastion, la atmósfera densa de Transistor y la narración centrada en personajes de Pyre. Desafía al dios de los muertos mientras te abres camino a espadazos para escapar del Inframundo.'),

(327239, 'The Legend of Zelda: Tears of the Kingdom', 4.6, 96, '2026-08-10', 'https://media.rawg.io/media/games/556/55684bfd048706f4266d331d70050b37.jpg', 15000, 
'Una aventura épica a través de la tierra y los cielos de Hyrule te espera en The Legend of Zelda: Tears of the Kingdom. Decide tu propio camino a través del inmenso y cambiante paisaje de Hyrule y las misteriosas islas flotantes. Domina las nuevas habilidades de Link para luchar contra las fuerzas oscuras que amenazan el reino.'),

(28, 'Red Dead Redemption 2', 4.5, 97, '2026-01-15', 'https://media.rawg.io/media/games/511/5118aff5091cb3efec399c808f8c598f.jpg', 16000, 
'América, 1899. El ocaso del Salvaje Oeste ha comenzado. Tras un atraco fallido en Blackwater, Arthur Morgan y la banda de Van der Linde se ven obligados a huir. Con agentes federales y cazarrecompensas pisándoles los talones, la banda debe atracar, robar y luchar para sobrevivir en el escarpado territorio de Red Dead Redemption 2.'),

(3498, 'Grand Theft Auto V', 4.47, 97, '2013-09-17', 'https://media.rawg.io/media/games/20a/20a7aeabd6e90e1f964de0681329fb34.jpg', 25000, 
'Cuando un joven estafador callejero, un ladrón de bancos retirado y un psicópata aterrador se ven involucrados con lo peor del submundo criminal, el gobierno de EE. UU. y la industria del entretenimiento, deben llevar a cabo una serie de peligrosos golpes para sobrevivir en una ciudad despiadada en la que no pueden confiar en nadie, y mucho menos los unos en los otros en GTA V.'),

(22121, 'Celeste', 4.3, 88, '2026-04-05', 'https://media.rawg.io/media/games/594/59487800889ebac294c7c2c070d02356.jpg', 11000, 
'Ayuda a Madeline a sobrevivir a sus demonios internos en su viaje a la cima de la montaña Celeste, en este plataformas ultrapreciso de los creadores del clásico multijugador TowerFall. Una conmovedora historia de superación personal y salud mental acompañada de un apartado artístico sublime y una banda sonora inolvidable en Celeste.'),

(5538, 'Dark Souls', 4.4, 89, '2011-09-22', 'https://media.rawg.io/media/games/582/582b5518a52f5086d15dde128264b94d.jpg', 12000, 
'Dark Souls es el nuevo juego de rol de acción de los creadores de Demon''s Souls. Prepárate para descubrir un universo oscuro y desolado con un diseño de niveles interconectado asombroso. Lucha con precisión quirúrgica, aprende de tus errores y supera desafíos insuperables para revivir la llama del mundo de Lordran.'),

(654, 'Stardew Valley', 4.3, 89, '2016-02-26', 'https://media.rawg.io/media/games/713/713269608dc8f2f40f5a670a14b2de94.jpg', 14000, 
'Heredaste la vieja parcela agrícola de tu abuelo en Stardew Valley. Armado con herramientas heredadas y unas pocas monedas, te dispones a comenzar tu nueva vida. ¿Podrás aprender a vivir de la tierra y convertir estos campos de maleza en un hogar próspero? Únete a la comunidad local y crea tu propia historia de tranquilidad.');

-- INSERTS DE GENEROS, TAGS Y PLATAFORMAS
INSERT INTO genero (ID, NAME, SLUG) VALUES
(1, 'Action', 'action'),
(2, 'Adventure', 'adventure'),
(3, 'RPG', 'role-playing-games-rpg'),
(4, 'Shooter', 'shooter'),
(5, 'Puzzle', 'puzzle'),
(6, 'Indie', 'indie'),
(7, 'Platformer', 'platformer'),
(8, 'Sports', 'sports'),
(9, 'Racing', 'racing');

INSERT INTO plataforma (ID, NAME, SLUG) VALUES
(1, 'PC', 'pc'),
(2, 'PlayStation', 'playstation'),
(3, 'Xbox', 'xbox'),
(4, 'Nintendo', 'nintendo');

INSERT INTO tag (ID, NAME, SLUG) VALUES
(1, 'Singleplayer', 'singleplayer'),
(2, 'Multiplayer', 'multiplayer'),
(3, 'Open World', 'open-world'),
(4, 'Sci-fi', 'sci-fi'),
(5, 'Fantasy', 'fantasy'),
(6, 'Horror', 'horror'),
(7, 'Story Rich', 'story-rich'),
(8, 'Atmospheric', 'atmospheric'),
(9, 'Exploration', 'exploration'),
(10, 'Dark Fantasy', 'dark-fantasy');

-- RELACIONES
INSERT INTO videojuego_genero (videojuego_id, genero_id) VALUES
(3328, 3), (3328, 1),
(5679, 3), (5679, 1),
(326243, 3), (326243, 1),
(41494, 3), (41494, 4),
(22509, 6), (22509, 2),
(22511, 1), (22511, 2),
(9767, 6), (9767, 1), (9767, 7),
(58175, 1), (58175, 2),
(4200, 5), (4200, 7),
(324997, 3),
(274755, 6), (274755, 1),
(327239, 1), (327239, 2),
(28, 1), (28, 2),
(3498, 1), (3498, 2), (3498, 4),
(22121, 6), (22121, 7),
(5538, 3), (5538, 1),
(654, 6), (654, 3);

INSERT INTO videojuego_plataforma (videojuego_id, plataforma_id) VALUES
(3328, 1), (3328, 2), (3328, 3), (3328, 4),
(5679, 1), (5679, 2), (5679, 3), (5679, 4),
(326243, 1), (326243, 2), (326243, 3),
(41494, 1), (41494, 2), (41494, 3),
(22509, 1), (22509, 2), (22509, 3), (22509, 4),
(22511, 4),
(9767, 1), (9767, 2), (9767, 3), (9767, 4),
(58175, 1), (58175, 2),
(4200, 1), (4200, 2), (4200, 3),
(324997, 1), (324997, 2), (324997, 3),
(274755, 1), (274755, 2), (274755, 3), (274755, 4),
(327239, 4),
(28, 1), (28, 2), (28, 3),
(3498, 1), (3498, 2), (3498, 3),
(22121, 1), (22121, 2), (22121, 3), (22121, 4),
(5538, 1), (5538, 2), (5538, 3), (5538, 4),
(654, 1), (654, 2), (654, 3), (654, 4);

INSERT INTO videojuego_tag (videojuego_id, tag_id) VALUES
(3328, 1), (3328, 3), (3328, 5), (3328, 7),
(5679, 1), (5679, 3), (5679, 5),
(326243, 1), (326243, 2), (326243, 3), (326243, 10),
(41494, 1), (41494, 3), (41494, 4), (41494, 7),
(22509, 1), (22509, 2), (22509, 3), (22509, 9),
(22511, 1), (22511, 3), (22511, 5), (22511, 9),
(9767, 1), (9767, 8), (9767, 9), (9767, 10),
(58175, 1), (58175, 5), (58175, 7),
(4200, 1), (4200, 2), (4200, 4), (4200, 7),
(324997, 1), (324997, 2), (324997, 5), (324997, 7),
(274755, 1), (274755, 5), (274755, 7),
(327239, 1), (327239, 3), (327239, 5), (327239, 9),
(28, 1), (28, 2), (28, 3), (28, 7),
(3498, 1), (3498, 2), (3498, 3),
(22121, 1), (22121, 7),
(5538, 1), (5538, 2), (5538, 10), (5538, 8),
(654, 1), (654, 2);

-- =====================================================================
-- 1. TABLA: usuario
-- =====================================================================
INSERT INTO usuario (ID, NOMBRE, APELLIDOS, USERNAME, EMAIL, PASSWORD, FOTO_URL, BANNER_URL, BIOGRAFIA, ES_ADMIN, BANEADO) VALUES
(1, 'Administrador', 'RateMyGame', 'admin', 'admin@ratemygame.com', '$2a$10$KxbLh77T7rxHFKHtG6rHpey50Qg6JL.3fAxSwb2hNMlwVtHQv4xaK', NULL, NULL, 'Administrador principal de la comunidad RateMyGame. Si tienes algún problema con las normas de la comunidad o encuentras spoilers sin marcar, no dudes en contactarme.', 1, 0),
(2, 'Alejandro', 'García', 'gamer_pro', 'alex.garcia@gaming.com', '$2a$10$KxbLh77T7rxHFKHtG6rHpey50Qg6JL.3fAxSwb2hNMlwVtHQv4xaK', 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><rect width="10" height="10" fill="%23b3e5fc"/><circle cx="5" cy="3" r="2" fill="%239e9e9e"/><path d="M2,9C2,7 3,5 5,5S8,7 8,9Z" fill="%239e9e9e"/></svg>', 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&h=200&q=80', 'Jugando y completando RPGs desde 1998. Mi saga favorita de todos los tiempos es The Witcher. Me encanta debatir sobre diseño de niveles y narración interactiva. ¡Sígueme para análisis profundos!', 0, 0),
(3, 'María', 'López', 'casual_mary', 'maria.lopez@casual.com', '$2a$10$KxbLh77T7rxHFKHtG6rHpey50Qg6JL.3fAxSwb2hNMlwVtHQv4xaK', 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><rect width="10" height="10" fill="%23f8bbd0"/><circle cx="5" cy="3" r="2" fill="%239e9e9e"/><path d="M2,9C2,7 3,5 5,5S8,7 8,9Z" fill="%239e9e9e"/></svg>', NULL, 'Jugadora casual de corazón. Adoro los juegos acogedores (cozy games), la saga Animal Crossing, Stardew Valley y casi cualquier cosa que publique Nintendo. ¡La vida ya es muy estresante para jugar estresada!', 0, 0),
(4, 'Carlos', 'Martínez', 'rpg_enjoyer', 'carlos.rpg@retro.com', '$2a$10$KxbLh77T7rxHFKHtG6rHpey50Qg6JL.3fAxSwb2hNMlwVtHQv4xaK', NULL, 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&h=200&q=80', 'Purista de los JRPG de la vieja escuela. Final Fantasy VI, Chrono Trigger y Xenogears son el pico artístico de la industria de los videojuegos. El 3D no siempre mejoró el diseño de juegos.', 0, 0),
(5, 'Elena', 'Sanz', 'cyber_punk', 'elena.cyber@neon.com', '$2a$10$KxbLh77T7rxHFKHtG6rHpey50Qg6JL.3fAxSwb2hNMlwVtHQv4xaK', 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><rect width="10" height="10" fill="%23e1bee7"/><circle cx="5" cy="3" r="2" fill="%239e9e9e"/><path d="M2,9C2,7 3,5 5,5S8,7 8,9Z" fill="%239e9e9e"/></svg>', 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=800&h=200&q=80', 'Viviendo en una distopía de luces de neón. Apasionada de la ciencia ficción dura, el Cyberpunk y las conspiraciones corporativas virtuales. Fan de Deus Ex, Cyberpunk 2077 y System Shock.', 0, 0),
(6, 'Daniel', 'Ruiz', 'speedrunner', 'dani.runner@fast.com', '$2a$10$KxbLh77T7rxHFKHtG6rHpey50Qg6JL.3fAxSwb2hNMlwVtHQv4xaK', 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><rect width="10" height="10" fill="%23c8e6c9"/><circle cx="5" cy="3" r="2" fill="%239e9e9e"/><path d="M2,9C2,7 3,5 5,5S8,7 8,9Z" fill="%239e9e9e"/></svg>', NULL, 'Buscando optimizar cada frame. Amante de los juegos de plataformas de precisión, metroidvanias y el speedrunning competitivo. Si un juego no tiene mecánicas de movimiento avanzadas, no me interesa.', 0, 0),
(7, 'Lucas', 'Fernández', 'indie_guy', 'lucas.indie@indie.com', '$2a$10$KxbLh77T7rxHFKHtG6rHpey50Qg6JL.3fAxSwb2hNMlwVtHQv4xaK', NULL, NULL, 'El sector AAA ha muerto comercialmente y en originalidad. Solo juego producciones de estudios independientes que arriesguen en su arte. Outer Wilds, Hollow Knight y Disco Elysium son el verdadero arte.', 0, 0),
(8, 'Sofía', 'Gómez', 'soulslike_fan', 'sofia.souls@lothric.com', '$2a$10$KxbLh77T7rxHFKHtG6rHpey50Qg6JL.3fAxSwb2hNMlwVtHQv4xaK', 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><rect width="10" height="10" fill="%23ffe0b2"/><circle cx="5" cy="3" r="2" fill="%239e9e9e"/><path d="M2,9C2,7 3,5 5,5S8,7 8,9Z" fill="%239e9e9e"/></svg>', 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&h=200&q=80', '\"Git Gud\". Pasándome juegos de FromSoftware sin recibir golpes. Elden Ring, Bloodborne y Dark Souls son mis templos personales. Si te cuesta derrotar a Malenia, escríbeme y te echo una mano.', 0, 0),
(9, 'Marcos', 'Ortega', 'pixel_art', 'marcos.pixel@retro.com', '$2a$10$KxbLh77T7rxHFKHtG6rHpey50Qg6JL.3fAxSwb2hNMlwVtHQv4xaK', 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><rect width="10" height="10" fill="%23fff9c4"/><circle cx="5" cy="3" r="2" fill="%239e9e9e"/><path d="M2,9C2,7 3,5 5,5S8,7 8,9Z" fill="%239e9e9e"/></svg>', NULL, 'Coleccionista de hardware retro. Si un videojuego tiene píxeles hermosos hechos a mano y banda sonora con sintetizadores chiptune de 8 o 16 bits, ya tiene mi corazón ganado.', 0, 0),
(10, 'Clara', 'Benítez', 'lara_croft', 'clara.lara@adventure.com', '$2a$10$KxbLh77T7rxHFKHtG6rHpey50Qg6JL.3fAxSwb2hNMlwVtHQv4xaK', 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><rect width="10" height="10" fill="%23d7ccc8"/><circle cx="5" cy="3" r="2" fill="%239e9e9e"/><path d="M2,9C2,7 3,5 5,5S8,7 8,9Z" fill="%239e9e9e"/></svg>', 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&h=200&q=80', 'Buscadora de tesoros arqueológicos y aventuras extremas. Me encantan los juegos de acción y aventura en tercera persona con exploración e historias intrigantes. Tomb Raider, Uncharted e Horizon.', 0, 0);

-- =====================================================================
-- 2. TABLA: lista (Colecciones de juegos de los usuarios)
-- =====================================================================
INSERT INTO lista (ID, NOMBRE, ID_USUARIO, ID_VIDEOJUEGO) VALUES
(1, 'Favoritos de Siempre', 2, 3328),
(2, 'Favoritos de Siempre', 2, 5679),
(3, 'Favoritos de Siempre', 2, 326243),
(4, 'Pendientes de Jugar', 2, 41494),
(5, 'Juegos Relax', 3, 22509),
(6, 'Juegos Relax', 3, 22511),
(7, 'Pendientes', 3, 9767),
(8, 'Verdaderos RPGs', 4, 3328),
(9, 'Verdaderos RPGs', 4, 58175),
(10, 'Speedrun Practicando', 6, 9767),
(11, 'Speedrun Practicando', 6, 4200),
(12, 'Pasados al 100%', 8, 326243),
(13, 'Pasados al 100%', 8, 9767),
(14, 'Lista de Sufrimiento', 8, 3328),
(15, 'Aventuras Épicas', 10, 5679),
(16, 'Juegos de Rol Colosales', 4, 324997),
(17, 'Obras de Arte Indie', 7, 274755),
(18, 'Viajes Inolvidables', 10, 327239);

-- =====================================================================
-- 3. TABLA: resena (Reseñas de videojuegos escritas por los usuarios)
-- NOTA: Se han eliminado las columnas NOMBRE_VIDEOJUEGO y FOTO_VIDEOJUEGO
-- =====================================================================
INSERT INTO resena (ID, MENSAJE, PUNTUACION, TIENE_SPOILER, ME_GUSTAS, NO_ME_GUSTAS, FECHA_RESENA, ID_USUARIO, ID_VIDEOJUEGO, REVISADA) VALUES
(1, '¿Qué se puede decir de esta obra maestra absoluta que no se haya dicho ya? Geralt de Rivia nos guía por el mundo abierto mejor construido de la historia. Las misiones secundarias tienen mejor narrativa y peso que las campañas principales de la mitad de juegos del mercado. La misión del Barón Sanguinario me dejó el corazón encogido. Gráficos atemporales, música celta impecable y una jugabilidad soberbia. Indispensable.', 5, 0, 4, 0, '2026-04-10 18:24:00', 2, 3328, 1),
(2, 'FromSoftware ha alcanzado la cúspide de su fórmula. Trasladar el combate y misterio de Dark Souls a un mundo abierto de esta magnitud parecía imposible, pero lo han logrado con creces. Explorar las Tierras Intermedias se siente como una aventura genuina donde cada rincón esconde un secreto. El diseño de jefes es increíble, aunque Malenia casi me hace tirar el mando por la ventana. ¡Ojo que detallo un SPOILER sobre el final!: El combate final contra Radagon y la Bestia del Círculo es visualmente precioso, revelando que Radagon y Marika son el mismo ser. Un Lore fascinante.', 5, 1, 3, 1, '2026-04-15 21:05:00', 8, 326243, 1),
(3, 'Me lo recomendó todo el mundo diciendo que era una obra de arte y ha sido una tortura. Entiendo que los escenarios son preciosos y la música es bonita, pero no es divertido morir 50 veces seguidas contra un caballero dorado gigante nada más empezar el juego. No hay un mapa claro, no sé a dónde ir y los menús son súper complicados. Para mí, los videojuegos son para relajarse, no para acabar con dolor de cabeza. Le doy un 2 por la dirección artística.', 2, 0, 1, 3, '2026-04-16 11:30:00', 3, 326243, 1),
(4, 'Física, rompecabezas, humor negro y una de las mejores narrativas de la historia de la industria. Valve logró superar la perfección de la primera entrega añadiendo cooperativo, geles con dinámicas de salto/velocidad increíbles y personajes memorables como Wheatley y Cave Johnson. Las mecánicas de inercia y portales son tan limpias que da gusto jugarlo a nivel competitivo de speedrun. 5/5.', 5, 0, 2, 0, '2026-04-20 15:45:00', 6, 4200, 1),
(5, 'Mi lugar feliz. Llevo jugando a Minecraft más de 10 años y nunca me aburro. Construir granjas automáticas, decorar mi casita en el bosque o explorar cuevas con amigos mientras escuchamos la música ambiental de C418 es una de las sensaciones más terapéuticas que existen. Es el juego definitivo para dar rienda suelta a la creatividad sin presiones de ningún tipo.', 5, 0, 3, 0, '2026-04-22 17:10:00', 3, 22509, 1),
(6, 'Tras el desastroso lanzamiento y años de parches, Cyberpunk 2077 es finalmente la obra que prometieron. Night City es una megaurbe densa, vertical, asfixiante y de un preciosismo visual inigualable. La historia de V y Johnny Silverhand engancha de principio a fin, y el sistema de combate cibernético te hace sentir verdaderamente poderoso. El parche 2.0 y el DLC Phantom Liberty lo convirtieron en un clásico instantáneo de la ciencia ficción.', 4, 0, 2, 1, '2026-04-25 22:30:00', 5, 41494, 1),
(7, 'Hollow Knight es la cúspide del diseño Metroidvania. Team Cherry creó un mundo subterráneo gigante, misterioso y desolado con una atmósfera melancólica insuperable. El sistema de combate es simple pero de una precisión quirúrgica, y la banda sonora de Christopher Larkin evoca una tristeza de gran belleza. Hallownest es un laberinto inolvidable donde perderse es un deleite.', 5, 0, 4, 0, '2026-05-01 09:15:00', 7, 9767, 1),
(8, 'Aunque popularizó los mundos abiertos, Skyrim simplificó en exceso los elementos RPG de sus predecesores (Morrowind/Oblivion). El sistema de combate consiste básicamente en aporrear botones, la historia principal es floja y las misiones de los gremios te nombran líder tras hacer 4 tareas sin ninguna consecuencia. No obstante, la banda sonora es colosal y el sentimiento de libertad al cruzar los picos nevados es indiscutible. Un buen juego de exploración, un RPG mediocre.', 3, 0, 1, 2, '2026-05-03 14:00:00', 4, 5679, 1),
(9, 'El nivel de obsesión por el detalle y realismo en este juego roza lo enfermizo. Cabalgar por la naturaleza salvaje, cazar, interactuar con el campamento... todo se siente sumamente orgánico. Y la historia de redención es simplemente cine de autor. Cuidado con este SPOILER del final: Ver la inevitable muerte de Arthur Morgan bajo el amanecer después de dar su vida para que John y su familia escapen me hizo llorar a lágrima viva. De los finales más duros e impactantes de la historia.', 5, 1, 3, 0, '2026-05-05 12:00:00', 10, 28, 1),
(10, 'Es muy divertido para jugar online con amigos y hacer el tonto por la ciudad, robar coches o tirarse en paracaídas. Pero el modo historia no me gustó tanto, los tres protagonistas son señores muy maleducados y gritones que siempre están haciendo cosas delictivas desagradables. Prefiero perderme por la playa o dar vueltas en la feria.', 3, 0, 0, 2, '2026-05-07 19:40:00', 3, 3498, 1),
(11, 'Celeste no solo es el plataformas más desafiante y preciso de la última década, sino que camufla su alta dificultad en un precioso relato terapéutico sobre la ansiedad y la superación personal. Cada muerte se siente justa y te motiva a intentarlo de nuevo gracias a sus tiempos de carga instantáneos. El diseño de niveles introduce mecánicas brillantes pantalla tras pantalla. Obra maestra.', 5, 0, 2, 0, '2026-05-09 10:00:00', 6, 22121, 1),
(12, 'Nos prometieron el RPG definitivo del futuro y nos entregaron un shooter de acción con árboles de habilidades aburridos y decisiones estéticas sin relevancia real. Night City es una hermosa cáscara vacía, los NPCs no tienen rutinas coherentes y la policía aparece mágicamente a tus espaldas. Aunque la historia es interesante, no se siente como un juego de rol de mesa. Lejos de la profundidad de Baldurs Gate 3.', 2, 0, 1, 3, '2026-05-11 16:50:00', 4, 41494, 1),
(13, 'Reconozco que a nivel de historia, personajes y misiones secundarias es un referente absoluto en la industria, pero como amante del combate técnico, la jugabilidad de este juego me aburre un poco. Consiste en rodar infinitamente, aplicar el escudo Quen y spamear ataques rápidos. Si tuviese un sistema de combate más pulido y castigador al estilo Souls, sería perfecto.', 4, 0, 1, 1, '2026-05-12 14:15:00', 8, 3328, 1),
(14, 'Supergiant Games logró romper la barrera del género rogue-like integrando una narrativa viva de forma magistral. Morir en Hades no frustra, sino que es el vehículo para avanzar en las tramas secundarias con los dioses olímpicos y conocer mejor a Zagreus. Combates rápidos, fluidos, un apartado artístico mitológico exquisito y una música brutal de Darren Korb. Impecable.', 5, 0, 2, 0, '2026-05-14 11:10:00', 7, 274755, 1),
(15, 'El juego que cambió la industria para siempre y redefinió el diseño de niveles moderno. Lordran es un laberinto tridimensional vertical conectado con tal maestría que te hace explotar la cabeza al descubrir atajos. La narrativa ambiental, donde tienes que leer la descripción de los objetos para entender qué ocurre, es fascinante. Sí, es difícil, pero te enseña a prestar atención y aprender de tus errores. Insustituible.', 5, 0, 3, 0, '2026-05-16 08:30:00', 8, 5538, 1),
(16, 'Una de las reinvenciones más valientes del medio. Transformar al violento e iracundo Kratos en un padre cansado en tierras nórdicas con un plano secuencia continuo es una genialidad absoluta. El combate con el Hacha Leviatán se siente sumamente físico y satisfactorio, y la química con Atreus es el motor emocional de toda la aventura. Una de las mejores exclusivas de Playstation.', 5, 0, 2, 0, '2026-05-17 13:00:00', 10, 58175, 1),
(17, 'Un RPG colosal que redefine por completo la libertad de elección en los videojuegos. Larian Studios ha logrado trasladar la esencia de Dungeons & Dragons con un amor, detalle y guion soberbios. Los personajes secundarios son inolvidables y las ramificaciones de cada decisión son asombrosas. Sin duda alguna, el mejor RPG de la década.', 5, 0, 0, 0, '2026-05-18 10:15:00', 4, 324997, 0),
(18, 'Es un juego precioso que transmite una paz inmensa. Cuidar de los cultivos, saludar a los vecinos del pueblo Pelícano y pescar mientras llueve es una de mis rutinas favoritas para relajarme por las tardes. Eric Barone creó una obra de arte con un cariño que se siente en cada píxel y cada melodía.', 5, 0, 0, 0, '2026-05-18 11:20:00', 3, 654, 0),
(19, 'Es alucinante cómo han cogido el mapa de Breath of the Wild y lo han expandido no solo con el cielo y el subsuelo, sino con mecánicas de construcción revolucionarias. La Ultramano y la combinación de objetos dan una libertad creativa nunca antes vista. El templo del viento y la música me parecieron excepcionales.', 5, 0, 0, 0, '2026-05-18 12:45:00', 2, 327239, 0),
(20, 'Supergiant lo volvió a hacer. La jugabilidad es adictiva, pero lo que realmente destaca es cómo integran la narrativa en el género roguelike. Cada muerte te recompensa con más lore y conversaciones únicas en la morada de Hades. El diseño artístico mitológico y la banda sonora chiptune/rock son de otro mundo.', 5, 0, 0, 0, '2026-05-18 13:05:00', 7, 274755, 0),
(21, '¡OJO! Esta reseña contiene un destripe masivo de la trama de Arthur Morgan: Qué absoluto juegazo. Todo en el juego roza la perfección, pero quiero comentar el final: ver a Arthur morir de tuberculosis bajo la luz del amanecer tras salvar a John Marston me dejó completamente destrozado. Una obra de arte de Rockstar.', 5, 0, 0, 0, '2026-05-18 13:30:00', 5, 28, 0),
(22, 'Este juego es una basura infecta de la peor clase. La comunidad online está llena de niños gritones y hackers tramposos que te arruinan la partida al instante lanzándote misiles. No gastes tu dinero en esta estafa.', 1, 0, 0, 0, '2026-05-18 14:10:00', 2, 3498, 0),
(23, 'Una genialidad absoluta de principio a fin. El diseño del tercer acto es inmenso y las posibilidades tácticas en los combates por turnos son una delicia para cualquier estratega. Un digno sucesor espiritual de los clásicos de BioWare.', 5, 0, 2, 0, '2026-05-18 09:30:00', 7, 324997, 1),
(24, 'El mejor tributo a Harvest Moon imaginable. Su apartado gráfico pixel art de 16 bits y sus animaciones hechas con mimo demuestran que no se necesitan gráficos de última generación para crear un juego atemporal y sumamente cautivador.', 5, 0, 2, 0, '2026-05-18 09:50:00', 9, 654, 1);

-- =====================================================================
-- 4. TABLA: respuesta
-- =====================================================================
INSERT INTO respuesta (ID, MENSAJE, ME_GUSTAS, NO_ME_GUSTAS, ID_RESENA, ID_USUARIO, ID_RESPUESTA_PADRE, FECHA_RESPUESTA) VALUES
(1, '¡Totalmente de acuerdo! La misión del Barón Sanguinario es arte puro. No es blanca o negra, está llena de matices grises. Una de las mejores tramas jamás escritas.', 3, 0, 1, 4, NULL, '2026-04-10 19:15:00'),
(2, 'Yo sigo tarareando las canciones de las moiras de las ciénagas, son súper inmersivas.', 2, 0, 1, 3, NULL, '2026-04-10 20:00:00'),
(3, '¿Spamear ataques rápidos en dificultad máxima? Pruébalo en la dificultad "La Marcha de la Muerte" y verás que si no usas alquimia y esquivas al milímetro te destrozan.', 1, 1, 1, 2, 1, '2026-05-12 15:30:00'),
(4, 'Buenísima reseña. El Lore de Radagon y Marika me voló la cabeza en su momento. La libertad para resolver los jefes es fantástica.', 2, 0, 2, 2, NULL, '2026-04-15 21:40:00'),
(5, 'Qué buen spoiler metiste, menos mal que estaba marcado como tal, que si no me arruinas el juego. ¡Gran detalle!', 2, 0, 2, 10, NULL, '2026-04-16 09:20:00'),
(6, '¡No te rindas, María! Al principio abruma y asusta un montón, pero te aseguro que si usas las cenizas de invocación el juego se vuelve muchísimo más accesible. ¡Dale otra oportunidad y no luches contra el caballero dorado del inicio, es una trampa!', 3, 0, 3, 8, NULL, '2026-04-16 12:00:00'),
(7, 'Jajaja es que el centinela agreste del inicio está hecho precisamente para enseñarte que puedes rodearlo e ir a otro lado. Es la primera lección del juego.', 1, 1, 3, 2, 6, '2026-04-16 12:30:00'),
(8, 'Pues yo te apoyo María, los juegos están para desconectar y divertirse, no para acabar estresada y frustrada.', 2, 0, 3, 9, NULL, '2026-04-16 14:00:00'),
(9, 'Es increíble el lavado de cara que le dieron. El parche 2.0 y el sistema policial cambiaron por completo el juego. Ahora sí es lo que debía ser.', 2, 0, 6, 2, NULL, '2026-04-26 10:15:00'),
(10, 'A mí me sigue molestando que las decisiones de origen (Nómada, Buscavidas o Corporativo) solo afecten a los primeros 15 minutos de juego y algunas líneas de diálogo irrelevantes.', 1, 1, 6, 4, NULL, '2026-04-26 12:00:00'),
(11, 'Para mí, la banda sonora de Christopher Larkin en Dirtmouth es el sonido de la soledad más hermoso jamás compuesto.', 2, 0, 7, 9, NULL, '2026-05-01 10:00:00'),
(12, '¿Has intentado el Panteón de Hallownest al 100%? Es un infierno de dificultad pero la satisfacción de completarlo es increíble.', 1, 0, 7, 6, NULL, '2026-05-01 11:20:00'),
(13, 'Totalmente de acuerdo en lo de los gremios. Es absurdo que en dos tardes te conviertas en el Archimago del Colegio de Hibernalia cuando solo sabes lanzar dos hechizos básicos.', 2, 0, 8, 7, NULL, '2026-05-03 15:30:00'),
(14, 'Puede que sea un RPG simple, pero la sensación de explorar ese mundo por primera vez con Secunda sonando de fondo no la he vuelto a vivir en ningún otro juego.', 2, 0, 8, 2, NULL, '2026-05-03 16:15:00'),
(15, 'Ese final me destruyó por completo. Pocos juegos consiguen que empatices de esa manera con un forajido.', 3, 0, 9, 2, NULL, '2026-05-05 13:00:00'),
(16, '¡El mejor juego de la generación pasada sin ninguna duda! La evolución del personaje es perfecta.', 1, 0, 9, 10, NULL, '2026-05-05 14:00:00'),
(17, 'Es que la gente iba buscando un simulador de rol puro cuando en realidad es una aventura de acción increíble con tintes RPG. Si ajustas tus expectativas es una delicia.', 2, 1, 12, 5, NULL, '2026-05-11 17:30:00'),
(18, 'Compararlo con Baldurs Gate 3 no es muy justo, son enfoques y presupuestos totalmente distintos. Pero entiendo que decepcionase en su sistema de decisiones.', 1, 0, 12, 7, 17, '2026-05-11 18:00:00'),
(19, '¡Totalmente de acuerdo! Le eché más de 120 horas en mi primera partida y ya estoy pensando en empezar otra con un personaje diferente. Es insondable.', 2, 0, 17, 2, NULL, '2026-05-18 10:30:00'),
(20, 'Yo lo estoy jugando en cooperativo y nos lo estamos pasando pipa. Los diálogos tienen un nivel de detalle increíble.', 2, 0, 17, 3, NULL, '2026-05-18 10:45:00'),
(21, 'Es mi juego relajante favorito para las tardes de lluvia. Adoro pescar en el muelle de la playa.', 2, 0, 18, 9, NULL, '2026-05-18 11:40:00');

-- =====================================================================
-- 5. TABLA: resena_voto
-- =====================================================================
INSERT INTO resena_voto (ID, ID_RESENA, ID_USUARIO, ES_ME_GUSTA) VALUES
(1, 1, 3, 1),
(2, 1, 4, 1),
(3, 1, 8, 1),
(4, 1, 10, 1),
(5, 2, 2, 1),
(6, 2, 7, 1),
(7, 2, 10, 1),
(8, 2, 3, 0),
(9, 3, 9, 1),
(10, 3, 2, 0),
(11, 3, 8, 0),
(12, 3, 6, 0),
(13, 5, 2, 1),
(14, 5, 9, 1),
(15, 5, 7, 1),
(16, 6, 2, 1),
(17, 6, 10, 1),
(18, 6, 4, 0),
(19, 7, 2, 1),
(20, 7, 6, 1),
(21, 7, 8, 1),
(22, 7, 9, 1),
(23, 8, 7, 1),
(24, 8, 2, 0),
(25, 8, 10, 0),
(26, 9, 2, 1),
(27, 9, 4, 1),
(28, 9, 8, 1);

-- =====================================================================
-- 6. TABLA: respuesta_voto
-- =====================================================================
INSERT INTO respuesta_voto (ID, ID_RESPUESTA, ID_USUARIO, ES_ME_GUSTA) VALUES
(1, 1, 2, 1),
(2, 1, 8, 1),
(3, 1, 10, 1),
(4, 3, 8, 1),
(5, 3, 3, 0),
(6, 6, 3, 1),
(7, 6, 9, 1),
(8, 6, 10, 1),
(9, 7, 8, 1),
(10, 7, 3, 0),
(11, 8, 3, 1),
(12, 8, 5, 1),
(13, 15, 10, 1),
(14, 15, 4, 1),
(15, 15, 8, 1);

-- =====================================================================
-- 7. TABLA: screenshot
-- =====================================================================
INSERT INTO screenshot (ID, IMAGE, videojuego_id) VALUES
(1, 'https://media.rawg.io/media/screenshots/1ac/1ac19f31974314855ad7be266adeb500.jpg', 3328),
(2, 'https://media.rawg.io/media/screenshots/6a0/6a08afca95261a2fe221ea9e01d28762.jpg', 3328),
(3, 'https://media.rawg.io/media/screenshots/cdd/cdd31b6b4a687425a87b5ce231ac89d7.jpg', 3328),
(4, 'https://media.rawg.io/media/screenshots/862/862397b153221a625922d3bb66337834.jpg', 3328),
(5, 'https://media.rawg.io/media/screenshots/166/166787c442a45f52f4f230c33fd7d605.jpg', 3328),
(6, 'https://media.rawg.io/media/screenshots/3bd/3bd2710bd1ffb6664fdea7b83afd067e.jpg', 5679),
(7, 'https://media.rawg.io/media/screenshots/d4e/d4e9b13f54748584ccbd6f998094dade.jpg', 5679),
(8, 'https://media.rawg.io/media/screenshots/599/59946a630e9c7871003763d63184404a.jpg', 5679),
(9, 'https://media.rawg.io/media/screenshots/c5d/c5dad426038d7d12f933eedbeab48ff3.jpg', 5679),
(10, 'https://media.rawg.io/media/screenshots/b32/b326fa01c82db82edd41ed299886ee44.jpg', 5679),
(11, 'https://media.rawg.io/media/screenshots/36f/36f941f72e2b2a41629f5fb3bd448688.jpg', 326243),
(12, 'https://media.rawg.io/media/screenshots/290/29096848622521df7555850000236cb6.jpg', 326243),
(13, 'https://media.rawg.io/media/screenshots/807/807685454ea8fb87363eedd49677f49b.jpg', 326243),
(14, 'https://media.rawg.io/media/screenshots/2ee/2eea4d4cce2836f689d9d39d2a4a94d5.jpg', 326243),
(15, 'https://media.rawg.io/media/screenshots/de9/de9b28bdd0bdb9937c7f82e55f845bb6.jpg', 326243),
(16, 'https://media.rawg.io/media/screenshots/814/814c25d6fd1fd34a4e6dade645a3bda7.jpg', 41494),
(17, 'https://media.rawg.io/media/screenshots/2ab/2ab0b67e68b6ede6b19d80094b6f7f2a_qTSfS2g.jpg', 41494),
(18, 'https://media.rawg.io/media/screenshots/cd2/cd22af9d6ac593440defac6082760e4a.jpg', 41494),
(19, 'https://media.rawg.io/media/screenshots/9b5/9b51535beb9d9e416cb9aac874091334.jpg', 41494),
(20, 'https://media.rawg.io/media/screenshots/d84/d84d3a16c1e2cb24dcf73e0108d78455.jpg', 41494),
(21, 'https://media.rawg.io/media/screenshots/324/32454b11adde40d87c046f310f0d710d.jpg', 22509),
(22, 'https://media.rawg.io/media/screenshots/268/2689f04cbcabb467dd4948e30fe90f51.jpg', 22509),
(23, 'https://media.rawg.io/media/screenshots/e83/e83fbaf3a8bdf1cdd855acf8fc90d2fe.jpg', 22509),
(24, 'https://media.rawg.io/media/screenshots/a02/a021bf48ee5e492026e6464b3751cf35.jpg', 22509),
(25, 'https://media.rawg.io/media/screenshots/0cc/0cc6c1534e782b9d040c665a1f78c6f7.jpg', 22509),
(26, 'https://media.rawg.io/media/screenshots/3c4/3c4a8f6b1994def75e73e1cb64624e7f.jpg', 22511),
(27, 'https://media.rawg.io/media/screenshots/8f5/8f5d4264b12090bb7aa5626fcfb5be18.jpg', 22511),
(28, 'https://media.rawg.io/media/screenshots/b77/b771adc0585c655f8a747d3160e5325a.jpg', 22511),
(29, 'https://media.rawg.io/media/screenshots/ef7/ef7d89471e5c0dc5553c249b2c34d9cd.jpg', 22511),
(30, 'https://media.rawg.io/media/screenshots/1e5/1e58e8a064da6906f09dba1edb3fdea6.jpg', 22511),
(31, 'https://media.rawg.io/media/screenshots/6b3/6b309936c1fe07e9b7fa5e62a372790d.jpg', 9767),
(32, 'https://media.rawg.io/media/screenshots/1a7/1a7a69db58c19d323f1dfbcc340d3f1e.jpg', 9767),
(33, 'https://media.rawg.io/media/screenshots/723/7237d0c546b0d17a6a226f38823081d4.jpg', 9767),
(34, 'https://media.rawg.io/media/screenshots/331/331095489397e7387681d921e8e472d4.jpg', 9767),
(35, 'https://media.rawg.io/media/screenshots/5db/5db89e896496352c8f0a0a0bd545bd6d.jpg', 9767),
(36, 'https://media.rawg.io/media/screenshots/d68/d6868e5f7bce66e326bd48b11ba24b13.jpeg', 58175),
(37, 'https://media.rawg.io/media/screenshots/928/928cdaf4ae204f202d177bbd65e911b3.jpeg', 58175),
(38, 'https://media.rawg.io/media/screenshots/a54/a549a06ebe89c570cabb57308c4c42a5.jpeg', 58175),
(39, 'https://media.rawg.io/media/screenshots/f02/f0279f8199da3e91134078e737e5fbcf.jpg', 58175),
(40, 'https://media.rawg.io/media/screenshots/e87/e87c57660c7c37fe973c6dd6ebcc1ac6.jpeg', 58175),
(41, 'https://media.rawg.io/media/screenshots/221/221a03c11e5ff9f765d62f60d4b4cbf5.jpg', 4200),
(42, 'https://media.rawg.io/media/screenshots/173/1737ff43c14f40294011a209b1012875.jpg', 4200),
(43, 'https://media.rawg.io/media/screenshots/b11/b11a2ae0664f0e8a1ef2346f99df26e1.jpg', 4200),
(44, 'https://media.rawg.io/media/screenshots/9b1/9b107a790909b31918ebe2f40547cc85.jpg', 4200),
(45, 'https://media.rawg.io/media/screenshots/d05/d058fc7f7fa6128916c311eb14267fed.jpg', 4200),
(46, 'https://media.rawg.io/media/screenshots/a67/a676cdec0eadc42a133ac49e7f2e1aac.jpg', 324997),
(47, 'https://media.rawg.io/media/screenshots/705/705846f6583a6da009a0ae7fcdece36d.jpg', 324997),
(48, 'https://media.rawg.io/media/screenshots/d29/d29b1d2726d69432d2b4180a79b9ee9d.jpg', 324997),
(49, 'https://media.rawg.io/media/screenshots/ed1/ed19ec8ce43f9dd3553df4a6d9301f61.jpg', 324997),
(50, 'https://media.rawg.io/media/screenshots/6c8/6c8983d658a4a24dc8eb9d2f88f1dabf.jpg', 324997),
(51, 'https://media.rawg.io/media/screenshots/546/546826ed2cde2dec94e1b470c8cbb9ac.jpg', 274755),
(52, 'https://media.rawg.io/media/screenshots/0aa/0aa5e778c3cf8f47e3ee7f8e0185eb16.jpg', 274755),
(53, 'https://media.rawg.io/media/screenshots/a06/a0649473a36bb879cef146a244d9cb54.jpg', 274755),
(54, 'https://media.rawg.io/media/screenshots/f70/f7079ac3e96a5da13c8cfda6fb9fe249.jpg', 274755),
(55, 'https://media.rawg.io/media/screenshots/8d4/8d4d9c4ffe01ad0addc29353a895d562.jpg', 274755),
(56, 'https://media.rawg.io/media/screenshots/51f/51f7928a2630fc4bbb3dac59b8f31448.jpg', 327239),
(57, 'https://media.rawg.io/media/screenshots/104/10431d15726ed2593401cc70e2115a82.jpg', 327239),
(58, 'https://media.rawg.io/media/screenshots/c0d/c0dafd15ec182acab8f5879665eaa642.jpg', 327239),
(59, 'https://media.rawg.io/media/screenshots/725/725dbbf72f15a32f418a42d2e8ac8b25.jpg', 327239),
(60, 'https://media.rawg.io/media/screenshots/c63/c63fda6df2574a7d071f96082438e820.jpg', 327239),
(61, 'https://media.rawg.io/media/screenshots/7b8/7b8895a23e8ca0dbd9e1ba24696579d9.jpg', 28),
(62, 'https://media.rawg.io/media/screenshots/b8c/b8cee381079d58b981594ede46a3d6ca.jpg', 28),
(63, 'https://media.rawg.io/media/screenshots/fd6/fd6e41d4c30c098158568aef32dfed35.jpg', 28),
(64, 'https://media.rawg.io/media/screenshots/2ed/2ed3b2791b3bbed6b98bf362694aeb73.jpg', 28),
(65, 'https://media.rawg.io/media/screenshots/857/8573b9f4f06a0c112d6e39cdf3544881.jpg', 28),
(66, 'https://media.rawg.io/media/screenshots/f95/f9518b1d99210c0cae21fc09e95b4e31.jpg', 3498),
(67, 'https://media.rawg.io/media/screenshots/a5c/a5c95ea539c87d5f538763e16e18fb99.jpg', 3498),
(68, 'https://media.rawg.io/media/screenshots/a7e/a7e990bc574f4d34e03b5926361d1ee7.jpg', 3498),
(69, 'https://media.rawg.io/media/screenshots/eb0/eb0a2c0de9194a635fc0cd04f5a29ae7.jpg', 3498),
(70, 'https://media.rawg.io/media/screenshots/ec7/ec7f05fb82290fea9647b7879fe9a6bf.jpg', 3498),
(71, 'https://media.rawg.io/media/screenshots/587/5876e97af87c864b0d9cd19ca77568a5.jpg', 22121),
(72, 'https://media.rawg.io/media/screenshots/a1b/a1bb2c2268db77533c09e231bf032d9f.jpg', 22121),
(73, 'https://media.rawg.io/media/screenshots/031/031480a38e2e473baa13154acbbf4abc.jpg', 22121),
(74, 'https://media.rawg.io/media/screenshots/651/651e56fc12694d1381183df3b83fc4df.jpg', 22121),
(75, 'https://media.rawg.io/media/screenshots/5b1/5b13b67481ff4e20180aa509bc738e6a.jpg', 22121),
(76, 'https://media.rawg.io/media/screenshots/1c7/1c78c72e5ade3df06474b186befdfa8e.jpg', 5538),
(77, 'https://media.rawg.io/media/screenshots/0e2/0e2bc7cd0a20473a8c84cc707bc814d9.jpg', 5538),
(78, 'https://media.rawg.io/media/screenshots/415/415da63a7a3c181d06e311a574b39c67.jpg', 5538),
(79, 'https://media.rawg.io/media/screenshots/679/67918bad4239ae8aa75deb8de757cc57.jpg', 5538),
(80, 'https://media.rawg.io/media/screenshots/efc/efc2c8db00c6b019d9d2ebcaddc1369e.jpg', 5538),
(81, 'https://media.rawg.io/media/screenshots/b72/b722b1746256f64ce5e15558d1ac7613.jpg', 654),
(82, 'https://media.rawg.io/media/screenshots/733/7330aea66ef9de06bb201e1d3f10ff70.jpg', 654),
(83, 'https://media.rawg.io/media/screenshots/0a6/0a6dfc3ef9ac018b737427405e686e23.jpg', 654),
(84, 'https://media.rawg.io/media/screenshots/366/3668bbdd41a682c76370fc81691150bc.jpg', 654),
(85, 'https://media.rawg.io/media/screenshots/e25/e25137cf398c743153d64993160487f1.jpg', 654);

