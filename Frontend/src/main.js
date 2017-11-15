
$(function(){

    var PizzaMenu = require('./pizza/PizzaMenu');
    var PizzaCart = require('./pizza/PizzaCart');


    PizzaCart.initialiseCart();
    PizzaMenu.initialiseMenu();


});

require("./googleMaps");