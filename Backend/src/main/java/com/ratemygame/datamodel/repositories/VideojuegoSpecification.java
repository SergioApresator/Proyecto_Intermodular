package com.ratemygame.datamodel.repositories;

import com.ratemygame.datamodel.entities.Videojuego;
import com.ratemygame.datamodel.entities.Genero;
import com.ratemygame.datamodel.entities.Tag;
import com.ratemygame.datamodel.entities.Plataforma;
import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.Join;
import java.time.LocalDate;
import java.util.List;

public class VideojuegoSpecification {

    public static Specification<Videojuego> hasName(String name) {
        return (root, query, criteriaBuilder) -> {
            if (name == null || name.trim().isEmpty()) return null;
            return criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), "%" + name.toLowerCase() + "%");
        };
    }

    public static Specification<Videojuego> hasGenres(List<String> genres) {
        return (root, query, criteriaBuilder) -> {
            if (genres == null || genres.isEmpty()) return null;
            Join<Videojuego, Genero> genreJoin = root.join("genres");
            return genreJoin.get("slug").in(genres);
        };
    }

    public static Specification<Videojuego> hasTags(List<String> tags) {
        return (root, query, criteriaBuilder) -> {
            if (tags == null || tags.isEmpty()) return null;
            Join<Videojuego, Tag> tagJoin = root.join("tags");
            return tagJoin.get("slug").in(tags);
        };
    }

    public static Specification<Videojuego> hasPlatforms(List<String> platforms) {
        return (root, query, criteriaBuilder) -> {
            if (platforms == null || platforms.isEmpty()) return null;
            Join<Videojuego, Plataforma> platformJoin = root.join("parent_platforms");
            return platformJoin.get("slug").in(platforms);
        };
    }

    public static Specification<Videojuego> releasedBetween(LocalDate start, LocalDate end) {
        return (root, query, criteriaBuilder) -> {
            if (start == null || end == null) return null;
            return criteriaBuilder.between(root.get("released"), start, end);
        };
    }

    public static Specification<Videojuego> metacriticBetween(Integer min, Integer max) {
        return (root, query, criteriaBuilder) -> {
            if (min == null || max == null) return null;
            return criteriaBuilder.between(root.get("metacritic"), min, max);
        };
    }
}
