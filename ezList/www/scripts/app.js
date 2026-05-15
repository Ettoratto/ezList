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
    renderListsFromState()
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
    renderItemsFromState()
}

/**
 * Prompts the user to choose a target list and adds the item to it.
 * @param {string} itemId listId
 */
 function addItemToList(itemId, listId) {

    let selectedList = lists.find(l => l.id === listId)
    selectedList.addItem(itemId)

    console.log("lists: " + lists)
    
    renderListsFromState()
    saveLists()

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

        case "wanted":
            return itemsArray.toSorted((a, b) => b.wantedIndex - a.wantedIndex)

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
function renderItemsFromState(selectedListId = null){

    console.log("itemsfromstate")
    let filteredItems = getItemSearchResults()
    filteredItems = sortItemsArray(filteredItems, currentItemSort)

    if(isItemSortInverted)
        filteredItems.reverse()

    renderItemCards(filteredItems, false, selectedListId)
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


function searchItems(){

    renderItemsFromState()
}

function searchLists(){

    renderListsFromState()
}
