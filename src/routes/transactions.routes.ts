import { Router } from 'express';
import multer from 'multer';
import fs from 'fs';

import { getCustomRepository } from 'typeorm';

import uploadConfig from '../config/upload';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();
const upload = multer(uploadConfig);

transactionsRouter.get('/', async (request, response) => {
  const transactionsRepository = getCustomRepository(TransactionsRepository);
  const transactions = await transactionsRepository.find();
  const balance = await transactionsRepository.getBalance();

  return response.json({ transactions, balance });
});

transactionsRouter.post('/', async (request, response) => {
  const createTransaction = new CreateTransactionService();
  const { title, type, value, category } = request.body;
  const transaction = await createTransaction.execute({
    title,
    type,
    value,
    category,
  });
  return response.json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const deleteTransaction = new DeleteTransactionService();
  await deleteTransaction.execute(request.params.id);
  return response.status(204).send();
});

transactionsRouter.post(
  '/import',
  upload.single('file'),
  async (request, response) => {
    const importTransactions = new ImportTransactionsService();
    const file = await fs.promises.readFile(request.file.path);
    await importTransactions.execute(file);
    return response.send();
  },
);

export default transactionsRouter;
