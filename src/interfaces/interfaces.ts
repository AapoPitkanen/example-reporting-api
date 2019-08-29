export interface IDayStatistics {
    chats_from_autosuggest_count: number;
    chats_from_user_count: number;
    chats_from_visitor_count: number;
    conversation_count: number;
    date: string | Date;
    missed_chat_count: number;
    user_message_count: number;
    visitor_message_count: number;
    visitors_affected_by_chat_count: number;
    visitors_autosuggested_count: number;
    visitors_with_chat_count: number;
    visitors_with_conversation_count: number;
}

export interface IDayStatisticsDate {
    chats_from_autosuggest_count: number;
    chats_from_user_count: number;
    chats_from_visitor_count: number;
    conversation_count: number;
    date: Date;
    missed_chat_count: number;
    user_message_count: number;
    visitor_message_count: number;
    visitors_affected_by_chat_count: number;
    visitors_autosuggested_count: number;
    visitors_with_chat_count: number;
    visitors_with_conversation_count: number;
}

export interface IDayStatisticsNoDate {
    chats_from_autosuggest_count: number;
    chats_from_user_count: number;
    chats_from_visitor_count: number;
    conversation_count: number;
    missed_chat_count: number;
    user_message_count: number;
    visitor_message_count: number;
    visitors_affected_by_chat_count: number;
    visitors_autosuggested_count: number;
    visitors_with_chat_count: number;
    visitors_with_conversation_count: number;
}

export interface ITotalStatistics {
    total_conversation_count: number;
    total_user_message_count: number;
    total_visitor_message_count: number;
}

export interface IMappedDayStatistics {
    conversation_count: number;
    missed_chat_count: number;
    visitors_with_conversation_count: number;
    date: Date;
}

export interface IDailyStatisticResults {
    current_page: number | undefined;
    total_pages: number;
    results: IMappedDayStatistics[];
}
