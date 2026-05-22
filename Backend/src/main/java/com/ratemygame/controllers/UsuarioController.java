package com.ratemygame.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.ratemygame.datamodel.entities.Usuario;
import com.ratemygame.dtos.UsuarioDTO;
import com.ratemygame.services.UsuarioService;

import org.springframework.security.access.prepost.PreAuthorize;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @Value("${app.upload.dir}")
    private String uploadDir;

    // Método para autenticar al usuario aceptando email, username o cualquier identificador válido.
    @PostMapping("/login")
    public ResponseEntity<UsuarioDTO> login(@RequestBody Map<String, String> credentials) {
        String identifier = credentials.get("identifier");
        if (identifier == null) {
            identifier = credentials.get("username");
        }
        if (identifier == null) {
            identifier = credentials.get("email");
        }
        String password = credentials.get("password");
        try {
            return usuarioService.login(identifier, password)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
        } catch (RuntimeException e) {
            if ("USUARIO_BANEADO".equals(e.getMessage())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    // Método para iniciar sesión usando el nombre de usuario como identificador.
    @PostMapping("/login-username")
    public ResponseEntity<UsuarioDTO> loginUsuarioUsername(@RequestBody Map<String, String> credentials) {
        return login(credentials);
    }

    // Método para iniciar sesión usando el correo electrónico como identificador.
    @PostMapping("/login-email")
    public ResponseEntity<UsuarioDTO> loginUsuarioEmail(@RequestBody Map<String, String> credentials) {
        return login(credentials);
    }

    // Comprueba si el token JWT enviado en la cabecera es válido
    @GetMapping("/validar-token")
    public ResponseEntity<Void> validarToken() {
        return ResponseEntity.ok().build();
    }

    // Panel de administración de usuarios. Exclusivo para ADMIN.
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UsuarioDTO>> getAllUsuarios() {
        return ResponseEntity.ok(usuarioService.getAllUsuarios());
    }

    // Método para obtener los datos de un usuario concreto por su ID.
    @GetMapping("/{id}")
    public ResponseEntity<UsuarioDTO> getUsuarioById(@PathVariable Long id) {
        return usuarioService.getUsuarioById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Método para registrar un nuevo usuario en la base de datos.
    @PostMapping
    public ResponseEntity<UsuarioDTO> createUsuario(@RequestBody Usuario usuario) {
        return new ResponseEntity<>(usuarioService.createUsuario(usuario), HttpStatus.CREATED);
    }

    // Actualiza los campos de un perfil de usuario (nombre, apellidos, biografía, etc.)
    // Solo puede hacerlo un administrador o el propio usuario autenticado dueño del perfil.
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or (principal instanceof T(com.ratemygame.config.CustomUserDetails) and #id == principal.usuario.id)")
    public ResponseEntity<UsuarioDTO> updateUsuario(@PathVariable Long id, @RequestBody Usuario usuarioDetails) {
        return usuarioService.updateUsuario(id, usuarioDetails)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Borra un usuario. Mismas restricciones: dueño del perfil o ADMIN.
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or (principal instanceof T(com.ratemygame.config.CustomUserDetails) and #id == principal.usuario.id)")
    public ResponseEntity<Void> deleteUsuario(@PathVariable Long id) {
        if (usuarioService.deleteUsuario(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    // Sube la foto de perfil y la guarda directamente en la base de datos (BLOB).
    @PostMapping(value = "/{id}/foto", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("isAnonymous() or hasRole('ADMIN') or (principal instanceof T(com.ratemygame.config.CustomUserDetails) and #id == principal.usuario.id)")
    public ResponseEntity<UsuarioDTO> subirFotoPerfil(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) {

        // Validar que no esté vacío
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        // Validar tipo de contenido (solo imágenes)
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            return ResponseEntity.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE).build();
        }

        try {
            // Guardar los bytes directamente en la BD
            byte[] bytes = file.getBytes();
            return usuarioService.actualizarFotoDatos(id, bytes, contentType)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Sube la imagen de banner del perfil y la guarda directamente en la base de datos (BLOB).
    @PostMapping(value = "/{id}/banner", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("isAnonymous() or hasRole('ADMIN') or (principal instanceof T(com.ratemygame.config.CustomUserDetails) and #id == principal.usuario.id)")
    public ResponseEntity<UsuarioDTO> subirBanner(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            return ResponseEntity.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE).build();
        }

        try {
            // Guardar los bytes directamente en la BD
            byte[] bytes = file.getBytes();
            return usuarioService.actualizarBannerDatos(id, bytes, contentType)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Resetea la foto de perfil del usuario (borra los datos binarios en la BD)
    @DeleteMapping("/{id}/foto")
    @PreAuthorize("hasRole('ADMIN') or (principal instanceof T(com.ratemygame.config.CustomUserDetails) and #id == principal.usuario.id)")
    public ResponseEntity<UsuarioDTO> resetearFotoPerfil(@PathVariable Long id) {
        return usuarioService.actualizarFotoDatos(id, null, null)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Buscador general de perfiles o por username exacto
    @GetMapping("/buscar")
    public ResponseEntity<List<UsuarioDTO>> buscarUsuarios(@RequestParam(required = false) String username,
            @RequestParam(required = false) String query) {
        if (query != null && !query.trim().isEmpty()) {
            return ResponseEntity.ok(usuarioService.buscarUsuariosGeneral(query));
        }
        if (username != null && !username.trim().isEmpty()) {
            return ResponseEntity.ok(usuarioService.buscarPorUsername(username));
        }
        // Si no se especifica un término de búsqueda válido, se devuelven todos los usuarios
        return ResponseEntity.ok(usuarioService.getAllUsuarios());
    }

    // Resetea el banner de perfil a null (borra los datos binarios en la BD)
    @DeleteMapping("/{id}/banner")
    @PreAuthorize("hasRole('ADMIN') or (principal instanceof T(com.ratemygame.config.CustomUserDetails) and #id == principal.usuario.id)")
    public ResponseEntity<UsuarioDTO> resetearBanner(@PathVariable Long id) {
        return usuarioService.actualizarBannerDatos(id, null, null)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    // Endpoint para servir la foto de perfil en binario desde la base de datos.
    @GetMapping("/{id}/foto")
    public ResponseEntity<byte[]> getFotoPerfil(@PathVariable Long id) {
        return usuarioService.getUsuarioEntityById(id)
                .filter(u -> u.getFotoDatos() != null)
                .map(u -> ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(u.getFotoContentType() != null ? u.getFotoContentType() : "image/jpeg"))
                        .body(u.getFotoDatos()))
                .orElse(ResponseEntity.notFound().build());
    }

    // Endpoint para servir el banner de portada en binario desde la base de datos.
    @GetMapping("/{id}/banner")
    public ResponseEntity<byte[]> getBanner(@PathVariable Long id) {
        return usuarioService.getUsuarioEntityById(id)
                .filter(u -> u.getBannerDatos() != null)
                .map(u -> ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(u.getBannerContentType() != null ? u.getBannerContentType() : "image/jpeg"))
                        .body(u.getBannerDatos()))
                .orElse(ResponseEntity.notFound().build());
    }
}
