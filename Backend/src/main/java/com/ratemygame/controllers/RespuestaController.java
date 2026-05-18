package com.ratemygame.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ratemygame.dtos.RespuestaDTO;
import com.ratemygame.services.RespuestaService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/respuestas")
public class RespuestaController {

    @Autowired
    private RespuestaService respuestaService;

    // Método para obtener las respuestas de una reseña, incluyendo el voto del usuario si se indica su ID.
    @GetMapping("/resena/{idResena}")
    public ResponseEntity<List<RespuestaDTO>> getRespuestasByResena(
            @PathVariable Long idResena,
            @RequestParam(required = false) Long idUsuario) {
        if (idUsuario != null) {
            return ResponseEntity.ok(respuestaService.getRespuestasByResenaWithVoto(idResena, idUsuario));
        }
        return ResponseEntity.ok(respuestaService.getRespuestasByResena(idResena));
    }

    // Método para publicar una nueva respuesta a una reseña, con soporte para respuestas anidadas.
    @PostMapping
    public ResponseEntity<RespuestaDTO> createRespuesta(@RequestBody RespuestaDTO respuestaDTO) {
        return respuestaService.createRespuesta(respuestaDTO)
                .map(dto -> new ResponseEntity<>(dto, HttpStatus.CREATED))
                .orElse(ResponseEntity.badRequest().build());
    }

    // Método para registrar o cambiar el voto de un usuario sobre una respuesta concreta.
    @PostMapping("/{id}/votar")
    public ResponseEntity<RespuestaDTO> votar(
            @PathVariable Long id,
            @RequestBody Map<String, Object> payload) {
        Long idUsuario = Long.valueOf(payload.get("idUsuario").toString());
        boolean esMeGusta = (boolean) payload.get("esMeGusta");
        
        return respuestaService.votar(id, idUsuario, esMeGusta)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Método para eliminar una respuesta por su ID.
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRespuesta(@PathVariable Long id) {
        if (respuestaService.deleteRespuesta(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    // Método para obtener todas las respuestas publicadas por un usuario concreto.
    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<List<RespuestaDTO>> getRespuestasByUsuario(@PathVariable Long idUsuario) {
        return ResponseEntity.ok(respuestaService.getRespuestasByUsuario(idUsuario));
    }
}
