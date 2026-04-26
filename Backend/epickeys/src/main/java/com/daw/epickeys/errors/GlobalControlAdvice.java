package com.daw.epickeys.errors;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import jakarta.servlet.http.HttpServletRequest;

@RestControllerAdvice
public class GlobalControlAdvice {


	@ExceptionHandler(Exception.class)
	public ResponseEntity<ApiError> handlerException(Exception ex, HttpServletRequest req) {
		StringWriter sw = new StringWriter();
		PrintWriter pw = new PrintWriter(sw);
		ex.printStackTrace(pw);
		String stackTraceAsString = sw.toString();
		ApiError error = new ApiError();
		error.setEstado(HttpStatus.INTERNAL_SERVER_ERROR.toString());
		error.setFecha(LocalDateTime.now());
		error.setMensaje(stackTraceAsString);
		error.setPath(req.getServletPath());
		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
	}
}
