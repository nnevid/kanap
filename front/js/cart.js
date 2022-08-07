// Retrieve cart from LS and HTML structure
const cart = JSON.parse(localStorage.getItem("Cart"));
console.log(cart);
const cartItems = document.getElementById("cart__items");
let items = cart;
// Function to save cart 
function saveCart(basket){
  localStorage.setItem("Cart", JSON.stringify(basket));
}
// Function to get cart
function getCart(){
   return cart
}
// Function to delete items
function removeItem(id, color){
let basket =getCart();
for (i = 0; i < basket.length; i++){
   if(id === basket[i].id && color === basket[i].color){
      basket.splice(i, 1);
      saveCart(basket);
      window.location.reload();
      }  
   }
}

// Function to change quantity
function changeQuantity(id, color, amount){
   let basket =getCart();
   for (i = 0; i < basket.length; i++){
      if(id === basket[i].id && color === basket[i].color){
         basket[i].quantity = amount;      }
         saveCart(basket);
      window.location.reload();
   }
}
// Function to show cart from LS 
function showCart(){
   
   let price = 0;
   let itemsQuantity = 0;
if (localStorage.getItem("Cart") != null){
   // get info for each item from DB
   for (let i= 0; i< items.length; i++){
      let color = items[i].color
      let id = items[i].id
      let quantity = items[i].quantity
      let url = "http://127.0.0.1:3000/api/products/" + id;
      
      fetch(url)
      .then((response)=> response.json())
      .then((data)=>{
         itemsData = data
         cartItems.innerHTML += `<article class="cart__item" data-id="${id}" data-color="${color}">
                <div class="cart__item__img">
                  <img src="${data.imageUrl}" alt="${data.altTxt}">
                </div>
                <div class="cart__item__content">
                  <div class="cart__item__content__titlePrice">
                    <h2>${data.name}</h2>
                    <p>${color}</p>
                    <p>${data.price} €</p>
                  </div> <div class="cart__item__content__settings">
                  <div class="cart__item__content__settings__quantity">
                    <p>Qté : </p>
                    <input type="number" class="itemQuantity" name="itemQuantity" onchange="changeQuantity('${id}', '${color}', this.value)" min="1" max="100" value="${quantity}">
                  </div>
                  <div class="cart__item__content__settings__delete">
                    <p class="deleteItem" onclick="removeItem('${id}','${color}')">Supprimer</p>
                  </div>
                </div>
              </div>
            </article>`;
            price += data.price * items[i].quantity
            document.getElementById("totalPrice").innerHTML = price;
            
      });
      itemsQuantity += parseInt(items[i].quantity);
      document.getElementById("totalQuantity").innerHTML = itemsQuantity;
   }
}else{
   let title = document.getElementsByTagName("h1").innerHTML = `Votre Panier est vide`
   return title
}
}
showCart();

// Form settings to validate order with REGEXs

let lastName = document.getElementById("lastName");
let prenom = document.getElementById("firstName");
const ville = document.getElementById("city");
const adresse = document.getElementById("address");
const email = document.getElementById("email");

// First name validation, doesn't accept numbers
var firstNameValidation=function(){
   firstNameValue=prenom.value.trim(); 
   validFirstName=/^[ a-zA-ZÀ-ÿ\u00f1\u00d1]*$/g
   let firstNameErr=document.getElementById('firstNameErrorMsg');
   if(firstNameValue=="")
   {
    firstNameErr.innerHTML="Un prénom est nécessaire";
    return false
   }else if(!validFirstName.test(firstNameValue)){
     firstNameErr.innerHTML="Le Prénom doit être valide";
     return false
   }else{
     firstNameErr.innerHTML="";
     return true;
    
   }
}
prenom.oninput=function(){
   
   firstNameValidation();
}

