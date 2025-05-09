import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import { Chart } from "../PieChart/PieChart";
import { countCategories } from "../../utils/countCategories";
import { selectTransactions } from "../../redux/transactions/selectors";
import { selectUser } from "../../redux/user/selectors";
import { fetchCurrentUser } from "../../redux/user/operations";
import { getTransactions } from "../../redux/transactions/operations";

import warningImg from "../../assets/no_data.jpeg";
import s from "./TransactionsChart.module.css";

export const TransactionsChart = () => {
  const [categoriesData, setCategoriesData] = useState(null);
  const dispatch = useDispatch();

  const transactions = useSelector(selectTransactions);
  const { totalExpenses } = useSelector(selectUser);

  useEffect(() => {
    dispatch(getTransactions({ type: "expenses" }));
  }, [dispatch]);

  useEffect(() => {
    if (transactions === null) return;

    dispatch(fetchCurrentUser())
      .unwrap()
      .then(() => {
        const expenses = transactions.filter(
          (transaction) => transaction.type === "expenses"
        );
        setCategoriesData(countCategories(expenses, totalExpenses));
      })
      .catch();
  }, [transactions, totalExpenses, dispatch]);

  if (transactions === null || categoriesData === null) return null;

  if (!categoriesData.length) {
    return (
      <div className={s.warningWrapper}>
        <h2 className={s.warningTitle}>
          You don't have any expenses in this month.
        </h2>
        <img className={s.imgNoTransactions} src={warningImg} alt="No data" />
      </div>
    );
  }

  return (
    <div className={s.chartContainer}>
      <h3 className={s.title}>Expenses categories</h3>
      <div className={s.statsWrapper}>
        <div className={s.pieChartWrapper}>
          <Chart data={categoriesData} />
          <p className={s.chartDescr}>100%</p>
        </div>
        <ul className={`${s.list} scroll scrollA`}>
          {categoriesData.map((item, index) => (
            <li className={s.listItem} key={index}>
              <div
                className={s.wrapperMarker}
                style={{ backgroundColor: item.color }}
              ></div>
              <p className={s.itemDescr}>{item.name}</p>
              <p className={s.itemSpan}>{item.value}%</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
