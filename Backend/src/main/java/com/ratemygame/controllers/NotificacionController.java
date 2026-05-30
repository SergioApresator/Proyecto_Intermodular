package com.ratemygame.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ratemygame.datamodel.entities.Notificacion;
import com.ratemygame.services.NotificacionService;

@RestController
@RequestMapping("/api/notificaciones")
public class NotificacionController {

    @Autowired
    private NotificacionService notificacionService;

    // Obtiene el listado completo de notificaciones de un usuario.
    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<List<Notificacion>> getNotificacionesByUsuario(@PathVariable Long idUsuario) {
        return ResponseEntity.ok(notificacionService.getNotificacionesByUsuario(idUsuario));
    }

    // Obtiene el recuento de notificaciones no leídas de un usuario concreto.
    @GetMapping("/usuario/{idUsuario}/no-leidas-count")
    public ResponseEntity<Long> getNoLeidasCount(@PathVariable Long idUsuario) {
        return ResponseEntity.ok(notificacionService.getNoLeidasCount(idUsuario));
    }

    // Marca una notificación como leída.
    @PutMapping("/{id}/leer")
    public ResponseEntity<Notificacion> marcarComoLeida(@PathVariable Long id) {
        return notificacionService.marcarComoLeida(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Marca todas las notificaciones de un usuario como leídas.
    @PutMapping("/usuario/{idUsuario}/leer-todas")
    public ResponseEntity<Void> marcarTodasComoLeidas(@PathVariable Long idUsuario) {
        notificacionService.marcarTodasComoLeidas(idUsuario);
        return ResponseEntity.ok().build();
    }

    // Elimina una notificación física.
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarNotificacion(@PathVariable Long id) {
        if (notificacionService.eliminarNotificacion(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
