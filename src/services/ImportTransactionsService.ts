/* eslint-disable no-shadow */
import neatCsv from 'neat-csv';
import { getRepository } from 'typeorm';

import Transaction from '../models/Transaction';
import Category from '../models/Category';

class ImportTransactionsService {
  async execute(file: Buffer): Promise<void> {
    const transactionsRepository = getRepository(Transaction);
    const categoriesRepository = getRepository(Category);

    const importedTransactions = await neatCsv(file, {
      mapValues: ({ value }) => value.trim(),
    });

    const categoriesDB = await categoriesRepository.find();

    const categoriesToInsert = importedTransactions.reduce(
      (categories: { title: string }[], transaction) => {
        const existsCategoryDB = categoriesDB.some(
          category => category.title === transaction.category,
        );
        const existsCategoryIntoList = categories.some(
          category => category.title === transaction.category,
        );
        if (!existsCategoryIntoList && !existsCategoryDB) {
          categories.push({ title: transaction.category });
        }

        return categories;
      },
      [],
    );

    const categories = categoriesRepository.create(categoriesToInsert);

    await categoriesRepository.save(categories);

    const transactions = transactionsRepository.create(importedTransactions);

    await transactionsRepository.save(transactions);
  }
}

export default ImportTransactionsService;
