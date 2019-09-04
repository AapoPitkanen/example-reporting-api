import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import Pages from "./components/Pages";
import DailyStatisticTable from "./components/DailyStatisticTable";
import TotalStatistics from "./components/TotalStatistics";
import DatePickers from "./components/DatePickers";
import { useSpring, useTransition, animated } from "react-spring";
import {
    IMappedDayStatistics,
    ITotalStatistics,
    IChartData,
} from "./interfaces/interfaces";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from "recharts";

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
    const [error, setError] = useState<boolean>(false);
    const [errorText, setErrorText] = useState<string>("");
    const [chartVisible, setChartVisible] = useState<boolean>(false);
    const [chartData, setChartData] = useState<IChartData[]>([]);
    const resultsPerPage: number = 5;

    const ErrorTransition = useTransition(error, null, {
        from: { transform: "translate(-50%, -100%)", opacity: 0 },
        enter: { transform: "translate(-50%, -50%)", opacity: 1 },
        leave: { transform: "translate(-50%, -100%)", opacity: 0 },
    });

    const ChartTransition = useTransition(chartVisible, null, {
        from: { transform: "translateY(-25%)", opacity: 0 },
        enter: { transform: "translateY(0%)", opacity: 1 },
        leave: { transform: "translateY(-25%)", opacity: 0 },
    });

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
            })
            .catch(err => {
                setError(true);
                setErrorText(err.response.data);
                throw Error(err.message);
            })
            .then(() =>
                axios.get(
                    `/api/reporting/total_statistics?start_date=${startDate}&end_date=${endDate}`
                )
            )
            .then(response => {
                const { data } = response;
                setTotalStatistics(data);
            })
            .catch(err => {
                setError(true);
                setError(err.response.data);
                throw Error(err.message);
            });

        setCurrentPage(1);
    }, [startDate, endDate]);

    useEffect(() => updateChartData(dailyStats), [dailyStats]);

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

    const updateChartData = (dailyStats: IMappedDayStatistics[]) => {
        const updatedChartData: IChartData[] = dailyStats.length
            ? dailyStats.map((day: IMappedDayStatistics) => {
                  const {
                      date,
                      conversation_count,
                      missed_chat_count,
                      visitors_with_conversation_count,
                  } = day;
                  const regex: RegExp = /\d{2}\s\w{3}\s\d{4}/;
                  const regexMatch: RegExpMatchArray | null = date
                      .toUTCString()
                      .match(regex);
                  const dateString = regexMatch
                      ? regexMatch.toString()
                      : date.toUTCString();

                  return {
                      name: dateString,
                      conversation_count,
                      missed_chat_count,
                      visitors_with_conversation_count,
                  };
              })
            : [];
        setChartData(updatedChartData);
    };

    const handlePagination = (pageNumber: number) => setCurrentPage(pageNumber);
    const handleDirectionChange = (descendingDirection: boolean) =>
        setDescendingDirection(descendingDirection);

    const handleSetStartDate = (date: Date) => {
        if (date > endDate) {
            setError(true);
            setErrorText(
                "Please enter a valid start date, the start date cannot be after the end date."
            );
            setTimeout(() => setError(false), 3000);
            return;
        }
        setStartDate(date);
    };

    const handleSetEndDate = (date: Date) => {
        if (date < startDate) {
            setError(true);
            setErrorText(
                "Please enter a valid end date, the end date cannot be before the start date."
            );
            setTimeout(() => setError(false), 3000);
            return;
        }

        setEndDate(date);
    };

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
            {chartData.length > 0 && (
                <div className="chart-button-wrapper">
                    <button
                        className="chart-button"
                        onClick={() => setChartVisible(!chartVisible)}
                    >
                        {chartVisible ? "Hide chart" : "Show chart"}
                    </button>
                </div>
            )}
            {ChartTransition.map(
                ({ item, key, props }) =>
                    item && (
                        <animated.div
                            key={key}
                            style={props}
                            className="chart-wrapper"
                        >
                            <LineChart
                                width={800}
                                height={400}
                                data={chartData}
                                margin={{
                                    top: 5,
                                    right: 30,
                                    left: 10,
                                    bottom: 5,
                                }}
                            >
                                <XAxis dataKey="name" />
                                <YAxis />
                                <CartesianGrid strokeDasharray="3 3" />
                                <Legend />
                                <Tooltip position={{ x: -250, y: 0 }} />
                                <Line
                                    type="monotone"
                                    dataKey="conversation_count"
                                    stroke="#E15151"
                                />
                                <Line
                                    type="monotone"
                                    dataKey="missed_chat_count"
                                    stroke="#51E1E1"
                                />
                                <Line
                                    type="monotone"
                                    dataKey="visitors_with_conversation_count"
                                    stroke="#ED9726"
                                />
                            </LineChart>
                        </animated.div>
                    )
            )}

            {ErrorTransition.map(
                ({ item, key, props }) =>
                    item && (
                        <animated.div key={key} style={props} className="error">
                            {errorText}
                        </animated.div>
                    )
            )}
        </div>
    );
};

export default App;
