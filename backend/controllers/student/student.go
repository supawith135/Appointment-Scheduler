package student

import (
	"github.com/gin-gonic/gin"
	"github.com/supawith135/Appointment-Scheduler/config"
	"github.com/supawith135/Appointment-Scheduler/entity"
	"golang.org/x/crypto/bcrypt"
	"log"
	"net/http"
)

// ฟังก์ชันสำหรับการ hash รหัสผ่าน
func hashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	return string(bytes), err
}

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

// ฟังก์ชันสำหรับการอัพเดทข้อมูลนักศึกษา
func UpdateStudentById(c *gin.Context) {
	var user entity.Users
    userID := c.Param("id")

    db := config.DB()

    // ค้นหา user ที่ต้องการอัปเดต
    if err := db.First(&user, userID).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"status": "error", "message": "Student not found"})
        return
    }

    // รับข้อมูล JSON และตรวจสอบความถูกต้อง
    var updateData map[string]interface{}
    if err := c.ShouldBindJSON(&updateData); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "Invalid payload"})
        return
    }

    // ถ้ามีรหัสผ่านให้ทำการ hash
    if password, ok := updateData["password"].(string); ok && password != "" {
        hashedPassword, err := hashPassword(password)
        if err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Failed to hash password"})
            return
        }
        updateData["password"] = hashedPassword
    } else {
        delete(updateData, "password") // ไม่ต้องอัปเดตถ้าไม่มีรหัสผ่าน
    }

    // อัปเดตเฉพาะฟิลด์ที่ถูกส่งเข้ามา
    if err := db.Model(&user).Updates(updateData).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Failed to update student"})
        return
    }

    // ส่งข้อมูลที่อัปเดตกลับมาใน response
    c.JSON(http.StatusOK, gin.H{
        "status": "success",
        "message": "Student updated successfully",
        "data":   user, // ข้อมูล user ที่ถูกอัปเดต
    })
}
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

func GetStudentTeacherById(c *gin.Context) {

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
