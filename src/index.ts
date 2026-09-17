import fs from "node:fs";
import path from "node:path";

type Policy = {
  autoPass: string[];
  surface: string[];
  requireHumanApproval: string[];
  escalate: string[];
};

type Artifact = {
  id: string;
  changeType: string;
  change: string;
};

type Input = {
  scenario: string;
  verifiedBeforeHygiene: boolean;
  artifacts: Artifact[];
};

type Decision =
  | "auto_pass"
  | "surface"
  | "require_approval"
  | "escalate";

type Result = {
  id: string;
  decision: Decision;
  reason: string;
  changeType: string;
};

const root = process.cwd();

const policy: Policy = JSON.parse(
  fs.readFileSync(path.join(root, "config", "policy.json"), "utf8")
);

const input: Input = JSON.parse(
  fs.readFileSync(
    path.join(root, "examples", "ten-documents", "input.json"),
    "utf8"
  )
);

if (!input.verifiedBeforeHygiene) {
  throw new Error(
    "Execution Hygiene Agent only accepts work that has already been verified."
  );
}

function classify(artifact: Artifact): Result {
  if (policy.requireHumanApproval.includes(artifact.changeType)) {
    return {
      id: artifact.id,
      decision: "require_approval",
      reason: "Policy requires explicit human authority for this change type.",
      changeType: artifact.changeType,
    };
  }

  if (policy.escalate.includes(artifact.changeType)) {
    return {
      id: artifact.id,
      decision: "escalate",
      reason: "The item cannot be safely resolved from the available evidence.",
      changeType: artifact.changeType,
    };
  }

  if (policy.surface.includes(artifact.changeType)) {
    return {
      id: artifact.id,
      decision: "surface",
      reason: "The change is material enough to deserve human attention.",
      changeType: artifact.changeType,
    };
  }

  if (policy.autoPass.includes(artifact.changeType)) {
    return {
      id: artifact.id,
      decision: "auto_pass",
      reason: "The change is covered by approved policy and needs no human review.",
      changeType: artifact.changeType,
    };
  }

  return {
    id: artifact.id,
    decision: "escalate",
    reason: "No matching policy rule exists for this change type.",
    changeType: artifact.changeType,
  };
}

const results = input.artifacts.map(classify);

const summary = {
  artifactsReceived: results.length,
  autoPassed: results.filter((r) => r.decision === "auto_pass").length,
  surfaced: results.filter((r) => r.decision === "surface").length,
  requireApproval: results.filter((r) => r.decision === "require_approval")
    .length,
  escalated: results.filter((r) => r.decision === "escalate").length,
};

const humanReviewSet = results.filter(
  (r) =>
    r.decision === "surface" ||
    r.decision === "require_approval" ||
    r.decision === "escalate"
);

console.log("\nExecution Hygiene Agent\n");
console.log(input.scenario);
console.log("\nSummary:");
console.table(summary);

console.log("\nHuman review set:");
console.table(humanReviewSet);

console.log(
  `\n${summary.autoPassed} of ${summary.artifactsReceived} artifacts required no human re-reading.`
);

console.log(
  `${humanReviewSet.length} items reached the human attention layer.\n`
);
