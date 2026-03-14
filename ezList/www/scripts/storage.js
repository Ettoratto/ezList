function saveLists() {

    localStorage.setItem("lists", JSON.stringify(lists))
    localStorage.setItem("items", JSON.stringify(items))
}

function loadLists() {

    const loadedLists = JSON.parse(localStorage.getItem("lists"))
    const loadedItems = JSON.parse(localStorage.getItem("items"))

    if(loadedLists != null)
        loadedLists.forEach(list => {
            lists.push(new List(list.name, list.id, list.items))
        });

    if(loadedItems != null)
        items = loadedItems

    console.log(lists, items)

    renderListCards()
    renderItemCards()
}