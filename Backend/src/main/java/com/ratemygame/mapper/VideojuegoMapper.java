package com.ratemygame.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.data.domain.Page;

import com.ratemygame.datamodel.entities.Genero;
import com.ratemygame.datamodel.entities.Plataforma;
import com.ratemygame.datamodel.entities.Screenshot;
import com.ratemygame.datamodel.entities.Tag;
import com.ratemygame.datamodel.entities.Videojuego;
import com.ratemygame.dtos.VideojuegoDTO;

@Mapper(componentModel = "spring")
public interface VideojuegoMapper {

    @Mapping(source = "backgroundImage", target = "background_image")
    VideojuegoDTO toDTO(Videojuego videojuego);

    VideojuegoDTO.ItemDTO generoToItemDTO(Genero genero);

    VideojuegoDTO.ItemDTO tagToItemDTO(Tag tag);

    VideojuegoDTO.ScreenshotDTO screenshotToScreenshotDTO(Screenshot screenshot);

    default VideojuegoDTO.PlatformWrapperDTO plataformaToPlatformWrapperDTO(Plataforma plataforma) {
        VideojuegoDTO.ItemDTO item = new VideojuegoDTO.ItemDTO();
        item.setId(plataforma.getId());
        item.setName(plataforma.getName());
        item.setSlug(plataforma.getSlug());
        VideojuegoDTO.PlatformWrapperDTO wrapper = new VideojuegoDTO.PlatformWrapperDTO();
        wrapper.setPlatform(item);
        return wrapper;
    }

    default Page<VideojuegoDTO> toDTOPage(Page<Videojuego> page) {
        return page.map(this::toDTO);
    }
}
