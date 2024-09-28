package student

import (
	"log"
	"net/http"
	_"time"

	"github.com/gin-gonic/gin"
	"github.com/supawith135/Appointment-Scheduler/config"
	"github.com/supawith135/Appointment-Scheduler/entity"
)

func GetStudentWithAdvisorById(c *gin.Context) {
    // Initialize the database connection
    db := config.DB()

    // Get student ID from the request (assuming it's passed as a parameter)
    studentID := c.Param("id")

    var student entity.Users

    // Query to get the student with their advisor's and position's details
    err := db.
        Where("id = ?", studentID).  // Filter the student by their ID
        Preload("Advisor").
		Preload("Advisor.Position"). // Preload the associated Advisor      // Preload the associated Position
        Preload("Role").              // Preload the associated Role
        First(&student).Error         // Retrieve the first matched student
    if err != nil {
        log.Printf("Database query error: %v", err)
        c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": err.Error()})
        return
    }

    // Respond with the result
    c.JSON(http.StatusOK, gin.H{
        "status":  "success",
        "message": "Student with advisor and position retrieved successfully",
        "data":    student,
    })
}
