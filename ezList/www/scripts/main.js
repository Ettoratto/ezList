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

    let itemName = document.getElementById("itemName").value
    let itemWeight = document.getElementById("itemWeight").value
    let itemQty = document.getElementById("itemQty").value
    let itemPrice = document.getElementById("itemPrice").value
    let itemPriceKG = document.getElementById("itemPriceKG").value
    let itemType = document.getElementById("itemType").value

    items.push({name: itemName, weight: itemWeight, qty: itemQty, price: itemPrice, priceKG: itemPriceKG, type: itemType, wantedIndex: 0})
    console.log(items)
}


function renderListsCards(){

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


function renderItems(list){

    let container = document.getElementById("dashboard-items-sidebar")

    if(list == null){

        items.forEach(element => {
            
        });

    }else{


    }
}




function viewList(id){

    let list = getListById(id)
    if(list == null)
        return console.log("Errore id lista")
    console.log(list)
    renderItems(list)
}

function getListById(id){
    console.log(id)

    lists.forEach(list => {

        console.log(list.id)
        if(String(list.id).localeCompare(String(id)) == 0)
            return list
    });
    return null
}
