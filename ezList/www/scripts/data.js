let lists = []
let items = []

class List {

    constructor(name, id, items = []) {

        this.name = name
        if(id == null)
            this.id = crypto.randomUUID().split("-")[0]
        else
            this.id = id
        this.items = items
    }

    getRealItems() {
        
        return this.items.map(id => items[id])
    }

    addItem(itemId) {

        if(!this.items.includes(itemId))
            this.items.push(itemId)   
    }

    findItemById(itemId){

        return this.items.find(id => id === itemId)
    }

    removeItem(item){

        this.items.splice(this.items.indexOf(item), 1)
    }

    getItemsArray(){

        return this.items
    }

    getTotalCost() {

        let total = 0
        this.items.forEach(itemId => {
            
            const price = parseFloat(getItemsById(itemId).price) || 0
            total += price
        });

        return total
    }

    getItemsCount(){

        return this.items.length
    }

}

function getListById(id){

   return lists.find(list => String(list.id).localeCompare(String(id)) == 0);
}

function getItemsById(itemId){

    return items.find(item => item.id == itemId)
}