package com.ratemygame.services;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.ratemygame.config.CustomUserDetails;
import com.ratemygame.config.JwtService;
import com.ratemygame.datamodel.entities.Usuario;
import com.ratemygame.datamodel.repositories.UsuarioRepository;
import com.ratemygame.dtos.UsuarioDTO;
import com.ratemygame.mapper.UsuarioMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Optional;
import java.util.UUID;

@Service
public class OAuthService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private UsuarioMapper usuarioMapper;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Value("${spring.security.oauth2.client.registration.google.client-id}")
    private String googleClientId;

    // Método para autenticar un usuario usando Google Login, registrándolo si es nuevo y devolviendo su DTO y JWT.
    public Optional<UsuarioDTO> loginConGoogle(String idTokenString) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
                    .setAudience(Collections.singletonList(googleClientId))
                    .build();

            GoogleIdToken idToken = verifier.verify(idTokenString);
            if (idToken != null) {
                GoogleIdToken.Payload payload = idToken.getPayload();

                String userIdGoogle = payload.getSubject();
                String email = payload.getEmail();
                String name = (String) payload.get("name");

                // Buscar por email en la base de datos
                Usuario usuario = usuarioRepository.findByEmail(email).orElseGet(() -> {
                    // Si el usuario no existe, creamos uno nuevo
                    Usuario nuevo = new Usuario();
                    nuevo.setEmail(email);
                    // Nombre de usuario por defecto basado en su email
                    nuevo.setUsername(email.split("@")[0] + "_" + UUID.randomUUID().toString().substring(0, 4));
                    nuevo.setNombre(name);
                    nuevo.setPassword(passwordEncoder.encode(UUID.randomUUID().toString())); // Contraseña aleatoria segura
                    nuevo.setOauthProvider("GOOGLE");
                    nuevo.setOauthProviderId(userIdGoogle);
                    nuevo.setEsAdmin(false);
                    nuevo.setBaneado(false);
                    nuevo.setCorreoReal(true); // El correo de Google OAuth es 100% verificado y real
                    return usuarioRepository.save(nuevo);
                });

                // Si está baneado, lanzamos la excepción estándar
                if (Boolean.TRUE.equals(usuario.getBaneado())) {
                    throw new RuntimeException("USUARIO_BANEADO");
                }

                // Si no tiene vinculación OAuth o su correo real no estaba marcado, lo actualizamos
                if (usuario.getOauthProvider() == null || !Boolean.TRUE.equals(usuario.getCorreoReal())) {
                    usuario.setOauthProvider("GOOGLE");
                    usuario.setOauthProviderId(userIdGoogle);
                    usuario.setCorreoReal(true); // Certificar que el correo es real gracias a Google
                    usuario = usuarioRepository.save(usuario);
                }

                // Generar token JWT interno de la app
                String jwtToken = jwtService.generateToken(new CustomUserDetails(usuario));
                UsuarioDTO dto = usuarioMapper.toDTO(usuario);
                dto.setToken(jwtToken);
                return Optional.of(dto);
            }
        } catch (Exception e) {
            System.err.println("Error al validar token de Google: " + e.getMessage());
        }
        return Optional.empty();
    }
}
