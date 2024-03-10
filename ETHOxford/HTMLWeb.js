const web3 = new Web3();
import abi from './abi.json' assert { type: "json" };

const provider = new Web3('https://flare.solidifi.app/ext/C/rpc');

window.addEventListener('load', (event) => {

    if (window.ethereum) {
        console.log("Reached Here :)");
    }
    
    else {
        // Metamask is not installed
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
    38: 'Green', 27: 'Red', 10: 'Black', 25: 'Red', 29: 'Black', 12: 'Red',
    8: 'Black', 19: 'Red', 31: 'Black', 18: 'Red', 6: 'Black', 21: 30,
    33: 'Black', 16: 32, 4: 'Black', 23: 'Red', 35: 'Black',
    14: 'red', 2: 'Black', 0: 'Green', 
};

async function getRandomFTSO() {
    const ftsoRegistryContract = new provider.eth.Contract(abi, "0x1000000000000000000000000000000000000003");

    let random = await ftsoRegistryContract.methods.getCurrentRandom().call();
    var random_0_to_1 =  Number(random.toString().substring(1,3)) / 99;
    var random_0_to_37 = Math.floor(random_0_to_1 * 38);
    console.log(random_0_to_37);

    return random_0_to_37;
}

function generateRandomNumber(min, max) {
    var Answer = getRandomFTSO();
    console.log(Answer);
    var Rotations = (myDictionary[Answer] * 9.473684210) + 720;
    return [Answer, Rotations];
}

function rotateImage(degrees) {
    totalRotation += degrees;
    var image = document.getElementById("RotatingTable");
    image.style.transform = "rotate(" + totalRotation + "deg)";
  }

function SpinRoulette() {
    BlackButton.disabled = true;
    RedButton.disabled = true;

    var amountInput = document.getElementById("amountInput");
    amountInput.disabled = true;

    var [result, randomNumber] = generateRandomNumber(0, 37);

    if (randomNumber > currentPosition){
        DegreesToBeRotated = randomNumber + (360- currentPosition);
    }

    var currentBalance = document.getElementById("Balance");
    newBalance = parseInt(currentBalance.innerHTML);

    var amountInput = document.getElementById("amountInput");
    addedAmount = parseInt(amountInput.value);




    for (var i = 0; i < DegreesToBeRotated; i++) {
        (function(index){
        setTimeout(function() {
            rotateImage(-1); 
                    
            if ((index+1) > DegreesToBeRotated){
                document.getElementById('output').innerHTML = result;
                document.getElementById('output').style.color = colourDictionary[Answer];
                currentPosition = randomNumber % 360;
                BlackButton.disabled = false;
                RedButton.disabled = false;

                var colourOutput = document.getElementById("ColourOutput").innerHTML;
                console.log(colourOutput);
                console.log(colourDictionary[Answer]);

                if (colourOutput == colourDictionary[Answer]){
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
    const currentDate = new Date();
    const currentSeconds = currentDate.getSeconds();
    var whatSecond = 50;
    var timeleft = 0;

    if (currentSeconds > whatSecond){
        timeleft = 60 - currentSeconds + whatSecond;
        console.log(timeleft);
    }

    else if (currentSeconds < whatSecond){
        timeleft = whatSecond - currentSeconds;
        console.log(timeleft);
    }

    else {
        console.log('ROULETTE')
        SpinRoulette();
    }
    
    document.getElementById('countdown').innerHTML = `Countdown: ${timeleft}s`;


}, 1000);

