import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // 全局管道：参数校验
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }))

  // CORS配置
  app.enableCors({
    origin: true,
    credentials: true,
  })

  // 全局前缀
  app.setGlobalPrefix('api')

  const port = process.env.PORT || 3000
  await app.listen(port)
  console.log(`🚀 去除班味后端服务已启动: http://localhost:${port}/api`)
}

bootstrap()
