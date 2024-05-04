import * as fs from 'fs';
import { generateTargetObjects } from './targetObjectGenerator';
import { characterArrayGenerator } from './characterArrayGenerator';
import { lpsGenerator } from './lpsGenerator';
import { kmp } from './sequenceSearcher';
import { searchNGGRule } from './results/nggRule';


interface TargetData {
   target: string; // El target en si
   targetNumber: number; // Número del target respecto a los totales analizados.
   targetStatus: string, // Indica si se encontró (Checked) o si no se encotró en la secuencia analizada (NotFound)
   targetLocation: object, // Información sobre la ubicación relativa al archivo en donde se encontró  
   nggRule: boolean; // Cumple o no con la condición NGG 
}

interface SequenceCaracter {
   character: string;
   asciiCode: number;
   rowNumber: number;
   rowIndex: number;
   characterNumber: number;
}


function sequenceSearcher(file: string): void {
   
   const arrayOfCharacters: SequenceCaracter[] = characterArrayGenerator(file);
   const arrayOfTargets: TargetData[] = generateTargetObjects();
   const validTargets: TargetData[] = [];

   
   arrayOfTargets.forEach(sequence => {
      // console.log(lpsGenerator(sequence.target));

      const sequenceCharacterIndex = kmp(arrayOfCharacters, sequence, Date.now().toString());

      // console.log({ number: arrayOfCharacters[sequenceCharacterIndex] });
      
      if (sequenceCharacterIndex > -1) {
         
         const validSequence = {
            target: sequence.target,
            targetNumber: sequence.targetNumber,
            targetStatus: 'Ok',
            targetLocation: arrayOfCharacters[sequenceCharacterIndex],
            nggRule: false,
            
         }
         
         validSequence.nggRule = searchNGGRule(arrayOfCharacters, validSequence);
         
         validTargets.push(validSequence);

      }


   });
 

   // Cuando se termina de procesar la info se genera el archivo de resultados
   const outputFilePath = 'resultados-ngg.txt';
   fs.writeFileSync(outputFilePath, JSON.stringify(validTargets, null, 2));
   console.log(`Los resultados se han guardado en ${outputFilePath}`);

}


const file = 'test-of-nucleic-sequence.txt'; // Nombre del archivo 

sequenceSearcher(file);
