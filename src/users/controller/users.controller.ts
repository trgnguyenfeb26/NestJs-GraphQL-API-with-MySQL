import { Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { UpdateUserInput } from '../dto/update-user.input';
import { UsersResolver } from '../resolver/users.resolver';
import { UsersService } from '../service/users.service';


@Controller('/users')
export class UsersController {
    constructor(private usersResolver: UsersResolver) { }


    @Put(':id')
    async updateUser(
        @Param('id') id: UpdateUserInput,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        try {
            console.log(req.body);
            const updatedUser = await this.usersResolver.updateUser(id, req.body.name, req.body.username, req.body.password, req.body.isAdmin);
            res.status(200).json(updatedUser);
        } catch (error) {
            res.status(500).json(error);
        }
    }

    @Get(':id')
    async getUser(
        @Param('id') id: number,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        try {
            const user = await this.usersResolver.findOne(id);
            const { password, ...result } = user;
            res.status(200).send(result);
        } catch (error) {
            res.status(500).json(error)
        }
    }


    @Get('')
    // @UseGuards(JwtAuthGuard)
    async getUserAll(
        @Res() res: Response,
    ) {
        try {
            const user = await this.usersResolver.findAll();
            res.status(200).send(user);
        } catch (error) {
            res.status(500).json(error)
        }
    }

    @Delete(':id')
    async deleteUser(
        @Param('id') id: number,
        @Res() res: Response,
    ) {
        try {
            await this.usersResolver.removeUser(id);
            res.status(200).json("User has been delete... ");
        } catch (error) {
            res.status(500).json(error)
        }

    }
}
