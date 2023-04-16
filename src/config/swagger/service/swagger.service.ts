import { INestApplication, Injectable } from '@nestjs/common';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerDocumentOptions,
  SwaggerModule
} from '@nestjs/swagger';
import { SwaggerTheme } from 'swagger-themes';

@Injectable()
export class SwaggerService {
  title = '';
  description = '';
  version = '';
  preFix = 'doc';
  constructor() { }

  init(app: INestApplication) {
    const theme = new SwaggerTheme('v3');
    const config = new DocumentBuilder()
      .setTitle(this.title)
      .setDescription(this.description)
      .setVersion(this.version)
      .addBearerAuth(
        { type: 'http', scheme: 'Bearer', bearerFormat: 'Token', in: 'header' },
        'access-token',
      )
      .build();
    const options: SwaggerDocumentOptions = {
      operationIdFactory: (controllerKey: string, methodKey: string) =>
        methodKey,
    };
    const customOptions: SwaggerCustomOptions = {
      swaggerOptions: {
        persistAuthorization: true,
        tagsSorter: 'alpha', // can also be a function
        operationsSorter: 'alpha', // can also be a function
        docExpansion: 'none', // Collapse  by default
        explorer: true,
        customCss: theme.getBuffer('dark')
      },
      // customSiteTitle: '',
      // customCssUrl: '../swagger/style.css',
    };

    const document = SwaggerModule.createDocument(app, config, options);
    SwaggerModule.setup(this.preFix, app, document, customOptions);
  }
}
