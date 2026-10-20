const imageUrl = "https://images.dog.ceo/breeds/sheepdog-shetland/n02105855_19002.jpg"; 
const imgElement = document.getElementById("image");

async function getData() {
  const url = imageUrl;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const blob = await response.blob();

    let imgURL = URL.createObjectURL(blob);
    imgElement.src = imgURL;

  } catch (error) {
    console.error(error.message);

  }
}

getData()
