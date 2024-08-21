// src/modal/ModalTime.tsx
import React, { useState, useEffect, useRef } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
  selectedTime: string | null;
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
        <h2 className="text-lg font-NotoSans mb-4 text-red-700">ระบุสาเหตุที่เข้าพบ</h2>
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
            className=" px-4 py-2 rounded-md hover:text-red-400 font-NotoSans"
          >
            ยกเลิก
          </button>
          <button
            onClick={handleSubmit}
            className="bg-red-700 text-white px-4 py-2 rounded-md hover:bg-ENGi-Red font-NotoSans transition duration-300 ease-in-out"
          >
            จอง
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalTime;
