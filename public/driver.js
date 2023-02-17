const table = document.getElementById("recipes")
const addButton = document.getElementById("addIngredient")
const searchButton = document.getElementById("search")

const ingredient = document.getElementById("ingredient")
const units = document.getElementById("units")
const quantity = document.getElementById("quantity")

var currentBasket;
var ingredientList = newBasket()

async function requestAvailableRecipes(basket) {
    let res = await fetch('http://localhost:3000/available-recipes', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ basketName: basket })
    }).catch(err => {
        console.log(err);
    }).then(res => res.json())
    console.log(res)
    populateTable(res)
    reset()
}

function populateTable(recipes) {
    while (table.childNodes.length > 2) {
        table.removeChild(table.lastChild)
    }

    for (const recipe of recipes) {
        let tableRow = document.createElement("tr")
        let recipeTitle = document.createElement("td")
        let portionCount = document.createElement("td")
        let directions = document.createElement("td")

        var str = recipe.recipe.value;
        var n = str.lastIndexOf('#');
        var result = str.substring(n + 1);
        recipeTitle.innerHTML = result
        portionCount.innerHTML = Math.floor(recipe.maxCookCount.value)
        directions.innerHTML = recipe.directions.value

        tableRow.appendChild(recipeTitle)
        tableRow.appendChild(portionCount)
        tableRow.appendChild(directions)
        table.appendChild(tableRow)
    }
}

function newBasket() {
    let basketName = `basket${Date.now()}`
    currentBasket = basketName
    return `
    INSERT DATA {
        chef:${basketName} rdf:type chef:IngredientsBasket . `
}

async function createBasket() { 
    console.log(insertQuery())
    let res = await fetch('http://localhost:3000/create/basket', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query: insertQuery() })
    })
        .then(res => {
            res.json()
            requestAvailableRecipes(currentBasket)
        })
        .catch(err => {
            console.log(err);
        })
}

function reset() {
    ingredientList = newBasket()

    ingredient.value = ''
    quantity.value = ''
    units.value = ''
}


addButton.addEventListener('click', () => {
    if (ingredient.value == '' ||
        quantity.value == '' ||
        units.value == '') {
        return
    }

    let container = `container${currentBasket}`
    container += Date.now()

    ingredientList += `chef:${container} rdf:type chef:Container . `
    ingredientList += `chef:${container} chef:holds chef:${ingredient.value} . `
    ingredientList += `chef:${container} chef:measuringUnits "${units.value}"^^xsd:string . `
    ingredientList += `chef:${container} chef:quantity "${quantity.value}"^^xsd:positiveInteger . `
    ingredientList += `chef:${currentBasket} chef:contains chef:${container} . `

    ingredient.value = ''
    quantity.value = ''
    units.value = ''
})

searchButton.addEventListener('click', () => {
    createBasket()
})

function insertQuery() {
    return `${ingredientList} }`
} 