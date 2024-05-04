export function lpsGenerator(target: string): number[] {
   
   const lps: number[] = new Array(target.length).fill(0);
   let i = 1;
   let j = 0;

   while(i < target.length) {
      if (target[i] === target[j]) {
         j++;
         lps[i] = j;
         i++;
      } else if (j > 0) {
         j = lps[j-1];
      } else {
         lps[i] = 0;
         i++;
      }
   
   }

   return lps;
   
}

// def get_lps(s):
//    lps = [0]*len(s)
//    i = 1
//    j = 0
//    while i < len(s):
//       if s[i] == s[j]:
//          j+= 1
//          lps[i] = j
//          i += 1
//       elif j > 0:
//          j = lps[j-1]
//       else: 
//          lps[i] = 0
//          i += 1

//    return lps