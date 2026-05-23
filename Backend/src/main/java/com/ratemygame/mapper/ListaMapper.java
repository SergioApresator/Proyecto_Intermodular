package com.ratemygame.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.ratemygame.datamodel.entities.Lista;
import com.ratemygame.dtos.ListaDTO;

@Mapper(componentModel = "spring")
public interface ListaMapper {

    @Mapping(source = "videojuego.id", target = "id_videojuego")
    @Mapping(source = "usuario.id", target = "id_usuario")
    ListaDTO toDTO(Lista lista);
}
