import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { map, Observable } from 'rxjs';

// Checks that decorator accepts any sort of class
// Type checking with decorators isn't flushed out so
// this is the best we can do for now
interface ClassConstructor {
  new (...args: any[]): unknown;
}

// Serialize decorator
export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> | Promise<Observable<any>> {
    // Run something before a request is handled by the request handler

    return next.handle().pipe(
      map((data: any) => {
        // excludesExtraneousValues will only show values marked as Expose in dto
        return plainToInstance(this.dto, data, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
