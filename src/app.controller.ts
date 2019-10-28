import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { CategoriesService } from './discourse/services/categories/categories.service';
import { jsxAttribute } from '@babel/types';
import { CategoryList } from './discourse/interfaces/categories.interface';


@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly categoryService: CategoriesService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('categories')
  async getCategories(): Promise<string> {
    console.log('hhe')
    const cats = await this.categoryService.getCategories();
    cats.subscribe(
      res => {
        // let data = validate(res.data, { whitelist: true});
        console.log(res);
      },
      err => console.error(err),
    );
    return Promise.resolve(JSON.stringify(cats));
  }
}
