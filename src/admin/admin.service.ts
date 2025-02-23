import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { User} from './dto/User';
import * as bcrypt from "bcrypt";
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './dto/Event';
import { JwtService } from "@nestjs/jwt"

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
        @InjectRepository(Event)
        private readonly eventRepository: Repository<Event>,   
        private readonly configService: ConfigService, 
        private readonly jwtService: JwtService
    ) {}

    async login(user: User): Promise<{data: string}> {
        const userDTO = await this.usersRepository.findOneBy({email: user.email})
        
        if (!user) {
            throw new NotFoundException
        }
        
        // TODO: - verifier pwd avec bcrypt
        console.log(user.password);
        console.log(userDTO.password);
        
        const match = await bcrypt.compare(user.password, userDTO.password)
        console.log(match);
        
        if (!match) throw new UnauthorizedException('Passwords doesn\'t match')

        // TODO creer et retourner token avec jwt
        const payload = {
            sub: user.id,
            email: user.email, 
        }

        const token = this.jwtService.sign(payload, {
            expiresIn: "24h",
            secret: this.configService.get("JWT_SECRET")
        })

        return {data: token}
    }

    async createEvent(event: Event): Promise<void> {
        // Add Images
        const {title, description, image} = event

        this.eventRepository.create({
            title,
            description,
            image
        }) 
    }

    async readOne(id: number): Promise<Event> {
        return this.eventRepository.findOneBy({id})
    }

    async readAll(): Promise<Event[]> {
        return this.eventRepository.find()
    }

    async delete(id: number): Promise<void> {
        await this.eventRepository.delete(id)
    }
}
