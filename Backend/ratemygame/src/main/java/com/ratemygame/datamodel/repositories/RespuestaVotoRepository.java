package com.ratemygame.datamodel.repositories;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.ratemygame.datamodel.entities.RespuestaVoto;

public interface RespuestaVotoRepository extends JpaRepository<RespuestaVoto, Long> {
    Optional<RespuestaVoto> findByRespuesta_IdAndUsuario_Id(Long idRespuesta, Long idUsuario);
}
