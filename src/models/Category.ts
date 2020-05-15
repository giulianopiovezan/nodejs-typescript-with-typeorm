import { Entity, Column } from 'typeorm';

import Base from './Base';

@Entity('categories')
class Category extends Base {
  @Column()
  title: string;
}

export default Category;
