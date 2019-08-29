import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import DatePicker from "react-datepicker";
import { Pages } from "./components/Pages";
import { useSpring, animated } from "react-spring";

interface IMappedDayStatistics {
    conversation_count: number;
    missed_chat_count: number;
    visitors_with_conversation_count: number;
    date: Date;
}

interface ITotalStatistics {
    total_conversation_count: number;
    total_user_message_count: number;
    total_visitor_message_count: number;
}

const App: React.FC = () => {
    const [dailyStats, setDailyStats] = useState<IMappedDayStatistics[]>([]);
    const [totalStatistics, setTotalStatistics] = useState<ITotalStatistics>({
        total_conversation_count: 0,
        total_user_message_count: 0,
        total_visitor_message_count: 0,
    });

    const [descendingDirection, setDescendingDirection] = useState<boolean>(
        false
    );
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [startDate, setStartDate] = useState<Date>(new Date("2017-05-01"));
    const [endDate, setEndDate] = useState<Date>(new Date("2017-05-07"));
    const resultsPerPage: number = 5;

    useEffect(() => {
        axios
            .get(
                `/api/reporting/daily_statistics?start_date=${startDate}&end_date=${endDate}`
            )
            .then(response => {
                const { data } = response;
                // JSON doesn't have a date format so the date strings have to parsed back to a proper date object
                // when getting the response. Also sort the results in ascending order so the first page of the current results
                // will show the first results.
                const mapped_results: IMappedDayStatistics[] = data.results
                    .map((day: IMappedDayStatistics) => {
                        day.date = new Date(day.date);
                        return day;
                    })
                    .sort(
                        (a: IMappedDayStatistics, b: IMappedDayStatistics) => {
                            return a.date.getTime() - b.date.getTime();
                        }
                    );

                setDailyStats(mapped_results);
            });

        axios
            .get(
                `/api/reporting/total_statistics?start_date=${startDate}&end_date=${endDate}`
            )
            .then(response => {
                const { data } = response;
                setTotalStatistics(data);
            });

        setCurrentPage(1);
    }, [startDate, endDate]);

    const lastIndex: number = currentPage * resultsPerPage;
    const firstIndex: number = lastIndex - resultsPerPage;
    const currentDailyStats: IMappedDayStatistics[] = dailyStats.slice(
        firstIndex,
        lastIndex
    );

    const pageNumbers: number[] = [];
    const totalPages = Math.ceil(dailyStats.length / resultsPerPage);

    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    const totalConversationCount = useSpring({
        number: totalStatistics.total_conversation_count,
        from: {
            number: 0,
        },
    });

    const totalUserMessageCount = useSpring({
        number: totalStatistics.total_user_message_count,
        from: {
            number: 0,
        },
    });

    const totalVisitorMessageCount = useSpring({
        number: totalStatistics.total_visitor_message_count,
        from: {
            number: 0,
        },
    });

    const handlePagination = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div className="global-wrapper">
            <div className="statistics-header-wrapper">
                <header className="statistics-header">
                    Reporting dashboard
                </header>
            </div>

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
            <div className="total-statistics-wrapper">
                <div className="statistics-card total-conversation-count">
                    <animated.span className="statistics-number">
                        {totalConversationCount.number.interpolate(number =>
                            Math.floor(number)
                        )}
                    </animated.span>
                    <span>Total conversation count</span>
                </div>
                <div className="statistics-card total-user-message-count">
                    <animated.span className="statistics-number">
                        {totalUserMessageCount.number.interpolate(number =>
                            Math.floor(number)
                        )}
                    </animated.span>
                    <span>Total user message count</span>
                </div>
                <div className="statistics-card total-visitor-message-count">
                    <animated.span className="statistics-number">
                        {totalVisitorMessageCount.number.interpolate(number =>
                            Math.floor(number)
                        )}
                    </animated.span>
                    <span>Total visitor message count</span>
                </div>
            </div>
            <div className="table-wrapper">
                <table className="table table-dark">
                    <tbody>
                        <tr>
                            <th scope="col">Conversation count</th>
                            <th scope="col">Missed chat count</th>
                            <th scope="col">
                                Visitors with conversation count
                            </th>
                            <th
                                scope="col"
                                className="date-direction-selector"
                                onClick={() =>
                                    setDescendingDirection(!descendingDirection)
                                }
                            >
                                Date
                                {descendingDirection ? (
                                    <span className="date-down">&#8595;</span>
                                ) : (
                                    <span className="date-up">&#8593;</span>
                                )}
                            </th>
                        </tr>
                        {currentDailyStats
                            .sort(
                                (
                                    a: IMappedDayStatistics,
                                    b: IMappedDayStatistics
                                ) => {
                                    return descendingDirection
                                        ? b.date.getTime() - a.date.getTime()
                                        : a.date.getTime() - b.date.getTime();
                                }
                            )
                            .map((day: IMappedDayStatistics) => (
                                <tr key={day.date.toDateString()}>
                                    <td>{day.conversation_count}</td>
                                    <td>{day.missed_chat_count}</td>
                                    <td>
                                        {day.visitors_with_conversation_count}
                                    </td>
                                    <td>{day.date.toDateString()}</td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
            {pageNumbers.length >= 2 && (
                <Pages
                    currentPage={currentPage}
                    pageNumbers={pageNumbers}
                    handlePagination={handlePagination}
                ></Pages>
            )}
        </div>
    );
};

export default App;
