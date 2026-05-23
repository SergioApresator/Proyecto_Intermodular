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
INSERT INTO videojuego (ID, NAME, RATING, METACRITIC, RELEASED, BACKGROUND_IMAGE, added_count, description, description_raw) VALUES
(3328, 'The Witcher 3: Wild Hunt', 4.66, 92, '2026-02-10', 'assets/videojuegos/3328.jpg', 15000, 
'<p><strong>The Witcher 3: Wild Hunt</strong> es un juego de rol de mundo abierto ambientado en un universo fantástico visualmente impresionante, lleno de decisiones importantes y consecuencias impactantes. En The Witcher, juegas como Geralt de Rivia, un cazador de monstruos profesional que busca a la niña de la profecía en un vasto mundo abierto rico en ciudades comerciales, islas piratas, peligrosos pasos de montaña y cuevas olvidadas por explorar.</p>', 
'The Witcher 3: Wild Hunt es un juego de rol de mundo abierto ambientado en un universo fantástico visualmente impresionante, lleno de decisiones importantes y consecuencias impactantes. En The Witcher, juegas como Geralt de Rivia, un cazador de monstruos profesional que busca a la niña de la profecía en un vasto mundo abierto rico en ciudades comerciales, islas piratas, peligrosos pasos de montaña y cuevas olvidadas por explorar.'),

(5679, 'The Elder Scrolls V: Skyrim', 4.42, 94, '2026-11-11', 'assets/videojuegos/5679.jpg', 12000, 
'<p><strong>The Elder Scrolls V: Skyrim</strong> revoluciona la fantasía épica en mundos abiertos. Skyrim recrea un mundo virtual completo listo para ser explorado de la forma que tú elijas. Juega con cualquier tipo de personaje que puedas imaginar y haz lo que quieras; la legendaria libertad de elección, narración y aventura de The Elder Scrolls cobra vida como nunca antes.</p>', 
'The Elder Scrolls V: Skyrim revoluciona la fantasía épica en mundos abiertos. Skyrim recrea un mundo virtual completo listo para ser explorado de la forma que tú elijas. Juega con cualquier tipo de personaje que puedas imaginar y haz lo que quieras; la legendaria libertad de elección, narración y aventura de The Elder Scrolls cobra vida como nunca antes.'),

(326243, 'Elden Ring', 4.58, 96, '2026-03-15', 'assets/videojuegos/326243.jpg', 14500, 
'<p><strong>ELDEN RING</strong> es un juego de rol y acción de fantasía desarrollado por FromSoftware Inc. y producido por Bandai Namco Entertainment Inc. Ambientado en un mundo lleno de misterios y peligros, surge la nueva gran epopeya de fantasía creada por Hidetaka Miyazaki y George R. R. Martin. Explora las Tierras Intermedias, desvela los misterios del poder del Círculo de Elden y conviértete en el Señor de Elden.</p>', 
'ELDEN RING es un juego de rol y acción de fantasía desarrollado por FromSoftware Inc. y producido por Bandai Namco Entertainment Inc. Ambientado en un mundo lleno de misterios y peligros, surge la nueva gran epopeya de fantasía creada por Hidetaka Miyazaki y George R. R. Martin. Explora las Tierras Intermedias, desvela los misterios del poder del Círculo de Elden y conviértete en el Señor de Elden.'),

(41494, 'Cyberpunk 2077', 4.15, 86, '2026-05-01', 'assets/videojuegos/41494.jpg', 11000, 
'<p><strong>Cyberpunk 2077</strong> es un RPG de acción y aventura en mundo abierto ambientado en la megalópolis de Night City, donde encarnas a V, un mercenario cyberpunk que busca un implante único que permite alcanzar la inmortalidad. Personaliza las mejoras cibernéticas de tu personaje, su estilo de juego y explora una ciudad colosal donde tus decisiones dan forma a la historia.</p>', 
'Cyberpunk 2077 es un RPG de acción y aventura en mundo abierto ambientado en la megalópolis de Night City, donde encarnas a V, un mercenario cyberpunk que busca un implante único que permite alcanzar la inmortalidad. Personaliza las mejoras cibernéticas de tu personaje, su estilo de juego y explora una ciudad colosal donde tus decisiones dan forma a la historia.'),

