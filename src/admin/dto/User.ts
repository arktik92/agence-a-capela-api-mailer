import { IsNotEmpty, IsString } from "class-validator"
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    readonly id: number
    @IsNotEmpty()
    @IsString()
    @Column()
    readonly email: string
    @IsNotEmpty()
    @IsString()
    @Column() 
    readonly password: string
}