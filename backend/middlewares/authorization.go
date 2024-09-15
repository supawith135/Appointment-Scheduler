package middlewares

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/supawith135/Appointment-Scheduler/services"
)

var HashKey = []byte("very-secret")

var BlockKey = []byte("a-lot-secret1234")

// Authorization เป็นฟังก์ชั่นตรวจเช็ค Cookie
func Authorizes(roles ...string) gin.HandlerFunc {
    return func(c *gin.Context) {
        clientToken := c.Request.Header.Get("Authorization")
        if clientToken == "" {
            c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "No Authorization header provided"})
            return
        }

        extractedToken := strings.Split(clientToken, "Bearer ")
        if len(extractedToken) != 2 {
            c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Incorrect Format of Authorization Token"})
            return
        }

        clientToken = strings.TrimSpace(extractedToken[1])

        jwtWrapper := services.JwtWrapper{
            SecretKey: "SvNQpBN8y3qlVrsGAYYWoJJk56LtzFHx",
            Issuer:    "AuthService",
        }

        claims, err := jwtWrapper.ValidateToken(clientToken)
        if err != nil {
            c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
            return
        }

        // Check if the user's role is allowed
        roleAllowed := false
        for _, role := range roles {
            if claims.Role == role {
                roleAllowed = true
                break
            }
        }

        if !roleAllowed {
            c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "You don't have permission to access this resource"})
            return
        }

        // Add claims to the context for use in handlers
        c.Set("claims", claims)

        c.Next()
    }
}