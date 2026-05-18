package com.ratemygame.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ratemygame.datamodel.entities.Lista;
import com.ratemygame.datamodel.entities.Usuario;
import com.ratemygame.datamodel.repositories.ListaRepository;
import com.ratemygame.datamodel.repositories.UsuarioRepository;
import com.ratemygame.dtos.ListaDTO;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ListaService {

    @Autowired
    private ListaRepository listaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    // Método para obtener todas las entradas de listas de un usuario.
    public List<ListaDTO> getListasByUsuario(Long usuarioId) {
        return listaRepository.findByUsuario_Id(usuarioId).stream()
                .map(this::convertToDTO)
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
        lista.setId_videojuego(listaDTO.getId_videojuego());
        lista.setUsuario(usuarioOpt.get());

        Lista savedLista = listaRepository.save(lista);
        return Optional.of(convertToDTO(savedLista));
    }

    // Método para eliminar una entrada de lista por su ID.
    public boolean deleteListaItem(Long id) {
        if (listaRepository.existsById(id)) {
            listaRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // Método para convertir una entidad Lista en su DTO de transferencia de datos.
    private ListaDTO convertToDTO(Lista lista) {
        ListaDTO dto = new ListaDTO();
        dto.setId(lista.getId());
        dto.setNombre(lista.getNombre());
        dto.setId_videojuego(lista.getId_videojuego());
        if (lista.getUsuario() != null) {
            dto.setId_usuario(lista.getUsuario().getId());
        }
        return dto;
    }
}
