stream.on('data', (chunk) => {
   for (const target of targets) { // Recorremos cada uno de los objetivos
       for (let i = 0; i <= chunk.length - target.targetLength; i++) { // Recorremos la secuencia de caracteres
           const substring = chunk.toString('utf-8', i, i + target.targetLength); // Extraemos la subcadena de la secuencia
           if (substring === target.value) { // Comparamos la subcadena con el objetivo
               // Si encontramos una coincidencia, actualizamos el estado del objetivo
               target.targetStatus = "Found";
               target.rowNumber = currentRowNumber;
               target.rowIndex = i;
               console.log(`Target ${target.targetNumber} found at row ${currentRowNumber}, index ${i}`);
           }
       }
   }

   for (const caracter of chunk) {
       if (caracter === '\n') {
           currentRowNumber++;
           currentRowIndex = 0;
       }

       if (typeof caracter === 'string') {
           const ASCII = caracter.charCodeAt(0);
           // console.log(`Caracter: ${caracter}, código: ${ASCII}`);

           if (validCharacters.includes(caracter)) {
               // Si el caracter es igual a alguno de los nucleótidos (GCTA), entonces vamos a comenzar a comparar el caracter con cada uno de los targets.
               console.log(`caracter: ${caracter}, currentRowNumber: ${currentRowNumber}, currentRowIndex: ${currentRowIndex}`);
           }

           // Si el caracter es diferente a los nucleótidos (Guanina, citosina, timina y adenina), entonces no considerarla en la comparación.
       }

       currentRowIndex++;
   }
})
