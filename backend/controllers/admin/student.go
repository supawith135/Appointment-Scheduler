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
    db := config.DB() // Get the DB instance

    if err := c.ShouldBindJSON(&user); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    if tx := db.Where("user_name = ?", user.UserName).First(&usersCheck); !(tx.RowsAffected == 0) {
        c.JSON(http.StatusConflict, gin.H{"status": "error", "message": "มีรหัสประจำตัวนี้อยู่แล้ว"})
        return
    }

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
        UserName: user.UserName, // เพิ่ม UserName
        Email:    user.Email,
        FullName: user.FullName,
        Password: string(hashPassword),
        RoleID:   user.RoleID, // ใช้ RoleID
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