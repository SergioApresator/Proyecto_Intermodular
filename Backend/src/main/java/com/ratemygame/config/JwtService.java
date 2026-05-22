package com.ratemygame.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

// Servicio de utilidades para crear y validar tokens JWT.
@Service
public class JwtService {

    // Clave de firma. IMPORTANTE: Debe tener al menos 256 bits (32 caracteres) para que HMAC-SHA no falle.
    private static final String SECRET_KEY = "ratemygameratemygameratemygameratemygameratemygame"; 
    private static final long EXPIRATION_TIME = 1000 * 60 * 60 * 10; // Expiración por defecto: 10 horas

    // Convierte el secret key en bytes para firmar el JWT de forma segura
    private Key getSigningKey() {
        byte[] keyBytes = SECRET_KEY.getBytes();
        return Keys.hmacShaKeyFor(keyBytes);
    }

    // Extrae el sujeto del token (en nuestro caso, el email del usuario)
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // Método genérico para extraer campos específicos (claims) del token
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    // Genera un token JWT básico solo con el email del usuario
    public String generateToken(UserDetails userDetails) {
        return generateToken(new HashMap<>(), userDetails);
    }

    // Genera un token JWT inyectando propiedades adicionales (extraClaims) si hiciese falta
    public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
        return Jwts.builder()
                .setClaims(extraClaims)
                .setSubject(userDetails.getUsername()) // El username aquí es el email
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // Valida si el token pertenece a este usuario y además sigue estando activo
    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }

    // Comprueba si el token ha superado la fecha de expiración
    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    // Desencripta y obtiene la totalidad del payload del token JWT usando nuestra clave
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
