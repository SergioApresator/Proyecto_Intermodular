package com.ratemygame.datamodel.entities;

import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

// Entidad JPA que representa a un usuario registrado en la plataforma.
@Entity
@Table(name = "USUARIO")
@Data
@EqualsAndHashCode(exclude = { "listas", "resenas" })
@ToString(exclude = { "listas", "resenas" })
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Long id;

    @Column(name = "NOMBRE")
    private String nombre;

    @Column(name = "APELLIDOS")
    private String apellidos;

    @Column(name = "USERNAME", unique = true)
    private String username;

    @Column(name = "EMAIL", unique = true)
    private String email;

    @Column(name = "PASSWORD")
    private String password;

    @Lob
    @Column(name = "FOTO_DATOS", columnDefinition = "LONGBLOB")
    private byte[] fotoDatos;

    @Column(name = "FOTO_CONTENT_TYPE")
    private String fotoContentType;

    @Lob
    @Column(name = "BANNER_DATOS", columnDefinition = "LONGBLOB")
    private byte[] bannerDatos;

    @Column(name = "BANNER_CONTENT_TYPE")
    private String bannerContentType;

    @Column(name = "BIOGRAFIA", length = 500)
    private String biografia;

    @JsonIgnore
    @OneToMany(fetch = FetchType.EAGER, mappedBy = "usuario")
    private Set<Lista> listas;

    @JsonIgnore
    @OneToMany(fetch = FetchType.EAGER, mappedBy = "usuario")
    private Set<Resena> resenas;

    @Column(name = "ES_ADMIN")
    private Boolean esAdmin;

    @Column(name = "BANEADO")
    private Boolean baneado;

    @Column(name = "CORREO_REAL")
    private Boolean correoReal = false;

    @Column(name = "OAUTH_PROVIDER", length = 50)
    private String oauthProvider;

    @Column(name = "OAUTH_PROVIDER_ID", length = 255)
    private String oauthProviderId;

    // Métodos dinámicos para obtener la URL correcta (sea local desde la BD o fallback del sistema)
    public String getResolvedFotoUrl() {
        if (this.fotoDatos != null) {
            return "http://localhost:9999/api/usuarios/" + this.id + "/foto";
        }
        return null;
    }

    public String getResolvedBannerUrl() {
        if (this.bannerDatos != null) {
            return "http://localhost:9999/api/usuarios/" + this.id + "/banner";
        }
        return null;
    }
}
