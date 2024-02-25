import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { Address } from 'nodemailer/lib/mailer';

type MailOptions = {
  from: Address;
  recipients: Address[];
  placeholder?: Record<string, string>;
  subject: string;
  html: string;
  text?: string;
};

@Injectable()
export class MailService {
  constructor(private readonly configService: ConfigService) {}

  mailTransport() {
    const transport = nodemailer.createTransport({
      host: this.configService.get<string>('EMAIL_HOST'),
      port: this.configService.get<number>('EMAIL_PORT'),
      secure: false,
      auth: {
        user: this.configService.get<string>('PROVIDER_USER'),
        pass: this.configService.get<string>('PROVIDER_PASS'),
      },
    });
    return transport;
  }

  async sendMail(mailOptions: MailOptions): Promise<void> {
    const { recipients, subject, html, from } = mailOptions;
    const transport = this.mailTransport();
    try {
      const result = await transport.sendMail({
        from,
        to: recipients,
        subject,
        html,
      });
      return result;
    } catch (error) {
      console.log(error);
    }
  }
}
