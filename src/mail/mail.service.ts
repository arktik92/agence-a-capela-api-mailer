import { Injectable } from '@nestjs/common';
import { CreateMailDTO } from './dto/CreateMailDTO';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
    constructor(private readonly configService: ConfigService) {}

    private async transporter() {
        const tranport = nodemailer.createTransport({
            host: this.configService.get("SMTP_HOST"),
            port: 587,
            secure: false, 
            auth: {
                user: this.configService.get("SMTP_USER"),
                pass: this.configService.get("SMTP_PASS")
            }
        })
        return tranport
    }

    async send(createMailDTO: CreateMailDTO) {

        const htmlContent = `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; padding: 20px; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
            <h2 style="text-align: center; color: #4CAF50;">Nouveau Message de ${createMailDTO.name}</h2>
            <p style="margin: 0; padding: 10px 0; font-size: 16px;">
                <strong>Nom :</strong> ${createMailDTO.name}
            </p>
            <p style="margin: 0; padding: 10px 0; font-size: 16px;">
                <strong>Email :</strong> ${createMailDTO.email}
            </p>
            <p style="margin: 0; padding: 10px 0; font-size: 16px;">
                <strong>Sujet :</strong> ${createMailDTO.subject}
            </p>
            <p style="margin: 0; padding: 10px 0; font-size: 16px;">
                <strong>Message :</strong>
            </p>
            <blockquote style="margin: 10px 0; padding: 15px; font-size: 16px; background-color: #e8f5e9; border-left: 5px solid #4CAF50; border-radius: 4px;">
                ${createMailDTO.message}
            </blockquote>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />
            <footer style="text-align: center; color: #666; font-size: 14px;">
                <p>Ce message vous a été envoyé depuis <a href="https://agenceacapela.fr" style="color: #4CAF50; text-decoration: none;">arktik-dev.com</a>.</p>
            </footer>
        </div>
    `;

        (await this.transporter()).sendMail({
            from: "contact@arktik-dev.com",
            to: this.configService.get("SMTP_USER"),
            subject: `${createMailDTO.name} souhaite vous contacter`,
            html: htmlContent,
        })
    }
}
