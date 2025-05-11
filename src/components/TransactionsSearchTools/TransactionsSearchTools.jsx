import { useState } from "react";
import s from "./TransactionsSearchTools.module.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { getTransactions } from "../../redux/transactions/operations";
import { LuCalendar } from "react-icons/lu";
import { format } from "date-fns";
import CustomInput from "../TransactionForm/CustomInput";

const TransactionsSearchTools = ({ searchInput, handleSearchInput }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const dispatch = useDispatch();
  const { transactionsType } = useParams();

  const handleDateSelect = (date) => {
    const formattedDate = format(date, "yyyy-MM-dd");
    dispatch(getTransactions({ type: transactionsType, date: formattedDate }));
    setSelectedDate(date);
    console.log(formattedDate);
  };
  return (
    <div>
      <input
        type="text"
        name="search"
        value={searchInput}
        onChange={handleSearchInput}
        className={s.searchInput}
        placeholder="Search for anything.."
      />
      <DatePicker
        selected={selectedDate}
        onChange={(date) => handleDateSelect(date)}
        closeOnScroll={true}
        maxDate={new Date()}
        withPortal
        dateFormat="dd/MM/yyyy"
        customInput={
          <CustomInput
            icon={LuCalendar}
            classNames={{
              wrapper: s["t-input-wrapper"],
              input: s["t-input"],
              icon: s["t-icon"],
            }}
          />
        }
      />
    </div>
  );
};

export default TransactionsSearchTools;
