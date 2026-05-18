package com.ratemygame.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.time.ZoneId;

import com.ratemygame.datamodel.entities.Respuesta;
import com.ratemygame.datamodel.entities.RespuestaVoto;
import com.ratemygame.datamodel.entities.Resena;
import com.ratemygame.datamodel.entities.Usuario;
import com.ratemygame.datamodel.repositories.RespuestaRepository;
import com.ratemygame.datamodel.repositories.RespuestaVotoRepository;
import com.ratemygame.datamodel.repositories.ResenaRepository;
import com.ratemygame.datamodel.repositories.UsuarioRepository;
import com.ratemygame.dtos.RespuestaDTO;

import jakarta.transaction.Transactional;
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

    @Autowired
    private RespuestaVotoRepository respuestaVotoRepository;

    public List<RespuestaDTO> getRespuestasByResena(Long idResena) {
        return respuestaRepository.findByResena_Id(idResena).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<RespuestaDTO> getRespuestasByResenaWithVoto(Long idResena, Long idUsuario) {
        return respuestaRepository.findByResena_Id(idResena).stream()
                .map(resp -> {
                    RespuestaDTO dto = convertToDTO(resp);
                    if (idUsuario != null) {
                        Optional<RespuestaVoto> voto = respuestaVotoRepository.findByRespuesta_IdAndUsuario_Id(resp.getId(), idUsuario);
                        dto.setVotoUsuarioActual(voto.map(RespuestaVoto::getEsMeGusta).orElse(null));
                    }
                    return dto;
                })
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
        respuesta.setIdRespuestaPadre(respuestaDTO.getId_respuesta_padre());
        respuesta.setFechaRespuesta(LocalDateTime.now(ZoneId.of("Europe/Madrid")));


        Respuesta savedRespuesta = respuestaRepository.save(respuesta);
        return Optional.of(convertToDTO(savedRespuesta));
    }

    @Transactional
    public Optional<RespuestaDTO> votar(Long idRespuesta, Long idUsuario, boolean esMeGusta) {
        Optional<Respuesta> respuestaOpt = respuestaRepository.findById(idRespuesta);
        Optional<Usuario> usuarioOpt = usuarioRepository.findById(idUsuario);

        if (!respuestaOpt.isPresent() || !usuarioOpt.isPresent()) {
            return Optional.empty();
        }

        Respuesta respuesta = respuestaOpt.get();
        Usuario usuario = usuarioOpt.get();
        Optional<RespuestaVoto> votoExistente = respuestaVotoRepository.findByRespuesta_IdAndUsuario_Id(idRespuesta, idUsuario);

        if (votoExistente.isPresent()) {
            RespuestaVoto voto = votoExistente.get();
            if (voto.getEsMeGusta() == esMeGusta) {
                // Mismo voto: retirar voto
                respuestaVotoRepository.delete(voto);
                if (esMeGusta) {
                    respuesta.setMeGustas(Math.max(0, respuesta.getMeGustas() - 1));
                } else {
                    respuesta.setNoMeGustas(Math.max(0, respuesta.getNoMeGustas() - 1));
                }
            } else {
                // Voto diferente: cambiar voto
                voto.setEsMeGusta(esMeGusta);
                respuestaVotoRepository.save(voto);
                if (esMeGusta) {
                    respuesta.setMeGustas(respuesta.getMeGustas() + 1);
                    respuesta.setNoMeGustas(Math.max(0, respuesta.getNoMeGustas() - 1));
                } else {
                    respuesta.setNoMeGustas(respuesta.getNoMeGustas() + 1);
                    respuesta.setMeGustas(Math.max(0, respuesta.getMeGustas() - 1));
                }
            }
        } else {
            // Voto nuevo
            RespuestaVoto nuevoVoto = new RespuestaVoto();
            nuevoVoto.setRespuesta(respuesta);
            nuevoVoto.setUsuario(usuario);
            nuevoVoto.setEsMeGusta(esMeGusta);
            respuestaVotoRepository.save(nuevoVoto);
            if (esMeGusta) {
                respuesta.setMeGustas(respuesta.getMeGustas() + 1);
            } else {
                respuesta.setNoMeGustas(respuesta.getNoMeGustas() + 1);
            }
        }

        Respuesta savedRespuesta = respuestaRepository.save(respuesta);
        RespuestaDTO dto = convertToDTO(savedRespuesta);
        
        // Estado final
        Optional<RespuestaVoto> votoFinal = respuestaVotoRepository.findByRespuesta_IdAndUsuario_Id(idRespuesta, idUsuario);
        dto.setVotoUsuarioActual(votoFinal.map(RespuestaVoto::getEsMeGusta).orElse(null));

        return Optional.of(dto);
    }

    @Transactional
    public boolean deleteRespuesta(Long id) {
        if (respuestaRepository.existsById(id)) {
            // 1. Eliminar votos de la respuesta
            respuestaVotoRepository.deleteByRespuesta_Id(id);
            
            // 2. Desvincular respuestas que dependen de esta (hijos)
            List<Respuesta> hijos = respuestaRepository.findByIdRespuestaPadre(id);
            for (Respuesta hijo : hijos) {
                hijo.setIdRespuestaPadre(null);
                respuestaRepository.save(hijo);
            }
            
            // 3. Eliminar la respuesta
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
            dto.setNombreUsuario(respuesta.getUsuario().getUsername());
            dto.setFotoUsuario(respuesta.getUsuario().getFoto_url());
        }
        if (respuesta.getResena() != null) {
            dto.setId_resena(respuesta.getResena().getId());
        }
        dto.setId_respuesta_padre(respuesta.getIdRespuestaPadre());
        if (respuesta.getIdRespuestaPadre() != null) {
            respuestaRepository.findById(respuesta.getIdRespuestaPadre()).ifPresent(padre -> {

                if (padre.getUsuario() != null) {
                    dto.setNombreUsuarioPadre(padre.getUsuario().getUsername());
                }
            });
        }
        dto.setFechaRespuesta(respuesta.getFechaRespuesta());
        return dto;
    }

    public List<RespuestaDTO> getRespuestasByUsuario(Long idUsuario) {
        return respuestaRepository.findByUsuario_Id(idUsuario).stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
}
