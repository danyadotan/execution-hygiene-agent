import test from "node:test";
import assert from "node:assert/strict";

import {
  classify,
  type Policy,
} from "../src/hygiene.ts";

const policy: Policy = {
  autoPass: [
    "formatting_only",
    "approved_personalization",
    "non_material_style_change",
  ],

  surface: [
    "material_style_change",
    "unusual_change",
    "policy_exception",
  ],

  requireHumanApproval: [
    "commercial_commitment",
    "legal_change",
    "permission_change",
    "financial_commitment",
  ],

  escalate: [
    "missing_evidence",
    "conflicting_policy",
    "unresolved_risk",
  ],
};

test(
  "required human approval can never be suppressed",
  () => {
    const result = classify(
      {
        id: "client-09",
        changeType: "commercial_commitment",
        change: "Added a 4-hour response-time commitment.",
      },
      policy
    );

    assert.equal(result.decision, "require_approval");
  }
);

test(
  "approved low-risk changes can avoid human re-reading",
  () => {
    const result = classify(
      {
        id: "client-02",
        changeType: "formatting_only",
        change: "Heading spacing adjusted.",
      },
      policy
    );

    assert.equal(result.decision, "auto_pass");
  }
);

test(
  "unknown change types fail safe by escalating",
  () => {
    const result = classify(
      {
        id: "client-11",
        changeType: "unknown_change",
        change: "An unrecognized change appeared.",
      },
      policy
    );

    assert.equal(result.decision, "escalate");
  }
);
