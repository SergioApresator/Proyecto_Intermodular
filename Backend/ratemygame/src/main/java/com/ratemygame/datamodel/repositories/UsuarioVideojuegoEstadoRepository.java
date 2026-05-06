package com.ratemygame.datamodel.repositories;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ratemygame.datamodel.entities.UsuarioVideojuegoEstado;
import com.ratemygame.enums.EstadoJuego;

@Repository
public interface UsuarioVideojuegoEstadoRepository extends JpaRepository<UsuarioVideojuegoEstado, Long> {

    List<UsuarioVideojuegoEstado> findByUsuario_Id(Long usuarioId);

    List<UsuarioVideojuegoEstado> findByUsuario_IdAndEstado(Long usuarioId, EstadoJuego estado);
}