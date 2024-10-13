package transactions

import (
	"financo/server/types/generic/nullable"
	"time"
)

type accountKey struct {
	Key       string
	ParentKey nullable.Type[string]
}

type transactionsSeed struct {
	Source       accountKey
	Target       accountKey
	SourceAmount int64
	TargetAmount int64
	Notes        nullable.Type[string]
	IssuedAt     func(moment time.Time) time.Time
	ExecutedAt   func(moment time.Time) nullable.Type[time.Time]
	DeletedAt    func(moment time.Time) nullable.Type[time.Time]
}

var (
	transactions = []transactionsSeed{
		{ // Paycheck
			Source: accountKey{
				Key:       "day_job",
				ParentKey: nullable.New("paycheck"),
			},
			Target: accountKey{
				Key: "personal_bank_account",
			},
			SourceAmount: 2_000_00,
			TargetAmount: 2_000_00,
			Notes:        nullable.Type[string]{},
			IssuedAt: func(moment time.Time) time.Time {
				date := time.Date(moment.Year(), moment.Month(), 27, 0, 0, 0, 0, moment.Location()).UTC()

				if date.Day() > moment.Day() {
					return date.AddDate(0, -1, 0)
				}

				return date
			},
			ExecutedAt: func(moment time.Time) nullable.Type[time.Time] {
				date := time.Date(moment.Year(), moment.Month(), 27, 0, 0, 0, 0, moment.Location()).UTC()

				if date.Day() > moment.Day() {
					return nullable.New(date.AddDate(0, -1, 0))
				}

				return nullable.New(date)
			},
			DeletedAt: func(moment time.Time) nullable.Type[time.Time] {
				return nullable.Type[time.Time]{}
			},
		},
		{ // Monthly Savings
			Source: accountKey{
				Key: "personal_bank_account",
			},
			Target: accountKey{
				Key: "personal_savings_account",
			},
			SourceAmount: 300_00,
			TargetAmount: 300_00,
			Notes:        nullable.New("Monthly savings"),
			IssuedAt: func(moment time.Time) time.Time {
				date := time.Date(moment.Year(), moment.Month(), 1, 0, 0, 0, 0, moment.Location()).UTC()

				return date
			},
			ExecutedAt: func(moment time.Time) nullable.Type[time.Time] {
				date := time.Date(moment.Year(), moment.Month(), 1, 0, 0, 0, 0, moment.Location()).UTC()

				return nullable.New(date)
			},
			DeletedAt: func(moment time.Time) nullable.Type[time.Time] {
				return nullable.Type[time.Time]{}
			},
		},
		{ // Credit Card Payment
			Source: accountKey{
				Key: "personal_bank_account",
			},
			Target: accountKey{
				Key: "credit_card",
			},
			SourceAmount: 150_00,
			TargetAmount: 150_00,
			Notes:        nullable.Type[string]{},
			IssuedAt: func(moment time.Time) time.Time {
				date := time.Date(moment.Year(), moment.Month(), 4, 0, 0, 0, 0, moment.Location()).UTC()

				if date.Day() > moment.Day() {
					return date.AddDate(0, -1, 0)
				}

				return date
			},
			ExecutedAt: func(moment time.Time) nullable.Type[time.Time] {
				date := time.Date(moment.Year(), moment.Month(), 4, 0, 0, 0, 0, moment.Location()).UTC()

				if date.Day() > moment.Day() {
					return nullable.New(date.AddDate(0, -1, 0))
				}

				return nullable.New(date)
			},
			DeletedAt: func(moment time.Time) nullable.Type[time.Time] {
				return nullable.Type[time.Time]{}
			},
		},
		{ // Car Payment
			Source: accountKey{
				Key: "personal_bank_account",
			},
			Target: accountKey{
				Key: "car_loan",
			},
			SourceAmount: 100_00,
			TargetAmount: 100_00,
			Notes:        nullable.Type[string]{},
			IssuedAt: func(moment time.Time) time.Time {
				date := time.Date(moment.Year(), moment.Month(), 7, 0, 0, 0, 0, moment.Location()).UTC()

				if date.Day() > moment.Day() {
					return date.AddDate(0, -1, 0)
				}

				return date
			},
			ExecutedAt: func(moment time.Time) nullable.Type[time.Time] {
				date := time.Date(moment.Year(), moment.Month(), 7, 0, 0, 0, 0, moment.Location()).UTC()

				if date.Day() > moment.Day() {
					return nullable.New(date.AddDate(0, -1, 0))
				}

				return nullable.New(date)
			},
			DeletedAt: func(moment time.Time) nullable.Type[time.Time] {
				return nullable.Type[time.Time]{}
			},
		},
		{ // Old Freelance payment
			Source: accountKey{
				ParentKey: nullable.New("paycheck"),
				Key:       "freelancing",
			},
			Target: accountKey{
				Key: "freelance_bank_account",
			},
			SourceAmount: 800_00,
			TargetAmount: 800_00,
			Notes:        nullable.New("Wrestling Gig"),
			IssuedAt: func(moment time.Time) time.Time {
				return moment.AddDate(0, 0, -100).UTC()
			},
			ExecutedAt: func(moment time.Time) nullable.Type[time.Time] {
				return nullable.New(moment.AddDate(0, 0, -100).UTC())
			},
			DeletedAt: func(moment time.Time) nullable.Type[time.Time] {
				return nullable.Type[time.Time]{}
			},
		},
		{ // Old Freelance paying to credit card
			Source: accountKey{
				Key: "freelance_bank_account",
			},
			Target: accountKey{
				Key: "personal_savings_account",
			},
			SourceAmount: 500_00,
			TargetAmount: 500_00,
			Notes:        nullable.New("For the piggy bag"),
			IssuedAt: func(moment time.Time) time.Time {
				return moment.AddDate(0, 0, -100).UTC()
			},
			ExecutedAt: func(moment time.Time) nullable.Type[time.Time] {
				return nullable.New(moment.AddDate(0, 0, -100).UTC())
			},
			DeletedAt: func(moment time.Time) nullable.Type[time.Time] {
				return nullable.Type[time.Time]{}
			},
		},
		{ // Old Freelance paying to credit card
			Source: accountKey{
				Key: "freelance_bank_account",
			},
			Target: accountKey{
				Key: "credit_card",
			},
			SourceAmount: 300_00,
			TargetAmount: 300_00,
			Notes:        nullable.Type[string]{},
			IssuedAt: func(moment time.Time) time.Time {
				return moment.AddDate(0, 0, -100).UTC()
			},
			ExecutedAt: func(moment time.Time) nullable.Type[time.Time] {
				return nullable.New(moment.AddDate(0, 0, -100).UTC())
			},
			DeletedAt: func(moment time.Time) nullable.Type[time.Time] {
				return nullable.Type[time.Time]{}
			},
		},
		{ // Teaching payment
			Source: accountKey{
				Key:       "teaching",
				ParentKey: nullable.New("paycheck"),
			},
			Target: accountKey{
				Key: "personal_bank_account",
			},
			SourceAmount: 500_00,
			TargetAmount: 500_00,
			Notes:        nullable.Type[string]{},
			IssuedAt: func(moment time.Time) time.Time {
				return moment.AddDate(0, 0, -10).UTC()
			},
			ExecutedAt: func(moment time.Time) nullable.Type[time.Time] {
				return nullable.New(moment.AddDate(0, 0, -10).UTC())
			},
			DeletedAt: func(moment time.Time) nullable.Type[time.Time] {
				return nullable.Type[time.Time]{}
			},
		},
		{ // Personal loan with morgan (I'm owed)
			Source: accountKey{
				Key: "morgan_loan",
			},
			Target: accountKey{
				Key: "personal_bank_account",
			},
			SourceAmount: 200_00,
			TargetAmount: 200_00,
			Notes:        nullable.Type[string]{},
			IssuedAt: func(moment time.Time) time.Time {
				return moment.AddDate(0, 0, -3).UTC()
			},
			ExecutedAt: func(moment time.Time) nullable.Type[time.Time] {
				return nullable.New(moment.AddDate(0, 0, -3).UTC())
			},
			DeletedAt: func(moment time.Time) nullable.Type[time.Time] {
				return nullable.Type[time.Time]{}
			},
		},
		{ // Transport expense without ExecutedAt
			Source: accountKey{
				Key: "personal_bank_account",
			},
			Target: accountKey{
				Key: "transport",
			},
			SourceAmount: 50_00,
			TargetAmount: 50_00,
			Notes:        nullable.Type[string]{},
			IssuedAt: func(moment time.Time) time.Time {
				return moment.UTC()
			},
			ExecutedAt: func(moment time.Time) nullable.Type[time.Time] {
				return nullable.Type[time.Time]{}
			},
			DeletedAt: func(moment time.Time) nullable.Type[time.Time] {
				return nullable.Type[time.Time]{}
			},
		},
		{ // Hobby expense without ExecutedAt
			Source: accountKey{
				Key: "personal_bank_account",
			},
			Target: accountKey{
				ParentKey: nullable.New("market"),
				Key:       "gardening_supplies",
			},
			SourceAmount: 80_00,
			TargetAmount: 80_00,
			Notes:        nullable.Type[string]{},
			IssuedAt: func(moment time.Time) time.Time {
				return moment.UTC()
			},
			ExecutedAt: func(moment time.Time) nullable.Type[time.Time] {
				return nullable.Type[time.Time]{}
			},
			DeletedAt: func(moment time.Time) nullable.Type[time.Time] {
				return nullable.Type[time.Time]{}
			},
		},
		{ // Savings in the US, different currency account
			Source: accountKey{
				Key: "personal_bank_account",
			},
			Target: accountKey{
				Key: "us_savings_account",
			},
			SourceAmount: 150_00,
			TargetAmount: 163_50,
			Notes:        nullable.Type[string]{},
			IssuedAt: func(moment time.Time) time.Time {
				return moment.AddDate(0, 0, -1).UTC()
			},
			ExecutedAt: func(moment time.Time) nullable.Type[time.Time] {
				return nullable.New(moment.UTC())
			},
			DeletedAt: func(moment time.Time) nullable.Type[time.Time] {
				return nullable.Type[time.Time]{}
			},
		},
		{ // Groceries
			Source: accountKey{
				Key: "personal_bank_account",
			},
			Target: accountKey{
				Key: "market",
			},
			SourceAmount: 100_00,
			TargetAmount: 100_00,
			Notes:        nullable.Type[string]{},
			IssuedAt: func(moment time.Time) time.Time {
				return moment.AddDate(0, 0, -7).UTC()
			},
			ExecutedAt: func(moment time.Time) nullable.Type[time.Time] {
				return nullable.New(moment.AddDate(0, 0, -5).UTC())
			},
			DeletedAt: func(moment time.Time) nullable.Type[time.Time] {
				return nullable.Type[time.Time]{}
			},
		},
		{ // Fruits
			Source: accountKey{
				Key: "personal_bank_account",
			},
			Target: accountKey{
				ParentKey: nullable.New("market"),
				Key:       "fruit_shop",
			},
			SourceAmount: 40_00,
			TargetAmount: 40_00,
			Notes:        nullable.Type[string]{},
			IssuedAt: func(moment time.Time) time.Time {
				return moment.UTC()
			},
			ExecutedAt: func(moment time.Time) nullable.Type[time.Time] {
				return nullable.New(moment.UTC())
			},
			DeletedAt: func(moment time.Time) nullable.Type[time.Time] {
				return nullable.Type[time.Time]{}
			},
		},
		{ // Some meat
			Source: accountKey{
				Key: "personal_bank_account",
			},
			Target: accountKey{
				ParentKey: nullable.New("market"),
				Key:       "food",
			},
			SourceAmount: 100_00,
			TargetAmount: 100_00,
			Notes:        nullable.Type[string]{},
			IssuedAt: func(moment time.Time) time.Time {
				return moment.AddDate(0, 0, -1).UTC()
			},
			ExecutedAt: func(moment time.Time) nullable.Type[time.Time] {
				return nullable.Type[time.Time]{}
			},
			DeletedAt: func(moment time.Time) nullable.Type[time.Time] {
				return nullable.Type[time.Time]{}
			},
		},
		{ // Carlos' lunch
			Source: accountKey{
				Key: "carlos_lunch",
			},
			Target: accountKey{
				Key: "personal_bank_account",
			},
			SourceAmount: 80_00,
			TargetAmount: 80_00,
			Notes:        nullable.Type[string]{},
			IssuedAt: func(moment time.Time) time.Time {
				return moment.AddDate(0, 0, -1).UTC()
			},
			ExecutedAt: func(moment time.Time) nullable.Type[time.Time] {
				return nullable.New(moment.AddDate(0, 0, -1).UTC())
			},
			DeletedAt: func(moment time.Time) nullable.Type[time.Time] {
				return nullable.Type[time.Time]{}
			},
		},
		{ // Carlos' lunch
			Source: accountKey{
				Key: "personal_bank_account",
			},
			Target: accountKey{
				Key: "laptop_credit",
			},
			SourceAmount: 1_234_69,
			TargetAmount: 1_234_69,
			Notes:        nullable.Type[string]{},
			IssuedAt: func(moment time.Time) time.Time {
				return moment.AddDate(0, -4, 0).UTC()
			},
			ExecutedAt: func(moment time.Time) nullable.Type[time.Time] {
				return nullable.New(moment.AddDate(0, -4, 0).UTC())
			},
			DeletedAt: func(moment time.Time) nullable.Type[time.Time] {
				return nullable.Type[time.Time]{}
			},
		},
		{ // Next Credit Card Payment
			Source: accountKey{
				Key: "personal_bank_account",
			},
			Target: accountKey{
				Key: "credit_card",
			},
			SourceAmount: 150_00,
			TargetAmount: 150_00,
			Notes:        nullable.Type[string]{},
			IssuedAt: func(moment time.Time) time.Time {
				date := time.Date(moment.Year(), moment.Month(), 4, 0, 0, 0, 0, moment.Location()).UTC()

				if moment.Day() > date.Day() {
					return date.AddDate(0, 1, 0)
				}

				return date
			},
			ExecutedAt: func(moment time.Time) nullable.Type[time.Time] {
				date := time.Date(moment.Year(), moment.Month(), 4, 0, 0, 0, 0, moment.Location()).UTC()

				if moment.Day() > date.Day() {
					return nullable.New(date.AddDate(0, 1, 0))
				}

				return nullable.New(date)
			},
			DeletedAt: func(moment time.Time) nullable.Type[time.Time] {
				return nullable.Type[time.Time]{}
			},
		},
		{ // Next Car Payment
			Source: accountKey{
				Key: "personal_bank_account",
			},
			Target: accountKey{
				Key: "car_loan",
			},
			SourceAmount: 100_00,
			TargetAmount: 100_00,
			Notes:        nullable.Type[string]{},
			IssuedAt: func(moment time.Time) time.Time {
				date := time.Date(moment.Year(), moment.Month(), 7, 0, 0, 0, 0, moment.Location()).UTC()

				if moment.Day() > date.Day() {
					return date.AddDate(0, 1, 0)
				}

				return date
			},
			ExecutedAt: func(moment time.Time) nullable.Type[time.Time] {
				date := time.Date(moment.Year(), moment.Month(), 7, 0, 0, 0, 0, moment.Location()).UTC()

				if moment.Day() > date.Day() {
					return nullable.New(date.AddDate(0, 1, 0))
				}

				return nullable.New(date)
			},
			DeletedAt: func(moment time.Time) nullable.Type[time.Time] {
				return nullable.Type[time.Time]{}
			},
		},
	}
)
