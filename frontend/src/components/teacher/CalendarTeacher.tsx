import React from 'react'
import { Scheduler } from "@aldabil/react-scheduler";
function CalendarTeacher() {
    return (
        <div>
            <Scheduler
                view="month"
                
                events={[
                    {
                        event_id: 1,
                        title: "Event 1",
                        start: new Date("2024/8/15 09:30"),
                        end: new Date("2024/8/15 10:30"),
                    },
                    {
                        event_id: 2,
                        disabled: false,
                        title: "Event 2",
                        start: new Date("2024/8/28 10:00"),
                        end: new Date("2024/8/28 11:00"),
                    },
                    {
                        event_id: 3,
                        title: "Event 3",
                        start: new Date("2024/8/15 10:30"),
                        end: new Date("2024/8/15 11:00"),
                    },
                ]}
            /></div>
    )
}

export default CalendarTeacher