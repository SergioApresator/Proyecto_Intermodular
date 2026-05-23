package com.ratemygame.services;

import com.ratemygame.datamodel.entities.Videojuego;
import com.ratemygame.datamodel.repositories.VideojuegoRepository;
import com.ratemygame.datamodel.repositories.VideojuegoSpecification;
import com.ratemygame.dtos.VideojuegoDTO;
import com.ratemygame.mapper.VideojuegoMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class VideojuegoService {

    @Autowired
    private VideojuegoRepository videojuegoRepository;

    @Autowired
    private VideojuegoMapper videojuegoMapper;

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

        return videojuegoMapper.toDTOPage(videojuegoRepository.findAll(spec, pageable));
    }

    public Optional<VideojuegoDTO> getJuegoDetalles(Long id) {
        return videojuegoRepository.findById(id).map(videojuegoMapper::toDTO);
    }
}
