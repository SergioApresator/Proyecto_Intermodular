package com.ratemygame.datamodel.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ratemygame.datamodel.entities.Usuario;

import java.util.Optional;
import java.util.List;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    
	Optional<Usuario> findByUsername(String username);
	Optional<Usuario> findByEmail(String email);
	Optional<Usuario> findByUsernameOrEmail(String username, String email);
	List<Usuario> findByUsernameContainingIgnoreCase(String username);
}
