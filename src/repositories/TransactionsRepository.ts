import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const allTransactions = await this.find();

    const findAndSumTransactions = (
      transactions: Transaction[],
      type: string,
    ): number =>
      transactions
        .filter(trans => trans.type === type)
        .reduce((total, { value }: Transaction) => total + value, 0);

    const income = findAndSumTransactions(allTransactions, 'income');
    const outcome = findAndSumTransactions(allTransactions, 'outcome');
    const total = income - outcome;

    const balance = {
      income,
      outcome,
      total,
    };

    return balance;
  }
}

export default TransactionsRepository;
