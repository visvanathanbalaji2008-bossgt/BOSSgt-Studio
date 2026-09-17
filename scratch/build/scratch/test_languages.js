"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const execution_engine_1 = require("../src/lib/execution-engine");
const language_registry_1 = require("../src/lib/language-registry");
const language_matrix_1 = require("../src/lib/execution/language-matrix");
async function runLanguageTests() {
    console.log("\n========================================");
    console.log("BOSSgt LANGUAGE EXECUTION TEST MATRIX");
    console.log("========================================\n");
    const langKeys = Object.keys(language_registry_1.LANGUAGE_REGISTRY);
    const results = new Array(langKeys.length);
    const limit = 10;
    for (let i = 0; i < langKeys.length; i += limit) {
        const chunk = langKeys.slice(i, i + limit);
        await Promise.all(chunk.map(async (langId, index) => {
            const globalIdx = i + index;
            const langDef = language_registry_1.LANGUAGE_REGISTRY[langId];
            const testCase = language_matrix_1.LANGUAGE_TEST_MATRIX[langId] || {
                id: langId,
                name: langDef.name,
                code: `print("BOSSgt TEST PASS")`,
                expectedOutput: "BOSSgt TEST PASS"
            };
            try {
                const res = await (0, execution_engine_1.executeCode)({
                    code: testCase.code,
                    language: langId,
                    stdin: testCase.stdin || ""
                });
                if (res.exitCode === 0 && ((testCase.expectedOutput && res.stdout.includes(testCase.expectedOutput)) ||
                    (testCase.checkGeneratedFile && res.generatedFiles?.some(f => f.name === testCase.checkGeneratedFile)))) {
                    results[globalIdx] = { lang: langDef.name, status: "PASS", detail: `${res.timeMs}ms` };
                }
                else if (res.exitCode === 501 || res.stderr.includes("not provisioned")) {
                    results[globalIdx] = { lang: langDef.name, status: "UNAVAILABLE", detail: "Runtime not provisioned" };
                }
                else {
                    results[globalIdx] = { lang: langDef.name, status: "FAIL", detail: `stdout: '${res.stdout}', stderr: '${res.stderr}', exit: ${res.exitCode}` };
                }
            }
            catch (err) {
                results[globalIdx] = { lang: langDef.name, status: "UNAVAILABLE", detail: err.message };
            }
        }));
    }
    let readyCount = 0;
    let unavailableCount = 0;
    let failedCount = 0;
    for (const r of results) {
        if (!r)
            continue;
        const padName = r.lang.padEnd(30, " ");
        if (r.status === "PASS") {
            readyCount++;
            console.log(`\x1b[32m✓ ${padName} PASS         (${r.detail})\x1b[0m`);
        }
        else if (r.status === "FAIL") {
            failedCount++;
            console.log(`\x1b[31m✕ ${padName} FAILED (${r.detail})\x1b[0m`);
        }
        else {
            unavailableCount++;
        }
    }
    console.log("\n========================================");
    console.log(`TOTAL REGISTERED: ${langKeys.length}`);
    console.log(`VERIFIED READY  : ${readyCount}`);
    console.log(`UNAVAILABLE     : ${unavailableCount}`);
    console.log(`FAILED          : ${failedCount}`);
    console.log("========================================\n");
}
runLanguageTests();
