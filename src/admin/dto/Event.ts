import { IsNotEmpty, IsString } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Event {
    @PrimaryGeneratedColumn()
    readonly id: number

    @Column()
    @IsNotEmpty()
    @IsString()
    readonly title: string

    @Column()
    @IsNotEmpty()
    @IsString()
    readonly description: string

    // Remettre bon type pour les photos
    @Column()
    readonly image: string

}