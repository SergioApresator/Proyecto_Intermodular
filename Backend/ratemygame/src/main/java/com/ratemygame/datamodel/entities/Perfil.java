package com.ratemygame.datamodel.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Data;


@Entity
@Table(name="PERFIL")
@Data
public class Perfil {

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Long id;

    @Column(name = "BIO")
    private String bio;

    @Column(name = "FOTO_AVATAR")
    private String foto_avatar;
    
    @Column(name = "FOTO_BANNER")
    private String foto_banner;

    @Column(name = "FECHA_NACIMIENTO")
    private String fecha_nac;
    
    
    @OneToOne
    @JoinColumn(name = "id_usuario", unique = true)
    private Usuario usuario;

}
