/**
 * Persists current lists and items to localStorage.
 */
function saveLists() {

    localStorage.setItem("lists", JSON.stringify(lists))
    localStorage.setItem("items", JSON.stringify(items))
}

/**
 * Loads lists and items from localStorage and renders the UI.
 */
function loadLists() {

    const loadedLists = JSON.parse(localStorage.getItem("lists"))
    const loadedItems = JSON.parse(localStorage.getItem("items"))

    if(loadedLists != null)
        loadedLists.forEach(list => {
            // Rehydrate plain JSON entries into List instances to restore methods.
            lists.push(new List(list.name, list.id, list.items))
        });

    if(loadedItems != null)
        items = loadedItems

    console.log(lists, items)

    renderListCards()
    renderItemCards()
}