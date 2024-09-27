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