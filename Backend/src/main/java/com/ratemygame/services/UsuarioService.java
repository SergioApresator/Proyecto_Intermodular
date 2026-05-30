package com.ratemygame.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.ratemygame.config.JwtService;
import com.ratemygame.config.CustomUserDetails;

import com.ratemygame.datamodel.entities.Usuario;
import com.ratemygame.datamodel.entities.Resena;
import com.ratemygame.datamodel.repositories.*;
import com.ratemygame.dtos.UsuarioDTO;
import com.ratemygame.mapper.UsuarioMapper;

import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ListaRepository listaRepository;

    @Autowired
    private ResenaRepository resenaRepository;

    @Autowired
    private NotificacionRepository notificacionRepository;

    @Autowired
    private ResenaVotoRepository resenaVotoRepository;

    @Autowired
    private RespuestaVotoRepository respuestaVotoRepository;

    @Autowired
    private ResenaReporteRepository resenaReporteRepository;

    @Autowired
    private RespuestaRepository respuestaRepository;

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
            if (usuarioDetails.getCorreoReal() != null) {
                usuario.setCorreoReal(usuarioDetails.getCorreoReal());
            }
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
            if (Boolean.TRUE.equals(usuario.getBaneado()) && !Boolean.TRUE.equals(usuario.getEsAdmin())) {
                throw new IllegalArgumentException("No se puede hacer administrador a un usuario baneado.");
            }
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

    // Método para eliminar un usuario de la base de datos por su ID de forma segura con cascada.
    @Transactional
    public boolean deleteUsuario(Long id) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findById(id);
        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();

            // 1. Eliminar votos realizados por el usuario en comentarios
            respuestaVotoRepository.deleteByUsuario_Id(id);

            // 2. Eliminar votos realizados por el usuario en reseñas
            resenaVotoRepository.deleteByUsuario_Id(id);

            // 3. Eliminar reportes realizados por el usuario
            resenaReporteRepository.deleteByUsuario_Id(id);

            // 4. Eliminar notificaciones recibidas por el usuario
            notificacionRepository.deleteByUsuario_Id(id);

            // 5. Eliminar entradas de listas del usuario
            listaRepository.deleteByUsuario_Id(id);

            // 6. Eliminar comentarios/respuestas escritos por el usuario (y sus votos en cascada)
            respuestaRepository.deleteByUsuario_Id(id);

            // 7. Cargar reseñas escritas por el usuario y borrar sus reportes/notificaciones antes de borrarlas
            List<Resena> resenas = resenaRepository.findByUsuario_Id(id);
            for (Resena resena : resenas) {
                resenaReporteRepository.deleteByResena_Id(resena.getId());
                notificacionRepository.deleteByResena_Id(resena.getId());
                resenaRepository.delete(resena);
            }

            // 8. Eliminar la entidad de usuario
            usuarioRepository.delete(usuario);
            return true;
        }
        return false;
    }

    // Método para comprobar si la contraseña introducida coincide con la del usuario.
    public boolean checkPassword(Long usuarioId, String rawPassword) {
        return usuarioRepository.findById(usuarioId)
                .map(u -> passwordEncoder.matches(rawPassword, u.getPassword()))
                .orElse(false);
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
