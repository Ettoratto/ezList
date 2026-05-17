lists = []
items = []

let currentListSort = "recent"
let currentItemSort = "recent"
let isListSortInverted = false
let isItemSortInverted = false

/**
 * Represents a shopping list and the related item ids.
 */
class List {

    constructor(name, id, items) {

        this.name = name
        this.items = items || []
        this.isSelected = false
        
        const [part1, part2, part3] = crypto.randomUUID().split("-")
        const newId = part1 + part2 + part3
        this.id = id || newId
        
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
            const price = item ? parseFloat(item.price) || 0 : 0
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

/**
 * Gets a list by id using string comparison to normalize id types.
 * @param {string} id
 * @returns {List|undefined}
 */
function getListById(id){

   return lists.find(list => String(list.id).localeCompare(String(id)) == 0);
}

/**
 * Gets an item object by id.
 * @param {string} itemId
 * @returns {Object|undefined}
 */
function getItemById(itemId){

    return items.find(item => item.id == itemId)
}

function increaseItemWI(itemId){

    getItemById(itemId).wantedIndex++
}

function decreaseItemWI(itemId){

    getItemById(itemId).wantedIndex--
}


