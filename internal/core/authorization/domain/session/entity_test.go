package session

import (
	"errors"
	"reflect"
	"testing"
	"time"

	"financo/internal/core/authorization/domain/passworddigest"
	"financo/internal/core/authorization/domain/sessionID"
	"financo/internal/core/authorization/domain/sessionversion"
	"financo/internal/core/authorization/domain/timestamp"
	"financo/internal/core/authorization/domain/user"
	"financo/internal/core/authorization/domain/userID"
	"financo/internal/core/authorization/domain/username"
	"github.com/google/uuid"
)

type cryptMock struct{}

func (cryptMock) CompareHashAndPassword(_ []byte, _ []byte) error {
	return nil
}

func (cryptMock) Cost(_ []byte) (int, error) {
	return 10, nil
}

type encoderMock struct{}

func (encoderMock) EncodeToString(src []byte) string {
	return string(src)
}

func (encoderMock) DecodeString(s string) ([]byte, error) {
	return []byte(s), nil
}

type uuidEncoderMock struct{}

func (uuidEncoderMock) Validate(s string) error {
	return uuid.Validate(s)
}

func (uuidEncoderMock) Parse(s string) (uuid.UUID, error) {
	return uuid.Parse(s)
}

func userMock(sessionVersion uint32) user.Entity {
	uid, _ := userID.New(uuid.NewString(), uuidEncoderMock{})
	un, _ := username.New("john_wick")
	pw, _ := passworddigest.New("hash", cryptMock{})
	sv, _ := sessionversion.New(sessionVersion)
	ct, _ := timestamp.New(time.Now())
	ut, _ := timestamp.New(time.Now())

	return user.New(uid, un, pw, sv, ct, ut)
}

