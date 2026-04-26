# RateMyGame

Este proyecto está dividido en dos partes principales: el **Backend** construido con Java (Spring Boot) y base de datos MySQL, y el **Frontend** construido con Angular.

A continuación, se detallan las instrucciones para levantar el proyecto completo de manera sencilla usando Docker.

## Instrucciones de Instalación y Arranque

### 1. Levantar el Backend y la Base de Datos

El backend incluye un archivo de configuración de Docker que inicializará la base de datos MySQL y construirá la aplicación Java automáticamente.

1. Abre una terminal.
2. Dirígete a la carpeta del backend:
   ```bash
   cd Backend/ratemygame
   ```
3. Ejecuta el siguiente comando para levantar los contenedores en segundo plano:
   ```bash
   docker-compose up -d --build
   ```
> Esto inicializará la base de datos (puerto `3306`), la interfaz de phpMyAdmin (puerto `8080`) y la API de Spring Boot (puerto `9999`).

---

### 2. Levantar el Frontend

Para interactuar con el proyecto, necesitas levantar el servidor de desarrollo de Angular.

1. Abre una **nueva** terminal.
2. Dirígete a la carpeta del frontend:
   ```bash
   cd Frontend
   ```
3. Instala las dependencias necesarias (sólo la primera vez):
   ```bash
   npm install
   ```
4. Inicia la aplicación de Angular:
   ```bash
   npm start
   ```
> La aplicación estará disponible y corriendo en tu navegador en `http://localhost:4200`.

## Accesos Rápidos
- **Aplicación Frontend**: [http://localhost:4200](http://localhost:4200)
- **API Backend**: [http://localhost:9999/api/usuarios](http://localhost:9999/api/usuarios)
- **Gestión de Base de Datos (phpMyAdmin)**: [http://localhost:8080](http://localhost:8080)
