import raw from "../public/data/jarvis-tests.json";

export interface JarvisTestData {
  project: string;
  testCount: number;
  source: string;
  status: string;
  verifiedAt: string;
  commit?: string;
  workflowRun?: string | null;
}

function isValid(d: unknown): d is JarvisTestData {
  if (!d || typeof d !== "object") return false;
  const v = d as Record<string, unknown>;
  return (
    v.status === "passed" &&
    Number.isInteger(v.testCount) &&
    (v.testCount as number) >= 0 &&
    typeof v.verifiedAt === "string" &&
    !Number.isNaN(Date.parse(v.verifiedAt))
  );
}

/**
 * Test count published automatically by the JARVIS CI workflow
 * (.github/workflows/publish-test-count.yml in LucaswBohrer/jarvis).
 * Null when the JSON is missing or invalid — the UI then shows a
 * neutral fallback instead of an invented number.
 */
export const jarvisTests: JarvisTestData | null = isValid(raw) ? raw : null;
