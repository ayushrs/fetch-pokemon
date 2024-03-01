// //Fetch data



// async function fetchData(){
//     try{
//         const pokemonName = document.getElementById("pokemonName").value.toLowerCase();
//         const responce = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
    
//     if(!responce.ok){
//         throw new Error("could nt")
//     }

//     const  data = await responce.json() ;
//     const pokemonSprite = data.sprites.front_default;
//     const imgElement = document.getElementById("pokemonSprite")

//     imgElement.src = pokemonSprite;
//     imgElement.style.display = "block"
//     }
//     catch(error){
//         console.error(error)
//     }
// }




///////////AI INTERGRATED CODE///////////


// Fetch data
async function fetchData() {
    try {
        const pokemonName = document.getElementById("pokemonName").value.toLowerCase();

        // Find closest match to the entered Pokémon name
        const closestMatch = await findClosestPokemonName(pokemonName);
        if (closestMatch) {
            // Automatically correct the spelling
            document.getElementById("pokemonName").value = closestMatch;
        }

        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${closestMatch || pokemonName}`);
        if (!response.ok) {
            throw new Error("Failed to fetch Pokémon data");
        }

        const data = await response.json();
        const pokemonSprite = data.sprites.front_default;
        const imgElement = document.getElementById("pokemonSprite");

        imgElement.src = pokemonSprite;
        imgElement.style.display = "block";
    } catch (error) {
        console.error(error);
    }
}

// Function to find closest match to the entered Pokémon name
async function findClosestPokemonName(name) {
    try {
        const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1118");
        if (!response.ok) {
            throw new Error("Failed to fetch Pokémon list");
        }

        const pokemonData = await response.json();
        const pokemonNames = pokemonData.results.map(pokemon => pokemon.name);
        
        // Find closest match using Levenshtein distance
        let closestMatch = "";
        let minDistance = Number.MAX_VALUE;
        for (const pokemon of pokemonNames) {
            const distance = levenshteinDistance(name, pokemon);
            if (distance < minDistance) {
                closestMatch = pokemon;
                minDistance = distance;
            }
        }
        return closestMatch;
    } catch (error) {
        console.error(error);
        return null;
    }
}

// Function to calculate Levenshtein distance between two strings
function levenshteinDistance(s1, s2) {
    const len1 = s1.length;
    const len2 = s2.length;
    const matrix = [];

    // Initialize matrix
    for (let i = 0; i <= len1; i++) {
        matrix[i] = [i];
    }
    for (let j = 0; j <= len2; j++) {
        matrix[0][j] = j;
    }

    // Calculate Levenshtein distance
    for (let i = 1; i <= len1; i++) {
        for (let j = 1; j <= len2; j++) {
            const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
            matrix[i][j] = Math.min(
                matrix[i - 1][j] + 1,      // deletion
                matrix[i][j - 1] + 1,      // insertion
                matrix[i - 1][j - 1] + cost // substitution
            );
        }
    }

    return matrix[len1][len2];
}
