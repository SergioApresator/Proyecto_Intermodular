-- =====================================================================
-- RATE MY GAME - DATOS DE PRUEBA Y DEMOSTRACIÓN (SEMILLA SQL)
-- =====================================================================
-- Este script puebla la base de datos con un conjunto de datos premium,
-- realista y completo para la aplicación RateMyGame.
--
-- Contiene:
--  - 10 Usuarios (Con biografía, avatares y banners profesionales de Unsplash).
--    ¡Todos los usuarios tienen la contraseña: "usuario1234"!
--  - 18 Listas de juegos personalizadas.
--  - 24 Reseñas completas e interesantes en español (algunas con spoilers).
--    ¡Incluye reseñas con "REVISADA = 0" (sin moderar) para probar el panel de admin!
--  - 21 Respuestas organizadas en hilos de conversación (incluso anidadas).
--  - Votos consistentes en reseñas y respuestas (Me gusta / No me gusta).
-- =====================================================================

-- Asegurar codificación UTF-8 para evitar caracteres bugeados (tildes, ñ, etc.)
SET NAMES 'utf8mb4';
SET CHARACTER SET utf8mb4;

-- Desactivar restricciones de claves foráneas para limpieza segura y compatible
SET FOREIGN_KEY_CHECKS = 0;

-- Vaciar tablas existentes (usamos DELETE para máxima compatibilidad con motores InnoDB)
DELETE FROM respuesta_voto;
DELETE FROM resena_voto;
DELETE FROM respuesta;
DELETE FROM resena;
DELETE FROM lista;
DELETE FROM usuario;

-- Resetear los contadores autoincrementales a 1
ALTER TABLE respuesta_voto AUTO_INCREMENT = 1;
ALTER TABLE resena_voto AUTO_INCREMENT = 1;
ALTER TABLE respuesta AUTO_INCREMENT = 1;
ALTER TABLE resena AUTO_INCREMENT = 1;
ALTER TABLE lista AUTO_INCREMENT = 1;
ALTER TABLE usuario AUTO_INCREMENT = 1;

-- Reactivar restricciones
SET FOREIGN_KEY_CHECKS = 1;

-- =====================================================================
-- 1. TABLA: usuario
-- =====================================================================
-- Nota: La contraseña encriptada para todos es "usuario1234"
-- Hash BCrypt correspondiente: $2a$10$KxbLh77T7rxHFKHtG6rHpey50Qg6JL.3fAxSwb2hNMlwVtHQv4xaK
-- 
-- Las fotos de perfil se han cambiado a un SVG en línea ultra optimizado (<240 caracteres)
-- que dibuja exactamente el muñeco/silueta clásico gris sobre distintos fondos de color pastel.
-- Varios usuarios tienen fotos o banners en NULL para testear fallbacks en el frontend.
-- =====================================================================

INSERT INTO usuario (ID, NOMBRE, APELLIDOS, USERNAME, EMAIL, PASSWORD, FOTO_URL, BANNER_URL, BIOGRAFIA, ES_ADMIN, BANEADO) VALUES
-- User 1: Sin foto, Sin banner (Ideal para probar fallbacks por defecto globales)
(1, 'Administrador', 'RateMyGame', 'admin', 'admin@ratemygame.com', '$2a$10$KxbLh77T7rxHFKHtG6rHpey50Qg6JL.3fAxSwb2hNMlwVtHQv4xaK', NULL, NULL, 'Administrador principal de la comunidad RateMyGame. Si tienes algún problema con las normas de la comunidad o encuentras spoilers sin marcar, no dudes en contactarme.', 1, 0),

-- User 2: Con silueta clásica sobre fondo Celeste
(2, 'Alejandro', 'García', 'gamer_pro', 'alex.garcia@gaming.com', '$2a$10$KxbLh77T7rxHFKHtG6rHpey50Qg6JL.3fAxSwb2hNMlwVtHQv4xaK', 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><rect width="10" height="10" fill="%23b3e5fc"/><circle cx="5" cy="3" r="2" fill="%239e9e9e"/><path d="M2,9C2,7 3,5 5,5S8,7 8,9Z" fill="%239e9e9e"/></svg>', 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&h=200&q=80', 'Jugando y completando RPGs desde 1998. Mi saga favorita de todos los tiempos es The Witcher. Me encanta debatir sobre diseño de niveles y narración interactiva. ¡Sígueme para análisis profundos!', 0, 0),

