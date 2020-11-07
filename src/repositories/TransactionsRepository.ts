import { EntityRepository, getRepository, Repository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async all(): Promise<Transaction[]> {
    const transactionRepository = getRepository(Transaction)
    const transactions = await transactionRepository.find()
    return  transactions
  }
  public async getBalance(): Promise<Balance> {
    const transactions = await this.all()

    if (!transactions) {
      throw new AppError('Could not find any transactions.')
    }

    const income = transactions.reduce((total, transactions) => {
      if (transactions.type === 'income')
        total += transactions.value
      return total
    }, 0)

    const outcome = transactions.reduce((total, transactions) => {
      if (transactions.type === 'outcome')
        total += transactions.value
      return total
    }, 0)

    const balance: Balance = {
      income,
      outcome,
      total: income - outcome
    }

    return balance
  }
}

export default TransactionsRepository;
