package main

import (
	"github.com/gin-gonic/gin"

	"github.com/supawith135/Appointment-Scheduler/middlewares"
	"github.com/supawith135/Appointment-Scheduler/config"
	"github.com/supawith135/Appointment-Scheduler/controllers/users"
	"github.com/supawith135/Appointment-Scheduler/controllers/admin"
	"github.com/supawith135/Appointment-Scheduler/controllers/student"
	"github.com/supawith135/Appointment-Scheduler/controllers/teacher"

)
func main() {
    config.SetupDatabase()
    r := gin.Default()
    r.Use(CORSMiddleware())

    r.POST("/signin", users.SignIn)

    // Student routes
    students := r.Group("/student")
    students.Use(middlewares.Authorizes("student"))
    {
        students.GET("", student.GetStudentsList)
        students.GET("/:id", student.GetStudentById)
        students.PUT("/:id", student.UpdateStudentById)
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
        teachers.PUT("/timeslot/:id", teacher.UpdateTimeSlotById)
        teachers.DELETE("/timeslot/:id", teacher.DeleteTimeSlotById)
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

    r.Run()
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