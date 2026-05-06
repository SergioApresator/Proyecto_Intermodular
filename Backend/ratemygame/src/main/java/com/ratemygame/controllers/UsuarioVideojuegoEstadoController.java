package com.ratemygame.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ratemygame.dtos.UsuarioVideojuegoEstadoDTO;
import com.ratemygame.enums.EstadoJuego;
import com.ratemygame.services.UsuarioVideojuegoEstadoService;

import java.util.List;

@RestController
@RequestMapping("/api/estados")
public class UsuarioVideojuegoEstadoController {

    @Autowired
    private UsuarioVideojuegoEstadoService service;

    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<List<UsuarioVideojuegoEstadoDTO>> getByUsuario(@PathVariable Long idUsuario) {
        return ResponseEntity.ok(service.getByUsuario(idUsuario));
    }

    @GetMapping("/usuario/{idUsuario}/{estado}")
    public ResponseEntity<List<UsuarioVideojuegoEstadoDTO>> getByUsuarioAndEstado(
            @PathVariable Long idUsuario,
            @PathVariable EstadoJuego estado) {

        return ResponseEntity.ok(service.getByUsuarioAndEstado(idUsuario, estado));
    }

    @PostMapping
    public ResponseEntity<UsuarioVideojuegoEstadoDTO> create(@RequestBody UsuarioVideojuegoEstadoDTO dto) {
        return service.create(dto)
                .map(saved -> new ResponseEntity<>(saved, HttpStatus.CREATED))
                .orElse(ResponseEntity.badRequest().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (service.delete(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}