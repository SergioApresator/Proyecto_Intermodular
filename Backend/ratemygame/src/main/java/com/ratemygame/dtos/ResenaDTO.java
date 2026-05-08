package com.ratemygame.dtos;

import java.time.LocalDate;
import lombok.Data;

@Data
public class ResenaDTO {
    private Long id;
    private String mensaje;
    private int puntuacion;
    private Boolean tieneSpoiler;
    private Integer meGustas;
    private Integer noMeGustas;
    private LocalDate fechaResena;
    private Long id_usuario;
    private String nombreUsuario;
    private String fotoUsuario;
    private Long id_videojuego;
    private Boolean votoUsuarioActual; // true = me gusta, false = no me gusta, null = no ha votado
}
