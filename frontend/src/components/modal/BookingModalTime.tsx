import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { CreateBooking } from '../../services/https/student/booking';
import { BookingsInterface } from '../../interfaces/IBookings';
import Swal from "sweetalert2";
import { useNavigate } from 'react-router-dom';
interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (reason: string) => void;
    selectedTime: string | null;
    slotDetails: {
        time_slot_id: number;
        slot_date: string;
        slot_start_time: string;
        slot_end_time: string;
        is_available: boolean;
        title: string;
        location: string;
        advisor_name: string;
    } | null;
}



const ModalTime: React.FC<ModalProps> = ({ isOpen, onClose, selectedTime, slotDetails }) => {
    const [reason, setReason] = useState('');
    const modalRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
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

    const handleSubmit = async () => {
        if (!slotDetails) return; // ตรวจสอบว่า slotDetails มีอยู่

        const values: BookingsInterface = {
            user_id: Number(localStorage.getItem("id")),
            time_slot_id: slotDetails.time_slot_id,
            reason,
            status_id: 1,
            // คุณสามารถเพิ่มฟิลด์อื่นๆ ที่จำเป็นได้ที่นี่
        };

        let res = await CreateBooking(values);
        console.log(res);
        if (res.status === 201) {
            Swal.fire({
                title: "Success",
                text: "จองสำเร็จ !",
                icon: "success",
                timer: 4000,
            }).then(() => {
                navigate("/Student/History");
            });
        } else {
            Swal.fire({
                title: "ไม่สามารถจองได้",
                text: res.message,
                icon: "error",
                timer: 4000,
            });
        }

        // Reset state and close modal
        setReason('');
        onClose();
    };
    if (!isOpen) return null;
    return (
        <div className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'} duration-300`}>
            <div
                ref={modalRef}
                className={`bg-white p-6 rounded-md shadow-lg w-80 transition-transform ${isOpen ? 'transform scale-100' : 'transform scale-90'} duration-300`}
            >


                {slotDetails && (
                    <>
                        {/* Convert slot_date to Thai format */}
                        <p>Time Slot ID: {slotDetails.time_slot_id}</p>
                        <h2 className="text-lg mb-4 text-red-700">{slotDetails.title}</h2>
                        <p className="mb-4 text-sm text-gray-600">
                            วันที่: {new Date(slotDetails.slot_date).toLocaleDateString('th-TH', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </p>

                        {/* Convert slot_start_time and slot_end_time to time format */}
                        <p className="mb-2 text-sm text-gray-600">
                            เวลา: {new Date(slotDetails.slot_start_time).toLocaleTimeString('th-TH', {
                                hour: '2-digit',
                                minute: '2-digit',
                            })} – {new Date(slotDetails.slot_end_time).toLocaleTimeString('th-TH', {
                                hour: '2-digit',
                                minute: '2-digit',
                            })} น.
                        </p>

                        <p className="mb-2 text-sm text-gray-600">อาจารย์: {slotDetails.advisor_name}</p>
                        <p className="mb-2 text-sm text-gray-600">สถานที่: {slotDetails.location}</p>

                    </>
                )}
                <h2 className="text-lg mb-4 text-red-700">ระบุสาเหตุที่เข้าพบ</h2>
                <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={3}
                    className="w-full p-2 border border-gray-300 rounded-md mb-4 bg-white focus:outline-none focus:ring-2 focus:ring-red-700"
                    placeholder="กรุณากรอกรายละเอียด..."
                />

                <div className="flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 rounded-md hover:text-red-400">ยกเลิก</button>
                    <button onClick={handleSubmit} className="bg-red-700 text-white px-4 py-2 rounded-md hover:bg-ENGi-Red transition duration-300 ease-in-out">
                        จอง
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalTime;
