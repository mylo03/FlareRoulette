const provider_flare = new Web3('https://flare.solidifi.app/ext/C/rpc');
import abi_random from './abi_random.json' assert { type: "json" };
const ftsoRegistryContract = new provider_flare.eth.Contract(abi_random, "0x1000000000000000000000000000000000000003");

const provider_coston2 = new Web3('https://coston2-api.flare.network/ext/bc/C/rpc');
import abi_roulette from './abi_roulette.json' assert { type: "json" };
const rouletteContract = new provider_coston2.eth.Contract(abi_roulette, "0x2cae652E9244Ce97C7096b1C74faa82125f9c842");
const wallet_house = provider_coston2.eth.wallet.add('0x202d13d92ff71ad1857ee96daf0a8d382250edfd7d9b82104d1ea8e050627520');

window.addEventListener('load', (event) => {

    if (window.ethereum) {
        console.log("Reached Here :)");
        const web3 = new Web3(window.ethereum);
        try {
            await window.ethereum.enable();
            return web3

        } catch(error) {
            console.error('Error:', error);
            throw error
        }
    } else {
        console.error("Metamask is not installed");
    }
});






var totalRotation = 0;
var currentPosition = 0;

var myDictionary = {
    28: 1, 9: 2, 26: 3, 30: 4, 11: 5, 7: 6, 
    20: 7, 32: 8, 17: 9, 5: 10, 22: 11, 34: 12, 
    15: 13, 3: 14, 24: 15, 36: 16, 13: 17, 1: 18, 
    37: 19, 27: 20, 10: 21, 25: 22, 29: 23, 12: 24,
    8: 25, 19: 26, 31: 27, 18: 28, 6: 29, 21: 30,
    33: 31, 16: 32, 4: 33, 23: 34, 35: 35,
    14: 36, 2: 37, 0: 38, 
};

var colourDictionary = {
    28: 'Black', 9: 'Red', 26: 'Black', 30: 'Red', 11: 'Black', 7: 'Red', 
    20: 'Black', 32: 'Red', 17: 'Black', 5: 'Red', 22: 'Black', 34: 'Red', 
    15: 'Black', 3: 'Red', 24: 'Black', 36: 'Red', 13: 'Black', 1: 'Red', 
    37: 'Green', 27: 'Red', 10: 'Black', 25: 'Red', 29: 'Black', 12: 'Red',
    8: 'Black', 19: 'Red', 31: 'Black', 18: 'Red', 6: 'Black', 21: 30,
    33: 'Black', 16: 32, 4: 'Black', 23: 'Red', 35: 'Black',
    14: 'red', 2: 'Black', 0: 'Green', 
};


async function getRandomFTSO() {
    let random = await ftsoRegistryContract.methods.getCurrentRandom().call();
    var random_0_to_1 =  Number(random.toString().substring(1,3)) / 99;
    var random_0_to_37 = Math.floor(random_0_to_1 * 38);

    console.log(random_0_to_37);

    return random_0_to_37;
}

async function generateRandomNumber(min, max) {
    var Answer = await getRandomFTSO();
    // var Answer = (async () => {
    //     console.log(getRandomFTSO());
    //   })();
    console.log(Answer);
    var Rotations = (myDictionary[Answer] * 9.473684210) + 720;
    return [Answer, Rotations];
}

function rotateImage(degrees) {
    totalRotation += degrees;
    var image = document.getElementById("RotatingTable");
    image.style.transform = "rotate(" + totalRotation + "deg)";
  }

async function SpinRoulette() {
    BlackButton.disabled = true;
    RedButton.disabled = true;

    var amountInput = document.getElementById("amountInput");
    amountInput.disabled = true;

    var DegreesToBeRotated = 0;

    var [result, randomNumber] = await generateRandomNumber(0, 37);

    if (randomNumber > currentPosition){
        DegreesToBeRotated = randomNumber + (360- currentPosition);
    }

    console.log(colourDictionary[result]);

    var result = colourDictionary[result] == "Red" ? 0 : (colourDictionary[result] == "Black" ? 1 : 2);

    console.log(result);

    await rouletteContract.methods.set_outcome(result).send({
        from: wallet_house[0].address
    });

    var currentBalance = document.getElementById("Balance");
    var newBalance = parseInt(currentBalance.innerHTML);

    var amountInput = document.getElementById("amountInput");
    var addedAmount = parseInt(amountInput.value);

    for (var i = 0; i < DegreesToBeRotated; i++) {
        (function(index){
        setTimeout(function() {
            rotateImage(-1); 
                    
            if ((index+1) > DegreesToBeRotated){
                document.getElementById('output').innerHTML = result;
                document.getElementById('output').style.color = colourDictionary[result];
                currentPosition = randomNumber % 360;
                BlackButton.disabled = false;
                RedButton.disabled = false;

                var colourOutput = document.getElementById("ColourOutput").innerHTML;
                console.log(colourOutput);
                console.log(colourDictionary[result]);

                if (colourOutput == colourDictionary[result]){
                    WinOrLoss.textContent = 'Win';
                    newBalance = newBalance + (2*addedAmount);
                    amountInput.value = ""
                    currentBalance.innerHTML = newBalance;
                    amountInput.disabled = false;
                }

                else {
                    WinOrLoss.textContent = 'Loss';
                    amountInput.value = ""
                    amountInput.disabled = false;
                }

            }

            else {
                document.getElementById('output').innerHTML = 'Generating...';
                document.getElementById('output').style.color = 'purple';
            }

        }, index * 80 * 0.1 * (i / DegreesToBeRotated));
        })(i);
    }
    
}





function handleButtonClick(buttonId) {
    var colourOutput = document.getElementById("ColourOutput");

    if (buttonId === 'RedButton') {
        colourOutput.textContent = 'Red';
        colourOutput.style.color = 'Red';

    } else if (buttonId === 'BlackButton') {
        colourOutput.textContent = 'Black';
        colourOutput.style.color = 'Black';
    }
}




const targetDate = new Date().getTime() + (1 * 10 * 1000); 

const countdown = setInterval(function() {
    const startDate = new Date('March 10, 2024 11:13:32');
    const currentDate = new Date();
    const timeElapsedInSeconds = Math.floor((currentDate - startDate) / 1000);
    const currentSeconds = timeElapsedInSeconds % 30;
    var timeleft = 0;
    
    if (currentSeconds != 0){
        timeleft = 30 - currentSeconds;
        //access the first account
        console.log(wallet_house[0].address);
    }

    else {
        console.log('ROULETTE')
        var timeleft = 0;
        SpinRoulette();
    }
    
    document.getElementById('countdown').innerHTML = `Countdown: ${timeleft}s`;


}, 1000);

