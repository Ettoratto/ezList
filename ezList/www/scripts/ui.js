
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
    container.innerHTML = ""
    let n = false
    
    lists.forEach(list => {

        if(list.findItemById(itemId) == undefined){
            
            const card = document.createElement("div")
            card.onclick = () => addItemToList(itemId, list.getId())
            card.classList.add("list-selection-card")
            card.innerHTML = `
                <h2>${list.name}</h2>
            `
            container.appendChild(card)
            n = true
        }
    })

    //prevent list selection from being shown if the item already belongs to all lists
    if(n)
        toggleListSelection(true)
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
        <span>Totale: ${list.getTotalCost()}€</span>
        <span>Articoli: ${list.getItemsCount()}</span>
    `

    listContainer.appendChild(card)
    if(scrollIntoView)
        card.scrollIntoView()
    if(scrollIntoView)
        card.scrollIntoView()
}


/**
 * Renders item cards from a list or from a direct items array.
 * @param {Array<Object>} [itemsArray]
 */
function renderItemCards(itemsArray, scrollIntoView = true, selectedListId = null){

    const itemContainer = document.getElementById("items-container")
    itemContainer.innerHTML = ""

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

    let checkbox = ""
    let viewItem = ""

    if(withCheckbox)
        checkbox = `
    
        <div class="overlay" id="${item.id}" style="width: 90%; background: transparent" onclick="toggleItemCheck('${item.id}')">
        </div>

    `   
    else
        viewItem = `
            onclick="viewItem('${item.id}')"
        `


    const card = document.createElement("div")
    card.classList.add("item-card")
    card.id = item.id
    let itemInfo = createItemHTML(item)
    card.innerHTML = `
        <div style="width: 90%" ${viewItem}>
            <span class="item-name">${item.name}</span>
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
    container.innerHTML = ""

    let card = document.createElement("div")
    let itemInfo = createItemHTML(item)
    card.classList.add("item-card", "item-display-card")
    card.innerHTML = `
        <div>
            <span class="item-name">${item.name}</span>
            <div class="item-card-info">  
                ${itemInfo}
            </div>
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
            |€/Kg: ${item.priceKG || "/"} <br>
            |Marca: ${item.brand || "/"} <br>
        </span>
        <span>
            |Peso: ${item.weight || "/"} <br>
            |WI: <span id="${item.id + "span"}">${item.wantedIndex}</span> <br>
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

