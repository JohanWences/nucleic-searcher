import { lpsGenerator } from "./lpsGenerator";

interface SequenceCaracter {
   character: string;
   asciiCode: number;
   rowNumber: number;
   rowIndex: number;
   characterNumber: number;
}

interface TargetData {
   target: string; // El target en si
   targetNumber: number; // Número del target respecto a los totales analizados.
   targetStatus: string, // Indica si se encontró (Checked) o si no se encotró en la secuencia analizada (NotFound)
   targetLocation: object, // Información sobre la ubicación relativa al archivo en donde se encontró  
   nggRule: boolean; // Cumple o no con la condición NGG 
}

export function kmp(sequence: SequenceCaracter[], targetData: TargetData, time: string) {

   
   const n: number = sequence.length;
   const m: number = targetData.target.length;
   
   if (m > n) {
      return -1
   }
   
   const lps: number[] = lpsGenerator(targetData.target);
   let i: number = 0;
   let j: number = 0;
   
   const timestamp = parseInt(time, 10); // Convierte a número entero
   const date = new Date(timestamp); // Crea un objeto Date
   
   const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;

   console.log(`Target ${targetData.targetNumber}: ${targetData.target} | Time: ${formattedDate}`);
   
   while (i < n && j < m) {
      if (sequence[i].character === targetData.target[j]) {
         i++;
         j++;
      } else if (j > 0) {
         j = lps[j-1]
      } else {
         i++;
      }
   }

   return (j < m) ? -1 : i-m;

}