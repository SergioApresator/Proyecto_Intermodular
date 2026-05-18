package com.ratemygame.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ratemygame.dtos.ListaDTO;
import com.ratemygame.services.ListaService;

import java.util.List;

@RestController
@RequestMapping("/api/listas")
public class ListaController {

    @Autowired
    private ListaService listaService;

    // Método para obtener todas las entradas de las listas de un usuario.
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<ListaDTO>> getListasByUsuario(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(listaService.getListasByUsuario(usuarioId));
    }

    // Método para añadir un videojuego a una lista del usuario.
    @PostMapping
    public ResponseEntity<ListaDTO> createListaItem(@RequestBody ListaDTO listaDTO) {
        return listaService.createListaItem(listaDTO)
                .map(dto -> new ResponseEntity<>(dto, HttpStatus.CREATED))
                .orElse(ResponseEntity.badRequest().build());
    }

    // Método para eliminar una entrada de lista por su ID.
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteListaItem(@PathVariable Long id) {
        if (listaService.deleteListaItem(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
