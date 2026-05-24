# RateMyGame 🎮

Este proyecto es una plataforma interactiva de descubrimiento y análisis de videojuegos. Está dividido en dos partes principales:
- **Backend**: Construido con **Java (Spring Boot)** y base de datos **MySQL**.
- **Frontend**: Construido con **Angular** y optimizado con **Server-Side Rendering (SSR)**.

---

## 🚀 Despliegue Rápido con Docker

La forma más sencilla de ejecutar la aplicación completa (Base de datos, Backend, Frontend y phpMyAdmin) en cualquier sistema operativo (Windows, Linux, macOS) es utilizando Docker.

### Requisitos Previos
- Tener instalado **Docker** y **Docker Compose**. ¡No necesitas Node.js, Java ni MySQL localmente!

### Instrucciones de Arranque

1. Abre una terminal en la **carpeta raíz** del proyecto.
2. Ejecuta el siguiente comando para construir y levantar todo el ecosistema en segundo plano:

   ```bash
   docker compose up --build -d
   ```

3. **¡Y listo!** La primera vez que el backend se inicie, detectará de forma inteligente que la base de datos está vacía y la poblará automáticamente con un conjunto de **datos premium de prueba** (usuarios ficticios, listas, reseñas detalladas con spoilers, hilos de comentarios y calificaciones). En reinicios posteriores, el sistema conservará tus datos sin duplicarlos ni borrarlos.

> [!NOTE]  
> **Primer arranque**: La primera vez que ejecutes el comando, la aplicación y la base de datos pueden tardar un poco más de lo habitual en responder (menos de 1 minuto) mientras el *DatabaseSeeder* inserta todos los datos iniciales de prueba en la base de datos.


---

## 🔗 Accesos Rápidos

Una vez levantado el entorno, podrás acceder a los siguientes servicios desde tu navegador:

- 💻 **Aplicación Frontend**: [http://localhost:4200](http://localhost:4200)
- ⚙️ **API del Backend**: [http://localhost:9999/api/usuarios](http://localhost:9999/api/usuarios)
- 🗄️ **Gestión de Base de Datos (phpMyAdmin)**: [http://localhost:8080](http://localhost:8080)

---

## 🛠️ Apagado y Limpieza

Para detener los contenedores y mantener los datos persistidos en el volumen, ejecuta:

```bash
docker compose down
```

Si deseas reiniciar el entorno desde cero borrando todos los datos de la base de datos para volver a sembrar los datos originales:

```bash
docker compose down -v
```
