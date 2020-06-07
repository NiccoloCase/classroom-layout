import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import config from "@crl/config";

interface EmailRespose {
    success: boolean;
}

@Injectable()
export class EmailService {
    constructor(private readonly mailerService: MailerService) { }

    async sendClassroomId(to: string, id: string): Promise<EmailRespose> {

        try {
            await this.mailerService.sendMail({
                to,
                subject: "ID della tua classe",
                text: `Questo è l'ID della classe che è associata alla tua email: ${id}`,
                template: "sendClassroomId",
                context: { id, link: `http://${config.server.WEB_APP_DOMAIN}/${id}` }
            });
            return { success: true };
        }
        catch (err) {
            console.error(err);
            return { success: false };
        }
    }
}
