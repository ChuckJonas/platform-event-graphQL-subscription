import { Streaming, setDefaultConfig, PlatformEvent } from 'ts-force'
import { AuthInfo, Connection } from '@salesforce/core';

require('cometd-nodejs-client').adapt();
require('dotenv').config();

const queue: object[] = [];

(async () => {
  const authInfo: AuthInfo = await AuthInfo.create({ username: process.env.DX_USER });
  const connection = await Connection.create({ authInfo });

  setDefaultConfig({
      accessToken: connection.accessToken,
      instanceUrl:  connection.instanceUrl,
  });

  let stream = new Streaming();
  await stream.connect();
  await stream.subscribeToEvent(
    'User__e',                 // name of event
    handlePlatformEvent           // onEventHandler
  );
})()
  .then()
  .catch((e) => {
    console.log(e);
  });

function handlePlatformEvent(e: PlatformEvent<any>) {
  console.log(e.channel);
  console.log(e.data);
  queue.push(e.data as object)
}

//THIS IS A TERRIBLE FUNCTION, BUT WORKS
export default async function* eventGenerator(){
  while(true){
    if(queue.length){
      yield JSON.stringify(queue.shift())
    }else{
      await sleep(100)
    }
  }
}

const sleep = (ms:number) => new Promise(resolve => setTimeout(resolve, ms));
