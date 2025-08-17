package termination

import "fmt"

type systemPanic struct {
	message string
	reason  any
}

func NewUnexpectedPanic(reason any) systemPanic {
	return systemPanic{
		message: "uncaught panic raised",
		reason:  reason,
	}
}

func NewPanic(message string, reason any) systemPanic {
	return systemPanic{
		message: message,
		reason:  reason,
	}
}

func (p systemPanic) Error() string {
	return fmt.Sprintf("termination: system panicked (%s): reason %v", p.message, p.reason)
}
