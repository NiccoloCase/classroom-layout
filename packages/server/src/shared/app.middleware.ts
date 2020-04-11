import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { join } from 'path';
import config from "config";

/**
 * Middleware che si occupa di riconoscere le richieste fatte all'API e quelle
 * invece fatte alla web app.
 * Se il server è in produzione e non è stato richiesto un endpoint dell'API,
 * viene mandato al client la web app di react 
 */
@Injectable()
export class ServeWebAppMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        if (
            // Richiesta diretta all'API
            req.path.indexOf("/api") === 0 ||
            // Server non in produzione
            !config.isProduction
        ) return next();
        // Web App
        res.sendFile(join(process.cwd(), '../web/build/index.html'));
    }
}