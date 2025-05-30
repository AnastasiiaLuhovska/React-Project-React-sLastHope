import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import { enGB } from "date-fns/locale";
import {
  addTransaction,
  updateTransaction,
} from "../../redux/transactions/operations";
import { setSelectedType } from "../../redux/transactions/slice";
import { FiCalendar } from "react-icons/fi";
import { FaRegClock } from "react-icons/fa6";
import s from "./TransactionForm.module.css";
import CustomInput from "../CustomInput/CustomInput";
import { useState } from "react";
import { CategoriesModal } from "../CategoriesModal/CategoriesModal";
import { CgClose } from "react-icons/cg";
import { selectCurrency } from "../../redux/user/selectors";
import { getCurrencySymbol } from "../../utils/getCurrencySymbol";
import { selectSelectedType } from "../../redux/transactions/selectors";

registerLocale("en-GB", enGB);

const validationSchema = Yup.object({
  type: Yup.string()
    .oneOf(["incomes", "expenses"])
    .required("Type is required"),

  date: Yup.date()
    .nullable()
    .required("Date is required")
    .test(
      "date-time-not-in-future",
      "Date and time must not be in the future",
      function (value) {
        const { time } = this.parent;
        if (!value || !time) return true;

        const combined = new Date(value);
        combined.setHours(time.getHours());
        combined.setMinutes(time.getMinutes());
        combined.setSeconds(0);
        combined.setMilliseconds(0);

        return combined <= new Date();
      }
    ),

  time: Yup.date().nullable().required("Time is required"),

  category: Yup.string().required("Category is required"),

  sum: Yup.string()
    .required("Sum is required")
    .matches(
      /^\d+([.,]\d{1,2})?$/,
      "Invalid format: use digits, optional decimal with max 2 digits"
    )
    .test(
      "is-valid-number",
      "Sum must be greater than zero and less than or equal to 1,000,000",
      (value) => {
        if (!value) return false;
        const parsed = parseFloat(value.replace(",", "."));
        return parsed > 0 && parsed <= 1000000;
      }
    ),

  comment: Yup.string()
    .required("Comment is required")
    .min(3, "Min 3 characters")
    .max(48, "Max 48 characters")
    .trim(),
});

