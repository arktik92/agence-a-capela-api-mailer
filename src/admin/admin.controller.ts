import { Body, Controller, Post, Get, Delete, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { User } from './dto/User';
import { Event } from './dto/Event';
import { AuthGuard } from '@nestjs/passport';

@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) {}

    @Post('register')
    signup(@Body() user: User) {
        return this.adminService.signup(user)
    }

    @Post('login')
    login(@Body() user: User) {
        return this.adminService.login(user)
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('event/create')
    createEvent(@Body() eventDTO: Event) {
        return this.adminService.createEvent(eventDTO)
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('event/read')
    readOne(@Body() id: number) {
        return this.adminService.readOne(id)
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete('event')
    delete(@Body() id: number) {
        return this.adminService.delete(id)
    }
}
