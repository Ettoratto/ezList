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
 
    let loadedLists = JSON.parse(localStorage.getItem("lists"))
    let loadedItems = JSON.parse(localStorage.getItem("items"))
  
    const exampleLists = [{"name":"Lista della spesa","items":[],"isSelected":false,"id":"e4b8a1f7c2d93e50"},{"name":"Cose da fare","items":[],"isSelected":false,"id":"7f2c9b4a1e8d5306"},{"name":"Film da vedere","items":[],"isSelected":false,"id":"b3a10f8e4c7d9265"},{"name":"Libri da comprare","items":[],"isSelected":false,"id":"9c8b7a6f5e4d3c2b"},{"name":"Regali di compleanno","items":[],"isSelected":false,"id":"1a2b3c4d5e6f7a8b"},{"name":"Appunti università","items":[],"isSelected":false,"id":"f1e2d3c4b5a69788"},{"name":"Progetti personali","items":[],"isSelected":false,"id":"554433221100ffaa"},{"name":"Materiale ferramenta","items":[],"isSelected":false,"id":"aa99bb88cc77dd66"},{"name":"Preparativi viaggio","items":[],"isSelected":false,"id":"1029384756abcdef"},{"name":"Lista desideri","items":[],"isSelected":false,"id":"fedcba9876543210"}]
    const exampleItems = [{"id":"1122334455667788","name":"Pasta Spaghetti","weight":"500g","qty":"3","price":"1.20","priceKG":"2.40","type":"Alimentari","brand":"Barilla","wantedIndex":0},{"id":"2233445566778899","name":"Latte Intero","weight":"1L","qty":"6","price":"1.50","priceKG":"1.50","type":"Latticini","brand":"Granarolo","wantedIndex":0},{"id":"33445566778899aa","name":"Passata di Pomodoro","weight":"700g","qty":"4","price":"1.10","priceKG":"1.57","type":"Conserve","brand":"Mutti","wantedIndex":0},{"id":"445566778899aabb","name":"Biscotti Gocciole","weight":"500g","qty":"1","price":"2.50","priceKG":"5.00","type":"Dolci","brand":"Pavesi","wantedIndex":0},{"id":"5566778899aabbcc","name":"Caffè Macinato","weight":"250g","qty":"2","price":"3.00","priceKG":"12.00","type":"Bevande","brand":"Lavazza","wantedIndex":0},{"id":"66778899aabbccdd","name":"Olio Extra Vergine","weight":"1L","qty":"1","price":"7.50","priceKG":"7.50","type":"Condimenti","brand":"Monini","wantedIndex":0},{"id":"778899aabbccddee","name":"Acqua Naturale","weight":"1.5L","qty":"12","price":"0.30","priceKG":"0.20","type":"Bevande","brand":"Sant'Anna","wantedIndex":0},{"id":"8899aabbccddeeff","name":"Mele Golden","weight":"1Kg","qty":"1","price":"2.20","priceKG":"2.20","type":"Ortofrutta","brand":"Marlene","wantedIndex":0},{"id":"99aabbccddeeff00","name":"Zucchero Semolato","weight":"1Kg","qty":"2","price":"1.00","priceKG":"1.00","type":"Alimentari","brand":"Eridania","wantedIndex":0},{"id":"aabbccddeeff0011","name":"Detersivo Piatti","weight":"1L","qty":"1","price":"1.80","priceKG":"1.80","type":"Pulizia","brand":"Svelto","wantedIndex":0}]

    // If storage is empty, save the examples and assign them to be loaded
    if(loadedLists == null) {
        localStorage.setItem("lists", JSON.stringify(exampleLists))
        loadedLists = exampleLists
    }

    if(loadedItems == null) {
        localStorage.setItem("items", JSON.stringify(exampleItems))
        loadedItems = exampleItems
    }

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
