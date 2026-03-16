function createNewList() {

    let listName = document.getElementById("new-list-name-input").value
    if(listName == "")
        listName = "Nuova lista"

    const newList = new List(listName) 
    lists.push(newList)

    closeNewListPopup()
    saveLists()
    renderSingleListCard(newList)
}

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
    let itemId = part1 + part2 + part3

    const item = {id: itemId, name: itemName, weight: itemWeight, qty: itemQty, price: itemPrice, priceKG: itemPriceKG, type: itemType, brand: itemBrand, wantedIndex: 0}

    items.push(item)

    closeNewItemPopup()
    saveLists()
    renderSingleItemCard(item)
}

function viewList(id){

    let card = document.getElementById(id)

    if(card.classList.contains("selected-list-card")){
        card.classList.remove("selected-list-card")
        renderItemCards()
    }else{

        for(let i = 0; i < lists.length; i++){
            if(document.getElementById(lists[i].id).classList.contains("selected-list-card")){
                document.getElementById(lists[i].id).classList.remove("selected-list-card")
                break
            }
        } 
        card.classList.add("selected-list-card")   
        renderItemCards(id)
    }

    
}

async function addItemToList(itemId) {

    const listId = await showListSelection()
    if (!listId) return

    let selectedList = lists.find(l => l.id === listId)
    selectedList.addItem(itemId)

    console.log("lists: " + lists)
    
    renderListCards()
    saveLists()

    document.getElementById("list-selection").style.display = "none"
}
