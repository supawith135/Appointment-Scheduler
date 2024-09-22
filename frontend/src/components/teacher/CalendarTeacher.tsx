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
                        start: new Date("2024-09-22 02:00:00+07"),
                        end: new Date("2024-09-22 02:15:00+07"),
                        editable: false,
                        deletable: false,
                        subtitle : "sdfdsfadsadasdsa"
                    },
                    {
                        event_id: 2,
                    
                        title: "Event 2",
                        start: new Date("2024-09-22 01:30:00+07"),
                        end: new Date("2024-09-22 01:45:00+07"),
                        editable: false,
                        deletable: false
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