package com.ratemygame.datamodel.repositories;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ratemygame.datamodel.entities.Lista;

@Repository
public interface ListaRepository extends JpaRepository<Lista, Long> {
    // Consulta para obtener todas las entradas de lista de un usuario concreto.
    List<Lista> findByUsuario_Id(Long usuarioId);

    // Consulta para eliminar todas las entradas de lista de un usuario.
    void deleteByUsuario_Id(Long usuarioId);
}
