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
        /* Search if email exist */
        const userDTO = await this.usersRepository.findOneBy({email: user.email})
        if (userDTO) throw new UnauthorizedException('This email is already registered')
        /* Hash password */
        const saltRounds = 10
        const salt = await bcrypt.genSalt(saltRounds)
        const hashedPassword = await bcrypt.hash(user.password, salt)
        /* Create new User */
        const newUser = this.usersRepository.create({
            email: user.email,
            password: hashedPassword
        })
        /* Save new User in DB*/
        await this.usersRepository.save(newUser)
        /* return message */
        return {data: "User succesfully created"}

    }

    async login(user: User): Promise<{data: string}> {
        /* Search User to connect */
        const userDTO = await this.usersRepository.findOneBy({email: user.email})
        if (!user) {
            throw new NotFoundException
        }
        /* Check if passwords matches */        
        const match = await bcrypt.compare(user.password, userDTO.password)
        if (!match) throw new UnauthorizedException('Passwords doesn\'t match')
        /* Create token */
        const payload = {
            sub: user.id,
            email: user.email, 
        }
        const token = this.jwtService.sign(payload, {
            expiresIn: "24h",
            secret: this.configService.get("JWT_SECRET")
        })
        /* Return Token */
        return {data: token}
    }

    async createEvent(event: Event): Promise<{data: string}> {
        // TODO: - Add Images

        /* Create new Event */
        const newEvent = this.eventRepository.create({
            title: event.title,
            description: event.description,
            image: event.image
        }) 
        /* Save Event */
        await this.eventRepository.save(event)
        /* Return message */
        return {data: "Event was created successfuly"}
    }

    async readOne(id: number): Promise<Event> {
        /* Find & return one event */
        return this.eventRepository.findOneBy({id})
    }

    async delete(id: number): Promise<{data: string}> {
        /* Delete event in DB */
        await this.eventRepository.delete(id)
        /* Return message */
        return { data: "Event was deleted successfuly"}
    }
}