const TransactionForm = ({ transaction, onClose, isModal = false }) => {
  const dispatch = useDispatch();
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const userCurrency = useSelector(selectCurrency);
  const selectedType = useSelector(selectSelectedType);

  const initialValues = transaction
    ? {
        type: transaction.type,
        date: new Date(transaction.date),
        time: new Date(`1970-01-01T${transaction.time}:00`),
        category: transaction.category._id,
        categoryName: transaction.category.categoryName,
        sum: transaction.sum,
        comment: transaction.comment,
      }
    : {
        type: selectedType || "expenses",
        date: null,
        time: null,
        category: "",
        categoryName: "",
        sum: "",
        comment: "",
      };

  const handleTypeChange = (event, setFieldValue, dispatch) => {
    const selectedType = event.target.value;
    setFieldValue("type", selectedType);
    dispatch(setSelectedType(selectedType));
  };

  const handleSubmit = async (values, { resetForm }) => {
    const transactionData = {
      date: values.date.toISOString().split("T")[0],
      time: values.time.toTimeString().slice(0, 5),
      category: values.category,
      sum: parseFloat(values.sum.toString().replace(",", ".")),
      comment: values.comment.trim(),
    };

    if (!transaction) {
      transactionData.type = values.type;
      await toast.promise(dispatch(addTransaction(transactionData)).unwrap(), {
        loading: "Adding transaction...",
        success: "Transaction successfully added!",
        error: (error) => error?.message || "Error adding transaction",
      });
    } else {
      await toast.promise(
        dispatch(
          updateTransaction({
            type: transaction.type,
            id: transaction._id,
            data: transactionData,
          })
        ).unwrap(),
        {
          loading: "Updating transaction...",
          success: "Transaction successfully updated!",
          error: (error) => error?.message || "Error updating transaction",
        }
      );
    }

    resetForm();
    if (isModal) {
      onClose();
    }
  };

  const handleKeyDown = (event) => {
    const allowedKeys = [
      "Backspace",
      "Tab",
      "ArrowLeft",
      "ArrowRight",
      "Delete",
      "Home",
      "End",
    ];
    const isNumberKey = /^[0-9.,]$/.test(event.key);
    const value = event.target.value;
    const hasDotOrComma = value.includes(".") || value.includes(",");

    if (
      !isNumberKey &&
      !allowedKeys.includes(event.key) &&
      !([".", ","].includes(event.key) && !hasDotOrComma)
    ) {
      event.preventDefault();
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, setFieldValue, isSubmitting, dirty }) => (
        <>
          <Form className={isModal ? s["edit-form"] : s["add-form"]}>
            {isModal && (
              <div className={s["close-btn-container"]}>
                <button
                  type="button"
                  onClick={onClose}
                  className={s["close-btn"]}
                >
                  <CgClose className={s["close-icon"]} />
                </button>
              </div>
            )}
            <div className={s["t-radio-group"]}>
              <label
                className={`${s["t-radio-label"]} ${
                  transaction ? s["t-radio-disabled"] : ""
                }`}
              >
                <Field
                  type="radio"
                  name="type"
                  value="expenses"
                  checked={values.type === "expenses"}
                  disabled={!!transaction}
                  onChange={(event) =>
                    handleTypeChange(event, setFieldValue, dispatch)
                  }
                  className={s["t-radio-btn"]}
                />
                Expense
              </label>
              <label
                className={`${s["t-radio-label"]} ${
                  transaction ? s["t-radio-disabled"] : ""
                }`}
              >
                <Field
                  type="radio"
                  name="type"
                  value="incomes"
                  checked={values.type === "incomes"}
                  disabled={!!transaction}
                  onChange={(event) =>
                    handleTypeChange(event, setFieldValue, dispatch)
                  }
                  className={s["t-radio-btn"]}
                />
                Income
              </label>
              {!transaction && (
                <ErrorMessage name="type" component="div" className={s.error} />
              )}
            </div>
            <div className={s["date-section"]}>
              <div>
                <label className={s["t-label"]}>Date</label>
                <DatePicker
                  selected={values.date}
                  onChange={(date) => setFieldValue("date", date)}
                  dateFormat="yyyy-MM-dd"
                  placeholderText="0000-00-00"
                  maxDate={new Date()}
                  locale="en-GB"
                  calendarClassName={s.calendar}
                  customInput={
                    <CustomInput
                      icon={FiCalendar}
                      classNames={{
                        wrapper: s["t-input-wrapper"],
                        input: s["t-input"],
                        icon: s["t-icon"],
                      }}
                    />
                  }
                />
                <ErrorMessage
                  name="date"
                  component="div"
                  className={s["t-error"]}
                />
              </div>

              <div>
                <label className={s["t-label"]}>Time</label>
                <DatePicker
                  selected={values.time}
                  onChange={(time) => setFieldValue("time", time)}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={1}
                  timeCaption="Time"
                  dateFormat="HH:mm"
                  placeholderText="00:00"
                  minTime={new Date(0, 0, 0, 0, 0)}
                  maxTime={
                    values.date?.toDateString() === new Date().toDateString()
                      ? new Date()
                      : new Date(0, 0, 0, 23, 59)
                  }
                  customInput={
                    <CustomInput
                      readOnly={false}
                      icon={FaRegClock}
                      classNames={{
                        wrapper: s["t-input-wrapper"],
                        input: s["t-input"],
                        icon: s["t-icon"],
                      }}
                    />
                  }
                />
                <ErrorMessage
                  name="time"
                  component="div"
                  className={s["t-error"]}
                />
              </div>
            </div>

            <div className={s["t-input-group"]}>
              <label className={s["t-label"]}>Category</label>
              <input
                type="text"
                placeholder="Select category"
                className={s["t-input"]}
                value={values.categoryName}
                onClick={() => setIsCategoryModalOpen(true)}
                readOnly
              />
              <Field type="hidden" name="category" />
              <ErrorMessage
                name="category"
                component="div"
                className={s["t-error"]}
              />
            </div>

            <div className={s["t-input-group"]}>
              <label className={s["t-label"]}>Sum</label>
              <div className={s["t-input-wrapper"]}>
                <Field
                  name="sum"
                  inputMode="decimal"
                  placeholder="Enter the sum"
                  className={s["t-input"]}
                  onKeyDown={handleKeyDown}
                />
                <span className={s["t-currency"]}>
                  {getCurrencySymbol(userCurrency)}
                </span>
              </div>
              <ErrorMessage
                name="sum"
                component="div"
                className={s["t-error"]}
              />
            </div>

            <div className={s["t-input-group"]}>
              <label className={s["t-label"]}>Comment</label>
              <Field
                as="textarea"
                name="comment"
                placeholder="Enter the text"
                className={s["t-textarea"]}
              />
              <ErrorMessage
                name="comment"
                component="div"
                className={s["t-error"]}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !dirty}
              className={s["t-send-btn"]}
            >
              {isSubmitting ? "Sending..." : transaction ? "Save" : "Add"}
            </button>
          </Form>
          {isCategoryModalOpen && (
            <CategoriesModal
              type={values.type}
              onClose={() => setIsCategoryModalOpen(false)}
              onSelectCategory={(category) => {
                setFieldValue("category", category._id);
                setFieldValue("categoryName", category.categoryName);
                setIsCategoryModalOpen(false);
              }}
              selectedCategoryId={values.category}
              updateSelectedCategoryName={(newName) =>
                setFieldValue("categoryName", newName)
              }
            />
          )}
        </>
      )}
    </Formik>
  );
};

export default TransactionForm;
