package com.ratemygame.datamodel.entities;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.ConstraintMode;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.Table;
import jakarta.persistence.OneToMany;
import jakarta.persistence.CascadeType;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

// Entidad JPA que representa una reseña escrita por un usuario sobre un videojuego.
@Entity
@Table(name="RESENA")
@Data
@EqualsAndHashCode(exclude = {"respuestas", "votos"})
@ToString(exclude = {"respuestas", "votos"})
public class Resena {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Long id;

    @Column(name = "MENSAJE", length = 1000)
    private String mensaje;


    @Column(name = "PUNTUACION")
    private int puntuacion;

    @Column(name = "TIENE_SPOILER")
    private Boolean tieneSpoiler;

    @Column(name = "ME_GUSTAS")
    private Integer meGustas;

    @Column(name = "NO_ME_GUSTAS")
    private Integer noMeGustas;

    @Column(name = "FECHA_RESENA")
    private LocalDateTime fechaResena;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "ID_USUARIO", 
    referencedColumnName = "ID",
    nullable = false, 
    foreignKey=@ForeignKey(value = ConstraintMode.CONSTRAINT, name = "FK_RESENA_USUARIO"))
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "ID_VIDEOJUEGO", referencedColumnName = "ID")
    private Videojuego videojuego;

    @Column(name = "REVISADA")
    private Boolean revisada;

    @JsonIgnore
    @OneToMany(mappedBy = "resena", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<Respuesta> respuestas;

    @JsonIgnore
    @OneToMany(mappedBy = "resena", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<ResenaVoto> votos;
}
