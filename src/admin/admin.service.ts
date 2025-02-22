import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { User} from './dto/User';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './dto/Event';

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
        @InjectRepository(Event)
        private readonly eventRepository: Repository<Event>,   
        private readonly configService: ConfigService
    ) {}

    async login(user: User): Promise<string> {
        const userDTO = await this.usersRepository.findOneBy({email: user.email})
        
        if (!user) {
            throw new NotFoundException
        }
        
        // TODO: - verifier pwd avec bcrypt
        if (userDTO.password !== user.password) throw new UnauthorizedException('Passwords doesn\'t match')

        // TODO creer et retourner token avec jwt
        const payload = {
            id: user.id,
            email: user.email, 
        }

        return `success`
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
