package entity

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	PositionID *uint
	Position   Position `gorm:"foreignKey:PositionID;references:ID"`
	FullName   string `gorm:"uniqueIndex"`
	RoleID     *uint
	Role       Role `gorm:"foreignKey:RoleID;references:ID"`
	AdvisorID  *uint
	Advisor    *User  `gorm:"foreignKey:AdvisorID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
	Email      string `gorm:"uniqueIndex"`
	UserName   string `gorm:"uniqueIndex"`
	Password   string
	GenderID   *uint
	Gender     Gender `gorm:"foreignKey:GenderID;references:ID"`
}

type Position struct {
	gorm.Model
	PositionName string
	Users        []User `gorm:"foreignKey:PositionID"`
}

type Gender struct {
	gorm.Model
	GenderName string `gorm:"uniqueIndex"`
	Users      []User `gorm:"foreignKey:GenderID"`
}

type Role struct {
	gorm.Model
	RoleName string `gorm:"uniqueIndex"`
	Users    []User `gorm:"foreignKey:RoleID"`
}

type TimeSlot struct {
	gorm.Model
	UserID        uint
	User          User `gorm:"foreignKey:UserID;references:ID"`
	SlotDate      time.Time
	SlotStartTime time.Time
	SlotEndTime   time.Time
	Location      string
	Title         string
	IsAvailable   bool
}

type Booking struct {
	gorm.Model
	BookingDate time.Time
	BookingTime time.Time
	StatusID    *uint
	Status      Status `gorm:"foreignKey:StatusID;references:ID"`
	TimeSlotID  *uint
	TimeSlot    TimeSlot `gorm:"foreignKey:TimeSlotID;references:ID"`
	UserID      *uint
	User        User `gorm:"foreignKey:UserID;references:ID"`
}

type Status struct {
	gorm.Model
	Status   string
	Bookings []Booking `gorm:"foreignKey:StatusID"`
}
