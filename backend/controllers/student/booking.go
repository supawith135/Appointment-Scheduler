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
func GetBookingByStudentId(c *gin.Context) {
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

func GetBookingById(c *gin.Context) {

	BookingID := c.Param("id")

	var booking entity.Bookings

	db := config.DB()

	results := db.Preload("User").Preload("Status").Preload("TimeSlot").First(&booking, BookingID)
	if results.Error != nil {
		log.Printf("Database query error: %v", results.Error)
		c.JSON(http.StatusNotFound, gin.H{"status": "error", "message": results.Error.Error()})
		return
	}

	if booking.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"status": "error", "message": "Booking not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "Booking retrieved successfully",
		"data":    booking,
	})
}
// ลบข้อมูล TimeSlot โดย ID
func DeleteBookingById(c *gin.Context) {
	id := c.Param("id")

	db := config.DB()

	// Begin a transaction
	tx := db.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	var booking entity.Bookings

	// First, find the booking
	if err := tx.First(&booking, id).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusNotFound, gin.H{"status": "error", "message": "Booking not found"})
		return
	}

	// Delete the booking
	result := tx.Delete(&booking)
	if result.Error != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Failed to delete booking"})
		return
	}

	// Update the corresponding time slot to set IsAvailable to true
	var timeslot entity.TimeSlots
	if err := tx.Model(&timeslot).Where("id = ?", booking.TimeSlotID).Update("is_available", true).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Failed to update time slot availability"})
		return
	}

	// Commit the transaction
	tx.Commit()

	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "Booking deleted successfully, time slot updated",
	})
}

func GetTimeSlotsByTeacherId(c *gin.Context) {
    TeacherID := c.Param("id") // ดึง user_id จาก URL parameter

    var timeSlots []entity.TimeSlots

    // ดึง Database connection
    db := config.DB()

    // Query ข้อมูล time_slots ที่มี user_id ตรงกับที่ระบุ และ Preload ตาราง Users
    results := db.Preload("User").Preload("User.Position").Preload("User.Role").Preload("User.Gender").Preload("User.Advisor").
        Where("user_id = ?", TeacherID).Find(&timeSlots)

    // ตรวจสอบว่ามีข้อผิดพลาดใน query หรือไม่
    if results.Error != nil {
        log.Printf("Database query error: %v", results.Error)
        c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": results.Error.Error()})
        return
    }

    // ตรวจสอบว่าข้อมูลว่างหรือไม่ (กรณีที่ไม่มี TimeSlots)
    if len(timeSlots) == 0 {
        c.JSON(http.StatusNotFound, gin.H{"status": "error", "message": "No time slots found for this user"})
        return
    }

    // ส่งผลลัพธ์ในรูปแบบ JSON เมื่อมีข้อมูล
    c.JSON(http.StatusOK, gin.H{
        "status":  "success",
        "message": "Time slots retrieved successfully",
        "data":    timeSlots,
    })
}
