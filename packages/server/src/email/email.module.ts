import { Module } from '@nestjs/common';
import { join } from "path";
import { EmailService } from './email.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import config from "@crl/config";

@Module({
    imports: [
        MailerModule.forRoot({
            transport: {
                host: 'in-v3.mailjet.com',
                port: 587,
                ignoreTLS: true,
                secure: false,
                auth: {
                    user: config.emailService.USER,
                    pass: config.emailService.PASSWORD
                },
            },
            defaults: {
                from: `"${config.APP_NAME}" <${config.emailService.SENDER}>`,
            },
            template: {

                dir: join(__dirname, '..', '..', 'templates'),
                adapter: new HandlebarsAdapter(),
                options: {
                    strict: true,
                },
            },
        }),
    ],
    providers: [EmailService],
    exports: [EmailService]
})
export class EmailModule { }