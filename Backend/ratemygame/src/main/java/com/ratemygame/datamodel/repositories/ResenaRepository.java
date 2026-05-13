package com.ratemygame.datamodel.repositories;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ratemygame.datamodel.entities.Resena;

@Repository
public interface ResenaRepository extends JpaRepository<Resena, Long> {
    List<Resena> findByUsuario_Id(Long usuarioId);

    @Query("SELECT r FROM Resena r WHERE r.id_videojuego = :idVideojuego")
    List<Resena> findByIdVideojuego(@Param("idVideojuego") Long idVideojuego);

    List<Resena> findTop10ByOrderByFechaResenaDescIdDesc();

    @Query("SELECT r FROM Resena r WHERE (r.tieneSpoiler = false OR r.tieneSpoiler IS NULL) AND (r.revisada = false OR r.revisada IS NULL) ORDER BY r.fechaResena DESC")
    List<Resena> findResenasARevisar();
}
