import express, { Router, Request, Response } from "express";
import dotenv from "dotenv";
import { Cache } from "../../app";
import { validateQueryParams } from "../middleware/validateQueryParams";
import {
    IDayStatisticsNoDate,
    ITotalStatistics,
    IDayStatisticsDate,
    IMappedDayStatistics,
    IDailyStatisticResults,
    IDayStatistics,
} from "../../interfaces/interfaces";

const router: Router = express.Router();

dotenv.config();

router.get(
    "/total_statistics",
    validateQueryParams(["start_date", "end_date"]),
    (req: Request, res: Response) => {
        const start_date: Date = new Date(req.query.start_date);
        const end_date: Date = new Date(req.query.end_date);

        const data: any = Cache.get("data");

        if (!data) {
            const total_statistics: ITotalStatistics = {
                total_conversation_count: 0,
                total_user_message_count: 0,
                total_visitor_message_count: 0,
            };
            res.send(total_statistics);
            return;
        }

        const data_by_date: IDayStatisticsDate[] = data.by_date.map(
            (day: IDayStatistics) => {
                day.date = new Date(day.date);
                return day;
            }
        );

        const filtered_data: IDayStatisticsDate[] = data_by_date.filter(
            (day: IDayStatisticsDate) =>
                day.date.getTime() >= start_date.getTime() &&
                day.date.getTime() <= end_date.getTime()
        );

        const aggregated_data: IDayStatisticsNoDate = filtered_data.reduce(
            (newObj: IDayStatisticsNoDate, day: IDayStatisticsDate) => {
                // The dates are not needed when calculating the total data, they
                // are only used for filtering the right section of the whole raw data.
                const keys = Object.keys(day).filter(
                    key => key !== "date"
                ) as Array<keyof IDayStatisticsNoDate>;
                keys.forEach(key => {
                    newObj[key] = !newObj[key]
                        ? day[key]
                        : newObj[key] + day[key];
                });
                return newObj;
            },
            {} as IDayStatisticsNoDate
        );

        const total_statistics: ITotalStatistics = {
            total_conversation_count: aggregated_data.conversation_count || 0,
            total_user_message_count: aggregated_data.user_message_count || 0,
            total_visitor_message_count:
                aggregated_data.visitor_message_count || 0,
        };

        res.send(total_statistics);
    }
);

router.get(
    "/daily_statistics",
    validateQueryParams(["start_date", "end_date"]),
    (req: Request, res: Response) => {
        const start_date = new Date(req.query.start_date);
        const end_date = new Date(req.query.end_date);

        const data: any = Cache.get("data");

        if (!data) {
            const results: IDailyStatisticResults = {
                current_page: undefined,
                total_pages: 1,
                results: [],
            };
            res.send(results);
            return;
        }

        const data_by_date = data.by_date.map((day: any) => {
            day.date = new Date(day.date);
            return day;
        });

        // Helper function to filter objects by array of desired keys
        const pick = (obj: any, keys: string[]) => {
            return keys.reduce((newObj: any, key: string) => {
                newObj[key] = obj[key];
                return newObj;
            }, {});
        };

        const filtered_data: IDayStatisticsDate[] = data_by_date.filter(
            (day: IDayStatisticsDate) =>
                day.date >= start_date && day.date <= end_date
        );

        // Filter out unwanted object keys
        const mapped_data: IMappedDayStatistics[] = filtered_data.map(
            (day: IDayStatisticsDate) =>
                pick(day, [
                    "conversation_count",
                    "missed_chat_count",
                    "visitors_with_conversation_count",
                    "date",
                ])
        );

        // Don't parse the page to a number if it doesn't exist
        let page: number | undefined = req.query.page
            ? parseInt(req.query.page)
            : req.query.page;

        const resultsPerPage: number = 5;
        const pageCount: number = page
            ? Math.ceil(mapped_data.length / resultsPerPage)
            : 1;

        // Set the page to 1 if the user specifies a page below 1
        // Set the page to pageCount if the user specifies a page over pageCount
        if (page) {
            page = page < 1 ? 1 : page > pageCount ? pageCount : page;
        }

        const lastIndex: number = page ? page * resultsPerPage : 0;
        const firstIndex: number = page ? lastIndex - resultsPerPage : 0;
        // Show only 5 results per page and sort them by descending order
        const daily_results: IMappedDayStatistics[] = page
            ? mapped_data
                  .slice(firstIndex, lastIndex)
                  .sort((a, b) => b.date.getTime() - a.date.getTime())
            : mapped_data.sort((a, b) => b.date.getTime() - a.date.getTime());

        const results: IDailyStatisticResults = {
            current_page: page,
            total_pages: pageCount,
            results: daily_results,
        };

        res.send(results);
    }
);

export default router;
