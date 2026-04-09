/**
 * Shows or hides the "new list" popup.
 * @param {boolean} [show]
 */
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

/**
 * Shows or hides the "new item" popup.
 * @param {boolean} [show]
 */
function toggleNewItemPopup(show) {

    const popup = document.getElementById("new-item-popup")
    const input = document.getElementById("new-item-name-input")
    const itemInputs = popup.querySelectorAll(".item-input-form input")
    const shouldShow = typeof show === "boolean" ? show : popup.style.display !== "flex"

    if(shouldShow){
        popup.setAttribute("style", "display: flex;")
        input.select()
    }else{
        itemInputs.forEach(input => {
            input.value = ""
        })
        popup.setAttribute("style", "display: none;")
    }
}

/**
 * Shows or hides the list selection overlay.
 * @param {boolean} [show]
 */
function toggleListSelection(show){

    const listSelection = document.getElementById("list-selection")
    const shouldShow = typeof show === "boolean" ? show : listSelection.style.display !== "flex"

    if(shouldShow)
        listSelection.setAttribute("style", "display: flex")
    else
        listSelection.setAttribute("style", "display: none")
}

/**
 * Shows or hides the item detail overlay.
 * @param {boolean} [show]
 */
function toggleItemDisplay(show){

    const itemDisplay = document.getElementById("item-display")
    const shouldShow = typeof show === "boolean" ? show : itemDisplay.style.display !== "flex"

    if(shouldShow)
        itemDisplay.setAttribute("style", "display: flex")
    else
        itemDisplay.setAttribute("style", "display: none")
}

/**
 * Toggles the sort dropdown visibility and focuses it for onblur-close behavior.
 * @param {boolean} sortByList True for list sort menu, false for item sort menu.
 */
function toggleSortSelect(sortByList){

    let id = sortByList ? "lists-sort-element" : "items-sort-element"
    let sortElement = document.getElementById(id)

    if(sortElement.style.display === "flex") {
        sortElement.setAttribute("style", "display: none")
    } else {
        sortElement.setAttribute("style", "display: flex")
        // Focus lets the menu close automatically when it loses focus.
        sortElement.focus()
    }
}


/**
 * Switches ascending/descending icon for list or item sorting.
 * @param {boolean} lists True for list arrows, false for item arrows.
 */
function toggleSortArrow(lists){

    let arrowUp, arrowDown

    if(lists){
        
        arrowUp = document.getElementById("lists-arrow-up-icon")
        arrowDown = document.getElementById("lists-arrow-down-icon")
    }else{
        arrowUp = document.getElementById("items-arrow-up-icon")
        arrowDown = document.getElementById("items-arrow-down-icon")
    }

    if(arrowDown.style.display === ""){
        arrowDown.setAttribute("style", "display: flex")
        arrowUp.setAttribute("style", "display: none")
    }

    if(arrowUp.style.display === "none"){
        arrowDown.setAttribute("style", "display: none")
        arrowUp.setAttribute("style", "display: flex")
    }else{
        arrowUp.setAttribute("style", "display: none")
        arrowDown.setAttribute("style", "display: flex")
    }
}


/**
 * Renders an overlay to choose a list
 * @param  {String} [itemId] id of the item to add
 */
function showListSelection(itemId){

    let container = document.getElementById("list-selection")
    container.innerHTML = ""
    toggleListSelection(true)

    lists.forEach(list => {
        
        let card = document.createElement("div")
        card.onclick = addItemToList(itemId, list.id)
        card.classList.add("list-selection-card")
        card.innerHTML = `
            <h2>${list.name}</h2>
        `
        container.appendChild(card)

    })
}

/**
 * Renders all list cards or a provided subset.
 * @param {Array<List>} [myLists=lists]
 */
function renderListCards(myLists = lists, scrollIntoView = true){

    const listContainer  = document.getElementById("lists-container")
    listContainer.innerHTML = ""

    myLists.forEach(list => {
        renderSingleListCard(list, scrollIntoView)
    });
}

/**
 * Renders a single list card.
 * @param {List} list
 */
function renderSingleListCard(list, scrollIntoView = true){

    const listContainer  = document.getElementById("lists-container")

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
    if(scrollIntoView)
        card.scrollIntoView()
    if(scrollIntoView)
        card.scrollIntoView()
}


/**
 * Renders item cards from a list or from a direct items array.
 * @param {List|null} list
 * @param {Array<Object>} [itemsArray]
 */
function renderItemCards(list, itemsArray, scrollIntoView = true){

    const itemContainer = document.getElementById("items-container")
    itemContainer.innerHTML = ""

    if(itemsArray){
        itemsArray.forEach(item => {
            renderSingleItemCard(item, scrollIntoView)
        })
        return
    }

    if(!list){

        items.forEach(item => {
            
            renderSingleItemCard(item, scrollIntoView)
            renderSingleItemCard(item, scrollIntoView)
        });

    }else{

        list.getItemsArray().forEach(itemId  => {

            // Item ids are stored on list; map each id to its current item object.
            item = getItemById(itemId)
            renderSingleItemCard(item, scrollIntoView)
            renderSingleItemCard(item, scrollIntoView)
        });
    }
}

/**
 * Renders a single item card.
 * @param {Object} item
 */
function renderSingleItemCard(item, scrollIntoView = true){

    const itemContainer = document.getElementById("items-container")

    const card = document.createElement("div")
    card.classList.add("item-card")
    let itemInfo = createItemHTML(item)
    card.innerHTML = `
        <div class="item-card-info" onclick="viewItem('${item.id}')">
            <h4>${item.name}</h4><br>
            ${itemInfo}
            </div>

        <button onClick=showListSelection('${item.id}')>+</button>
    `

    itemContainer.appendChild(card)
    if(scrollIntoView)
        card.scrollIntoView()
}

/**
 * Displays full details for one item inside the item modal.
 * @param {string} itemId
 */
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

/**
 * Builds reusable HTML fragment for item details.
 * @param {Object} item
 * @returns {string}
 */
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

/**
 * Inverts current visual order for lists or items and toggles the arrow icon.
 * @param {boolean} myLists True to invert lists, false to invert items.
 */
function invertSort(myLists){

    if(myLists){
        isListSortInverted = !isListSortInverted
        searchLists()
    }else{
        isItemSortInverted = !isItemSortInverted
        searchItems()
    }

    toggleSortArrow(myLists)
}

