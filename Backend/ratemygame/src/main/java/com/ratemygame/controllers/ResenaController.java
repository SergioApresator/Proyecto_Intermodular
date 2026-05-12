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

    @GetMapping("/videojuego/{idVideojuego}")
    public ResponseEntity<List<ResenaDTO>> getResenasByVideojuego(
            @PathVariable Long idVideojuego,
            @RequestParam(required = false) Long idUsuario) {
        if (idUsuario != null) {
            return ResponseEntity.ok(resenaService.getResenasByVideojuegoWithVoto(idVideojuego, idUsuario));
        }
        return ResponseEntity.ok(resenaService.getResenasByVideojuego(idVideojuego));
    }

    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<List<ResenaDTO>> getResenasByUsuario(@PathVariable Long idUsuario) {
        return ResponseEntity.ok(resenaService.getResenasByUsuario(idUsuario));
    }

    @GetMapping("/recientes")
    public ResponseEntity<List<ResenaDTO>> getRecentReviews() {
        return ResponseEntity.ok(resenaService.getRecentReviews());
    }

    @PostMapping
    public ResponseEntity<ResenaDTO> createResena(@RequestBody ResenaDTO resenaDTO) {
        return resenaService.createResena(resenaDTO)
                .map(dto -> new ResponseEntity<>(dto, HttpStatus.CREATED))
                .orElse(ResponseEntity.badRequest().build());
    }

    @PostMapping("/{id}/votar")
    public ResponseEntity<ResenaDTO> votar(@PathVariable Long id, @RequestBody VotoRequestDTO votoRequest) {
        return resenaService.votar(id, votoRequest.getIdUsuario(), votoRequest.getEsMeGusta())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResena(@PathVariable Long id) {
        if (resenaService.deleteResena(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResenaDTO> getResenaById(@PathVariable Long id) {
        return resenaService.getResenaById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
}
