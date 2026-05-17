package com.ratemygame.config;

import com.ratemygame.datamodel.entities.Usuario;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

// Wrapper personalizado para que Spring Security entienda nuestro modelo de datos "Usuario"
public class CustomUserDetails implements UserDetails {

    private final Usuario usuario;

    public CustomUserDetails(Usuario usuario) {
        this.usuario = usuario;
    }

    // Mapeamos el booleano esAdmin a los roles oficiales de Spring Security (con prefijo ROLE_)
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        if (usuario.getEsAdmin() != null && usuario.getEsAdmin()) {
            return List.of(new SimpleGrantedAuthority("ROLE_ADMIN"), new SimpleGrantedAuthority("ROLE_USER"));
        }
        return List.of(new SimpleGrantedAuthority("ROLE_USER"));
    }

    @Override
    public String getPassword() {
        return usuario.getPassword();
    }

    // IMPORTANTE: Usamos el email como identificador único de sesión/autenticación en lugar del username clásico
    @Override
    public String getUsername() {
        return usuario.getEmail();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    // Devuelve el objeto Usuario original de la base de datos (clave para sacar su id en anotaciones como @PreAuthorize)
    public Usuario getUsuario() {
        return usuario;
    }
}
