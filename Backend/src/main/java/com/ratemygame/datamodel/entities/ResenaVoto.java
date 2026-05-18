package com.ratemygame.datamodel.entities;

import jakarta.persistence.Column;
import jakarta.persistence.ConstraintMode;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

// Entidad JPA que registra el voto (me gusta / no me gusta) de un usuario sobre una reseña.
@Entity
@Table(name="RESENA_VOTO")
@Data
public class ResenaVoto {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "ID_RESENA", 
    referencedColumnName = "ID",
    nullable = false, 
    foreignKey=@ForeignKey(value = ConstraintMode.CONSTRAINT, name = "FK_VOTO_RESENA"))
    private Resena resena;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "ID_USUARIO", 
    referencedColumnName = "ID",
    nullable = false, 
    foreignKey=@ForeignKey(value = ConstraintMode.CONSTRAINT, name = "FK_VOTO_USUARIO"))
    private Usuario usuario;

    @Column(name = "ES_ME_GUSTA")
    private Boolean esMeGusta; // true = me gusta, false = no me gusta
}
