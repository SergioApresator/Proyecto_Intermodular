package com.ratemygame.dtos;

import lombok.Data;

// DTO de transferencia de datos de una entrada de lista de usuario.
@Data
public class ListaDTO {
    private Long id;
    private String nombre;
    private Long id_videojuego;
    private Long id_usuario;
}
