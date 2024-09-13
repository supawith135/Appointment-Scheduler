package student
import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/supawith135/Appointment-Scheduler/config"
	"github.com/supawith135/Appointment-Scheduler/entity"
)

// ดึงข้อมูล Timeslot ทั้งหมด
func GetListTimeSlots(c *gin.Context) {

	var timeSlots []entity.TimeSlots

	db := config.DB()

	results := db.Preload("User").Find(&timeSlots)
	if results.Error != nil {
		log.Printf("Database query error: %v", results.Error)
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": results.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "Time slots retrieved successfully",
		"data":    timeSlots,
	})
}