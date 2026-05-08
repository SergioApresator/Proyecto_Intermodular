package com.ratemygame.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.ratemygame.config.JwtService;
import com.ratemygame.config.CustomUserDetails;

import com.ratemygame.datamodel.entities.Usuario;
import com.ratemygame.datamodel.repositories.UsuarioRepository;
import com.ratemygame.dtos.UsuarioDTO;

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

    public List<UsuarioDTO> getAllUsuarios() {
        return usuarioRepository.findAll().stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public Optional<UsuarioDTO> getUsuarioById(Long id) {
        return usuarioRepository.findById(id).map(this::convertToDTO);
    }

    public Optional<UsuarioDTO> loginUsuario(String email, String password) {
        Optional<Usuario> optionalUsuario = usuarioRepository.findByEmail(email);
        if (optionalUsuario.isPresent()) {
            Usuario usuario = optionalUsuario.get();
            if (passwordEncoder.matches(password, usuario.getPassword())) {
                String token = jwtService.generateToken(new CustomUserDetails(usuario));
                UsuarioDTO dto = convertToDTO(usuario);
                dto.setToken(token);
                return Optional.of(dto);
            }
        }
        return Optional.empty();
    }

    public UsuarioDTO createUsuario(Usuario usuario) {
        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
        Usuario savedUsuario = usuarioRepository.save(usuario);
        String token = jwtService.generateToken(new CustomUserDetails(savedUsuario));
        UsuarioDTO dto = convertToDTO(savedUsuario);
        dto.setToken(token);
        return dto;
    }

    public Optional<UsuarioDTO> updateUsuario(Long id, Usuario usuarioDetails) {
        return usuarioRepository.findById(id).map(usuario -> {
            usuario.setNombre(usuarioDetails.getNombre());
            usuario.setApellidos(usuarioDetails.getApellidos());
            usuario.setUsername(usuarioDetails.getUsername());
            usuario.setEmail(usuarioDetails.getEmail());
            if (usuarioDetails.getPassword() != null && !usuarioDetails.getPassword().isEmpty()) {
                usuario.setPassword(passwordEncoder.encode(usuarioDetails.getPassword()));
            }
            if (usuarioDetails.getFoto_url() != null) {
                usuario.setFoto_url(usuarioDetails.getFoto_url());
            }
            if (usuarioDetails.getBiografia() != null) {
                usuario.setBiografia(usuarioDetails.getBiografia());
            }
            Usuario updatedUsuario = usuarioRepository.save(usuario);
            return convertToDTO(updatedUsuario);
        });
    }

    public Optional<UsuarioDTO> actualizarFotoUrl(Long id, String fotoUrl) {
        return usuarioRepository.findById(id).map(usuario -> {
            usuario.setFoto_url(fotoUrl);
            return convertToDTO(usuarioRepository.save(usuario));
        });
    }

    public boolean deleteUsuario(Long id) {
        if (usuarioRepository.existsById(id)) {
            usuarioRepository.deleteById(id);
            return true;
        }
        return false;
    }

    private UsuarioDTO convertToDTO(Usuario usuario) {
        UsuarioDTO dto = new UsuarioDTO();
        dto.setId(usuario.getId());
        dto.setNombre(usuario.getNombre());
        dto.setApellidos(usuario.getApellidos());
        dto.setUsername(usuario.getUsername());
        dto.setEmail(usuario.getEmail());
        dto.setFoto_url(usuario.getFoto_url());
        dto.setBiografia(usuario.getBiografia());
        return dto;
    }
}
