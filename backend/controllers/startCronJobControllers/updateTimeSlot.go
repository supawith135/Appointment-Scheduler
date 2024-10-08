package startCronJobControllers

import (
    "log"
    "time"
    "github.com/supawith135/Appointment-Scheduler/config"
    "github.com/supawith135/Appointment-Scheduler/entity"
)

// func UpdateTimeSlotsAvailability() error {
//     db := config.DB()
//     var timeSlots []entity.TimeSlots

//     // Get the current time
//     now := time.Now()

//     // Update availability for past time slots
//     err := db.Model(&timeSlots).Where("slot_end_time < ?", now).Update("is_available", false).Error
//     if err != nil {
//         log.Printf("Error updating time slots availability: %v", err)
//         return err
//     }
    
//     log.Println("Time slots availability updated successfully.")
//     return nil
// }

func UpdateTimeSlotsAvailability() error {
    db := config.DB()
    var timeSlots []entity.TimeSlots

    // Get the current time
    now := time.Now()

    // Update availability for time slots where slot_end_time has passed and is still available
    err := db.Model(&timeSlots).
        Where("slot_end_time <= ? AND is_available = ?", now, true).
        Update("is_available", false).Error
    if err != nil {
        log.Printf("Error updating time slots availability: %v", err)
        return err
    }

    log.Println("Time slots availability updated successfully for slots with passed end times.")
    return nil
}

