package admin

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/supawith135/Appointment-Scheduler/config"
	"github.com/supawith135/Appointment-Scheduler/entity"
)
func GetAdminById(c *gin.Context) {

	ID := c.Param("id")

	var user entity.Users

	db := config.DB()

	results := db.Preload("Position").Preload("Role").Preload("Advisor").Preload("Gender").Where("role_id = ?", 3).First(&user, ID)
	if results.Error != nil {
		log.Printf("Database query error: %v", results.Error)
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": results.Error.Error()})
		return
	}

	if user.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"status": "error", "message": "AdminID not found"})
		return

	}
	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "Admin retrieved successfully",
		"data":    user,
	})

}

func UpdateAdminById(c *gin.Context) {

	var user entity.Users

	UserID := c.Param("id")

	db := config.DB()

	// ค้นหา userID ที่ต้องการอัพเดท
	result := db.First(&user, UserID)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"status":  "error",
			"message": "Admin ID not found",
		})
		return
	}

	// แปลงข้อมูล JSON ที่ส่งมาเป็นโครงสร้าง user
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status":  "error","message": "Bad request, unable to parse payload",})
		return
	}

	// บันทึกการเปลี่ยนแปลง
	result = db.Save(&user)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status":  "error","message": "Failed to update Admin",})
		return
	}

	// ส่งข้อมูลที่อัพเดทแล้วกลับไป
	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "Admin updated successfully",
		"data":    user,
	})
}