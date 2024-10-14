package teacher

import (
	_ "log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/supawith135/Appointment-Scheduler/config"
)

//	type StatisticsResponse struct {
//		TotalStudents         int64  `json:"total_students"`
//		AdvisorName           string `json:"advisor_name"`
//		StudentNames          string `json:"student_names"`
//		AdvisorStudentCount   int64  `json:"advisor_student_count"`
//		TotalAppointments     int64  `json:"total_bookings_for_advisor"`
//		RemainingAppointments int64  `json:"remaining_bookings_for_advisor"`
//	}
func GetTeachersStatisticsById(c *gin.Context) {
	// Get the advisor ID from URL parameters
	advisorID := c.Param("id")
	db := config.DB()

	var stats struct {
		TotalStudents               int    `json:"total_students"`
		AdvisorName                 string `json:"advisor_name"`
		StudentNames                string `json:"student_names"`
		AdvisorStudentCount         int    `json:"advisor_student_count"`
		TotalBookingsForAdvisor     int    `json:"total_bookings_for_advisor"`
		RemainingBookingsForAdvisor int    `json:"remaining_bookings_for_advisor"`
	}

	// GORM query using subqueries
	err := db.Raw(`
		WITH TotalStudents AS (
    SELECT COUNT(id) AS total_students
    FROM users
    WHERE role_id = 1
),
AdvisorStudents AS (
    SELECT advisor.full_name AS advisor_name, 
           STRING_AGG(users.full_name, ', ') AS student_names,
           COUNT(users.id) AS advisor_student_count
    FROM users
    JOIN users AS advisor ON users.advisor_id = advisor.id
    WHERE users.advisor_id = ?
    GROUP BY advisor.full_name 
),
TotalBookings AS (
    SELECT COUNT(b.user_id) AS total_bookings_for_advisor
    FROM bookings b
    LEFT JOIN time_slots ts ON b.time_slot_id = ts.id
    WHERE  b.deleted_at IS NULL AND ts.user_id = ? OR b.created_by_id = ?
),
RemainingBookings AS (
    SELECT COUNT(b.user_id) AS remaining_bookings_for_advisor
    FROM bookings b
    JOIN time_slots ts ON b.time_slot_id = ts.id
    JOIN users creator ON ts.user_id = creator.id
    WHERE creator.role_id = 2 AND b.deleted_at IS NULL AND b.status_id = 1 AND ts.user_id = ?
)
SELECT 
    (SELECT total_students FROM TotalStudents) AS total_students,
    (SELECT advisor_name FROM AdvisorStudents) AS advisor_name,
    (SELECT student_names FROM AdvisorStudents) AS student_names,
    (SELECT advisor_student_count FROM AdvisorStudents) AS advisor_student_count,
    (SELECT total_bookings_for_advisor FROM TotalBookings) AS total_bookings_for_advisor,
    (SELECT remaining_bookings_for_advisor FROM RemainingBookings) AS remaining_bookings_for_advisor;
	`, advisorID, advisorID, advisorID, advisorID).Scan(&stats).Error

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status":  "error",
			"message": "Failed to retrieve advisor stats",
			"data":    nil,
		})
		return
	}

	// Send JSON response
	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "Advisor stats retrieved successfully",
		"data":    stats,
	})
}

// Data struct เพื่อเก็บผลลัพธ์
// type StatisticsResponse struct {
// 	TotalStudents       int64  `json:"total_students"`
// 	AdvisorName         string `json:"advisor_name"`
// 	StudentNames        string `json:"student_names"`
// 	AdvisorStudentCount int64  `json:"advisor_student_count"`
// 	TotalBookings       int64  `json:"total_bookings_for_advisor"`
// 	RemainingBookings   int64  `json:"remaining_bookings_for_advisor"`
// }

// func GetStatisticsById(c *gin.Context) {
// 	advisorID := c.Param("id") // ใช้ ID ที่ได้รับจาก URL

// 	db := config.DB()

// 	var response StatisticsResponse

