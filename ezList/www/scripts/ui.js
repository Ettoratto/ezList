function toggleNewListPopup(show) {

    const popup = document.getElementById("new-list-popup")
    const input = document.getElementById("new-list-name-input")
    const shouldShow = typeof show === "boolean" ? show : popup.style.display !== "flex"

    if(shouldShow){
        popup.setAttribute("style", "display: flex;")
        input.select()
    }else{
        input.value = ""
        popup.setAttribute("style", "display: none;")
    }
}

function toggleNewItemPopup(show) {

    const popup = document.getElementById("new-item-popup")
    const input = document.getElementById("new-item-name-input")
    const shouldShow = typeof show === "boolean" ? show : popup.style.display !== "flex"

    if(shouldShow){
        popup.setAttribute("style", "display: flex;")
        input.select()
    }else{
        input.value = ""
        popup.setAttribute("style", "display: none;")
    }
}

function toggleListSelection(show){

    const listSelection = document.getElementById("list-selection")
    const shouldShow = typeof show === "boolean" ? show : listSelection.style.display !== "flex"

    if(shouldShow)
        listSelection.setAttribute("style", "display: flex")
    else
        listSelection.setAttribute("style", "display: none")
}

function toggleItemDisplay(show){

    const itemDisplay = document.getElementById("item-display")
    const shouldShow = typeof show === "boolean" ? show : itemDisplay.style.display !== "flex"

    if(shouldShow)
        itemDisplay.setAttribute("style", "display: flex")
    else
        itemDisplay.setAttribute("style", "display: none")
}

function toggleSortSelect(sortByList){

    let id = sortByList ? "lists-sort-element" : "items-sort-element"
    let sortElement = document.getElementById(id)

    if(sortElement.style.display === "flex") {
        sortElement.setAttribute("style", "display: none")
    } else {
        sortElement.setAttribute("style", "display: flex")
        sortElement.focus()
    }
}


function toggleSortArrow(lists){

    let arrowUp, arrowDown

    if(lists){
        arrowUp = document.getElementById("lists-arrow-up-icon")
        arrowDown = document.getElementById("lists-arrow-down-icon")
    }else{
        arrowUp = document.getElementById("items-arrow-up-icon")
        arrowDown = document.getElementById("items-arrow-down-icon")
    }

    if(arrowDown.style.display == ""){
        arrowUp.setAttribute("style", "display: flex")
        arrowDown.setAttribute("style", "display: none")
    }
    
    if(arrowDown.style.display === "none"){
        arrowUp.setAttribute("style", "display: none")
        arrowDown.setAttribute("style", "display: flex")
    }else{
        arrowDown.setAttribute("style", "display: none")
        arrowUp.setAttribute("style", "display: flex")
    }
}


function showListSelection(){

    return new Promise((resolve) => {

        let container = document.getElementById("list-selection")
        container.innerHTML = ""
        toggleListSelection(true)

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

function renderListCards(myLists = lists){

    const listContainer  = document.getElementById("list-container")
    listContainer.innerHTML = ""

    myLists.forEach(list => {
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


function renderItemCards(list){

    const itemContainer = document.getElementById("items-container")
    itemContainer.innerHTML = ""

    if(!list){

        items.forEach(item => {
            
            renderSingleItemCard(item)
        });

    }else{

        list.getItemsArray().forEach(itemId  => {

            item = getItemById(itemId)
            renderSingleItemCard(item)
        });
    }
}

function renderSingleItemCard(item){

    const itemContainer = document.getElementById("items-container")

    const card = document.createElement("div")
    card.classList.add("item-card")
    let itemInfo = createItemHTML(item)
    card.innerHTML = `
        <div class="item-card-info" onclick="viewItem('${item.id}')">
            <h4>${item.name}</h4><br>
            ${itemInfo}
            </div>

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
    let itemInfo = createItemHTML(item)
    card.innerHTML = `

        <div class="item-display-card">
            <h4>${item.name}</h4><br>
            ${itemInfo}
        </div>
    `

    container.appendChild(card)
    toggleItemDisplay(true)
}

function createItemHTML(item){

    return `

        <span> 
            |Prezzo: ${item.price || "/"}€ <br> 
            |Prezzo/Kg${item.priceKG || "/"} <br>
            |Marca: ${item.brand || "/"} <br>
        </span>
        <span>
            |Peso: ${item.weight || "/"}Kg <br>
            |Tipo: ${item.type || "/"} <br>
            |Qta: ${item.qty || "/"} <br>
        </span>

    `
}


