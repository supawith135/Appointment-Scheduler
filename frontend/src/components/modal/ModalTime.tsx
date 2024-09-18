import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (reason: string) => void;
    selectedTime: string | null;
}

interface MeetingDetails {
    id: string;
    selectedTime: string | null;
    endTime: string | null;
    reason: string;
    student_id: number;
    status_id: number;
    time_slot_id: number;
}

const ModalTime: React.FC<ModalProps> = ({ isOpen, onClose, onSubmit, selectedTime }) => {
    const [reason, setReason] = useState('');
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    const handleSubmit = () => {
        let endTime = null;

        if (selectedTime) {
            const timePart = selectedTime.split(' ')[1] + " " + selectedTime.split(' ')[2]; // "1:00 PM"
            const [time, period] = timePart.split(' ');
            let [hours, minutes] = time.split(':').map(Number);

            // Convert to 24-hour format if needed
            if (period === "PM" && hours < 12) hours += 12;
            if (period === "AM" && hours === 12) hours = 0;

            // Create a new Date object based on selectedTime
            const selectedDate = new Date();
            selectedDate.setHours(hours, minutes);

            // Add 30 minutes to the selected time
            selectedDate.setMinutes(selectedDate.getMinutes() + 30);

            // Format endTime as HH:mm
            const endHours = String(selectedDate.getHours()).padStart(2, '0');
            const endMinutes = String(selectedDate.getMinutes()).padStart(2, '0');
            endTime = `${endHours}:${endMinutes}`;
        }

        const meetingDetails: MeetingDetails = {
            id: uuidv4(), // Generate a unique ID
            selectedTime,
            endTime,
            reason,
            student_id: 1, // Hardcoded value
            status_id: 1,  // Hardcoded value
            time_slot_id: 2, // Hardcoded value
        };

        console.log('Meeting Details:', meetingDetails); // Log the full data structure

        onSubmit(reason);
        setReason(''); // Clear input
        onClose(); // Close modal
    };



    if (!isOpen) return null;

    return (
        <div className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'} duration-300`}>
            <div
                ref={modalRef}
                className={`bg-white p-6 rounded-md shadow-lg w-80 transition-transform ${isOpen ? 'transform scale-100' : 'transform scale-90'} duration-300`}
            >
                <h2 className="text-lg  mb-4 text-red-700">ระบุสาเหตุที่เข้าพบ</h2>
                {selectedTime && (
                    <p className="mb-4 text-sm text-gray-600">Selected Time: {selectedTime}</p>
                )}
                <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={3}
                    className="w-full p-2 border border-gray-300 rounded-md mb-4 bg-white focus:outline-none focus:ring-2 focus:ring-red-700"
                    placeholder="กรุณากรอกรายละเอียด..."
                />
                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className=" px-4 py-2 rounded-md hover:text-red-400 "
                    >
                        ยกเลิก
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="bg-red-700 text-white px-4 py-2 rounded-md hover:bg-ENGi-Red  transition duration-300 ease-in-out"
                    >
                        จอง
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalTime;