// 	query := `
// 	WITH TotalStudents AS (
// 	    SELECT COUNT(id) AS total_students
// 	    FROM users
// 	    WHERE role_id = 1
// 	),
// 	AdvisorStudents AS (
// 	    SELECT advisor.full_name AS advisor_name,
// 	           STRING_AGG(users.full_name, ', ') AS student_names,
//       		   COUNT(users.id) AS advisor_student_count
// 	    FROM users
// 	    JOIN users AS advisor ON users.advisor_id = advisor.id
// 	    WHERE users.advisor_id = ?
// 	    GROUP BY advisor.full_name
// 	),
// 	TotalBookings AS (
// 	    SELECT COUNT(b.user_id) AS total_bookings_for_advisor
// 	    FROM bookings b
// 	    JOIN time_slots ts ON b.time_slot_id = ts.id
// 	    JOIN users creator ON ts.user_id = creator.id
// 	    WHERE creator.role_id = 2 AND ts.user_id = ?
// 	),
// 	RemainingBookings AS (
// 	    SELECT COUNT(b.user_id) AS remaining_bookings_for_advisor
// 	    FROM bookings b
// 	    JOIN time_slots ts ON b.time_slot_id = ts.id
// 	    JOIN users creator ON ts.user_id = creator.id
// 	    WHERE creator.role_id = 2 AND b.status_id = 1 AND ts.user_id = ?
// 	)
// 	SELECT
// 	    (SELECT total_students FROM TotalStudents) AS total_students,
// 	    (SELECT advisor_name FROM AdvisorStudents) AS advisor_name,
// 	    (SELECT student_names FROM AdvisorStudents) AS student_names,
//         (SELECT advisor_student_count FROM AdvisorStudents) AS advisor_student_count,
// 	    (SELECT total_bookings_for_advisor FROM TotalBookings) AS total_bookings_for_advisor,
// 	    (SELECT remaining_bookings_for_advisor FROM RemainingBookings) AS remaining_bookings_for_advisor
// 	LIMIT 1`

// 	err := db.Raw(query, advisorID, advisorID, advisorID).Scan(&response).Error
// 	if err != nil {
// 		log.Printf("Database query error: %v", err)
// 		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": err.Error()})
// 		return
// 	}

// 	// ตรวจสอบว่า response มีข้อมูลหรือไม่
// 	if response.AdvisorName == "" {
// 		c.JSON(http.StatusNotFound, gin.H{"status": "error", "message": "Advisor not found or has no students."})
// 		return
// 	}

// 	c.JSON(http.StatusOK, gin.H{
// 		"status": "success",
// 		"data":   response,
// 	})
// }

//SQL
// WITH TotalStudents AS (
//     SELECT COUNT(id) AS total_students
//     FROM users
//     WHERE role_id = 1
// ),
// AdvisorStudents AS (
//     SELECT advisor.full_name AS advisor_name,
//            STRING_AGG(users.full_name, ', ') AS student_names,
//            COUNT(users.id) AS advisor_student_count
//     FROM users
//     JOIN users AS advisor ON users.advisor_id = advisor.id
//     WHERE users.advisor_id = ?
//     GROUP BY advisor.full_name
// ),
// TotalAppointments AS (
//     SELECT COUNT(b.user_id) AS total_bookings_for_advisor
//     FROM bookings b
//     JOIN time_slots ts ON b.time_slot_id = ts.id
//     JOIN users creator ON ts.user_id = creator.id
//     WHERE creator.role_id = 2 AND ts.user_id = ?
// ),
// RemainingAppointments AS (
//     SELECT COUNT(b.user_id) AS remaining_appointments
//     FROM bookings b
//     JOIN time_slots ts ON b.time_slot_id = ts.id
//     JOIN users creator ON ts.user_id = creator.id
//     WHERE creator.role_id = 2 AND b.status_id = 1 AND ts.user_id = ?
// )
// SELECT
//     (SELECT total_students FROM TotalStudents) AS total_students,
//     (SELECT advisor_name FROM AdvisorStudents) AS advisor_name,
//     (SELECT student_names FROM AdvisorStudents) AS student_names,
//     (SELECT total_appointments FROM TotalAppointments) AS total_appointments,
//     (SELECT remaining_appointments FROM RemainingAppointments) AS remaining_appointments
