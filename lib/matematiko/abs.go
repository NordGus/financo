package matematiko

// Abs returns the absolute value of a number.
func Abs[N int8 | int16 | int32 | int64 | float32 | float64](n N) N {
	if n < N(0) {
		return -n
	}

	return n
}
