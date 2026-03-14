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

            item = getItemsById(itemId)
            renderSingleItemCard(item)
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