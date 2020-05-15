import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';

import Base from './Base';
import Category from './Category';

import NumberTransformer from '../transformers/NumberTransformer';

@Entity('transactions')
class Transaction extends Base {
  @Column()
  title: string;

  @Column()
  type: 'income' | 'outcome';

  @Column({ transformer: new NumberTransformer() })
  value: number;

  @Column()
  category_id: string;

  @ManyToOne(() => Category, { eager: true })
  @JoinColumn({ name: 'category_id' })
  category: Category;
}

export default Transaction;
