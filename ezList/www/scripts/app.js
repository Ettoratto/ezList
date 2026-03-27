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
    searchLists()
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
    searchItems()
}

/**
 * Selects/deselects a list card and filters visible items accordingly.
 * @param {string} id
 */
function viewList(id){

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
    
    searchLists()
    saveLists()

    toggleListSelection(false)
}

/**
 * Returns lists filtered only by the current list search text.
 * @returns {Array<List>}
 */
function getListSearchResults(){
    const searchInput = document.getElementById("search-list-bar-input").value.toLowerCase().trim()

    return lists.filter((list) => String(list.name).toLowerCase().trim().search(searchInput) != -1)
}

/**
 * Returns selected list id if a list card is selected.
 * @returns {string|null}
 */
function getSelectedListId(){
    let listId = null

    for(let i = 0; i < lists.length; i++){
        let listElement = document.getElementById(lists[i].id)

        if(!listElement)
            continue
            
        if(listElement.classList.contains("selected-list-card"))
            listId = lists[i].id
    }

    return listId
}

/**
 * Returns items filtered only by current item search text and selected list scope.
 * @returns {Array<Object>}
 */
function getItemSearchResults(){
    const searchInput = document.getElementById("search-item-bar-input").value.toLowerCase().trim()
    const selectedListId = getSelectedListId()
    const selectedList = getListById(selectedListId)

    if(selectedList){

        return selectedList.items
        .map((itemId) => getItemById(String(itemId)))
        .filter((itemObj) => {
            if (!itemObj || !itemObj.name) return false
            return itemObj.name.toLowerCase().trim().search(searchInput) !== -1
        })

    }

    return items.filter((item) => String(item.name).toLowerCase().trim().search(searchInput) != -1)
}

/**
 * Sorts lists by criteria and returns a new array.
 * @param {Array<List>} listsArray
 * @param {"name"|"itemsCount"|"cost"|"recent"} sortBy
 * @returns {Array<List>}
 */
function sortListsArray(listsArray, sortBy){
    switch(sortBy){
        case "name":
            return listsArray.toSorted((a, b) => a.name.localeCompare(b.name))
        case "itemsCount":
            return listsArray.toSorted((a, b) => b.items.length - a.items.length)
        case "cost":
            return listsArray.toSorted((a, b) => b.getTotalCost() - a.getTotalCost())
        case "recent":
        default:
            return [...listsArray]
    }
}

/**
 * Sorts items by criteria and returns a new array.
 * @param {Array<Object>} itemsArray
 * @param {"name"|"price"|"brand"|"recent"} sortBy
 * @returns {Array<Object>}
 */
function sortItemsArray(itemsArray, sortBy){
    switch(sortBy){
        case "name":
            return itemsArray.toSorted((a, b) => a.name.localeCompare(b.name))
        case "price":
            return itemsArray.toSorted((a, b) => b.price - a.price)
        case "brand":
            return itemsArray.toSorted((a, b) => a.brand.localeCompare(b.brand))
        case "recent":
        default:
            return [...itemsArray]
    }
}

/**
 * Builds and renders list cards from current search/sort/direction state.
 */
function renderListsFromState(){
    let searchResult = getListSearchResults()
    searchResult = sortListsArray(searchResult, currentListSort)

    if(isListSortInverted)
        searchResult.reverse()

    renderListCards(searchResult, false)
}

/**
 * Builds and renders item cards from current search/sort/direction state.
 */
function renderItemsFromState(){
    let filteredItems = getItemSearchResults()
    filteredItems = sortItemsArray(filteredItems, currentItemSort)

    if(isItemSortInverted)
        filteredItems.reverse()

    renderItemCards(null, filteredItems, false)
}

/**
 * Filters list cards by search input.
 */
function searchLists(){
    renderListsFromState()
}

/**
 * Filters item cards by search input, scoped to selected list when present.
 */
function searchItems(){
    renderItemsFromState()
}

/**
 * Sorts lists by the provided criteria.
 * @param {"name"|"itemsCount"|"cost"|"recent"} sortBy
 */
function sortLists(sortBy){
    currentListSort = sortBy
    renderListsFromState()
}   

/**
 * Sorts items by the provided criteria.
 * @param {"name"|"price"|"brand"|"recent"} sortBy
 */
function sortItems(sortBy){
    currentItemSort = sortBy
    renderItemsFromState()
}
