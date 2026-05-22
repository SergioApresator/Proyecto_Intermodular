package com.ratemygame.services;

import com.ratemygame.datamodel.entities.Videojuego;
import com.ratemygame.datamodel.repositories.VideojuegoRepository;
import com.ratemygame.datamodel.repositories.VideojuegoSpecification;
import com.ratemygame.dtos.VideojuegoDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class VideojuegoService {

    @Autowired
    private VideojuegoRepository videojuegoRepository;

    public Page<VideojuegoDTO> buscarVideojuegos(
            String search, List<String> genres, List<String> tags, List<String> platforms,
            LocalDate startDate, LocalDate endDate, Integer minMetacritic, Integer maxMetacritic,
            Pageable pageable) {

        Specification<Videojuego> spec = Specification.where(VideojuegoSpecification.hasName(search))
                .and(VideojuegoSpecification.hasGenres(genres))
                .and(VideojuegoSpecification.hasTags(tags))
                .and(VideojuegoSpecification.hasPlatforms(platforms))
                .and(VideojuegoSpecification.releasedBetween(startDate, endDate))
                .and(VideojuegoSpecification.metacriticBetween(minMetacritic, maxMetacritic));

        return videojuegoRepository.findAll(spec, pageable).map(this::convertToDTO);
    }

    public Optional<VideojuegoDTO> getJuegoDetalles(Long id) {
        return videojuegoRepository.findById(id).map(this::convertToDTO);
    }

    private VideojuegoDTO convertToDTO(Videojuego entity) {
        VideojuegoDTO dto = new VideojuegoDTO();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setBackground_image(entity.getBackgroundImage());
        dto.setDescription(entity.getDescription());
        dto.setReleased(entity.getReleased());
        dto.setRating(entity.getRating());
        dto.setMetacritic(entity.getMetacritic());
        dto.setAdded(entity.getAdded());

        if (entity.getGenres() != null) {
            dto.setGenres(entity.getGenres().stream().map(g -> {
                VideojuegoDTO.ItemDTO item = new VideojuegoDTO.ItemDTO();
                item.setId(g.getId());
                item.setName(g.getName());
                item.setSlug(g.getSlug());
                return item;
            }).collect(Collectors.toList()));
        }

        if (entity.getTags() != null) {
            dto.setTags(entity.getTags().stream().map(t -> {
                VideojuegoDTO.ItemDTO item = new VideojuegoDTO.ItemDTO();
                item.setId(t.getId());
                item.setName(t.getName());
                item.setSlug(t.getSlug());
                return item;
            }).collect(Collectors.toList()));
        }

        if (entity.getParent_platforms() != null) {
            dto.setParent_platforms(entity.getParent_platforms().stream().map(p -> {
                VideojuegoDTO.ItemDTO item = new VideojuegoDTO.ItemDTO();
                item.setId(p.getId());
                item.setName(p.getName());
                item.setSlug(p.getSlug());
                VideojuegoDTO.PlatformWrapperDTO wrapper = new VideojuegoDTO.PlatformWrapperDTO();
                wrapper.setPlatform(item);
                return wrapper;
            }).collect(Collectors.toList()));
        }

        if (entity.getScreenshots() != null) {
            dto.setScreenshots(entity.getScreenshots().stream().map(s -> {
                VideojuegoDTO.ScreenshotDTO sd = new VideojuegoDTO.ScreenshotDTO();
                sd.setId(s.getId());
                sd.setImage(s.getImage());
                return sd;
            }).collect(Collectors.toList()));
        }

        return dto;
    }
}
