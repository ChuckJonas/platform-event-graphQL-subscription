
export default async function*(){
 while(true){
   yield new Date().getTime();
   await sleep(980)
 }
}

  
const sleep = (ms:number) => new Promise(resolve => setTimeout(resolve, ms));