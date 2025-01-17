const passwordDisplay = document.querySelector("[passwordShow]");
const copyPassword = document.querySelector("[copyPass]");
const lengthDisplay = document.querySelector("[passwordLen]");
const lengthSlider =  document.querySelector(".slider"); 
const upper = document.querySelector("[UPP]");
const lower = document.querySelector("[DOWN]");
const number = document.querySelector("[NUM]");
const symbolsCheck = document.querySelector("[SYM]");
const alert = document.querySelector(".alert");
const generate = document.querySelector(".generatePassword");
const allCheck = document.querySelectorAll("input[type='checkbox']");
const copied = document.querySelector("[cop]");
const symbols = "!@#$%^&*()_+{:><;";

let password ="";
let passwordLength = 10;
let checkCount =0;
handelSlider();


function handelSlider(){
    lengthSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;

}

function setIndicator(color){
    alert.style.backgroundColor= color;
    alert.style.boxShadow = `0px 0px 15px ${color}`;
}


function getRandomInteger(min,max){
      return  Math.floor(Math.random()*(max-min)) +min;
}

function gerenateRandomNumber(){
    return getRandomInteger(0,9);
}

function generateLowerCase(){
    return String.fromCharCode(getRandomInteger(97,123));
}

function generateLargerCase(){
    return String.fromCharCode(getRandomInteger(65,91));
}

function generateSymbol(){
    const randNum = getRandomInteger(0,symbols.length);
    return symbols.charAt(randNum);
}


function sufflePas(array){
    //fisher yates method

    for(let i = array.length-1; i>0;i--){
        const j = Math.floor(Math.random()*(i+1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    let str ="";
    array.forEach((e) => (str +=e));
    return str;
}

function setStrength(){
    let Upper = false;
    let Lower = false;
    let Number = false;
    let Symbol = false;

    if(upper.checked) Upper = true;
    if(lower.checked) Lower = true;
    if(number.checked) Number = true;
    if(symbolsCheck.checked) Symbol = true;


    if(Upper && Lower && (Number || Symbol) && passwordLength >=8){
        setIndicator ("#0f0");
    }else if((Lower || Upper) && (Number || Symbol) && passwordLength >=6){
        setIndicator ("#ff0");
    }else{
        setIndicator("#f00");
    }
};


async function copyContent(){
    try{
      await  navigator.clipboard.writeText(passwordDisplay.value);
      copied.innerText="Copied";
    }
    catch(e){
        copied.innerText="Failed Copy"
    }
    
    copied.classList.add("active");
    setTimeout(()=>{
        copied.classList.remove("active");
    },1000);
}


lengthSlider.addEventListener('input',(e)=>{
        passwordLength= e.target.value;
        handelSlider();
})

copyPassword.addEventListener('click',()=>{
    if(passwordDisplay.value){
        copyContent();
    }
})

function handleCheckbox(){
    checkCount=0;
    allCheck.forEach((key)=>{
        if(key.checked){
            checkCount++;
        }
    })

    if(passwordLength <checkCount){
        passwordLength=checkCount;
        handelSlider(); 
    }
}


allCheck.forEach((key)=>{
key.addEventListener('change',handleCheckbox);
})

generate.addEventListener('click',()=>{
    //non selected
    if(checkCount ==0) 
    return;

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handelSlider();
    }

        // remove old password

        password = "";

   

        let funArr = [];
    

        if(upper.checked){
            funArr.push(generateLargerCase);
        }

        if(lower.checked){
            funArr.push(generateLowerCase);
        }
        if(number.checked){
            funArr.push(gerenateRandomNumber);
        }
        if(symbolsCheck.checked){
            funArr.push(generateSymbol);
        }

        

        // compulsory addition 

        for(let i =0;i<funArr.length;i++){
            password +=funArr[i]();
        }

        //remaining function 

        for(let i =0;i<passwordLength-funArr.length;i++){
            let randInd = getRandomInteger(0,funArr.length);
            password += funArr[randInd]();
        }

        //suffle 

        password = sufflePas(Array.from(password));

        //show in UI

        passwordDisplay.value =password;

        //cal strength

        setStrength();
    
})