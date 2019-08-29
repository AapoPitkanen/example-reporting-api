import React from "react";
import DatePicker from "react-datepicker";

interface DatePickersProps {
    setStartDate: Function;
    setEndDate: Function;
    startDate: Date;
    endDate: Date;
}

const DatePickers: React.FC<DatePickersProps> = ({
    setStartDate,
    setEndDate,
    startDate,
    endDate,
}) => {
    return (
        <div className="datepicker-selectors">
            <div className="datepicker-wrapper">
                <span>Start date</span>
                <DatePicker
                    className="start-date"
                    selected={startDate}
                    onChange={(date: Date) => setStartDate(date)}
                    dateFormat="dd.MM.yyyy"
                />
                <i className="date-icon far fa-calendar-alt"></i>
            </div>
            <div className="datepicker-wrapper">
                <span>End date</span>
                <DatePicker
                    className="end-date"
                    selected={endDate}
                    onChange={(date: Date) => setEndDate(date)}
                    dateFormat="dd.MM.yyyy"
                />
                <i className="date-icon far fa-calendar-alt"></i>
            </div>
        </div>
    );
};

export default DatePickers;
