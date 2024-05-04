import * as fs from 'fs';

// Genera el array de objetos con información asociada a cada uno de los caracteres de la secuencia

interface sequenceCaracter {
   character: string;
   asciiCode: number;
   rowNumber: number;
   rowIndex: number;
   characterNumber: number;
}

const sequenceArray: sequenceCaracter[] = [];

export function characterArrayGenerator(file: string = "rest-of-nucleic-sequence.txt"): sequenceCaracter[] {
   const fileText = fs.readFileSync(file, 'utf-8');
   
   let currentRowNumber = 1;
   let currentRowIndex = 0;

   for (let i = 0; i < fileText.length; i++) {
      
      currentRowIndex ++;

      const character = fileText[i];
      const asciiCode = character.charCodeAt(0);
      
      // console.log(`Caracter: ${fileText[i]}, ascii: ${fileText[i].charCodeAt(0)}, row: ${currentRowNumber}, index: ${currentRowIndex}`);

      // Es un salto de línea
      if (asciiCode === 10) {
         currentRowNumber++;
         currentRowIndex = -1;
      }

      // Creamos el array sin saltos de línea
      if (asciiCode !== 10 && asciiCode !== 13) {
         if (character === "G" || character === "C" || character === "T" || character === "A") {
            sequenceArray.push({ 
               character, 
               asciiCode, 
               rowNumber: currentRowNumber, 
               rowIndex: currentRowIndex, 
               characterNumber: i,
            });
         }
      }

   }

   return sequenceArray;

}
