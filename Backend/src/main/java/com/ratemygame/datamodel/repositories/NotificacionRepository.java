package com.ratemygame.datamodel.repositories;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ratemygame.datamodel.entities.Notificacion;

@Repository
public interface NotificacionRepository extends JpaRepository<Notificacion, Long> {
    
    // Recupera todas las notificaciones de un usuario ordenadas por fecha más reciente.
    List<Notificacion> findByUsuario_IdOrderByFechaDesc(Long usuarioId);

    // Cuenta cuántas notificaciones tiene un usuario sin leer.
    long countByUsuario_IdAndLeidaFalse(Long usuarioId);

    // Consulta para eliminar todas las notificaciones de un usuario.
    void deleteByUsuario_Id(Long usuarioId);

    // Consulta para eliminar todas las notificaciones relacionadas con una reseña concreta.
    void deleteByResena_Id(Long resenaId);
}
