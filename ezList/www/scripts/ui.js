"use strict"

function clearElement(element){

    element.replaceChildren()
}

function escapeHTML(value){

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;")
        .replaceAll("/", "&#x2F;")
        .replaceAll("`", "&#x60;")
        .replaceAll("=", "&#x3D;")
}

function toggleModal(modalId, show, inputSelectorToClear = null) {

    const modal = document.getElementById(modalId)
    if(!modal)
        return false

    const shouldShow = typeof show === "boolean" ? show : modal.style.display !== "flex"
    modal.style.display = shouldShow ? "flex" : "none"

    if(!shouldShow && inputSelectorToClear) {
        document.querySelectorAll(`${inputSelectorToClear} input`).forEach(input => input.value = "")
    }

    return shouldShow
}

function createItemHTML(item){

    const wantedIndex = item.getWantedIndex ? item.getWantedIndex() : item.wantedIndex

    return `

        <span> 
            |Prezzo: ${escapeHTML(item.price || "/")}€ <br> 
            |€/Kg: ${escapeHTML(item.priceKG || "/")} <br>
            |Marca: ${escapeHTML(item.brand || "/")} <br>
        </span>
        <span>
            |Peso: ${escapeHTML(item.weight || "/")} <br>
            |WI: <span id="${item.id + "span"}">${wantedIndex ?? 0}</span> <br>
            |Qta: ${escapeHTML(item.qty || "/")} <br>
        </span>

    `
}

function toggleListSidebar(){


    const container = document.getElementById("lists-sidebar-container")
    container.classList.toggle("active")

}

function toggleItemCardSelection(itemId){

    const card = document.getElementById(itemId)
    return card.classList.toggle("item-checked")

}



/**
 * Shows or hides the "new list" popup.
 * @param {boolean} [show]
 */
function toggleNewListPopup(show) {

    const input = document.getElementById("new-list-name-input")
    const shouldShow = toggleModal("new-list-popup", show, ".new-list-popup-container")

    if(shouldShow){
        input.select()
    }
    
}

/**
 * Shows or hides the "new item" popup.
 * @param {boolean} [show]
 */
function toggleNewItemPopup(show) {

    const input = document.getElementById("new-item-name-input")
    const shouldShow = toggleModal("new-item-popup", show, ".new-item-popup-container")

    if(shouldShow){
        input.select()
    }
}

/**
 * Shows or hides the list selection overlay.
 * @param {boolean} [show]
 */
function toggleListSelection(show){

    toggleModal("list-selection", show)
}

/**
 * Shows or hides the item detail overlay.
 * @param {boolean} [show]
 */
function toggleItemDisplay(show){

    toggleModal("item-display", show)
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
 * Selects/deselects a list card and filters visible items accordingly.
 * @param {string} id
 */
function viewList(id){

    getListById(id).toggleListSelection()

    let card = document.getElementById(id)

    if(card.classList.contains("selected-list-card")){
        card.classList.remove("selected-list-card")

    }else{

        for(let i = 0; i < lists.length; i++){

            let listElement = document.getElementById(lists[i].id)

            if(!listElement)
                continue

            if(listElement.classList.contains("selected-list-card")){
                listElement.classList.remove("selected-list-card")
                break
            }
        } 
        card.classList.add("selected-list-card")   
    }

    renderItemsFromState(id)
    
}



/**
 * Renders an overlay to choose a list
 * @param  {String} [itemId] id of the item to add
 */
function showListSelection(itemId){

    const container = document.getElementById("list-selection")
    clearElement(container)
    let n = false
    
    lists.forEach(list => {

        if(list.findItemById(itemId) == undefined){
            
            const card = document.createElement("div")
            card.classList.add("list-selection-card")
            card.addEventListener("click", () => addItemToList(itemId, list.getId()))

            card.innerHTML = `
                <h2>${escapeHTML(list.name)}</h2>
            `

            container.appendChild(card)
            n = true
        }
    })

    //prevent list selection from being shown if the item already belongs to all lists
    if(n)
        toggleModal("list-selection", true)
    else
        toggleModal("list-selection", false)
}

/**
 * Renders all list cards or a provided subset.
 * @param {Array<List>} [myLists=lists]
 */
function renderListCards(myLists = lists, scrollIntoView = true){

    const listContainer  = document.getElementById("lists-container")
    clearElement(listContainer)

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

    const card = document.createElement("div")
    card.setAttribute("id", list.id)
    card.classList.add("list-card")
    card.addEventListener("click", () => viewList(list.id))

    card.innerHTML = `
        <h2>${escapeHTML(list.name)}</h2>
        <span>Totale: ${list.getTotalCost()}€</span>
        <span>Articoli: ${list.getItemsCount()}</span>
    `

    listContainer.appendChild(card)
    if(scrollIntoView)
        card.scrollIntoView()
}


/**
 * Renders item cards from a list or from a direct items array.
 * @param {Array<Object>} [itemsArray]
 */
function renderItemCards(itemsArray, scrollIntoView = true, selectedListId = null){

    const itemContainer = document.getElementById("items-container")
    clearElement(itemContainer)

    if(itemsArray){
        let list = getListById(selectedListId)
        let withCheckbox = false
        if(list && list.isSelected) withCheckbox = true
 
        itemsArray.forEach(item => {
            renderSingleItemCard(item, scrollIntoView, withCheckbox)
        })
        return
    }

    items.forEach(item => {
        
        renderSingleItemCard(item, scrollIntoView)
    })
}

/**
 * Renders a single item card.
 * @param {Object} item
 */
function renderSingleItemCard(item, scrollIntoView = true, withCheckbox = false){

    const itemContainer = document.getElementById("items-container")

    const card = document.createElement("div")
    card.classList.add("item-card")
    card.id = item.id

    let checkbox = ""
    let viewItem = ""

    if(withCheckbox)
        checkbox = `
    
        <div class="overlay" style="width: 90%; background: transparent" onclick="toggleItemCheck('${item.id}')">
        </div>

    `   
    else
        viewItem = `
            onclick="viewItem('${item.id}')"
        `


    let itemInfo = createItemHTML(item)
    card.innerHTML = `
        <div style="width: 90%" ${viewItem}>
            <span class="item-name">${escapeHTML(item.name)}</span>
            <div class="item-card-info">
            ${checkbox}    
                
                ${itemInfo}
                
            </div>
        </div>
        <div class="item-menu">
            <button onClick=showListSelection('${item.id}')>m</button>
            <button onClick=showListSelection('${item.id}')>+</button>
        </div>
        
        
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
    clearElement(container)

    const card = document.createElement("div")
    card.classList.add("item-card", "item-display-card")

    let itemInfo = createItemHTML(item)
    card.innerHTML = `
        <div>
            <span class="item-name">${escapeHTML(item.name)}</span>
            <div class="item-card-info">  
                ${itemInfo}
            </div>
        </div>
    `

    container.appendChild(card)
    toggleModal("item-display", true)
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

