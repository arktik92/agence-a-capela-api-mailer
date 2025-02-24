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

    async signup(user: User): Promise<{data: string}> {
        const userDTO = await this.usersRepository.findOneBy({email: user.email})

        if (userDTO) throw new UnauthorizedException('This email is already registered')

        const saltRounds = 10
        const salt = await bcrypt.genSalt(saltRounds)
        
        console.log("password to hash: ", user.password);
        
        const hashedPassword = await bcrypt.hash(user.password, salt)
        console.log("hashedPassword:", hashedPassword)

        const newUser = this.usersRepository.create({
            email: user.email,
            password: hashedPassword
        })

        await this.usersRepository.save(newUser)
        

        return {data: "User succesfully created"}

    }

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

    async createEvent(event: Event): Promise<{data: string}> {
        // Add Images
        const {title, description, image} = event

        const newEvent = this.eventRepository.create({
            title,
            description,
            image
        }) 

        await this.eventRepository.save(event)


        return {data: "Event was created successfuly"}
    }

    async readOne(id: number): Promise<Event> {
        return this.eventRepository.findOneBy({id})
    }

    async readAll(): Promise<Event[]> {
        return this.eventRepository.find()
    }

    async delete(id: number): Promise<{data: string}> {
        await this.eventRepository.delete(id)
        return { data: "Event was deleted successfuly"}
    }
}