(22509, 'Minecraft', 4.43, 83, '2011-11-18', 'assets/videojuegos/22509.jpg', 20000, 
'<p><strong>Minecraft</strong> es un juego sobre colocar bloques y salir de aventuras. Explora mundos generados aleatoriamente y construye cosas increíbles, desde la más simple de las casas hasta el más grandioso de los castillos. Juega en modo creativo con recursos ilimitados o adéntrate en el mundo en el modo supervivencia, fabricando armas y armaduras para defenderte de peligrosas criaturas.</p>', 
'Minecraft es un juego sobre colocar bloques y salir de aventuras. Explora mundos generados aleatoriamente y construye cosas increíbles, desde la más simple de las casas hasta el más grandioso de los castillos. Juega en modo creativo con recursos ilimitados o adéntrate en el mundo en el modo supervivencia, fabricando armas y armaduras para defenderte de peligrosas criaturas.'),

(22511, 'The Legend of Zelda: Breath of the Wild', 4.6, 97, '2017-03-03', 'assets/videojuegos/22511.jpg', 18000, 
'<p>Entra en un mundo de descubrimientos, exploración y aventura en <strong>The Legend of Zelda: Breath of the Wild</strong>, un nuevo juego de la aclamada saga que rompe barreras. Viaja por praderas, bosques y cumbres montañosas mientras descubres qué ha sido del reino en ruinas de Hyrule en esta increíble aventura al aire libre.</p>', 
'Entra en un mundo de descubrimientos, exploración y aventura en The Legend of Zelda: Breath of the Wild, un nuevo juego de la aclamada saga que rompe barreras. Viaja por praderas, bosques y cumbres montañosas mientras descubres qué ha sido del reino en ruinas de Hyrule en esta increíble aventura al aire libre.'),

(9767, 'Hollow Knight', 4.4, 90, '2026-03-25', 'assets/videojuegos/9767.jpg', 13000, 
'<p><strong>Hollow Knight</strong> es una aventura de acción clásica en 2D ambientada en un vasto mundo interconectado. Explora cavernas serpenteantes, ciudades antiguas y páramos mortales; lucha contra criaturas corruptas y entabla amistad con extraños bichos; y resuelve los antiguos misterios ocultos en el corazón del reino abandonado bajo tierra.</p>', 
'Hollow Knight es una aventura de acción clásica en 2D ambientada en un vasto mundo interconectado. Explora cavernas serpenteantes, ciudades antiguas y páramos mortales; lucha contra criaturas corruptas y entabla amistad con extraños bichos; y resuelve los antiguos misterios ocultos en el corazón del reino abandonado bajo tierra.'),

(58175, 'God of War', 4.59, 94, '2026-12-05', 'assets/videojuegos/58175.jpg', 14000, 
'<p>Tras vengar la muerte de los dioses olímpicos, Kratos vive ahora en el reino de las deidades y monstruos nórdicos. En este mundo hostil y despiadado, debe luchar para sobrevivir y enseñar a su hijo Atreus a hacer lo mismo. Esta nueva versión de <strong>God of War</strong> deconstruye los elementos definitorios de la serie para ofrecer una aventura narrativa íntima y visualmente espectacular.</p>', 
'Tras vengar la muerte de los dioses olímpicos, Kratos vive ahora en el reino de las deidades y monstruos nórdicos. En este mundo hostil y despiadado, debe luchar para sobrevivir y enseñar a su hijo Atreus a hacer lo mismo. Esta nueva versión de God of War deconstruye los elementos definitorios de la serie para ofrecer una aventura narrativa íntima y visualmente espectacular.'),

(4200, 'Portal 2', 4.61, 95, '2011-04-18', 'assets/videojuegos/4200.jpg', 16000, 
'<p><strong>Portal 2</strong> introduce un elenco de nuevos personajes dinámicos, elementos de rompecabezas frescos y un conjunto mucho mayor de cámaras de prueba retorcidas. Los jugadores explorarán áreas nunca antes vistas de los Laboratorios Aperture Science y se reunirán con GLaDOS, la compañera informática mortalmente inventiva de la primera entrega.</p>', 
'Portal 2 introduce un elenco de nuevos personajes dinámicos, elementos de rompecabezas frescos y un conjunto mucho mayor de cámaras de prueba retorcidas. Los jugadores explorarán áreas nunca antes vistas de los Laboratorios Aperture Science y se reunirán con GLaDOS, la compañera informática mortalmente inventiva de la primera entrega.'),

