import { useState } from "react";
import { useSelector } from "react-redux";
import TransactionModal from "../TransactionForm/TransactionModal";
import s from "./TransactionsList.module.css";
import {
  selectFilteredTransactions,
  selectTransactions,
} from "../../redux/transactions/selectors";
import clsx from "clsx";

const TransactionsList = () => {
  const transactions = useSelector(selectFilteredTransactions);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const handleEditClick = (transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };
  return (
    <>
      <ul className={s.transactionsList}>
        <li className={s.tableHeader}>
          <span className={clsx(s.category, s.title)}>Category</span>
          <span className={clsx(s.comment, s.title)}>Comment</span>
          <span className={clsx(s.date, s.title)}>Date</span>
          <span className={clsx(s.time, s.title)}>Time</span>
          <span className={clsx(s.sum, s.title)}>Sum</span>
        </li>
        {transactions?.map((transaction) => (
          <li className={s.transactionsItem} key={transaction._id}>
            <span className={clsx(s.category, s.content)}>
              {transaction.category.categoryName}
            </span>
            <span className={clsx(s.comment, s.content)}>
              {transaction.comment}
            </span>
            <span className={clsx(s.date, s.content)}>{transaction.date}</span>
            <span className={clsx(s.time, s.content)}>{transaction.time}</span>
            <span className={clsx(s.sum, s.content)}>
              {transaction.sum}/ Add Currency from User Info
            </span>
            <button onClick={() => handleEditClick(transaction)}>Edit</button>
          </li>
        ))}
      </ul>
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        transaction={selectedTransaction}
      />
    </>
  );
};

export default TransactionsList;
