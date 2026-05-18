package com.ratemygame.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ratemygame.datamodel.entities.Resena;
import com.ratemygame.datamodel.entities.ResenaVoto;
import com.ratemygame.datamodel.entities.Usuario;
import com.ratemygame.datamodel.repositories.ResenaRepository;
import com.ratemygame.datamodel.repositories.ResenaVotoRepository;
import com.ratemygame.datamodel.repositories.RespuestaRepository;
import com.ratemygame.datamodel.repositories.RespuestaVotoRepository;

import com.ratemygame.datamodel.repositories.UsuarioRepository;
import com.ratemygame.dtos.ResenaDTO;

import jakarta.transaction.Transactional;
import java.time.ZoneId;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ResenaService {

    @Autowired
    private ResenaRepository resenaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ResenaVotoRepository resenaVotoRepository;

    @Autowired
    private RespuestaRepository respuestaRepository;

    @Autowired
    private RespuestaVotoRepository respuestaVotoRepository;


    public List<ResenaDTO> getResenasByVideojuego(Long idVideojuego) {
        return resenaRepository.findByIdVideojuego(idVideojuego).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<ResenaDTO> getResenasByVideojuegoWithVoto(Long idVideojuego, Long idUsuario) {
        return resenaRepository.findByIdVideojuego(idVideojuego).stream()
                .map(resena -> {
                    ResenaDTO dto = convertToDTO(resena);
                    Optional<ResenaVoto> voto = resenaVotoRepository.findByResena_IdAndUsuario_Id(resena.getId(),
                            idUsuario);
                    dto.setVotoUsuarioActual(voto.map(ResenaVoto::getEsMeGusta).orElse(null));
                    return dto;
                })
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
        resena.setRevisada(resenaDTO.getRevisada() != null ? resenaDTO.getRevisada() : false);
        resena.setMeGustas(0);
        resena.setNoMeGustas(0);
        resena.setFechaResena(LocalDateTime.now(ZoneId.of("Europe/Madrid")));
        resena.setId_videojuego(resenaDTO.getId_videojuego());
        resena.setNombreVideojuego(resenaDTO.getNombreVideojuego());
        resena.setFotoVideojuego(resenaDTO.getFotoVideojuego());
        resena.setUsuario(usuarioOpt.get());

        Resena savedResena = resenaRepository.save(resena);
        return Optional.of(convertToDTO(savedResena));
    }

    @Transactional
    public Optional<ResenaDTO> votar(Long idResena, Long idUsuario, boolean esMeGusta) {
        Optional<Resena> resenaOpt = resenaRepository.findById(idResena);
        Optional<Usuario> usuarioOpt = usuarioRepository.findById(idUsuario);

        if (!resenaOpt.isPresent() || !usuarioOpt.isPresent()) {
            return Optional.empty();
        }

        Resena resena = resenaOpt.get();
        Usuario usuario = usuarioOpt.get();
        Optional<ResenaVoto> votoExistente = resenaVotoRepository.findByResena_IdAndUsuario_Id(idResena, idUsuario);

        if (votoExistente.isPresent()) {
            ResenaVoto voto = votoExistente.get();
            if (voto.getEsMeGusta() == esMeGusta) {
                // Mismo voto: retirar voto (toggle off)
                resenaVotoRepository.delete(voto);
                if (esMeGusta) {
                    resena.setMeGustas(Math.max(0, resena.getMeGustas() - 1));
                } else {
                    resena.setNoMeGustas(Math.max(0, resena.getNoMeGustas() - 1));
                }
            } else {
                // Voto diferente: cambiar voto
                voto.setEsMeGusta(esMeGusta);
                resenaVotoRepository.save(voto);
                if (esMeGusta) {
                    resena.setMeGustas(resena.getMeGustas() + 1);
                    resena.setNoMeGustas(Math.max(0, resena.getNoMeGustas() - 1));
                } else {
                    resena.setNoMeGustas(resena.getNoMeGustas() + 1);
                    resena.setMeGustas(Math.max(0, resena.getMeGustas() - 1));
                }
            }
        } else {
            // Voto nuevo
            ResenaVoto nuevoVoto = new ResenaVoto();
            nuevoVoto.setResena(resena);
            nuevoVoto.setUsuario(usuario);
            nuevoVoto.setEsMeGusta(esMeGusta);
            resenaVotoRepository.save(nuevoVoto);
            if (esMeGusta) {
                resena.setMeGustas(resena.getMeGustas() + 1);
            } else {
                resena.setNoMeGustas(resena.getNoMeGustas() + 1);
            }
        }

        Resena savedResena = resenaRepository.save(resena);
        ResenaDTO dto = convertToDTO(savedResena);

        // Determina el estado de voto actual del usuario tras la operación
        Optional<ResenaVoto> votoFinal = resenaVotoRepository.findByResena_IdAndUsuario_Id(idResena, idUsuario);
        dto.setVotoUsuarioActual(votoFinal.map(ResenaVoto::getEsMeGusta).orElse(null));

        return Optional.of(dto);
    }

    public Optional<ResenaDTO> updateResena(Long id, ResenaDTO resenaDTO) {
        return resenaRepository.findById(id).map(resena -> {
            if (resenaDTO.getMensaje() != null) {
                resena.setMensaje(resenaDTO.getMensaje());
            }
            if (resenaDTO.getPuntuacion() > 0) {
                resena.setPuntuacion(resenaDTO.getPuntuacion());
            }
            if (resenaDTO.getTieneSpoiler() != null) {
                resena.setTieneSpoiler(resenaDTO.getTieneSpoiler());
            }
            if (resenaDTO.getRevisada() != null) {
                resena.setRevisada(resenaDTO.getRevisada());
            }
            Resena updatedResena = resenaRepository.save(resena);
            return convertToDTO(updatedResena);
        });
    }

    @Transactional
    public boolean deleteResena(Long id) {
        if (resenaRepository.existsById(id)) {
            // 1. Eliminar votos de la reseña
            resenaVotoRepository.deleteByResena_Id(id);
            
            // 2. Eliminar votos de todas las respuestas de esta reseña
            List<com.ratemygame.datamodel.entities.Respuesta> respuestas = respuestaRepository.findByResena_Id(id);
            for (com.ratemygame.datamodel.entities.Respuesta resp : respuestas) {
                respuestaVotoRepository.deleteByRespuesta_Id(resp.getId());
            }
            
            // 3. Eliminar las respuestas de la reseña
            respuestaRepository.deleteByResena_Id(id);

            // 4. Eliminar la reseña
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
        dto.setRevisada(resena.getRevisada());
        dto.setMeGustas(resena.getMeGustas());
        dto.setNoMeGustas(resena.getNoMeGustas());
        dto.setFechaResena(resena.getFechaResena());
        dto.setId_videojuego(resena.getId_videojuego());
        dto.setNombreVideojuego(resena.getNombreVideojuego());
        dto.setFotoVideojuego(resena.getFotoVideojuego());
        if (resena.getUsuario() != null) {
            dto.setId_usuario(resena.getUsuario().getId());
            dto.setNombreUsuario(resena.getUsuario().getUsername());
            dto.setFotoUsuario(resena.getUsuario().getFoto_url());
        }
        return dto;
    }

    public Optional<ResenaDTO> getResenaById(Long id) {
        return resenaRepository.findById(id).map(this::convertToDTO);
    }

    public List<ResenaDTO> getRecentReviews() {
        return resenaRepository.findTop10ByOrderByFechaResenaDescIdDesc().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<ResenaDTO> getResenasARevisar() {
        return resenaRepository.findResenasARevisar().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
}
