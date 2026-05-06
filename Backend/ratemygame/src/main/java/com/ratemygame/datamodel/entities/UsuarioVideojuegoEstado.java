package com.ratemygame.datamodel.entities;

import com.ratemygame.enums.EstadoJuego;

import jakarta.persistence.Column;
import jakarta.persistence.ConstraintMode;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "USUARIO_VIDEOJUEGO_ESTADO")
@Data
public class UsuarioVideojuegoEstado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Long id;

    @Column(name = "ID_VIDEOJUEGO_API", nullable = false)
    private Long id_videojuego_api;

    @Enumerated(EnumType.STRING)
    private EstadoJuego estado;
    
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "ID_USUARIO", 
    referencedColumnName = "ID", 
    nullable = false, 
    foreignKey=@ForeignKey(value = ConstraintMode.CONSTRAINT, name = "FK_VIDEOJUEGOS_PENDIENTES_USUARIO"))
    private Usuario usuario;
}
