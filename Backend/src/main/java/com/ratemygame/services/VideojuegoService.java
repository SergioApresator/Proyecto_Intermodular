package com.ratemygame.services;

import com.ratemygame.datamodel.entities.Videojuego;
import com.ratemygame.datamodel.entities.Genero;
import com.ratemygame.datamodel.entities.Plataforma;
import com.ratemygame.datamodel.repositories.VideojuegoRepository;
import com.ratemygame.datamodel.repositories.VideojuegoSpecification;
import com.ratemygame.dtos.VideojuegoDTO;
import com.ratemygame.mapper.VideojuegoMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
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
public class VideojuegoService {

    @Autowired
    private VideojuegoRepository videojuegoRepository;

    @Autowired
    private VideojuegoMapper videojuegoMapper;

    public Page<VideojuegoDTO> buscarVideojuegos(
            String search, List<String> genres, List<String> tags, List<String> platforms,
            LocalDate startDate, LocalDate endDate, Integer minMetacritic, Integer maxMetacritic,
            Pageable pageable) {

        Specification<Videojuego> spec = Specification.where(VideojuegoSpecification.hasName(search))
                .and(VideojuegoSpecification.hasGenres(genres))
                .and(VideojuegoSpecification.hasTags(tags))
                .and(VideojuegoSpecification.hasPlatforms(platforms))
                .and(VideojuegoSpecification.releasedBetween(startDate, endDate))
                .and(VideojuegoSpecification.metacriticBetween(minMetacritic, maxMetacritic));

        return videojuegoMapper.toDTOPage(videojuegoRepository.findAll(spec, pageable));
    }

    public Optional<VideojuegoDTO> getJuegoDetalles(Long id) {
        return videojuegoRepository.findById(id).map(videojuegoMapper::toDTO);
    }

    // Método para generar el listado de videojuegos en formato PDF vertical premium con estadísticas
    public byte[] exportarVideojuegosAPdf(
            String search, List<String> genres, List<String> tags, List<String> platforms,
            LocalDate startDate, LocalDate endDate, Integer minMetacritic, Integer maxMetacritic) {

        Specification<Videojuego> spec = Specification.where(VideojuegoSpecification.hasName(search))
                .and(VideojuegoSpecification.hasGenres(genres))
                .and(VideojuegoSpecification.hasTags(tags))
                .and(VideojuegoSpecification.hasPlatforms(platforms))
                .and(VideojuegoSpecification.releasedBetween(startDate, endDate))
                .and(VideojuegoSpecification.metacriticBetween(minMetacritic, maxMetacritic));

        List<Videojuego> videojuegos = videojuegoRepository.findAll(spec);

        // --- CÁLCULO DE ESTADÍSTICAS GLOBALES ---
        long totalJuegos = videojuegos.size();
        long totalResenas = 0;
        double sumaValoraciones = 0.0;
        int juegosConValoracion = 0;

        Videojuego mejorValorado = null;
        Videojuego masResenado = null;
        long maxResenas = -1;

        for (Videojuego v : videojuegos) {
            long countRes = v.getResenas() != null 
                    ? v.getResenas().stream().filter(r -> !Boolean.TRUE.equals(r.getEliminada())).count() 
                    : 0;
            totalResenas += countRes;

            if (v.getRating() != null && v.getRating() > 0) {
                sumaValoraciones += v.getRating();
                juegosConValoracion++;
            }

            if (mejorValorado == null || (v.getRating() != null && v.getRating() > mejorValorado.getRating())) {
                mejorValorado = v;
            }

            if (countRes > maxResenas) {
                maxResenas = countRes;
                masResenado = v;
            }
        }

        double valoracionMediaGlobal = juegosConValoracion > 0 ? (sumaValoraciones / juegosConValoracion) : 0.0;

        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4, 36, 36, 45, 45);
            PdfWriter.getInstance(document, out);
            document.open();

