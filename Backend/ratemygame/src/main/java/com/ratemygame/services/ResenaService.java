package com.ratemygame.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ratemygame.datamodel.entities.Resena;
import com.ratemygame.datamodel.entities.ResenaVoto;
import com.ratemygame.datamodel.entities.Usuario;
import com.ratemygame.datamodel.repositories.ResenaRepository;
import com.ratemygame.datamodel.repositories.ResenaVotoRepository;
import com.ratemygame.datamodel.repositories.UsuarioRepository;
import com.ratemygame.dtos.ResenaDTO;

import jakarta.transaction.Transactional;

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

    @Autowired
    private ResenaVotoRepository resenaVotoRepository;

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

        // Determine the user's current vote state after operation
        Optional<ResenaVoto> votoFinal = resenaVotoRepository.findByResena_IdAndUsuario_Id(idResena, idUsuario);
        dto.setVotoUsuarioActual(votoFinal.map(ResenaVoto::getEsMeGusta).orElse(null));

        return Optional.of(dto);
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
            dto.setNombreUsuario(resena.getUsuario().getUsername());
            dto.setFotoUsuario(resena.getUsuario().getFoto_url());
        }
        return dto;
    }
}
