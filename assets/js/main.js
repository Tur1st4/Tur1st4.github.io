var inputSearch = document.getElementById("search")
var redButton = document.getElementById("red")
var greenButton = document.getElementById("green")

function loop(primary, second, list) {
    var temp_array = []

    list[primary].forEach(item => {
        temp_array.push(item[second]["name"])
    })

    return temp_array
}

function format_data(data) {
    var abilities = data["abilities"].toString().replaceAll(",", ", ")
    var types = data["types"].toString().replaceAll(",", ", ")
    var encounters = data["encounters"].toString().replaceAll(",", ", ")

    return `Name: ${data["name"]}<br><br>ID: ${data["id"]}<br><br>Height: ${data["height"]}<br><br>
    Weight: ${data["weight"]}<br><br>Abilities: ${abilities}<br><br>Types: ${types}<br><br>
    Locations area: ${encounters}`
}

function reset(text) {
    var text_info = document.getElementById("text_info")
    var image = document.getElementById("glass")

    text_info.innerHTML = text
    image.style.backgroundImage = "none"
    inputSearch.value = ""
}

redButton.addEventListener("click", function() {
    reset(text="Hello :)")
})

greenButton.addEventListener("click", function() {
    reset(text="Temos que pegar!!")
})

inputSearch.addEventListener("keyup", async function(event) {
    var key = event.key;

    if (key == "Enter") {
        var text_info = document.getElementById("text_info")

        $.ajax({
            type: 'GET',
            url: `https://pokeapi.co/api/v2/pokemon/${this.value}`,
            dataType: 'json',
        })
        .always(async function(res) {
            var types = loop(primary="types", second="type", list=res)
            var abilities = loop(primary="abilities", second="ability", data=res)
            
            $.ajax({
                type: 'GET',
                url: res["location_area_encounters"],
                dataType: 'json',
            })
            .always(function(response) {
                var encounters = []
                response.forEach(item => {
                    encounters.push(item["location_area"]["name"])
                })
        
                console.log(encounters)

                pokemon_data = {
                    "name": res["name"],
                    "id": res["id"],
                    "height": res["height"],
                    "weight": res["weight"],
                    "types": types,
                    "abilities": abilities,
                    "encounters":  encounters,
                    "artwork": res["sprites"]["other"]["official-artwork"]["front_default"]
                }
        
                var text = format_data(data=pokemon_data)
                var image = document.getElementById("glass")
    
                text_info.innerHTML = text
                image.style.backgroundImage = `url(${pokemon_data["artwork"]})`
            })
        })
        .fail(function() {
            reset(text="Not found")
        })
    }
})