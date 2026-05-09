package com.ratemygame.dtos;

import lombok.Data;

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
}