            // Definición de fuentes estándar
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 22, new Color(30, 41, 59));
            Font subtitleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, new Color(59, 130, 246));
            Font metaFont = FontFactory.getFont(FontFactory.HELVETICA, 9, new Color(100, 116, 139));
            Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 9, Color.WHITE);
            Font dataFont = FontFactory.getFont(FontFactory.HELVETICA, 8.5f, new Color(51, 65, 85));
            Font dataFontBold = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 8.5f, new Color(30, 41, 59));
            Font cardTitleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 8.5f, new Color(71, 85, 105));
            Font cardValueFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11, new Color(30, 41, 59));

            // Cabecera del Documento
            Paragraph brandPara = new Paragraph("RATE MY GAME", titleFont);
            brandPara.setAlignment(Element.ALIGN_LEFT);
            brandPara.setSpacingAfter(2);
            document.add(brandPara);

            String reportSubtitle = (search != null && !search.trim().isEmpty())
                    ? "REPORTE ESTADÍSTICO DE VIDEOJUEGOS (FILTRADO POR: '" + search.trim().toUpperCase() + "')"
                    : "REPORTE ESTADÍSTICO GLOBAL DE VIDEOJUEGOS";
            Paragraph subtitlePara = new Paragraph(reportSubtitle, subtitleFont);
            subtitlePara.setAlignment(Element.ALIGN_LEFT);
            subtitlePara.setSpacingAfter(10);
            document.add(subtitlePara);

            // Metadatos
            String fechaGen = LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss"));
            Paragraph metaPara = new Paragraph(
                    "Fecha de generación: " + fechaGen + "   |   Total de juegos listados: " + totalJuegos, 
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
            lineTable.setSpacingAfter(15);
            document.add(lineTable);

            // --- BLOQUE DE ESTADÍSTICAS GLOBALES (2 columnas con cards) ---
            PdfPTable statsTable = new PdfPTable(2);
            statsTable.setWidthPercentage(100);
            statsTable.setWidths(new float[]{1.0f, 1.0f});
            statsTable.setSpacingAfter(20);

            Color cardBg = new Color(248, 250, 252); // Slate 50
            Color borderColor = new Color(226, 232, 240); // Slate 200

            // Celda 1: Juegos & Reseñas
            PdfPCell cell1 = new PdfPCell();
            cell1.setBackgroundColor(cardBg);
            cell1.setBorderColor(borderColor);
            cell1.setBorderWidth(1);
            cell1.setPadding(10);
            cell1.addElement(new Paragraph("MÉTRICAS BASE", cardTitleFont));
            cell1.addElement(new Paragraph("Total Videojuegos: " + totalJuegos, dataFontBold));
            cell1.addElement(new Paragraph("Total Reseñas Activas: " + totalResenas, dataFont));
            statsTable.addCell(cell1);

            // Celda 2: Valoración Media
            PdfPCell cell2 = new PdfPCell();
            cell2.setBackgroundColor(cardBg);
            cell2.setBorderColor(borderColor);
            cell2.setBorderWidth(1);
            cell2.setPadding(10);
            cell2.addElement(new Paragraph("VALORACIÓN MEDIA GLOBAL", cardTitleFont));
            cell2.addElement(new Paragraph("★ " + String.format("%.2f", valoracionMediaGlobal) + " / 5.0", cardValueFont));
            cell2.addElement(new Paragraph("Basada en los juegos con reseñas activas.", dataFont));
            statsTable.addCell(cell2);

            // Celda 3: Juego Mejor Valorado
            PdfPCell cell3 = new PdfPCell();
            cell3.setBackgroundColor(cardBg);
            cell3.setBorderColor(borderColor);
            cell3.setBorderWidth(1);
            cell3.setPadding(10);
            cell3.addElement(new Paragraph("JUEGO MEJOR VALORADO", cardTitleFont));
            if (mejorValorado != null) {
                cell3.addElement(new Paragraph(mejorValorado.getName(), dataFontBold));
                cell3.addElement(new Paragraph("Nota media: ★ " + String.format("%.1f", mejorValorado.getRating()), dataFont));
            } else {
                cell3.addElement(new Paragraph("-", dataFont));
            }
            statsTable.addCell(cell3);

            // Celda 4: Juego Más Reseñado
            PdfPCell cell4 = new PdfPCell();
            cell4.setBackgroundColor(cardBg);
            cell4.setBorderColor(borderColor);
            cell4.setBorderWidth(1);
            cell4.setPadding(10);
            cell4.addElement(new Paragraph("JUEGO MÁS POPULAR", cardTitleFont));
            if (masResenado != null && maxResenas > 0) {
                cell4.addElement(new Paragraph(masResenado.getName(), dataFontBold));
                cell4.addElement(new Paragraph(maxResenas + " reseñas de usuarios", dataFont));
            } else {
                cell4.addElement(new Paragraph("-", dataFont));
            }
            statsTable.addCell(cell4);

            document.add(statsTable);

            // Título de la tabla
            Paragraph tableTitle = new Paragraph("DETALLE DE VIDEOJUEGOS", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, new Color(30, 41, 59)));
            tableTitle.setSpacingAfter(8);
            document.add(tableTitle);

            // Tabla de Videojuegos (5 columnas)
            PdfPTable table = new PdfPTable(5);
            table.setWidthPercentage(100);
            // Anchos relativos: ID (0.8), Título (2.5), Lanzamiento (1.2), Reseñas (1.0), Valoración (1.2)
            table.setWidths(new float[]{0.8f, 2.5f, 1.2f, 1.0f, 1.2f});

            // Encabezados
            String[] headers = {"ID", "TÍTULO", "LANZAMIENTO", "RESEÑAS", "VALORACIÓN"};
            Color headerBg = new Color(30, 41, 59); // Slate 800

            for (String header : headers) {
                PdfPCell cell = new PdfPCell(new Phrase(header, headerFont));
                cell.setBackgroundColor(headerBg);
                cell.setBorderColor(borderColor);
                cell.setBorderWidth(1);
                cell.setPadding(8);
                cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
                if ("ID".equals(header) || "RESEÑAS".equals(header) || "VALORACIÓN".equals(header)) {
                    cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                } else {
                    cell.setHorizontalAlignment(Element.ALIGN_LEFT);
                }
                table.addCell(cell);
            }

            // Datos
            boolean oddRow = false;
            Color oddBg = new Color(248, 250, 252);
            Color evenBg = Color.WHITE;

            for (Videojuego v : videojuegos) {
                Color rowBg = oddRow ? oddBg : evenBg;
                oddRow = !oddRow;

                // ID
                PdfPCell cellId = new PdfPCell(new Phrase(String.valueOf(v.getId()), dataFontBold));
                cellId.setBackgroundColor(rowBg);
                cellId.setBorderColor(borderColor);
                cellId.setPadding(6);
                cellId.setHorizontalAlignment(Element.ALIGN_CENTER);
                cellId.setVerticalAlignment(Element.ALIGN_MIDDLE);
                table.addCell(cellId);

                // Título
                PdfPCell cellName = new PdfPCell(new Phrase(v.getName(), dataFontBold));
                cellName.setBackgroundColor(rowBg);
                cellName.setBorderColor(borderColor);
                cellName.setPadding(6);
                cellName.setHorizontalAlignment(Element.ALIGN_LEFT);
                cellName.setVerticalAlignment(Element.ALIGN_MIDDLE);
                table.addCell(cellName);

                // Lanzamiento
                String relDate = v.getReleased() != null 
                        ? v.getReleased().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")) 
                        : "-";
                PdfPCell cellRel = new PdfPCell(new Phrase(relDate, dataFont));
                cellRel.setBackgroundColor(rowBg);
                cellRel.setBorderColor(borderColor);
                cellRel.setPadding(6);
                cellRel.setHorizontalAlignment(Element.ALIGN_LEFT);
                cellRel.setVerticalAlignment(Element.ALIGN_MIDDLE);
                table.addCell(cellRel);

                // Reseñas Count
                long countRes = v.getResenas() != null 
                        ? v.getResenas().stream().filter(r -> !Boolean.TRUE.equals(r.getEliminada())).count() 
                        : 0;
                PdfPCell cellRes = new PdfPCell(new Phrase(String.valueOf(countRes), dataFont));
                cellRes.setBackgroundColor(rowBg);
                cellRes.setBorderColor(borderColor);
                cellRes.setPadding(6);
                cellRes.setHorizontalAlignment(Element.ALIGN_CENTER);
                cellRes.setVerticalAlignment(Element.ALIGN_MIDDLE);
                table.addCell(cellRes);

                // Valoración
                String valText = v.getRating() != null && v.getRating() > 0 
                        ? "★ " + String.format("%.1f", v.getRating()) 
                        : "S/R";
                Font valFont = v.getRating() != null && v.getRating() > 0 
                        ? FontFactory.getFont(FontFactory.HELVETICA_BOLD, 8.5f, new Color(16, 185, 129)) // Green
                        : dataFont;
                PdfPCell cellVal = new PdfPCell(new Phrase(valText, valFont));
                cellVal.setBackgroundColor(rowBg);
                cellVal.setBorderColor(borderColor);
                cellVal.setPadding(6);
                cellVal.setHorizontalAlignment(Element.ALIGN_CENTER);
                cellVal.setVerticalAlignment(Element.ALIGN_MIDDLE);
                table.addCell(cellVal);
            }

            document.add(table);
            document.close();
            return out.toByteArray();
        } catch (IOException e) {
            throw new RuntimeException("Error al generar el PDF de videojuegos", e);
        }
    }

    // Método para generar el listado de videojuegos en formato CSV
    public byte[] exportarVideojuegosACsv(
            String search, List<String> genres, List<String> tags, List<String> platforms,
            LocalDate startDate, LocalDate endDate, Integer minMetacritic, Integer maxMetacritic) {

        Specification<Videojuego> spec = Specification.where(VideojuegoSpecification.hasName(search))
                .and(VideojuegoSpecification.hasGenres(genres))
                .and(VideojuegoSpecification.hasTags(tags))
                .and(VideojuegoSpecification.hasPlatforms(platforms))
                .and(VideojuegoSpecification.releasedBetween(startDate, endDate))
                .and(VideojuegoSpecification.metacriticBetween(minMetacritic, maxMetacritic));

        List<Videojuego> videojuegos = videojuegoRepository.findAll(spec);

        StringBuilder csv = new StringBuilder();
        // UTF-8 BOM
        csv.append("\uFEFF");
        // Cabeceras del CSV: ID;Título;Fecha Lanzamiento;Total Reseñas;Valoración Media;Género;Plataforma
        csv.append("ID;Título;Fecha Lanzamiento;Total Reseñas;Valoración Media;Género;Plataforma\n");

        for (Videojuego v : videojuegos) {
            String relDate = v.getReleased() != null 
                    ? v.getReleased().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")) 
                    : "-";
            long countRes = v.getResenas() != null 
                    ? v.getResenas().stream().filter(r -> !Boolean.TRUE.equals(r.getEliminada())).count() 
                    : 0;
            String valStr = v.getRating() != null && v.getRating() > 0 
                    ? String.format("%.2f", v.getRating()).replace('.', ',') // Para conservar compatibilidad Excel ES
                    : "0,00";

            // Formatear géneros
            String genStr = "-";
            if (v.getGenres() != null && !v.getGenres().isEmpty()) {
                genStr = v.getGenres().stream().map(Genero::getName).collect(Collectors.joining(", "));
            }

            // Formatear plataformas
            String platStr = "-";
            if (v.getParent_platforms() != null && !v.getParent_platforms().isEmpty()) {
                platStr = v.getParent_platforms().stream().map(Plataforma::getName).collect(Collectors.joining(", "));
            }

            csv.append(v.getId()).append(";")
               .append(escapeCsvField(v.getName())).append(";")
               .append(escapeCsvField(relDate)).append(";")
               .append(countRes).append(";")
               .append(valStr).append(";")
               .append(escapeCsvField(genStr)).append(";")
               .append(escapeCsvField(platStr)).append("\n");
        }

        return csv.toString().getBytes(StandardCharsets.UTF_8);
    }

    // Helper para escapar comillas y punto y coma en el CSV
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
