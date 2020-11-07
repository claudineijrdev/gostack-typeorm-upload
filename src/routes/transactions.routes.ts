import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
import multer from 'multer'
import fs from 'fs'

import CreateCategoryService from '../services/CreateCategoryService'
import CreateTransactionService from '../services/CreateTransactionService';
import TransactionsRepository from '../repositories/TransactionsRepository';
import DeleteTransactionService from '../services/DeleteTransactionService';

import uploadConfig from '../config/upload';
import ImportTransactionsService from '../services/ImportTransactionsService';
const upload = multer(uploadConfig)
// import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();

transactionsRouter.get('/', async (request, response) => {
  const transactionsRepository = getCustomRepository(TransactionsRepository)
  const transactions = await transactionsRepository.all()
  return response.json({
    transactions: transactions,
    balance: await transactionsRepository.getBalance()
  })
});

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body

  const createCategory = new CreateCategoryService()
  const { id: category_id } = await createCategory.execute(category)

  const createTransaction = new CreateTransactionService()
  const transaction = await createTransaction.execute({ title, value, type, category_id })

  return response.json(transaction)
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params

  const deleteTransaction = new DeleteTransactionService()

  await deleteTransaction.execute(id)

  return response.status(204).send()
});

transactionsRouter.post('/import', upload.single('file'), async (request, response) => {
  const importTransactions = new ImportTransactionsService()

  const transactions = await importTransactions.execute(request.file.path)

  return response.json(transactions)
});

export default transactionsRouter;
