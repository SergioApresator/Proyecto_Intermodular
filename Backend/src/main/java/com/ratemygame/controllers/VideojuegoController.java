package com.ratemygame.controllers;

import com.ratemygame.dtos.VideojuegoDTO;
import com.ratemygame.services.VideojuegoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/games")
@CrossOrigin(origins = "http://localhost:4200")
public class VideojuegoController {

    @Autowired
    private VideojuegoService videojuegoService;

    @GetMapping
    public ResponseEntity<Page<VideojuegoDTO>> getGames(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) List<String> genres,
            @RequestParam(required = false) List<String> tags,
            @RequestParam(required = false) List<String> platforms,
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate,
            @RequestParam(required = false) Integer minMetacritic,
            @RequestParam(required = false) Integer maxMetacritic,
            @PageableDefault(size = 20) Pageable pageable) {
        
        return ResponseEntity.ok(videojuegoService.buscarVideojuegos(
                search, genres, tags, platforms, startDate, endDate, minMetacritic, maxMetacritic, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<VideojuegoDTO> getGameDetails(@PathVariable Long id) {
        return videojuegoService.getJuegoDetalles(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/screenshots")
    public ResponseEntity<?> getScreenshots(@PathVariable Long id) {
        return videojuegoService.getJuegoDetalles(id)
                .map(game -> ResponseEntity.ok(Map.of("results", game.getScreenshots())))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/exportar/pdf")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<byte[]> exportarJuegosAPdf(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) List<String> genres,
            @RequestParam(required = false) List<String> tags,
            @RequestParam(required = false) List<String> platforms,
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate,
            @RequestParam(required = false) Integer minMetacritic,
            @RequestParam(required = false) Integer maxMetacritic) {
        
        byte[] pdfBytes = videojuegoService.exportarVideojuegosAPdf(
                search, genres, tags, platforms, startDate, endDate, minMetacritic, maxMetacritic);
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "videojuegos_report.pdf");
        headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");
        return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
    }

    @GetMapping("/exportar/csv")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<byte[]> exportarJuegosACsv(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) List<String> genres,
            @RequestParam(required = false) List<String> tags,
            @RequestParam(required = false) List<String> platforms,
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate,
            @RequestParam(required = false) Integer minMetacritic,
            @RequestParam(required = false) Integer maxMetacritic) {
        
        byte[] csvBytes = videojuegoService.exportarVideojuegosACsv(
                search, genres, tags, platforms, startDate, endDate, minMetacritic, maxMetacritic);
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("text/csv; charset=UTF-8"));
        headers.setContentDispositionFormData("attachment", "videojuegos_report.csv");
        headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");
        return new ResponseEntity<>(csvBytes, headers, HttpStatus.OK);
    }
}
