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

    // Get the current date
    now := time.Now()
    today := now.Format("2006-01-02") // Format the date to YYYY-MM-DD

    // Update availability for time slots ending today
    err := db.Model(&timeSlots).
        Where("DATE(slot_end_time) = ?", today).
        Update("is_available", false).Error
    if err != nil {
        log.Printf("Error updating time slots availability: %v", err)
        return err
    }
    
    log.Println("Time slots availability updated successfully for today's date.")
    return nil
}