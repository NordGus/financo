package shutdown

import "fmt"

type PanicErr struct {
	Message string
	Reason  any
}

func NewPanic(reason any) PanicErr {
	return PanicErr{
		Message: "uncaught panic raised",
		Reason:  reason,
	}
}

func NewPanicWithMessage(message string, reason any) PanicErr {
	return PanicErr{
		Message: message,
		Reason:  reason,
	}
}

func (p PanicErr) Error() string {
	return fmt.Sprintf("shudown: %s, reason: %v", p.Message, p.Reason)
}
