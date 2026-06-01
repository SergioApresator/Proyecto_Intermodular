package com.ratemygame.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.ratemygame.config.JwtService;
import com.ratemygame.config.CustomUserDetails;

import com.ratemygame.datamodel.entities.Usuario;
import com.ratemygame.datamodel.entities.Resena;
import com.ratemygame.datamodel.repositories.*;
import com.ratemygame.dtos.UsuarioDTO;
import com.ratemygame.mapper.UsuarioMapper;

import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.awt.Color;
import com.lowagie.text.Document;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.PdfWriter;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.Element;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ListaRepository listaRepository;

    @Autowired
    private ResenaRepository resenaRepository;

    @Autowired
    private NotificacionRepository notificacionRepository;

    @Autowired
    private ResenaVotoRepository resenaVotoRepository;

    @Autowired
    private RespuestaVotoRepository respuestaVotoRepository;

    @Autowired
    private ResenaReporteRepository resenaReporteRepository;

    @Autowired
    private RespuestaRepository respuestaRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UsuarioMapper usuarioMapper;

    // Método para obtener la lista completa de usuarios registrados en el sistema.
    public List<UsuarioDTO> getAllUsuarios() {
        return usuarioRepository.findAll().stream().map(usuarioMapper::toDTO).collect(Collectors.toList());
    }

    // Método para obtener los datos de un usuario por su ID.
    public Optional<UsuarioDTO> getUsuarioById(Long id) {
        return usuarioRepository.findById(id).map(usuarioMapper::toDTO);
    }

    // Método para autenticar al usuario verificando sus credenciales y generando el token JWT.
    public Optional<UsuarioDTO> login(String identifier, String password) {
        Optional<Usuario> optionalUsuario = usuarioRepository.findByUsernameOrEmail(identifier, identifier);
        if (optionalUsuario.isPresent()) {
            Usuario usuario = optionalUsuario.get();
            if (passwordEncoder.matches(password, usuario.getPassword())) {
                if (Boolean.TRUE.equals(usuario.getBaneado())) {
                    throw new RuntimeException("USUARIO_BANEADO");
                }
                String token = jwtService.generateToken(new CustomUserDetails(usuario));
                UsuarioDTO dto = usuarioMapper.toDTO(usuario);
                dto.setToken(token);
                return Optional.of(dto);
            }
        }
        return Optional.empty();
    }

    // Método para iniciar sesión usando el nombre de usuario como identificador.
    public Optional<UsuarioDTO> loginUsuarioUsername(String username, String password) {
        return login(username, password);
    }

    // Método para iniciar sesión usando el correo electrónico como identificador.
    public Optional<UsuarioDTO> loginUsuarioEmail(String email, String password) {
        return login(email, password);
    }

    // Método para registrar un nuevo usuario encriptando su contraseña y generando su token JWT inicial.
    public UsuarioDTO createUsuario(Usuario usuario) {
        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
        usuario.setEsAdmin(false);
        usuario.setBaneado(false);
        Usuario savedUsuario = usuarioRepository.save(usuario);
        String token = jwtService.generateToken(new CustomUserDetails(savedUsuario));
        UsuarioDTO dto = usuarioMapper.toDTO(savedUsuario);
        dto.setToken(token);
        return dto;
    }

    // Método para actualizar los datos del perfil de un usuario existente.
    public Optional<UsuarioDTO> updateUsuario(Long id, Usuario usuarioDetails) {
        return usuarioRepository.findById(id).map(usuario -> {
            usuario.setNombre(usuarioDetails.getNombre());
            usuario.setApellidos(usuarioDetails.getApellidos());
            usuario.setUsername(usuarioDetails.getUsername());
            usuario.setEmail(usuarioDetails.getEmail());
            if (usuarioDetails.getCorreoReal() != null) {
                usuario.setCorreoReal(usuarioDetails.getCorreoReal());
            }
            if (usuarioDetails.getPassword() != null && !usuarioDetails.getPassword().isEmpty()) {
                usuario.setPassword(passwordEncoder.encode(usuarioDetails.getPassword()));
            }
            if (usuarioDetails.getBiografia() != null) {
                usuario.setBiografia(usuarioDetails.getBiografia());
            }
            if (usuarioDetails.getBaneado() != null) {
                usuario.setBaneado(usuarioDetails.getBaneado());
            }
            Usuario updatedUsuario = usuarioRepository.save(usuario);
            return usuarioMapper.toDTO(updatedUsuario);
        });
    }

    // Alterna el rol de administrador de un usuario (de normal a admin o viceversa)
    public Optional<UsuarioDTO> toggleAdmin(Long id) {
        return usuarioRepository.findById(id).map(usuario -> {
            if (Boolean.TRUE.equals(usuario.getBaneado()) && !Boolean.TRUE.equals(usuario.getEsAdmin())) {
                throw new IllegalArgumentException("No se puede hacer administrador a un usuario baneado.");
            }
            usuario.setEsAdmin(usuario.getEsAdmin() == null ? true : !usuario.getEsAdmin());
            Usuario updatedUsuario = usuarioRepository.save(usuario);
            return usuarioMapper.toDTO(updatedUsuario);
        });
    }

    // Método para actualizar los datos binarios de la foto de perfil en la base de datos.
    public Optional<UsuarioDTO> actualizarFotoDatos(Long id, byte[] fotoDatos, String contentType) {
        return usuarioRepository.findById(id).map(usuario -> {
            usuario.setFotoDatos(fotoDatos);
            usuario.setFotoContentType(contentType);
            return usuarioMapper.toDTO(usuarioRepository.save(usuario));
        });
    }

    // Método para actualizar los datos binarios del banner de portada en la base de datos.
    public Optional<UsuarioDTO> actualizarBannerDatos(Long id, byte[] bannerDatos, String contentType) {
        return usuarioRepository.findById(id).map(usuario -> {
            usuario.setBannerDatos(bannerDatos);
            usuario.setBannerContentType(contentType);
            return usuarioMapper.toDTO(usuarioRepository.save(usuario));
        });
    }

    // Método para obtener la entidad Usuario cruda para servir sus imágenes.
    public Optional<Usuario> getUsuarioEntityById(Long id) {
        return usuarioRepository.findById(id);
    }

    // Método para eliminar un usuario de la base de datos por su ID de forma segura con cascada.
    @Transactional
    public boolean deleteUsuario(Long id) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findById(id);
        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();

            // 1. Eliminar votos realizados por el usuario en comentarios
            respuestaVotoRepository.deleteByUsuario_Id(id);

            // 2. Eliminar votos realizados por el usuario en reseñas
            resenaVotoRepository.deleteByUsuario_Id(id);

            // 3. Eliminar reportes realizados por el usuario
            resenaReporteRepository.deleteByUsuario_Id(id);

            // 4. Eliminar notificaciones recibidas por el usuario
            notificacionRepository.deleteByUsuario_Id(id);

            // 5. Eliminar entradas de listas del usuario
            listaRepository.deleteByUsuario_Id(id);

            // 6. Eliminar comentarios/respuestas escritos por el usuario (y sus votos en cascada)
            respuestaRepository.deleteByUsuario_Id(id);

            // 7. Cargar reseñas escritas por el usuario y borrar sus reportes/notificaciones antes de borrarlas
            List<Resena> resenas = resenaRepository.findByUsuario_Id(id);
            for (Resena resena : resenas) {
                resenaReporteRepository.deleteByResena_Id(resena.getId());
                notificacionRepository.deleteByResena_Id(resena.getId());
                resenaRepository.delete(resena);
            }

            // 8. Eliminar la entidad de usuario
            usuarioRepository.delete(usuario);
            return true;
        }
        return false;
    }

    // Método para comprobar si la contraseña introducida coincide con la del usuario.
    public boolean checkPassword(Long usuarioId, String rawPassword) {
        return usuarioRepository.findById(usuarioId)
                .map(u -> passwordEncoder.matches(rawPassword, u.getPassword()))
                .orElse(false);
    }

    // Método para buscar usuarios cuyo username contenga el texto indicado (búsqueda parcial).
    public List<UsuarioDTO> buscarPorUsername(String username) {
        return usuarioRepository.findByUsernameContainingIgnoreCase(username).stream()
                .map(usuarioMapper::toDTO)
                .collect(Collectors.toList());
    }

    // Método para buscar usuarios por username o nombre completo de forma insensible a mayúsculas.
    public List<UsuarioDTO> buscarUsuariosGeneral(String query) {
        return usuarioRepository.buscarUsuariosGeneral(query).stream()
                .map(usuarioMapper::toDTO)
                .collect(Collectors.toList());
    }

    // Método para generar el listado de usuarios en formato PDF vertical premium
    public byte[] exportarUsuariosAPdf(String query) {
        List<UsuarioDTO> usuarios;
        boolean esBusqueda = query != null && !query.trim().isEmpty();
        if (esBusqueda) {
            usuarios = buscarUsuariosGeneral(query);
        } else {
            usuarios = getAllUsuarios();
        }

        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4, 36, 36, 45, 45);
            PdfWriter.getInstance(document, out);
            document.open();

            // Definición de fuentes utilizando tipos estándar
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 22, new Color(30, 41, 59));
            Font subtitleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, new Color(59, 130, 246));
            Font metaFont = FontFactory.getFont(FontFactory.HELVETICA, 9, new Color(100, 116, 139));
            Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 9, Color.WHITE);
            Font dataFont = FontFactory.getFont(FontFactory.HELVETICA, 9, new Color(51, 65, 85));
            Font dataFontBold = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 9, new Color(30, 41, 59));

            // Cabecera del Documento
            Paragraph brandPara = new Paragraph("RATE MY GAME", titleFont);
            brandPara.setAlignment(Element.ALIGN_LEFT);
            brandPara.setSpacingAfter(2);
            document.add(brandPara);

            String reportSubtitle = esBusqueda 
                ? "REPORTE DE BÚSQUEDA DE USUARIOS (FILTRADO POR: '" + query.trim().toUpperCase() + "')"
                : "REPORTE GLOBAL DE ADMINISTRACIÓN DE USUARIOS";
            Paragraph subtitlePara = new Paragraph(reportSubtitle, subtitleFont);
            subtitlePara.setAlignment(Element.ALIGN_LEFT);
            subtitlePara.setSpacingAfter(10);
            document.add(subtitlePara);

            // Metadatos
            String fechaGen = LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss"));
            Paragraph metaPara = new Paragraph(
                "Fecha de generación: " + fechaGen + "   |   Total de registros: " + usuarios.size(), 
                metaFont
            );
            metaPara.setAlignment(Element.ALIGN_LEFT);
            metaPara.setSpacingAfter(15);
            document.add(metaPara);

            // Línea decorativa separatoria
            PdfPTable lineTable = new PdfPTable(1);
            lineTable.setWidthPercentage(100);
            PdfPCell lineCell = new PdfPCell(new Phrase(""));
            lineCell.setBorder(PdfPCell.BOTTOM);
            lineCell.setBorderWidth(1.5f);
            lineCell.setBorderColor(new Color(226, 232, 240)); // Slate 200
            lineCell.setPadding(0);
            lineTable.addCell(lineCell);
            lineTable.setSpacingAfter(20);
            document.add(lineTable);

            // Tabla de Usuarios (5 columnas)
            PdfPTable table = new PdfPTable(5);
            table.setWidthPercentage(100);
            // Anchos relativos: ID (1.0), Username (2.2), Nombre Completo (3.0), Email (3.5), Situación (2.3)
            table.setWidths(new float[]{1.0f, 2.2f, 3.0f, 3.5f, 2.3f});
            table.setSpacingBefore(10);

            // Encabezados de la Tabla
            String[] headers = {"ID", "USERNAME", "NOMBRE COMPLETO", "EMAIL", "SITUACIÓN"};
            Color headerBg = new Color(30, 41, 59); // Slate 800
            Color borderColor = new Color(226, 232, 240); // Slate 200

            for (String header : headers) {
                PdfPCell cell = new PdfPCell(new Phrase(header, headerFont));
                cell.setBackgroundColor(headerBg);
                cell.setBorderColor(borderColor);
                cell.setBorderWidth(1);
                cell.setPadding(8);
                cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
                if ("ID".equals(header) || "SITUACIÓN".equals(header)) {
                    cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                } else {
                    cell.setHorizontalAlignment(Element.ALIGN_LEFT);
                }
                table.addCell(cell);
            }

            // Datos de la Tabla
            boolean oddRow = false;
            Color oddBg = new Color(248, 250, 252); // Slate 50
            Color evenBg = Color.WHITE;

            Color bannedColor = new Color(239, 68, 68); // Red 500
            Color adminColor = new Color(59, 130, 246);  // Blue 500
            Color activeColor = new Color(16, 185, 129); // Green 500

            for (UsuarioDTO u : usuarios) {
                Color rowBg = oddRow ? oddBg : evenBg;
                oddRow = !oddRow;

                // ID
                PdfPCell cellId = new PdfPCell(new Phrase(String.valueOf(u.getId()), dataFontBold));
                cellId.setBackgroundColor(rowBg);
                cellId.setBorderColor(borderColor);
                cellId.setPadding(7);
                cellId.setHorizontalAlignment(Element.ALIGN_CENTER);
                cellId.setVerticalAlignment(Element.ALIGN_MIDDLE);
                table.addCell(cellId);

                // Username
                PdfPCell cellUser = new PdfPCell(new Phrase(u.getUsername(), dataFontBold));
                cellUser.setBackgroundColor(rowBg);
                cellUser.setBorderColor(borderColor);
                cellUser.setPadding(7);
                cellUser.setHorizontalAlignment(Element.ALIGN_LEFT);
                cellUser.setVerticalAlignment(Element.ALIGN_MIDDLE);
                table.addCell(cellUser);

                // Nombre Completo
                String fullNm = (u.getNombre() != null ? u.getNombre() : "") + " " + (u.getApellidos() != null ? u.getApellidos() : "");
                fullNm = fullNm.trim();
                PdfPCell cellName = new PdfPCell(new Phrase(fullNm.isEmpty() ? "-" : fullNm, dataFont));
                cellName.setBackgroundColor(rowBg);
                cellName.setBorderColor(borderColor);
                cellName.setPadding(7);
                cellName.setHorizontalAlignment(Element.ALIGN_LEFT);
                cellName.setVerticalAlignment(Element.ALIGN_MIDDLE);
                table.addCell(cellName);

                // Email
                PdfPCell cellEmail = new PdfPCell(new Phrase(u.getEmail() != null ? u.getEmail() : "-", dataFont));
                cellEmail.setBackgroundColor(rowBg);
                cellEmail.setBorderColor(borderColor);
                cellEmail.setPadding(7);
                cellEmail.setHorizontalAlignment(Element.ALIGN_LEFT);
                cellEmail.setVerticalAlignment(Element.ALIGN_MIDDLE);
                table.addCell(cellEmail);

                // Situación
                String sitText = "Usuario Activo";
                Font sitFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 8.5f, activeColor);

                if (Boolean.TRUE.equals(u.getBaneado())) {
                    sitText = "Baneado";
                    sitFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 8.5f, bannedColor);
                } else if (Boolean.TRUE.equals(u.getEsAdmin())) {
                    sitText = "Administrador";
                    sitFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 8.5f, adminColor);
                }

                PdfPCell cellSit = new PdfPCell(new Phrase(sitText, sitFont));
                cellSit.setBackgroundColor(rowBg);
                cellSit.setBorderColor(borderColor);
                cellSit.setPadding(7);
                cellSit.setHorizontalAlignment(Element.ALIGN_CENTER);
                cellSit.setVerticalAlignment(Element.ALIGN_MIDDLE);
                table.addCell(cellSit);
            }

            document.add(table);
            document.close();
            return out.toByteArray();
        } catch (IOException e) {
            throw new RuntimeException("Error al generar el PDF de usuarios", e);
        }
    }

    // Método para generar el listado de usuarios en formato CSV
    public byte[] exportarUsuariosACsv(String query) {
        List<UsuarioDTO> usuarios;
        if (query != null && !query.trim().isEmpty()) {
            usuarios = buscarUsuariosGeneral(query);
        } else {
            usuarios = getAllUsuarios();
        }

        StringBuilder csv = new StringBuilder();
        // UTF-8 BOM para que Excel detecte tildes automáticamente al hacer doble clic
        csv.append("\uFEFF");
        // Cabeceras del CSV
        csv.append("ID;Username;Nombre Completo;Email;Situación\n");

        for (UsuarioDTO u : usuarios) {
            String fullNm = (u.getNombre() != null ? u.getNombre() : "") + " " + (u.getApellidos() != null ? u.getApellidos() : "");
            fullNm = fullNm.trim();

            String sitText = "Usuario Activo";
            if (Boolean.TRUE.equals(u.getBaneado())) {
                sitText = "Baneado";
            } else if (Boolean.TRUE.equals(u.getEsAdmin())) {
                sitText = "Administrador";
            }

            csv.append(u.getId()).append(";")
               .append(escapeCsvField(u.getUsername())).append(";")
               .append(escapeCsvField(fullNm.isEmpty() ? "-" : fullNm)).append(";")
               .append(escapeCsvField(u.getEmail() != null ? u.getEmail() : "-")).append(";")
               .append(escapeCsvField(sitText)).append("\n");
        }

        return csv.toString().getBytes(StandardCharsets.UTF_8);
    }

    // Helper para escapar caracteres especiales de CSV (comillas y punto y coma)
    private String escapeCsvField(String field) {
        if (field == null) {
            return "";
        }
        if (field.contains(";") || field.contains("\"") || field.contains("\n")) {
            return "\"" + field.replace("\"", "\"\"") + "\"";
        }
        return field;
    }
}
