package users

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	
	"github.com/supawith135/Appointment-Scheduler/config"
	"github.com/supawith135/Appointment-Scheduler/entity"
	"github.com/supawith135/Appointment-Scheduler/services"
)

type Authen struct {
	UserName string `json:"user_name"`
	Password string `json:"password"`
}

func SignIn(c *gin.Context) {
	var payload Authen
	var user entity.Users

	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// ค้นหา user ด้วย Username ที่ผู้ใช้กรอกเข้ามา และ preload Role
	if err := config.DB().Preload("Role").Where("user_name = ?", payload.UserName).First(&user).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User not found"})
		return
	}

	// ตรวจสอบรหัสผ่าน
	err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(payload.Password))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Incorrect password"})
		return
	}

	jwtWrapper := services.JwtWrapper{
		SecretKey:       "SvNQpBN8y3qlVrsGAYYWoJJk56LtzFHx",
		Issuer:          "AuthService",
		ExpirationHours: 24,
	}

	// ตรวจสอบว่า user.Role มีค่าหรือไม่
	var roleName string
	if user.Role.RoleName != "" {
		roleName = user.Role.RoleName
	} else {
		roleName = "unknown"
	}

	// เพิ่ม role เข้าไปใน GenerateToken
	signedToken, err := jwtWrapper.GenerateToken(user.Email, roleName)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error signing token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"token_type": "Bearer",
		"token":      signedToken,
		"id":         user.ID,
		"role":       roleName,
	})
}