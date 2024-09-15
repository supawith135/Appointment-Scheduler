package services

import (
	"errors"
	"time"

	jwt "github.com/dgrijalva/jwt-go"
)

// JwtWrapper wraps the signing key and the issuer

type JwtWrapper struct {
    SecretKey       string
    Issuer          string
    ExpirationHours int64
}

type JwtClaim struct {
    UserName string
    Role     string
    jwt.StandardClaims
}

func (j *JwtWrapper) GenerateToken(username string, role string) (signedToken string, err error) {
    claims := &JwtClaim{
        UserName: username,
        Role:     role,
        StandardClaims: jwt.StandardClaims{
            ExpiresAt: time.Now().Local().Add(time.Hour * time.Duration(j.ExpirationHours)).Unix(),
            Issuer:    j.Issuer,
        },
    }

    token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
    signedToken, err = token.SignedString([]byte(j.SecretKey))

    if err != nil {
        return
    }
    return
}
// Validate Token validates the jwt token

func (j *JwtWrapper) ValidateToken(signedToken string) (claims *JwtClaim, err error) {
	token, err := jwt.ParseWithClaims(
		signedToken,
		&JwtClaim{},
		func(token *jwt.Token) (interface{}, error) {
			return []byte(j.SecretKey), nil
		},
	)

	if err != nil {
		return
	}

	claims, ok := token.Claims.(*JwtClaim)

	if !ok {
		err = errors.New("Couldn't parse claims")
		return
	}

	if claims.ExpiresAt < time.Now().Local().Unix() {
		err = errors.New("JWT is expired")
		return
	}
	return
}
