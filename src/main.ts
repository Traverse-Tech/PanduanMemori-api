import { ValidationPipe, Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
        })
    )
    app.enableCors({
        origin: process.env.APP_ALLOWED_ORIGIN,
        credentials: true,
    })

    await app.listen(process.env.APP_PORT ?? 3000)
    Logger.log(`Listening on ${await app.getUrl()}`)
}

bootstrap()
