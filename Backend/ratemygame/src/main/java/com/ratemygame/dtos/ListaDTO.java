package com.ratemygame.dtos;

import lombok.Data;

@Data
public class ListaDTO {
    private Long id;
    private String nombre;
    private Long id_videojuego;
    private Long id_usuario;
}