(324997, "Baldur's Gate III", 4.8, 96, '2026-04-20', 'assets/videojuegos/324997.jpg', 17000, 
'<p>Reúne a tu grupo y regresa a los Reinos Olvidados en una historia de compañerismo y traición, sacrificio y supervivencia, y la tentación del poder absoluto. Misteriosas habilidades despiertan dentro de ti, extraídas de un parásito de azotamentes implantado en tu cerebro. Elige entre una amplia variedad de razas y clases, y escribe tu propio destino en <strong>Baldur''s Gate 3</strong>.</p>', 
'Reúne a tu grupo y regresa a los Reinos Olvidados en una historia de compañerismo y traición, sacrificio y supervivencia, y la tentación del poder absoluto. Misteriosas habilidades despiertan dentro de ti, extraídas de un parásito de azotamentes implantado en tu cerebro. Elige entre una amplia variedad de razas y clases, y escribe tu propio destino en Baldur''s Gate 3.'),

(274755, 'Hades', 4.4, 93, '2026-09-17', 'assets/videojuegos/274755.jpg', 12500, 
'<p><strong>Hades</strong> es un juego de exploración de mazmorras rogue-like que combina los mejores aspectos de los aclamados títulos de Supergiant, incluida la acción trepidante de Bastion, la atmósfera densa de Transistor y la narración centrada en personajes de Pyre. Desafía al dios de los muertos mientras te abres camino a espadazos para escapar del Inframundo.</p>', 
'Hades es un juego de exploración de mazmorras rogue-like que combina los mejores aspectos de los aclamados títulos de Supergiant, incluida la acción trepidante de Bastion, la atmósfera densa de Transistor y la narración centrada en personajes de Pyre. Desafía al dios de los muertos mientras te abres camino a espadazos para escapar del Inframundo.'),

(327239, 'The Legend of Zelda: Tears of the Kingdom', 4.6, 96, '2026-08-10', 'assets/videojuegos/327239.jpg', 15000, 
'<p>Una aventura épica a través de la tierra y los cielos de Hyrule te espera en <strong>The Legend of Zelda: Tears of the Kingdom</strong>. Decide tu propio camino a través del inmenso y cambiante paisaje de Hyrule y las misteriosas islas flotantes. Domina las nuevas habilidades de Link para luchar contra las fuerzas oscuras que amenazan el reino.</p>', 
'Una aventura épica a través de la tierra y los cielos de Hyrule te espera en The Legend of Zelda: Tears of the Kingdom. Decide tu propio camino a través del inmenso y cambiante paisaje de Hyrule y las misteriosas islas flotantes. Domina las nuevas habilidades de Link para luchar contra las fuerzas oscuras que amenazan el reino.'),

(28, 'Red Dead Redemption 2', 4.5, 97, '2026-01-15', 'assets/videojuegos/28.jpg', 16000, 
'<p>América, 1899. El ocaso del Salvaje Oeste ha comenzado. Tras un atraco fallido en Blackwater, Arthur Morgan y la banda de Van der Linde se ven obligados a huir. Con agentes federales y cazarrecompensas pisándoles los talones, la banda debe atracar, robar y luchar para sobrevivir en el escarpado territorio de <strong>Red Dead Redemption 2</strong>.</p>', 
'América, 1899. El ocaso del Salvaje Oeste ha comenzado. Tras un atraco fallido en Blackwater, Arthur Morgan y la banda de Van der Linde se ven obligados a huir. Con agentes federales y cazarrecompensas pisándoles los talones, la banda debe atracar, robar y luchar para sobrevivir en el escarpado territorio de Red Dead Redemption 2.'),

(3498, 'Grand Theft Auto V', 4.47, 97, '2013-09-17', 'assets/videojuegos/3498.jpg', 25000, 
'<p>Cuando un joven estafador callejero, un ladrón de bancos retirado y un psicópata aterrador se ven involucrados con lo peor del submundo criminal, el gobierno de EE. UU. y la industria del entretenimiento, deben llevar a cabo una serie de peligrosos golpes para sobrevivir en una ciudad despiadada en la que no pueden confiar en nadie, y mucho menos los unos en los otros en <strong>GTA V</strong>.</p>', 
'Cuando un joven estafador callejero, un ladrón de bancos retirado y un psicópata aterrador se ven involucrados con lo peor del submundo criminal, el gobierno de EE. UU. y la industria del entretenimiento, deben llevar a cabo una serie de peligrosos golpes para sobrevivir en una ciudad despiadada en la que no pueden confiar en nadie, y mucho menos los unos en los otros en GTA V.'),

