package com.daw.epickeys.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.daw.epickeys.dtos.UsuarioDTO;
import com.daw.epickeys.services.Servicio;

@CrossOrigin(origins = "*") 
@RestController
@RequestMapping("/api/usuarios")
public class Controlador {
	
	@Autowired
	private Servicio servicio;
	
	@GetMapping({"/buscarUsuarioPorLogin"})
	public ResponseEntity<UsuarioDTO> buscarUsuarioPorLogin(@RequestParam String usuario, String contrasena) {
		return ResponseEntity.ok().body(servicio.getUsuarioByLogin(usuario, contrasena));
    }

	@PostMapping("/crearUsuario")
	public ResponseEntity<String> crearUsuario(@RequestBody UsuarioDTO usuarioDTO) {
		servicio.addUsuario(usuarioDTO);
		return ResponseEntity.ok().body("Ok");
    }
	
	@PutMapping("/actualizarUsuario")
	public ResponseEntity<String> actualizarUsuario(@RequestBody UsuarioDTO usuarioDTO) {
		servicio.updateUsuario(usuarioDTO);
		return ResponseEntity.ok().body("Ok");
    }
	
}
