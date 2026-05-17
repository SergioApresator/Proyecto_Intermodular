package com.ratemygame.dtos;

import java.time.LocalDateTime;
import lombok.Data;

@Data
public class RespuestaDTO {
    private Long id;
    private String mensaje;
    private Integer meGustas;
    private Integer noMeGustas;
    private Long id_resena;
    private Long id_usuario;
    private String nombreUsuario;
    private String fotoUsuario;
    private Boolean votoUsuarioActual;
    private Long id_respuesta_padre;
    private String nombreUsuarioPadre;
    private LocalDateTime fechaRespuesta;
}
