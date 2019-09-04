export interface IMappedDayStatistics {
    conversation_count: number;
    missed_chat_count: number;
    visitors_with_conversation_count: number;
    date: Date;
}

export interface ITotalStatistics {
    total_conversation_count: number;
    total_user_message_count: number;
    total_visitor_message_count: number;
}

export interface IChartData {
    name: string;
    conversation_count: number;
    missed_chat_count: number;
    visitors_with_conversation_count: number;
}
