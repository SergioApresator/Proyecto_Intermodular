package com.ratemygame.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

// Interceptor de peticiones HTTP. Valida el token JWT en cada llamada que requiera estar autenticado.
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    // Filtra las peticiones entrantes. Valida si la cabecera 'Authorization' lleva un token Bearer válido.
    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;

        // Si no viene cabecera de autenticación o no empieza por "Bearer ", pasamos el filtro de largo
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            // Saltamos el prefijo "Bearer " (7 posiciones) para quedarnos con el string del token
            jwt = authHeader.substring(7);
            userEmail = jwtService.extractUsername(jwt); // Recuerda: en nuestro JwtService esto extrae el EMAIL

            // Si el token es válido y no hay ya una autenticación previa guardada en el contexto actual
            if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);
                
                // Si la firma del token coincide y no está caducado, autorizamos la petición
                if (jwtService.isTokenValid(jwt, userDetails)) {
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    // Guardamos al usuario autenticado en el contexto de seguridad para esta llamada
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                } else {
                    System.out.println("JWT Token invalid for user: " + userEmail);
                }
            }
        } catch (Exception e) {
            System.err.println("Error procesando JWT Token: " + e.getMessage());
        }
        
        filterChain.doFilter(request, response);
    }
}
