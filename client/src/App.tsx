import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import Pages from "./components/Pages";
import DailyStatisticTable from "./components/DailyStatisticTable";
import TotalStatistics from "./components/TotalStatistics";
import DatePickers from "./components/DatePickers";
import { useSpring } from "react-spring";
import {
    IMappedDayStatistics,
    ITotalStatistics,
} from "./interfaces/interfaces";

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

    const totalPages = Math.ceil(dailyStats.length / resultsPerPage);

    const pageNumbers: number[] = [...Array(totalPages).keys()].map(
        num => num + 1
    );

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
    const handleDirectionChange = (descendingDirection: boolean) =>
        setDescendingDirection(descendingDirection);
    const handleSetStartDate = (date: Date) => setStartDate(date);
    const handleSetEndDate = (date: Date) => setEndDate(date);

    return (
        <div className="global-wrapper">
            <div className="statistics-header-wrapper">
                <header className="statistics-header">
                    Reporting dashboard
                </header>
            </div>
            <DatePickers
                setStartDate={handleSetStartDate}
                setEndDate={handleSetEndDate}
                startDate={startDate}
                endDate={endDate}
            ></DatePickers>
            <TotalStatistics
                totalConversationCount={totalConversationCount}
                totalUserMessageCount={totalUserMessageCount}
                totalVisitorMessageCount={totalVisitorMessageCount}
            ></TotalStatistics>
            <DailyStatisticTable
                descendingDirection={descendingDirection}
                setDescendingDirection={handleDirectionChange}
                currentDailyStats={currentDailyStats}
            ></DailyStatisticTable>
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
