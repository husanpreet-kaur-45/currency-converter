const API_URL = "https://open.er-api.com/v6/latest";

const fromSelect = document.querySelector("#from");
const toSelect = document.querySelector("#to");
const amountInput = document.querySelector("#amount");
const message = document.querySelector("#msg");
const button = document.querySelector("form button");

for (const currencyCode in countryList) {
  const fromOption = document.createElement("option");
  fromOption.value = currencyCode;
  fromOption.textContent = currencyCode;
  fromSelect.appendChild(fromOption);

  const toOption = document.createElement("option");
  toOption.value = currencyCode;
  toOption.textContent = currencyCode;
  toSelect.appendChild(toOption);
}

fromSelect.value = "USD";
toSelect.value = "INR";
updateFlag(fromSelect);
updateFlag(toSelect);

fromSelect.addEventListener("change", () => updateFlag(fromSelect));
toSelect.addEventListener("change", () => updateFlag(toSelect));

function updateFlag(select) {
  const countryCode = countryList[select.value];
  const flag = select.parentElement.querySelector("img");
  flag.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
  flag.alt = `${select.value} flag`;
}

button.addEventListener("click", async (event) => {
  event.preventDefault();

  const amount = Number(amountInput.value);
  const fromCurrency = fromSelect.value;
  const toCurrency = toSelect.value;

  if (!Number.isFinite(amount) || amount < 0) {
    message.textContent = "Please enter a valid amount.";
    return;
  }

  if (fromCurrency === toCurrency) {
    message.textContent = `${amount} ${fromCurrency} = ${amount.toFixed(2)} ${toCurrency}`;
    return;
  }

  message.textContent = "Loading exchange rate...";
  button.disabled = true;

  try {
    const response = await fetch(`${API_URL}/${fromCurrency}`);
    if (!response.ok) throw new Error("Exchange rate request failed");

    const data = await response.json();
    if (data.result !== "success" || typeof data.rates?.[toCurrency] !== "number") {
      throw new Error("Rate was not returned");
    }

    const convertedAmount = (amount * data.rates[toCurrency]).toFixed(2);
    message.textContent = `${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}`;
  } catch (error) {
    console.error("Currency conversion error:", error);
    message.textContent = "Exchange rate load nahi ho paaya. Please try again.";
  } finally {
    button.disabled = false;
  }
});
