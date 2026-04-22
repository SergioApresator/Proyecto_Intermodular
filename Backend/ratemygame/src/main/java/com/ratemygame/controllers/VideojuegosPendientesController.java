package com.ratemygame.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ratemygame.dtos.VideojuegosPendientesDTO;
import com.ratemygame.services.VideojuegosPendientesService;

import java.util.List;

@RestController
@RequestMapping("/api/pendientes")
public class VideojuegosPendientesController {

    @Autowired
    private VideojuegosPendientesService pendientesService;

    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<List<VideojuegosPendientesDTO>> getPendientesByUsuario(@PathVariable Long idUsuario) {
        return ResponseEntity.ok(pendientesService.getPendientesByUsuario(idUsuario));
    }

    @PostMapping
    public ResponseEntity<VideojuegosPendientesDTO> createPendiente(@RequestBody VideojuegosPendientesDTO dto) {
        return pendientesService.createPendiente(dto)
                .map(saved -> new ResponseEntity<>(saved, HttpStatus.CREATED))
                .orElse(ResponseEntity.badRequest().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePendiente(@PathVariable Long id) {
        if (pendientesService.deletePendiente(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
