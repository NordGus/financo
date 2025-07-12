package requests

import (
	"encoding/json"
	"fmt"
	"strings"
)

type Intent string

const (
	CREATE    Intent = "create"
	UPDATE    Intent = "update"
	ARCHIVE   Intent = "archive"
	UNARCHIVE Intent = "unarchive"
	DESTROY   Intent = "destroy"
)

// UnmarshalJSON receives a buffer b, and ensures that the provided value is a
// valid [Intent]. So [Intent] satisfies the [json.Unmarshaler] interface.
//
// It returns an error if the buffer can't be unmarshal into an string or the
// provided value is not a supported [Intent].
func (t *Intent) UnmarshalJSON(b []byte) error {
	var (
		s   string
		err error
	)

	if err := json.Unmarshal(b, &s); err != nil {
		return err
	}

	*t, err = stringToIntent(s)
	if err != nil {
		return err
	}

	return nil
}

// UnmarshalJSON receives a buffer b, and ensures that the provided value is a
// valid [Intent]. So [Intent] satisfies the [json.Unmarshaler] interface.
//
// It returns an error if the buffer can't be unmarshal into an string or the
// provided value is not a supported [Intent].
func (t Intent) MarshalJSON() ([]byte, error) {
	s, err := intentToString(t)
	if err != nil {
		return []byte{}, err
	}

	return json.Marshal(s)
}

func stringToIntent(s string) (Intent, error) {
	switch strings.ToLower(s) {
	default:
		return Intent(s), fmt.Errorf("intent: invalid value \"%s\"", s)
	case "create":
		return CREATE, nil
	case "update":
		return UPDATE, nil
	case "archive":
		return ARCHIVE, nil
	case "unarchive":
		return UNARCHIVE, nil
	case "destroy":
		return DESTROY, nil
	}
}

func intentToString(t Intent) (string, error) {
	switch t {
	default:
		return "", fmt.Errorf("intent: invalid value \"%s\"", string(t))
	case CREATE:
		return "create", nil
	case UPDATE:
		return "update", nil
	case ARCHIVE:
		return "archive", nil
	case UNARCHIVE:
		return "unarchive", nil
	case DESTROY:
		return "destroy", nil
	}
}
