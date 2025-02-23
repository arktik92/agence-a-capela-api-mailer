import { Injectable, UnauthorizedException } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { PassportStrategy } from "@nestjs/passport"
import { InjectRepository } from "@nestjs/typeorm"
import { ExtractJwt, Strategy } from "passport-jwt"
import { Repository } from "typeorm"
import { User } from "./dto/User"

type Payload = {
    sub: number, 
    email: string
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
        configService: ConfigService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get("JWT_SECRET"),
            ignoreExpiration: false
        })
    }

    async validate(payload: Payload) {
        const user = this.usersRepository.findOneBy({email: payload.email})
        if (!user) throw new UnauthorizedException('Unauthorized')
        Reflect.deleteProperty(user, "password")
        return user
    }
}