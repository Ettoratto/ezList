/**
 * Creates a new list from popup input and renders it.
 */
function createNewList() {

    let listName = document.getElementById("new-list-name-input").value
    if(listName == "")
        listName = "Nuova lista"

    const newList = new List(listName) 
    lists.push(newList)

    toggleNewListPopup(false)
    saveLists()
    renderSingleListCard(newList)
}

/**
 * Creates a new item from popup form input and renders it.
 */
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
    // Keep a compact id by joining the first UUID segments.
    let itemId = part1 + part2 + part3

    const item = {id: itemId, name: itemName, weight: itemWeight, qty: itemQty, price: itemPrice, priceKG: itemPriceKG, type: itemType, brand: itemBrand, wantedIndex: 0}

    items.push(item)

    toggleNewItemPopup(false)
    saveLists()
    renderSingleItemCard(item)
}

/**
 * Selects/deselects a list card and filters visible items accordingly.
 * @param {string} id
 */
function viewList(id){

    let card = document.getElementById(id)

    if(card.classList.contains("selected-list-card")){
        card.classList.remove("selected-list-card")
        renderItemCards()

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
        renderItemCards(getListById(id))
    }

    searchItems()
    
}

/**
 * Prompts the user to choose a target list and adds the item to it.
 * @param {string} itemId
 * @returns {Promise<void>}
 */
async function addItemToList(itemId) {

    const listId = await showListSelection()
    if (!listId) return

    let selectedList = lists.find(l => l.id === listId)
    selectedList.addItem(itemId)

    console.log("lists: " + lists)
    
    renderListCards()
    saveLists()

    toggleListSelection(false)
}

/**
 * Filters list cards by search input.
 */
function searchLists(){

    const searchInput = document.getElementById("search-list-bar-input").value.toLowerCase().trim()
    
    const searchResult = lists.filter((list) => String(list.name).toLowerCase().trim().search(searchInput) != -1) 
    
    return renderListCards(searchResult)
}   

/**
 * Filters item cards by search input, scoped to selected list when present.
 */
function searchItems(){

    const searchInput = document.getElementById("search-item-bar-input").value.toLowerCase().trim()
    let filteredItems = []

    let listId = null
    for(let i = 0; i < lists.length; i++){
        
        let listElement = document.getElementById(lists[i].id)

        if(!listElement)
                continue
            
        if(listElement.classList.contains("selected-list-card"))
            listId = lists[i].id
    }

    let newList = getListById(listId)
    if(newList){

        filteredItems = newList.items
        .map((itemId) => getItemById(String(itemId)))
        .filter((itemObj) => {
            if (!itemObj || !itemObj.name) return false
            return itemObj.name.toLowerCase().trim().search(searchInput) !== -1
        })

    }else
        filteredItems = items.filter((item) => String(item.name).toLowerCase().trim().search(searchInput) != -1)
    
    document.getElementById("items-container").innerHTML = ""
    filteredItems.forEach(item => {    
            renderSingleItemCard(item) 
    })
}

/**
 * Sorts lists by the provided criteria.
 * @param {"name"|"itemsCount"|"cost"|"recent"} sortBy
 */
function sortLists(sortBy){

    let sorted = null
    switch(sortBy){

        case "name":
            
            sorted = lists.toSorted((a, b) => a.name.localeCompare(b.name))
            renderListCards(sorted, false)
        break

        case "itemsCount":
            
            sorted = lists.toSorted((a, b) => b.items.length - a.items.length )
            renderListCards(sorted, false)
        break

        case "cost":

            sorted = lists.toSorted((a, b) => b.getTotalCost() - a.getTotalCost())
            renderListCards(sorted, false)
        break

        case "recent":

            renderListCards(null, false)
        break
   } 
}   

/**
 * Sorts items by the provided criteria.
 * @param {"name"|"price"|"brand"|"recent"} sortBy
 */
function sortItems(sortBy){

    let sorted = null
    switch(sortBy){

        case "name":

            sorted = items.sort((a, b) => a.name.localeCompare(b.name))
            renderItemCards(null, sorted, false)
        break

        case "price":
            
            sorted = items.sort((a, b) => b.price - a.price)
            renderItemCards(null, sorted, false)
        break

        case "brand":

            sorted = items.sort((a, b) => a.brand.localeCompare(b.brand))
            
            renderItemCards(null, sorted, false)
        break

        case "recent":

            renderItemCards(null, null, false, false)
        break
    }

    console.log(items)
}

/**
 * Inverts current visual order for lists or items and toggles the arrow icon.
 * @param {boolean} myLists True to invert lists, false to invert items.
 */
function invertSort(myLists){

    if(myLists){
        const container = document.getElementById("lists-container");
        
        // Inverte fisicamente l'ordine degli elementi nel DOM
        Array.from(container.children).reverse().forEach(child => {
            container.appendChild(child)
        })
        
    } else {
        const itemsContainer = document.getElementById("items-container")
        if(itemsContainer.classList.contains("firstReverseCall")){
            // First click must also invert order; remove setup flag and apply reverse.
            itemsContainer.classList.remove("firstReverseCall")
            renderItemCards(null, items.reverse())
        } else {
            renderItemCards(null, items.reverse())
        }
    }

    toggleSortArrow(myLists)
}