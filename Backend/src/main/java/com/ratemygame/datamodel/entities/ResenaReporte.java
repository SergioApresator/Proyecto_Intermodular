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

// Entidad JPA que registra el reporte de un usuario sobre una reseña (relación muchos a muchos).
@Entity
@Table(name="RESENA_REPORTE")
@Data
public class ResenaReporte {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "ID_RESENA", 
    referencedColumnName = "ID",
    nullable = false, 
    foreignKey=@ForeignKey(value = ConstraintMode.CONSTRAINT, name = "FK_REPORTE_RESENA"))
    private Resena resena;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "ID_USUARIO", 
    referencedColumnName = "ID",
    nullable = false, 
    foreignKey=@ForeignKey(value = ConstraintMode.CONSTRAINT, name = "FK_REPORTE_USUARIO"))
    private Usuario usuario;
}
