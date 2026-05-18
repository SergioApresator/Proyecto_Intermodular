package com.ratemygame.datamodel.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ratemygame.datamodel.entities.Usuario;

import java.util.Optional;
import java.util.List;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

	// Consulta para buscar un usuario por su nombre de usuario exacto.
	Optional<Usuario> findByUsername(String username);
	// Consulta para buscar un usuario por su correo electrónico exacto.
	Optional<Usuario> findByEmail(String email);
	// Consulta para buscar un usuario por username o email (usado en el login unificado).
	Optional<Usuario> findByUsernameOrEmail(String username, String email);
	// Consulta para buscar usuarios cuyo username contenga el texto indicado.
	List<Usuario> findByUsernameContainingIgnoreCase(String username);

	// Consulta para buscar usuarios por username o nombre completo de forma insensible a mayúsculas.
	@org.springframework.data.jpa.repository.Query("SELECT u FROM Usuario u WHERE " +
		"LOWER(u.username) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
		"LOWER(CONCAT(u.nombre, ' ', u.apellidos)) LIKE LOWER(CONCAT('%', :query, '%'))")
	List<Usuario> buscarUsuariosGeneral(String query);
}


