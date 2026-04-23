

// Define o que é um "comando" de flag
export interface CliCommand {
  flags: string[];        // Ex: ['-s', '--setup']
  description: string;    // Para o --help automático
  action: () => Promise<void> | void;
  exitAfterExecution: boolean; // Define se o script para aqui ou continua
}