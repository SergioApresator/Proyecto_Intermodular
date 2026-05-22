package com.ratemygame.config;

import com.ratemygame.datamodel.entities.Usuario;
import com.ratemygame.datamodel.repositories.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

// Implementación de UserDetailsService que carga usuarios desde la base de datos para Spring Security.
@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    // Método para cargar un usuario por su email o username y envolverlo en CustomUserDetails.
    @Override
    public UserDetails loadUserByUsername(String identifier) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByUsernameOrEmail(identifier, identifier)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado con el identificador: " + identifier));
        return new CustomUserDetails(usuario);
    }
}
