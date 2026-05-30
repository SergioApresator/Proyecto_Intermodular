package com.ratemygame.datamodel.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ratemygame.datamodel.entities.ResenaReporte;

import java.util.Optional;

@Repository
public interface ResenaReporteRepository extends JpaRepository<ResenaReporte, Long> {
    // Consulta para buscar si un usuario ya ha reportado una reseña concreta.
    Optional<ResenaReporte> findByResena_IdAndUsuario_Id(Long idResena, Long idUsuario);
    // Consulta para eliminar todos los reportes de una reseña al borrarla.
    void deleteByResena_Id(Long idResena);

    // Consulta para eliminar todos los reportes creados por un usuario al borrar su cuenta.
    void deleteByUsuario_Id(Long idUsuario);
}
