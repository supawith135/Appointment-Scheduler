import { useEffect, useState } from 'react';
import { Scheduler } from "@aldabil/react-scheduler";
import { GetBookingStudentListByAdvisorID } from '../../services/https/teacher/listBookingStudent';
import { BookingsInterface } from '../../interfaces/IBookings';
import { colors } from '@mui/material';
import { SxProps } from '@mui/system';
import { motion } from 'framer-motion';

interface EventInterface {
    event_id: number;
    title: string;
    start: Date;
    end: Date;
    editable?: boolean;
    deletable?: boolean;
    subtitle?: string;
    color?: string;
    textColor?: string;
    sx?: SxProps;
}

function CalendarTeacher() {
    const [bookingsData, setBookingsData] = useState<BookingsInterface[]>([]);
    const [events, setEvents] = useState<EventInterface[]>([]); // Explicit type

    const getBookingStudentListByAdvisorID = async (id: string) => {
        try {
            const res = await GetBookingStudentListByAdvisorID(id);
            if (res.status === 200) {
                const bookings = res.data.data; // Access the correct data field
                setBookingsData(bookings);
                console.log("GetBookingByStudent data:", bookings);
            } else {
                console.error("Expected an array but got:", res.data);
            }
        } catch (error) {
            console.error("Error getting booking by ID:", error);
        }
    };

    useEffect(() => {
        const formattedEvents = bookingsData.map((booking) => {
            let eventColor;
            let eventTextColor = 'white'; // กำหนดสีตัวอักษร

            switch (booking.status?.status) {
                case 'รอการเข้าพบ':
                    eventColor = '#eab308'; // สีเหลือง
                    break;
                case 'เข้าพบสำเร็จ':
                    eventColor = '#16a34a'; // สีเขียว
                    break;
                case 'ไม่ได้เข้าพบ':
                    eventColor = '#b91c1c'; // สีแดง
                    break;
                default:
                    eventColor = '#2563eb'; // สีเริ่มต้นถ้าไม่มีสถานะ
                    eventTextColor = 'black'; // สีตัวอักษรเริ่มต้น
                    break;
            }

            return {
                event_id: booking.ID || 0,
                title: booking.time_slot?.title || "No Title",
                start: new Date(booking.time_slot?.slot_start_time || ""),
                end: new Date(booking.time_slot?.slot_end_time || ""),
                editable: false,
                deletable: false,
                subtitle: "dsfsdflmsdf",
                color: eventColor, // ตั้งค่าสีพื้นหลัง
                textColor: eventTextColor, // ตั้งค่าสีตัวอักษร
                sx: {

                    borderRadius: '1px',
                    padding: '2px',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                        transform: 'scale(1.05)',
                        boxShadow: '0 8px 10px rgba(0, 0, 0, 0.3)',
                    },
                },
            };
        });
        setEvents(formattedEvents);
    }, [bookingsData]);

    useEffect(() => {
        const id = String(localStorage.getItem('id'));
        getBookingStudentListByAdvisorID(id);
    }, []);

    return (
        <div>
            <Scheduler
                view="month"
                events={events} // Use typed events here
                
                hourFormat= "24"
                timeZone='Asia/Bangkok'
            />
        </div>
    );
}

export default CalendarTeacher;
