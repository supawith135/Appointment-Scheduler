import { TimeSlotsInterface } from '../../interfaces/ITimeSlots';

interface ExistingTimeSlot {
  slot_start_time: Date;
  slot_end_time: Date;
}

export const isTimeSlotOverlapping = (
  newSlot: TimeSlotsInterface,
  existingSlots: ExistingTimeSlot[]
): boolean => {
  const newStart = newSlot.slot_start_time ? new Date(newSlot.slot_start_time) : null;
  const newEnd = newSlot.slot_end_time ? new Date(newSlot.slot_end_time) : null;

  // If newStart or newEnd is null, return false (no overlap)
  if (!newStart || !newEnd) return false;

  return existingSlots.some(existingSlot => {
    const existingStart = new Date(existingSlot.slot_start_time);
    const existingEnd = new Date(existingSlot.slot_end_time);

    // Check for overlap of time slots
    return (
      (newStart >= existingStart && newStart < existingEnd) ||
      (newEnd > existingStart && newEnd <= existingEnd) ||
      (newStart <= existingStart && newEnd >= existingEnd)
    );
  });
};

export const checkAndFilterOverlappingSlots = (
  newSlots: TimeSlotsInterface[],
  existingSlots: ExistingTimeSlot[]
): TimeSlotsInterface[] => {
  return newSlots.filter(newSlot => !isTimeSlotOverlapping(newSlot, existingSlots));
};
