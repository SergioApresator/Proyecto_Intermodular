package com.ratemygame.dtos;

import lombok.Data;

@Data
public class RespuestaDTO {
    private Long id;
    private String mensaje;
    private Integer meGustas;
    private Integer noMeGustas;
    private Long id_resena;
    private Long id_usuario;
}