// Last name validation doesn't accept numbers
var lastNameValidation=function(){
   lastNameValue=lastName.value.trim(); 
   validLastName=/^[ a-zA-ZÀ-ÿ\u00f1\u00d1]*$/g
   let lastNameErr=document.getElementById('lastNameErrorMsg');
   if(lastNameValue=="")
   {
    lastNameErr.innerHTML="Un nom de famille est nécessaire";
    return false
   }else if(!validLastName.test(lastNameValue)){
     lastNameErr.innerHTML="Le nom de famille doit être valide";
     return false
   }else{
     lastNameErr.innerHTML="";
     return true;
    
   }
}
lastName.oninput=function(){
   
  lastNameValidation();
}

// Address validation, special format to fit : 11, exemple street

var address=function(){
   addressValue=adresse.value.trim(); 
   validAddress=/^[0-9A-Za-z\u00C0-\u017F\ ,.\;'\-()\s]{5,50}$/
   let addressErr=document.getElementById('addressErrorMsg');
   if(addressValue=="")
   {
    addressErr.innerHTML="Veuillez reinsegner votre adresse";
    return false
   }else if(!validAddress.test(addressValue)){
     addressErr.innerHTML="Veuillez renseigner une adresse au format: 11, rue exemple";
     return false
   }else{
     addressErr.innerHTML="";
     return true;
    
   }
}
adresse.oninput=function(){
   
  address();
}
// City validation, doesn't accept numbers but accepts special characters
var cityValid=function(){
   cityValue=ville.value.trim(); 
   validCity=/^[a-zA-Z\u00C0-\u017F]+(?:[\s-][a-zA-Z\u00C0-\u017F]+)*$/
   let cityErr=document.getElementById('cityErrorMsg');
   if(cityValue=="")
   {
    cityErr.innerHTML="Veuillez reinsegner votre ville";
    return false
   }else if(!validCity.test(cityValue)){
     cityErr.innerHTML="Veuillez renseigner une ville valide";
     return false
   }else{
     cityErr.innerHTML="";
     return true;
    
   }
}
ville.oninput=function(){
   
  cityValid();
}

// Mail validation
var mail=function(){
   mailValue=email.value.trim(); 
   validMail=/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
   let mailErr=document.getElementById('emailErrorMsg');
   if(mailValue=="")
   {
    mailErr.innerHTML="Veuillez reinsegner votre email";
    return false
   }else if(!validMail.test(mailValue)){
     mailErr.innerHTML="Veuillez renseigner un email valide";
     return false
   }else{
     mailErr.innerHTML="";
     return true;
    
   }
}
email.oninput=function(){
   
  mail();
}
// User form array creation
function createContact(){
   let contact = {
      firstName : prenom.value,
      lastName : lastName.value,
      address : adresse.value,
      city : ville.value,
      email: email.value,
   };
   let items = getCart();
   let products =[];
   for(i = 0; i < items.length; i++){
     if (products.find((e)=> e == items[i].id)){
         console.log(items[i].id)
      }else{
         products.push(items[i].id);
      }
   }
   let contactId = JSON.stringify({contact, products});
   return contactId;
}
const host = "http://127.0.0.1:3000/"
const postUrl = host + "api/products/order/";
const orderButton = document.getElementById("order");
//  Order button function config with "POST" method
orderButton.addEventListener("click", (e) => {
   e.preventDefault();
   
   let firstName = firstNameValidation();
   let lastname = lastNameValidation();
   let city = cityValid();
   let Email = mail();
   if(Email == false || firstName == false || lastname == false || city == false){
      alert("Funciona o no")
      return false;      
   }else{
      let formConfirm = createContact();
fetch(postUrl, {
   method: "POST",
   headers: {
      "Content-Type" : "application/json",
   },
   body: formConfirm,
})
// Retrieve id info from database
.then((res)=> res.json())
.then((data)=> {
   localStorage.clear();
   let confirmationPage = "./confirmation.html?id=" + data.orderId;
   window.location.href = confirmationPage;
})
.catch(()=>{
   console.log("erreur sur la base de données")
   });
      
   }



});