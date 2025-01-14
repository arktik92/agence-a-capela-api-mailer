import { IsNotEmpty } from 'class-validator'

export class CreateMailDTO {
    @IsNotEmpty() 
    readonly name: string
    @IsNotEmpty()
    readonly email: string
    @IsNotEmpty()
    readonly message: string
}
