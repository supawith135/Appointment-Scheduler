package teacher

import (
	"log"
	"net/http"
    
	"github.com/gin-gonic/gin"
	"github.com/supawith135/Appointment-Scheduler/config"
	"github.com/supawith135/Appointment-Scheduler/entity"
)

// ดึงข้อมูล Timeslot ทั้งหมด
func GetListTimeSlots(c *gin.Context) {

	var timeSlots []entity.TimeSlots

	db := config.DB()

	results := db.Preload("User").Find(&timeSlots)
	if results.Error != nil {
		log.Printf("Database query error: %v", results.Error)
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": results.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "Time slots retrieved successfully",
		"data":    timeSlots,
	})
}

// ดึงข้อมูล Timeslot โดย ID
func GetTimeSlotById(c *gin.Context) { 

    TeacherID := c.Param("id") // ดึง user_id จาก URL parameter

    var timeSlots []entity.TimeSlots

    // ดึง Database connection
    db := config.DB()

    // Query ข้อมูล time_slots ที่มี user_id ตรงกับที่ระบุ และ Preload ตาราง Users
    results := db.Preload("User").Preload("User.Position").Preload("User.Role").Preload("User.Gender").Preload("User.Advisor").
        Where("user_id = ?", TeacherID).
        Order("slot_start_time ASC"). // เรียงลำดับตาม slot_start_time จากน้อยไปมาก
        Find(&timeSlots)

    // ตรวจสอบว่ามีข้อผิดพลาดใน query หรือไม่
    if results.Error != nil {
        log.Printf("Database query error: %v", results.Error)
        c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": results.Error.Error()})
        return
    }

    // ตรวจสอบว่าข้อมูลว่างหรือไม่ (กรณีที่ไม่มี TimeSlots)
    if len(timeSlots) == 0 {
        c.JSON(http.StatusNotFound, gin.H{"status": "error", "message": "No time slots found for this user"})
        return
    }

    // ส่งผลลัพธ์ในรูปแบบ JSON เมื่อมีข้อมูล
    c.JSON(http.StatusOK, gin.H{
        "status":  "success",
        "message": "Time slots retrieved successfully",
        "data":    timeSlots,
    })
}

// // สร้างข้อมูล TimeSlot
// func CreateTimeSlot(c *gin.Context) {

// 	var timeSlot entity.TimeSlots

// 	db := config.DB()

// 	if err := c.ShouldBindJSON(&timeSlot); err != nil {
// 		log.Printf("JSON binding error: %v", err)
// 		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": err.Error()})
// 		return
// 	}

// 	var user entity.Users
// 	result := db.First(&user, "id = ?", timeSlot.UserID)
// 	if result.Error != nil {
// 		log.Printf("Database query error: %v", result.Error)
// 		c.JSON(http.StatusNotFound, gin.H{"status": "error", "message": "UserID not found"})
// 		return
// 	}

// 	result = db.Create(&timeSlot)
// 	if result.Error != nil {
// 		log.Printf("Database create error: %v", result.Error)
// 		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Failed to create time slot"})
// 		return
// 	}

// 	c.JSON(http.StatusCreated, gin.H{
// 		"status":  "success",
// 		"message": "Time slot created successfully",
// 		"data":    timeSlot,
// 	})
// }

func CreateTimeSlots(c *gin.Context) {
    var timeSlots []entity.TimeSlots
    db := config.DB()

    // Binding JSON to the struct
    if err := c.ShouldBindJSON(&timeSlots); err != nil {
        log.Printf("JSON binding error: %v", err)
        c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": err.Error()})
        return
    }

    // Start a transaction
    tx := db.Begin()
    defer func() {
        if r := recover(); r != nil {
            tx.Rollback()
            log.Printf("Recovered from panic: %v", r)
            c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Internal server error"})
        }
    }()

    for _, timeSlot := range timeSlots {
        // Check if user exists
        var user entity.Users
        result := tx.First(&user, "id = ?", timeSlot.UserID)
        if result.Error != nil {
            tx.Rollback()
            log.Printf("UserID not found: %v", result.Error)
            c.JSON(http.StatusNotFound, gin.H{"status": "error", "message": "UserID not found"})
            return
        }

        // Check for overlapping time slots for the same user
        var existingSlots []entity.TimeSlots
        startTime := timeSlot.SlotStartTime
        endTime := timeSlot.SlotEndTime
        slotDate := timeSlot.SlotDate

        result = tx.Where("user_id = ? AND slot_date = ? AND NOT (slot_end_time <= ? OR slot_start_time >= ?)", 
            timeSlot.UserID, slotDate, startTime, endTime).Find(&existingSlots)

        if result.Error != nil {
            tx.Rollback()
            log.Printf("Error checking existing time slots: %v", result.Error)
            c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Error checking existing time slots"})
            return
        }

        // If overlapping slots are found, return an error
        if len(existingSlots) > 0 {
            tx.Rollback()
            c.JSON(http.StatusConflict, gin.H{"status": "error", "message": "พบช่วงเวลาที่ซ้ำซ้อน กรุณาตรวจสอบข้อมูลทั้งหมดและลองอีกครั้ง"})
            return
        }
    }

    // If no overlaps found, create all time slots
    for _, timeSlot := range timeSlots {
        result := tx.Create(&timeSlot)
        if result.Error != nil {
            tx.Rollback()
            log.Printf("Failed to create time slot: %v", result.Error)
            c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Failed to create time slots"})
            return
        }
    }

    // Commit the transaction
    if err := tx.Commit().Error; err != nil {
        log.Printf("Failed to commit transaction: %v", err)
        c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Failed to commit transaction"})
        return
    }

    c.JSON(http.StatusCreated, gin.H{
        "status":  "success",
        "message": "Time slots created successfully",
        "data":    timeSlots,
    })
}

// func UpdateTimeSlotById(c *gin.Context) {
// 	var timeSlot entity.TimeSlots

// 	TimeSlotID := c.Param("id")

// 	db := config.DB()

// 	// ค้นหา TimeSlot ที่ต้องการอัพเดท
// 	result := db.First(&timeSlot, TimeSlotID)
// 	if result.Error != nil {
// 		c.JSON(http.StatusNotFound, gin.H{
// 			"status":  "error",
// 			"message": "Time slot not found",
// 		})
// 		return
// 	}

// 	// แปลงข้อมูล JSON ที่ส่งมาเป็นโครงสร้าง TimeSlots
// 	if err := c.ShouldBindJSON(&timeSlot); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"status":  "error","message": "Bad request, unable to parse payload",})
// 		return
// 	}

// 	// บันทึกการเปลี่ยนแปลง
// 	result = db.Save(&timeSlot)
// 	if result.Error != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"status":  "error","message": "Failed to update time slot",})
// 		return
// 	}

// 	// ส่งข้อมูลที่อัพเดทแล้วกลับไป
// 	c.JSON(http.StatusOK, gin.H{
// 		"status":  "success",
// 		"message": "Time slot updated successfully",
// 		"data":    timeSlot,
// 	})
// }

// ลบข้อมูล TimeSlot โดย ID
func DeleteTimeSlotById(c *gin.Context) {
	id := c.Param("id")

	db := config.DB()

	result := db.Exec("DELETE FROM time_slots WHERE id = ?", id)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Failed to delete time slot"})
		return
	}
	if result.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"status": "error", "message": "Time slot not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "Time slot deleted successfully",
	})
}
