package student

import (
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/supawith135/Appointment-Scheduler/config"
	"github.com/supawith135/Appointment-Scheduler/entity"
)

// ดึงข้อมูล Timeslot ทั้งหมด
func GetListBookingAdvisorById(c *gin.Context) {
	// Get the advisor ID from the request parameters
	student_id := c.Param("id")

	// Initialize the database connection
	db := config.DB()

	var results []struct {
		NameStudent   string    `json:"name_student"`
		AdvisorID     uint      `json:"advisor_id"`
		AdvisorName   string    `json:"advisor_name"`
		TimeSlotID    uint      `json:"time_slot_id"`
		Title         string    `json:"title"`
		Location      string    `json:"location"`
		IsAvailable   bool      `json:"is_available"`
		SlotDate      time.Time `json:"slot_date"`
		SlotStartTime time.Time `json:"slot_start_time"`
		SlotEndTime   time.Time `json:"slot_end_time"`
	}

	err := db.Table("time_slots").
		Select("users.full_name as name_student, users.advisor_id as advisor_id, advisors.full_name as advisor_name, time_slots.id as time_slot_id, time_slots.title, time_slots.location, time_slots.is_available, time_slots.slot_date, time_slots.slot_start_time, time_slots.slot_end_time").
		Joins("INNER JOIN users ON time_slots.user_id = users.advisor_id").
		Joins("INNER JOIN users AS advisors ON advisors.id = users.advisor_id").
		Where("users.id = ? and time_slots.is_available = true", student_id).
		Find(&results).Error
	if err != nil {
		log.Printf("Database query error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": err.Error()})
		return
	}

	if len(results) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"status": "error", "message": "No time slots found for the specified advisor"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "Time slots retrieved successfully",
		"data":    results,
	})
}

// ดึงข้อมูล Timeslot โดย ID
func GetBookingByStudentID(c *gin.Context) {
	// Get the user_id from the URL parameters
	UserID := c.Param("id")

	var bookings []entity.Bookings

	// Get the database connection
	db := config.DB()

	// Query for bookings with the provided user_id and preload related fields
	results := db.Preload("User").Preload("User.Advisor").Preload("TimeSlot").Preload("Status").
	    Where("user_id = ?", UserID).Find(&bookings)

	// Check if there's any error in the query
	if results.Error != nil {
	    log.Printf("Database query error: %v", results.Error)
	    c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": results.Error.Error()})
	    return
	}

	// Check if any bookings were found
	if len(bookings) == 0 {
	    c.JSON(http.StatusNotFound, gin.H{"status": "error", "message": "bookings not found"})
	    return
	}

	// Return the retrieved bookings in JSON format
	c.JSON(http.StatusOK, gin.H{
	    "status":  "success",
	    "message": "Bookings retrieved successfully",
	    "data":    bookings,
	})
}

// สร้างข้อมูล Booking
func CreateBooking(c *gin.Context) {
	var booking entity.Bookings

	// Bind JSON to the booking struct
	if err := c.ShouldBindJSON(&booking); err != nil {
		log.Printf("JSON binding error: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "Invalid input"})
		return
	}
	db := config.DB()
	// Start a transaction
	tx := db.Begin()

	// Check if the user exists
	var user entity.Users
	result := tx.First(&user, "id = ?", booking.StatusID)
	if result.Error != nil {
		tx.Rollback()
		log.Printf("Database query error: %v", result.Error)
		c.JSON(http.StatusNotFound, gin.H{"status": "error", "message": "UserID not found"})
		return
	}

	// Check if the time slot exists and is available
	var timeSlot entity.TimeSlots
	result = tx.First(&timeSlot, "id = ? AND is_available = true", booking.TimeSlotID)
	if result.Error != nil {
		tx.Rollback()
		log.Printf("Database query error: %v", result.Error)
		c.JSON(http.StatusNotFound, gin.H{"status": "error", "message": "Time slot not available"})
		return
	}

	// Create the booking
	result = tx.Create(&booking)
	if result.Error != nil {
		tx.Rollback()
		log.Printf("Database create error: %v", result.Error)
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Failed to create booking"})
		return
	}

	// Update the time slot to mark it as unavailable
	result = tx.Model(&timeSlot).Where("id = ?", booking.TimeSlotID).Update("is_available", false)
	if result.Error != nil {
		tx.Rollback()
		log.Printf("Database update error: %v", result.Error)
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Failed to update time slot"})
		return
	}

	// Commit the transaction
	tx.Commit()

	c.JSON(http.StatusCreated, gin.H{
		"status":  "success",
		"message": "Booking created successfully",
		"data":    booking,
	})
}
