package com.ratemygame.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String remitente;

    // Envía una notificación de moderación al usuario de forma asíncrona (segundo plano).
    @Async
    public void enviarEmailModeracion(String destinatario, String username, String accion, String videojuegoTitulo, String reseñaTexto) {
        if (mailSender == null) {
            System.err.println("ERROR: JavaMailSender no está configurado. No se puede enviar el correo.");
            return;
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(remitente, "RateMyGame Moderación");
            helper.setTo(destinatario);
            helper.setSubject("Aviso de Moderación: Tu reseña de " + videojuegoTitulo);

            // Generar plantilla HTML estilizada y moderna
            String htmlContent = buildHtmlTemplate(username, accion, videojuegoTitulo, reseñaTexto);
            helper.setText(htmlContent, true);

            mailSender.send(message);
            System.out.println("Correo electrónico enviado con éxito a: " + destinatario);

        } catch (Exception e) {
            System.err.println("Error crítico al intentar enviar el email a " + destinatario + ": " + e.getMessage());
            e.printStackTrace();
        }
    }

    // Método privado para generar una plantilla de email con estética premium, colores suaves y diseño moderno.
    private String buildHtmlTemplate(String username, String accion, String videojuegoTitulo, String reseñaTexto) {
        String colorAccion = "#4F46E5"; // Azul premium por defecto (Spoiler)
        String textoAccion = "";

        if ("SPOILER_MARCADO".equals(accion)) {
            colorAccion = "#F59E0B"; // Ámbar/Naranja (Spoiler)
            textoAccion = "ha sido MARCADA con la etiqueta de SPOILER por un administrador de la comunidad.";
        } else if ("SPOILER_DESMARCADO".equals(accion)) {
            colorAccion = "#F59E0B"; // Ámbar/Naranja (Spoiler)
            textoAccion = "ha sido DESMARCADA como SPOILER por un administrador.";
        } else if ("ELIMINADA".equals(accion)) {
            colorAccion = "#EF4444"; // Rojo (Eliminada)
            textoAccion = "ha sido eliminada lógicamente por un moderador debido al incumplimiento de las normas de convivencia.";
        }

        return "<!DOCTYPE html>" +
               "<html>" +
               "<head>" +
               "  <meta charset='utf-8'>" +
               "  <style>" +
               "    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f3f4f6; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }" +
               "    .container { max-width: 600px; margin: 30px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1); border: 1px solid #e5e7eb; }" +
               "    .header { background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%); color: #ffffff; padding: 40px 30px; text-align: center; position: relative; }" +
               "    .header h1 { margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px; text-shadow: 0 2px 4px rgba(0,0,0,0.15); }" +
               "    .header p { margin: 10px 0 0 0; color: #c7d2fe; font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 1.5px; }" +
               "    .badge { display: inline-block; padding: 6px 16px; border-radius: 9999px; background-color: " + colorAccion + "; color: #ffffff; font-weight: 700; font-size: 12px; margin-top: 15px; text-transform: uppercase; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }" +
               "    .content { padding: 45px 35px 35px 35px; color: #374151; line-height: 1.6; }" +
               "    .greeting { font-size: 18px; font-weight: 700; color: #111827; margin-bottom: 20px; }" +
               "    .text-intro { font-size: 15px; margin-bottom: 30px; }" +
               "    .quote-box { background-color: #f9fafb; border-left: 4px solid " + colorAccion + "; border-radius: 4px 12px 12px 4px; padding: 25px; margin: 30px 0; font-style: italic; color: #4b5563; position: relative; box-shadow: inset 0 2px 4px rgba(0,0,0,0.02); }" +
               "    .quote-box strong { font-style: normal; color: #111827; display: block; margin-bottom: 8px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; }" +
               "    .footer { background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #f3f4f6; color: #9ca3af; font-size: 12px; }" +
               "    .footer a { color: #4f46e5; text-decoration: none; font-weight: 600; }" +
               "    .footer a:hover { text-decoration: underline; }" +
               "    .socials { margin-top: 15px; font-size: 14px; }" +
               "  </style>" +
               "</head>" +
               "<body>" +
               "  <div class='container'>" +
               "    <div class='header'>" +
               "      <p>Notificaciones de Moderación</p>" +
               "      <h1>RateMyGame</h1>" +
               "      <span class='badge'>" + accion.replace("_", " ") + "</span>" +
               "    </div>" +
               "    <div class='content'>" +
               "      <div class='greeting'>¡Hola, " + username + "!</div>" +
               "      <p class='text-intro'>Te escribimos para informarte de que tu reseña sobre el videojuego <strong>" + videojuegoTitulo + "</strong> " + textoAccion + "</p>" +
               "      <div class='quote-box'>" +
               "        <strong>Reseña afectada:</strong>" +
               "        \"" + (reseñaTexto.length() > 250 ? reseñaTexto.substring(0, 247) + "..." : reseñaTexto) + "\"" +
               "      </div>" +
               "      <p class='text-intro'>Si tienes cualquier duda sobre las directrices de la comunidad de RateMyGame, puedes revisar nuestras Normas de Convivencia dentro de la aplicación.</p>" +
               "    </div>" +
               "    <div class='footer'>" +
               "      <p>© 2026 RateMyGame. Todos los derechos reservados.</p>" +
               "      <p>Este correo electrónico se ha generado automáticamente. Por favor, no respondas a este mensaje.</p>" +
               "      <div class='socials'>" +
               "        <a href='http://localhost:4200'>Ir a la Aplicación</a>" +
               "      </div>" +
               "    </div>" +
               "  </div>" +
               "</body>" +
               "</html>";
    }
}
