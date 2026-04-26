package com.daw.epickeys.services;

import java.util.List;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Service;

import com.daw.epickeys.dtos.UsuarioDTO;

@Service
public class Servicio {
	
	private final JdbcTemplate jdbc;

    public Servicio(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

 
    private final RowMapper<UsuarioDTO> rowMapper = (rs, rowNum) -> {
        UsuarioDTO usuario = new UsuarioDTO();
        usuario.setId(rs.getInt("id"));
        usuario.setNombre(rs.getString("nombre"));
        usuario.setApellidos(rs.getString("apellidos"));
        usuario.setUsuario(rs.getString("usuario"));
        usuario.setContrasena(rs.getString("contrasena"));
        usuario.setCorreo(rs.getString("correo"));
        return usuario;
    };


    public UsuarioDTO getUsuarioByLogin(String usuario, String contrasena) {
    	return jdbc.queryForObject("SELECT * FROM usuarios WHERE correo = ? and contrasena = ?", rowMapper, usuario, contrasena);
    }

    public void addUsuario(UsuarioDTO usuarioDTO) {
        jdbc.update("INSERT INTO usuarios (nombre, apellidos, usuario, contrasena, correo) VALUES (?, ?, ?, ?, ?)",
        		usuarioDTO.getNombre(),
        		usuarioDTO.getApellidos(),
        		usuarioDTO.getUsuario(),
        		usuarioDTO.getContrasena(),
        		usuarioDTO.getCorreo()
                );
    }


    public void updateUsuario(UsuarioDTO usuarioDTO) {
        jdbc.update("UPDATE usuarios SET nombre = ?, apellidos = ?, usuario = ?, contrasena = ?, correo = ? WHERE id = ?",
        		usuarioDTO.getNombre(),
        		usuarioDTO.getApellidos(),
        		usuarioDTO.getUsuario(),
        		usuarioDTO.getContrasena(),
        		usuarioDTO.getCorreo(),
        		usuarioDTO.getId());
    }


    public void deleteCliente(int id) {
        jdbc.update("DELETE FROM clientes WHERE id = ?", id);
    }

}