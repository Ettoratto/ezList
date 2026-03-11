class list {

    constructor(name) {

        this.name = name
        this.items = []
    }

    addItem(item) {

        this.items.push(item)   
    }

    removeItem(item){

        this.items.splice(this.items.indexOf(item), 1)
    }

    getTotalCost() {

        let total = 0
        for (let i = 0; i < this.items.length; i++)
            total += this.items[i].price
        
        return total
    }

    getItemsCount(){

        return this.items.length
    }



}

class item {

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

function showNewListPopup() {

    document.getElementById("new-list-popup").setAttribute("style", "display: flex;")
}

function createNewList() {

    let listName = document.getElementById("new-list-name-input").value
    if(listName == "")
        listName = "Nuova lista"

    new list(listName)
    closeNewListPopup()
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

    let newItem = new item(itemName, itemWeight, itemQty, itemPrice, itemPriceKG, itemType, wantedIndex)
    return newItem
}
