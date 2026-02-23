package com.daw.epickeys.datamodel.entities;

import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name="USUARIO")
@Data
public class Usuario {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Long id;

    @Column(name = "NOMBRE")
    private String nombre;

    @Column(name = "EMAIL")
    private String email;

    @Column(name = "PASSWORD")
    private String password;

    @Column(name = "FOTO_URL")
    private String foto_url;

    @JsonIgnore
    @OneToMany(fetch = FetchType.EAGER, mappedBy = "usuario")
    private Set<VideojuegosPendientes> videojuegosPendientes;

    @JsonIgnore
    @OneToMany(fetch = FetchType.EAGER, mappedBy = "usuario")
    private Set<Lista> listas;

    @JsonIgnore
    @OneToMany(fetch = FetchType.EAGER, mappedBy = "usuario")
    private Set<Resena> resenas;
}
