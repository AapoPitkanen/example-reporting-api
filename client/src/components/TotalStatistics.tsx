import React from "react";
import { animated } from "react-spring";

// React Spring doesn't seem to have proper typings yet for the useSpring stuff so had to go with any.
interface TotalStatisticsProps {
    totalConversationCount: any;
    totalUserMessageCount: any;
    totalVisitorMessageCount: any;
}

const TotalStatistics: React.FC<TotalStatisticsProps> = ({
    totalConversationCount,
    totalUserMessageCount,
    totalVisitorMessageCount,
}) => {
    return (
        <div className="total-statistics-wrapper">
            <div className="statistics-card total-conversation-count">
                <animated.span className="statistics-number">
                    {totalConversationCount.number.interpolate(
                        (number: number) => Math.floor(number)
                    )}
                </animated.span>
                <span>Total conversation count</span>
            </div>
            <div className="statistics-card total-user-message-count">
                <animated.span className="statistics-number">
                    {totalUserMessageCount.number.interpolate(
                        (number: number) => Math.floor(number)
                    )}
                </animated.span>
                <span>Total user message count</span>
            </div>
            <div className="statistics-card total-visitor-message-count">
                <animated.span className="statistics-number">
                    {totalVisitorMessageCount.number.interpolate(
                        (number: number) => Math.floor(number)
                    )}
                </animated.span>
                <span>Total visitor message count</span>
            </div>
        </div>
    );
};

export default TotalStatistics;