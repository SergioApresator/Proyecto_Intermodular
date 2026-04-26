package com.ratemygame.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ratemygame.datamodel.entities.Respuesta;
import com.ratemygame.datamodel.entities.Resena;
import com.ratemygame.datamodel.entities.Usuario;
import com.ratemygame.datamodel.repositories.RespuestaRepository;
import com.ratemygame.datamodel.repositories.ResenaRepository;
import com.ratemygame.datamodel.repositories.UsuarioRepository;
import com.ratemygame.dtos.RespuestaDTO;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class RespuestaService {

    @Autowired
    private RespuestaRepository respuestaRepository;

    @Autowired
    private ResenaRepository resenaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public List<RespuestaDTO> getRespuestasByResena(Long idResena) {
        return respuestaRepository.findByResena_Id(idResena).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Optional<RespuestaDTO> createRespuesta(RespuestaDTO respuestaDTO) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findById(respuestaDTO.getId_usuario());
        Optional<Resena> resenaOpt = resenaRepository.findById(respuestaDTO.getId_resena());
        
        if (!usuarioOpt.isPresent() || !resenaOpt.isPresent()) {
            return Optional.empty();
        }

        Respuesta respuesta = new Respuesta();
        respuesta.setMensaje(respuestaDTO.getMensaje());
        respuesta.setMeGustas(0);
        respuesta.setNoMeGustas(0);
        respuesta.setUsuario(usuarioOpt.get());
        respuesta.setResena(resenaOpt.get());

        Respuesta savedRespuesta = respuestaRepository.save(respuesta);
        return Optional.of(convertToDTO(savedRespuesta));
    }

    public boolean deleteRespuesta(Long id) {
        if (respuestaRepository.existsById(id)) {
            respuestaRepository.deleteById(id);
            return true;
        }
        return false;
    }

    private RespuestaDTO convertToDTO(Respuesta respuesta) {
        RespuestaDTO dto = new RespuestaDTO();
        dto.setId(respuesta.getId());
        dto.setMensaje(respuesta.getMensaje());
        dto.setMeGustas(respuesta.getMeGustas());
        dto.setNoMeGustas(respuesta.getNoMeGustas());
        if (respuesta.getUsuario() != null) {
            dto.setId_usuario(respuesta.getUsuario().getId());
        }
        if (respuesta.getResena() != null) {
            dto.setId_resena(respuesta.getResena().getId());
        }
        return dto;
    }
}
