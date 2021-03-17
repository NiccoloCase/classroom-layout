import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { join } from 'path';

@Injectable()
export class ServeHTMLMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: () => void) {
        /*  // Richiesta diretta all'API
         if (req.path.includes('graphql')) return next();
         // change the path to the correct html page path in your project
         res.sendFile(join(process.cwd(), '../web/build/index.html')); */

        const { url } = req;
        if (url.indexOf('/api') === 1) {
            next();
        } else {
            const root = join(process.cwd(), '..', 'web/build/')
            res.sendFile('index.html', { root })
        }
    }
}