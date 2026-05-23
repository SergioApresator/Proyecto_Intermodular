package com.ratemygame.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ratemygame.dtos.ResenaDTO;
import com.ratemygame.dtos.VotoRequestDTO;
import com.ratemygame.services.ResenaService;

import java.util.List;

@RestController
@RequestMapping("/api/resenas")
public class ResenaController {

    @Autowired
    private ResenaService resenaService;

    // Recupera reseñas de un juego
    @GetMapping("/videojuego/{idVideojuego}")
    public ResponseEntity<List<ResenaDTO>> getResenasByVideojuego(
            @PathVariable Long idVideojuego,
            @RequestParam(required = false) Long idUsuario) {
        if (idUsuario != null) {
            return ResponseEntity.ok(resenaService.getResenasByVideojuegoWithVoto(idVideojuego, idUsuario));
        }
        return ResponseEntity.ok(resenaService.getResenasByVideojuego(idVideojuego));
    }

    // Listado de reseñas creadas por un usuario concreto para su perfil
    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<List<ResenaDTO>> getResenasByUsuario(@PathVariable Long idUsuario) {
        return ResponseEntity.ok(resenaService.getResenasByUsuario(idUsuario));
    }

    // Reseñas más recientes para el feed de la página de inicio
    @GetMapping("/recientes")
    public ResponseEntity<List<ResenaDTO>> getRecentReviews() {
        return ResponseEntity.ok(resenaService.getRecentReviews());
    }

    // Buzón de moderación. Solo los administradores con ROLE_ADMIN pueden entrar aquí.
    @GetMapping("/aRevisar")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ResenaDTO>> getResenasARevisar() {
        return ResponseEntity.ok(resenaService.getResenasARevisar());
    }

    // Crea una nueva reseña. El front se encarga de enviarnos los campos limpios.
    @PostMapping
    public ResponseEntity<ResenaDTO> createResena(@RequestBody ResenaDTO resenaDTO) {
        return resenaService.createResena(resenaDTO)
                .map(dto -> new ResponseEntity<>(dto, HttpStatus.CREATED))
                .orElse(ResponseEntity.badRequest().build());
    }

    // Registra o actualiza el voto de una reseña (like/dislike). El propio servicio gestiona la lógica si cambia de opinión.
    @PostMapping("/{id}/votar")
    public ResponseEntity<ResenaDTO> votar(@PathVariable Long id, @RequestBody VotoRequestDTO votoRequest) {
        return resenaService.votar(id, votoRequest.getIdUsuario(), votoRequest.getEsMeGusta())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Reporta o quita el reporte de una reseña (toggle por usuario).
    @PostMapping("/{id}/reportar")
    public ResponseEntity<ResenaDTO> reportarResena(@PathVariable Long id, @RequestBody java.util.Map<String, Long> body) {
        Long idUsuario = body.get("idUsuario");
        if (idUsuario == null) {
            return ResponseEntity.badRequest().build();
        }
        return resenaService.reportarResena(id, idUsuario)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Permite al usuario editar su opinión o puntuación de un juego
    @PutMapping("/updateResena/{id}")
    public ResponseEntity<ResenaDTO> updateResena(@PathVariable Long id, @RequestBody ResenaDTO resenaDTO) {
        return resenaService.updateResena(id, resenaDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Borrado físico de la reseña
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResena(@PathVariable Long id) {
        if (resenaService.deleteResena(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    // Recupera una reseña por su ID único
    @GetMapping("/{id}")
    public ResponseEntity<ResenaDTO> getResenaById(@PathVariable Long id) {
        return resenaService.getResenaById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
