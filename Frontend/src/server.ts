import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

/**
 * Aquí se pueden definir endpoints de ejemplo de una API Rest en Express.
 * Descomentar y definir endpoints según sea necesario.
 *
 * Ejemplo:
 * ```ts
 * app.get('/api/{*splat}', (req, res) => {
 *   // Manejar la petición a la API
 * });
 * ```
 */

/**
 * Servir archivos estáticos desde /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Manejar todas las demás peticiones renderizando la aplicación Angular.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Iniciar el servidor si este módulo es el punto de entrada principal, o si se ejecuta mediante PM2.
 * El servidor escucha en el puerto definido por la variable de entorno `PORT`, o en el 4000 por defecto.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Servidor Node Express escuchando en http://localhost:${port}`);
  });
}

/**
 * Manejador de peticiones utilizado por Angular CLI (para el servidor de desarrollo y durante la compilación) o Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
