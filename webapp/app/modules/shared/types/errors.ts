export class SearchAbortedError extends Error {
  constructor() {
    super("search has been aborted", { cause: "screen prevented overlapping calls" })
  }
}

