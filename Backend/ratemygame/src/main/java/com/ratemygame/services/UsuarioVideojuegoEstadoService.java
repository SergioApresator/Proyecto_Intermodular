package com.ratemygame.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ratemygame.datamodel.entities.Usuario;
import com.ratemygame.datamodel.entities.UsuarioVideojuegoEstado;
import com.ratemygame.datamodel.repositories.UsuarioRepository;
import com.ratemygame.datamodel.repositories.UsuarioVideojuegoEstadoRepository;
import com.ratemygame.dtos.UsuarioVideojuegoEstadoDTO;
import com.ratemygame.enums.EstadoJuego;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UsuarioVideojuegoEstadoService {

    @Autowired
    private UsuarioVideojuegoEstadoRepository repository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public List<UsuarioVideojuegoEstadoDTO> getByUsuario(Long idUsuario) {
        return repository.findByUsuario_Id(idUsuario)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<UsuarioVideojuegoEstadoDTO> getByUsuarioAndEstado(Long idUsuario, EstadoJuego estado) {
        return repository.findByUsuario_IdAndEstado(idUsuario, estado)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Optional<UsuarioVideojuegoEstadoDTO> create(UsuarioVideojuegoEstadoDTO dto) {

        Optional<Usuario> usuarioOpt = usuarioRepository.findById(dto.getId_usuario());
        if (usuarioOpt.isEmpty()) return Optional.empty();

        UsuarioVideojuegoEstado entity = new UsuarioVideojuegoEstado();
        entity.setId_videojuego_api(dto.getId_videojuego_api());
        entity.setEstado(dto.getEstado());
        entity.setUsuario(usuarioOpt.get());

        UsuarioVideojuegoEstado saved = repository.save(entity);
        return Optional.of(convertToDTO(saved));
    }

    public boolean delete(Long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return true;
        }
        return false;
    }

    private UsuarioVideojuegoEstadoDTO convertToDTO(UsuarioVideojuegoEstado e) {
        UsuarioVideojuegoEstadoDTO dto = new UsuarioVideojuegoEstadoDTO();
        dto.setId(e.getId());
        dto.setId_videojuego_api(e.getId_videojuego_api());
        dto.setEstado(e.getEstado());

        if (e.getUsuario() != null) {
            dto.setId_usuario(e.getUsuario().getId());
        }

        return dto;
    }
}