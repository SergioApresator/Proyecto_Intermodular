package com.ratemygame.dtos;

import lombok.Data;

// DTO de transferencia de datos del usuario, incluyendo el token JWT tras el login.
@Data
public class UsuarioDTO {
    private Long id;
    private String nombre;
    private String apellidos;
    private String username;
    private String email;
    private String foto_url;
    private String banner_url;
    private String biografia;
    private String token;
    private Boolean esAdmin;
    private Boolean baneado;
}
