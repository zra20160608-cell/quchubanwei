import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { JwtModule } from '@nestjs/jwt'

import { AuthController } from './auth/auth.controller'
import { AuthService } from './auth/auth.service'
import { AuthGuard } from './auth/auth.guard'
import { DetectController } from './detect/detect.controller'
import { DetectService } from './detect/detect.service'
import { PlanController } from './plan/plan.controller'
import { PlanService } from './plan/plan.service'

import { SocialController } from './social/social.controller'
import { SocialService } from './social/social.service'
import { NotificationController } from './notification/notification.controller'
import { NotificationService } from './notification/notification.service'
import { ShareController } from './share/share.controller'
import { ShareService } from './share/share.service'
import { UserController } from './user/user.controller'
import { UserService } from './user/user.service'
import { AIController } from './ai/ai.controller'
import { AIService } from './ai/ai.service'

// Entities
import { User } from './src/entities/user.entity'
import { DetectionRecord } from './src/entities/detection-record.entity'
import { UserPlan } from './src/entities/user-plan.entity'
import { PlanTemplate } from './src/entities/plan-template.entity'
import { CheckInRecord } from './src/entities/check-in-record.entity'
import { Post } from './src/entities/post.entity'
import { Comment } from './src/entities/comment.entity'
import { Like } from './src/entities/like.entity'
import { Collection } from './src/entities/collection.entity'
import { Notification } from './src/entities/notification.entity'
import { ShareRecord } from './src/entities/share-record.entity'
import { InviteRelation } from './src/entities/invite-relation.entity'
import { UserAchievement } from './src/entities/user-achievement.entity'
import { Report } from './src/entities/report.entity'
import { Topic } from './src/entities/topic.entity'

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USER || 'banwei',
      password: process.env.DB_PASSWORD || 'banwei123',
      database: process.env.DB_NAME || 'banwei',
      entities: [
        User,
        DetectionRecord,
        UserPlan,
        PlanTemplate,
        CheckInRecord,
        Post,
        Comment,
        Like,
        Collection,
        Notification,
        ShareRecord,
        InviteRelation,
        UserAchievement,
        Report,
        Topic,
      ],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([
      User,
      DetectionRecord,
      UserPlan,
      PlanTemplate,
      CheckInRecord,
      Post,
      Comment,
      Like,
      Collection,
      Notification,
      ShareRecord,
      InviteRelation,
      UserAchievement,
      Report,
      Topic,
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'banwei-secret-key',
      signOptions: { expiresIn: '2h' },
    }),
  ],
  controllers: [
    AuthController,
    DetectController,
    PlanController,
    SocialController,
    NotificationController,
    ShareController,
    UserController,
    AIController,
  ],
  providers: [
    AuthService,
    AuthGuard,
    DetectService,
    PlanService,
    SocialService,
    NotificationService,
    ShareService,
    UserService,
    AIService,
  ],
})
export class AppModule {}
