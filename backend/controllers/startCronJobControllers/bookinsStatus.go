package startCronJobControllers

import (
    "log"
    "time"
    "github.com/supawith135/Appointment-Scheduler/config"
    "github.com/supawith135/Appointment-Scheduler/entity"

)

func UpdateBookingsStatus() error {
    db := config.DB() // ดึง instance ของ *gorm.DB
    var bookings []entity.Bookings
    now := time.Now()

    // ค้นหาการจองที่มี StatusID = 1 และ TimeSlots.SlotDate < เวลาปัจจุบัน
    if err := db.Joins("JOIN time_slots AS time_slots ON bookings.time_slot_id = time_slots.id").Where("bookings.status_id = ? AND time_slots.slot_date < ?", 1, now).Find(&bookings).Error; err != nil {
        log.Printf("Error finding bookings: %v", err)
        return err
    }

    // อัปเดต StatusID เป็น 3
    for _, booking := range bookings {
        // ตรวจสอบว่า StatusID ไม่เป็น 2 ก่อนอัปเดต
        if booking.StatusID != nil && *booking.StatusID != 2 {
            booking.StatusID = new(uint)
            *booking.StatusID = 3
            if err := db.Save(&booking).Error; err != nil {
                log.Printf("Error updating booking ID %d: %v", booking.ID, err)
                return err
            }
        }
    }

    log.Printf("%d bookings have been updated to status ID = 3", len(bookings))
    return nil
}