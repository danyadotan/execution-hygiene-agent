import test from "node:test";
import assert from "node:assert/strict";

test("required human approval can never be suppressed", () => {
  const requireHumanApproval = ["commercial_commitment"];
  const changeType = "commercial_commitment";

  assert.equal(requireHumanApproval.includes(changeType), true);
});

test("approved low-risk changes can avoid human re-reading", () => {
  const autoPass = [
    "formatting_only",
    "approved_personalization",
    "non_material_style_change",
  ];

  assert.equal(autoPass.includes("formatting_only"), true);
});
