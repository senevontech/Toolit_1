import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ConverterModule } from './converter/converter.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGO_URI'),
        onConnectionCreate: () => {
          console.log('MongoDB Atlas connected successfully');
        },
      }),
    }),

    ConverterModule   // ⭐ VERY IMPORTANT
  ],
})
export class AppModule {}