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

        if(!this.findItem(item))
            this.items.push(item)   
    }

    removeItem(item){

        this.items.splice(this.items.indexOf(item), 1)
    }

    findItem(item){

        return this.items.indexOf(item)
    }

    getItemsArray(){

        return this.items
    }

    getTotalCost() {

        return this.items.reduce((total, item) => total + (item.price || 0), 0);
    }

    getItemsCount(){

        return this.items.length
    }

}

let lists = []
let items = []

function saveLists() {

    localStorage.setItem("lists", JSON.stringify(lists))
    localStorage.setItem("items", JSON.stringify(items))
}

function loadLists() {

    console.log(lists)

    let loadedLists = JSON.parse(localStorage.getItem("lists"))
    let loadedItems = JSON.parse(localStorage.getItem("items"))
    if(loadedLists == null)
        return

    if(loadedItems != null)
        items = loadedItems

    loadedLists.forEach(list => {
        lists.push(new List(list.name, list.id))
    });


    console.log(lists)
    renderListCards()
    renderItemCards()
}

function createNewList() {

    let listName = document.getElementById("new-list-name-input").value
    if(listName == "")
        listName = "Nuova lista"

    let newList = new List(listName) 
    lists.push(newList)
    closeNewListPopup()
    saveLists()
    renderSingleListCard(newList)
}

function showNewListPopup() {

    document.getElementById("new-list-popup").setAttribute("style", "display: flex;")
}

function closeNewListPopup() {

    document.getElementById("new-list-name-input").value = ""
    document.getElementById("new-list-popup").setAttribute("style", "display: none;")
}

function showNewItemPopup() {

    document.getElementById("new-item-popup").setAttribute("style", "display: flex;")
}

function closeNewItemPopup() {

    document.getElementById("new-item-name-input").value = ""
    document.getElementById("new-item-popup").setAttribute("style", "display: none;")
}

function createNewItem() {

    let itemName = document.getElementById("new-item-name-input").value
    if(itemName == ""){
        alert("Inserisci il nome del prodotto")
        return
    }
    let itemWeight = document.getElementById("new-item-weight-input").value
    let itemQty = document.getElementById("new-item-qty-input").value
    let itemPrice = document.getElementById("new-item-price-input").value
    let itemPriceKG = document.getElementById("new-item-priceKG-input").value
    let itemType = document.getElementById("new-item-type-input").value
    let itemBrand = document.getElementById("new-item-brand-input").value
    let itemId = Date.now().toString()

    let item = {name: itemName, weight: itemWeight, qty: itemQty, price: itemPrice, priceKG: itemPriceKG, type: itemType, brand: itemBrand, id: itemId, wantedIndex: 0}

    items.push(item)

    closeNewItemPopup()
    saveLists()
    renderSingleItemCard(item)
    console.log(items)
}


function renderListCards(){

    let listContainer  = document.getElementById("list-container")
    listContainer.innerHTML = ""

    lists.forEach(list => {

        let card = document.createElement("div")
        card.setAttribute("onClick", "viewList('" + list.id + "')")
        card.classList.add("list-card")
        card.innerHTML = `
            <h2>${list.name}</h2>
            <p>Totale: ${list.getTotalCost()}€</p>
            <p>Articoli: ${list.getItemsCount()}</p>
        `

        listContainer.appendChild(card)
        card.scrollIntoView()
    });
}

function renderSingleListCard(list){

    let listContainer  = document.getElementById("list-container")

    let card = document.createElement("div")
    card.setAttribute("onClick", "viewList('" + list.id + "')")
    card.classList.add("list-card")
    card.innerHTML = `
        <h2>${list.name}</h2>
        <p>Totale: ${list.getTotalCost()}€</p>
        <p>Articoli: ${list.getItemsCount()}</p>
    `

    listContainer.appendChild(card)
    card.scrollIntoView()
}


function renderItemCards(listId){

    let itemContainer = document.getElementById("items-container")
    itemContainer.innerHTML = ""

    if(!listId){

        items.forEach(item => {
            
            let card = document.createElement("div")
            card.setAttribute("onClick", "viewItem('" + item.id + "')")
            card.classList.add("item-card")
            card.innerHTML = `
                <h2>${item.name}</h2>
            `

            itemContainer.appendChild(card)
            card.scrollIntoView()
        });

    }else{

        let list = getListById(listId)
        if(!list)
            return console.log("Lista non trovata")

        list.getItemsArray().forEach(item  => {
            
            let card = document.createElement("div")
            card.setAttribute("onClick", "viewItem('" + item.id + "')")
            card.classList.add("item-card")
            card.innerHTML = `
                <h2>${item.name}</h2>
            `

            itemContainer.appendChild(card)
            card.scrollIntoView()
        });
    }
}

function renderSingleItemCard(item){

    let itemContainer = document.getElementById("items-container")

    let card = document.createElement("div")
    card.setAttribute("onClick", "viewItem('" + item.id + "')")
    card.classList.add("item-card")
    card.innerHTML = `
        <h2>${item.name}</h2>
    `

    itemContainer.appendChild(card)
    card.scrollIntoView()
}




function viewList(id){

    let list = getListById(id)
    console.log(list)
    if(list == null)
        return console.log("Errore id lista")
    renderItemCards(list)
}

function getListById(id){

   return lists.find(list => String(list.id).localeCompare(String(id)) == 0);
}
