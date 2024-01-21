import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [
    PaymentModule,
    MongooseModule.forRoot(
      'mongodb://root:mongorootPass2023@localhost:27018/nestJsPayment',
      {
        authSource: 'admin',
      },
    ),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