(22121, 'Celeste', 4.3, 88, '2026-04-05', 'assets/videojuegos/22121.jpg', 11000, 
'<p>Ayuda a Madeline a sobrevivir a sus demonios internos en su viaje a la cima de la montaña Celeste, en este plataformas ultrapreciso de los creadores del clásico multijugador TowerFall. Una conmovedora historia de superación personal y salud mental acompañada de un apartado artístico sublime y una banda sonora inolvidable en <strong>Celeste</strong>.</p>', 
'Ayuda a Madeline a sobrevivir a sus demonios internos en su viaje a la cima de la montaña Celeste, en este plataformas ultrapreciso de los creadores del clásico multijugador TowerFall. Una conmovedora historia de superación personal y salud mental acompañada de un apartado artístico sublime y una banda sonora inolvidable en Celeste.'),

(5538, 'Dark Souls', 4.4, 89, '2011-09-22', 'assets/videojuegos/5538.jpg', 12000, 
'<p><strong>Dark Souls</strong> es el nuevo juego de rol de acción de los creadores de Demon''s Souls. Prepárate para descubrir un universo oscuro y desolado con un diseño de niveles interconectado asombroso. Lucha con precisión quirúrgica, aprende de tus errores y supera desafíos insuperables para revivir la llama del mundo de Lordran.</p>', 
'Dark Souls es el nuevo juego de rol de acción de los creadores de Demon''s Souls. Prepárate para descubrir un universo oscuro y desolado con un diseño de niveles interconectado asombroso. Lucha con precisión quirúrgica, aprende de tus errores y supera desafíos insuperables para revivir la llama del mundo de Lordran.'),

