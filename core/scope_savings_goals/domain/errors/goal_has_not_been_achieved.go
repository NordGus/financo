package errors

import "errors"

var ErrGoalHasNotBeenAchieved = errors.New("mark_as_achieved_command: savings goal hasn't been achieved, yet")
