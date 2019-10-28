import { Injectable, HttpService} from '@nestjs/common';
import { Observable } from 'rxjs';
import { AxiosResponse, AxiosRequestConfig } from 'axios';
import { ConfigService } from '../../../config/config.service';
import {
  CreateCategory,
  Category,
  CategoryList,
} from '../../interfaces/categories.interface';

import https = require('https');

@Injectable()
export class CategoriesService {
  private discourseUrl: string;
  constructor(
    private readonly httpService: HttpService,
    config: ConfigService,
  ) {
    this.discourseUrl = config.get('DISCOURSE_URL');
    // this.httpService.axiosRef.interceptors.request.use(axiosConfig => {
    //   axiosConfig.httpsAgent = new https.Agent({ rejectUnauthorized: false });
    //   return axiosConfig;
    // });
  }

  createCategory(cat: CreateCategory): Observable<AxiosResponse<Category>> {
    return this.httpService.post(`${this.discourseUrl}/categories`, cat);
  }

  getCategories(): Observable<AxiosResponse<CategoryList>> {
    // console.log(`${this.discourseUrl}/categories.json`)
    return this.httpService.get(`${this.discourseUrl}/categories.json`);
  }

  // getTopics(categoryId: number): Observable<
}
