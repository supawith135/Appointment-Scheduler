package teacher

import (
	"fmt"

	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/supawith135/Appointment-Scheduler/config"
	"github.com/supawith135/Appointment-Scheduler/entity"

)

// CreateBookingTeacher creates a new booking for a teacher.
func CreateBookingTeacher(c *gin.Context) {
	var booking entity.Bookings
	var student_id entity.Users
	var created_by_id entity.Users
	var status entity.Statuses

	db := config.DB() // Get the DB instance

	// Bind JSON input to booking struct
	if err := c.ShouldBindJSON(&booking); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	fmt.Println("Received booking:", booking) // Log received booking data

	// Check if the student_id  exists
	if tx := db.Where("id = ?", booking.UserID).First(&student_id); tx.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"status": "error", "message": "ไม่พบการค้นหารายชื่อนักเรียน"})
		return
	}
	// Check if the created_by_id exists
	if tx := db.Where("id = ?", booking.UserID).First(&created_by_id); tx.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"status": "error", "message": "ไม่พบการค้นหารายชื่ออาจารย์"})
		return
	}

	// Check if the status ID exists
	if tx := db.Where("id = ?", booking.StatusID).First(&status); tx.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"status": "error", "message": "ไม่พบสถานะที่ระบุ"})
		return
	}

	newBooking := entity.Bookings{
	   Comment: booking.Comment,
	   CreatedByID: booking.CreatedByID,
	   Location: booking.Location,
	   StatusID: booking.StatusID,
	   Reason: booking.Reason,
	   UserID: booking.UserID,
    }

	// Create the booking in the database
	if err := db.Create(&newBooking).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "Booking created successfully",
		"data":    newBooking,
	})
}