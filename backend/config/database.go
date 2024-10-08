package config

import (
	"fmt"
	// "log"
	"github.com/joho/godotenv"
	"github.com/supawith135/Appointment-Scheduler/entity"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"log"
	"os"
	_"time"
	_"strconv"
	_"gorm.io/gorm/logger"
)

// Global database instance
var db *gorm.DB

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

	// โหลดค่าจากไฟล์ .env
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	// Read database configuration from .env file
	// host := os.Getenv("DB_HOST")
	// port := os.Getenv("DB_PORT") // Convert port to int
	// user := os.Getenv("DB_USER")
	// password := os.Getenv("DB_PASSWORD") // Convert port to int
	// dbname := os.Getenv("DB_NAME")
	// timezone := os.Getenv("DB_TIMEZONE")
	// sslmode := os.Getenv("DB_SSLMODE")

	// Configure your PostgreSQL database details here
	// dsn := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=%s TimeZone=%s",
	// 	host, port, user, password, dbname, sslmode , timezone)

	dsn := fmt.Sprintf("host=%s port=%s dbname=%s user=%s password=%s sslmode=%s timezone=%s ",
		os.Getenv("DB_HOST"),
		os.Getenv("DB_PORT"),
		os.Getenv("DB_NAME"),
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_SSLMODE"),
		os.Getenv("DB_TIMEZONE"),
	)

	// New logger for detailed SQL logging

	// newLogger := logger.New(
	// 	log.New(os.Stdout, "\r\n", log.LstdFlags), // io writer
	// 	logger.Config{
	// 	  SlowThreshold: time.Second, // Slow SQL threshold
	// 	  LogLevel:      logger.Info, // Log level
	// 	  Colorful:      true,        // Enable color
	// 	},
	//   )

	// dsn := "host=localhost user=postgres password=123456 dbname=appointment port=5432 sslmode=disable TimeZone=Asia/Bangkok"
	// dsn := "host=localhost user=postgres password=123456 dbname=appointment port=5432 sslmode=disable TimeZone=UTC"
	// database, err := gorm.Open(postgres.Open(dsn), &gorm.Config{Logger: newLogger,})
	database, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}
	
	db = database

	// Drop and migrate tables
	// db.Migrator().DropTable(&entity.Users{}, &entity.Positions{}, &entity.Genders{}, &entity.Roles{}, &entity.TimeSlots{}, &entity.Bookings{}, &entity.Statuses{})
	db.AutoMigrate(&entity.Users{}, &entity.Positions{}, &entity.Genders{}, &entity.Roles{}, &entity.TimeSlots{}, &entity.Bookings{}, &entity.Statuses{})
	fmt.Println("Database migration completed!")

	// Seed data
	seedData()
}

