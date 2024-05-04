import * as fs from 'fs';
import { targets } from '../../src/data';
import { generateTargetObjects } from '../../src/targetObjects';


function buscarSubcadenaEnArchivo(archivo: string): void {

   const inicio = new Date();

   interface TargetData {
      targetLength: number, // Cantidad de caracteres existentes en el target
      currentIndex: number, // Forma de saber si se encuentra en la secuencia, el contador va aumentando cada vez que encuentra un match continuo en la secuencia analizada
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
   const okTargets: TargetData[] = [];

   let currentRowNumber = 1;
   let currentRowIndex = 0;

   // Leyendo caracter por caracter
   

      targetInfo.forEach(target => {

         console.log('reiniciar');

         stream.on('data', (chunk) => {
         
            for (const caracter of chunk) {

               if (caracter === '\n') {
                  currentRowNumber++;
                  currentRowIndex = 0;
                  console.log('currentRowNumber: ', currentRowNumber);
               }
      
               if ( typeof caracter === 'string') {
      
                  if (validCharacters.includes(caracter)) {
                     
                     target.rowIndex = currentRowIndex;
                     target.rowNumber = currentRowNumber;

                     // console.log(`${caracter}, ${target.value[target.currentIndex]}, ${target.currentIndex}, ${target.rowNumber}, ${target.rowIndex} `);

                     if (caracter === target.value[target.currentIndex + 1]) {
                        target.currentIndex++;
                     } else {
                        target.currentIndex = 0;
                     }

                     if (target.targetLength - 1 === target.currentIndex) {
                        target.rowIndex = currentRowIndex - target.targetLength;  
                        target.targetStatus = 'Check';
                        okTargets.push({ ...target })
                     }

                  }
      
                  // Si el caracter es diferente a los nucleótidos (Guanina, citosina, timina y adenina), entonces no considerarla en la comparación.
      
               }
      
               currentRowIndex ++;
      
            }
         })

         currentRowNumber = 1;
         currentRowIndex = 0;
         
      });

      
      const fin = new Date();
      const tiempoEjecucionMs = fin.getTime() - inicio.getTime();
      const minutos = Math.floor(tiempoEjecucionMs / 60000); // 1 minuto = 60000 milisegundos
      const segundos = ((tiempoEjecucionMs % 60000) / 1000).toFixed(3); // Los segundos con tres decimales

   


   // Cuando se termina de procesar la info se genera el archivo de resultados
   stream.on('end', () => {
      // Escribe targetInfo en un nuevo archivo
      const outputFilePath = 'resultados.txt';
      fs.writeFile(outputFilePath, JSON.stringify(okTargets, null, 2), (err) => {
         if (err) {
            console.error('Error al escribir en el archivo:', err);
         } else {
            console.log(`Los resultados se han guardado en ${outputFilePath}`);
         }
      });
   });
   
}

// Ejemplo de uso
const archivo = 'genome-test.txt'; // Nombre del archivo de texto

buscarSubcadenaEnArchivo(archivo);

