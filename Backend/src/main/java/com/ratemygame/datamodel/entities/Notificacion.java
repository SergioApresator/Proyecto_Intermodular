package com.ratemygame.datamodel.entities;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.ConstraintMode;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

// Entidad JPA que representa una notificación enviada a un usuario.
@Entity
@Table(name = "NOTIFICACION")
@Data
public class Notificacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Long id;

    @Column(name = "MENSAJE", length = 1000, nullable = false)
    private String mensaje;

    @Column(name = "FECHA", nullable = false)
    private LocalDateTime fecha;

    @Column(name = "LEIDA", nullable = false)
    private Boolean leida = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "TIPO", nullable = false)
    private TipoNotificacion tipo;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "ID_USUARIO", 
    referencedColumnName = "ID",
    nullable = false, 
    foreignKey = @ForeignKey(value = ConstraintMode.CONSTRAINT, name = "FK_NOTIFICACION_USUARIO"))
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "ID_RESENA", 
    referencedColumnName = "ID",
    foreignKey = @ForeignKey(value = ConstraintMode.CONSTRAINT, name = "FK_NOTIFICACION_RESENA"))
    @org.hibernate.annotations.NotFound(action = org.hibernate.annotations.NotFoundAction.IGNORE)
    private Resena resena;
}
