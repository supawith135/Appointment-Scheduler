package admin

import (
	"github.com/gin-gonic/gin"
	"github.com/supawith135/Appointment-Scheduler/config"
	"github.com/supawith135/Appointment-Scheduler/entity"
	"golang.org/x/crypto/bcrypt"
	"net/http"
)

// ฟังก์ชันสำหรับการ hash รหัสผ่าน
func CreateStudent(c *gin.Context) {
    var user entity.Users
    var usersCheck entity.Users
    var role entity.Roles
    var advisor entity.Users // เพิ่มการสร้างตัวแปร advisor
    
    db := config.DB() // Get the DB instance

    if err := c.ShouldBindJSON(&user); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    // เช็คว่า user_name มีอยู่ในระบบหรือไม่
    if tx := db.Where("user_name = ?", user.UserName).First(&usersCheck); !(tx.RowsAffected == 0) {
        c.JSON(http.StatusConflict, gin.H{"status": "error", "message": "มีรหัสประจำตัวนี้อยู่แล้ว"})
        return
    }

    // เช็คว่า advisor_id มีอยู่ในระบบหรือไม่
    if tx := db.Where("id = ? AND role_id = 2", user.AdvisorID).First(&advisor); tx.RowsAffected == 0 {
        c.JSON(http.StatusNotFound, gin.H{"status": "error", "message": "ไม่พบอาจารย์ที่ปรึกษา"})
        return
    }

    // เช็คว่า role_id มีอยู่ในระบบหรือไม่
    if tx := db.Where("id = ?", user.RoleID).First(&role); tx.RowsAffected == 0 {
        c.JSON(http.StatusNotFound, gin.H{"status": "error", "message": "ไม่มีสถานะนักศึกษา"})
        return
    }

    hashPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), 12)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Failed to hash password"})
        return
    }
    
    newUser := entity.Users{
        UserName: user.UserName,
        Email:    user.Email,
        FullName: user.FullName,
        Password: string(hashPassword),
        RoleID:   user.RoleID,
        AdvisorID: user.AdvisorID, // ใช้ AdvisorID ที่มาจากฟอร์ม
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

// ลบข้อมูล Student โดย ID
func DeleteStudentById(c *gin.Context) {
	id := c.Param("id")

	db := config.DB()

	result := db.Exec("DELETE FROM users WHERE id = ? AND role_id = 1", id)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Failed to delete student"})
		return
	}
	if result.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"status": "error", "message": "Student not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "User Student deleted successfully",
	})
}