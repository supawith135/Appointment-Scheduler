import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreateBooking } from '../../services/https/student/booking';
import { BookingsInterface } from '../../interfaces/IBookings';
import Swal from "sweetalert2";
import { useNavigate } from 'react-router-dom';
import { TimeSlotsInterface } from '../../interfaces/ITimeSlots';
import { DeleteTimeSlotById } from '../../services/https/teacher/timeSlot';
interface ModalProps {

    isOpen: boolean;
    onClose: () => void;
    onSubmit: (reason: string) => void;
    selectedTime: string | null;
    slotDetails: TimeSlotsInterface | null;
}

const ModalDeleteTimeSlotByID: React.FC<ModalProps> = ({isOpen, onClose, slotDetails}) => {
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
        if (!slotDetails) return;
        const id = String(slotDetails.ID)
        let res = await DeleteTimeSlotById(id);
        if (res.status === 200) {
            Swal.fire({
                title: "ยกเลิกสำเร็จ!",
                text: "การยกเลิกของคุณได้รับการยืนยันแล้ว",
                icon: "success",
                showConfirmButton: false,
                timer: 2000,
                background: '#f0f0f0',
                iconColor: '#4CAF50',
                customClass: {
                    popup: 'animated zoomIn'
                }
            }).then(() => {
                window.location.reload();
            });
        } else {
            Swal.fire({
                title: "ไม่สามารถยกเลิกได้",
                text: res.data.message,
                icon: "error",
                confirmButtonColor: '#d33',
                background: '#f0f0f0',
                iconColor: '#d33',
                customClass: {
                    popup: 'animated shake'
                }
            });
        }

        setReason('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
                >
                    <motion.div
                        ref={modalRef}
                        initial={{ scale: 0.9, y: 50 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 50 }}
                        transition={{ type: "spring", damping: 15 }}
                        className="bg-white p-8 rounded-lg shadow-2xl w-96 max-w-90vw"
                    >
                        {slotDetails && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <h2 className="text-2xl font-bold mb-4 text-red-700">{slotDetails.title}</h2>
                                <p className="mb-3 text-gray-700">
                                    <span className="font-semibold">วันที่:</span> {new Date(slotDetails.slot_date!).toLocaleDateString('th-TH', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                    
                                </p>
                                <p className="mb-3 text-gray-700">
                                    <span className="font-semibold">เวลา:</span> {new Date(slotDetails.slot_start_time!).toLocaleTimeString('th-TH', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })} – {new Date(slotDetails.slot_end_time!).toLocaleTimeString('th-TH', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })} น.
                                </p>
                                <p className="mb-3 text-gray-700"><span className="font-semibold">อาจารย์:</span> {slotDetails.user?.position?.position_name} {slotDetails.user?.full_name}</p>
                                <p className="mb-6 text-gray-700"><span className="font-semibold">สถานที่:</span> {slotDetails.location}</p>
                              
                            </motion.div>
                        )}
                        <motion.div
                            className="flex justify-end gap-3"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                        >
                            {/* <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={onClose}
                                className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition duration-300 ease-in-out"
                            >
                                ยกเลิก
                            </motion.button> */}
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleSubmit}
                                className="bg-red-700 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300 ease-in-out"
                            >
                                ยกเลิกเวลา
                            </motion.button>
                        </motion.div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ModalDeleteTimeSlotByID;