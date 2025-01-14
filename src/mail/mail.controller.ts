import { Body, Controller, Post } from '@nestjs/common';
import { MailService } from './mail.service';
import { CreateMailDTO } from './dto/CreateMailDTO';

@Controller('mail')
export class MailController {
    constructor(private readonly mailService: MailService) {}

    // Recuperer message depuis frontend
    @Post("to")
    send(@Body() createMailDTO: CreateMailDTO) {
        console.log(createMailDTO)
        return this.mailService.send(createMailDTO)
    }
}
