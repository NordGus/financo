# Categories Scope

Categories is an alias for Accounts Records which kinds are set to
`external_expense` or `external_income`.

This Accounts have a different behavior on the user facing side of **financo**
because they represent money movements in and out of the user's Account's.

## Developer Note

- Because a Category is simply an alias for an Account, the data can be modify
by **Accounts Scope** consumers. Be mindful of this fact and its side-effects.
- Remember that Categories publish their own message to **financo**'s message
buses.
