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

    @GetMapping("/resena/{idResena}")
    public ResponseEntity<List<RespuestaDTO>> getRespuestasByResena(
            @PathVariable Long idResena,
            @RequestParam(required = false) Long idUsuario) {
        if (idUsuario != null) {
            return ResponseEntity.ok(respuestaService.getRespuestasByResenaWithVoto(idResena, idUsuario));
        }
        return ResponseEntity.ok(respuestaService.getRespuestasByResena(idResena));
    }

    @PostMapping
    public ResponseEntity<RespuestaDTO> createRespuesta(@RequestBody RespuestaDTO respuestaDTO) {
        return respuestaService.createRespuesta(respuestaDTO)
                .map(dto -> new ResponseEntity<>(dto, HttpStatus.CREATED))
                .orElse(ResponseEntity.badRequest().build());
    }

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

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRespuesta(@PathVariable Long id) {
        if (respuestaService.deleteRespuesta(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
