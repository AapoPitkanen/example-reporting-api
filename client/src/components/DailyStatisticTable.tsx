import React from "react";
import { IMappedDayStatistics } from "../interfaces/interfaces";

interface DailyStatisticTableProps {
    descendingDirection: boolean;
    setDescendingDirection: Function;
    currentDailyStats: IMappedDayStatistics[];
}

const DailyStatisticTable: React.FC<DailyStatisticTableProps> = ({
    descendingDirection,
    setDescendingDirection,
    currentDailyStats,
}) => {
    return (
        <div className="table-wrapper">
            <table className="table table-dark">
                <tbody>
                    <tr>
                        <th scope="col">Conversation count</th>
                        <th scope="col">Missed chat count</th>
                        <th scope="col">Visitors with conversation count</th>
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
                                <td>{day.visitors_with_conversation_count}</td>
                                <td>{day.date.toDateString()}</td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    );
};

export default DailyStatisticTable;
