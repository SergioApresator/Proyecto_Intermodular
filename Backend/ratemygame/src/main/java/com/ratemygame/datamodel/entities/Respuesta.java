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
import jakarta.persistence.OneToMany;
import jakarta.persistence.CascadeType;
import java.time.LocalDateTime;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

@Entity
@Table(name = "RESPUESTA")
@Data
@EqualsAndHashCode(exclude = {"votos"})
@ToString(exclude = {"votos"})
public class Respuesta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Long id;

    @Column(name = "MENSAJE", length = 1000)
    private String mensaje;


    @Column(name = "ME_GUSTAS")
    private Integer meGustas;

    @Column(name = "NO_ME_GUSTAS")
    private Integer noMeGustas;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "ID_RESENA", 
    referencedColumnName = "ID",
    nullable = false, 
    foreignKey=@ForeignKey(value = ConstraintMode.CONSTRAINT, name = "FK_RESPUESTA_RESENA"))
    private Resena resena;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "ID_USUARIO", 
    referencedColumnName = "ID",
    nullable = false, 
    foreignKey=@ForeignKey(value = ConstraintMode.CONSTRAINT, name = "FK_RESPUESTA_USUARIO"))
    private Usuario usuario;

    @Column(name = "ID_RESPUESTA_PADRE")
    private Long idRespuestaPadre;


    @Column(name = "FECHA_RESPUESTA")
    private LocalDateTime fechaRespuesta;

    @JsonIgnore
    @OneToMany(mappedBy = "respuesta", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<RespuestaVoto> votos;
}
