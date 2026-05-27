package com.ratemygame.dtos;

import java.time.LocalDateTime;
import lombok.Data;

// DTO de transferencia de datos de una reseña, incluyendo info del autor y el estado de voto del usuario actual.
@Data
public class ResenaDTO {
    private Long id;
    private String mensaje;
    private int puntuacion;
    private Boolean tieneSpoiler;
    private Integer meGustas;
    private Integer noMeGustas;
    private LocalDateTime fechaResena;
    private Long id_usuario;
    private String nombreUsuario;
    private String fotoUsuario;
    private Long id_videojuego;
    private String nombreVideojuego;
    private String fotoVideojuego;
    private Boolean votoUsuarioActual; // true = me gusta, false = no me gusta, null = no ha votado
    private Boolean revisada;
    private Integer reportes;
    private Boolean reportadoPorUsuarioActual; // true = ya reportada por el usuario actual
    private Integer horasJugadas;
}
