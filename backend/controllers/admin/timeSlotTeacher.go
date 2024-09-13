package admin

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

// ดึงข้อมูล Timeslot โดย ID
func GetTimeSlotById(c *gin.Context) {

	ID := c.Param("id")

	var timeSlot entity.TimeSlots

	db := config.DB()

	results := db.Preload("User").Find(&timeSlot, ID)
	if results.Error != nil {
		log.Printf("Database query error: %v", results.Error)
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": results.Error.Error()})
		return
	}

	if timeSlot.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"status": "error", "message": "TimeSlot not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "Time slot retrieved successfully",
		"data":    timeSlot,
	})
}