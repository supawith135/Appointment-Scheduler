package entity

import (
	"time"
	"gorm.io/gorm"
)

// Users represents a user entity.
type Users struct {
	gorm.Model
	PositionID    *uint     `json:"position_id"`
	Position      Positions `gorm:"foreignKey:PositionID;references:ID" json:"position"`
	FullName      string    `gorm:"uniqueIndex;not null" json:"full_name"`
	RoleID        *uint     `json:"role_id"`
	Role          Roles     `gorm:"foreignKey:RoleID;references:ID" json:"role"`
	AdvisorID     *uint     `json:"advisor_id"`
	Advisor       *Users    `gorm:"foreignKey:AdvisorID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;" json:"advisor"`
	Email         string    `gorm:"uniqueIndex;not null" json:"email"`
	Image         *string   `gorm:"type:text" json:"image"`
	Facebook      *string   `gorm:"type:text" json:"facebook"`
	Line          *string   `gorm:"type:text" json:"line"`
	ContactNumber *string   `gorm:"type:text" json:"contact_number"`
	Location      *string   `gorm:"type:text" json:"location"`
	UserName      string    `gorm:"uniqueIndex;not null" json:"user_name"`
	Password      string    `json:"password"`
	GenderID      *uint     `json:"gender_id"`
	Gender        Genders   `gorm:"foreignKey:GenderID;references:ID" json:"gender"`
}

// Positions represents a position entity.
type Positions struct {
	gorm.Model
	PositionName string  `gorm:"uniqueIndex;not null" json:"position_name"`
	Users        []Users `gorm:"foreignKey:PositionID" json:"users"`
}

// Genders represents a gender entity.
type Genders struct {
	gorm.Model
	GenderName string  `gorm:"uniqueIndex;not null" json:"gender_name"`
	Users      []Users `gorm:"foreignKey:GenderID" json:"users"`
}

// Roles represents a role entity.
type Roles struct {
	gorm.Model
	RoleName string  `gorm:"uniqueIndex;not null" json:"role_name"`
	Users    []Users `gorm:"foreignKey:RoleID" json:"users"`
}

// TimeSlots represents a time slot entity.
type TimeSlots struct {
	gorm.Model
	UserID        uint      `json:"user_id"`
	User          Users     `gorm:"foreignKey:UserID;references:ID" json:"user"`
	SlotDate      time.Time `gorm:"not null" json:"slot_date"`
	SlotStartTime time.Time `gorm:"not null" json:"slot_start_time"`
	SlotEndTime   time.Time `gorm:"not null" json:"slot_end_time"`
	Location      string    `json:"location"`
	Title         string    `json:"title"`
	IsAvailable   bool      `json:"is_available"`
}

// Bookings represents a booking entity.
type Bookings struct {
	gorm.Model
	Reason     string    `json:"reason"`
	StatusID   *uint     `json:"status_id"`
	Status     Statuses  `gorm:"foreignKey:StatusID;references:ID" json:"status"`
	TimeSlotID *uint     `json:"time_slot_id"`
	TimeSlot   TimeSlots `gorm:"foreignKey:TimeSlotID;references:ID" json:"time_slot"`
	Comment    string    `json:"comment"`
	UserID     *uint     `json:"user_id"`
	User       Users     `gorm:"foreignKey:UserID;references:ID" json:"user"`
}

// Statuses represents a status entity.
type Statuses struct {
	gorm.Model
	Status   string     `gorm:"uniqueIndex;not null" json:"status"`
	Bookings []Bookings `gorm:"foreignKey:StatusID" json:"bookings"`
}
