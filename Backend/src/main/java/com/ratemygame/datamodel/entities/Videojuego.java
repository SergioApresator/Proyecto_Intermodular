package com.ratemygame.datamodel.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import java.time.LocalDate;
import java.util.Set;
import java.util.List;

@Entity
@Table(name = "VIDEOJUEGO")
@Data
@EqualsAndHashCode(exclude = {"genres", "tags", "parent_platforms", "screenshots", "resenas", "listas"})
@ToString(exclude = {"genres", "tags", "parent_platforms", "screenshots", "resenas", "listas"})
public class Videojuego {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(name = "background_image", length = 1000)
    private String backgroundImage;

    @Column(columnDefinition = "TEXT")
    private String description;

    private LocalDate released;

    @org.hibernate.annotations.Formula("(SELECT COALESCE(AVG(r.puntuacion), 0.0) FROM resena r WHERE r.id_videojuego = id AND r.eliminada = false)")
    private Double rating = 0.0;

    private Integer metacritic;

    @Column(name = "added_count")
    private Integer added = 0; // Para ordenar por popularidad

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "VIDEOJUEGO_GENERO",
        joinColumns = @JoinColumn(name = "videojuego_id"),
        inverseJoinColumns = @JoinColumn(name = "genero_id")
    )
    private Set<Genero> genres;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "VIDEOJUEGO_TAG",
        joinColumns = @JoinColumn(name = "videojuego_id"),
        inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    private Set<Tag> tags;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "VIDEOJUEGO_PLATAFORMA",
        joinColumns = @JoinColumn(name = "videojuego_id"),
        inverseJoinColumns = @JoinColumn(name = "plataforma_id")
    )
    private Set<Plataforma> parent_platforms;

    @OneToMany(mappedBy = "videojuego", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Screenshot> screenshots;

    @JsonIgnore
    @OneToMany(mappedBy = "videojuego", cascade = CascadeType.ALL)
    private List<Resena> resenas;

    @JsonIgnore
    @OneToMany(mappedBy = "videojuego", cascade = CascadeType.ALL)
    private List<Lista> listas;
}
