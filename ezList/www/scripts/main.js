class List {

    constructor(name, id) {

        this.name = name
        if(id == null)
            this.id = crypto.randomUUID().split("-")[0]
        else
            this.id = id
        this.items = []
    }

    addItem(item) {

        this.items.push(item)   
    }

    removeItem(item){

        this.items.splice(this.items.indexOf(item), 1)
    }

    getTotalCost() {

        return this.items.reduce((total, item) => total + (item.price || 0), 0);
    }

    getItemsCount(){

        return this.items.length
    }



}

class Item {

    constructor(name, weight, qty, price, priceKG, type, wantedIndex){

        this.name = name
        this.weight = weight
        this.qty = qty
        this.price = price
        this.priceKG = priceKG
        this.type = type
        this.wantedIndex = wantedIndex
    }
}

let lists = []

function saveLists() {

    localStorage.setItem("lists", JSON.stringify(lists))
}

function loadLists() {

    console.log(lists)

    let loadedLists = JSON.parse(localStorage.getItem("lists"))
    if(loadedLists == null)
        return

    loadedLists.forEach(list => {
        lists.push(new List(list.name, list.id))
    });


    console.log(lists)
    renderListsCards()
}

function createNewList() {

    let listName = document.getElementById("new-list-name-input").value
    if(listName == "")
        listName = "Nuova lista"

    lists.push(new List(listName))
    closeNewListPopup()
    saveLists()
    renderListsCards()
}

function showNewListPopup() {

    document.getElementById("new-list-popup").setAttribute("style", "display: flex;")
}

function closeNewListPopup() {

    document.getElementById("new-list-popup").setAttribute("style", "display: none;")
}

function createItem() {

    let itemName = document.getElementById("itemName").value
    let itemWeight = document.getElementById("itemWeight").value
    let itemQty = document.getElementById("itemQty").value
    let itemPrice = document.getElementById("itemPrice").value
    let itemPriceKG = document.getElementById("itemPriceKG").value
    let itemType = document.getElementById("itemType").value
    let wantedIndex = document.getElementById("wantedIndex").value

    let newItem = new Item(itemName, itemWeight, itemQty, itemPrice, itemPriceKG, itemType, wantedIndex)
    return newItem
}


function renderListsCards(){

    document.getElementById("list-container").innerHTML = ""

    lists.forEach(list => {

        let card = document.createElement("div")
        card.classList.add("list-card")
        card.innerHTML = `
            <h2>${list.name}</h2>
            <p>Totale: ${list.getTotalCost()}€</p>
            <p>Numero di articoli: ${list.getItemsCount()}</p>
        `

        document.getElementById("list-container").appendChild(card)
    });
}
