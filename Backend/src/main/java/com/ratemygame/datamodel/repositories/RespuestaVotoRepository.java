package com.ratemygame.datamodel.repositories;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.ratemygame.datamodel.entities.RespuestaVoto;

public interface RespuestaVotoRepository extends JpaRepository<RespuestaVoto, Long> {
    // Consulta para buscar el voto de un usuario concreto sobre una respuesta concreta.
    Optional<RespuestaVoto> findByRespuesta_IdAndUsuario_Id(Long idRespuesta, Long idUsuario);
    // Consulta para eliminar todos los votos de una respuesta al borrarla.
    void deleteByRespuesta_Id(Long idRespuesta);

    // Consulta para eliminar todos los votos realizados por un usuario al borrar su cuenta.
    void deleteByUsuario_Id(Long idUsuario);

}
