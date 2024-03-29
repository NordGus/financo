package sessionversion

import (
	"errors"
	"reflect"
	"testing"
)

const (
	theAnswer              = 42
	stepsToWorldDomination = 7
)

func TestNew(t *testing.T) {
	type args struct {
		version uint32
	}

	type want struct {
		value Value
		err   error
	}

	tests := []struct {
		name string
		args args
		want want
	}{
		{
			name: "initializes a new sessionversion",
			args: args{version: theAnswer},
			want: want{
				value: Value{value: theAnswer},
				err:   nil,
			},
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := New(tt.args.version)
			if !errors.Is(err, tt.want.err) {
				t.Errorf("New() error = %v, want %v", err, tt.want.err)
				return
			}
			if !reflect.DeepEqual(got, tt.want.value) {
				t.Errorf("New() got = %v, want %v", got, tt.want.value)
			}
		})
	}
}

func TestValue_IsInvalid(t *testing.T) {
	type args struct {
		version Value
	}
	tests := []struct {
		name string
		v    Value
		args args
		want bool
	}{
		{
			name: "is a valid version",
			v:    Value{value: theAnswer},
			args: args{version: Value{value: theAnswer}},
			want: false,
		},
		{
			name: "is an invalid version",
			v:    Value{value: theAnswer},
			args: args{version: Value{value: stepsToWorldDomination}},
			want: true,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := tt.v.IsInvalid(tt.args.version); got != tt.want {
				t.Errorf("IsInvalid() = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestValue_Uint32(t *testing.T) {
	tests := []struct {
		name string
		v    Value
		want uint32
	}{
		{
			name: "returns the primitive under the value",
			v:    Value{value: theAnswer},
			want: theAnswer,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := tt.v.Uint32(); got != tt.want {
				t.Errorf("Uint32() = %v, want %v", got, tt.want)
			}
		})
	}
}
