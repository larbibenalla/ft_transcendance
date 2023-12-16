import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: false,
  });

  const allowedOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173',
  "http://localhost:80", "http://localhost", "http://localhost:8080", "http://127.0.0.1:8080",
  process.env.FRONT_URL
];
  const corsOptions = {
    origin: (origin, callback) => {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        // postman
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    optionsSuccessStatus: 200,
  };

  app.enableCors(corsOptions);

  app.use(cookieParser());
  // app.use(morgan('dev'));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Api routes')
    .setDescription('This page is a reference to the api routes available')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/routes', app, document);

  // app.useGlobalFilters(new GlobalExceptionFilter());

  await app.listen(3000);
}

bootstrap();