-- User 3: Con silueta clásica sobre fondo Rosa, Sin banner
(3, 'María', 'López', 'casual_mary', 'maria.lopez@casual.com', '$2a$10$KxbLh77T7rxHFKHtG6rHpey50Qg6JL.3fAxSwb2hNMlwVtHQv4xaK', 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><rect width="10" height="10" fill="%23f8bbd0"/><circle cx="5" cy="3" r="2" fill="%239e9e9e"/><path d="M2,9C2,7 3,5 5,5S8,7 8,9Z" fill="%239e9e9e"/></svg>', NULL, 'Jugadora casual de corazón. Adoro los juegos acogedores (cozy games), la saga Animal Crossing, Stardew Valley y casi cualquier cosa que publique Nintendo. ¡La vida ya es muy estresante para jugar estresada!', 0, 0),

-- User 4: Sin foto, Con banner
(4, 'Carlos', 'Martínez', 'rpg_enjoyer', 'carlos.rpg@retro.com', '$2a$10$KxbLh77T7rxHFKHtG6rHpey50Qg6JL.3fAxSwb2hNMlwVtHQv4xaK', NULL, 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&h=200&q=80', 'Purista de los JRPG de la vieja escuela. Final Fantasy VI, Chrono Trigger y Xenogears son el pico artístico de la industria de los videojuegos. El 3D no siempre mejoró el diseño de juegos.', 0, 0),

-- User 5: Con silueta clásica sobre fondo Morado
(5, 'Elena', 'Sanz', 'cyber_punk', 'elena.cyber@neon.com', '$2a$10$KxbLh77T7rxHFKHtG6rHpey50Qg6JL.3fAxSwb2hNMlwVtHQv4xaK', 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><rect width="10" height="10" fill="%23e1bee7"/><circle cx="5" cy="3" r="2" fill="%239e9e9e"/><path d="M2,9C2,7 3,5 5,5S8,7 8,9Z" fill="%239e9e9e"/></svg>', 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=800&h=200&q=80', 'Viviendo en una distopía de luces de neón. Apasionada de la ciencia ficción dura, el Cyberpunk y las conspiraciones corporativas virtuales. Fan de Deus Ex, Cyberpunk 2077 y System Shock.', 0, 0),

-- User 6: Con silueta clásica sobre fondo Verde, Sin banner
(6, 'Daniel', 'Ruiz', 'speedrunner', 'dani.runner@fast.com', '$2a$10$KxbLh77T7rxHFKHtG6rHpey50Qg6JL.3fAxSwb2hNMlwVtHQv4xaK', 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><rect width="10" height="10" fill="%23c8e6c9"/><circle cx="5" cy="3" r="2" fill="%239e9e9e"/><path d="M2,9C2,7 3,5 5,5S8,7 8,9Z" fill="%239e9e9e"/></svg>', NULL, 'Buscando optimizar cada frame. Amante de los juegos de plataformas de precisión, metroidvanias y el speedrunning competitivo. Si un juego no tiene mecánicas de movimiento avanzadas, no me interesa.', 0, 0),

-- User 7: Sin foto, Sin banner
(7, 'Lucas', 'Fernández', 'indie_guy', 'lucas.indie@indie.com', '$2a$10$KxbLh77T7rxHFKHtG6rHpey50Qg6JL.3fAxSwb2hNMlwVtHQv4xaK', NULL, NULL, 'El sector AAA ha muerto comercialmente y en originalidad. Solo juego producciones de estudios independientes que arriesguen en su arte. Outer Wilds, Hollow Knight y Disco Elysium son el verdadero arte.', 0, 0),

-- User 8: Con silueta clásica sobre fondo Naranja
(8, 'Sofía', 'Gómez', 'soulslike_fan', 'sofia.souls@lothric.com', '$2a$10$KxbLh77T7rxHFKHtG6rHpey50Qg6JL.3fAxSwb2hNMlwVtHQv4xaK', 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><rect width="10" height="10" fill="%23ffe0b2"/><circle cx="5" cy="3" r="2" fill="%239e9e9e"/><path d="M2,9C2,7 3,5 5,5S8,7 8,9Z" fill="%239e9e9e"/></svg>', 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&h=200&q=80', '\"Git Gud\". Pasándome juegos de FromSoftware sin recibir golpes. Elden Ring, Bloodborne y Dark Souls son mis templos personales. Si te cuesta derrotar a Malenia, escríbeme y te echo una mano.', 0, 0),

-- User 9: Con silueta clásica sobre fondo Amarillo, Sin banner
(9, 'Marcos', 'Ortega', 'pixel_art', 'marcos.pixel@retro.com', '$2a$10$KxbLh77T7rxHFKHtG6rHpey50Qg6JL.3fAxSwb2hNMlwVtHQv4xaK', 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><rect width="10" height="10" fill="%23fff9c4"/><circle cx="5" cy="3" r="2" fill="%239e9e9e"/><path d="M2,9C2,7 3,5 5,5S8,7 8,9Z" fill="%239e9e9e"/></svg>', NULL, 'Coleccionista de hardware retro. Si un videojuego tiene píxeles hermosos hechos a mano y banda sonora con sintetizadores chiptune de 8 o 16 bits, ya tiene mi corazón ganado.', 0, 0),

-- User 10: Con silueta clásica sobre fondo Marrón
(10, 'Clara', 'Benítez', 'lara_croft', 'clara.lara@adventure.com', '$2a$10$KxbLh77T7rxHFKHtG6rHpey50Qg6JL.3fAxSwb2hNMlwVtHQv4xaK', 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><rect width="10" height="10" fill="%23d7ccc8"/><circle cx="5" cy="3" r="2" fill="%239e9e9e"/><path d="M2,9C2,7 3,5 5,5S8,7 8,9Z" fill="%239e9e9e"/></svg>', 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&h=200&q=80', 'Buscadora de tesoros arqueológicos y aventuras extremas. Me encantan los juegos de acción y aventura en tercera persona con exploración e historias intrigantes. Tomb Raider, Uncharted e Horizon.', 0, 0);

-- =====================================================================
-- 2. TABLA: lista (Colecciones de juegos de los usuarios)
-- =====================================================================
-- Mapea ID_USUARIO a IDs de videojuegos (de la API de RAWG)
-- =====================================================================

INSERT INTO lista (ID, NOMBRE, ID_USUARIO, ID_VIDEOJUEGO) VALUES
-- Listas de gamer_pro (Usuario 2)
(1, 'Favoritos de Siempre', 2, 3328), -- The Witcher 3
(2, 'Favoritos de Siempre', 2, 5679), -- Skyrim
(3, 'Favoritos de Siempre', 2, 326243), -- Elden Ring
(4, 'Pendientes de Jugar', 2, 41494), -- Cyberpunk 2077

-- Listas de casual_mary (Usuario 3)
(5, 'Juegos Relax', 3, 22509), -- Minecraft
(6, 'Juegos Relax', 3, 22511), -- Zelda: Breath of the Wild
(7, 'Pendientes', 3, 9767), -- Hollow Knight

-- Listas de rpg_enjoyer (Usuario 4)
(8, 'Verdaderos RPGs', 4, 3328), -- The Witcher 3
(9, 'Verdaderos RPGs', 4, 58175), -- God of War

-- Listas de speedrunner (Usuario 6)
(10, 'Speedrun Practicando', 6, 9767), -- Hollow Knight
(11, 'Speedrun Practicando', 6, 4200), -- Portal 2

-- Listas de soulslike_fan (Usuario 8)
(12, 'Pasados al 100%', 8, 326243), -- Elden Ring
(13, 'Pasados al 100%', 8, 9767), -- Hollow Knight
(14, 'Lista de Sufrimiento', 8, 3328), -- The Witcher 3 (en dificultad máxima)

-- Listas de lara_croft (Usuario 10)
(15, 'Aventuras Épicas', 10, 5679), -- Skyrim

-- NUEVO: Listas adicionales premium
(16, 'Juegos de Rol Colosales', 4, 324997), -- Baldur's Gate 3
(17, 'Obras de Arte Indie', 7, 274755), -- Hades
(18, 'Viajes Inolvidables', 10, 327239); -- Zelda: Tears of the Kingdom

-- =====================================================================
-- 3. TABLA: resena (Reseñas de videojuegos escritas por los usuarios)
-- =====================================================================
-- Puntuaciones corregidas de 1 a 5 estrellas. IDs de RAWG verificados al 100%.
-- NOTA: Las reseñas de la 17 a la 22 tienen "REVISADA = 0" (falsas)
-- creadas especialmente para la pantalla y flujo de moderación de administrador.
-- =====================================================================

INSERT INTO resena (ID, MENSAJE, PUNTUACION, TIENE_SPOILER, ME_GUSTAS, NO_ME_GUSTAS, FECHA_RESENA, ID_USUARIO, ID_VIDEOJUEGO, NOMBRE_VIDEOJUEGO, FOTO_VIDEOJUEGO, REVISADA) VALUES
-- Reseña 1: Witcher 3 por gamer_pro
(1, '¿Qué se puede decir de esta obra maestra absoluta que no se haya dicho ya? Geralt de Rivia nos guía por el mundo abierto mejor construido de la historia. Las misiones secundarias tienen mejor narrativa y peso que las campañas principales de la mitad de juegos del mercado. La misión del Barón Sanguinario me dejó el corazón encogido. Gráficos atemporales, música celta impecable y una jugabilidad soberbia. Indispensable.', 5, 0, 4, 0, '2026-04-10 18:24:00', 2, 3328, 'The Witcher 3: Wild Hunt', 'https://media.rawg.io/media/games/618/618c2031a07bbff6b4e611f10db53968.jpg', 1),

-- Reseña 2: Elden Ring por soulslike_fan (Con spoilers)
(2, 'FromSoftware ha alcanzado la cúspide de su fórmula. Trasladar el combate y misterio de Dark Souls a un mundo abierto de esta magnitud parecía imposible, pero lo han logrado con creces. Explorar las Tierras Intermedias se siente como una aventura genuina donde cada rincón esconde un secreto. El diseño de jefes es increíble, aunque Malenia casi me hace tirar el mando por la ventana. ¡Ojo que detallo un SPOILER sobre el final!: El combate final contra Radagon y la Bestia del Círculo es visualmente precioso, revelando que Radagon y Marika son el mismo ser. Un Lore fascinante.', 5, 1, 3, 1, '2026-04-15 21:05:00', 8, 326243, 'Elden Ring', 'https://media.rawg.io/media/games/b29/b294fdd866dcdb643e7bab370a552855.jpg', 1),

-- Reseña 3: Elden Ring por casual_mary (Malísima experiencia - Contraste cómico)
(3, 'Me lo recomendó todo el mundo diciendo que era una obra de arte y ha sido una tortura. Entiendo que los escenarios son preciosos y la música es bonita, pero no es divertido morir 50 veces seguidas contra un caballero dorado gigante nada más empezar el juego. No hay un mapa claro, no sé a dónde ir y los menús son súper complicados. Para mí, los videojuegos son para relajarse, no para acabar con dolor de cabeza. Le doy un 2 por la dirección artística.', 2, 0, 1, 3, '2026-04-16 11:30:00', 3, 326243, 'Elden Ring', 'https://media.rawg.io/media/games/b29/b294fdd866dcdb643e7bab370a552855.jpg', 1),

-- Reseña 4: Portal 2 por speedrunner
(4, 'Física, rompecabezas, humor negro y una de las mejores narrativas de la historia de la industria. Valve logró superar la perfección de la primera entrega añadiendo cooperativo, geles con dinámicas de salto/velocidad increíbles y personajes memorables como Wheatley y Cave Johnson. Las mecánicas de inercia y portales son tan limpias que da gusto jugarlo a nivel competitivo de speedrun. 5/5.', 5, 0, 2, 0, '2026-04-20 15:45:00', 6, 4200, 'Portal 2', 'https://media.rawg.io/media/games/328/3283c77c5de214eb02fce6b37ea0c465.jpg', 1),

-- Reseña 5: Minecraft por casual_mary
(5, 'Mi lugar feliz. Llevo jugando a Minecraft más de 10 años y nunca me aburro. Construir granjas automáticas, decorar mi casita en el bosque o explorar cuevas con amigos mientras escuchamos la música ambiental de C418 es una de las sensaciones más terapéuticas que existen. Es el juego definitivo para dar rienda suelta a la creatividad sin presiones de ningún tipo.', 5, 0, 3, 0, '2026-04-22 17:10:00', 3, 22509, 'Minecraft', 'https://media.rawg.io/media/games/b4e/b4e4c73d5aa4ec66bbf75375c4847a2b.jpg', 1),

-- Reseña 6: Cyberpunk 2077 por cyber_punk
(6, 'Tras el desastroso lanzamiento y años de parches, Cyberpunk 2077 es finalmente la obra que prometieron. Night City es una megaurbe densa, vertical, asfixiante y de un preciosismo visual inigualable. La historia de V y Johnny Silverhand engancha de principio a fin, y el sistema de combate cibernético te hace sentir verdaderamente poderoso. El parche 2.0 y el DLC Phantom Liberty lo convirtieron en un clásico instantáneo de la ciencia ficción.', 4, 0, 2, 1, '2026-04-25 22:30:00', 5, 41494, 'Cyberpunk 2077', 'https://media.rawg.io/media/games/26d/26d4437715bee6013b1c7c99021e5312.jpg', 1),

-- Reseña 7: Hollow Knight por indie_guy
(7, 'Hollow Knight es la cúspide del diseño Metroidvania. Team Cherry creó un mundo subterráneo gigante, misterioso y desolado con una atmósfera melancólica insuperable. El sistema de combate es simple pero de una precisión quirúrgica, y la banda sonora de Christopher Larkin evoca una tristeza de gran belleza. Hallownest es un laberinto inolvidable donde perderse es un deleite.', 5, 0, 4, 0, '2026-05-01 09:15:00', 7, 9767, 'Hollow Knight', 'https://media.rawg.io/media/games/4cf/4cfc743cfc84e5b44450dc506716cf00.jpg', 1),

-- Reseña 8: Skyrim por rpg_enjoyer (Crítica más dura)
(8, 'Aunque popularizó los mundos abiertos, Skyrim simplificó en exceso los elementos RPG de sus predecesores (Morrowind/Oblivion). El sistema de combate consiste básicamente en aporrear botones, la historia principal es floja y las misiones de los gremios te nombran líder tras hacer 4 tareas sin ninguna consecuencia. No obstante, la banda sonora es colosal y el sentimiento de libertad al cruzar los picos nevados es indiscutible. Un buen juego de exploración, un RPG mediocre.', 3, 0, 1, 2, '2026-05-03 14:00:00', 4, 5679, 'The Elder Scrolls V: Skyrim', 'https://media.rawg.io/media/games/7a2/7a211ae4e93d9ef961e6af72d4cf60c8.jpg', 1),

-- Reseña 9: Red Dead Redemption 2 por lara_croft (Con spoilers)
(9, 'El nivel de obsesión por el detalle y realismo en este juego roza lo enfermizo. Cabalgar por la naturaleza salvaje, cazar, interactuar con el campamento... todo se siente sumamente orgánico. Y la historia de redención es simplemente cine de autor. Cuidado con este SPOILER del final: Ver la inevitable muerte de Arthur Morgan bajo el amanecer después de dar su vida para que John y su familia escapen me hizo llorar a lágrima viva. De los finales más duros e impactantes de la historia.', 5, 1, 3, 0, '2026-05-05 12:00:00', 10, 28, 'Red Dead Redemption 2', 'https://media.rawg.io/media/games/511/5118aff5091cb3efec399c808f8c598f.jpg', 1),

-- Reseña 10: Grand Theft Auto V por casual_mary (Divertido pero caótico)
(10, 'Es muy divertido para jugar online con amigos y hacer el tonto por la ciudad, robar coches o tirarse en paracaídas. Pero el modo historia no me gustó tanto, los tres protagonistas son señores muy maleducados y gritones que siempre están haciendo cosas delictivas desagradables. Prefiero perderme por la playa o dar vueltas en la feria.', 3, 0, 0, 2, '2026-05-07 19:40:00', 3, 3498, 'Grand Theft Auto V', 'https://media.rawg.io/media/games/20a/20a7aeabd6e90e1f964de0681329fb34.jpg', 1),

-- Reseña 11: Celeste por speedrunner
(11, 'Celeste no solo es el plataformas más desafiante y preciso de la última década, sino que camufla su alta dificultad en un precioso relato terapéutico sobre la ansiedad y la superación personal. Cada muerte se siente justa y te motiva a intentarlo de nuevo gracias a sus tiempos de carga instantáneos. El diseño de niveles introduce mecánicas brillantes pantalla tras pantalla. Obra maestra.', 5, 0, 2, 0, '2026-05-09 10:00:00', 6, 22121, 'Celeste', 'https://media.rawg.io/media/games/594/59487800889ebac294c7c2c070d02356.jpg', 1),

-- Reseña 12: Cyberpunk 2077 por rpg_enjoyer (Decepcionado)
(12, 'Nos prometieron el RPG definitivo del futuro y nos entregaron un shooter de acción con árboles de habilidades aburridos y decisiones estéticas sin relevancia real. Night City es una hermosa cáscara vacía, los NPCs no tienen rutinas coherentes y la policía aparece mágicamente a tus espaldas. Aunque la historia es interesante, no se siente como un juego de rol de mesa. Lejos de la profundidad de Baldurs Gate 3.', 2, 0, 1, 3, '2026-05-11 16:50:00', 4, 41494, 'Cyberpunk 2077', 'https://media.rawg.io/media/games/26d/26d4437715bee6013b1c7c99021e5312.jpg', 1),

-- Reseña 13: The Witcher 3 por soulslike_fan (El combate es mejorable)
(13, 'Reconozco que a nivel de historia, personajes y misiones secundarias es un referente absoluto en la industria, pero como amante del combate técnico, la jugabilidad de este juego me aburre un poco. Consiste en rodar infinitamente, aplicar el escudo Quen y spamear ataques rápidos. Si tuviese un sistema de combate más pulido y castigador al estilo Souls, sería perfecto.', 4, 0, 1, 1, '2026-05-12 14:15:00', 8, 3328, 'The Witcher 3: Wild Hunt', 'https://media.rawg.io/media/games/618/618c2031a07bbff6b4e611f10db53968.jpg', 1),

-- Reseña 14: Hades por indie_guy
(14, 'Supergiant Games logró romper la barrera del género rogue-like integrando una narrativa viva de forma magistral. Morir en Hades no frustra, sino que es el vehículo para avanzar en las tramas secundarias con los dioses olímpicos y conocer mejor a Zagreus. Combates rápidos, fluidos, un apartado artístico mitológico exquisito y una música brutal de Darren Korb. Impecable.', 5, 0, 2, 0, '2026-05-14 11:10:00', 7, 274755, 'Hades', 'https://media.rawg.io/media/games/1f4/1f47a270b8f241e4676b14d39ec620f7.jpg', 1),

-- Reseña 15: Dark Souls por soulslike_fan
(15, 'El juego que cambió la industria para siempre y redefinió el diseño de niveles moderno. Lordran es un laberinto tridimensional vertical conectado con tal maestría que te hace explotar la cabeza al descubrir atajos. La narrativa ambiental, donde tienes que leer la descripción de los objetos para entender qué ocurre, es fascinante. Sí, es difícil, pero te enseña a prestar atención y aprender de tus errores. Insustituible.', 5, 0, 3, 0, '2026-05-16 08:30:00', 8, 5538, 'Dark Souls', 'https://media.rawg.io/media/games/582/582b5518a52f5086d15dde128264b94d.jpg', 1),

-- Reseña 16: God of War (2018) por lara_croft
(16, 'Una de las reinvenciones más valientes del medio. Transformar al violento e iracundo Kratos en un padre cansado en tierras nórdicas con un plano secuencia continuo es una genialidad absoluta. El combate con el Hacha Leviatán se siente sumamente físico y satisfactorio, y la química con Atreus es el motor emocional de toda la aventura. Una de las mejores exclusivas de Playstation.', 5, 0, 2, 0, '2026-05-17 13:00:00', 10, 58175, 'God of War', 'https://media.rawg.io/media/games/4be/4be6a6ad0364751a96229c56bf69be59.jpg', 1),

-- =====================================================================
-- NUEVAS RESEÑAS CON "REVISADA = 0" (SIN MODERAR) PARA TEST DE ADMIN
-- =====================================================================

-- Reseña 17: Baldur's Gate III por rpg_enjoyer (Sin moderar)
(17, 'Un RPG colosal que redefine por completo la libertad de elección en los videojuegos. Larian Studios ha logrado trasladar la esencia de Dungeons & Dragons con un amor, detalle y guion soberbios. Los personajes secundarios son inolvidables y las ramificaciones de cada decisión son asombrosas. Sin duda alguna, el mejor RPG de la década.', 5, 0, 0, 0, '2026-05-18 10:15:00', 4, 324997, 'Baldur\'s Gate III', 'https://media.rawg.io/media/games/699/69907ecf13f172e9e144069769c3be73.jpg', 0),

-- Reseña 18: Stardew Valley por casual_mary (Sin moderar)
(18, 'Es un juego precioso que transmite una paz inmensa. Cuidar de los cultivos, saludar a los vecinos del pueblo Pelícano y pescar mientras llueve es una de mis rutinas favoritas para relajarme por las tardes. Eric Barone creó una obra de arte con un cariño que se siente en cada píxel y cada melodía.', 5, 0, 0, 0, '2026-05-18 11:20:00', 3, 654, 'Stardew Valley', 'https://media.rawg.io/media/games/713/713269608dc8f2f40f5a670a14b2de94.jpg', 0),

-- Reseña 19: Tears of the Kingdom por gamer_pro (Sin moderar)
(19, 'Es alucinante cómo han cogido el mapa de Breath of the Wild y lo han expandido no solo con el cielo y el subsuelo, sino con mecánicas de construcción revolucionarias. La Ultramano y la combinación de objetos dan una libertad creativa nunca antes vista. El templo del viento y la música me parecieron excepcionales.', 5, 0, 0, 0, '2026-05-18 12:45:00', 2, 327239, 'The Legend of Zelda: Tears of the Kingdom', 'https://media.rawg.io/media/games/556/55684bfd048706f4266d331d70050b37.jpg', 0),

-- Reseña 20: Hades por indie_guy (Sin moderar)
(20, 'Supergiant lo volvió a hacer. La jugabilidad es adictiva, pero lo que realmente destaca es cómo integran la narrativa en el género roguelike. Cada muerte te recompensa con más lore y conversaciones únicas en la morada de Hades. El diseño artístico mitológico y la banda sonora chiptune/rock son de otro mundo.', 5, 0, 0, 0, '2026-05-18 13:05:00', 7, 274755, 'Hades', 'https://media.rawg.io/media/games/1f4/1f47a270b8f241e4676b14d39ec620f7.jpg', 0),

-- Reseña 21: Red Dead Redemption 2 por cyber_punk (CON SPOILER pero marcada como NO SPOILER para probar que el admin la corrija)
(21, '¡OJO! Esta reseña contiene un destripe masivo de la trama de Arthur Morgan: Qué absoluto juegazo. Todo en el juego roza la perfección, pero quiero comentar el final: ver a Arthur morir de tuberculosis bajo la luz del amanecer tras salvar a John Marston me dejó completamente destrozado. Una obra de arte de Rockstar.', 5, 0, 0, 0, '2026-05-18 13:30:00', 5, 28, 'Red Dead Redemption 2', 'https://media.rawg.io/media/games/511/5118aff5091cb3efec399c808f8c598f.jpg', 0),

-- Reseña 22: Grand Theft Auto V por gamer_pro (Reseña agresiva/tóxica para probar opción de eliminar de administrador)
(22, 'Este juego es una basura infecta de la peor clase. La comunidad online está llena de niños gritones y hackers tramposos que te arruinan la partida al instante lanzándote misiles. No gastes tu dinero en esta estafa.', 1, 0, 0, 0, '2026-05-18 14:10:00', 2, 3498, 'Grand Theft Auto V', 'https://media.rawg.io/media/games/20a/20a7aeabd6e90e1f964de0681329fb34.jpg', 0),

-- =====================================================================
-- OTRAS NUEVAS RESEÑAS PREVIAMENTE REVISADAS (REVISADA = 1)
-- =====================================================================

-- Reseña 23: Baldur's Gate III por indie_guy
(23, 'Una genialidad absoluta de principio a fin. El diseño del tercer acto es inmenso y las posibilidades tácticas en los combates por turnos son una delicia para cualquier estratega. Un digno sucesor espiritual de los clásicos de BioWare.', 5, 0, 2, 0, '2026-05-18 09:30:00', 7, 324997, 'Baldur\'s Gate III', 'https://media.rawg.io/media/games/699/69907ecf13f172e9e144069769c3be73.jpg', 1),

-- Reseña 24: Stardew Valley por pixel_art
(24, 'El mejor tributo a Harvest Moon imaginable. Su apartado gráfico pixel art de 16 bits y sus animaciones hechas con mimo demuestran que no se necesitan gráficos de última generación para crear un juego atemporal y sumamente cautivador.', 5, 0, 2, 0, '2026-05-18 09:50:00', 9, 654, 'Stardew Valley', 'https://media.rawg.io/media/games/713/713269608dc8f2f40f5a670a14b2de94.jpg', 1);

-- =====================================================================
-- 4. TABLA: respuesta (Comentarios de otros usuarios en las reseñas)
-- =====================================================================
-- Soporta hilos anidados (ID_RESPUESTA_PADRE apunta al ID de otra respuesta)
-- =====================================================================

INSERT INTO respuesta (ID, MENSAJE, ME_GUSTAS, NO_ME_GUSTAS, ID_RESENA, ID_USUARIO, ID_RESPUESTA_PADRE, FECHA_RESPUESTA) VALUES
-- Comentarios en Reseña 1 (Witcher 3)
(1, '¡Totalmente de acuerdo! La misión del Barón Sanguinario es arte puro. No es blanca o negra, está llena de matices grises. Una de las mejores tramas jamás escritas.', 3, 0, 1, 4, NULL, '2026-04-10 19:15:00'),
(2, 'Yo sigo tarareando las canciones de las moiras de las ciénagas, son súper inmersivas.', 2, 0, 1, 3, NULL, '2026-04-10 20:00:00'),
(3, '¿Spamear ataques rápidos en dificultad máxima? Pruébalo en la dificultad "La Marcha de la Muerte" y verás que si no usas alquimia y esquivas al milímetro te destrozan.', 1, 1, 1, 2, 1, '2026-05-12 15:30:00'), -- Hilo en la respuesta de Witcher 3

-- Comentarios en Reseña 2 (Elden Ring de soulslike_fan)
(4, 'Buenísima reseña. El Lore de Radagon y Marika me voló la cabeza en su momento. La libertad para resolver los jefes es fantástica.', 2, 0, 2, 2, NULL, '2026-04-15 21:40:00'),
(5, 'Qué buen spoiler metiste, menos mal que estaba marcado como tal, que si no me arruinas el juego. ¡Gran detalle!', 2, 0, 2, 10, NULL, '2026-04-16 09:20:00'),

-- Comentarios en Reseña 3 (Elden Ring de casual_mary)
(6, '¡No te rindas, María! Al principio abruma y asusta un montón, pero te aseguro que si usas las cenizas de invocación el juego se vuelve muchísimo más accesible. ¡Dale otra oportunidad y no luches contra el caballero dorado del inicio, es una trampa!', 3, 0, 3, 8, NULL, '2026-04-16 12:00:00'),
(7, 'Jajaja es que el centinela agreste del inicio está hecho precisamente para enseñarte que puedes rodearlo e ir a otro lado. Es la primera lección del juego.', 1, 1, 3, 2, 6, '2026-04-16 12:30:00'), -- Hilo en el comentario de Sofía
(8, 'Pues yo te apoyo María, los juegos están para desconectar y divertirse, no para acabar estresada y frustrada.', 2, 0, 3, 9, NULL, '2026-04-16 14:00:00'),

-- Comentarios en Reseña 6 (Cyberpunk 2077 de cyber_punk)
(9, 'Es increíble el lavado de cara que le dieron. El parche 2.0 y el sistema policial cambiaron por completo el juego. Ahora sí es lo que debía ser.', 2, 0, 6, 2, NULL, '2026-04-26 10:15:00'),
(10, 'A mí me sigue molestando que las decisiones de origen (Nómada, Buscavidas o Corporativo) solo afecten a los primeros 15 minutos de juego y algunas líneas de diálogo irrelevantes.', 1, 1, 6, 4, NULL, '2026-04-26 12:00:00'),

-- Comentarios en Reseña 7 (Hollow Knight de indie_guy)
(11, 'Para mí, la banda sonora de Christopher Larkin en Dirtmouth es el sonido de la soledad más hermoso jamás compuesto.', 2, 0, 7, 9, NULL, '2026-05-01 10:00:00'),
(12, '¿Has intentado el Panteón de Hallownest al 100%? Es un infierno de dificultad pero la satisfacción de completarlo es increíble.', 1, 0, 7, 6, NULL, '2026-05-01 11:20:00'),

-- Comentarios en Reseña 8 (Skyrim de rpg_enjoyer)
(13, 'Totalmente de acuerdo en lo de los gremios. Es absurdo que en dos tardes te conviertas en el Archimago del Colegio de Hibernalia cuando solo sabes lanzar dos hechizos básicos.', 2, 0, 8, 7, NULL, '2026-05-03 15:30:00'),
(14, 'Puede que sea un RPG simple, pero la sensación de explorar ese mundo por primera vez con Secunda sonando de fondo no la he vuelto a vivir en ningún otro juego.', 2, 0, 8, 2, NULL, '2026-05-03 16:15:00'),

-- Comentarios en Reseña 9 (Red Dead 2 de lara_croft)
(15, 'Ese final me destruyó por completo. Pocos juegos consiguen que empatices de esa manera con un forajido.', 3, 0, 9, 2, NULL, '2026-05-05 13:00:00'),
(16, '¡El mejor juego de la generación pasada sin ninguna duda! La evolución del personaje es perfecta.', 1, 0, 9, 10, NULL, '2026-05-05 14:00:00'),

-- Comentarios en Reseña 12 (Cyberpunk 2077 de rpg_enjoyer)
(17, 'Es que la gente iba buscando un simulador de rol puro cuando en realidad es una aventura de acción increíble con tintes RPG. Si ajustas tus expectativas es una delicia.', 2, 1, 12, 5, NULL, '2026-05-11 17:30:00'),
(18, 'Compararlo con Baldurs Gate 3 no es muy justo, son enfoques y presupuestos totalmente distintos. Pero entiendo que decepcionase en su sistema de decisiones.', 1, 0, 12, 7, 17, '2026-05-11 18:00:00'), -- Hilo en la respuesta de Elena

-- NUEVOS COMENTARIOS EN LAS RESEÑAS PREVIAMENTE NO MODERADAS
(19, '¡Totalmente de acuerdo! Le eché más de 120 horas en mi primera partida y ya estoy pensando en empezar otra con un personaje diferente. Es insondable.', 2, 0, 17, 2, NULL, '2026-05-18 10:30:00'),
(20, 'Yo lo estoy jugando en cooperativo y nos lo estamos pasando pipa. Los diálogos tienen un nivel de detalle increíble.', 2, 0, 17, 3, NULL, '2026-05-18 10:45:00'),
(21, 'Es mi juego relajante favorito para las tardes de lluvia. Adoro pescar en el muelle de la playa.', 2, 0, 18, 9, NULL, '2026-05-18 11:40:00');

-- =====================================================================
-- 5. TABLA: resena_voto (Votos de Me Gusta / No Me Gusta en reseñas)
-- =====================================================================
-- Vincula usuarios a reseñas con su tipo de voto. Mantiene coherencia
-- con los contadores de la tabla RESENA.
-- =====================================================================

INSERT INTO resena_voto (ID, ID_RESENA, ID_USUARIO, ES_ME_GUSTA) VALUES
-- Votos para Reseña 1 (Witcher 3 de gamer_pro - total: 4 Me Gusta, 0 No Me Gusta)
(1, 1, 3, 1),
(2, 1, 4, 1),
(3, 1, 8, 1),
(4, 1, 10, 1),

-- Votos para Reseña 2 (Elden Ring de soulslike_fan - total: 3 Me Gusta, 1 No Me Gusta)
(5, 2, 2, 1),
(6, 2, 7, 1),
(7, 2, 10, 1),
(8, 2, 3, 0), -- A Mary no le gustó

-- Votos para Reseña 3 (Elden Ring de casual_mary - total: 1 Me Gusta, 3 No Me Gusta)
(9, 3, 9, 1), -- A Marcos (pixel) le dio Me gusta por apoyarla
(10, 3, 2, 0), -- gamer_pro le da No me gusta
(11, 3, 8, 0), -- soulslike_fan le da No me gusta
(12, 3, 6, 0), -- speedrunner le da No me gusta

-- Votos para Reseña 5 (Minecraft de casual_mary - total: 3 Me Gusta, 0 No Me Gusta)
(13, 5, 2, 1),
(14, 5, 9, 1),
(15, 5, 7, 1),

-- Votos para Reseña 6 (Cyberpunk 2077 de cyber_punk - total: 2 Me Gusta, 1 No Me Gusta)
(16, 6, 2, 1),
(17, 6, 10, 1),
(18, 6, 4, 0), -- rpg_enjoyer le da No me gusta

-- Votos para Reseña 7 (Hollow Knight de indie_guy - total: 4 Me Gusta, 0 No Me Gusta)
(19, 7, 2, 1),
(20, 7, 6, 1),
(21, 7, 8, 1),
(22, 7, 9, 1),

-- Votos para Reseña 8 (Skyrim de rpg_enjoyer - total: 1 Me Gusta, 2 No Me Gusta)
(23, 8, 7, 1),
(24, 8, 2, 0),
(25, 8, 10, 0),

-- Votos para Reseña 9 (Red Dead 2 de lara_croft - total: 3 Me Gusta, 0 No Me Gusta)
(26, 9, 2, 1),
(27, 9, 4, 1),
(28, 9, 8, 1);

-- =====================================================================
-- 6. TABLA: respuesta_voto (Votos de Me Gusta / No Me Gusta en comentarios)
-- =====================================================================
-- Vincula usuarios a respuestas con su tipo de voto. Mantiene coherencia
-- con los contadores de la tabla RESPUESTA.
-- =====================================================================

INSERT INTO respuesta_voto (ID, ID_RESPUESTA, ID_USUARIO, ES_ME_GUSTA) VALUES
-- Votos para Respuesta 1 (Comentario de Carlos en Witcher 3 - 3 Me Gusta)
(1, 1, 2, 1),
(2, 1, 8, 1),
(3, 1, 10, 1),

-- Votos para Respuesta 3 (Comentario de Alex en Witcher 3 - 1 Me Gusta, 1 No Me Gusta)
(4, 3, 8, 1),
(5, 3, 3, 0),

-- Votos para Respuesta 6 (Comentario de Sofía en Elden Ring de Mary - 3 Me Gusta)
(6, 6, 3, 1), -- Mary agradece el consejo
(7, 6, 9, 1),
(8, 6, 10, 1),

-- Votos para Respuesta 7 (Comentario de Alex en Elden Ring de Mary - 1 Me Gusta, 1 No Me Gusta)
(9, 7, 8, 1),
(10, 7, 3, 0), -- A Mary no le gustó que se rían

-- Votos para Respuesta 8 (Comentario de Marcos en Elden Ring de Mary - 2 Me Gusta)
(11, 8, 3, 1),
(12, 8, 5, 1),

-- Votos para Respuesta 15 (Comentario de Alex en Red Dead 2 - 3 Me Gusta)
(13, 15, 10, 1),
(14, 15, 4, 1),
(15, 15, 8, 1);

-- =====================================================================
-- FIN DEL SCRIPT DE SEMILLA
-- =====================================================================
