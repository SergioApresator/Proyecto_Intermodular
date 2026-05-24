package com.ratemygame.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ratemygame.datamodel.entities.Lista;
import com.ratemygame.datamodel.entities.Usuario;
import com.ratemygame.datamodel.repositories.ListaRepository;
import com.ratemygame.datamodel.repositories.UsuarioRepository;
import com.ratemygame.dtos.ListaDTO;
import com.ratemygame.datamodel.repositories.VideojuegoRepository;
import com.ratemygame.datamodel.entities.Videojuego;
import com.ratemygame.mapper.ListaMapper;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ListaService {

    @Autowired
    private ListaRepository listaRepository;

    @Autowired
    private VideojuegoRepository videojuegoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ListaMapper listaMapper;

    // Método para obtener todas las entradas de listas de un usuario.
    public List<ListaDTO> getListasByUsuario(Long usuarioId) {
        return listaRepository.findByUsuario_Id(usuarioId).stream()
                .map(listaMapper::toDTO)
                .collect(Collectors.toList());
    }

    // Método para añadir un videojuego a una lista del usuario y persistirlo en la base de datos.
    public Optional<ListaDTO> createListaItem(ListaDTO listaDTO) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findById(listaDTO.getId_usuario());
        if (!usuarioOpt.isPresent()) {
            return Optional.empty();
        }

        Lista lista = new Lista();
        lista.setNombre(listaDTO.getNombre());
        Videojuego videojuego = videojuegoRepository.findById(listaDTO.getId_videojuego())
                .orElseThrow(() -> new RuntimeException("Videojuego no encontrado"));
        lista.setVideojuego(videojuego);
        lista.setUsuario(usuarioOpt.get());

        Lista savedLista = listaRepository.save(lista);
        return Optional.of(listaMapper.toDTO(savedLista));
    }

    // Método para eliminar una entrada de lista por su ID.
    public boolean deleteListaItem(Long id) {
        if (listaRepository.existsById(id)) {
            listaRepository.deleteById(id);
            return true;
        }
        return false;
    }

}
