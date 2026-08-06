const BASE_URL = "https://api.exchangerate-api.com/v4/latest";

// Dono select elements
const fromSelect = document.getElementById("from");
const toSelect = document.getElementById("to");
const amountInput = document.getElementById("amount");
const msg = document.getElementById("msg");
const button = document.querySelector("button");
const fromFlag = document.getElementById("fromFlag");
const toFlag = document.getElementById("toFlag");

// Populate dono selects
for (let currCode in countryList) {
    let option1 = document.createElement("option");
    option1.innerText = currCode;
    option1.value = currCode;
    fromSelect.append(option1);

    let option2 = document.createElement("option");
    option2.innerText = currCode;
    option2.value = currCode;
    toSelect.append(option2);
}

// Default values set karo
fromSelect.value = "USD";
toSelect.value = "INR";

// Flag update karo jab select change ho
fromSelect.addEventListener("change", () => {
    let code = fromSelect.value;
    let countryCode = countryList[code];
    fromFlag.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
});

toSelect.addEventListener("change", () => {
    let code = toSelect.value;
    let countryCode = countryList[code];
    toFlag.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
});

// Exchange rate get karo
button.addEventListener("click", async () => {
    let amount = amountInput.value;
    let fromCurrency = fromSelect.value;
    let toCurrency = toSelect.value;

    try {
        let response = await fetch(`${BASE_URL}/${fromCurrency}`);
        let data = await response.json();
        let rate = data.rates[toCurrency];
        let convertedAmount = (amount * rate).toFixed(2);
        
        msg.innerText = `${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}`;
    } catch (error) {
        msg.innerText = "Error fetching exchange rate";
        console.error(error);
    }
});