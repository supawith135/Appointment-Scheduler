package entity

import (
	"fmt"
	"time"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// Global database instance
var db *gorm.DB

// DB returns the global database instance
func DB() *gorm.DB {
	return db
}

// hashPassword hashes the password using bcrypt
func hashPassword(password string) (string, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(hashedPassword), nil
}

// uintPtr creates a pointer to a uint
func uintPtr(i uint) *uint {
	return &i
}

// SetupDatabase sets up and initializes the database
func SetupDatabase() {
	dsn := "host=localhost user=postgres password=123456 dbname=appointment port=5432 sslmode=disable TimeZone=Asia/Bangkok"
	database, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}
	db = database

	// Drop and migrate tables
	database.Migrator().DropTable(&User{}, &Position{}, &Gender{}, &Role{}, &TimeSlot{}, &Booking{}, &Status{})
	database.AutoMigrate(&User{}, &Position{}, &Gender{}, &Role{}, &TimeSlot{}, &Booking{}, &Status{})
	fmt.Println("Database migration completed!")

	// Seed Gender data
	genders := []Gender{
		{GenderName: "ชาย"},
		{GenderName: "หญิง"},
	}
	for _, gender := range genders {
		database.Where(Gender{GenderName: gender.GenderName}).FirstOrCreate(&gender)
	}

	// Seed Position data
	positions := []Position{
		{PositionName: "ศาสตราจารย์"},
		{PositionName: "รองศาสตราจารย์"},
		{PositionName: "ผู้ช่วยศาสตราจารย์"},
	}
	for _, position := range positions {
		database.Where(Position{PositionName: position.PositionName}).FirstOrCreate(&position)
	}

	// Seed Status data
	statuses := []Status{
		{Status: "ไม่ได้เข้าพบ"},
		{Status: "เข้าพบแล้ว"},
		{Status: "เลื่อนการนัดหมาย"},
	}
	for _, status := range statuses {
		database.Where(Status{Status: status.Status}).FirstOrCreate(&status)
	}

	// Seed Role data
	roles := []Role{
		{RoleName: "นักศึกษา"},
		{RoleName: "อาจารย์"},
		{RoleName: "แอดมิน"},
	}
	for _, role := range roles {
		database.Where(Role{RoleName: role.RoleName}).FirstOrCreate(&role)
	}

	// Seed User data
	users := []User{
		// Teacher
		{
			PositionID: uintPtr(3),
			FullName:   "สมพงษ์ ดีงาน",
			RoleID:     uintPtr(2),
			AdvisorID:  nil,
			Email:      "Sompong@gmail.com",
			UserName:   "Sompong",
			Password:   "a123456", // Will be hashed
			GenderID:   uintPtr(1),
		},
		{
			PositionID: uintPtr(2),
			FullName:   "อลิยา ทองกาล",
			RoleID:     uintPtr(2),
			AdvisorID:  nil,
			Email:      "Alia@gmail.com",
			UserName:   "Alia",
			Password:   "a123456",
			GenderID:   uintPtr(2),
		},
		{
			PositionID: uintPtr(1),
			FullName:   "อรัน บุตรดี",
			RoleID:     uintPtr(2),
			AdvisorID:  nil,
			Email:      "Alan@gmail.com",
			UserName:   "Alan",
			Password:   "a123456",
			GenderID:   uintPtr(1),
		},
		// Admin
		{
			PositionID: uintPtr(1),
			FullName:   "แอดมิน เทส",
			RoleID:     uintPtr(3),
			AdvisorID:  nil,
			Email:      "Admin@gmail.com",
			UserName:   "Admin",
			Password:   "a123456",
			GenderID:   uintPtr(1),
		},
		// Student
		{
			PositionID: nil,
			FullName:   "นักเรียน ดีเด่น",
			RoleID:     uintPtr(1),
			AdvisorID:  uintPtr(2),
			Email:      "B6412345@gmail.com",
			UserName:   "Student",
			Password:   "a123456",
			GenderID:   uintPtr(1),
		},
		{
			PositionID: nil,
			FullName:   "เด็กดี วีสตาร์",
			RoleID:     uintPtr(1),
			AdvisorID:  uintPtr(1),
			Email:      "B123456@gmail.com",
			UserName:   "DekDeeVstart",
			Password:   "a123456",
			GenderID:   uintPtr(2),
		},
	}

	for i, user := range users {
		// Hash the password before inserting
		hashedPassword, err := hashPassword(user.Password)
		if err != nil {
			panic(err)
		}
		users[i].Password = hashedPassword

		// Insert or update the user
		database.Where(User{Email: user.Email}).FirstOrCreate(&users[i])
	}
	thTimeZone := time.FixedZone("ICT", 7*3600) //TimeZone Thailand
	timeSlots := []TimeSlot{
		{
			UserID:        1, // สมมติว่า User ID นี้มีอยู่
			SlotDate:      time.Date(2024, time.September, 15, 0, 0, 0, 0, thTimeZone), // วันที่เท่านั้น
			SlotStartTime: time.Date(2024, time.September, 15, 9, 0, 0, 0, thTimeZone), // เวลาเริ่มต้น: 09:00 น.
			SlotEndTime:   time.Date(2024, time.September, 15, 10, 30, 0, 0, thTimeZone), // เวลาสิ้นสุด: 10:00 น.
			Location:      "ห้องเรียน A",
			Title:         "การประชุมรายงาน",
			IsAvailable:   true,
		},
		{
			UserID:        1, // สมมติว่า User ID นี้มีอยู่
			SlotDate:      time.Date(2024, time.September, 16, 0, 0, 0, 0, thTimeZone), // วันที่เท่านั้น
			SlotStartTime: time.Date(2024, time.September, 16, 14, 0, 0, 0, thTimeZone), // เวลาเริ่มต้น: 14:00 น.
			SlotEndTime:   time.Date(2024, time.September, 16, 15, 30, 0, 0, thTimeZone), // เวลาสิ้นสุด: 15:00 น.
			Location:      "ห้องเรียน B",
			Title:         "การประชุมทีมงาน",
			IsAvailable:   false,
		},
		{
			UserID:        2, // สมมติว่า User ID นี้มีอยู่
			SlotDate:      time.Date(2024, time.September, 17, 0, 0, 0, 0, thTimeZone), // วันที่เท่านั้น
			SlotStartTime: time.Date(2024, time.September, 17, 11, 0, 0, 0, thTimeZone), // เวลาเริ่มต้น: 11:00 น.
			SlotEndTime:   time.Date(2024, time.September, 17, 12, 0, 0, 0, thTimeZone), // เวลาสิ้นสุด: 12:00 น.
			Location:      "ห้องเรียน C",
			Title:         "การสัมมนา",
			IsAvailable:   true,
		},
	}
	for _, timeSlot := range timeSlots {
		database.Where(timeSlot).FirstOrCreate(&timeSlot)
	}

}
