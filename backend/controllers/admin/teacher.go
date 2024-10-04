package admin

import (
	"github.com/gin-gonic/gin"
	"github.com/supawith135/Appointment-Scheduler/config"
	"github.com/supawith135/Appointment-Scheduler/entity"
	"golang.org/x/crypto/bcrypt"
    "log"
	"net/http"
    "fmt"
)

// ฟังก์ชันสำหรับการ hash รหัสผ่าน
func CreateTeacher(c *gin.Context) {
    var user entity.Users
    var usersCheck entity.Users
    var role entity.Roles
	var position entity.Positions
    db := config.DB() // Get the DB instance

    if err := c.ShouldBindJSON(&user); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    fmt.Println("Received user:", user) // Log ค่าที่ได้รับ

    if tx := db.Where("user_name = ?", user.UserName).First(&usersCheck); !(tx.RowsAffected == 0) {
        c.JSON(http.StatusConflict, gin.H{"status": "error", "message": "มีรหัสประจำตัวนี้อยู่แล้ว"})
        return
    }

    if tx := db.Where("id = ?", user.RoleID).First(&role); tx.RowsAffected == 0 {
        c.JSON(http.StatusNotFound, gin.H{"status": "error", "message": "ไม่มีสถานะอาจารย์"})
        return
    }

	if tx := db.Where("id = ?", user.PositionID).First(&position); tx.RowsAffected == 0 {
        c.JSON(http.StatusNotFound, gin.H{"status": "error", "message": "ไม่มีตำแหน่งนี้"})
        return
    }

    hashPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), 12)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Failed to hash password"})
        return
    }
    
    newUser := entity.Users{
        UserName:  user.UserName, // เพิ่ม UserName
        Email:     user.Email,
        FullName:  user.FullName,
        Password:  string(hashPassword),
        RoleID:    user.RoleID, // ใช้ RoleID
        PositionID: user.PositionID, // เพิ่ม PositionID ที่นี่
        ContactNumber: user.ContactNumber, // เพิ่ม ContactNumber ที่นี่
        Image: user.Image,
    }

    if err := db.Create(&newUser).Error; err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{
        "status":  "success",
        "message": "Student created successfully",
        "data":    newUser,
    })
}

// ลบข้อมูล Teacher โดย ID
func DeleteTeacherById(c *gin.Context) {
	id := c.Param("id")

	db := config.DB()

	result := db.Exec("DELETE FROM users WHERE id = ? AND role_id = 2", id)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Failed to delete Teacher"})
		return
	}
	if result.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"status": "error", "message": "Teacher not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "User Teacher deleted successfully",
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