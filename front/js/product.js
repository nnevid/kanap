// retrieve Item's Id from URL
let str = location.href;
let url = new URL (str);
const itemId = url.searchParams.get("id");

console.log(itemId)
// retrieve product's info from array
fetch(`http://127.0.0.1:3000/api/products/${itemId}`)
.then(function(response){
return response.json();
})

// Display product'infos on page according to HTML's structure
.then (function (products){
   
   const pictProduct = document.getElementsByClassName("item__img")[0];
  pictProduct.innerHTML= `<img src="${products.imageUrl}" alt="Photographie d'un canapé ${products.name}">`
   const nameProduct = document.getElementById("title");
  nameProduct.innerHTML= `${products.name}`
   const priceProduct = document.getElementById("price");
   priceProduct.innerHTML= `${products.price}`
   const descriptionProduct = document.getElementById("description");
   descriptionProduct.innerHTML= `${products.description}`;
   // colors input setup
   const colors = `${products.colors}`;
   let newArray = colors.split(',');
   const select = document.querySelector('select');
 for(var i = 0; i < newArray.length; i++){
     let opt = document.createElement('option')
      opt.value = newArray[i];
      opt.innerHTML = newArray[i];
      select.appendChild(opt);
   }
    
   itemName = `${products.name}`
   
})

.catch(function(err)  {
   let message = "La page que vous rechercher ne peut pas être affichée, erreur dans la base de données"
   alert(message)
   console.log(err)
   
})




//Shopping cart settings : empty variables to use afterwards and create user's arrays and objects
let productArray = [];

let userProduct = {};
userProduct.id = itemId;

//Create eventlistener's target's and retrieve value for Colors an quantity inputs
let addButton = document.querySelector("#addToCart")
let colorPicked = document.getElementById("colors");
let itemQuantity = document.querySelector(`input[id="quantity"]`);

//Create eventlistener's target's and retrieve value for Colors & Quantity
let colorItem = "";
colorPicked.addEventListener("change", function (opt) {

colorItem = colorPicked.options[colorPicked.selectedIndex].value
userProduct.color = colorItem;
console.log(colorItem)
// Reset to original values after "add to cart" click
addButton.style.backgroundColor ="#2c3e50";
addButton.textContent ="Ajouter au panier";
});
let itemAmount = '';
itemQuantity.addEventListener("input", function (qty) {
   
   itemAmount = qty.target.value;
   userProduct.quantity = parseInt(itemAmount);
   
   // Reset to original values after "add to cart" click
   addButton.style.backgroundColor ="#2c3e50";
   addButton.textContent ="Ajouter au panier";
   
});


// function to add a new product


//Eventlistener's from 'add to cart' button and conditons to validate
let addToCart = document.querySelector("#addToCart")
addToCart.addEventListener("click", function(){

if (
itemAmount === undefined ||   
itemAmount < 1 || 
itemAmount > 100 || 
colorItem === "" ||
colorItem === undefined

){
   alert ("Vous ne pouvez pas valider votre panier, renseignez au moins une couleur afin de valider votre panier et/ou une quantité comprise entre 1 et 100")
}
else{

   addButton.style.backgroundColor ="#044D29";
   addButton.textContent ="Produit ajouté avec succès !";
   addButton.addEventListener('mouseleave', function(){
   addButton.style.backgroundColor ="#2c3e50";
   addButton.textContent ="Ajouter au panier";
})
   // testing functions
    pushToArray();
    
}
});


function pushToArray(id, color) {
   let sameItem = productArray.find(it => it.id == userProduct.id && it.color == userProduct.color);
   if (sameItem != null){
   console.log(productArray);
   console.log(sameItem.quantity);
   sameItem.quantity += userProduct.quantity;
   saveArray();   
    
    sameColor();
  
   
   }else{
   
    productArray.push(userProduct)
    userProduct={}
    userProduct.id = itemId;
    userProduct.color = colorItem;
    userProduct.quantity=parseInt(itemAmount);
    saveArray(userProduct);
    addedItem ();
    
    }
     // localStorage.setItem("Cart", JSON.stringify(productArray));
     
 }
//Save and retrieve the Cart's info in LS
function saveArray() {
   let cart = JSON.parse(localStorage.getItem("Cart")) || [];
   cart = [...productArray, userProduct];
   localStorage.setItem("Cart", JSON.stringify(productArray))
   console.log("save cart");
   
 }



//message to display after adding a product
function addedItem() {
   let div = document.createElement("div");
   div.style.backgroundColor = "#2c3e50";
   div.style.position ="absolute";
   div.style.top = "100px";
   div.style.padding = "30px"
   div.style.borderRadius = "25px"
   div.textContent =`Vous avez ajouté ${itemAmount} ${itemName}  ${colorItem} à votre panier` ;
   document.querySelector(".item__content__addButton").style.position ="relative";
   document.querySelector(".item__content__addButton").appendChild(div);
   window.setTimeout(function() {
      div.style.display ="none";
   }, 2000)
   
}

// warning message  if product is already in basket
function sameColor() {
   let div = document.createElement("div");
   div.style.backgroundColor = "#FF1D23";
   div.style.position ="absolute";
   div.style.top = "100px";
   div.style.padding = "30px"
   div.style.borderRadius = "25px"
   div.textContent =`ATTENTION: vous avez déjà ajouté cet article à votre panier` ;
   document.querySelector(".item__content__addButton").style.position ="relative";
   document.querySelector(".item__content__addButton").appendChild(div);
   window.setTimeout(function() {
      div.style.display ="none";
   }, 2500)
   
}






