const { Web3 } = require('web3');
const abi = require('./ETHOxford/abi.json');

const provider = new Web3('https://flare.solidifi.app/ext/C/rpc');

async function getRandom() {
    const ftsoRegistryContract = new provider.eth.Contract(abi, "0x1000000000000000000000000000000000000003");

    let random = await ftsoRegistryContract.methods.getCurrentRandom().call();
    const random_0_to_1 =  Number(random.toString().substring(1,3)) / 99;
    const random_0_to_37 = Math.floor(random_0_to_1 * 38);
    console.log(random_0_to_37);
}

getRandom();