export interface LanguageTestCase {
  id: string;
  name: string;
  code: string;
  stdin?: string;
  expectedOutput?: string;
  checkGeneratedFile?: string;
}

export const LANGUAGE_TEST_MATRIX: Record<string, LanguageTestCase> = {
  python: {
    id: "python",
    name: "Python",
    code: `print("BOSSgt TEST PASS")`,
    expectedOutput: "BOSSgt TEST PASS"
  },
  javascript: {
    id: "javascript",
    name: "JavaScript",
    code: `console.log("BOSSgt TEST PASS");`,
    expectedOutput: "BOSSgt TEST PASS"
  },
  typescript: {
    id: "typescript",
    name: "TypeScript",
    code: `const msg: string = "BOSSgt TEST PASS"; console.log(msg);`,
    expectedOutput: "BOSSgt TEST PASS"
  },
  c: {
    id: "c",
    name: "C",
    code: `#include <stdio.h>\nint main() { printf("BOSSgt TEST PASS\\n"); return 0; }`,
    expectedOutput: "BOSSgt TEST PASS"
  },
  cpp: {
    id: "cpp",
    name: "C++",
    code: `#include <iostream>\nint main() { std::cout << "BOSSgt TEST PASS" << std::endl; return 0; }`,
    expectedOutput: "BOSSgt TEST PASS"
  },
  java: {
    id: "java",
    name: "Java",
    code: `public class Main { public static void main(String[] args) { System.out.println("BOSSgt TEST PASS"); } }`,
    expectedOutput: "BOSSgt TEST PASS"
  },
  bash: {
    id: "bash",
    name: "Bash",
    code: `echo "BOSSgt TEST PASS"`,
    expectedOutput: "BOSSgt TEST PASS"
  },
  ruby: {
    id: "ruby",
    name: "Ruby",
    code: `puts "BOSSgt TEST PASS"`,
    expectedOutput: "BOSSgt TEST PASS"
  },
  perl: {
    id: "perl",
    name: "Perl",
    code: `print "BOSSgt TEST PASS\\n";`,
    expectedOutput: "BOSSgt TEST PASS"
  },
  swift: {
    id: "swift",
    name: "Swift",
    code: `print("BOSSgt TEST PASS")`,
    expectedOutput: "BOSSgt TEST PASS"
  },
  rust: {
    id: "rust",
    name: "Rust",
    code: `fn main() { println!("BOSSgt TEST PASS"); }`,
    expectedOutput: "BOSSgt TEST PASS"
  },
  go: {
    id: "go",
    name: "Go",
    code: `package main\nimport "fmt"\nfunc main() { fmt.Println("BOSSgt TEST PASS") }`,
    expectedOutput: "BOSSgt TEST PASS"
  },
  ncl: {
    id: "ncl",
    name: "NCAR Command Language (NCL)",
    code: `begin\nx = fspan(0,10,11)\ny = x^2\nwks = gsn_open_wks("png", "simple_plot")\nres = True\nres@tiMainString = "Simple X-Y Plot from NCL"\nplot = gsn_csm_xy(wks, x, y, res)\nend`,
    checkGeneratedFile: "simple_plot.png"
  }
};
