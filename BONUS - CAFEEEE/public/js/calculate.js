
async function loadData(category) {
    try {
        console.log(`Loading data for category ${category}...`);
        const response = await fetch(`all_json/${category}.json`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Error loading data for category ${category}:`, error);
        return [];
    }
}

async function updateDrinkOptions() {
    const categorySelect = document.getElementById('category');
    const drinkTypeSelect = document.getElementById('drinkType');
    const selectedCategory = categorySelect.value;

    drinkTypeSelect.innerHTML = '';

    const data = await loadData(selectedCategory);

    data.forEach(drink => {
        const option = document.createElement('option');
        
        // Choose the appropriate key based on the category
        let categoryKey = "";
        switch (selectedCategory) {
            case "bottledCoffee":
                categoryKey = "Coffee drinks (bottles and cans)"
                break;
            case "caffeinatedWater":
                categoryKey = "Caffeinated water and others beverages";
                break;
            case "energyDrink":
                categoryKey = "Energy drink";
                break;
            case "overTheCounterDrugs":
                categoryKey = "Over-the-counter drugs or supplements";
                break;
            case "caffeinatedSnack":
                categoryKey = "Caffeinated snack";
                break;
            case "chocolateIceCreamYogurt":
                categoryKey = "Chocolate, ice cream, or yogurt";
                break;
            case "groundCoffeeOrEspresso":
                categoryKey = "Coffee and espresso (ground)";
                break;
            case "softDrink":
                categoryKey = "Soft drink";
                break;
            case "starbucksOrDunkin":
                categoryKey = "Coffee and tea drinks (coffee shops)";
                break;
            case "tea":
                categoryKey = "Tea (bottles; tea bags)";
                break;
            default:
                break;
        }

        option.value = drink[categoryKey];
        option.textContent = drink[categoryKey];
        drinkTypeSelect.appendChild(option);
    });
}


// Function to calculate caffeine
// Function to calculate caffeine
function calculateCaffeine() {
    const categorySelect = document.getElementById('category');
    const drinkTypeSelect = document.getElementById('drinkType');
    const drinkSizeInput = document.getElementById('drinkSize');
    const resultDiv = document.getElementById('result');

    // Get the selected category, drink type, and drink size
    const selectedCategory = categorySelect.value;
    const selectedDrink = drinkTypeSelect.value;
    const drinkSize = parseFloat(drinkSizeInput.value);

    // Map the category keys to user-friendly names
    let categoryKey;
    switch (selectedCategory) {
        case "bottledCoffee":
            categoryKey = "Coffee drinks (bottles and cans)";
            break;
        case "caffeinatedWater":
            categoryKey = "Caffeinated water and others beverages";
            break;
        case "softDrink":
            categoryKey = "Soft drink";
            break;
        case "energyDrink":
            categoryKey = "Energy drink";
            break;
        case "starbucksOrDunkin":
            categoryKey = "Coffee and tea drinks (coffee shops)";
            break;
        case "caffeinatedSnack":
            categoryKey = "Caffeinated snack";
            break;
        case "chocolateIceCreamYogurt":
            categoryKey = "Chocolate, ice cream, or yogurt";
            break;
        case "groundCoffeeOrEspresso":
            categoryKey = "Coffee and espresso (ground)";
            break;
        case "overTheCounterDrugs":
            categoryKey = "Over-the-counter drugs or supplements";
            break;
        case "tea":
            categoryKey = "Tea (bottles; tea bags)";
            break;
        default:
            console.log("Unknown category:", selectedCategory);
            return;
    }

    // Load data for the selected category
    loadData(selectedCategory)
        .then(data => {
            // Find the selected drink in the data
            const selectedDrinkData = data.find(drink => drink[categoryKey] === selectedDrink);

            if (selectedDrinkData) {
                const caffeineDose = parseFloat(selectedDrinkData["Caffeine (mg)"]);

                const totalCaffeine = ((drinkSize* 0.033814) / 12) * caffeineDose;
                resultDiv.textContent = `Estimated Caffeine Dose: ${totalCaffeine.toFixed(2)} mg`;
            } else {
                resultDiv.textContent = "No Drinks Selected";
            }
        })
        .catch(error => {
            console.error("Error loading data:", error);
            resultDiv.textContent = "Error loading data.";
        });
}
