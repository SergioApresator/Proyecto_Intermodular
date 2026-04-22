package com.ratemygame.datamodel.repositories;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ratemygame.datamodel.entities.VideojuegosPendientes;

@Repository
public interface VideojuegosPendientesRepository extends JpaRepository<VideojuegosPendientes, Long> {
    List<VideojuegosPendientes> findByUsuario_Id(Long usuarioId);
}
