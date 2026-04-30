import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { JwtModule } from '@nestjs/jwt'
import { AuthController } from './auth/auth.controller'
import { AuthService } from './auth/auth.service'
import { DetectController } from './detect/detect.controller'
import { DetectService } from './detect/detect.service'
import { PlanService } from './plan/plan.service'
import { PostService } from './social/post.service'

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USER || 'banwei',
      password: process.env.DB_PASSWORD || 'banwei123',
      database: process.env.DB_NAME || 'banwei',
      entities: [], // 实际使用时需要添加实体
      synchronize: true, // 开发环境使用，生产环境关闭
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'banwei-secret-key',
      signOptions: { expiresIn: '2h' },
    }),
  ],
  controllers: [
    AuthController,
    DetectController,
  ],
  providers: [
    AuthService,
    DetectService,
    PlanService,
    PostService,
  ],
})
export class AppModule {}
