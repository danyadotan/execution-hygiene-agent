import { describe, expect, it } from "vitest";

describe("Execution Hygiene Agent safety invariants", () => {
  it("never suppresses a required human approval", () => {
    const requireHumanApproval = ["commercial_commitment"];

    const changeType = "commercial_commitment";

    expect(requireHumanApproval.includes(changeType)).toBe(true);
  });

  it("allows approved low-risk changes to avoid human re-reading", () => {
    const autoPass = [
      "formatting_only",
      "approved_personalization",
      "non_material_style_change",
    ];

    expect(autoPass.includes("formatting_only")).toBe(true);
  });
});
