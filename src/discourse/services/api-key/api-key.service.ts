import { Injectable, HttpService } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AxiosResponse } from 'axios';
import { ConfigService } from '../../../config/config.service';
import { ApiKey } from '../../interfaces/api-key.interface';

@Injectable()
export class ApiKeyService {
  private discourseUrl: string;
  constructor(
    private readonly httpService: HttpService,
    config: ConfigService,
  ) {
    this.discourseUrl = config.get('DISCOURSE_URL');
  }

  api(): Observable<AxiosResponse<ApiKey>> {
    return this.httpService.get(`${this.discourseUrl}/admin/api.json`);
  }
}
