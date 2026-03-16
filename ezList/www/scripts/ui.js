function showNewListPopup() {

    document.getElementById("new-list-popup").setAttribute("style", "display: flex;")
    document.getElementById("new-list-name-input").select()
}

function closeNewListPopup() {

    document.getElementById("new-list-name-input").value = ""
    document.getElementById("new-list-popup").setAttribute("style", "display: none;")
}

function showNewItemPopup() {

    document.getElementById("new-item-popup").setAttribute("style", "display: flex;")
    document.getElementById("new-item-name-input").select()
}

function closeNewItemPopup() {

    document.getElementById("new-item-name-input").value = ""
    document.getElementById("new-item-popup").setAttribute("style", "display: none;")
}

function closeListSelection(){

    document.getElementById("list-selection").setAttribute("style", "display: none")
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

function renderListCards(){

    const listContainer  = document.getElementById("list-container")
    listContainer.innerHTML = ""

    lists.forEach(list => {
        renderSingleListCard(list)
    });
}

function renderSingleListCard(list){

    const listContainer  = document.getElementById("list-container")

    let card = document.createElement("div")
    card.setAttribute("onClick", "viewList('" + list.id + "')")
    card.setAttribute("id", list.id)
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
            
            renderSingleItemCard(item)
        });

    }else{

        let list = getListById(listId)

        if(!list)
            return console.log("Lista non trovata")

        list.getItemsArray().forEach(itemId  => {

            item = getItemById(itemId)
            renderSingleItemCard(item)
        });
    }
}

function renderSingleItemCard(item){

    let itemContainer = document.getElementById("items-container")

    let card = document.createElement("div")
    card.classList.add("item-card")
    card.innerHTML = `
        <div class="item-card-info" onclick="viewItem('${item.id}')">
            <div class="item-card">
                <h4>${item.name}</h4><br>
                <span> | ${item.price}€</span>
            </div>
        </ div>

        <button onClick=addItemToList('${item.id}')>+</button>
    `

    itemContainer.appendChild(card)
    card.scrollIntoView()
}

function viewItem(itemId){

    const item = getItemById(itemId)
    const container = document.getElementById("item-display")
    container.innerHTML = ""

    let card = document.createElement("div")
    card.innerHTML = `

        <div class="item-display-card">
            <h4>${item.name}</h4><br>
            <span> | ${item.price}€</span>
        </div>
    `

    container.appendChild(card)
    container.setAttribute("style", "display: flex;")
}

function closeItemDisplay(){

    document.getElementById("item-display").setAttribute("style", "display: none")
}