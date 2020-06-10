import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import config from "@crl/config";
import { ProcessResult } from '../graphql';


@Injectable()
export class EmailService {
    constructor(private readonly mailerService: MailerService) { }

    async sendClassroomId(to: string, id: string): Promise<ProcessResult> {
        try {
            await this.mailerService.sendMail({
                to,
                subject: "ID della tua classe",
                text: `Questo è l'ID della classe che è associata alla tua email: ${id}`,
                template: "classroomIdEmail",
                context: { id, link: `http://${config.server.WEB_APP_DOMAIN}/${id}` }
            });
            return { success: true };
        }
        catch (err) {
            console.error(err);
            return { success: false };
        }
    }

    /**
     *  Spedisce via emial il token per eliminare una classe
     */
    async sendPurgeToken(to: string, token: string, classroomName: string): Promise<ProcessResult> {
        try {
            await this.mailerService.sendMail({
                to,
                subject: `Autorizza l'eliminazione della classe associata a questa email`,
                text: `Sembra che hai richiesto l'eliminazione della classe ${classroomName}. Ecco il codice per autorizzare questa operazione: ${token}`,
                template: "purgeTokenEmail",
                context: { token, classroomName }
            });
            return { success: true };
        }
        catch (err) {
            console.error(err);
            return { success: false };
        }
    }
}
