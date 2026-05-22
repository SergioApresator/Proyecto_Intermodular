package com.ratemygame.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.datasource.init.ScriptUtils;
import org.springframework.stereotype.Component;
import com.ratemygame.datamodel.repositories.UsuarioRepository;

import javax.sql.DataSource;
import java.sql.Connection;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    @Autowired
    private DataSource dataSource;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    public void run(String... args) throws Exception {
        long count = usuarioRepository.count();
        System.out.println("DatabaseSeeder: Número de usuarios encontrados en la base de datos: " + count);
        if (count == 0) {
            System.out.println("DatabaseSeeder: La base de datos está vacía. Sembrando datos de prueba...");
            try (Connection conn = dataSource.getConnection()) {
                ScriptUtils.executeSqlScript(conn, new ClassPathResource("datos_de_prueba.sql"));
                System.out.println("DatabaseSeeder: ¡Base de datos sembrada con éxito!");
            } catch (Exception e) {
                System.err.println("DatabaseSeeder: Error al sembrar la base de datos: " + e.getMessage());
                e.printStackTrace();
            }
        } else {
            System.out.println("DatabaseSeeder: La base de datos ya contiene datos. Omitiendo siembra para preservar los cambios.");
        }
    }
}
