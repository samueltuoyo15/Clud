import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { NestExpressApplication } from '@nestjs/platform-express'
import { join } from 'path'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  app.enableCors({
    origin: true,
    credentials: true,
  })

  app.use(helmet())
  app.use(cookieParser())

  app.useStaticAssets(join(process.cwd(), 'public'))

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidNonWhitelisted: true,
      whitelist: true,
    }),
  )

  const port = process.env.PORT ?? 3000
  await app.listen(port)
  console.log(`Clud server running on http://localhost:${port}`)
}
bootstrap()
