package main

import (
	"github.com/gin-gonic/gin"
	"github.com/robfig/cron/v3"
	"github.com/supawith135/Appointment-Scheduler/config"
	"github.com/supawith135/Appointment-Scheduler/controllers/admin"
	"github.com/supawith135/Appointment-Scheduler/controllers/startCronJobControllers"
	"github.com/supawith135/Appointment-Scheduler/controllers/student"
	"github.com/supawith135/Appointment-Scheduler/controllers/teacher"
	"github.com/supawith135/Appointment-Scheduler/controllers/users"
	"github.com/supawith135/Appointment-Scheduler/middlewares"
	"log"
)

func main() {
	config.SetupDatabase()
	r := gin.Default()
	r.Use(CORSMiddleware())

	// เรียกใช้ cron job
	go startCronJob()

	r.POST("/", users.LogIn)

	// Student routes
	students := r.Group("/student")
	students.Use(middlewares.Authorizes("student"))
	{
		students.GET("", student.GetStudentsList)
		students.GET("/:id", student.GetStudentById)
		students.PATCH("/:id", student.UpdateStudentById)
		//booking
		students.POST("booking", student.CreateBooking)
		students.GET("/bookingStudent/:id", student.GetBookingByStudentId)
		students.GET("/booking/:id", student.GetBookingById)
		students.GET("/bookingTeacher/:id", student.GetTimeSlotsByTeacherId)
		students.DELETE("/booking/:id", student.DeleteBookingById)
		//teacher
		students.GET("/teacherDetail/:id", student.GetStudentTeacherById)
		students.GET("/teacher", student.GetTeachersList)

		//advisor
		students.GET("/bookingAdvisor/:id", student.GetListBookingAdvisorById)
		students.GET("/advisor/:id", student.GetStudentWithAdvisorById)
	}
	// Teacher routes
	teachers := r.Group("/teacher")
	teachers.Use(middlewares.Authorizes("teacher"))
	{
		teachers.GET("", teacher.GetTeachersList)
		teachers.GET("/:id", teacher.GetTeacherById)
		teachers.PATCH("/:id", teacher.UpdateTeacherById)
		teachers.GET("/timeslot", teacher.GetListTimeSlots)
		teachers.GET("/timeslot/:id", teacher.GetTimeSlotById)
		teachers.POST("/timeslot", teacher.CreateTimeSlots)
		// teachers.PUT("/timeslot/:id", teacher.UpdateTimeSlotById)
		teachers.DELETE("/timeslot/:id", teacher.DeleteTimeSlotById)
		//bookingListStudent
		teachers.GET("/booking/student/:id", teacher.GetBookingStudentListByAdvisorID)
		teachers.GET("/StudentBookingDetails/:id/:user_name", teacher.GetBookingByUserName)
		teachers.PATCH("/booking/student/:id", teacher.UpdateBookingStudentById)
		//statisticalData
		teachers.GET("/statisticalData/:id", teacher.GetTeachersStatisticsById)
		//position
		teachers.GET("/positions", teacher.GetPositionsList)
		//student
		teachers.GET("/studentDetail/:user_name", teacher.GetTeacherStudentByUserName)
		teachers.GET("/studentInCharge/:id", teacher.GetStudentInCharge)
		teachers.GET("/student", teacher.GetStudentsList)
		teachers.POST("/createBookingTeacher", teacher.CreateBookingTeacher)

		
	}

	// Admin routes
	admins := r.Group("/admin")
	admins.Use(middlewares.Authorizes("admin"))
	{
		admins.GET("/:id", admin.GetAdminById)
		admins.PATCH("/:id", admin.UpdateAdminById)
		admins.GET("/student", admin.GetStudentsList)
		admins.GET("/student/:id", admin.GetStudentById)
		admins.GET("/teacher", admin.GetTeachersList)
		admins.GET("/teacherDetail/:id", admin.GetAdminTeacherById)
		admins.GET("/timeslot", admin.GetListTimeSlots)
		admins.GET("/timeslot/:id", admin.GetTimeSlotById)
		admins.GET("/booking/teacher/:id", admin.GetBookingStudentListByTeacherID)
		//add Student
		admins.POST("/createStudent", admin.CreateStudent)
		admins.DELETE("/deleteStudent/:id", admin.DeleteStudentById)
		//teacher
		admins.POST("/createTeacher", admin.CreateTeacher)
		admins.DELETE("/deleteTeacher/:id", admin.DeleteTeacherById)
		admins.GET("/positions", admin.GetPositionsList)

	}

	r.Run()
	// r.Run();
	// ใช้ select {} เพื่อรอให้ goroutine ทำงานโดยไม่ปิดโปรแกรม
	select {}
}

// ฟังก์ชันที่ใช้ Cron job อัปเดตสถานะ
func startCronJob() {
	c := cron.New()

	// AddFunc("56 23 * * *")
	// นาที (Minute): ตัวแรก 0 หมายถึงการรันในนาทีที่ 56
	// ชั่วโมง (Hour): ตัวที่สอง 0 หมายถึงการรันในชั่วโมงที่ 23
	// วันของเดือน (Day of Month): ตัวที่สาม * หมายถึงทุกวันของเดือน
	// เดือน (Month): ตัวที่สี่ * หมายถึงทุกเดือน
	// วันของสัปดาห์ (Day of Week): ตัวที่ห้า * หมายถึงทุกวันในสัปดาห์
	// ตั้งค่า cron ให้รันเวลา 00:00 ของทุกวัน
	c.AddFunc("0 0 * * *", func() {
		log.Println("Running UpdateTimeSlotsAvailability...")

		// เรียกใช้ฟังก์ชันอัปเดต time slots availability
		err := startCronJobControllers.UpdateTimeSlotsAvailability()
		if err != nil {
			log.Printf("Error updating time slots availability: %v", err)
		} else {
			log.Println("Time slots availability updated successfully.")
		}
	})
	
	// Cron job ทำงานทุกๆ 2 ชั่วโมง เพื่ออัปเดต time slots
	c.AddFunc("0 */2 * * *", func() {
		log.Println("Running UpdateBookingsStatus...")
		err := startCronJobControllers.UpdateBookingsStatus()
		if err != nil {
			log.Printf("Error updating bookings status: %v", err)
		} else {
			log.Println("Bookings status availability updated successfully.")
		}
	})
	// เริ่มต้น cron job
	c.Start()
}

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, PATCH, DELETE")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	}
}
