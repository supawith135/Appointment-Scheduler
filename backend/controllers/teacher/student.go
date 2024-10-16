package teacher

import (
	"log"
	"net/http"
	"github.com/gin-gonic/gin"
	"github.com/supawith135/Appointment-Scheduler/entity"
	"github.com/supawith135/Appointment-Scheduler/config"
)

func GetTeacherStudentByUserName(c *gin.Context) {
    userName := c.Param("user_name") // ใช้ user_name แทน ID

    var user entity.Users

    db := config.DB()

    results := db.Preload("Position").Preload("Role").Preload("Advisor").Preload("Gender").
        Where("role_id = ?", 1).
        Where("user_name = ?", userName). // ค้นหาตาม user_name
        First(&user)

    if results.Error != nil {
        log.Printf("Database query error: %v", results.Error)
        c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": results.Error.Error()})
        return
    }

    if user.ID == 0 {
        c.JSON(http.StatusNotFound, gin.H{"status": "error", "message": "Student not found"})
        return
    }

    c.JSON(http.StatusOK, gin.H{
        "status":  "success",
        "message": "Student retrieved successfully",
        "data":    user,
    })
}


func GetStudentInCharge(c *gin.Context) {
    // Get the student ID from the request parameters
    advisorID := c.Param("id")

    // Initialize the database connection
    db := config.DB()

    var Users []entity.Users

    // Query to get time slots with preloaded advisor, position, and role information
    err := db.
        Joins("JOIN users advisor ON advisor.id = users.advisor_id").
        Where("advisor.id = ?", advisorID).
        Find(&Users).Error

    if err != nil {
        log.Printf("Database query error: %v", err)
        c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": err.Error()})
        return
    }

    if len(Users) == 0 {
        c.JSON(http.StatusNotFound, gin.H{"status": "error", "message": "No time slots found for the specified advisor"})
        return
    }

    // Respond with the result
    c.JSON(http.StatusOK, gin.H{
        "status":  "success",
        "message": "Time slots retrieved successfully",
        "data":    Users,
    })
}

func GetStudentsList(c *gin.Context) {

	var users []entity.Users

	// Get the DB instance and Preload associated fields
	db := config.DB() // Get the DB instance

	results := db.Preload("Position").Preload("Role").Preload("Advisor.Position").Preload("Gender").Where("role_id = ?", 1).Find(&users)

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