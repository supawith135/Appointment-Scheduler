import { id } from 'date-fns/locale';
import React, { useState } from 'react';
import { ScheduleMeeting } from 'react-schedule-meeting';



function CreateTimeSlot() {


    const availableTimeslots = [0, 1, 3, 4, 5].map((id) => {
        return {
            id,
            startTime: new Date(new Date(new Date().setDate(new Date().getDate() + id)).setHours(9, 0, 0, 0)),
            endTime: new Date(new Date(new Date().setDate(new Date().getDate() + id)).setHours(12, 0, 0, 0)),
        };
    });
    

 

    return (
        <div>
            <ScheduleMeeting 
            borderRadius={20}
            primaryColor="#3f5b85"
            eventDurationInMinutes={10}
            availableTimeslots={availableTimeslots}
            startTimeListStyle = {"scroll-list"}
            lang_confirmButtonText = "Confirm"
        />
        </div>
    );
}

export default CreateTimeSlot;
