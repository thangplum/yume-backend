import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableIndex,
} from 'typeorm';
import slugify from 'slugify';
import * as nanoid from 'nanoid';
import { argsToArgsConfig } from 'graphql/type/definition';
import { PostEntity } from '../src/post/post.entity';

export class PostSlugs1575716006595 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      'post',
      new TableColumn({
        name: 'slug',
        type: 'text',
        isUnique: true,
        isNullable: true,
      }),
    );

    // change everything to new slug values
    const posts: [PostEntity] = await queryRunner.query('SELECT * from post');
    for (const post of posts) {
      const slugifiedTitle: string = slugify(post.caption.trim());
      const randomId: string = nanoid(10);
      const slug = slugifiedTitle.slice(0, 40) + '-' + randomId;
      await queryRunner.query(
        `UPDATE post SET slug='${slug}' WHERE id='${post.id}'`,
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<any> {}
}
