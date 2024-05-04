


import * as fs from 'fs';
import { targets } from './data';
import { generateTargetObjects } from '../targetObjects';


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

function objetosIguales(obj1: TargetData, obj2: TargetData) {
   return obj1.targetLength === obj2.targetLength &&
         obj1.currentIndex === obj2.currentIndex &&
         obj1.targetStatus === obj2.targetStatus &&
         obj1.targetNumber === obj2.targetNumber &&
         obj1.value === obj2.value &&
         obj1.rowNumber === obj2.rowNumber &&
         obj1.nggRule === obj2.nggRule &&
         obj1.rowIndex === obj2.rowIndex;
}

function buscarSubcadenaEnArchivo(archivo: string): void {

   const inicio = new Date();

   

  

   const stream = fs.createReadStream(archivo, 'utf-8');
   const validCharacters: string[] = ['G', 'C', 'T', 'A'];
   const targetInfo: TargetData[] = generateTargetObjects(targets);
   const okTargets: TargetData[] = [];
   
   let currentTarget = 1;
   let currentRowNumber = 1;
   let currentRowIndex = 0;

   const fin = new Date();
   const tiempoEjecucionMs = fin.getTime() - inicio.getTime();
   const minutos = Math.floor(tiempoEjecucionMs / 60000); // 1 minuto = 60000 milisegundos
   const segundos = ((tiempoEjecucionMs % 60000) / 1000).toFixed(3); // Los segundos con tres decimales

   // Leyendo caracter por caracter
   

   targetInfo.forEach(target => {
      
      try {
         
         const contenidoArchivo = fs.readFileSync(archivo, 'utf-8');
         
         for (const caracter of contenidoArchivo) {
            
            if (caracter === '\n' || currentRowNumber === 1) {
               console.log('Row: ', currentRowNumber, 'Target: ', currentTarget);
               currentRowNumber++;
               currentRowIndex = 0;
            }
    
            if (typeof caracter === 'string' && validCharacters.includes(caracter)) {
               targetInfo.forEach(target => {
                  
                  if (caracter === target.value[target.currentIndex + 1]) {
                     target.currentIndex++;
                  } else {
                     target.currentIndex = 0;
                  }
                  if (target.targetLength - 1 === target.currentIndex) {
                     target.rowNumber = currentRowNumber - 1;
                     target.rowIndex = currentRowIndex - target.targetLength;
                     target.targetStatus = 'Check';
                     okTargets.push({ ...target });
                  }
               });
            }
    
            currentRowIndex++;
         }

      } catch (error) {
         console.log('error al ejecutar el archivo');
      }
      
      currentRowNumber = 1;
      currentRowIndex = 0;
      currentTarget ++;
         
         
   });

   
   // Filtra los elementos únicos del array
   var arraySinDuplicados = okTargets.filter((item, index, self) => 
      index === self.findIndex((t) => (
         objetosIguales(t, item)
      ))
   );
      

   console.log(`Tiempo de ejecución: minutos: ${minutos}, segundos: ${segundos}`);

   // Cuando se termina de procesar la info se genera el archivo de resultados
   const outputFilePath = 'resultados.txt';
   fs.writeFileSync(outputFilePath, JSON.stringify(arraySinDuplicados, null, 2));
   console.log(`Los resultados se han guardado en ${outputFilePath}`);
   
}

// Ejemplo de uso
const archivo = 'genome-test.txt'; // Nombre del archivo de texto

buscarSubcadenaEnArchivo(archivo);

