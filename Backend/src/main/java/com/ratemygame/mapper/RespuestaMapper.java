package com.ratemygame.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.ratemygame.datamodel.entities.Respuesta;
import com.ratemygame.dtos.RespuestaDTO;

@Mapper(componentModel = "spring")
public interface RespuestaMapper {

    @Mapping(source = "usuario.id", target = "id_usuario")
    @Mapping(source = "usuario.username", target = "nombreUsuario")
    @Mapping(source = "usuario.resolvedFotoUrl", target = "fotoUsuario")
    @Mapping(source = "resena.id", target = "id_resena")
    @Mapping(source = "idRespuestaPadre", target = "id_respuesta_padre")
    @Mapping(target = "votoUsuarioActual", ignore = true)
    @Mapping(target = "nombreUsuarioPadre", ignore = true)
    RespuestaDTO toDTO(Respuesta respuesta);
}
