package com.ratemygame.datamodel.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ratemygame.datamodel.entities.ResenaVoto;

import java.util.Optional;

@Repository
public interface ResenaVotoRepository extends JpaRepository<ResenaVoto, Long> {
    // Consulta para buscar el voto de un usuario concreto sobre una reseña concreta.
    Optional<ResenaVoto> findByResena_IdAndUsuario_Id(Long idResena, Long idUsuario);
    // Consulta para eliminar todos los votos de una reseña al borrarla.
    void deleteByResena_Id(Long idResena);

}
