package com.ratemygame.services;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ratemygame.datamodel.entities.Notificacion;
import com.ratemygame.datamodel.entities.Resena;
import com.ratemygame.datamodel.entities.TipoNotificacion;
import com.ratemygame.datamodel.entities.Usuario;
import com.ratemygame.datamodel.repositories.NotificacionRepository;

import jakarta.transaction.Transactional;

@Service
public class NotificacionService {

    @Autowired
    private NotificacionRepository notificacionRepository;

    // Crea y persiste una nueva notificación en la base de datos con hora de Madrid.
    @Transactional
    public Notificacion crearNotificacion(Usuario destinatario, Resena resena, TipoNotificacion tipo, String mensaje) {
        Notificacion notificacion = new Notificacion();
        notificacion.setUsuario(destinatario);
        notificacion.setResena(resena);
        notificacion.setTipo(tipo);
        notificacion.setMensaje(mensaje);
        notificacion.setLeida(false);
        notificacion.setFecha(LocalDateTime.now(ZoneId.of("Europe/Madrid")));
        return notificacionRepository.save(notificacion);
    }

    // Obtiene todas las notificaciones de un usuario ordenadas por fecha más reciente.
    public List<Notificacion> getNotificacionesByUsuario(Long usuarioId) {
        return notificacionRepository.findByUsuario_IdOrderByFechaDesc(usuarioId);
    }

    // Obtiene el número de notificaciones pendientes de leer de un usuario.
    public long getNoLeidasCount(Long usuarioId) {
        return notificacionRepository.countByUsuario_IdAndLeidaFalse(usuarioId);
    }

    // Marca una notificación como leída.
    @Transactional
    public Optional<Notificacion> marcarComoLeida(Long id) {
        return notificacionRepository.findById(id).map(notificacion -> {
            notificacion.setLeida(true);
            return notificacionRepository.save(notificacion);
        });
    }

    // Marca todas las notificaciones de un usuario como leídas.
    @Transactional
    public void marcarTodasComoLeidas(Long usuarioId) {
        List<Notificacion> noLeidas = notificacionRepository.findByUsuario_IdOrderByFechaDesc(usuarioId);
        for (Notificacion notif : noLeidas) {
            if (!notif.getLeida()) {
                notif.setLeida(true);
                notificacionRepository.save(notif);
            }
        }
    }

    // Elimina una notificación por su ID.
    @Transactional
    public boolean eliminarNotificacion(Long id) {
        if (notificacionRepository.existsById(id)) {
            notificacionRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
