package com.ratemygame.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;

// Configuración MVC para servir archivos estáticos subidos por los usuarios (fotos y banners).
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Value("${app.upload.dir}")
    private String uploadDir;

    // Método para registrar el handler que expone la carpeta de uploads bajo la URL /uploads/**.
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Sirve los archivos subidos desde la URL /uploads/**
        // Nos aseguramos de apuntar a la carpeta base "uploads" de forma absoluta
        String rootPath = Paths.get("uploads").toAbsolutePath().toString();
        
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:" + rootPath + "/");
    }

}
