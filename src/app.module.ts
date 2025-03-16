import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { APP_FILTER } from '@nestjs/core'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { PrismaModule } from './prisma/prisma.module'
import { CommonsModule } from './commons/commons.module'
import { HttpExceptionFilter } from './commons/filters/http-exception.filter'
import { AuthModule } from './auth/auth.module'
import { RepositoriesModule } from './repositories/repositories.module'

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        JwtModule.register({}),
        CommonsModule,
        PrismaModule,
        AuthModule,
        RepositoriesModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_FILTER,
            useClass: HttpExceptionFilter,
        },
    ],
})
export class AppModule {}
