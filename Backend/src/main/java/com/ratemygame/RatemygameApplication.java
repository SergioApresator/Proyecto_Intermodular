package com.ratemygame;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

// Clase principal de arranque de la aplicación Spring Boot RateMyGame.
@SpringBootApplication
public class RatemygameApplication {

	// Método de entrada que lanza el contexto de Spring Boot.
	public static void main(String[] args) {
		SpringApplication.run(RatemygameApplication.class, args);
	}

}
