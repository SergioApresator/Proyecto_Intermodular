package com.ratemygame.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.ratemygame.datamodel.entities.Usuario;
import com.ratemygame.dtos.UsuarioDTO;

@Mapper(componentModel = "spring")
public interface UsuarioMapper {

    @Mapping(source = "resolvedFotoUrl", target = "foto_url")
    @Mapping(source = "resolvedBannerUrl", target = "banner_url")
    @Mapping(target = "token", ignore = true)
    UsuarioDTO toDTO(Usuario usuario);
}
