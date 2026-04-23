// src/cli/router.ts
import { COMMANDS } from "./commands";

export async function handleCliCommands(): Promise<boolean> {
  const args = process.argv.slice(2);
  
  // Se não houver argumentos, segue o fluxo normal
  if (args.length === 0) return false;

  for (const cmd of COMMANDS) {
    // Verifica se algum argumento bate com as flags do comando
    const match = args.find(arg => cmd.flags.includes(arg));
    
    if (match) {
      await cmd.action();
      
      // Se o comando for do tipo "informa e sai" (help, version), ele encerra o processo
      if (cmd.exitAfterExecution) {
        process.exit(0);
      }
      
      return true; // Comando executado, mas o script pode continuar
    }
  }

  return false; // Nenhum comando de interrupção foi acionado
}