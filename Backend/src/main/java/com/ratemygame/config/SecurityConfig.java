package com.ratemygame.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import static org.springframework.security.config.Customizer.withDefaults;

import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity // Activamos la seguridad a nivel de método (@PreAuthorize)
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthFilter;

    // Encriptador para contraseñas de los usuarios. BCrypt es el estándar por defecto.
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // Manager de autenticación para validar credenciales en el login manual del controlador
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    // Configuración principal de seguridad HTTP (Rutas permitidas, CORS, filtros, etc.)
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(withDefaults())
            .csrf(csrf -> csrf.disable()) // Deshabilitamos CSRF ya que usamos tokens JWT sin estado
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // --- ENDPOINTS PÚBLICOS ---
                .requestMatchers(HttpMethod.GET, "/api/games", "/api/games/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/usuarios/buscar").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/usuarios/*").permitAll()
                .requestMatchers(HttpMethod.PUT, "/api/usuarios/*").permitAll()
                .requestMatchers("/api/usuarios/login").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/usuarios/oauth2/google").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/usuarios").permitAll()
                
                // Permitimos subida y descarga de fotos/banners
                .requestMatchers(HttpMethod.POST, "/api/usuarios/*/foto").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/usuarios/*/banner").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/usuarios/*/foto").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/usuarios/*/banner").permitAll()
                
                // Lectura pública de perfiles, reseñas, respuestas y listas
                .requestMatchers(HttpMethod.GET, "/api/listas/usuario/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/respuestas/usuario/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/respuestas/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/resenas/usuario/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/resenas/**").permitAll()
                .requestMatchers(HttpMethod.DELETE, "/api/usuarios/*/banner").permitAll()
                
                // Swagger, documentación y ficheros estáticos de uploads
                .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()
                .requestMatchers("/uploads/**").permitAll()
                
                // Todo lo demás requiere que el usuario esté debidamente autenticado
                .anyRequest().authenticated()
            )
            // Metemos nuestro filtro JWT antes del de autenticación estándar de Spring
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    // Configuración global de CORS para permitir conexiones desde el puerto de desarrollo de Angular
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.addAllowedOriginPattern("*");
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");
        source.registerCorsConfiguration("/**", config);
        return source;
    }

}
