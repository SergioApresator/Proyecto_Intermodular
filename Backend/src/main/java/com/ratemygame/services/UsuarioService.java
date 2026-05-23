package com.ratemygame.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.ratemygame.config.JwtService;
import com.ratemygame.config.CustomUserDetails;

import com.ratemygame.datamodel.entities.Usuario;
import com.ratemygame.datamodel.repositories.UsuarioRepository;
import com.ratemygame.dtos.UsuarioDTO;
import com.ratemygame.mapper.UsuarioMapper;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UsuarioMapper usuarioMapper;

    // Método para obtener la lista completa de usuarios registrados en el sistema.
    public List<UsuarioDTO> getAllUsuarios() {
        return usuarioRepository.findAll().stream().map(usuarioMapper::toDTO).collect(Collectors.toList());
    }

    // Método para obtener los datos de un usuario por su ID.
    public Optional<UsuarioDTO> getUsuarioById(Long id) {
        return usuarioRepository.findById(id).map(usuarioMapper::toDTO);
    }

    // Método para autenticar al usuario verificando sus credenciales y generando el token JWT.
    public Optional<UsuarioDTO> login(String identifier, String password) {
        Optional<Usuario> optionalUsuario = usuarioRepository.findByUsernameOrEmail(identifier, identifier);
        if (optionalUsuario.isPresent()) {
            Usuario usuario = optionalUsuario.get();
            if (passwordEncoder.matches(password, usuario.getPassword())) {
                if (Boolean.TRUE.equals(usuario.getBaneado())) {
                    throw new RuntimeException("USUARIO_BANEADO");
                }
                String token = jwtService.generateToken(new CustomUserDetails(usuario));
                UsuarioDTO dto = usuarioMapper.toDTO(usuario);
                dto.setToken(token);
                return Optional.of(dto);
            }
        }
        return Optional.empty();
    }

    // Método para iniciar sesión usando el nombre de usuario como identificador.
    public Optional<UsuarioDTO> loginUsuarioUsername(String username, String password) {
        return login(username, password);
    }

    // Método para iniciar sesión usando el correo electrónico como identificador.
    public Optional<UsuarioDTO> loginUsuarioEmail(String email, String password) {
        return login(email, password);
    }

    // Método para registrar un nuevo usuario encriptando su contraseña y generando su token JWT inicial.
    public UsuarioDTO createUsuario(Usuario usuario) {
        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
        usuario.setEsAdmin(false);
        usuario.setBaneado(false);
        Usuario savedUsuario = usuarioRepository.save(usuario);
        String token = jwtService.generateToken(new CustomUserDetails(savedUsuario));
        UsuarioDTO dto = usuarioMapper.toDTO(savedUsuario);
        dto.setToken(token);
        return dto;
    }

    // Método para actualizar los datos del perfil de un usuario existente.
    public Optional<UsuarioDTO> updateUsuario(Long id, Usuario usuarioDetails) {
        return usuarioRepository.findById(id).map(usuario -> {
            usuario.setNombre(usuarioDetails.getNombre());
            usuario.setApellidos(usuarioDetails.getApellidos());
            usuario.setUsername(usuarioDetails.getUsername());
            usuario.setEmail(usuarioDetails.getEmail());
            if (usuarioDetails.getPassword() != null && !usuarioDetails.getPassword().isEmpty()) {
                usuario.setPassword(passwordEncoder.encode(usuarioDetails.getPassword()));
            }
            if (usuarioDetails.getBiografia() != null) {
                usuario.setBiografia(usuarioDetails.getBiografia());
            }
            if (usuarioDetails.getBaneado() != null) {
                usuario.setBaneado(usuarioDetails.getBaneado());
            }
            Usuario updatedUsuario = usuarioRepository.save(usuario);
            return usuarioMapper.toDTO(updatedUsuario);
        });
    }

    // Alterna el rol de administrador de un usuario (de normal a admin o viceversa)
    public Optional<UsuarioDTO> toggleAdmin(Long id) {
        return usuarioRepository.findById(id).map(usuario -> {
            usuario.setEsAdmin(usuario.getEsAdmin() == null ? true : !usuario.getEsAdmin());
            Usuario updatedUsuario = usuarioRepository.save(usuario);
            return usuarioMapper.toDTO(updatedUsuario);
        });
    }

    // Método para actualizar los datos binarios de la foto de perfil en la base de datos.
    public Optional<UsuarioDTO> actualizarFotoDatos(Long id, byte[] fotoDatos, String contentType) {
        return usuarioRepository.findById(id).map(usuario -> {
            usuario.setFotoDatos(fotoDatos);
            usuario.setFotoContentType(contentType);
            return usuarioMapper.toDTO(usuarioRepository.save(usuario));
        });
    }

    // Método para actualizar los datos binarios del banner de portada en la base de datos.
    public Optional<UsuarioDTO> actualizarBannerDatos(Long id, byte[] bannerDatos, String contentType) {
        return usuarioRepository.findById(id).map(usuario -> {
            usuario.setBannerDatos(bannerDatos);
            usuario.setBannerContentType(contentType);
            return usuarioMapper.toDTO(usuarioRepository.save(usuario));
        });
    }

    // Método para obtener la entidad Usuario cruda para servir sus imágenes.
    public Optional<Usuario> getUsuarioEntityById(Long id) {
        return usuarioRepository.findById(id);
    }

    // Método para eliminar un usuario de la base de datos por su ID.
    public boolean deleteUsuario(Long id) {
        if (usuarioRepository.existsById(id)) {
            usuarioRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // Método para buscar usuarios cuyo username contenga el texto indicado (búsqueda parcial).
    public List<UsuarioDTO> buscarPorUsername(String username) {
        return usuarioRepository.findByUsernameContainingIgnoreCase(username).stream()
                .map(usuarioMapper::toDTO)
                .collect(Collectors.toList());
    }

    // Método para buscar usuarios por username o nombre completo de forma insensible a mayúsculas.
    public List<UsuarioDTO> buscarUsuariosGeneral(String query) {
        return usuarioRepository.buscarUsuariosGeneral(query).stream()
                .map(usuarioMapper::toDTO)
                .collect(Collectors.toList());
    }
}
