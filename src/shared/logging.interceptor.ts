import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { GqlExecutionContext, GraphQLExecutionContext } from '@nestjs/graphql';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const now = Date.now();
    const response = next.handle();

    if (!request) {
      const ctx: GraphQLExecutionContext = GqlExecutionContext.create(context);
      const info = ctx.getInfo();

      return response.pipe(
        tap(() =>
          Logger.log(
            `${info.parentType} ${info.fieldName} ${Date.now() - now}ms`,
            `${ctx.getContext().name}`,
          ),
        ),
      );
    }

    const method = request.method;
    const url = request.url;

    return response.pipe(
      tap(() =>
        Logger.log(
          `${method} ${url} ${Date.now() - now}ms`,
          context.getClass().name,
        ),
      ),
    );
  }
}
