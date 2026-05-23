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

-- NUEVOS VIDEOJUEGOS AÑADIDOS AUTOMÁTICAMENTE
INSERT INTO videojuego (ID, NAME, RATING, METACRITIC, RELEASED, BACKGROUND_IMAGE, added_count, description, description_raw) VALUES
(12020, 'Left 4 Dead 2', 4.1, 89, '2009-11-17', 'assets/videojuegos/12020.jpg', 17510, '<p>Cooperative survival continues with a different set of characters. New survivors are making their way through 5 campaigns with an added ability to play through the story of the first game as well, using not only expanded arsenal of 20 ranged and 10 melee weapons but improved AI Director. Your surroundings and weather will change; enemy and item placement will differ from map to map, from difficulty to difficulty. New unique special zombies, placed in the unlucky for the player spot, can end your run.<br />
High compatibility with community mods will allow you not only to add user-created maps but player models, enemy models, and even in-game music, which will help any player to create the unique experience on top of solid game mechanics.<br />
Competitive multiplayer mods from arena survival to a head-on competition with another team of survivors are addictive and, in addition to the campaign, will provide you with hundreds of hours of game content.</p>', 'Cooperative survival continues with a different set of characters. New survivors are making their way through 5 campaigns with an added ability to play through the story of the first game as well, using not only expanded arsenal of 20 ranged and 10 melee weapons but improved AI Director. Your surroundings and weather will change; enemy and item placement will differ from map to map, from difficulty to difficulty. New unique special zombies, placed in the unlucky for the player spot, can end your run.

High compatibility with community mods will allow you not only to add user-created maps but player models, enemy models, and even in-game music, which will help any player to create the unique experience on top of solid game mechanics.

Competitive multiplayer mods from arena survival to a head-on competition with another team of survivors are addictive and, in addition to the campaign, will provide you with hundreds of hours of game content.'),
(50734, 'Sekiro: Shadows Die Twice', 4.38, 90, '2019-03-22', 'assets/videojuegos/50734.jpg', 8394, '<p>Sekiro: Shadows Die Twice is a game about a ninja (or shinobi, as they call it), who is seeking revenge in the Sengoku era Japan.</p>
<h3>Plot</h3>
<p>The game is set in the 16th century in a fictionalized version of Japan. The main protagonist is a member of a shinobi clan. A samurai from the rival Ashina clan captured the protagonist&#39;s master, and the protagonist himself lost his arm trying to protect his leader. However, a sculptor of Buddha statues managed to replace the lost limb with an advanced prosthetic arm. The protagonist accepted a new name, Sekiro, meaning “one-armed wolf”. Now his goal is to avenge his clan and to save his leader from the hands of their enemies.</p>
<h3>Gameplay</h3>
<p>The player controls Sekiro from the third person view and navigates the character as he fights multiple enemies. Sekiro: Shadows Die Twice features an innovative combat system that doesn&#39;t use hit points. Instead, the opponents can be killed with a single precision strike. However, the player has to fight his or her way through the opponent&#39;s blocks and parries to land the deadly blow. The main character fights with his sword (katana) in the right hand, while his left hand can host a variety of upgrades, such as an ax, a torch, or a shield. The game also emphasizes stealth action. The player has to use a grappling hook to access multiple locations. Sekiro: Shadows Die Twice has no multiplayer.</p>', 'Sekiro: Shadows Die Twice is a game about a ninja (or shinobi, as they call it), who is seeking revenge in the Sengoku era Japan.

###Plot
The game is set in the 16th century in a fictionalized version of Japan. The main protagonist is a member of a shinobi clan. A samurai from the rival Ashina clan captured the protagonist''s master, and the protagonist himself lost his arm trying to protect his leader. However, a sculptor of Buddha statues managed to replace the lost limb with an advanced prosthetic arm. The protagonist accepted a new name, Sekiro, meaning “one-armed wolf”. Now his goal is to avenge his clan and to save his leader from the hands of their enemies.

###Gameplay
The player controls Sekiro from the third person view and navigates the character as he fights multiple enemies. Sekiro: Shadows Die Twice features an innovative combat system that doesn''t use hit points. Instead, the opponents can be killed with a single precision strike. However, the player has to fight his or her way through the opponent''s blocks and parries to land the deadly blow. The main character fights with his sword (katana) in the right hand, while his left hand can host a variety of upgrades, such as an ax, a torch, or a shield. The game also emphasizes stealth action. The player has to use a grappling hook to access multiple locations. Sekiro: Shadows Die Twice has no multiplayer.'),
(58755, 'Devil May Cry 5', 4.25, 88, '2019-03-08', 'assets/videojuegos/58755.jpg', 6706, '<p>Devil May Cry 5 is the sixth game in the Devil May Cry franchise and the fifth in its main series. </p>
<h3>Plot</h3>
<p>The game continues the plot of Devil May Cry 2. The demonic threat seems to have been forgotten, but the demons return, and there are new accidents around the world. Nero and Dante have parted ways, and Nero established his own agency. He also received a new robotic arm made by his engineer Nico. It replaces his Devil Bringer prosthetic that was stolen by a villain. At the beginning of the game, Nero rides his van to Red Grave City in which a demonic tree appeared. At the same time, Dante has a new client, a mysterious V, who hires him to investigate the demonic attacks.</p>
<h3>Gameplay</h3>
<p>As usual in the Devil May Cry series, the player controls his or her character from the third person view. The game features three playable characters. Dante and Nero make a return, and V is newly introduced. Each of the three characters has a unique fighting style. Nero&#39;s prosthetic hand allows him to use a variety of options, such as pulling his enemies closer. Nero also uses his legendary weapons, the gun called “Blue Rose” and the sword named “Red Queen”. Dante, as usual, fights with his swords Rebellion and Sparda, as well as a variety of new weapons, such as chainsaws and a motorcycle. V uses a walking cane as a weapon.</p>', 'Devil May Cry 5 is the sixth game in the Devil May Cry franchise and the fifth in its main series. 

###Plot
The game continues the plot of Devil May Cry 2. The demonic threat seems to have been forgotten, but the demons return, and there are new accidents around the world. Nero and Dante have parted ways, and Nero established his own agency. He also received a new robotic arm made by his engineer Nico. It replaces his Devil Bringer prosthetic that was stolen by a villain. At the beginning of the game, Nero rides his van to Red Grave City in which a demonic tree appeared. At the same time, Dante has a new client, a mysterious V, who hires him to investigate the demonic attacks.

###Gameplay
As usual in the Devil May Cry series, the player controls his or her character from the third person view. The game features three playable characters. Dante and Nero make a return, and V is newly introduced. Each of the three characters has a unique fighting style. Nero''s prosthetic hand allows him to use a variety of options, such as pulling his enemies closer. Nero also uses his legendary weapons, the gun called “Blue Rose” and the sword named “Red Queen”. Dante, as usual, fights with his swords Rebellion and Sparda, as well as a variety of new weapons, such as chainsaws and a motorcycle. V uses a walking cane as a weapon.'),
(422, 'Terraria', 4.07, 81, '2011-05-16', 'assets/videojuegos/422.jpg', 13525, '<p>Terraria is a 2D action adventure sandbox game, where players create a character and gather resources in order to gradually craft stronger weapons and armor. Players create randomly generated maps that contain different locations within it, and by gathering specific resources and triggering special events, players will fight one of the many in-game bosses. Created characters can be played on different maps.<br />
The game introduces hundreds of unique items that can be found across the entirety of the map, some of which may not even be encountered. <br />
Terraria have many different Biomes and areas with distinct visuals, containing resources and enemies unique to this biome. After gathering materials, players can craft furniture, and build settlements and houses, since after completing events or finding specific items NPCs will start to arrive, and will require player’s protection. Terraria can be played on three difficulties and has a large modding community.</p>', 'Terraria is a 2D action adventure sandbox game, where players create a character and gather resources in order to gradually craft stronger weapons and armor. Players create randomly generated maps that contain different locations within it, and by gathering specific resources and triggering special events, players will fight one of the many in-game bosses. Created characters can be played on different maps.

The game introduces hundreds of unique items that can be found across the entirety of the map, some of which may not even be encountered. 

Terraria have many different Biomes and areas with distinct visuals, containing resources and enemies unique to this biome. After gathering materials, players can craft furniture, and build settlements and houses, since after completing events or finding specific items NPCs will start to arrive, and will require player’s protection. Terraria can be played on three difficulties and has a large modding community.'),
(5286, 'Tomb Raider', 4.06, 86, '2013-03-05', 'assets/videojuegos/5286.jpg', 17826, '<p>A cinematic revival of the series in its action third person form, Tomb Rider follows Lara in her least experience period of life – her youth. Heavily influenced by Naughty Dog’s “Uncharted”, the game is a mix of everything, from stealth and survival to combat and QTE action scenes.<br />
Young Lara Croft arrives on the Yamatai, lost island near Japan, as the leader of the expedition in search of the Yamatai Kingdom, with a diverse team of specialists. But shipwreck postponed the successful arrival and seemingly forgotten island is heavily populated with hostile inhabitants, cultists of Solarii Brotherhood.<br />
The game will be graphic at times, especially after failed QTE’s during some of the survival scenes, but overall players will enjoy classic action adventure, reminiscent of the beginning of the series. This game is not a direct sequel or continuation of existing sub-series within the franchise, but a reboot, setting up Tomb Raider to represent modern gaming experience.<br />
The game has RPG elements and has a world, which you can explore during the story campaign and after the completion. As well as multiplayer mode, where 2 teams (4 scavengers and 4 survivors) are clashing in 3 game modes while using weapons and environments from the single-player campaign.</p>', 'A cinematic revival of the series in its action third person form, Tomb Rider follows Lara in her least experience period of life – her youth. Heavily influenced by Naughty Dog’s “Uncharted”, the game is a mix of everything, from stealth and survival to combat and QTE action scenes.

Young Lara Croft arrives on the Yamatai, lost island near Japan, as the leader of the expedition in search of the Yamatai Kingdom, with a diverse team of specialists. But shipwreck postponed the successful arrival and seemingly forgotten island is heavily populated with hostile inhabitants, cultists of Solarii Brotherhood.

The game will be graphic at times, especially after failed QTE’s during some of the survival scenes, but overall players will enjoy classic action adventure, reminiscent of the beginning of the series. This game is not a direct sequel or continuation of existing sub-series within the franchise, but a reboot, setting up Tomb Raider to represent modern gaming experience.

The game has RPG elements and has a world, which you can explore during the story campaign and after the completion. As well as multiplayer mode, where 2 teams (4 scavengers and 4 survivors) are clashing in 3 game modes while using weapons and environments from the single-player campaign.'),
(257201, 'Star Wars Jedi: Fallen Order', 4.13, 80, '2019-11-15', 'assets/videojuegos/257201.jpg', 9671, '<p>Cal Kestis—one of the last surviving members of the Jedi Order after the purge of Order 66—is now a Padawan on the run. </p>
<p>Star Wars Jedi: Fallen Order is an action-adventure game set after Star Wars: Episode III — Revenge of the Sith™. Develop your Force abilities, hone your lightsaber techniques, and explore the ancient mysteries of a long-lost civilization—all while staying one step ahead of the Empire and its deadly Inquisitors. an</p>', 'Cal Kestis—one of the last surviving members of the Jedi Order after the purge of Order 66—is now a Padawan on the run. 

Star Wars Jedi: Fallen Order is an action-adventure game set after Star Wars: Episode III — Revenge of the Sith™. Develop your Force abilities, hone your lightsaber techniques, and explore the ancient mysteries of a long-lost civilization—all while staying one step ahead of the Empire and its deadly Inquisitors. an'),
(46889, 'Monster Hunter: World', 4.01, 89, '2018-01-26', 'assets/videojuegos/46889.jpg', 8840, '<p>Monster Hunter: World is the fifth game in the Japanese franchise Monster Hunter, which is about hunting giant beasts. It is set in a medieval fantasy setting, on a continent known as the New World that is being colonized by the humans from the Old World. The plot revolves around a dragon migration called Elder Crossing. Your protagonist is a hunter, whose name and appearance can be customized. You traveled from the Old World to study and hunt the dragons and other local monsters.  <br />
The hunter, accompanied by an assistant, starts at the city of Astera, from where they can freely wander the open world. There are six regions in the New World, each with its own base camp. The camps are where you have to thoroughly prepare before every expedition, gathering equipment and provision. Before you can fight monsters, they need to be tracked down using Scout flies and studied to discover their habits, strengths, and weaknesses. There are no character levels, so your hunter’s effectiveness relies on the hunting gear you have equipped. Advanced armor and weapons can be created using a detailed crating system. Many items that you found on missions, including body parts of monsters, can be used for crafting.</p>', 'Monster Hunter: World is the fifth game in the Japanese franchise Monster Hunter, which is about hunting giant beasts. It is set in a medieval fantasy setting, on a continent known as the New World that is being colonized by the humans from the Old World. The plot revolves around a dragon migration called Elder Crossing. Your protagonist is a hunter, whose name and appearance can be customized. You traveled from the Old World to study and hunt the dragons and other local monsters.  

The hunter, accompanied by an assistant, starts at the city of Astera, from where they can freely wander the open world. There are six regions in the New World, each with its own base camp. The camps are where you have to thoroughly prepare before every expedition, gathering equipment and provision. Before you can fight monsters, they need to be tracked down using Scout flies and studied to discover their habits, strengths, and weaknesses. There are no character levels, so your hunter’s effectiveness relies on the hunting gear you have equipped. Advanced armor and weapons can be created using a detailed crating system. Many items that you found on missions, including body parts of monsters, can be used for crafting.'),
(3070, 'Fallout 4', 3.81, 84, '2015-11-09', 'assets/videojuegos/3070.jpg', 14302, '<p>The fourth game in the post-apocalyptic action RPG series from Bethesda studious brings players back to the retro-future. After customizing the facial features of the character, players will be admitted to the Vault 111 with their family, and tricked into entering the cryogenic capsule. After the rude awakening after the unknown amount of time has passed, the child is separated from the parents and the loving partner is killed in front of them – the main quest is settled. Now there’s only the giant open world to explore. Fallout 4 introduces the mechanics of settlement building, where players can build their own little town. Gathering material for crafting and building brings more “survival” elements into the old formula. Within their own settlements, players will be able to build all needed utilities, from storage spaces to power armor stations. Visual upgrade from the previous game brings life to what used to be brown wastelands, now filled with details and color.</p>', 'The fourth game in the post-apocalyptic action RPG series from Bethesda studious brings players back to the retro-future. After customizing the facial features of the character, players will be admitted to the Vault 111 with their family, and tricked into entering the cryogenic capsule. After the rude awakening after the unknown amount of time has passed, the child is separated from the parents and the loving partner is killed in front of them – the main quest is settled. Now there’s only the giant open world to explore. Fallout 4 introduces the mechanics of settlement building, where players can build their own little town. Gathering material for crafting and building brings more “survival” elements into the old formula. Within their own settlements, players will be able to build all needed utilities, from storage spaces to power armor stations. Visual upgrade from the previous game brings life to what used to be brown wastelands, now filled with details and color.'),
(339958, 'Persona 5 Royal', 4.75, 94, '2020-03-31', 'assets/videojuegos/339958.jpg', 3182, '<p>Wear the mask.  Reveal your truth.<br />
Prepare for an all-new RPG experience in Persona®5 Royal based in the universe of the award-winning series, Persona®! Don the mask of Joker and join the Phantom Thieves of Hearts. Break free from the chains of modern society and stage grand heists to infiltrate the minds of the corrupt and make them change their ways! Persona®5 Royal is packed with new characters, story depth, new locations to explore, &amp; a new grappling hook mechanic for access to new areas. With a new semester at Shujin Academy, get ready to strengthen your abilities in the metaverse and in your daily life. Persona®5 Royal presents a unique visual style and award nominated composer Shoji Meguro returns with an all-new soundtrack. Explore Tokyo, unlock new Personas, customize your own personal Thieves Den, discover a never-before-seen story arc, cutscenes, alternate endings, and more!</p>', 'Wear the mask.  Reveal your truth.
Prepare for an all-new RPG experience in Persona®5 Royal based in the universe of the award-winning series, Persona®! Don the mask of Joker and join the Phantom Thieves of Hearts. Break free from the chains of modern society and stage grand heists to infiltrate the minds of the corrupt and make them change their ways! Persona®5 Royal is packed with new characters, story depth, new locations to explore, & a new grappling hook mechanic for access to new areas. With a new semester at Shujin Academy, get ready to strengthen your abilities in the metaverse and in your daily life. Persona®5 Royal presents a unique visual style and award nominated composer Shoji Meguro returns with an all-new soundtrack. Explore Tokyo, unlock new Personas, customize your own personal Thieves Den, discover a never-before-seen story arc, cutscenes, alternate endings, and more!'),
(58777, 'DOOM Eternal', 4.37, 86, '2020-03-19', 'assets/videojuegos/58777.jpg', 8006, '<p>As the DOOM Slayer, you return to find Earth has suffered a demonic invasion. Raze Hell and discover the Slayer’s origins and his enduring mission to rip and tear…until it is done.</p>
<p>Experience the ultimate combination of speed and power as you battle your way across dimensions with the next leap in push-forward, first-person combat.<br />
Slayer Threat Level at Maximum</p>
<p>Armed with a shoulder-mounted flamethrower, retractable wrist-mounted blade, upgraded guns and mods, and abilities like the Double Dash, you&#39;re faster, stronger, and more versatile than ever.<br />
Unholy Trinity</p>
<p>Take what you need from your enemies: Glory kill for extra health, incinerate for armor, and chainsaw demons to stock up on ammo to become the ultimate demon-slayer.</p>
<p>BATTLEMODE is the new 2 versus 1 multiplayer experience built from the ground up at id Software. A fully-armed DOOM Slayer faces off against two player-controlled demons, duking it in a best-of-five round match of intense first-person combat. BATTLEMODE launches with 6 handcrafted maps and 5 playable demons – the Marauder, Archvile, Revenant, Mancubus and Pain Elemental.</p>', 'As the DOOM Slayer, you return to find Earth has suffered a demonic invasion. Raze Hell and discover the Slayer’s origins and his enduring mission to rip and tear…until it is done.

Experience the ultimate combination of speed and power as you battle your way across dimensions with the next leap in push-forward, first-person combat.
Slayer Threat Level at Maximum

Armed with a shoulder-mounted flamethrower, retractable wrist-mounted blade, upgraded guns and mods, and abilities like the Double Dash, you''re faster, stronger, and more versatile than ever.
Unholy Trinity

Take what you need from your enemies: Glory kill for extra health, incinerate for armor, and chainsaw demons to stock up on ammo to become the ultimate demon-slayer.

BATTLEMODE is the new 2 versus 1 multiplayer experience built from the ground up at id Software. A fully-armed DOOM Slayer faces off against two player-controlled demons, duking it in a best-of-five round match of intense first-person combat. BATTLEMODE launches with 6 handcrafted maps and 5 playable demons – the Marauder, Archvile, Revenant, Mancubus and Pain Elemental.'),
(13537, 'Half-Life 2', 4.48, 96, '2004-11-16', 'assets/videojuegos/13537.jpg', 16125, '<p>Gordon Freeman became the most popular nameless and voiceless protagonist in gaming history. He is painted as the most famous scientist and a hero within the world of Half-Life, and for a good reason. In the first game he saved the planet from alien invasion, this time, when the invasion is already begun, the world needs his help one more time. And you, as a player, will help this world to survive. This time Gordon arrives in City 17, ravaged and occupied by Combines, where he meets his old Black Mesa friends. <br />
What is different, aside from the overall design quality, is the use of Valve’s Source engine that not only expands on the fluidity of character model animations and movement but allows players to interact with a myriad of objects with the advanced and realistic (to an extent) physics. Classic Headcrab Zombies are revamped and have new variants that provide players with different threats. For a story-driven FPS, Half-Life 2 is unique in its plot delivery, and making in-game mechanics feel natural, be it platforming or driving.</p>', 'Gordon Freeman became the most popular nameless and voiceless protagonist in gaming history. He is painted as the most famous scientist and a hero within the world of Half-Life, and for a good reason. In the first game he saved the planet from alien invasion, this time, when the invasion is already begun, the world needs his help one more time. And you, as a player, will help this world to survive. This time Gordon arrives in City 17, ravaged and occupied by Combines, where he meets his old Black Mesa friends. 

What is different, aside from the overall design quality, is the use of Valve’s Source engine that not only expands on the fluidity of character model animations and movement but allows players to interact with a myriad of objects with the advanced and realistic (to an extent) physics. Classic Headcrab Zombies are revamped and have new variants that provide players with different threats. For a story-driven FPS, Half-Life 2 is unique in its plot delivery, and making in-game mechanics feel natural, be it platforming or driving.'),
(4062, 'BioShock Infinite', 4.38, 94, '2013-03-26', 'assets/videojuegos/4062.jpg', 16121, '<p>The third game in the series, Bioshock takes the story of the underwater confinement within the lost city of Rapture and takes it in the sky-city of Columbia. Players will follow Booker DeWitt, a private eye with a military past; as he will attempt to wipe his debts with the only skill he’s good at – finding people. Aside from obvious story and style differences, this time Bioshock protagonist has a personality, character, and voice, no longer the protagonist is a silent man, trying to survive.<br />
Open and bright level design of Columbia shows industrial colonial America in a seemingly endless carnival. But Bioshock is not famous for its visuals, but for its story.  Mystery and creative vision of Irrational Games invite players to uncover the secrets of Columbia’s leader - Zachary Comstock and save Elizabeth, the girl, that’s been locked up in the flying city since her birth.<br />
Unique weapons and mechanics of Vigor will make encounters different, helping players to adjust to the new found mobility and hook shot, making fights fast-paced and imaginative.</p>', 'The third game in the series, Bioshock takes the story of the underwater confinement within the lost city of Rapture and takes it in the sky-city of Columbia. Players will follow Booker DeWitt, a private eye with a military past; as he will attempt to wipe his debts with the only skill he’s good at – finding people. Aside from obvious story and style differences, this time Bioshock protagonist has a personality, character, and voice, no longer the protagonist is a silent man, trying to survive.

Open and bright level design of Columbia shows industrial colonial America in a seemingly endless carnival. But Bioshock is not famous for its visuals, but for its story.  Mystery and creative vision of Irrational Games invite players to uncover the secrets of Columbia’s leader - Zachary Comstock and save Elizabeth, the girl, that’s been locked up in the flying city since her birth.

Unique weapons and mechanics of Vigor will make encounters different, helping players to adjust to the new found mobility and hook shot, making fights fast-paced and imaginative.'),
(290856, 'Apex Legends', 3.63, 80, '2019-02-04', 'assets/videojuegos/290856.jpg', 12028, '<p>Conquer with character in Apex Legends, a free-to-play* Battle Royale shooter where legendary characters with powerful abilities team up to battle for fame and fortune on the fringes of the Frontier. Master an ever-growing roster of diverse legends, deep tactical squad play, and bold new innovations that level-up the Battle Royale experience—all within a rugged world where anything goes. Welcome to the next evolution of Battle Royale.</p>
<p>Characters you can play as: Caustic, Bangalore, Bloodhound, Crypto, Gibraltar, Lifeline, Loba, Mirage, Octane, Pathfinder, Rampart, Revenant.</p>', 'Conquer with character in Apex Legends, a free-to-play* Battle Royale shooter where legendary characters with powerful abilities team up to battle for fame and fortune on the fringes of the Frontier. Master an ever-growing roster of diverse legends, deep tactical squad play, and bold new innovations that level-up the Battle Royale experience—all within a rugged world where anything goes. Welcome to the next evolution of Battle Royale.

Characters you can play as: Caustic, Bangalore, Bloodhound, Crypto, Gibraltar, Lifeline, Loba, Mirage, Octane, Pathfinder, Rampart, Revenant.'),
(13536, 'Portal', 4.49, 90, '2007-10-09', 'assets/videojuegos/13536.jpg', 17820, '<p>Every single time you click your mouse while holding a gun, you expect bullets to fly and enemies to fall. But here you will try out the FPS game filled with environmental puzzles and engaging story. <br />
Silent template for your adventures, Chell, wakes up in a testing facility. She’s a subject of experiments on instant travel device, supervised by snarky and hostile GLaDOS.<br />
Players will have to complete the tests, room by room, expecting either reward, freedom or more tests. By using the gun, that shoots portals (Portal-Gun™), players will move blocks, travel great distance quickly and learn about your current situation, which is unraveled through environmental storytelling. What you will be told might be different from what you will see.<br />
White environments will guide the player’s portal placement, forcing them to pay attention to the surroundings.  Portal creates tension, allowing either solving puzzles at your own leisure or moving quickly, due to the time limit or threats.</p>', 'Every single time you click your mouse while holding a gun, you expect bullets to fly and enemies to fall. But here you will try out the FPS game filled with environmental puzzles and engaging story. 

Silent template for your adventures, Chell, wakes up in a testing facility. She’s a subject of experiments on instant travel device, supervised by snarky and hostile GLaDOS.

Players will have to complete the tests, room by room, expecting either reward, freedom or more tests. By using the gun, that shoots portals (Portal-Gun™), players will move blocks, travel great distance quickly and learn about your current situation, which is unraveled through environmental storytelling. What you will be told might be different from what you will see.

White environments will guide the player’s portal placement, forcing them to pay attention to the surroundings.  Portal creates tension, allowing either solving puzzles at your own leisure or moving quickly, due to the time limit or threats.'),
(12929, 'The Talos Principle', 4.16, 85, '2014-12-11', 'assets/videojuegos/12929.jpg', 5007, '<p>The Talos Principle is a puzzle game set in Ancient Greece full of technological devices. You take on the role of Talos, artificial man, the protector of Crete in Greek mythology. You are led by Elohim, your mentor, who allows you to explore the world and open portals to other locations, such as Ancient Egypt or Medieval Europe. The only place Elohim forbids you to go to is the Tower. Of course, the goal of the game is to enter it and reveal its secrets.<br />
Your way to the Tower lays among turrets you must avoid solving various environmental puzzles. The further you go, the more complicated these puzzles become, turning into long series of actions. You get new abilities and can interact with a larger amount of items, and the game remains challenging during the entire playthrough. <br />
Based on Greek mythology, The Talos Principle rises such philosophical problems as the humanity of artificial intelligence, androids’ desire to live forever and the confrontation between God and his creatures. These ideas are described in multiple notes, diaries and terminals.</p>', 'The Talos Principle is a puzzle game set in Ancient Greece full of technological devices. You take on the role of Talos, artificial man, the protector of Crete in Greek mythology. You are led by Elohim, your mentor, who allows you to explore the world and open portals to other locations, such as Ancient Egypt or Medieval Europe. The only place Elohim forbids you to go to is the Tower. Of course, the goal of the game is to enter it and reveal its secrets.
Your way to the Tower lays among turrets you must avoid solving various environmental puzzles. The further you go, the more complicated these puzzles become, turning into long series of actions. You get new abilities and can interact with a larger amount of items, and the game remains challenging during the entire playthrough. 
Based on Greek mythology, The Talos Principle rises such philosophical problems as the humanity of artificial intelligence, androids’ desire to live forever and the confrontation between God and his creatures. These ideas are described in multiple notes, diaries and terminals.'),
(50839, 'Baba Is You', 4.39, 86, '2019-03-13', 'assets/videojuegos/50839.jpg', 2461, '<p>Baba Is You is a puzzle game where you can change the rules by which you play. In every level, the rules themselves are lying as blocks you can interact with; by manipulating them, you can change how the level works and cause surprising, unexpected interactions! With some simple block-pushing you can turn yourself into a rock, turn patches of grass into dangerously hot obstacles, and even change the goal you need to reach to something entirely different.<br />
The game has over 100 levels that experiment with the game&#39;s mechanics in a multitude of ways, requiring the player to understand and manipulate the rules of the game and figure out devious ways to make the objects in the game world interact. The game will also feater a level editor for making your own levels and campaigns.<br />
The game was originally created for &amp; won the Nordic Game Jam 2017. The event had 142 entries in total. The game was made using Multimedia Fusion 2 by Clickteam.</p>', 'Baba Is You is a puzzle game where you can change the rules by which you play. In every level, the rules themselves are lying as blocks you can interact with; by manipulating them, you can change how the level works and cause surprising, unexpected interactions! With some simple block-pushing you can turn yourself into a rock, turn patches of grass into dangerously hot obstacles, and even change the goal you need to reach to something entirely different.
The game has over 100 levels that experiment with the game''s mechanics in a multitude of ways, requiring the player to understand and manipulate the rules of the game and figure out devious ways to make the objects in the game world interact. The game will also feater a level editor for making your own levels and campaigns.
The game was originally created for & won the Nordic Game Jam 2017. The event had 142 entries in total. The game was made using Multimedia Fusion 2 by Clickteam.'),
(1450, 'INSIDE', 4.39, 87, '2016-06-28', 'assets/videojuegos/1450.jpg', 8412, '<p>INSIDE is a platform adventure game that transfers the atmosphere of a dystopic world. Players assume the role of a lonely boy, who walks through the monochromatic 2.5D environment and solves various puzzles. By the time main antagonists of the character pursue him throughout the whole world. The main storyline follows the unnamed boy through the in-game world locations including a forest, a farm, and a fictional laboratory, where experiments on bodies are held. The gameplay is divided into levels tied to each location. While completing them, the boy, controlled by players, has to swim, run, climb the obstacles and use his supernatural ability to control bodies with his special helmet. In the course of the travel, the protagonist also comes across a siren-like creature, who gives him gear for breathing underwater. The death occurs in several ways ranging from drowning to being shot with a tranquilizer dart. In addition to the basic ending, the storyline features an alternate one, which unlocks after collecting all the hidden glowing orbs.</p>', 'INSIDE is a platform adventure game that transfers the atmosphere of a dystopic world. Players assume the role of a lonely boy, who walks through the monochromatic 2.5D environment and solves various puzzles. By the time main antagonists of the character pursue him throughout the whole world. The main storyline follows the unnamed boy through the in-game world locations including a forest, a farm, and a fictional laboratory, where experiments on bodies are held. The gameplay is divided into levels tied to each location. While completing them, the boy, controlled by players, has to swim, run, climb the obstacles and use his supernatural ability to control bodies with his special helmet. In the course of the travel, the protagonist also comes across a siren-like creature, who gives him gear for breathing underwater. The death occurs in several ways ranging from drowning to being shot with a tranquilizer dart. In addition to the basic ending, the storyline features an alternate one, which unlocks after collecting all the hidden glowing orbs.'),
(1030, 'Limbo', 4.14, 88, '2010-07-21', 'assets/videojuegos/1030.jpg', 14156, '<p>This popular 2D puzzle-platformer creates the atmosphere of isolation, where the player alone can guide the nameless protagonist to his destination. Hostile environments and one-hit deaths may seem difficult, but the game implements a fair amount of checkpoints. The monochrome color palette showcases cartoony proportions of every living thing while making lack of details threatening. Limbo shows you exactly what you encounter, but never how it looks.</p>
<p>Limbo uses the atmosphere and sound design of the horror genre while avoiding tropes of the modern horror games. The overarching theme and unique style compensated for the rather short game with an abrupt ending, making Limbo one of the most impactful games for the genre.</p>
<p>The simple controls and easy-to-pick-up mechanics help to make a clear distinction, which part of the stage players can interact with, and which part can lead to the quick death. Even though the game is in black and white, this separation is intuitive and natural, so the player would know exactly where to go or what to do.</p>', 'This popular 2D puzzle-platformer creates the atmosphere of isolation, where the player alone can guide the nameless protagonist to his destination. Hostile environments and one-hit deaths may seem difficult, but the game implements a fair amount of checkpoints. The monochrome color palette showcases cartoony proportions of every living thing while making lack of details threatening. Limbo shows you exactly what you encounter, but never how it looks.

Limbo uses the atmosphere and sound design of the horror genre while avoiding tropes of the modern horror games. The overarching theme and unique style compensated for the rather short game with an abrupt ending, making Limbo one of the most impactful games for the genre.

The simple controls and easy-to-pick-up mechanics help to make a clear distinction, which part of the stage players can interact with, and which part can lead to the quick death. Even though the game is in black and white, this separation is intuitive and natural, so the player would know exactly where to go or what to do.'),
(58764, 'Outer Wilds', 4.36, 84, '2019-05-29', 'assets/videojuegos/58764.jpg', 4971, '<p>Outer Wilds is an open world mystery about a solar system trapped in an endless time loop.<br />
Welcome to the Space Program!<br />
You&#39;re the newest recruit of Outer Wilds Ventures, a fledgling space program searching for answers in a strange, constantly evolving solar system.</p>
<p>Mysteries of the Solar System...<br />
What lurks in the heart of the ominous Dark Bramble? Who built the alien ruins on the Moon? Can the endless time loop be stopped? Answers await you in the most dangerous reaches of space.</p>
<p>A World That Changes Over Time<br />
The planets of Outer Wilds are packed with hidden locations that change with the passage of time. Visit an underground city of before it&#39;s swallowed by sand, or explore the surface of a planet as it crumbles beneath your feet. Every secret is guarded by hazardous environments and natural catastrophes.</p>
<p>Grab Your Intergalactic Hiking Gear!<br />
Strap on your hiking boots, check your oxygen levels, and get ready to venture into space. Use a variety of unique gadgets to probe your surroundings, track down mysterious signals, decipher ancient alien writing, and roast the perfect marshmallow.</p>', 'Outer Wilds is an open world mystery about a solar system trapped in an endless time loop.
Welcome to the Space Program!
You''re the newest recruit of Outer Wilds Ventures, a fledgling space program searching for answers in a strange, constantly evolving solar system.

Mysteries of the Solar System...
What lurks in the heart of the ominous Dark Bramble? Who built the alien ruins on the Moon? Can the endless time loop be stopped? Answers await you in the most dangerous reaches of space.

A World That Changes Over Time
The planets of Outer Wilds are packed with hidden locations that change with the passage of time. Visit an underground city of before it''s swallowed by sand, or explore the surface of a planet as it crumbles beneath your feet. Every secret is guarded by hazardous environments and natural catastrophes.

Grab Your Intergalactic Hiking Gear!
Strap on your hiking boots, check your oxygen levels, and get ready to venture into space. Use a variety of unique gadgets to probe your surroundings, track down mysterious signals, decipher ancient alien writing, and roast the perfect marshmallow.'),
(10419, 'Subnautica', 4.24, 83, '2018-01-23', 'assets/videojuegos/10419.jpg', 7142, '<p>Subnautica is a first-person game about survival in the deep sea. You control Ryley Robinson, a space traveler in the 22nd century, who crash-landed his starship on a planet that is covered almost entirely by the ocean. The protagonist needs to eat and drink, although this can be disabled in lower difficulty modes. He can desalinate oceanic water, catch or gather the seafood, and create useful tools and structures. Unlike many survival games, Subnautica has a detailed plot, in which Ryley has to uncover why his ship crashed. By exploring the ocean, finding the remnants of other crashes, and listening to the radio messages, Robinson will learn about the enormous Leviathan, the mysterious Precursors, and the reason why this planet is quarantined.<br />
The game is famous for its spectacular portrayal of the ocean and its wildlife. Robinson is equipped with a scuba diving gear that allows the player to spend most of the game underwater, although oxygen still has to be replenished. The player can dive deep and explore the world full of corals, fish, and other colorful sea creatures, often grotesque or bio-luminescent. The environment is randomly generated to improve replayability.</p>', 'Subnautica is a first-person game about survival in the deep sea. You control Ryley Robinson, a space traveler in the 22nd century, who crash-landed his starship on a planet that is covered almost entirely by the ocean. The protagonist needs to eat and drink, although this can be disabled in lower difficulty modes. He can desalinate oceanic water, catch or gather the seafood, and create useful tools and structures. Unlike many survival games, Subnautica has a detailed plot, in which Ryley has to uncover why his ship crashed. By exploring the ocean, finding the remnants of other crashes, and listening to the radio messages, Robinson will learn about the enormous Leviathan, the mysterious Precursors, and the reason why this planet is quarantined.

The game is famous for its spectacular portrayal of the ocean and its wildlife. Robinson is equipped with a scuba diving gear that allows the player to spend most of the game underwater, although oxygen still has to be replenished. The player can dive deep and explore the world full of corals, fish, and other colorful sea creatures, often grotesque or bio-luminescent. The environment is randomly generated to improve replayability.'),
(11726, 'Dead Cells', 4.23, 88, '2018-08-07', 'assets/videojuegos/11726.jpg', 7299, '<p>Dead Cells is a roguelike adventure title developed by Motion Twin.</p>
<h3>Story</h3>
<p>Not much story is present in the game, as only bits of any information are given out to the players. The game takes place at a remote island, where the players take place of the Prisoner. The Prisoner does not speak, yet he can express confusion and frustration using his body language. The Prisoner is basically immortal, as, in case of death, his head disconnects itself from the Prisoner&#39;s body, and gets back to the game&#39;s starting area. </p>
<h3>Gameplay</h3>
<p>The game&#39;s heavily inspired by The Binding of Isaac, as stated by the developers.</p>
<p>Dead Cells features the procedurally generated environments that are typical for roguelike games, yet it puts a strong emphasis on exploration that is typically found in metroidvanias.</p>
<p>The players set out to explore the island where a prison was built. As the players come down into the dungeons of the island, they find various loot, fight dangerous creatures, collect armor, abilities, and power-ups. Upon death, the players lose all the loot they had on them. It is possible to find a shopkeep somewhere in the dungeons to purchase new equipment or have some rest. </p>
<p>The game uses death as a learning experience, as it randomizes the placement of enemies, so the players can&#39;t take multiple attempts to complete a level. The developers want the player to examine the enemy behavior and learn how to combat the enemies themselves.</p>', 'Dead Cells is a roguelike adventure title developed by Motion Twin.

###Story
Not much story is present in the game, as only bits of any information are given out to the players. The game takes place at a remote island, where the players take place of the Prisoner. The Prisoner does not speak, yet he can express confusion and frustration using his body language. The Prisoner is basically immortal, as, in case of death, his head disconnects itself from the Prisoner''s body, and gets back to the game''s starting area. 

###Gameplay
The game''s heavily inspired by The Binding of Isaac, as stated by the developers.

Dead Cells features the procedurally generated environments that are typical for roguelike games, yet it puts a strong emphasis on exploration that is typically found in metroidvanias.

The players set out to explore the island where a prison was built. As the players come down into the dungeons of the island, they find various loot, fight dangerous creatures, collect armor, abilities, and power-ups. Upon death, the players lose all the loot they had on them. It is possible to find a shopkeep somewhere in the dungeons to purchase new equipment or have some rest. 

The game uses death as a learning experience, as it randomizes the placement of enemies, so the players can''t take multiple attempts to complete a level. The developers want the player to examine the enemy behavior and learn how to combat the enemies themselves.'),
(28154, 'Cuphead', 4.37, 87, '2017-09-29', 'assets/videojuegos/28154.jpg', 8115, '<p>Hand-drawn 2D platformer in the style of 30s cartoons. 2D Dark Souls as the fans refer to the difficulty of this one. It took developers 6 years to create and polish their magnum opus. Cuphead is a classic run and gun adventure that heavily emphasizes on boss battles.</p>
<p>Play as Cuphead or his brother Mugman that signed a deal with the devil and know needs to bring the master souls of its debtors. Players can go through the campaign single-handedly or with a friend using built-in co-op capabilities. </p>
<p>The backgrounds, characters and other miscellaneous staff were painstakingly created using the methods from the era it mimics; Every character and every scene were hand-drawn to mimic vintage American cartoons. Each note in the orchestral soundtrack was composed with unparalleled attention to detail. Cuphead is an addictive mix of bone-crushing difficulty, fun and audiovisual feast that instantly makes you crave for more.</p>', 'Hand-drawn 2D platformer in the style of 30s cartoons. 2D Dark Souls as the fans refer to the difficulty of this one. It took developers 6 years to create and polish their magnum opus. Cuphead is a classic run and gun adventure that heavily emphasizes on boss battles.



Play as Cuphead or his brother Mugman that signed a deal with the devil and know needs to bring the master souls of its debtors. Players can go through the campaign single-handedly or with a friend using built-in co-op capabilities. 



The backgrounds, characters and other miscellaneous staff were painstakingly created using the methods from the era it mimics; Every character and every scene were hand-drawn to mimic vintage American cartoons. Each note in the orchestral soundtrack was composed with unparalleled attention to detail. Cuphead is an addictive mix of bone-crushing difficulty, fun and audiovisual feast that instantly makes you crave for more.'),
(13627, 'Undertale', 4.35, 92, '2015-09-14', 'assets/videojuegos/13627.jpg', 8610, '<p>Undertale is an independent role-playing game developed by Toby Fox.</p>
<p>Once upon a time, there were two races on Earth: monsters and humans, but a war broke out between them and the latter won. Seven greatest mages sealed the monsters underground and left one entrance through a hole in the Ebott mountain. A lot of time passed since the war, but a human child accidentally falls down the mountain. Its goal is to get back out.</p>
<p>Undertale uses pixelated graphics and traditional mechanics of RPGs such as earning experience points, having an open world, and so on. As the game goes on, the player has to solve several puzzles and interact with NPCs. The battles in the game are represented using the bullet hell mini-games with the player having an option to choose where they want to spare their opponent or hit the enemy back. Monsters behavior depends on the player&#39;s actions: if one decides to use a peaceful approach it will be easier to dodge the enemies attacks and vice versa. </p>
<p>The game features a branching story and several endings. The ending the player gets depends on whether they spared or killed the monsters they encountered throughout the game.</p>', 'Undertale is an independent role-playing game developed by Toby Fox.

Once upon a time, there were two races on Earth: monsters and humans, but a war broke out between them and the latter won. Seven greatest mages sealed the monsters underground and left one entrance through a hole in the Ebott mountain. A lot of time passed since the war, but a human child accidentally falls down the mountain. Its goal is to get back out.

Undertale uses pixelated graphics and traditional mechanics of RPGs such as earning experience points, having an open world, and so on. As the game goes on, the player has to solve several puzzles and interact with NPCs. The battles in the game are represented using the bullet hell mini-games with the player having an option to choose where they want to spare their opponent or hit the enemy back. Monsters behavior depends on the player''s actions: if one decides to use a peaceful approach it will be easier to dodge the enemies attacks and vice versa. 

The game features a branching story and several endings. The ending the player gets depends on whether they spared or killed the monsters they encountered throughout the game.'),
(262382, 'Disco Elysium', 4.37, 91, '2019-10-14', 'assets/videojuegos/262382.jpg', 8154, '<p>Disco Elysium is a groundbreaking blend of hardboiled cop show and isometric RPG. Solve a massive, open ended case in a unique urban fantasy setting. Kick in doors, interrogate suspects, or just get lost exploring the gorgeously rendered city of Revachol and unraveling its mysteries. Tough choices need to be made. What kind of cop you are — is up to you.</p>
<p>You play a disgraced lieutenant detective in Revachol West, a shore town where corruption’s out of control, murders go unsolved, and the kids just wanna dance. Kick in doors, interrogate suspects, or get lost exploring a gorgeously rendered city and unraveling its mysteries. All the while, tensions rise around you as Revachol threatens to explode.</p>
<p>Disco Elysium’s completely original skill system makes your innermost feelings, doubts, and memories an integral part of every conversation. Level up your rational faculties, sharpen your wits, or give in to your basest instincts. What kind of cop you are is up to you.</p>', 'Disco Elysium is a groundbreaking blend of hardboiled cop show and isometric RPG. Solve a massive, open ended case in a unique urban fantasy setting. Kick in doors, interrogate suspects, or just get lost exploring the gorgeously rendered city of Revachol and unraveling its mysteries. Tough choices need to be made. What kind of cop you are — is up to you.



You play a disgraced lieutenant detective in Revachol West, a shore town where corruption’s out of control, murders go unsolved, and the kids just wanna dance. Kick in doors, interrogate suspects, or get lost exploring a gorgeously rendered city and unraveling its mysteries. All the while, tensions rise around you as Revachol threatens to explode.



Disco Elysium’s completely original skill system makes your innermost feelings, doubts, and memories an integral part of every conversation. Level up your rational faculties, sharpen your wits, or give in to your basest instincts. What kind of cop you are is up to you.'),
(19590, 'Ori and the Blind Forest', 4.38, 88, '2015-03-10', 'assets/videojuegos/19590.jpg', 7490, '<p>Ori and the blind forest is a game with a stunning visual style, which looks like a fairytale one, and also the game takes place to a beautiful and atmospheric soundtrack.</p>
<p>The forest of Nibel is dying. You play as a character named Ori and a spirit named Sein. They are trying to save the magical forest after the dark spirit Kuro stole the heart of the tree of life, what made the forest began to wither rapidly, losing its vitality: the water becomes dirty, the trees cease to bloom and bear fruit, and the woodland is covered with thick thorns.</p>
<p>Playing in the Ori and the blind forest, you have to explore a vast world, to solve platform problems and relatively complex, but interesting puzzles (first of all, they test your reaction and agility). Using the abilities of Ori (initially, he can only jump, but a lot of other skills will be opened during the game) and Sein (the ability to attack enemies) you have to cope with the difficulties on the way to fix the situation and cure the forest.</p>', 'Ori and the blind forest is a game with a stunning visual style, which looks like a fairytale one, and also the game takes place to a beautiful and atmospheric soundtrack.

The forest of Nibel is dying. You play as a character named Ori and a spirit named Sein. They are trying to save the magical forest after the dark spirit Kuro stole the heart of the tree of life, what made the forest began to wither rapidly, losing its vitality: the water becomes dirty, the trees cease to bloom and bear fruit, and the woodland is covered with thick thorns.

Playing in the Ori and the blind forest, you have to explore a vast world, to solve platform problems and relatively complex, but interesting puzzles (first of all, they test your reaction and agility). Using the abilities of Ori (initially, he can only jump, but a lot of other skills will be opened during the game) and Sein (the ability to attack enemies) you have to cope with the difficulties on the way to fix the situation and cure the forest.'),
(455597, 'It Takes Two', 4.47, 88, '2021-03-26', 'assets/videojuegos/455597.jpg', 5632, '<p>Bring your favorite co-op partner and together step into the shoes of May and Cody. As the couple is going through a divorce, through unknown means their minds are transported into two dolls which their daughter, Rose, made to represent them. Now they must reluctantly find a way to get back into their bodies, a quest which takes them through the most wild, unexpected and fantastical journey imaginable.</p>
<p>It Takes Two further builds on Hazelight’s proven track record of making rich and engaging co-op experiences. While developing It Takes Two it has been the team’s number one priority to truly merge story and gameplay. Allowing both to influence each other guarantees a game that is as engaging to play as it is compelling to experience.</p>', 'Bring your favorite co-op partner and together step into the shoes of May and Cody. As the couple is going through a divorce, through unknown means their minds are transported into two dolls which their daughter, Rose, made to represent them. Now they must reluctantly find a way to get back into their bodies, a quest which takes them through the most wild, unexpected and fantastical journey imaginable.



It Takes Two further builds on Hazelight’s proven track record of making rich and engaging co-op experiences. While developing It Takes Two it has been the team’s number one priority to truly merge story and gameplay. Allowing both to influence each other guarantees a game that is as engaging to play as it is compelling to experience.'),
(257192, 'Psychonauts 2', 4.36, 88, '2021-08-24', 'assets/videojuegos/257192.jpg', 2909, '<p>Razputin Aquato, trained acrobat and powerful young psychic, has realized his life long dream of joining the international psychic espionage organization known as the Psychonauts! But these psychic super spies are in trouble. Their leader hasn&#39;t been the same since he was kidnapped, and what&#39;s worse, there&#39;s a mole hiding in headquarters. Raz must use his powers to stop the mole before they execute their secret plan--to bring the murderous psychic villain, Maligula, back from the dead!</p>', 'Razputin Aquato, trained acrobat and powerful young psychic, has realized his life long dream of joining the international psychic espionage organization known as the Psychonauts! But these psychic super spies are in trouble. Their leader hasn''t been the same since he was kidnapped, and what''s worse, there''s a mole hiding in headquarters. Raz must use his powers to stop the mole before they execute their secret plan--to bring the murderous psychic villain, Maligula, back from the dead!'),
(3272, 'Rocket League', 3.93, 86, '2015-07-07', 'assets/videojuegos/3272.jpg', 12849, '<p>Highly competitive soccer game with rocket-cars is the most comprehensive way to describe this game. Technically a sequel to Psyonix’ previous game - Supersonic Acrobatic Rocket-Powered Battle-Cars; Rocket League successfully became a standalone sensation, that can be enjoyed by anyone. Easy to learn, hard to master game mechanics are perfect for the tight controls. Players are invited to maneuver the different fields within several game modes, from arcade to ranked game either 1v1, or in 2v2 and 3v3 teams. Using boosters will not only speed up the car but will allow the car to propel itself into the air.<br />
Rocket League provides several levels of customization, where not only the color of your car can be adjusted, but the colors and form of the booster flame, different hats, and little flags. Or players can pick a completely different car. Collaboration with different franchises brought not only original transport but some famous cars, including Batmobile or Delorian from Back to the Future.</p>', 'Highly competitive soccer game with rocket-cars is the most comprehensive way to describe this game. Technically a sequel to Psyonix’ previous game - Supersonic Acrobatic Rocket-Powered Battle-Cars; Rocket League successfully became a standalone sensation, that can be enjoyed by anyone. Easy to learn, hard to master game mechanics are perfect for the tight controls. Players are invited to maneuver the different fields within several game modes, from arcade to ranked game either 1v1, or in 2v2 and 3v3 teams. Using boosters will not only speed up the car but will allow the car to propel itself into the air.

Rocket League provides several levels of customization, where not only the color of your car can be adjusted, but the colors and form of the booster flame, different hats, and little flags. Or players can pick a completely different car. Collaboration with different franchises brought not only original transport but some famous cars, including Batmobile or Delorian from Back to the Future.'),
(846505, 'NBA 2K23', 3.09, 85, '2022-09-09', 'assets/videojuegos/846505.jpg', 256, '• 5,000 Virtual Currency<br />
• 5,000 MyTEAM Points<br />
• 10 MyTEAM Promo Packs (delivered one a week)<br />
• A Boost for each MyCAREER Skill type<br />
• A Boost for each Gatorade Boost type<br />
• Devin Booker MyPLAYER Jersey<br />
• 95 Rated Devin Booker MyTEAM Free Agent Card<br />
Rise to the occasion and realize your full potential in NBA 2K23. Prove yourself against the best players in the world and showcase your talent in MyCAREER. Pair today’s All-Stars with timeless legends in MyTEAM. Build a dynasty of your own in MyGM or take the NBA in a new direction with MyLEAGUE. Take on NBA or WNBA teams in PLAY NOW and experience true-to-life gameplay. How will you Answer the Call?<br />
TAKE MORE CONTROL<br />
Feel refined gameplay in the palm of your hands on both sides of the ball in NBA 2K23. Attack the basket with a new arsenal of offensive skill-based moves, while you unleash your potential as a lockdown defender with new 1-on-1 mechanics to stifle opposing players at every turn.<br />
AN EPIC VOYAGE AWAITS<br />
Embark on a swashbuckling basketball journey aboard a spacious cruiseliner equipped with pristine courts, scenic views, and a boatload of rewards for you and your MyPLAYER to enjoy. Plus, there’s even more to explore during shore excursions.<br />
JORDAN CHALLENGE RETURNS<br />
Step back in time with era-specific visuals that captured Michael Jordan’s ascent from collegiate sensation to global icon with immersive Jordan Challenges chronicling his career-defining dominance. Lace up his shoes to recreate his otherworldly stat lines and iconic last shots, while listening to first-hand accounts from those who witnessed his maturation from budding star to basketball legend.<br />
BUILD YOUR SQUAD<br />
Ball without limits as you collect and assemble a bevy of legendary talent from any era in MyTEAM. Dominate the hardwood each Season, and bring your vision to life with a broad set of customization tools to create the perfect look for your perfect starting five.</p>', 'NBA 2K23 Michael Jordan Edition
The NBA 2K23 Michael Jordan Edition includes:
• 100,000 Virtual Currency
• 10,000 MyTEAM Points
• 10 MyTEAM Tokens
• Sapphire Devin Booker and Ruby Michael Jordan MyTEAM Cards
• 23 MyTEAM Promo Packs (Receive 10 at launch plus an Amethyst topper pack, then 2 per week for 6 weeks)
• Free Agent Option MyTEAM Pack
• Diamond Jordan Shoe MyTEAM card
• Ruby Coach Card MyTEAM Pack
• 10 Boosts for each MyCAREER Skill Boost type
• 10 Boosts for each Gatorade Boost type
• 4 Cover Athlete T-Shirts for your MyPLAYER
• MyPLAYER backpack and arm sleeve
• Custom-design skateboard for MyPLAYER
• One 2-Hr Double XP Coin
NBA 2K23 Championship Edition
DIGITAL CHAMPIONSHIP EDITION ONLY AVAILABLE FOR PRE-ORDER – ENDS SEPT 8. INCLUDES 12-MONTH NBA LEAGUE PASS SUBSCRIPTION.*
The NBA 2K23 Championship Edition includes:
• 12-Month NBA League Pass subscription*
• 100,000 Virtual Currency
• 10,000 MyTEAM Points
• 10 MyTEAM Tokens
• Sapphire Devin Booker and Ruby Michael Jordan MyTEAM Cards
• 23 MyTEAM Promo Packs (Receive 10 at launch plus an Amethyst topper pack, then 2 per week for 6 weeks)
• Free Agent Option MyTEAM Pack
• Diamond Jordan Shoe MyTEAM card
• Ruby Coach Card MyTEAM Pack
• 10 Boosts for each MyCAREER Skill Boost type
• 10 Boosts for each Gatorade Boost type
• 4 Cover Athlete T-Shirts for your MyPLAYER
• MyPLAYER backpack and arm sleeve
• Custom-design skateboard for MyPLAYER
• One 2-Hr Double XP Coin
• MJ Themed Go-Kart
• 10% XP Boost on MyTEAM and MyCAREER Season Progression
About the GamePre-order NBA 2K23 to receive the following digital items:
• 5,000 Virtual Currency
• 5,000 MyTEAM Points
• 10 MyTEAM Promo Packs (delivered one a week)
• A Boost for each MyCAREER Skill type
• A Boost for each Gatorade Boost type
• Devin Booker MyPLAYER Jersey
• 95 Rated Devin Booker MyTEAM Free Agent Card
Rise to the occasion and realize your full potential in NBA 2K23. Prove yourself against the best players in the world and showcase your talent in MyCAREER. Pair today’s All-Stars with timeless legends in MyTEAM. Build a dynasty of your own in MyGM or take the NBA in a new direction with MyLEAGUE. Take on NBA or WNBA teams in PLAY NOW and experience true-to-life gameplay. How will you Answer the Call?
TAKE MORE CONTROL
Feel refined gameplay in the palm of your hands on both sides of the ball in NBA 2K23. Attack the basket with a new arsenal of offensive skill-based moves, while you unleash your potential as a lockdown defender with new 1-on-1 mechanics to stifle opposing players at every turn.
AN EPIC VOYAGE AWAITS
Embark on a swashbuckling basketball journey aboard a spacious cruiseliner equipped with pristine courts, scenic views, and a boatload of rewards for you and your MyPLAYER to enjoy. Plus, there’s even more to explore during shore excursions.
JORDAN CHALLENGE RETURNS
Step back in time with era-specific visuals that captured Michael Jordan’s ascent from collegiate sensation to global icon with immersive Jordan Challenges chronicling his career-defining dominance. Lace up his shoes to recreate his otherworldly stat lines and iconic last shots, while listening to first-hand accounts from those who witnessed his maturation from budding star to basketball legend.
BUILD YOUR SQUAD
Ball without limits as you collect and assemble a bevy of legendary talent from any era in MyTEAM. Dominate the hardwood each Season, and bring your vision to life with a broad set of customization tools to create the perfect look for your perfect starting five.'),
(963218, 'EA SPORTS FC 24', 3.5, 85, '2023-09-22', 'assets/videojuegos/963218.jpg', 239, '<p>EA SPORTS FC™ 24 welcomes you to The World’s Game—the most true-to-football experience ever with HyperMotionV*, PlayStyles optimised by Opta, and a revolutionised Frostbite™ Engine reinventing how 19,000+ authentic players move, play and look in every match.</p>', 'EA SPORTS FC™ 24 welcomes you to The World’s Game—the most true-to-football experience ever with HyperMotionV*, PlayStyles optimised by Opta, and a revolutionised Frostbite™ Engine reinventing how 19,000+ authentic players move, play and look in every match.'),
(442847, 'Tony Hawk''s Pro Skater 1 + 2', 4.29, 88, '2020-09-04', 'assets/videojuegos/442847.jpg', 1813, '<p>Play the fully-remastered Tony Hawk’s™ Pro Skater™ &amp; Tony Hawk’s™ Pro Skater™ 2 games in one epic collection, rebuilt from the ground up in incredible HD.</p>
<p>Drop Back In With The Most Iconic Skateboarding Games Ever Made<br />
Skate as the legendary Tony Hawk and the full pro roster. Listen to songs from the era-defining soundtrack. Hit insane trick combos with the iconic handling of the Tony Hawk’s™ Pro Skater™ series.</p>
<p>All The Original Game Modes And More<br />
Play all the original modes and go head-to-head with local 2-Player modes. Show off your style and creativity with upgraded Create-A-Park and Create-A-Skater features. Compete against players from around the world in Multiplayer modes and leaderboards.</p>', 'Play the fully-remastered Tony Hawk’s™ Pro Skater™ & Tony Hawk’s™ Pro Skater™ 2 games in one epic collection, rebuilt from the ground up in incredible HD.



Drop Back In With The Most Iconic Skateboarding Games Ever Made

Skate as the legendary Tony Hawk and the full pro roster. Listen to songs from the era-defining soundtrack. Hit insane trick combos with the iconic handling of the Tony Hawk’s™ Pro Skater™ series.



All The Original Game Modes And More

Play all the original modes and go head-to-head with local 2-Player modes. Show off your style and creativity with upgraded Create-A-Park and Create-A-Skater features. Compete against players from around the world in Multiplayer modes and leaderboards.'),
(622492, 'Forza Horizon 5', 4.29, 85, '2021-11-08', 'assets/videojuegos/622492.jpg', 4739, '<p>Your Ultimate Horizon Adventure awaits! Explore the vibrant and ever-evolving open world landscapes of Mexico with limitless, fun driving action in hundreds of the world’s greatest cars.<br />
Explore a world of striking contrast and beauty. Discover living deserts, lush jungles, historic cities, hidden ruins, pristine beaches, vast canyons and a towering snow-capped volcano.<br />
Immerse yourself in a deep campaign with hundreds of challenges that reward you for engaging in the activities you love. Meet new characters and choose the outcomes of their Horizon Story missions.<br />
Take on awe-inspiring weather events like towering dust storms and intense tropical storms as Mexico’s unique, dynamic seasons change the world every week. Keep coming back for new events, challenges, collectibles, and rewards, and new areas to explore.<br />
Team up with other players and enter the Horizon Arcade for a continuing series of fun, over-the-top challenges that keep you and your friends in the action and having fun with no menus, loading screens or lobbies.<br />
Create your own expressions of fun with the new EventLab gameplay toolset including custom races, challenges, stunts, and new game modes. Customize your cars in more ways than ever before. Use the Gift Drops feature to share your custom creations.</p>', 'Your Ultimate Horizon Adventure awaits! Explore the vibrant and ever-evolving open world landscapes of Mexico with limitless, fun driving action in hundreds of the world’s greatest cars.

Explore a world of striking contrast and beauty. Discover living deserts, lush jungles, historic cities, hidden ruins, pristine beaches, vast canyons and a towering snow-capped volcano.

Immerse yourself in a deep campaign with hundreds of challenges that reward you for engaging in the activities you love. Meet new characters and choose the outcomes of their Horizon Story missions.

Take on awe-inspiring weather events like towering dust storms and intense tropical storms as Mexico’s unique, dynamic seasons change the world every week. Keep coming back for new events, challenges, collectibles, and rewards, and new areas to explore.

Team up with other players and enter the Horizon Arcade for a continuing series of fun, over-the-top challenges that keep you and your friends in the action and having fun with no menus, loading screens or lobbies.

Create your own expressions of fun with the new EventLab gameplay toolset including custom races, challenges, stunts, and new game modes. Customize your cars in more ways than ever before. Use the Gift Drops feature to share your custom creations.'),
(1391, 'Assetto Corsa', 3.91, 85, '2014-12-19', 'assets/videojuegos/1391.jpg', 2653, '<p>NEXT GENERATION RACING SIMULATOR<br />
Assetto Corsa features an advanced DirectX 11 graphics engine that recreates an immersive environment, dynamic lighthing and realistic materials and surfaces. The advanced physics engine is being designed to provide a very realistic driving experience, including features and aspects of real cars, never seen on any other racing simulator such as tyre flat spots, heat cycles including graining and blistering, very advanced aerodynamic simulation with active movable aerodynamics parts controlled in real time by telemetry input channels, hybrid systems with kers and energy recovery simulation. Extremely detailed with single player and multiplayer options, exclusive licensed cars reproduced with the best accuracy possible, thanks to the official cooperation of Car Manufacturers.<br />
ASSETTO CORSA has been developed at the KUNOS Simulazioni R&amp;D office, located just inside the international racing circuit of Vallelunga, allowing the team to develop the game with the cooperation of real world racing drivers and racing teams.<br />
LEGENDARY TRACKS<br />
The circuits have been developed using Laser scan technology, in order to guarantee the highest level of accuracy possible in reproducing real world motor racing environments.<br />
Monza, Silverstone, Imola, Mugello, Spa, Brands Hatch and many more tracks, including the historical reproduction of Monza, that brings again to life the legendary Sopraelevata, the high-speed oval where races were staged until 1961.<br />
EXCLUSIVE CARS<br />
The Assetto Corsa physics engine is all new, using practical knowledge acquired from working closely with the elite of motorsport in order to engineer the best possible accuracy of physics and tactility of feeling.<br />
A physics engine like this begs to be used with officially licensed contents: Abarth, Audi, BMW, Classic Team Lotus, Ferrari, KTM, Lamborghini, Lotus cars, McLaren, Mercedes, Scuderia Glickenhaus, Pagani, Porsche, Tatuus and many more!<br />
HARDWARE COMPATIBILITY<br />
Enjoy ASSETTO CORSA using any kind of game device: keyboard, joypad, joystick, steering wheels including any kind of professional device and the most common motion systems.<br />
ASSETTO CORSA is also compatible and ready for Oculus and OpenVR/VIVE, triple monitor view, Track IR and 3D VISION.<br />
GAMEPLAY &amp; FEATURES<br />
Assetto Corsa includes a career mode, a list of special and unique events and challenges, as well as a fully customizable, single player and multiplayer modes featuring quick races, custom championships, race weekends including free practice session, qualifying session and race. Drag races, drift challenges and much more! Four driving assist profiles (gamer, racer, pro, plus a fully-customizable profile) allow any kind of player to enjoy the simulation at their desired level.<br />
Advanced setup options and telemetry for data analysis; dynamic simulation of the tyre rubber deposited on track, depending on the car laps; an adjustable time of the day mode, featuring sun position calculated in realtime, depending by geographical coordinates of the track and by the sun curve according to time and date, in order to get the same light conditions of the real tracks!<br />
MODDING &amp; CUSTOMIZATION<br />
Assetto Corsa will allow for considerable customisation and modification, in order to satisfy the expectations of professional simracers, gamers who prefer to approach the driving experience more progressively, and hobbyists who just like to reproduce and share their cars and tracks, taking advantage of the same editing tools developed and used by the developers of the game.Available content:<br />
CARS<br />
PRODUCTION<br />
- Abarth 595 EsseEsse (3 variants)<br />
- Abarth 500 EsseEsse (2 variants)<br />
- Alfa Romeo Giulietta QV<br />
- Alfa Romeo Giulietta QV Launch Edition<br />
- Alfa Romeo MiTo QV<br />
- Audi Sport Quattro (2 variants)<br />
- Audi S1<br />
- Bmw 1M (2 variants)<br />
- Lamborghini Miura S.V.<br />
- Lotus Elise SC (3 variants)<br />
- Maserati Levante S<br />
- Mazda MX-5 NA<br />
- Porsche Panamera G2<br />
- Porsche Cayenne Turbo S<br />
- Porsche Macan Turbo<br />
- Shelby Cobra<br />
- RUF CTR Yellowbird<br />
- Toyota GT-86<br />
- Ford Mustang 2015<br />
- Chevrolet Corvette C7 Stingray<br />
GT<br />
- Bmw M3 E30 Evo (3 variants)<br />
- Bmw M3 E30 Group A<br />
- Bmw M3 E30 DTM<br />
- Bmw M3 E92 (3 variants)<br />
- Bmw Z4 E89 (3 variants)<br />
- Lotus Evora GTC<br />
- Lotus Evora GX<br />
GTR<br />
- McLaren MP4-12c GT3<br />
- Bmw Z4 GT3<br />
- Bmw M3 GT2<br />
- Ferrari 458 GT2<br />
- P4/5 Competizione<br />
- Mercedes SLS GT3<br />
CLASSIC GP<br />
- Classic Team Lotus Type 49<br />
- Classic Team Lotus 98T<br />
- Ferrari 312T<br />
RALLY<br />
- Audi Sport Quattro S1 E2<br />
ENDURANCE<br />
- Mazda 787B<br />
SUPERCAR<br />
- Audi R8 Plus<br />
- Ferrari LaFerrari<br />
- Ferrari 458 Italia (2 variants)<br />
- Ferrari F40 (2 variants)<br />
- Ferrari 599xx<br />
- McLaren Mp4 12c<br />
- Mercedes SLS AMG<br />
- Nissan GTR NISMO<br />
- Pagani Zonda R<br />
- Pagani Huayra<br />
- Lotus Evora S (2 variants)<br />
- Lotus Exige S Roadster<br />
- Lotus Exige Scura<br />
- Lotus 2 Eleven GT4<br />
TRACKDAY<br />
- KTM X-Bow R<br />
- Lotus 2 Eleven<br />
- Lotus Evora GTE<br />
- Lotus Evora GTE Carbon<br />
- Lotus Exige 240R (2 variants)<br />
- Lotus Exige V6 Cup<br />
OPEN WHEEL<br />
- Tatuus FA-01<br />
- Lotus Exos T125 (2 variants)<br />
TRACKS<br />
- Magione - &quot;Autodromo dell&#39;Umbria&quot;<br />
- Imola - &quot;Autodromo Enzo e Dino Ferrari&quot;<br />
- Mugello - &quot;Autodromo Internazionale del Mugello&quot;<br />
- Silverstone - GP<br />
- Silverstone - International<br />
- Silverstone - National<br />
- Silverstone 1967<br />
- Monza - &quot;Autodromo di Monza&quot;<br />
- Monza - &quot;Classic 60&#39;s Edition&quot; (3 variants)<br />
- Nurburgring - GP<br />
- Nurburgring - Sprint<br />
- Spa Francorchamps<br />
- Vallelunga - &quot;Autodromo Piero Taruffi&quot;<br />
- Vallelunga - Circuito Club<br />
- Zandvoort<br />
- Trento - Bondone Hillclimb<br />
- Drift Track<br />
- Drag strip<br />
- Black Cat County (fantasy track)<br />
- Highlands (fantasy track)<br />
SHOWROOMS<br />
- Standard showroom<br />
- The Beach<br />
- Hangar<br />
- Industrial<br />
- Sunset<br />
GAME MODES<br />
- Free Practice<br />
- Racing against AI<br />
- Career<br />
- Custom championship<br />
- Online Multiplayer<br />
- HotLap<br />
- Time Attack<br />
- Special Events<br />
- Drift<br />
- Drag race<br />
FEATURES<br />
- In game telemetry and apps<br />
- Advanced car setup management<br />
- Flags<br />
- Penalties<br />
APPS LIST<br />
- Basic info<br />
- Chat app<br />
- Tyre app<br />
- Real time app<br />
- Help<br />
- Lap time<br />
- Pit stop presets<br />
- Friends Leaderboard<br />
- Camera On Board Customization<br />
- Time of the day display<br />
- Input monitor<br />
- Time performance indicator<br />
- Gear/rpm indicator<br />
- Track map<br />
- Rankings<br />
- G-meter indicator</p>', 'NEXT GENERATION RACING SIMULATOR
Assetto Corsa features an advanced DirectX 11 graphics engine that recreates an immersive environment, dynamic lighthing and realistic materials and surfaces. The advanced physics engine is being designed to provide a very realistic driving experience, including features and aspects of real cars, never seen on any other racing simulator such as tyre flat spots, heat cycles including graining and blistering, very advanced aerodynamic simulation with active movable aerodynamics parts controlled in real time by telemetry input channels, hybrid systems with kers and energy recovery simulation. Extremely detailed with single player and multiplayer options, exclusive licensed cars reproduced with the best accuracy possible, thanks to the official cooperation of Car Manufacturers.
ASSETTO CORSA has been developed at the KUNOS Simulazioni R&D office, located just inside the international racing circuit of Vallelunga, allowing the team to develop the game with the cooperation of real world racing drivers and racing teams.
LEGENDARY TRACKS
The circuits have been developed using Laser scan technology, in order to guarantee the highest level of accuracy possible in reproducing real world motor racing environments.
Monza, Silverstone, Imola, Mugello, Spa, Brands Hatch and many more tracks, including the historical reproduction of Monza, that brings again to life the legendary Sopraelevata, the high-speed oval where races were staged until 1961.
EXCLUSIVE CARS
The Assetto Corsa physics engine is all new, using practical knowledge acquired from working closely with the elite of motorsport in order to engineer the best possible accuracy of physics and tactility of feeling.
A physics engine like this begs to be used with officially licensed contents: Abarth, Audi, BMW, Classic Team Lotus, Ferrari, KTM, Lamborghini, Lotus cars, McLaren, Mercedes, Scuderia Glickenhaus, Pagani, Porsche, Tatuus and many more!
HARDWARE COMPATIBILITY
Enjoy ASSETTO CORSA using any kind of game device: keyboard, joypad, joystick, steering wheels including any kind of professional device and the most common motion systems.
ASSETTO CORSA is also compatible and ready for Oculus and OpenVR/VIVE, triple monitor view, Track IR and 3D VISION.
GAMEPLAY & FEATURES
Assetto Corsa includes a career mode, a list of special and unique events and challenges, as well as a fully customizable, single player and multiplayer modes featuring quick races, custom championships, race weekends including free practice session, qualifying session and race. Drag races, drift challenges and much more! Four driving assist profiles (gamer, racer, pro, plus a fully-customizable profile) allow any kind of player to enjoy the simulation at their desired level.
Advanced setup options and telemetry for data analysis; dynamic simulation of the tyre rubber deposited on track, depending on the car laps; an adjustable time of the day mode, featuring sun position calculated in realtime, depending by geographical coordinates of the track and by the sun curve according to time and date, in order to get the same light conditions of the real tracks!
MODDING & CUSTOMIZATION
Assetto Corsa will allow for considerable customisation and modification, in order to satisfy the expectations of professional simracers, gamers who prefer to approach the driving experience more progressively, and hobbyists who just like to reproduce and share their cars and tracks, taking advantage of the same editing tools developed and used by the developers of the game.Available content:
CARS
PRODUCTION
- Abarth 595 EsseEsse (3 variants)
- Abarth 500 EsseEsse (2 variants)
- Alfa Romeo Giulietta QV
- Alfa Romeo Giulietta QV Launch Edition
- Alfa Romeo MiTo QV
- Audi Sport Quattro (2 variants)
- Audi S1
- Bmw 1M (2 variants)
- Lamborghini Miura S.V.
- Lotus Elise SC (3 variants)
- Maserati Levante S
- Mazda MX-5 NA
- Porsche Panamera G2
- Porsche Cayenne Turbo S
- Porsche Macan Turbo
- Shelby Cobra
- RUF CTR Yellowbird
- Toyota GT-86
- Ford Mustang 2015
- Chevrolet Corvette C7 Stingray
GT
- Bmw M3 E30 Evo (3 variants)
- Bmw M3 E30 Group A
- Bmw M3 E30 DTM
- Bmw M3 E92 (3 variants)
- Bmw Z4 E89 (3 variants)
- Lotus Evora GTC
- Lotus Evora GX
GTR
- McLaren MP4-12c GT3
- Bmw Z4 GT3
- Bmw M3 GT2
- Ferrari 458 GT2
- P4/5 Competizione
- Mercedes SLS GT3
CLASSIC GP
- Classic Team Lotus Type 49
- Classic Team Lotus 98T
- Ferrari 312T
RALLY
- Audi Sport Quattro S1 E2
ENDURANCE
- Mazda 787B
SUPERCAR
- Audi R8 Plus
- Ferrari LaFerrari
- Ferrari 458 Italia (2 variants)
- Ferrari F40 (2 variants)
- Ferrari 599xx
- McLaren Mp4 12c
- Mercedes SLS AMG
- Nissan GTR NISMO
- Pagani Zonda R
- Pagani Huayra
- Lotus Evora S (2 variants)
- Lotus Exige S Roadster
- Lotus Exige Scura
- Lotus 2 Eleven GT4
TRACKDAY
- KTM X-Bow R
- Lotus 2 Eleven
- Lotus Evora GTE
- Lotus Evora GTE Carbon
- Lotus Exige 240R (2 variants)
- Lotus Exige V6 Cup
OPEN WHEEL
- Tatuus FA-01
- Lotus Exos T125 (2 variants)
TRACKS
- Magione - "Autodromo dell''Umbria"
- Imola - "Autodromo Enzo e Dino Ferrari"
- Mugello - "Autodromo Internazionale del Mugello"
- Silverstone - GP
- Silverstone - International
- Silverstone - National
- Silverstone 1967
- Monza - "Autodromo di Monza"
- Monza - "Classic 60''s Edition" (3 variants)
- Nurburgring - GP
- Nurburgring - Sprint
- Spa Francorchamps
- Vallelunga - "Autodromo Piero Taruffi"
- Vallelunga - Circuito Club
- Zandvoort
- Trento - Bondone Hillclimb
- Drift Track
- Drag strip
- Black Cat County (fantasy track)
- Highlands (fantasy track)
SHOWROOMS
- Standard showroom
- The Beach
- Hangar
- Industrial
- Sunset
GAME MODES
- Free Practice
- Racing against AI
- Career
- Custom championship
- Online Multiplayer
- HotLap
- Time Attack
- Special Events
- Drift
- Drag race
FEATURES
- In game telemetry and apps
- Advanced car setup management
- Flags
- Penalties
APPS LIST
- Basic info
- Chat app
- Tyre app
- Real time app
- Help
- Lap time
- Pit stop presets
- Friends Leaderboard
- Camera On Board Customization
- Time of the day display
- Input monitor
- Time performance indicator
- Gear/rpm indicator
- Track map
- Rankings
- G-meter indicator'),
(364806, 'Need for Speed Heat', 3.26, 73, '2019-11-08', 'assets/videojuegos/364806.jpg', 3904, '<p>Hustle by day and risk it all by night in Need for Speed™ Heat, a thrilling race experience that pits you against a city’s rogue police force as you battle your way into street racing’s elite.</p>', 'Hustle by day and risk it all by night in Need for Speed™ Heat, a thrilling race experience that pits you against a city’s rogue police force as you battle your way into street racing’s elite.');

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

-- RELACIONES DE GÉNERO PARA NUEVOS VIDEOJUEGOS
INSERT INTO videojuego_genero (videojuego_id, genero_id) VALUES
(12020, 1),
(12020, 4),
(50734, 1),
(50734, 3),
(58755, 1),
(422, 1),
(422, 6),
(422, 7),
(5286, 1),
(257201, 1),
(257201, 2),
(46889, 1),
(46889, 2),
(46889, 3),
(3070, 1),
(3070, 3),
(339958, 2),
(339958, 3),
(58777, 1),
(58777, 4),
(13537, 1),
(13537, 4),
(4062, 1),
(4062, 4),
(290856, 1),
(290856, 4),
(13536, 1),
(13536, 5),
(12929, 2),
(12929, 6),
(12929, 5),
(50839, 6),
(50839, 5),
(1450, 1),
(1450, 2),
(1450, 6),
(1450, 5),
(1450, 7),
(1030, 1),
(1030, 2),
(1030, 6),
(1030, 5),
(1030, 7),
(58764, 2),
(58764, 6),
(58764, 5),
(10419, 2),
(10419, 6),
(11726, 1),
(11726, 3),
(11726, 6),
(11726, 7),
(28154, 1),
(28154, 6),
(28154, 7),
(13627, 3),
(13627, 6),
(262382, 2),
(262382, 3),
(262382, 6),
(19590, 2),
(19590, 7),
(455597, 1),
(455597, 2),
(455597, 7),
(257192, 1),
(257192, 2),
(257192, 7),
(3272, 8),
(3272, 9),
(3272, 6),
(846505, 8),
(963218, 8),
(442847, 8),
(622492, 9),
(1391, 8),
(1391, 9),
(1391, 6),
(364806, 9);

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

-- RELACIONES DE PLATAFORMA PARA NUEVOS VIDEOJUEGOS
INSERT INTO videojuego_plataforma (videojuego_id, plataforma_id) VALUES
(12020, 3),
(12020, 1),
(50734, 3),
(50734, 1),
(50734, 2),
(58755, 2),
(58755, 3),
(58755, 1),
(422, 3),
(422, 4),
(422, 2),
(422, 1),
(5286, 2),
(5286, 3),
(5286, 1),
(257201, 2),
(257201, 1),
(257201, 3),
(46889, 2),
(46889, 3),
(46889, 1),
(3070, 2),
(3070, 1),
(3070, 3),
(339958, 3),
(339958, 1),
(339958, 2),
(339958, 4),
(58777, 1),
(58777, 2),
(58777, 3),
(58777, 4),
(13537, 1),
(13537, 3),
(4062, 2),
(4062, 3),
(4062, 4),
(4062, 1),
(290856, 2),
(290856, 4),
(290856, 1),
(290856, 3),
(13536, 1),
(13536, 2),
(13536, 3),
(13536, 4),
(12929, 3),
(12929, 2),
(12929, 1),
(12929, 4),
(50839, 4),
(50839, 1),
(1450, 4),
(1450, 1),
(1450, 3),
(1450, 2),
(1030, 1),
(1030, 2),
(1030, 3),
(1030, 4),
(58764, 2),
(58764, 4),
(58764, 3),
(58764, 1),
(10419, 2),
(10419, 3),
(10419, 1),
(10419, 4),
(11726, 3),
(11726, 4),
(11726, 2),
(11726, 1),
(28154, 2),
(28154, 4),
(28154, 3),
(28154, 1),
(13627, 3),
(13627, 4),
(13627, 1),
(13627, 2),
(262382, 1),
(262382, 3),
(262382, 4),
(262382, 2),
(19590, 3),
(19590, 1),
(455597, 2),
(455597, 3),
(455597, 1),
(455597, 4),
(257192, 2),
(257192, 3),
(257192, 1),
(3272, 4),
(3272, 1),
(3272, 3),
(3272, 2),
(846505, 2),
(846505, 3),
(846505, 1),
(846505, 4),
(963218, 2),
(963218, 3),
(963218, 4),
(963218, 1),
(442847, 1),
(442847, 3),
(442847, 4),
(442847, 2),
(622492, 1),
(622492, 3),
(622492, 2),
(1391, 3),
(1391, 2),
(1391, 1),
(364806, 2),
(364806, 1),
(364806, 3);

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

-- RELACIONES DE ETIQUETAS PARA NUEVOS VIDEOJUEGOS
INSERT INTO videojuego_tag (videojuego_id, tag_id) VALUES
(12020, 1),
(12020, 2),
(12020, 6),
(50734, 1),
(50734, 8),
(50734, 7),
(50734, 3),
(50734, 9),
(50734, 10),
(58755, 1),
(58755, 8),
(422, 1),
(422, 2),
(422, 8),
(422, 3),
(422, 9),
(5286, 1),
(5286, 2),
(5286, 8),
(5286, 9),
(257201, 1),
(257201, 8),
(257201, 7),
(257201, 4),
(257201, 9),
(46889, 1),
(46889, 2),
(46889, 8),
(46889, 3),
(46889, 5),
(46889, 9),
(3070, 1),
(3070, 8),
(3070, 7),
(3070, 3),
(3070, 4),
(3070, 9),
(339958, 1),
(339958, 7),
(58777, 1),
(58777, 2),
(58777, 8),
(58777, 4),
(58777, 6),
(13537, 1),
(13537, 2),
(13537, 8),
(13537, 7),
(13537, 4),
(13537, 6),
(4062, 1),
(4062, 8),
(4062, 7),
(4062, 4),
(4062, 5),
(290856, 2),
(290856, 8),
(290856, 4),
(290856, 9),
(13536, 1),
(13536, 8),
(13536, 7),
(13536, 4),
(12929, 1),
(12929, 8),
(12929, 7),
(12929, 3),
(12929, 4),
(12929, 9),
(50839, 1),
(50839, 6),
(1450, 1),
(1450, 8),
(1450, 7),
(1450, 4),
(1450, 6),
(1030, 1),
(1030, 8),
(1030, 6),
(1030, 10),
(10419, 1),
(10419, 2),
(10419, 8),
(10419, 3),
(10419, 4),
(10419, 6),
(10419, 9),
(11726, 1),
(11726, 8),
(28154, 1),
(13627, 1),
(13627, 7),
(13627, 6),
(262382, 1),
(262382, 7),
(19590, 1),
(19590, 8),
(19590, 7),
(19590, 3),
(19590, 5),
(19590, 9),
(455597, 2),
(455597, 7),
(455597, 9),
(257192, 1),
(3272, 1),
(3272, 2),
(846505, 1),
(846505, 2),
(963218, 1),
(963218, 2),
(442847, 1),
(442847, 2),
(622492, 1),
(622492, 2),
(622492, 8),
(622492, 3),
(622492, 9),
(1391, 1),
(1391, 2),
(1391, 3),
(364806, 1),
(364806, 2),
(364806, 8),
(364806, 3);

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

-- CAPTURAS DE PANTALLA PARA NUEVOS VIDEOJUEGOS
INSERT INTO screenshot (ID, IMAGE, videojuego_id) VALUES
(86, 'assets/videojuegos/screenshots/86.jpg', 12020),
(87, 'assets/videojuegos/screenshots/87.jpg', 12020),
(88, 'assets/videojuegos/screenshots/88.jpg', 12020),
(89, 'assets/videojuegos/screenshots/89.jpg', 12020),
(90, 'assets/videojuegos/screenshots/90.jpg', 12020),
(91, 'assets/videojuegos/screenshots/91.jpg', 50734),
(92, 'assets/videojuegos/screenshots/92.jpg', 50734),
(93, 'assets/videojuegos/screenshots/93.jpg', 50734),
(94, 'assets/videojuegos/screenshots/94.jpg', 50734),
(95, 'assets/videojuegos/screenshots/95.jpg', 50734),
(96, 'assets/videojuegos/screenshots/96.jpg', 58755),
(97, 'assets/videojuegos/screenshots/97.jpg', 58755),
(98, 'assets/videojuegos/screenshots/98.jpg', 58755),
(99, 'assets/videojuegos/screenshots/99.jpg', 58755),
(100, 'assets/videojuegos/screenshots/100.jpg', 58755),
(101, 'assets/videojuegos/screenshots/101.jpg', 422),
(102, 'assets/videojuegos/screenshots/102.jpg', 422),
(103, 'assets/videojuegos/screenshots/103.jpg', 422),
(104, 'assets/videojuegos/screenshots/104.jpg', 422),
(105, 'assets/videojuegos/screenshots/105.jpg', 422),
(106, 'assets/videojuegos/screenshots/106.jpg', 5286),
(107, 'assets/videojuegos/screenshots/107.jpg', 5286),
(108, 'assets/videojuegos/screenshots/108.jpg', 5286),
(109, 'assets/videojuegos/screenshots/109.jpg', 5286),
(110, 'assets/videojuegos/screenshots/110.jpg', 5286),
(111, 'assets/videojuegos/screenshots/111.jpg', 257201),
(112, 'assets/videojuegos/screenshots/112.jpg', 257201),
(113, 'assets/videojuegos/screenshots/113.jpg', 257201),
(114, 'assets/videojuegos/screenshots/114.jpg', 257201),
(115, 'assets/videojuegos/screenshots/115.jpg', 257201),
(116, 'assets/videojuegos/screenshots/116.jpg', 46889),
(117, 'assets/videojuegos/screenshots/117.jpg', 46889),
(118, 'assets/videojuegos/screenshots/118.jpg', 46889),
(119, 'assets/videojuegos/screenshots/119.jpg', 46889),
(120, 'assets/videojuegos/screenshots/120.jpg', 46889),
(121, 'assets/videojuegos/screenshots/121.jpg', 3070),
(122, 'assets/videojuegos/screenshots/122.jpg', 3070),
(123, 'assets/videojuegos/screenshots/123.jpg', 3070),
(124, 'assets/videojuegos/screenshots/124.jpg', 3070),
(125, 'assets/videojuegos/screenshots/125.jpg', 3070),
(126, 'assets/videojuegos/screenshots/126.jpg', 339958),
(127, 'assets/videojuegos/screenshots/127.jpg', 339958),
(128, 'assets/videojuegos/screenshots/128.jpg', 339958),
(129, 'assets/videojuegos/screenshots/129.jpg', 339958),
(130, 'assets/videojuegos/screenshots/130.jpg', 339958),
(131, 'assets/videojuegos/screenshots/131.jpg', 58777),
(132, 'assets/videojuegos/screenshots/132.jpg', 58777),
(133, 'assets/videojuegos/screenshots/133.jpg', 58777),
(134, 'assets/videojuegos/screenshots/134.jpg', 58777),
(135, 'assets/videojuegos/screenshots/135.jpg', 58777),
(136, 'assets/videojuegos/screenshots/136.jpg', 13537),
(137, 'assets/videojuegos/screenshots/137.jpg', 13537),
(138, 'assets/videojuegos/screenshots/138.jpg', 13537),
(139, 'assets/videojuegos/screenshots/139.jpg', 13537),
(140, 'assets/videojuegos/screenshots/140.jpg', 13537),
(141, 'assets/videojuegos/screenshots/141.jpg', 4062),
(142, 'assets/videojuegos/screenshots/142.jpg', 4062),
(143, 'assets/videojuegos/screenshots/143.jpg', 4062),
(144, 'assets/videojuegos/screenshots/144.jpg', 4062),
(145, 'assets/videojuegos/screenshots/145.jpg', 4062),
(146, 'assets/videojuegos/screenshots/146.jpg', 290856),
(147, 'assets/videojuegos/screenshots/147.jpg', 290856),
(148, 'assets/videojuegos/screenshots/148.jpg', 290856),
(149, 'assets/videojuegos/screenshots/149.jpg', 290856),
(150, 'assets/videojuegos/screenshots/150.jpg', 290856),
(151, 'assets/videojuegos/screenshots/151.jpg', 13536),
(152, 'assets/videojuegos/screenshots/152.jpg', 13536),
(153, 'assets/videojuegos/screenshots/153.jpg', 13536),
(154, 'assets/videojuegos/screenshots/154.jpg', 13536),
(155, 'assets/videojuegos/screenshots/155.jpg', 13536),
(156, 'assets/videojuegos/screenshots/156.jpg', 12929),
(157, 'assets/videojuegos/screenshots/157.jpg', 12929),
(158, 'assets/videojuegos/screenshots/158.jpg', 12929),
(159, 'assets/videojuegos/screenshots/159.jpg', 12929),
(160, 'assets/videojuegos/screenshots/160.jpg', 12929),
(161, 'assets/videojuegos/screenshots/161.jpg', 50839),
(162, 'assets/videojuegos/screenshots/162.jpg', 50839),
(163, 'assets/videojuegos/screenshots/163.jpg', 50839),
(164, 'assets/videojuegos/screenshots/164.jpg', 50839),
(165, 'assets/videojuegos/screenshots/165.jpg', 50839),
(166, 'assets/videojuegos/screenshots/166.jpg', 1450),
(167, 'assets/videojuegos/screenshots/167.jpg', 1450),
(168, 'assets/videojuegos/screenshots/168.jpg', 1450),
(169, 'assets/videojuegos/screenshots/169.jpg', 1450),
(170, 'assets/videojuegos/screenshots/170.jpg', 1450),
(171, 'assets/videojuegos/screenshots/171.jpg', 1030),
(172, 'assets/videojuegos/screenshots/172.jpg', 1030),
(173, 'assets/videojuegos/screenshots/173.jpg', 1030),
(174, 'assets/videojuegos/screenshots/174.jpg', 1030),
(175, 'assets/videojuegos/screenshots/175.jpg', 1030),
(176, 'assets/videojuegos/screenshots/176.jpg', 58764),
(177, 'assets/videojuegos/screenshots/177.jpg', 58764),
(178, 'assets/videojuegos/screenshots/178.jpg', 58764),
(179, 'assets/videojuegos/screenshots/179.jpg', 58764),
(180, 'assets/videojuegos/screenshots/180.jpg', 58764),
(181, 'assets/videojuegos/screenshots/181.jpg', 10419),
(182, 'assets/videojuegos/screenshots/182.jpg', 10419),
(183, 'assets/videojuegos/screenshots/183.jpg', 10419),
(184, 'assets/videojuegos/screenshots/184.jpg', 10419),
(185, 'assets/videojuegos/screenshots/185.jpg', 10419),
(186, 'assets/videojuegos/screenshots/186.jpg', 11726),
(187, 'assets/videojuegos/screenshots/187.jpg', 11726),
(188, 'assets/videojuegos/screenshots/188.jpg', 11726),
(189, 'assets/videojuegos/screenshots/189.jpg', 11726),
(190, 'assets/videojuegos/screenshots/190.jpg', 11726),
(191, 'assets/videojuegos/screenshots/191.jpg', 28154),
(192, 'assets/videojuegos/screenshots/192.jpg', 28154),
(193, 'assets/videojuegos/screenshots/193.jpg', 28154),
(194, 'assets/videojuegos/screenshots/194.jpg', 28154),
(195, 'assets/videojuegos/screenshots/195.jpg', 28154),
(196, 'assets/videojuegos/screenshots/196.jpg', 13627),
(197, 'assets/videojuegos/screenshots/197.jpg', 13627),
(198, 'assets/videojuegos/screenshots/198.jpg', 13627),
(199, 'assets/videojuegos/screenshots/199.jpg', 13627),
(200, 'assets/videojuegos/screenshots/200.jpg', 13627),
(201, 'assets/videojuegos/screenshots/201.jpg', 262382),
(202, 'assets/videojuegos/screenshots/202.jpg', 262382),
(203, 'assets/videojuegos/screenshots/203.jpg', 262382),
(204, 'assets/videojuegos/screenshots/204.jpg', 262382),
(205, 'assets/videojuegos/screenshots/205.jpg', 262382),
(206, 'assets/videojuegos/screenshots/206.jpg', 19590),
(207, 'assets/videojuegos/screenshots/207.jpg', 19590),
(208, 'assets/videojuegos/screenshots/208.jpg', 19590),
(209, 'assets/videojuegos/screenshots/209.jpg', 19590),
(210, 'assets/videojuegos/screenshots/210.jpg', 19590),
(211, 'assets/videojuegos/screenshots/211.jpg', 455597),
(212, 'assets/videojuegos/screenshots/212.jpg', 455597),
(213, 'assets/videojuegos/screenshots/213.jpg', 455597),
(214, 'assets/videojuegos/screenshots/214.jpg', 455597),
(215, 'assets/videojuegos/screenshots/215.jpg', 455597),
(216, 'assets/videojuegos/screenshots/216.jpg', 257192),
(217, 'assets/videojuegos/screenshots/217.jpg', 257192),
(218, 'assets/videojuegos/screenshots/218.jpg', 257192),
(219, 'assets/videojuegos/screenshots/219.jpg', 257192),
(220, 'assets/videojuegos/screenshots/220.jpg', 257192),
(221, 'assets/videojuegos/screenshots/221.jpg', 3272),
(222, 'assets/videojuegos/screenshots/222.jpg', 3272),
(223, 'assets/videojuegos/screenshots/223.jpg', 3272),
(224, 'assets/videojuegos/screenshots/224.jpg', 3272),
(225, 'assets/videojuegos/screenshots/225.jpg', 3272),
(226, 'assets/videojuegos/screenshots/226.jpg', 846505),
(227, 'assets/videojuegos/screenshots/227.jpg', 846505),
(228, 'assets/videojuegos/screenshots/228.jpg', 846505),
(229, 'assets/videojuegos/screenshots/229.jpg', 846505),
(230, 'assets/videojuegos/screenshots/230.jpg', 846505),
(231, 'assets/videojuegos/screenshots/231.jpg', 963218),
(232, 'assets/videojuegos/screenshots/232.jpg', 963218),
(233, 'assets/videojuegos/screenshots/233.jpg', 963218),
(234, 'assets/videojuegos/screenshots/234.jpg', 963218),
(235, 'assets/videojuegos/screenshots/235.jpg', 963218),
(236, 'assets/videojuegos/screenshots/236.jpg', 442847),
(237, 'assets/videojuegos/screenshots/237.jpg', 442847),
(238, 'assets/videojuegos/screenshots/238.jpg', 442847),
(239, 'assets/videojuegos/screenshots/239.jpg', 442847),
(240, 'assets/videojuegos/screenshots/240.jpg', 442847),
(241, 'assets/videojuegos/screenshots/241.jpg', 622492),
(242, 'assets/videojuegos/screenshots/242.jpg', 622492),
(243, 'assets/videojuegos/screenshots/243.jpg', 622492),
(244, 'assets/videojuegos/screenshots/244.jpg', 622492),
(245, 'assets/videojuegos/screenshots/245.jpg', 622492),
(246, 'assets/videojuegos/screenshots/246.jpg', 1391),
(247, 'assets/videojuegos/screenshots/247.jpg', 1391),
(248, 'assets/videojuegos/screenshots/248.jpg', 1391),
(249, 'assets/videojuegos/screenshots/249.jpg', 1391),
(250, 'assets/videojuegos/screenshots/250.jpg', 1391),
(251, 'assets/videojuegos/screenshots/251.jpg', 364806),
(252, 'assets/videojuegos/screenshots/252.jpg', 364806),
(253, 'assets/videojuegos/screenshots/253.jpg', 364806),
(254, 'assets/videojuegos/screenshots/254.jpg', 364806);

