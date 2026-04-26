package com.ratemygame.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ratemygame.datamodel.entities.Resena;
import com.ratemygame.datamodel.entities.Usuario;
import com.ratemygame.datamodel.repositories.ResenaRepository;
import com.ratemygame.datamodel.repositories.UsuarioRepository;
import com.ratemygame.dtos.ResenaDTO;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ResenaService {

    @Autowired
    private ResenaRepository resenaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public List<ResenaDTO> getResenasByVideojuego(Long idVideojuego) {
        return resenaRepository.findByIdVideojuego(idVideojuego).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<ResenaDTO> getResenasByUsuario(Long idUsuario) {
        return resenaRepository.findByUsuario_Id(idUsuario).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Optional<ResenaDTO> createResena(ResenaDTO resenaDTO) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findById(resenaDTO.getId_usuario());
        if (!usuarioOpt.isPresent()) {
            return Optional.empty();
        }

        Resena resena = new Resena();
        resena.setMensaje(resenaDTO.getMensaje());
        resena.setPuntuacion(resenaDTO.getPuntuacion());
        resena.setTieneSpoiler(resenaDTO.getTieneSpoiler() != null ? resenaDTO.getTieneSpoiler() : false);
        resena.setMeGustas(0);
        resena.setNoMeGustas(0);
        resena.setFechaResena(LocalDate.now());
        resena.setId_videojuego(resenaDTO.getId_videojuego());
        resena.setUsuario(usuarioOpt.get());

        Resena savedResena = resenaRepository.save(resena);
        return Optional.of(convertToDTO(savedResena));
    }

    public boolean deleteResena(Long id) {
        if (resenaRepository.existsById(id)) {
            resenaRepository.deleteById(id);
            return true;
        }
        return false;
    }

    private ResenaDTO convertToDTO(Resena resena) {
        ResenaDTO dto = new ResenaDTO();
        dto.setId(resena.getId());
        dto.setMensaje(resena.getMensaje());
        dto.setPuntuacion(resena.getPuntuacion());
        dto.setTieneSpoiler(resena.getTieneSpoiler());
        dto.setMeGustas(resena.getMeGustas());
        dto.setNoMeGustas(resena.getNoMeGustas());
        dto.setFechaResena(resena.getFechaResena());
        dto.setId_videojuego(resena.getId_videojuego());
        if (resena.getUsuario() != null) {
            dto.setId_usuario(resena.getUsuario().getId());
        }
        return dto;
    }
}
