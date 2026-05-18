package com.ratemygame.datamodel.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ratemygame.datamodel.entities.ResenaVoto;

import java.util.Optional;

@Repository
public interface ResenaVotoRepository extends JpaRepository<ResenaVoto, Long> {
    Optional<ResenaVoto> findByResena_IdAndUsuario_Id(Long idResena, Long idUsuario);
    void deleteByResena_Id(Long idResena);

}
