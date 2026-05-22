package com.ratemygame.datamodel.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.util.Set;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "TAG")
@Data
@EqualsAndHashCode(exclude = "videojuegos")
public class Tag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String slug;

    @JsonIgnore
    @ManyToMany(mappedBy = "tags")
    private Set<Videojuego> videojuegos;
}
