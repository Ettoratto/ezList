class List {

    constructor(name, id, items = []) {

        this.name = name
        if(id == null)
            this.id = crypto.randomUUID().split("-")[0]
        else
            this.id = id
        this.items = items
    }

    getRealItems() {
        
        return this.items.map(id => items[id])
    }

    addItem(itemId) {

        if(!this.items.includes(itemId))
            this.items.push(itemId)   
    }

    findItemById(itemId){

        return this.items.find(id => id === itemId)
    }

    removeItem(item){

        this.items.splice(this.items.indexOf(item), 1)
    }

    getItemsArray(){

        return this.items
    }

    getTotalCost() {

        let total = 0
        this.items.forEach(itemId => {
            
            const price = parseFloat(getItemsById(itemId).price) || 0
            console.log(price)
            total += price
        });

        return total
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

    const loadedLists = JSON.parse(localStorage.getItem("lists"))
    const loadedItems = JSON.parse(localStorage.getItem("items"))

    if(loadedLists != null)
        loadedLists.forEach(list => {
            lists.push(new List(list.name, list.id, list.items))
        });

    if(loadedItems != null)
        items = loadedItems

    console.log(lists, items)

    renderListCards()
    renderItemCards()
}

function createNewList() {

    let listName = document.getElementById("new-list-name-input").value
    if(listName == "")
        listName = "Nuova lista"

    const newList = new List(listName) 
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

    const itemName = document.getElementById("new-item-name-input").value
    if(itemName == ""){
        alert("Inserisci il nome del prodotto")
        return
    }
    const itemWeight = document.getElementById("new-item-weight-input").value
    const itemQty = document.getElementById("new-item-qty-input").value
    const itemPrice = document.getElementById("new-item-price-input").value
    const itemPriceKG = document.getElementById("new-item-priceKG-input").value
    const itemType = document.getElementById("new-item-type-input").value
    const itemBrand = document.getElementById("new-item-brand-input").value
    const [part1, part2, part3] = crypto.randomUUID().split("-")
    let itemId = part1 + part2 + part3

    const item = {id: itemId, name: itemName, weight: itemWeight, qty: itemQty, price: itemPrice, priceKG: itemPriceKG, type: itemType, brand: itemBrand, wantedIndex: 0}

    items.push(item)

    closeNewItemPopup()
    saveLists()
    renderSingleItemCard(item)
    console.log(items)
}


function renderListCards(){

    const listContainer  = document.getElementById("list-container")
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

    const listContainer  = document.getElementById("list-container")

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
            card.classList.add("item-card")
            card.innerHTML = `
                <div class="item-card-info" onclick=viewItem('${item.id}')>
                    <h2>${item.name}</h2>
                </div>
                <button onClick=addItemToList('${item.id}')>+</button>
            `

            itemContainer.appendChild(card)
            card.scrollIntoView()
        });

    }else{

        let list = getListById(listId)

        if(!list)
            return console.log("Lista non trovata")

        list.getItemsArray().forEach(itemId  => {

            item = getItemsById(itemId)

            
            let card = document.createElement("div")
            card.setAttribute("onClick", "viewItem('" + item.id + "')")
            card.classList.add("item-card")
            card.innerHTML = `
                <div class="item-card-info" onclick=viewItem('${item.id}')>
                    <h2>${item.name}</h2>
                </div>
                <button onClick=addItemToList('${item.id}')>+</button>
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
        <div class="item-card-info" onclick=viewItem('${item.id}')>
            <h2>${item.name}</h2>
        </div>
        <button onClick=addItemToList('${item.id}')>+</button>
    `

    itemContainer.appendChild(card)
    card.scrollIntoView()
}

function viewList(id){

    renderItemCards(id)
}

function getListById(id){

   return lists.find(list => String(list.id).localeCompare(String(id)) == 0);
}

async function addItemToList(itemId) {

    const listId = await showListSelection()
    if (!listId) return

    let selectedList = lists.find(l => l.id === listId)
    selectedList.addItem(itemId)

    console.log(lists)
    
    renderListCards()
    saveLists()

    document.getElementById("list-selection").style.display = "none"
}

function showListSelection(){

    return new Promise((resolve) => {

        let container = document.getElementById("list-selection")
        container.innerHTML = ""
        container.style.display = "flex"

        lists.forEach(list => {
            
            let card = document.createElement("div")
            card.onclick = () => resolve(list.id)
            card.classList.add("list-selection-card")
            card.innerHTML = `
                <h2>${list.name}</h2>
            `

            container.appendChild(card)

        });

    });
}


function getItemsById(itemId){

    return items.find(item => item.id == itemId)
}