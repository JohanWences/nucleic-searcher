import { sequences } from "./targets";
import { testTargetsSequences } from "./testTargets";

interface TargetData {
   target: string; // El target en si
   targetNumber: number; // Número del target respecto a los totales analizados.
   targetStatus: string, // Indica si se encontró (Checked) o si no se encotró en la secuencia analizada (NotFound)
   targetLocation: object, // Información sobre la ubicación relativa al archivo en donde se encontró  
   nggRule: boolean; // Cumple o no con la condición NGG
}

export function generateTargetObjects(): TargetData[] {
   const targetDataArray: TargetData[] = [];
   
   sequences.forEach((target, index) => {
      
      const targetData: TargetData = {
         target: target,
         targetNumber: index,
         targetStatus: 'Not found',
         targetLocation: {
            
         },
         nggRule: false,
      }
      
      targetDataArray.push(targetData);

   })

   return targetDataArray;
}