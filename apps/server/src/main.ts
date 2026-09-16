import 'dotenv/config'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { NestExpressApplication } from '@nestjs/platform-express'
import { join } from 'path'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
  })

  app.getHttpAdapter().get('/', (_req: any, res: any) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() })
  })

  const allowedOriginsStr = process.env.ALLOWED_ORIGINS
  const allowedOrigins = allowedOriginsStr
    ? allowedOriginsStr.split(',').map((o) => o.trim()).filter(Boolean)
    : ['http://localhost:5173', 'https://clud.samueltuoyo.com']

  app.enableCors({
    origin: allowedOrigins,
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

