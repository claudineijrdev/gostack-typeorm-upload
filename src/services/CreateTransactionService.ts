import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string,
  value: number,
  type: 'income' | 'outcome',
  category_id: string
}

class CreateTransactionService {
  public async execute({ title, value, type, category_id }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository)

    if (type === 'outcome') {
      const balance = await transactionsRepository.getBalance()
      if (balance.total < value) {
        throw new AppError('You do not have enough balance.', 400)
      }
    }

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id,
    })

    await transactionsRepository.save(transaction)

    return transaction
  }
}

export default CreateTransactionService;
