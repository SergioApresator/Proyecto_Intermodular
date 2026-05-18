package com.ratemygame.dtos;

import lombok.Data;

@Data
public class VotoRequestDTO {
    private Long idUsuario;
    private Boolean esMeGusta;
}
