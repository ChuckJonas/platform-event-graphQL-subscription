async function* test(){
 while(true){
   yield new Date().getTime();
   await sleep(980);
 }
}

for await (const t of test){
    console.log(t)
}