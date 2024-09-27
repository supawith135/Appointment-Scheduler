package admin

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/supawith135/Appointment-Scheduler/config"
	"github.com/supawith135/Appointment-Scheduler/entity"
)

func GetStudentsList(c *gin.Context) {

	var users []entity.Users

	// Get the DB instance and Preload associated fields
	db := config.DB() // Get the DB instance

	results := db.Preload("Position").Preload("Role").Preload("Advisor").Preload("Gender").Where("role_id = ?", 1).Find(&users)

	// Log and return detailed error if something goes wrong
	if results.Error != nil {
		log.Printf("Database query error: %v", results.Error)
		c.JSON(http.StatusNotFound, gin.H{"status": "error", "message": results.Error.Error()})
		return
	}

	// Return users in JSON format
	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "Students List successfully",
		"data":    users,
	})
}

func GetStudentById(c *gin.Context) {

	ID := c.Param("id")

	var user entity.Users

	db := config.DB()

	results := db.Preload("Position").Preload("Role").Preload("Advisor").Preload("Gender").Where("role_id = ?", 1).First(&user, ID)
	if results.Error != nil {
		log.Printf("Database query error: %v", results.Error)
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": results.Error.Error()})
		return
	}

	if user.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"status": "error", "message": "StudentID not found"})
		return

	}
	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "Student retrieved successfully",
		"data":    user,
	})

}

// ดึงข้อมูลรายชื่ออาจารย์
func GetTeachersList(c *gin.Context) {
	var users []entity.Users

	db := config.DB()

	results := db.Preload("Position").Preload("Role").Preload("Advisor").Preload("Gender").Where("role_id = ?", 2).Find(&users)
	if results.Error != nil {
		log.Printf("Database query error: %v", results.Error)
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": results.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "Teachers retrieved successfully",
		"data":    users,
	})
}
// ดึงข้อมูลรายชื่ออาจารย์ด้วย ID
func GetAdminTeacherById(c *gin.Context) {

	ID := c.Param("id")

	var user entity.Users

	db := config.DB()

	results := db.Preload("Position").Preload("Role").Preload("Advisor").Preload("Gender").Where("role_id = ?", 2).First(&user, ID)
	if results.Error != nil {
		log.Printf("Database query error: %v", results.Error)
		c.JSON(http.StatusNotFound, gin.H{"status": "error", "message": results.Error.Error()})
		return
	}

	if user.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"status": "error", "message": "Teacher not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "Teacher retrieved successfully",
		"data":    user,
	})
}
