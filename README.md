# Execution Hygiene Agent

**AI can make the work faster and leave you with more work to review.**

Ten agents make ten client documents. Do you need to read all ten? This small, open-source tool sorts *already verified* work by a policy you set: skip routine re-reading, show changes worth a look, require your approval for commitments, and flag anything unknown. In the included example, ten documents become two items for human attention, with one requiring approval.

**Reduce human attention without reducing human authority.**

This is a reference implementation of one part of [Dynamic Bridge's execution reliability layer for AI-native work](https://tab-at-work.com), not a complete agent or a document checker.

[![Execution Hygiene Tests](https://github.com/danyadotan/execution-hygiene-agent/actions/workflows/test.yml/badge.svg)](https://github.com/danyadotan/execution-hygiene-agent/actions/workflows/test.yml)
[![MIT License](https://img.shields.io/badge/license-MIT-black.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-0.1.0-8b3a2b.svg)](CHANGELOG.md)

## Try the demo

You need Node.js 20 or later.

```bash
git clone https://github.com/danyadotan/execution-hygiene-agent.git
cd execution-hygiene-agent
npm install
npm run demo
npm test
```

The demo uses sample data: ten documents made from one approved baseline. It reports eight `auto_pass`, one `surface`, one `require_approval`, and zero `escalate`. Two items reach a person; only one needs explicit approval. These are **demo results**, not measured results from a live customer workflow.

## Where do I connect it? Does it run automatically?

**Not yet.** This release is a TypeScript library and a runnable demo. It is not a GitHub Action, browser plugin, or service. Cloning it and running the demo does not watch your work, read your documents, review pull requests, or approve anything. There is no automatic setup for another platform.

To use it in your own system, first verify the work with your own checks. Your system must then assign each item a `changeType` and pass it with your policy to `classify()`. Your system is also responsible for showing the returned decisions to a person, collecting approval, enforcing permissions, and checking that the action actually happened.

```ts
import { classify, type Policy } from "./src/hygiene.ts";

const policy: Policy = {
  autoPass: ["formatting_only"],
  surface: ["material_style_change"],
  requireHumanApproval: ["commercial_commitment"],
  escalate: ["missing_evidence"],
};

const result = classify(
  {
    id: "client-09",
    changeType: "commercial_commitment",
    change: "Added a 4-hour response-time commitment.",
  },
  policy
);

console.log(result.decision); // "require_approval"
```

The code above is an example **inside this repository**. To use it from another project, you need to package or copy the library and connect your own verified input and approval flow. This repo is not yet published as a plug-and-play integration.

## What the decisions mean

| Decision | What your system should do |
| --- | --- |
| `auto_pass` | Skip routine human re-reading only when your approved policy allows it. Keep the item traceable. |
| `surface` | Show the item to a person for attention. This is not itself an approval. |
| `require_approval` | Stop and get an explicit human decision before any commitment. |
| `escalate` | Stop and ask for help when the type is unknown or policy calls for escalation. |

The classifier looks up `changeType` in the policy. If a type appears in more than one list, `require_approval` wins, then `escalate`, then `surface`, then `auto_pass`. An unknown type escalates. Each result includes a reason. [See the implementation](src/hygiene.ts) and [tests](tests/hygiene.test.ts).

## What it does not decide

It does **not** read a document and decide whether a change is really `formatting_only`. It does not inspect evidence, decide whether an artifact is correct, detect all risky changes, or give permission to publish or spend money. The demo checks a `verifiedBeforeHygiene` flag, but that flag is not proof of verification. Your upstream system must do the verification and assign the correct type; your downstream system must enforce approval and verify the final result. A wrong label can produce a wrong route.

This is why the boundary matters: automate the routing you can write as a rule; keep unclear meaning and real authority with the right checks and people.

## Explore the example and policy

- [Sample ten-document input](examples/ten-documents/input.json) and [expected output](examples/ten-documents/expected-output.json)
- [Example policy](config/policy.json), which you must adapt to your own risk and authority rules
- [Classifier](src/hygiene.ts), [demo](src/index.ts), and [tests](tests/hygiene.test.ts)

The demo is a small proof of the routing idea, not the full TAB@Work execution-reliability loop. [See that larger context](https://tab-at-work.com).

## Contribute and cite

Contributions are welcome if they keep the approval boundary clear and the implementation easy to inspect. See [CONTRIBUTING.md](CONTRIBUTING.md). For citations, see [CITATION.cff](CITATION.cff).

MIT © 2026 Danya Dotan. See [LICENSE](LICENSE). Current reference release: **v0.1.0**; see [CHANGELOG.md](CHANGELOG.md).
