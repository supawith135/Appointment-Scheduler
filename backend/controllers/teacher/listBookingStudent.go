package teacher
import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/supawith135/Appointment-Scheduler/config"
	"github.com/supawith135/Appointment-Scheduler/entity"
)
// ดึงข้อมูลรายข้อมูลนักศึกษาที่เข้ามา booking
func GetBookingStudentListByAdvisorID(c *gin.Context) {
    // Get the AdvisorID from the URL parameters
    AdvisorID := c.Param("id")

    var bookings []entity.Bookings

    // Get the database connection
    db := config.DB()

    // SELECT users.full_name, users.user_name, bookings.*
    //     FROM bookings
    //     JOIN time_slots ON time_slots.id = bookings.time_slot_id
    //     JOIN users ON users.id = bookings.user_id
    //     WHERE time_slots.user_id = ?, AdvisorID
    
    // Query for bookings where the time_slots.user_id matches the provided AdvisorID
    results := db.Preload("User").Preload("User.Advisor").Preload("TimeSlot").Preload("Status").
        Joins("JOIN time_slots ON time_slots.id = bookings.time_slot_id").
        Where("time_slots.user_id = ?", AdvisorID).
        Find(&bookings)

    // Check if there's any error in the query
    if results.Error != nil {
        log.Printf("Database query error: %v", results.Error)
        c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": results.Error.Error()})
        return
    }

    // Check if any bookings were found
    if len(bookings) == 0 {
        c.JSON(http.StatusNotFound, gin.H{"status": "error", "message": "bookings not found"})
        return
    }

    // Return the retrieved bookings in JSON format
    c.JSON(http.StatusOK, gin.H{
        "status":  "success",
        "message": "Bookings retrieved successfully",
        "data":    bookings,
    })
}
// ดึงข้อมูลรายชื่ออาจารย์ด้วย ID
// func GetBookingByStudentId(c *gin.Context) {

// 	student_id := c.Param("id")

// 	var user entity.Users

// 	db := config.DB()

// 	results := db.Preload("Position").Preload("Role").Preload("Advisor").Preload("Gender").Where("role_id = ?", 2).First(&user, student_id)
// 	if results.Error != nil {
// 		log.Printf("Database query error: %v", results.Error)
// 		c.JSON(http.StatusNotFound, gin.H{"status": "error", "message": results.Error.Error()})
// 		return
// 	}

// 	if user.ID == 0 {
// 		c.JSON(http.StatusNotFound, gin.H{"status": "error", "message": "Teacher not found"})
// 		return
// 	}
// 	c.JSON(http.StatusOK, gin.H{
// 		"status":  "success",
// 		"message": "Teacher retrieved successfully",
// 		"data":    user,
// 	})
// }

func UpdateBookingStudentById(c *gin.Context) {

	var booking entity.Bookings

	BookingID := c.Param("id")

	db := config.DB()

	// ค้นหา userID ที่ต้องการอัพเดท
	result := db.First(&booking, BookingID)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"status":  "error",
			"message": "Student ID not found",
		})
		return
	}

	// แปลงข้อมูล JSON ที่ส่งมาเป็นโครงสร้าง user
	if err := c.ShouldBindJSON(&booking); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status":  "error","message": "Bad request, unable to parse payload",})
		return
	}

	// บันทึกการเปลี่ยนแปลง
	result = db.Save(&booking)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status":  "error","message": "Failed to update student",})
		return
	}

	// ส่งข้อมูลที่อัพเดทแล้วกลับไป
	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "student updated successfully",
		"data":    booking,
	})
}