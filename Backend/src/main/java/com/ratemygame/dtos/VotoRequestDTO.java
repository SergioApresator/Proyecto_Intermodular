package com.ratemygame.dtos;

import lombok.Data;

// DTO para recibir la petición de voto de un usuario sobre una reseña.
@Data
public class VotoRequestDTO {
    private Long idUsuario;
    private Boolean esMeGusta;
}
