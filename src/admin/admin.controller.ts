import { Body, Controller, Post, Get, Delete } from '@nestjs/common';
import { AdminService } from './admin.service';
import { User } from './dto/User';
import { Event } from './dto/Event';

@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) {}

    @Post('login')
    login(@Body() user: User) {
        return this.adminService.login(user)
    }

    @Post('event/create')
    createEvent(@Body() eventDTO: Event) {
        return this.adminService.createEvent(eventDTO)
    }

    @Post('event/read')
    readOne(@Body() id: number) {
        return this.adminService.readOne(id)
    }

    @Get('event/read')
    readAll() {
        return this.adminService.readAll()
    }

    @Delete('event')
    delete(@Body() id: number) {
        return this.adminService.delete(id)
    }
}
