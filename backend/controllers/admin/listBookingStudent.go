package admin

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/supawith135/Appointment-Scheduler/config"
	"github.com/supawith135/Appointment-Scheduler/entity"
)
func GetBookingStudentListByTeacherID(c *gin.Context) {
	// Get the AdvisorID from the URL parameters
	AdvisorID := c.Param("id")

	var bookings []entity.Bookings

	// Get the database connection
	db := config.DB()

	// SELECT users.full_name, users.user_name, bookings.*
	//     FROM bookings
	//     JOIN time_slots ON time_slots.id = bookings.time_slot_id
	//     JOIN users ON users.id = bookings.user_id
	//     WHERE time_slots.user_id = ?, AdvisorID

	// Query for bookings where the time_slots.user_id matches the provided AdvisorID
	results := db.Preload("User").Preload("User.Advisor").Preload("TimeSlot").Preload("Status").
		Joins("JOIN time_slots ON time_slots.id = bookings.time_slot_id").
		Where("time_slots.user_id = ?", AdvisorID).
		Find(&bookings)

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

