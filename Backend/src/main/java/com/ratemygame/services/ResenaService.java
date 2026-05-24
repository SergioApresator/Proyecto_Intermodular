package com.ratemygame.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ratemygame.datamodel.entities.Resena;
import com.ratemygame.datamodel.entities.ResenaReporte;
import com.ratemygame.datamodel.entities.ResenaVoto;
import com.ratemygame.datamodel.entities.Usuario;
import com.ratemygame.datamodel.repositories.ResenaRepository;
import com.ratemygame.datamodel.repositories.ResenaReporteRepository;
import com.ratemygame.datamodel.repositories.ResenaVotoRepository;
import com.ratemygame.datamodel.repositories.RespuestaRepository;
import com.ratemygame.datamodel.repositories.RespuestaVotoRepository;

import com.ratemygame.datamodel.repositories.UsuarioRepository;
import com.ratemygame.dtos.ResenaDTO;
import com.ratemygame.datamodel.repositories.VideojuegoRepository;
import com.ratemygame.datamodel.entities.Videojuego;
import com.ratemygame.mapper.ResenaMapper;

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
    private VideojuegoRepository videojuegoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ResenaVotoRepository resenaVotoRepository;

    @Autowired
    private ResenaReporteRepository resenaReporteRepository;

    @Autowired
    private RespuestaRepository respuestaRepository;

    @Autowired
    private RespuestaVotoRepository respuestaVotoRepository;

    @Autowired
    private ResenaMapper resenaMapper;


    // Método para obtener todas las reseñas de un videojuego concreto.
    public List<ResenaDTO> getResenasByVideojuego(Long idVideojuego) {
        return resenaRepository.findByIdVideojuego(idVideojuego).stream()
                .map(resenaMapper::toDTO)
                .collect(Collectors.toList());
    }

    // Método para obtener las reseñas de un juego enriquecidas con el voto y reporte del usuario autenticado.
    public List<ResenaDTO> getResenasByVideojuegoWithVoto(Long idVideojuego, Long idUsuario) {
        return resenaRepository.findByIdVideojuego(idVideojuego).stream()
                .map(resena -> {
                    ResenaDTO dto = resenaMapper.toDTO(resena);
                    Optional<ResenaVoto> voto = resenaVotoRepository.findByResena_IdAndUsuario_Id(resena.getId(),
                            idUsuario);
                    dto.setVotoUsuarioActual(voto.map(ResenaVoto::getEsMeGusta).orElse(null));
                    dto.setReportadoPorUsuarioActual(
                            resenaReporteRepository.findByResena_IdAndUsuario_Id(resena.getId(), idUsuario).isPresent());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    // Método para obtener todas las reseñas escritas por un usuario concreto.
    public List<ResenaDTO> getResenasByUsuario(Long idUsuario) {
        return resenaRepository.findByUsuario_Id(idUsuario).stream()
                .map(resenaMapper::toDTO)
                .collect(Collectors.toList());
    }

    // Método para crear y persistir una nueva reseña con la fecha actual en hora de Madrid.
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
        resena.setReportes(0);
        resena.setFechaResena(LocalDateTime.now(ZoneId.of("Europe/Madrid")));
        Videojuego videojuego = videojuegoRepository.findById(resenaDTO.getId_videojuego())
                .orElseThrow(() -> new RuntimeException("Videojuego no encontrado"));
        resena.setVideojuego(videojuego);
        resena.setUsuario(usuarioOpt.get());

        Resena savedResena = resenaRepository.save(resena);
        return Optional.of(resenaMapper.toDTO(savedResena));
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
                // Mismo voto: retirar voto (desactivar)
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
        ResenaDTO dto = resenaMapper.toDTO(savedResena);

        // Determina el estado de voto actual del usuario tras la operación
        Optional<ResenaVoto> votoFinal = resenaVotoRepository.findByResena_IdAndUsuario_Id(idResena, idUsuario);
        dto.setVotoUsuarioActual(votoFinal.map(ResenaVoto::getEsMeGusta).orElse(null));

        return Optional.of(dto);
    }

    // Método para actualizar el mensaje, puntuación, spoiler o estado de revisión de una reseña.
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
                if (resenaDTO.getRevisada()) {
                    resena.setReportes(0);
                }
            }
            Resena updatedResena = resenaRepository.save(resena);
            return resenaMapper.toDTO(updatedResena);
        });
    }

    @Transactional
    public boolean deleteResena(Long id) {
        if (resenaRepository.existsById(id)) {
            // 1. Eliminar votos de la reseña
            resenaVotoRepository.deleteByResena_Id(id);

            // 2. Eliminar reportes de la reseña
            resenaReporteRepository.deleteByResena_Id(id);
            
            // 3. Eliminar votos de todas las respuestas de esta reseña
            List<com.ratemygame.datamodel.entities.Respuesta> respuestas = respuestaRepository.findByResena_Id(id);
            for (com.ratemygame.datamodel.entities.Respuesta resp : respuestas) {
                respuestaVotoRepository.deleteByRespuesta_Id(resp.getId());
            }
            
            // 4. Eliminar las respuestas de la reseña
            respuestaRepository.deleteByResena_Id(id);

            // 5. Eliminar la reseña
            resenaRepository.deleteById(id);
            return true;
        }
        return false;
    }


    // Método para obtener una reseña concreta por su ID.
    public Optional<ResenaDTO> getResenaById(Long id) {
        return resenaRepository.findById(id).map(resenaMapper::toDTO);
    }

    // Método para obtener las 10 reseñas más recientes para el feed de la página principal.
    public List<ResenaDTO> getRecentReviews() {
        return resenaRepository.findTop10ByOrderByFechaResenaDescIdDesc().stream()
                .map(resenaMapper::toDTO)
                .collect(Collectors.toList());
    }

    // Método para reportar/quitar reporte de una reseña (toggle). Si el usuario ya la reportó, elimina su reporte.
    @Transactional
    public Optional<ResenaDTO> reportarResena(Long idResena, Long idUsuario) {
        Optional<Resena> resenaOpt = resenaRepository.findById(idResena);
        Optional<Usuario> usuarioOpt = usuarioRepository.findById(idUsuario);

        if (!resenaOpt.isPresent() || !usuarioOpt.isPresent()) {
            return Optional.empty();
        }

        Resena resena = resenaOpt.get();
        Usuario usuario = usuarioOpt.get();
        Optional<ResenaReporte> reporteExistente = resenaReporteRepository.findByResena_IdAndUsuario_Id(idResena, idUsuario);

        if (reporteExistente.isPresent()) {
            // Ya reportada: quitar el reporte
            resenaReporteRepository.delete(reporteExistente.get());
            resena.setReportes(Math.max(0, (resena.getReportes() == null ? 0 : resena.getReportes()) - 1));
        } else {
            // No reportada: añadir reporte
            ResenaReporte nuevoReporte = new ResenaReporte();
            nuevoReporte.setResena(resena);
            nuevoReporte.setUsuario(usuario);
            resenaReporteRepository.save(nuevoReporte);
            resena.setReportes(resena.getReportes() == null ? 1 : resena.getReportes() + 1);
        }

        Resena savedResena = resenaRepository.save(resena);
        ResenaDTO dto = resenaMapper.toDTO(savedResena);
        // Tras el toggle, el estado es el inverso del que había
        dto.setReportadoPorUsuarioActual(!reporteExistente.isPresent());
        return Optional.of(dto);
    }

    // Método para obtener las reseñas pendientes de revisión por el administrador.
    public List<ResenaDTO> getResenasARevisar() {
        return resenaRepository.findResenasARevisar().stream()
                .map(resenaMapper::toDTO)
                .collect(Collectors.toList());
    }
}
