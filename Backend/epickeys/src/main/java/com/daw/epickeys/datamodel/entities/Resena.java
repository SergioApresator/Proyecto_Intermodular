package com.daw.epickeys.datamodel.entities;

import java.time.LocalDate;

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
import lombok.Data;

@Entity
@Table(name="RESENA")
@Data
public class Resena {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Long id;

    @Column(name = "MENSAJE")
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
    private LocalDate fechaResena;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "ID_USUARIO", 
    referencedColumnName = "ID",
    nullable = false, 
    foreignKey=@ForeignKey(value = ConstraintMode.CONSTRAINT, name = "FK_RESENA_USUARIO"))
    private Usuario usuario;

    @Column(name = "ID_VIDEOJUEGO")
    private Long id_videojuego;
}
