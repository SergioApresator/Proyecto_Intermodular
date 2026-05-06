package com.ratemygame.dtos;

import com.ratemygame.enums.EstadoJuego;
import lombok.Data;

@Data
public class UsuarioVideojuegoEstadoDTO {

    private Long id;
    private Long id_usuario;
    private Long id_videojuego_api;
    private EstadoJuego estado;
}