// Seed function to add the seed data
func seedData() {
	// Seed Gender data
	genders := []entity.Genders{
		{GenderName: "ชาย"},
		{GenderName: "หญิง"},
	}
	for _, gender := range genders {
		db.FirstOrCreate(&gender, &entity.Genders{GenderName: gender.GenderName})
	}

	// Seed Position data
	positions := []entity.Positions{
		{PositionName: "ศาสตราจารย์"},
		{PositionName: "รองศาสตราจารย์"},
		{PositionName: "ผู้ช่วยศาสตราจารย์"},
		{PositionName: "อาจารย์"},
		{PositionName: "ผู้ช่วยสอนและวิจัย"},
	}
	for _, position := range positions {
		db.FirstOrCreate(&position, &entity.Positions{PositionName: position.PositionName})
	}

	// Seed Status data
	statuses := []entity.Statuses{
		{Status: "รอการเข้าพบ"},
		{Status: "เข้าพบสำเร็จ"},
		{Status: "ไม่ได้เข้าพบ"},
	}
	for _, status := range statuses {
		db.FirstOrCreate(&status, &entity.Statuses{Status: status.Status})
	}

	// Seed Role data
	roles := []entity.Roles{
		{RoleName: "student"},
		{RoleName: "teacher"},
		{RoleName: "admin"},
	}
	for _, role := range roles {
		db.FirstOrCreate(&role, &entity.Roles{RoleName: role.RoleName})
	}

	// Seed User data
	users := []entity.Users{
		// Teacher
		// {
		// 	PositionID: uintPtr(3),
		// 	FullName:   "สมพงษ์ ดีงาน",
		// 	RoleID:     uintPtr(2),
		// 	AdvisorID:  nil,
		// 	Email:      "Sompong@gmail.com",
		// 	UserName:   "Sompong",
		// 	Password:   "a123456", // Will be hashed
		// 	GenderID:   uintPtr(1),
			
		// },
		// {
		// 	PositionID: uintPtr(2),
		// 	FullName:   "อลิยา ทองกาล",
		// 	RoleID:     uintPtr(2),
		// 	AdvisorID:  nil,
		// 	Email:      "Alia@gmail.com",
		// 	UserName:   "Alia",
		// 	Password:   "a123456",
		// 	GenderID:   uintPtr(2),
		// },
		// {
		// 	PositionID: uintPtr(1),
		// 	FullName:   "อรัน บุตรดี",
		// 	RoleID:     uintPtr(2),
		// 	AdvisorID:  nil,
		// 	Email:      "Alan@gmail.com",
		// 	UserName:   "Alan",
		// 	Password:   "a123456",
		// 	GenderID:   uintPtr(1),
		// },
		// // Admin
		{
			FullName:   "แอดมิน เทส",
			RoleID:     uintPtr(3),
			AdvisorID:  nil,
			Email:      "Admin@gmail.com",
			UserName:   "Admin",
			Password:   "admin123456",
			GenderID:   uintPtr(1),
		},
		// Student
		// {
		// 	PositionID: nil,
		// 	FullName:   "นักเรียน ดีเด่น",
		// 	RoleID:     uintPtr(1),
		// 	AdvisorID:  uintPtr(2),
		// 	Email:      "B6412345@gmail.com",
		// 	UserName:   "B6412345",
		// 	Password:   "b123456",
		// 	GenderID:   uintPtr(1),
		// },
		// {
		// 	PositionID: nil,
		// 	FullName:   "นายตั้งใจ มาเรียน",
		// 	RoleID:     uintPtr(1),
		// 	AdvisorID:  uintPtr(2),
		// 	Email:      "B64126265@gmail.com",
		// 	UserName:   "student2",
		// 	Password:   "b123456",
		// 	GenderID:   uintPtr(1),
		// },
		// {
		// 	PositionID: nil,
		// 	FullName:   "นายขย้นโดดเรียน",
		// 	RoleID:     uintPtr(1),
		// 	AdvisorID:  uintPtr(2),
		// 	Email:      "B641444444265@gmail.com",
		// 	UserName:   "student3",
		// 	Password:   "b123456",
		// 	GenderID:   uintPtr(1),
		// },
		// {
		// 	PositionID: nil,
		// 	FullName:   "เด็กดี วีสตาร์",
		// 	RoleID:     uintPtr(1),
		// 	AdvisorID:  uintPtr(1),
		// 	Email:      "B123456@gmail.com",
		// 	UserName:   "DekDeeVstart",
		// 	Password:   "a123456",
		// 	GenderID:   uintPtr(2),
		// },
	}

	for i, user := range users {
		// Hash the password before inserting
		hashedPassword, err := hashPassword(user.Password)
		if err != nil {
			panic(err)
		}
		users[i].Password = hashedPassword

		// Insert or update the user
		db.FirstOrCreate(&users[i], &entity.Users{Email: user.Email})
	}

	// Seed TimeSlot data
	// thTimeZone := time.FixedZone("ICT", 7*3600)
	// timeSlots := []entity.TimeSlots{
	// 	{
	// 		UserID:        1,
	// 		SlotDate:      time.Date(2024, time.September, 24, 0, 0, 0, 0, thTimeZone),
	// 		SlotStartTime: time.Date(2024, time.September, 24, 9, 0, 0, 0, thTimeZone),
	// 		SlotEndTime:   time.Date(2024, time.September, 24, 10, 30, 0, 0, thTimeZone),
	// 		Location:      "ห้องเรียน A",
	// 		Title:         "การประชุมรายงาน",
	// 		IsAvailable:   true,
	// 	},
	// 	{
	// 		UserID:        1,
	// 		SlotDate:      time.Date(2024, time.September, 25, 0, 0, 0, 0, thTimeZone),
	// 		SlotStartTime: time.Date(2024, time.September, 25, 13, 0, 0, 0, thTimeZone),
	// 		SlotEndTime:   time.Date(2024, time.September, 25, 13, 30, 0, 0, thTimeZone),
	// 		Location:      "ห้องเรียน B",
	// 		Title:         "การประชุมทีมงาน",
	// 		IsAvailable:   false,
	// 	},
	// 	{
	// 		UserID:        2,
	// 		SlotDate:      time.Date(2024, time.September, 23, 0, 0, 0, 0, thTimeZone),
	// 		SlotStartTime: time.Date(2024, time.September, 23, 13, 0, 0, 0, thTimeZone),
	// 		SlotEndTime:   time.Date(2024, time.September, 23, 13, 15, 0, 0, thTimeZone),
	// 		Location:      "ห้องเรียน C",
	// 		Title:         "การสัมมนา",
	// 		IsAvailable:   true,
	// 	},
	// 	{
	// 		UserID:        2,
	// 		SlotDate:      time.Date(2024, time.September, 23, 0, 0, 0, 0, thTimeZone),
	// 		SlotStartTime: time.Date(2024, time.September, 23, 13, 15, 0, 0, thTimeZone),
	// 		SlotEndTime:   time.Date(2024, time.September, 23, 13, 30, 0, 0, thTimeZone),
	// 		Location:      "ห้องเรียน C",
	// 		Title:         "การสัมมนา",
	// 		IsAvailable:   true,
	// 	},
	// 	{
	// 		UserID:        2,
	// 		SlotDate:      time.Date(2024, time.September, 24, 0, 0, 0, 0, thTimeZone),
	// 		SlotStartTime: time.Date(2024, time.September, 24, 13, 30, 0, 0, thTimeZone),
	// 		SlotEndTime:   time.Date(2024, time.September, 24, 13, 45, 0, 0, thTimeZone),
	// 		Location:      "ห้องเรียน C",
	// 		Title:         "การสัมมนา",
	// 		IsAvailable:   true,
	// 	},
	// 	{
	// 		UserID:        2,
	// 		SlotDate:      time.Date(2024, time.September, 24, 0, 0, 0, 0, thTimeZone),
	// 		SlotStartTime: time.Date(2024, time.September, 24, 13, 45, 0, 0, thTimeZone),
	// 		SlotEndTime:   time.Date(2024, time.September, 24, 13, 60, 0, 0, thTimeZone),
	// 		Location:      "ห้องเรียน C",
	// 		Title:         "การสัมมนา",
	// 		IsAvailable:   true,
	// 	},
	// 	{
	// 		UserID:        2,
	// 		SlotDate:      time.Date(2024, time.September, 23, 0, 0, 0, 0, thTimeZone),
	// 		SlotStartTime: time.Date(2024, time.September, 23, 14, 15, 0, 0, thTimeZone),
	// 		SlotEndTime:   time.Date(2024, time.September, 23, 14, 30, 0, 0, thTimeZone),
	// 		Location:      "ห้องเรียน C",
	// 		Title:         "การสัมมนา",
	// 		IsAvailable:   true,
	// 	},
	// 	{
	// 		UserID:        2,
	// 		SlotDate:      time.Date(2024, time.September, 23, 0, 0, 0, 0, thTimeZone),
	// 		SlotStartTime: time.Date(2024, time.September, 23, 14, 30, 0, 0, thTimeZone),
	// 		SlotEndTime:   time.Date(2024, time.September, 23, 14, 45, 0, 0, thTimeZone),
	// 		Location:      "ห้องเรียน C",
	// 		Title:         "การสัมมนา",
	// 		IsAvailable:   true,
	// 	},
	// 	{
	// 		UserID:        2,
	// 		SlotDate:      time.Date(2024, time.September, 24, 0, 0, 0, 0, thTimeZone),
	// 		SlotStartTime: time.Date(2024, time.September, 24, 14, 45, 0, 0, thTimeZone),
	// 		SlotEndTime:   time.Date(2024, time.September, 24, 14, 60, 0, 0, thTimeZone),
	// 		Location:      "ห้องเรียน C",
	// 		Title:         "การสัมมนา",
	// 		IsAvailable:   false,
	// 	},
	// 	//

	// 	{
	// 		UserID:        2,
	// 		SlotDate:      time.Date(2024, time.September, 20, 0, 0, 0, 0, thTimeZone),
	// 		SlotStartTime: time.Date(2024, time.September, 20, 13, 45, 0, 0, thTimeZone),
	// 		SlotEndTime:   time.Date(2024, time.September, 20, 13, 60, 0, 0, thTimeZone),
	// 		Location:      "ห้องเรียน C",
	// 		Title:         "การสัมมนา",
	// 		IsAvailable:   true,
	// 	},
	// 	{
	// 		UserID:        2,
	// 		SlotDate:      time.Date(2024, time.September, 20, 0, 0, 0, 0, thTimeZone),
	// 		SlotStartTime: time.Date(2024, time.September, 20, 16, 15, 0, 0, thTimeZone),
	// 		SlotEndTime:   time.Date(2024, time.September, 20, 16, 30, 0, 0, thTimeZone),
	// 		Location:      "ห้องเรียน C",
	// 		Title:         "การสัมมนา",
	// 		IsAvailable:   true,
	// 	},
	// 	{
	// 		UserID:        2,
	// 		SlotDate:      time.Date(2024, time.September, 20, 0, 0, 0, 0, thTimeZone),
	// 		SlotStartTime: time.Date(2024, time.September, 20, 16, 30, 0, 0, thTimeZone),
	// 		SlotEndTime:   time.Date(2024, time.September, 20, 16, 45, 0, 0, thTimeZone),
	// 		Location:      "ห้องเรียน C",
	// 		Title:         "การสัมมนา",
	// 		IsAvailable:   true,
	// 	},
	// 	{
	// 		UserID:        2,
	// 		SlotDate:      time.Date(2024, time.September, 20, 0, 0, 0, 0, thTimeZone),
	// 		SlotStartTime: time.Date(2024, time.September, 20, 16, 45, 0, 0, thTimeZone),
	// 		SlotEndTime:   time.Date(2024, time.September, 20, 16, 60, 0, 0, thTimeZone),
	// 		Location:      "ห้องเรียน C",
	// 		Title:         "การสัมมนา",
	// 		IsAvailable:   true,
	// 	},
	// 	{
	// 		UserID:        2,
	// 		SlotDate:      time.Date(2024, time.September, 20, 0, 0, 0, 0, thTimeZone),
	// 		SlotStartTime: time.Date(2024, time.September, 20, 16, 45, 0, 0, thTimeZone),
	// 		SlotEndTime:   time.Date(2024, time.September, 20, 16, 60, 0, 0, thTimeZone),
	// 		Location:      "ห้องเรียน C",
	// 		Title:         "การสัมมนา",
	// 		IsAvailable:   true,
	// 	},
	// }
	// for _, timeSlot := range timeSlots {
	// 	db.Where(timeSlot).FirstOrCreate(&timeSlot)
	// }

	// bookings := []entity.Bookings{
	// 	{
	// 		Title:     "โครงงานคอมพิวเตอร์",
	// 		StatusID:  uintPtr(1),
	// 		TimeSlotID: uintPtr(1),
	// 		UserID:    uintPtr(5),
	// 	},
	// 	{
	// 		Title:     "ปรึกษาอาจารย์",
	// 		StatusID:  uintPtr(1),
	// 		TimeSlotID: uintPtr(2),
	// 		UserID:    uintPtr(6),
	// 	},
	// 	{
	// 		Title:     "วางแผนโปรเจค",
	// 		StatusID:  uintPtr(1),
	// 		TimeSlotID: uintPtr(3),
	// 		UserID:    uintPtr(6),
	// 	},
	// }

	// for _, booking := range bookings {
	// 	// Assuming TimeSlotID and UserID uniquely identify a booking
	// 	db.Where("time_slot_id = ? AND user_id = ?", booking.TimeSlotID, booking.UserID).
	// 		FirstOrCreate(&booking)
	// }
}
