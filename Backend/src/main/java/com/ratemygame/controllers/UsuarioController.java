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

    // Sube la foto de perfil en disco y guarda la URL en la base de datos.
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
            // Crear directorio si no existe
            Path uploadPath = Paths.get(uploadDir);
            Files.createDirectories(uploadPath);

            // Generar nombre único para evitar colisiones
            String originalFilename = file.getOriginalFilename();
            String extension = (originalFilename != null && originalFilename.contains("."))
                    ? originalFilename.substring(originalFilename.lastIndexOf("."))
                    : ".jpg";
            String uniqueFilename = "usuario_" + id + "_" + UUID.randomUUID().toString().substring(0, 8) + extension;

            // Guardar el archivo en disco
            Path filePath = uploadPath.resolve(uniqueFilename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Construir la URL pública de acceso
            String fotoUrl = "http://localhost:9999/uploads/fotos-perfil/" + uniqueFilename;



            // Actualizar foto_url del usuario en la BD
            return usuarioService.actualizarFotoUrl(id, fotoUrl)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Sube la imagen de banner del perfil. Mismo flujo de registro/seguridad que la foto.
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
            Path uploadPath = Paths.get(uploadDir);
            Files.createDirectories(uploadPath);

            String originalFilename = file.getOriginalFilename();
            String extension = (originalFilename != null && originalFilename.contains("."))
                    ? originalFilename.substring(originalFilename.lastIndexOf("."))
                    : ".jpg";
            String uniqueFilename = "banner_" + id + "_" + UUID.randomUUID().toString().substring(0, 8) + extension;

            Path filePath = uploadPath.resolve(uniqueFilename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            String bannerUrl = "http://localhost:9999/uploads/fotos-perfil/" + uniqueFilename;



            return usuarioService.actualizarBannerUrl(id, bannerUrl)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Resetea la foto de perfil del usuario (la borra lógicamente poniendo la URL a null)
    @DeleteMapping("/{id}/foto")
    @PreAuthorize("hasRole('ADMIN') or (principal instanceof T(com.ratemygame.config.CustomUserDetails) and #id == principal.usuario.id)")
    public ResponseEntity<UsuarioDTO> resetearFotoPerfil(@PathVariable Long id) {
        return usuarioService.actualizarFotoUrl(id, null)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Buscador general de perfiles o por username exacto
    @GetMapping("/buscar")
    public ResponseEntity<List<UsuarioDTO>> buscarUsuarios(@RequestParam(required = false) String username,
            @RequestParam(required = false) String query) {
        if (query != null) {
            return ResponseEntity.ok(usuarioService.buscarUsuariosGeneral(query));
        }
        return ResponseEntity.ok(usuarioService.buscarPorUsername(username != null ? username : ""));
    }

    // Resetea el banner de perfil a null
    @DeleteMapping("/{id}/banner")
    @PreAuthorize("hasRole('ADMIN') or (principal instanceof T(com.ratemygame.config.CustomUserDetails) and #id == principal.usuario.id)")
    public ResponseEntity<UsuarioDTO> resetearBanner(@PathVariable Long id) {
        return usuarioService.actualizarBannerUrl(id, null)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
}
