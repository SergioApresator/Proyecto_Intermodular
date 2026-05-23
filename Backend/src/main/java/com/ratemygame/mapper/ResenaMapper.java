package com.ratemygame.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.ratemygame.datamodel.entities.Resena;
import com.ratemygame.dtos.ResenaDTO;

@Mapper(componentModel = "spring")
public interface ResenaMapper {

    @Mapping(source = "videojuego.id", target = "id_videojuego")
    @Mapping(source = "videojuego.name", target = "nombreVideojuego")
    @Mapping(source = "videojuego.backgroundImage", target = "fotoVideojuego")
    @Mapping(source = "usuario.id", target = "id_usuario")
    @Mapping(source = "usuario.username", target = "nombreUsuario")
    @Mapping(source = "usuario.resolvedFotoUrl", target = "fotoUsuario")
    @Mapping(target = "votoUsuarioActual", ignore = true)
    ResenaDTO toDTO(Resena resena);
}
