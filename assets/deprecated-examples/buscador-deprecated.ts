import * as fs from 'fs';
import { targets } from '../../src/data';
import { generateTargetObjects } from '../../src/targetObjects';
import { channel } from 'diagnostics_channel';


function buscarSubcadenaEnArchivo(archivo: string): void {

   interface TargetData {
      targetLength: number, // Cantidad de caracteres existentes en el target
      statusCounter: number, // Forma de saber si se encuentra en la secuencia, el contador va aumentando cada vez que encuentra un match continuo en la secuencia analizada
      targetStatus: string, // Check - Not found : check = se encuentra dentro de la secuencia / Not found = No se encuentra dentro de la secuencia
      targetNumber: number; // Posición del target respecto al ídice del array donde se encuentra
      value: string; // El target en si
      rowNumber: number; // Número del renglón donde se encotró el target
      nggRule: boolean; // Cumple o no con la condición NGG 
      rowIndex: number;
  }

   const stream = fs.createReadStream(archivo, 'utf-8');
   const validCharacters: string[] = ['G', 'C', 'T', 'A'];
   const targetInfo: TargetData[] = generateTargetObjects(targets);

   let currentRowNumber = 0;
   let currentRowIndex = 0;

   // Leyendo caracter por caracter
   stream.on('data', (chunk) => {
      for (const caracter of chunk) {

         if (caracter === '\n') {
            currentRowNumber++;
            currentRowIndex = 0;
         }

         if ( typeof caracter === 'string') {
            const ASCII = caracter.charCodeAt(0);
            // console.log(`Caracter: ${caracter}, código: ${ASCII}`);

            if (validCharacters.includes(caracter)) {
               // Si el caracter es igual a alguno de los nucleótidos (GCTA), entonces vamos a comenzar a comparar el caracter con cada uno de los targets.
               

               for (const t of targetInfo) {

                  if (caracter === t.value[t.statusCounter + 1]) {
                     t.statusCounter += 1;
                  } else {
                     t.statusCounter = 0;
                  }

                  if (t.statusCounter + 1 === t.targetLength) {
                     
                     t.targetStatus = 'Check';
                     // Estado inicial para escribir los valores
                     if (t.rowNumber === 0) {
                        t.rowIndex = currentRowIndex - t.targetLength;
                        t.rowNumber = currentRowNumber + 1;
                     }

                  }

               }

            }

            // Si el caracter es diferente a los nucleótidos (Guanina, citosina, timina y adenina), entonces no considerarla en la comparación.

         }

         currentRowIndex ++;

      }

   })

   // console.log(targetInfo);

   // Cuando hayas terminado de procesar el archivo
   stream.on('end', () => {
      // Escribe targetInfo en un nuevo archivo
      const outputFilePath = 'prueba-de-resultados.txt';
      fs.writeFile(outputFilePath, JSON.stringify(targetInfo, null, 2), (err) => {
         if (err) {
            console.error('Error al escribir en el archivo:', err);
         } else {
            console.log(`Los resultados se han guardado en ${outputFilePath}`);
         }
      });
   });
   
}

// Ejemplo de uso
const archivo = 'test.txt'; // Nombre del archivo de texto

buscarSubcadenaEnArchivo(archivo);

