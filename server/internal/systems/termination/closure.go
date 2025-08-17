package termination

type closure struct {
	name    string
	closure func()
}

func newClosure(name string, clsr func()) closure {
	return closure{
		name:    name,
		closure: clsr,
	}
}
