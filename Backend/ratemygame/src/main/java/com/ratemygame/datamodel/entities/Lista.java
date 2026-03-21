package com.ratemygame.datamodel.entities;

import jakarta.persistence.Column;
import jakarta.persistence.ConstraintMode;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.ForeignKey;
import lombok.Data;

@Entity
@Table(name = "LISTA")
@Data
public class Lista {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Long id;

    @Column(name = "NOMBRE")
    private String nombre;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "ID_USUARIO", 
    referencedColumnName = "ID",
    nullable = false, 
    foreignKey=@ForeignKey(value = ConstraintMode.CONSTRAINT, name = "FK_LISTA_USUARIO"))
    private Usuario usuario;

    @Column(name = "ID_VIDEOJUEGO")
    private Long id_videojuego;
}
