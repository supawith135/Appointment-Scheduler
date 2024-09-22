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
		students.PUT("/:id", student.UpdateStudentById)

		//booking
		students.POST("booking", student.CreateBooking)
		students.GET("/bookingAdvisor/:id", student.GetListBookingAdvisorById)
		students.GET("/bookingStudent/:id", student.GetBookingByStudentId)
		students.GET("/booking/:id", student.GetBookingById)
		students.DELETE("/booking/:id", student.DeleteBookingById)
	}

	// Teacher routes
	teachers := r.Group("/teacher")
	teachers.Use(middlewares.Authorizes("teacher"))
	{
		teachers.GET("", teacher.GetTeachersList)
		teachers.GET("/:id", teacher.GetTeacherById)
		teachers.GET("/timeslot", teacher.GetListTimeSlots)
		teachers.GET("/timeslot/:id", teacher.GetTimeSlotById)
		teachers.POST("/timeslot", teacher.CreateTimeSlot)
		// teachers.PUT("/timeslot/:id", teacher.UpdateTimeSlotById)
		teachers.DELETE("/timeslot/:id", teacher.DeleteTimeSlotById)

		//bookingListStudent
		teachers.GET("/booking/student/:id", teacher.GetBookingStudentListByAdvisorID)
		teachers.PATCH("/booking/student/:id", teacher.UpdateBookingStudentById)

		//statisticalData
		teachers.GET("/statisticalData/:id", teacher.GetTeachersStatisticsById)
	}

	// Admin routes
	admins := r.Group("/admin")
	admins.Use(middlewares.Authorizes("admin"))
	{
		admins.GET("/student", admin.GetStudentsList)
		admins.GET("/student/:id", admin.GetStudentById)
		admins.GET("/teacher", admin.GetTeachersList)
		admins.GET("/teacher/:id", admin.GetTeacherById)
		admins.GET("/timeslot", admin.GetListTimeSlots)
		admins.GET("/timeslot/:id", admin.GetTimeSlotById)

	}
	
	r.Run("localhost:8080")

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
	// Job สำหรับอัปเดตสถานะของ Bookings ให้รันทุก ๆ 2 ชั่วโมง
	c.AddFunc("0 */1 * * *", func() {
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
