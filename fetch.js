const imageUrl = "https://images.dog.ceo/breeds/sheepdog-shetland/n02105855_19002.jpg"; 
const imgElement = document.getElementById("image");

fetch(imageUrl)
    .then(response => response.blob()) 
    .then(blob => {
        let imgURL = URL.createObjectURL(blob);
        imgElement.src = imgURL;
    })
    .catch(error => console.error("Error fetching image:", error));