import { ax, av } from "./dist/acvx.js";

const axTests = [
  ["Basic merging", ax("wa", "awd"), "wa awd"],
  ["Nested arrays", ax("btn", ["active", "primary"]), "btn active primary"],
  ["Object filtering", ax("btn", { active: true, disabled: false }), "btn active"],
  ["Function-based filtering", ax("btn", { active: () => false, hidden: () => true }), "btn hidden"],
  ["Filtering falsy values", ax("btn", 123, null, undefined, "", "rounded"), "btn 123 rounded"],
  ["Strings (variadic)", ax("foo", true && "bar", "baz"), "foo bar baz"],
  ["Objects", ax({ foo: true, bar: false, baz: true }), "foo baz"],
  ["Objects (variadic)", ax({ foo: true }, { bar: false }, null, { "--foobar": "hello" }), "foo --foobar"],
  ["Arrays", ax(["foo", 0, false, "bar"]), "foo bar"],
  ["Arrays (variadic)", ax(["foo"], ["", 0, false, "bar"], [["baz", [["hello"], "there"]]]), "foo bar baz hello there"],
  ["Kitchen sink (with nesting)", ax("foo", [1 && "bar", { baz: false, bat: null }, ["hello", ["world"]]], "cya"), "foo bar hello world cya"],
  ["Deep nesting", ax(["foo", { active: true, size: "large" }, [["bar", "baz"]]]), "foo active size bar baz"],
  ["Function filtering with dynamic condition", ax("btn", { active: () => true, hidden: () => false }), "btn active"],
];

const button = av("btn", {
  variants: {
    size: {
      small: "text-sm py-1 px-2",
      medium: "text-base py-2 px-4",
      large: "text-lg py-3 px-6",
    },
    color: {
      primary: "bg-blue-500 text-white",
      secondary: "bg-gray-500 text-black",
    },
  },
  defaultVariants: {
    size: "medium",
    color: "primary",
  },
  compoundVariants: [
    {
      size: "large",
      color: "primary",
      className: "uppercase font-bold",
    },
  ],
});

const alertVariants = av("p-4 shadow", {
  variants: {
    variant: {
      default: ["text-blue-800", "border-blue-500"],
      success: "text-green-800",
      warning: ["text-yellow-800", { "bg-yellow-300": true }],
      error: { "text-red-800": true },
    },
    dismissible: {
      true: "pr-10 relative",
      false: null,
    },
    theme: {
      light: "border-l-4",
      solid: "border",
    },
  },
  compoundVariants: [
    {
      variant: ["error", "warning"],
      theme: "solid",
      class: "border-red-700",
    },
    {
      variant: "success",
      dismissible: true,
      class: "border-green-500",
    },
  ],
  defaultVariants: {
    variant: "default",
    dismissible: false,
    theme: "light",
  },
});

const avTests = [
  ["Default variants", button(), "btn text-base py-2 px-4 bg-blue-500 text-white"],
  ["Single variant override", button({ size: "small" }), "btn text-sm py-1 px-2 bg-blue-500 text-white"],
  ["Compound variant application", button({ color: "secondary", size: "large" }), "btn text-lg py-3 px-6 bg-gray-500 text-black"],
  ["Compound variant (only size match)", button({ size: "large" }), "btn text-lg py-3 px-6 bg-blue-500 text-white uppercase font-bold"],
  ["Single variant override (color)", button({ color: "secondary" }), "btn text-base py-2 px-4 bg-gray-500 text-black"],
  ["Alert: Default variants", alertVariants(), "p-4 shadow text-blue-800 border-blue-500 border-l-4"],
  ["Alert: Error with solid theme", alertVariants({ variant: "error", theme: "solid" }), "p-4 shadow text-red-800 border border-red-700"],
  ["Alert: Success and dismissible", alertVariants({ variant: "success", dismissible: true }), "p-4 shadow text-green-800 pr-10 relative border-l-4 border-green-500"],
  ["Alert: Warning variant", alertVariants({ variant: "warning" }), "p-4 shadow text-yellow-800 bg-yellow-300 border-l-4"],
  ["Alert: Success with no dismissible", alertVariants({ variant: "success", dismissible: false }), "p-4 shadow text-green-800 border-l-4"],
  ["Alert: Complex compound variant", alertVariants({ variant: "error", theme: "solid", dismissible: true }), "p-4 shadow text-red-800 pr-10 relative border border-red-700"],
  ["Alert: Theme variant (light)", alertVariants({ theme: "light" }), "p-4 shadow text-blue-800 border-blue-500 border-l-4"],
  ["Alert: Theme variant (solid)", alertVariants({ theme: "solid" }), "p-4 shadow text-blue-800 border-blue-500 border"],
];

function runTests(tests, title) {
  const RESET = "\x1b[0m";
  const GREEN = "\x1b[32m";
  const RED = "\x1b[31m";
  const CYAN = "\x1b[36m";
  const YELLOW = "\x1b[33m";
  const BOLD = "\x1b[1m";

  console.log(`\n${BOLD}${CYAN}Running ${title} Tests:${RESET}`);

  let passed = 0;

  tests.forEach(([desc, result, expected], index) => {
    const normalize = (str) => str.split(" ").sort().join(" ");

    if (normalize(result) === normalize(expected)) {
      console.log(`${GREEN}✔ Test ${index + 1}: ${desc} ${RESET}`);
      passed++;
    } else {
      console.log(`${RED}✘ Test ${index + 1}: ${desc} ${RESET}`);
      console.log(`${YELLOW}${BOLD}   Expected:${RESET} ${YELLOW}${expected}${RESET}`);
      console.log(`${YELLOW}${BOLD}   Received:${RESET} ${YELLOW}${result}${RESET}`);
    }
  });

  console.log(`\n${BOLD}${CYAN}${title} Tests: ${passed}/${tests.length} Passed.${RESET}`);
  console.log(`${passed === tests.length ? GREEN + "🎉 All tests passed!" : RED + "❌ Some tests failed."}${RESET}\n`);
}

runTests(axTests, "ax");
runTests(avTests, "av");
