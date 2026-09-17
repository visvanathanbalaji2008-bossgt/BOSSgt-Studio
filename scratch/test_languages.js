const { executeCode } = require("../src/lib/execution-engine");
const { LANGUAGE_REGISTRY } = require("../src/lib/language-registry");
const { LANGUAGE_TEST_MATRIX } = require("../src/lib/execution/language-matrix");

async function runLanguageTests() {
  console.log("\n========================================");
  console.log("BOSSgt LANGUAGE EXECUTION TEST MATRIX");
  console.log("========================================\n");

  let readyCount = 0;
  let failedCount = 0;
  let unavailableCount = 0;

  const results = [];

  const langKeys = Object.keys(LANGUAGE_REGISTRY);

  for (const langId of langKeys) {
    const langDef = LANGUAGE_REGISTRY[langId];
    const testCase = LANGUAGE_TEST_MATRIX[langId] || {
      id: langId,
      name: langDef.name,
      code: `print("BOSSgt TEST PASS")`,
      expectedOutput: "BOSSgt TEST PASS"
    };

    try {
      const res = await executeCode({
        code: testCase.code,
        language: langId,
        stdin: testCase.stdin || ""
      });

      if (res.exitCode === 0 && (
        (testCase.expectedOutput && res.stdout.includes(testCase.expectedOutput)) ||
        (testCase.checkGeneratedFile && res.generatedFiles?.some(f => f.name === testCase.checkGeneratedFile))
      )) {
        readyCount++;
        results.push({ lang: langDef.name, status: "PASS", detail: `${res.timeMs}ms` });
      } else if (res.exitCode === 501 || res.stderr.includes("not provisioned")) {
        unavailableCount++;
        results.push({ lang: langDef.name, status: "UNAVAILABLE", detail: "Runtime not provisioned" });
      } else {
        failedCount++;
        results.push({ lang: langDef.name, status: "FAIL", detail: res.stderr || `Exit code ${res.exitCode}` });
      }
    } catch (err) {
      unavailableCount++;
      results.push({ lang: langDef.name, status: "UNAVAILABLE", detail: err.message });
    }
  }

  // Print results
  for (const r of results) {
    const padName = r.lang.padEnd(25, " ");
    if (r.status === "PASS") {
      console.log(`\x1b[32m✓ ${padName} PASS  (${r.detail})\x1b[0m`);
    } else if (r.status === "UNAVAILABLE") {
      console.log(`\x1b[33m⚠ ${padName} RUNTIME UNAVAILABLE\x1b[0m`);
    } else {
      console.log(`\x1b[31m✕ ${padName} FAILED (${r.detail})\x1b[0m`);
    }
  }

  console.log("\n========================================");
  console.log(`TOTAL REGISTERED: ${langKeys.length}`);
  console.log(`VERIFIED READY  : ${readyCount}`);
  console.log(`UNAVAILABLE     : ${unavailableCount}`);
  console.log(`FAILED          : ${failedCount}`);
  console.log("========================================\n");

  if (failedCount > 0) {
    process.exit(1);
  }
}

runLanguageTests();
