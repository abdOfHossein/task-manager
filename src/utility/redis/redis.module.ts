// import {
//   DynamicModule,
//   Module
// } from '@nestjs/common';
// import { ClientsModule } from '@nestjs/microservices';
// import { Transport } from '@nestjs/microservices/enums';
// import { RedisService } from './redis.service';


// @Module({})
// export class RedisModule {
//   static forRoot(host?: string, port?: number): DynamicModule {
//     return {
      
//       imports: [
//         ClientsModule.register([
//           {
//             name: 'TASK_MANAGER',
//             transport: Transport.REDIS,
//             options: {
//               host: host || 'localhost',
//               port: port || 6379,
//             }
//           },
//         ]),
//       ],
//       module: RedisModule,
//       providers: [RedisService],
//       exports: [RedisService, ClientsModule],

//     };

//   }
// }
