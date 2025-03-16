import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { ResponseUtil } from 'src/commons/utils/response.util'
import { IsPublic } from 'src/commons/decorators/isPublic.decorator'
import { RegisterRequestDTO } from './dto/registerRequest.dto'
import { LoginRequestDTO } from './dto/loginRequest.dto'

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly responseUtil: ResponseUtil
    ) {}

    @IsPublic()
    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    async register(@Body() body: RegisterRequestDTO) {
        const responseData = await this.authService.register(body)

        return this.responseUtil.response(
            {
                responseCode: HttpStatus.CREATED,
                responseMessage: 'User successfully registered',
            },
            responseData
        )
    }

    @IsPublic()
    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() body: LoginRequestDTO) {
        const responseData = await this.authService.login(body)

        return this.responseUtil.response(
            {
                responseMessage: 'Login Successful',
            },
            responseData
        )
    }
}
