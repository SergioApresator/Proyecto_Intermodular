package com.ratemygame.datamodel.repositories;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ratemygame.datamodel.entities.Respuesta;

@Repository
public interface RespuestaRepository extends JpaRepository<Respuesta, Long> {
    // Consulta para obtener todas las respuestas de una reseña concreta.
    List<Respuesta> findByResena_Id(Long resenaId);
    // Consulta para obtener todas las respuestas publicadas por un usuario.
    List<Respuesta> findByUsuario_Id(Long usuarioId);
    // Consulta para obtener las respuestas que son hijas de otra respuesta (anidadas).
    List<Respuesta> findByIdRespuestaPadre(Long idPadre);
    // Consulta para eliminar todas las respuestas de una reseña al borrarla en cascada.
    void deleteByResena_Id(Long resenaId);


}
