package com.ratemygame.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ratemygame.datamodel.entities.VideojuegosPendientes;
import com.ratemygame.datamodel.entities.Usuario;
import com.ratemygame.datamodel.repositories.VideojuegosPendientesRepository;
import com.ratemygame.datamodel.repositories.UsuarioRepository;
import com.ratemygame.dtos.VideojuegosPendientesDTO;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class VideojuegosPendientesService {

    @Autowired
    private VideojuegosPendientesRepository pendientesRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public List<VideojuegosPendientesDTO> getPendientesByUsuario(Long idUsuario) {
        return pendientesRepository.findByUsuario_Id(idUsuario).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Optional<VideojuegosPendientesDTO> createPendiente(VideojuegosPendientesDTO dto) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findById(dto.getId_usuario());
        if (!usuarioOpt.isPresent()) {
            return Optional.empty();
        }

        VideojuegosPendientes pendiente = new VideojuegosPendientes();
        pendiente.setId_videojuego(dto.getId_videojuego());
        pendiente.setUsuario(usuarioOpt.get());

        VideojuegosPendientes saved = pendientesRepository.save(pendiente);
        return Optional.of(convertToDTO(saved));
    }

    public boolean deletePendiente(Long id) {
        if (pendientesRepository.existsById(id)) {
            pendientesRepository.deleteById(id);
            return true;
        }
        return false;
    }

    private VideojuegosPendientesDTO convertToDTO(VideojuegosPendientes pendiente) {
        VideojuegosPendientesDTO dto = new VideojuegosPendientesDTO();
        dto.setId(pendiente.getId());
        dto.setId_videojuego(pendiente.getId_videojuego());
        if (pendiente.getUsuario() != null) {
            dto.setId_usuario(pendiente.getUsuario().getId());
        }
        return dto;
    }
}
