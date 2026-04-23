export interface CliArgs {
  setup: boolean;
  version: boolean;
  help: boolean;
  once: boolean;
  reset: boolean;
}

export function parseArgs(): CliArgs {
  const args = process.argv.slice(2);

  return {
    setup: args.includes("--setup") || args.includes("-s"),
    version: args.includes("--version") || args.includes("-v"),
    help: args.includes("--help") || args.includes("-h"),
    once: args.includes("--once") || args.includes("-o"),
    reset: args.includes("--reset") || args.includes("-r"),
  };
}
