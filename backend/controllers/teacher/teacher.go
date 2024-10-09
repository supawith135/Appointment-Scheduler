package teacher

import (
	"log"
	"net/http"
	"golang.org/x/crypto/bcrypt"
	"github.com/gin-gonic/gin"
	"github.com/supawith135/Appointment-Scheduler/config"
	"github.com/supawith135/Appointment-Scheduler/entity"
)
// ฟังก์ชันสำหรับการ hash รหัสผ่าน
func hashPassword(password string) (string, error) {
    bytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
    return string(bytes), err
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
func GetPositionsList(c *gin.Context) { 
	var positions []entity.Positions

	db := config.DB()

	results := db.Find(&positions)
	if results.Error != nil {
		log.Printf("Database query error: %v", results.Error)
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": results.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "Positions retrieved successfully",
		"data":    positions,
	})
}

// ดึงข้อมูลรายชื่ออาจารย์ด้วย ID
func GetTeacherById(c *gin.Context) {

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

func UpdateTeacherById(c *gin.Context) {
    var user entity.Users
    userID := c.Param("id")

    db := config.DB()

    // ค้นหา user ที่ต้องการอัปเดต
    if err := db.First(&user, userID).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"status": "error", "message": "Teacher not found"})
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
        c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Failed to update teacher"})
        return
    }

    // ส่งข้อมูลที่อัปเดตกลับมาใน response
    c.JSON(http.StatusOK, gin.H{
        "status": "success",
        "message": "Teacher updated successfully",
        "data":   user, // ข้อมูล user ที่ถูกอัปเดต
    })
}

