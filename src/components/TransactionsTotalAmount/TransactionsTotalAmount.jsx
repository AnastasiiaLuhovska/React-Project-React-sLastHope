import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { selectUser } from "my-redux/User/userSlice";
import { getCurrencySymbol } from "../../utils/getCurrencySymbol";
import { getLinks } from "../../utils/getLinks";
import { s } from "./TransactionsTotalAmount.module.css";

export const TransactionsTotalAmount = () => {
  const [links, setLinks] = useState({});
  const location = useLocation();

  const { totalIncomes, totalExpenses, currency } = useSelector(selectUser);
  const currencySymbol = getCurrencySymbol(currency);

  useEffect(() => {
    setLinks(getLinks(location));
  }, [location]);

  return (
    <div className={s.wrapper}>
      <ul className={s.list}>
        <li className={s.listItem}>
          <Link className={s.link} to={links.incomes}>
            <div className={s.iconContainer}>
              <Icon />
            </div>
          </Link>
          <div>
            <h3 className={s.amountTitle}>Total Income</h3>
            <p className={s.amountText}>
              {currencySymbol}
              {totalIncomes}
            </p>
          </div>
        </li>
        <li className={s.listItem}>
          <Link className={s.link} to={links.expenses}>
            <div className={s.iconContainer}>
              <Icon />
            </div>
          </Link>
          <div>
            <h3 className={s.amountTitle}>Total Expense</h3>
            <p className={s.amountText}>
              {currencySymbol}
              {totalExpenses}
            </p>
          </div>
        </li>
      </ul>
    </div>
  );
};
