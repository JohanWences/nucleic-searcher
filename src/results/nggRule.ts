import * as fs from 'fs';

interface SequenceCaracter {
   character: string;
   asciiCode: number;
   rowNumber: number;
   rowIndex: number;
   characterNumber: number;
}

interface TargetLocation {
   character: string,
   asciiCode: number,
   rowNumber: number,
   rowIndex: number,
   characterNumber: number
}

interface TargetData {
   target: string; // El target en si
   targetNumber: number; // Número del target respecto a los totales analizados.
   targetStatus: string, // Indica si se encontró (Checked) o si no se encotró en la secuencia analizada (NotFound)
   targetLocation: TargetLocation, // Información sobre la ubicación relativa al archivo en donde se encontró  
   nggRule: boolean; // Cumple o no con la condición NGG 
}

export function searchNGGRule(sequenceCaracterArray: SequenceCaracter[], target: TargetData): boolean {
   
   // console.log('sequenceCaracterArray: ', sequenceCaracterArray);
   // console.log('target: ', target.targetLocation);

   const { characterNumber } = target.targetLocation;

   const targetIndex = sequenceCaracterArray.findIndex(sequenceCharacter => 
      sequenceCharacter.characterNumber=== characterNumber
   )

   // console.log(targetIndex);

   // console.log('Objeto que hace match en el array respecto al índice: ', sequenceCaracterArray[targetIndex]);
   // console.log('Último caracter de la secencia: ', sequenceCaracterArray[(targetIndex + target.target.length)-1]);

   const G1 = sequenceCaracterArray[(targetIndex + target.target.length) + 1];
   const G2 = sequenceCaracterArray[(targetIndex + target.target.length) + 2];

   console.log('G1', G1);
   console.log('G2', G2);

   if (G1.character === 'G' && G2.character === 'G') {
      return true;
   } else {
      return false;
   }

}