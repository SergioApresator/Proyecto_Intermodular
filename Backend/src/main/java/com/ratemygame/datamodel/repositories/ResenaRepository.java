package com.ratemygame.datamodel.repositories;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ratemygame.datamodel.entities.Resena;

@Repository
public interface ResenaRepository extends JpaRepository<Resena, Long> {
    // Consulta para obtener todas las reseñas escritas por un usuario concreto.
    List<Resena> findByUsuario_Id(Long usuarioId);

    // Consulta para obtener todas las reseñas de un videojuego por su ID externo.
    @Query("SELECT r FROM Resena r WHERE r.videojuego.id = :idVideojuego")
    List<Resena> findByIdVideojuego(@Param("idVideojuego") Long idVideojuego);

    // Consulta para obtener las 10 reseñas más recientes ordenadas por fecha e ID descendente.
    List<Resena> findTop10ByOrderByFechaResenaDescIdDesc();

    // Consulta para obtener las reseñas reportadas por los usuarios.
    @Query("SELECT r FROM Resena r WHERE r.reportes > 0 ORDER BY r.reportes DESC, r.fechaResena DESC")
    List<Resena> findResenasARevisar();

}
