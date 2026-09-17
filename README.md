# execution-hygiene-agent
Execution Hygiene Agent - a reusable reduction layer between verified agent output and human attention.
# Execution Hygiene Agent

AI agents can produce more work than humans can reasonably review.

Execution Hygiene Agent is a reference implementation for reducing
already-verified agent output into only the decisions, exceptions,
and authority boundaries that genuinely require human attention.

*It does not replace human authority*.

It reduces review load without reducing human control.

10 verified documents
        ↓
semantic diff
        ↓
materiality / risk / policy
        ↓
8 auto-pass
2 surfaced
1 human approval
        ↓
10 closed

Why this exists → How it works → Run the example → Safety invariant → Architecture → License