(654, 'Stardew Valley', 4.3, 89, '2016-02-26', 'assets/videojuegos/654.jpg', 14000, 
'<p>Heredaste la vieja parcela agrícola de tu abuelo en <strong>Stardew Valley</strong>. Armado con herramientas heredadas y unas pocas monedas, te dispones a comenzar tu nueva vida. ¿Podrás aprender a vivir de la tierra y convertir estos campos de maleza en un hogar próspero? Únete a la comunidad local y crea tu propia historia de tranquilidad.</p>', 
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
INSERT INTO usuario (ID, NOMBRE, APELLIDOS, USERNAME, EMAIL, PASSWORD, BIOGRAFIA, ES_ADMIN, BANEADO) VALUES
(1, 'Administrador', 'RateMyGame', 'admin', 'admin@ratemygame.com', '$2a$10$KxbLh77T7rxHFKHtG6rHpey50Qg6JL.3fAxSwb2hNMlwVtHQv4xaK', 'Administrador principal de la comunidad RateMyGame. Si tienes algún problema con las normas de la comunidad o encuentras spoilers sin marcar, no dudes en contactarme.', 1, 0),
(2, 'Alejandro', 'García', 'gamer_pro', 'alex.garcia@gaming.com', '$2a$10$KxbLh77T7rxHFKHtG6rHpey50Qg6JL.3fAxSwb2hNMlwVtHQv4xaK', 'Jugando y completando RPGs desde 1998. Mi saga favorita de todos los tiempos es The Witcher. Me encanta debatir sobre diseño de niveles y narración interactiva. ¡Sígueme para análisis profundos!', 0, 0),
(3, 'María', 'López', 'casual_mary', 'maria.lopez@casual.com', '$2a$10$KxbLh77T7rxHFKHtG6rHpey50Qg6JL.3fAxSwb2hNMlwVtHQv4xaK', 'Jugadora casual de corazón. Adoro los juegos acogedores (cozy games), la saga Animal Crossing, Stardew Valley y casi cualquier cosa que publique Nintendo. ¡La vida ya es muy estresante para jugar estresada!', 0, 0),
(4, 'Carlos', 'Martínez', 'rpg_enjoyer', 'carlos.rpg@retro.com', '$2a$10$KxbLh77T7rxHFKHtG6rHpey50Qg6JL.3fAxSwb2hNMlwVtHQv4xaK', 'Purista de los JRPG de la vieja escuela. Final Fantasy VI, Chrono Trigger y Xenogears son el pico artístico de la industria de los videojuegos. El 3D no siempre mejoró el diseño de juegos.', 0, 0),
(5, 'Elena', 'Sanz', 'cyber_punk', 'elena.cyber@neon.com', '$2a$10$KxbLh77T7rxHFKHtG6rHpey50Qg6JL.3fAxSwb2hNMlwVtHQv4xaK', 'Viviendo en una distopía de luces de neón. Apasionada de la ciencia ficción dura, el Cyberpunk y las conspiraciones corporativas virtuales. Fan de Deus Ex, Cyberpunk 2077 y System Shock.', 0, 0),
(6, 'Daniel', 'Ruiz', 'speedrunner', 'dani.runner@fast.com', '$2a$10$KxbLh77T7rxHFKHtG6rHpey50Qg6JL.3fAxSwb2hNMlwVtHQv4xaK', 'Buscando optimizar cada frame. Amante de los juegos de plataformas de precisión, metroidvanias y el speedrunning competitivo. Si un juego no tiene mecánicas de movimiento avanzadas, no me interesa.', 0, 0),
(7, 'Lucas', 'Fernández', 'indie_guy', 'lucas.indie@indie.com', '$2a$10$KxbLh77T7rxHFKHtG6rHpey50Qg6JL.3fAxSwb2hNMlwVtHQv4xaK', 'El sector AAA ha muerto comercialmente y en originalidad. Solo juego producciones de estudios independientes que arriesguen en su arte. Outer Wilds, Hollow Knight y Disco Elysium son el verdadero arte.', 0, 0),
(8, 'Sofía', 'Gómez', 'soulslike_fan', 'sofia.souls@lothric.com', '$2a$10$KxbLh77T7rxHFKHtG6rHpey50Qg6JL.3fAxSwb2hNMlwVtHQv4xaK', '\"Git Gud\". Pasándome juegos de FromSoftware sin recibir golpes. Elden Ring, Bloodborne y Dark Souls son mis templos personales. Si te cuesta derrotar a Malenia, escríbeme y te echo una mano.', 0, 0),
(9, 'Marcos', 'Ortega', 'pixel_art', 'marcos.pixel@retro.com', '$2a$10$KxbLh77T7rxHFKHtG6rHpey50Qg6JL.3fAxSwb2hNMlwVtHQv4xaK', 'Coleccionista de hardware retro. Si un videojuego tiene píxeles hermosos hechos a mano y banda sonora con sintetizadores chiptune de 8 o 16 bits, ya tiene mi corazón ganado.', 0, 0),
(10, 'Clara', 'Benítez', 'lara_croft', 'clara.lara@adventure.com', '$2a$10$KxbLh77T7rxHFKHtG6rHpey50Qg6JL.3fAxSwb2hNMlwVtHQv4xaK', 'Buscadora de tesoros arqueológicos y aventuras extremas. Me encantan los juegos de acción y aventura en tercera persona con exploración e historias intrigantes. Tomb Raider, Uncharted e Horizon.', 0, 0);

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
(1, 'assets/videojuegos/screenshots/1.jpg', 3328),
(2, 'assets/videojuegos/screenshots/2.jpg', 3328),
(3, 'assets/videojuegos/screenshots/3.jpg', 3328),
(4, 'assets/videojuegos/screenshots/4.jpg', 3328),
(5, 'assets/videojuegos/screenshots/5.jpg', 3328),
(6, 'assets/videojuegos/screenshots/6.jpg', 5679),
(7, 'assets/videojuegos/screenshots/7.jpg', 5679),
(8, 'assets/videojuegos/screenshots/8.jpg', 5679),
(9, 'assets/videojuegos/screenshots/9.jpg', 5679),
(10, 'assets/videojuegos/screenshots/10.jpg', 5679),
(11, 'assets/videojuegos/screenshots/11.jpg', 326243),
(12, 'assets/videojuegos/screenshots/12.jpg', 326243),
(13, 'assets/videojuegos/screenshots/13.jpg', 326243),
(14, 'assets/videojuegos/screenshots/14.jpg', 326243),
(15, 'assets/videojuegos/screenshots/15.jpg', 326243),
(16, 'assets/videojuegos/screenshots/16.jpg', 41494),
(17, 'assets/videojuegos/screenshots/17.jpg', 41494),
(18, 'assets/videojuegos/screenshots/18.jpg', 41494),
(19, 'assets/videojuegos/screenshots/19.jpg', 41494),
(20, 'assets/videojuegos/screenshots/20.jpg', 41494),
(21, 'assets/videojuegos/screenshots/21.jpg', 22509),
(22, 'assets/videojuegos/screenshots/22.jpg', 22509),
(23, 'assets/videojuegos/screenshots/23.jpg', 22509),
(24, 'assets/videojuegos/screenshots/24.jpg', 22509),
(25, 'assets/videojuegos/screenshots/25.jpg', 22509),
(26, 'assets/videojuegos/screenshots/26.jpg', 22511),
(27, 'assets/videojuegos/screenshots/27.jpg', 22511),
(28, 'assets/videojuegos/screenshots/28.jpg', 22511),
(29, 'assets/videojuegos/screenshots/29.jpg', 22511),
(30, 'assets/videojuegos/screenshots/30.jpg', 22511),
(31, 'assets/videojuegos/screenshots/31.jpg', 9767),
(32, 'assets/videojuegos/screenshots/32.jpg', 9767),
(33, 'assets/videojuegos/screenshots/33.jpg', 9767),
(34, 'assets/videojuegos/screenshots/34.jpg', 9767),
(35, 'assets/videojuegos/screenshots/35.jpg', 9767),
(36, 'assets/videojuegos/screenshots/36.jpeg', 58175),
(37, 'assets/videojuegos/screenshots/37.jpeg', 58175),
(38, 'assets/videojuegos/screenshots/38.jpeg', 58175),
(39, 'assets/videojuegos/screenshots/39.jpg', 58175),
(40, 'assets/videojuegos/screenshots/40.jpeg', 58175),
(41, 'assets/videojuegos/screenshots/41.jpg', 4200),
(42, 'assets/videojuegos/screenshots/42.jpg', 4200),
(43, 'assets/videojuegos/screenshots/43.jpg', 4200),
(44, 'assets/videojuegos/screenshots/44.jpg', 4200),
(45, 'assets/videojuegos/screenshots/45.jpg', 4200),
(46, 'assets/videojuegos/screenshots/46.jpg', 324997),
(47, 'assets/videojuegos/screenshots/47.jpg', 324997),
(48, 'assets/videojuegos/screenshots/48.jpg', 324997),
(49, 'assets/videojuegos/screenshots/49.jpg', 324997),
(50, 'assets/videojuegos/screenshots/50.jpg', 324997),
(51, 'assets/videojuegos/screenshots/51.jpg', 274755),
(52, 'assets/videojuegos/screenshots/52.jpg', 274755),
(53, 'assets/videojuegos/screenshots/53.jpg', 274755),
(54, 'assets/videojuegos/screenshots/54.jpg', 274755),
(55, 'assets/videojuegos/screenshots/55.jpg', 274755),
(56, 'assets/videojuegos/screenshots/56.jpg', 327239),
(57, 'assets/videojuegos/screenshots/57.jpg', 327239),
(58, 'assets/videojuegos/screenshots/58.jpg', 327239),
(59, 'assets/videojuegos/screenshots/59.jpg', 327239),
(60, 'assets/videojuegos/screenshots/60.jpg', 327239),
(61, 'assets/videojuegos/screenshots/61.jpg', 28),
(62, 'assets/videojuegos/screenshots/62.jpg', 28),
(63, 'assets/videojuegos/screenshots/63.jpg', 28),
(64, 'assets/videojuegos/screenshots/64.jpg', 28),
(65, 'assets/videojuegos/screenshots/65.jpg', 28),
(66, 'assets/videojuegos/screenshots/66.jpg', 3498),
(67, 'assets/videojuegos/screenshots/67.jpg', 3498),
(68, 'assets/videojuegos/screenshots/68.jpg', 3498),
(69, 'assets/videojuegos/screenshots/69.jpg', 3498),
(70, 'assets/videojuegos/screenshots/70.jpg', 3498),
(71, 'assets/videojuegos/screenshots/71.jpg', 22121),
(72, 'assets/videojuegos/screenshots/72.jpg', 22121),
(73, 'assets/videojuegos/screenshots/73.jpg', 22121),
(74, 'assets/videojuegos/screenshots/74.jpg', 22121),
(75, 'assets/videojuegos/screenshots/75.jpg', 22121),
(76, 'assets/videojuegos/screenshots/76.jpg', 5538),
(77, 'assets/videojuegos/screenshots/77.jpg', 5538),
(78, 'assets/videojuegos/screenshots/78.jpg', 5538),
(79, 'assets/videojuegos/screenshots/79.jpg', 5538),
(80, 'assets/videojuegos/screenshots/80.jpg', 5538),
(81, 'assets/videojuegos/screenshots/81.jpg', 654),
(82, 'assets/videojuegos/screenshots/82.jpg', 654),
(83, 'assets/videojuegos/screenshots/83.jpg', 654),
(84, 'assets/videojuegos/screenshots/84.jpg', 654),
(85, 'assets/videojuegos/screenshots/85.jpg', 654);

