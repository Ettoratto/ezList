"use strict"

let lists = []
let items = []

let currentListSort = "recent"
let currentItemSort = "recent"
let isListSortInverted = false
let isItemSortInverted = false

function createCompactId(){

    return crypto.randomUUID().replaceAll("-", "")
}

/**
 * Represents a shopping list and the related item ids.
 */
class List {

    constructor(name, id, items) {

        this.name = name
        this.items = items || []
        this.isSelected = false
        
        this.id = id || createCompactId()
        
    }


    /**
     * Adds an item id to the list only if not already present.
     * @param {string} itemId
     */
    addItem(itemId) {

        if(!this.items.includes(itemId))
            this.items.push(itemId)   
    }

    /**
     * Finds an item id inside this list.
     * @param {string} itemId
     * @returns {string|undefined}
     */
    findItemById(itemId){

        return this.items.find(id => id === itemId)
    }

    /**
     * Removes an item id from the list.
     * @param {string} item
     */
    removeItem(item){

        this.items.splice(this.items.indexOf(item), 1)
    }

    /**
     * Returns the raw item id array for this list.
     * @returns {string[]}
     */
    getItemsArray(){

        return this.items
    }

    /**
     * Sums the numeric price of each linked item.
     * @returns {number}
     */
    getTotalCost() {

        let total = 0
        this.items.forEach(itemId => {
            
            const item = getItemById(itemId)
            const priceValue = item ? (item.getPrice ? item.getPrice() : item.price) : 0
            const price = parseFloat(priceValue) || 0
            total += price
        })

        return total
    }

    /**
     * Returns how many items are attached to this list.
     * @returns {number}
     */
    getItemsCount(){

        return this.items.length
    }

    /**
     * Toggles list selection state.
     */
    toggleListSelection(){

        this.isSelected = !this.isSelected
    }

    getId(){

        return this.id
    }

}

class Item {

    constructor(name, weight, qty, price, priceKG, type, brand, id, wantedIndex = 0){

        this.name = name
        this.weight = weight
        this.qty = qty
        this.price = price
        this.priceKG = priceKG
        this.type = type
        this.brand = brand
        this.wantedIndex = wantedIndex
        
        this.id = id || createCompactId()
        
    }

    getName(){

        return this.name
    }

    setName(name){

        this.name = name
    }

    getWeight(){

        return this.weight
    }

    setWeight(weight){

        this.weight = weight
    }

    getQty(){

        return this.qty
    }

    setQty(qty){

        this.qty = qty
    }

    getPrice(){

        return this.price
    }

    setPrice(price){

        this.price = price
    }

    getPriceKG(){

        return this.priceKG
    }

    setPriceKG(priceKG){

        this.priceKG = priceKG
    }

    getType(){

        return this.type
    }

    setType(type){

        this.type = type
    }

    getBrand(){

        return this.brand
    }

    setBrand(brand){

        this.brand = brand
    }

    getId(){

        return this.id
    }   

    setId(id){

        this.id = id
    }

    getWantedIndex(){

        return this.wantedIndex
    }

    setWantedIndex(wantedIndex){

        this.wantedIndex = wantedIndex
    }

    
}

/**
 * Gets a list by id using string comparison to normalize id types.
 * @param {string} id
 * @returns {List|undefined}
 */
function getListById(id){

    return lists.find(list => String(list.id) === String(id))
}

/**
 * Gets an item object by id.
 * @param {string} itemId
 * @returns {Object|undefined}
 */
function getItemById(itemId){

    return items.find(item => String(item.id) === String(itemId))
}

function increaseItemWI(itemId){

    const item = getItemById(itemId)

    if(item)
        item.setWantedIndex((item.getWantedIndex ? item.getWantedIndex() : item.wantedIndex) + 1)
}

function decreaseItemWI(itemId){

    const item = getItemById(itemId)

    if(item)
        item.setWantedIndex((item.getWantedIndex ? item.getWantedIndex() : item.wantedIndex) - 1)
}