func TestEntity_Expired(t *testing.T) {
	type fields struct {
		id        sessionID.Value
		version   sessionversion.Value
		createdAt timestamp.Value
		userID    userID.Value
	}
	type args struct {
		user   user.Entity
		maxAge time.Duration
	}

	uid, _ := userID.New(uuid.NewString(), uuidEncoderMock{})
	i, _ := sessionID.New([sessionID.ByteSize]byte{}, encoderMock{})
	ver, _ := sessionversion.New(42)
	createdAt, _ := timestamp.New(time.Now().Add(-7 * 24 * time.Hour))

	tests := []struct {
		name   string
		fields fields
		args   args
		want   error
	}{
		{
			name: "is a valid session",
			fields: fields{
				id:        i,
				version:   ver,
				createdAt: createdAt,
				userID:    uid,
			},
			args: args{
				user:   userMock(42),
				maxAge: 30 * 24 * time.Hour,
			},
			want: nil,
		},
		{
			name: "is an invalid session, because is too old",
			fields: fields{
				id:        i,
				version:   ver,
				createdAt: createdAt,
				userID:    uid,
			},
			args: args{
				user:   userMock(42),
				maxAge: 24 * time.Hour,
			},
			want: ErrExpired,
		},
		{
			name: "is an invalid session, because the session is invalid",
			fields: fields{
				id:        i,
				version:   ver,
				createdAt: createdAt,
				userID:    uid,
			},
			args: args{
				user:   userMock(7),
				maxAge: 30 * 24 * time.Hour,
			},
			want: ErrExpired,
		},
		{
			name: "is an invalid session",
			fields: fields{
				id:        i,
				version:   ver,
				createdAt: createdAt,
				userID:    uid,
			},
			args: args{
				user:   userMock(7),
				maxAge: 24 * time.Hour,
			},
			want: ErrExpired,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			e := &Entity{
				id:        tt.fields.id,
				userID:    tt.fields.userID,
				version:   tt.fields.version,
				createdAt: tt.fields.createdAt,
			}

			if got := e.Expired(tt.args.user, tt.args.maxAge); !errors.Is(got, tt.want) {
				t.Errorf("Expired() = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestNew(t *testing.T) {
	type args struct {
		id        sessionID.Value
		version   sessionversion.Value
		createdAt timestamp.Value
		userID    userID.Value
	}

	uid, _ := userID.New(uuid.NewString(), uuidEncoderMock{})
	i, _ := sessionID.New([sessionID.ByteSize]byte{1}, encoderMock{})
	ver, _ := sessionversion.New(42)
	createdAt, _ := timestamp.New(time.Now())

	tests := []struct {
		name string
		args args
		want Entity
	}{
		{
			name: "initializes a new session entity",
			args: args{
				id:        i,
				version:   ver,
				createdAt: createdAt,
				userID:    uid,
			},
			want: Entity{
				id:        i,
				userID:    uid,
				version:   ver,
				createdAt: createdAt,
			},
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := New(tt.args.id, tt.args.version, tt.args.createdAt, tt.args.userID); !reflect.DeepEqual(got, tt.want) {
				t.Errorf("New() = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestEntity_IsTooOld(t *testing.T) {
	type fields struct {
		id        sessionID.Value
		userID    userID.Value
		version   sessionversion.Value
		createdAt timestamp.Value
	}
	type args struct {
		maxAge time.Duration
	}

	uid, _ := userID.New(uuid.NewString(), uuidEncoderMock{})
	i, _ := sessionID.New([sessionID.ByteSize]byte{1}, encoderMock{})
	ver, _ := sessionversion.New(42)
	createdAt, _ := timestamp.New(time.Now().Add(-7 * 24 * time.Hour))

	tests := []struct {
		name   string
		fields fields
		args   args
		want   error
	}{
		{
			name: "is not too old",
			fields: fields{
				id:        i,
				userID:    uid,
				version:   ver,
				createdAt: createdAt,
			},
			args: args{maxAge: 30 * 24 * time.Hour},
			want: nil,
		},
		{
			name: "is too old",
			fields: fields{
				id:        i,
				userID:    uid,
				version:   ver,
				createdAt: createdAt,
			},
			args: args{maxAge: 24 * time.Hour},
			want: ErrStale,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			e := &Entity{
				id:        tt.fields.id,
				userID:    tt.fields.userID,
				version:   tt.fields.version,
				createdAt: tt.fields.createdAt,
			}
			if got := e.IsTooOld(tt.args.maxAge); !errors.Is(got, tt.want) {
				t.Errorf("IsTooOld() = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestEntity_CreatedAt(t *testing.T) {
	type fields struct {
		id        sessionID.Value
		userID    userID.Value
		version   sessionversion.Value
		createdAt timestamp.Value
	}

	id, _ := sessionID.New([sessionID.ByteSize]byte{}, encoderMock{})
	uid, _ := userID.New(uuid.NewString(), uuidEncoderMock{})
	ver, _ := sessionversion.New(42)
	createdAt, _ := timestamp.New(time.Now())

	tests := []struct {
		name   string
		fields fields
		want   timestamp.Value
	}{
		{
			name: "returns the session creation timestamp",
			fields: fields{
				id:        id,
				userID:    uid,
				version:   ver,
				createdAt: createdAt,
			},
			want: createdAt,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			e := &Entity{
				id:        tt.fields.id,
				userID:    tt.fields.userID,
				version:   tt.fields.version,
				createdAt: tt.fields.createdAt,
			}
			if got := e.CreatedAt(); !reflect.DeepEqual(got, tt.want) {
				t.Errorf("CreatedAt() = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestEntity_ID(t *testing.T) {
	type fields struct {
		id        sessionID.Value
		userID    userID.Value
		version   sessionversion.Value
		createdAt timestamp.Value
	}

	id, _ := sessionID.New([sessionID.ByteSize]byte{}, encoderMock{})
	uid, _ := userID.New(uuid.NewString(), uuidEncoderMock{})
	ver, _ := sessionversion.New(42)
	createdAt, _ := timestamp.New(time.Now())

	tests := []struct {
		name   string
		fields fields
		want   sessionID.Value
	}{
		{
			name: "returns the session id",
			fields: fields{
				id:        id,
				userID:    uid,
				version:   ver,
				createdAt: createdAt,
			},
			want: id,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			e := &Entity{
				id:        tt.fields.id,
				userID:    tt.fields.userID,
				version:   tt.fields.version,
				createdAt: tt.fields.createdAt,
			}
			if got := e.ID(); !reflect.DeepEqual(got, tt.want) {
				t.Errorf("ID() = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestEntity_UserID(t *testing.T) {
	type fields struct {
		id        sessionID.Value
		userID    userID.Value
		version   sessionversion.Value
		createdAt timestamp.Value
	}

	id, _ := sessionID.New([sessionID.ByteSize]byte{}, encoderMock{})
	uid, _ := userID.New(uuid.NewString(), uuidEncoderMock{})
	ver, _ := sessionversion.New(42)
	createdAt, _ := timestamp.New(time.Now())

	tests := []struct {
		name   string
		fields fields
		want   userID.Value
	}{
		{
			name: "returns the session user id",
			fields: fields{
				id:        id,
				userID:    uid,
				version:   ver,
				createdAt: createdAt,
			},
			want: uid,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			e := &Entity{
				id:        tt.fields.id,
				userID:    tt.fields.userID,
				version:   tt.fields.version,
				createdAt: tt.fields.createdAt,
			}
			if got := e.UserID(); !reflect.DeepEqual(got, tt.want) {
				t.Errorf("UserID() = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestEntity_Version(t *testing.T) {
	type fields struct {
		id        sessionID.Value
		userID    userID.Value
		version   sessionversion.Value
		createdAt timestamp.Value
	}

	id, _ := sessionID.New([sessionID.ByteSize]byte{}, encoderMock{})
	uid, _ := userID.New(uuid.NewString(), uuidEncoderMock{})
	ver, _ := sessionversion.New(42)
	createdAt, _ := timestamp.New(time.Now())

	tests := []struct {
		name   string
		fields fields
		want   sessionversion.Value
	}{
		{
			name: "returns the session version",
			fields: fields{
				id:        id,
				userID:    uid,
				version:   ver,
				createdAt: createdAt,
			},
			want: ver,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			e := &Entity{
				id:        tt.fields.id,
				userID:    tt.fields.userID,
				version:   tt.fields.version,
				createdAt: tt.fields.createdAt,
			}
			if got := e.Version(); !reflect.DeepEqual(got, tt.want) {
				t.Errorf("Version() = %v, want %v", got, tt.want)
			}
		})
	}
}
