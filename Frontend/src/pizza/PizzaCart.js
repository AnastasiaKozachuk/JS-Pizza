var Pizza_List = require('../Pizza_List');
var Templates = require('../Templates');
var Storage = require('./Storage');
//Перелік розмірів піци
var PizzaSize = {
    Big: "big_size",
    Small: "small_size"
};

//Змінна в якій зберігаються перелік піц в кошику
var Cart = [];

//HTML едемент куди будуть додаватися піци
var $cart = $("#cart");


function addToCart(pizza, size) {

    var exist = false;
    Cart.forEach(function (obj) {
        if(obj.pizza==pizza&&obj.size==size){
            exist = true;
            obj.quantity += 1;
        }
    });

    if(!exist) {
        Cart.push({
            pizza: pizza,
            size: size,
            quantity: 1,
            sum_price: 0,
        });
    }
        updateCart();


}



$("#clear").click(function(){
    Cart = [];
    updateCart();
});



function initialiseCart() {
    //Фукнція віпрацьвуватиме при завантаженні сторінки
    //Тут можна наприклад, зчитати вміст корзини який збережено в Local Storage то показати його
    var saved_cart = Storage.read("cart");
    if(saved_cart){
        Cart = saved_cart;
    }

    updateCart();
}

function getPizzaInCart() {
    //Повертає піци які зберігаються в кошику
    return Cart;
}

function someNote(){
    if(Cart.length==0){
        $cart.html("<div  id=\"emptySpace\">\n" +
            "            <div>Пусто в холодильнику?</div>\n" +
            "            <div>Замовте піцу!</div>\n" +
            "        </div>");
        $("#active-order").prop("disabled", true);
        $( "#bottom-id").addClass('bottom-part-sec-vers');
    }else {
        $("#active-order").prop("disabled", false);
        $("#bottom-id").removeClass('bottom-part-sec-vers');

    }
}

function show_price(){
    var sum_price=0;
    Cart.forEach(function (obj) {
        sum_price+=obj.sum_price;
    });
    $(".all-price").text(sum_price);
}

function updateCart() {

    Storage.write("cart",Cart);

    $cart.html("");
    $(".amount-right").text(Cart.length);
    someNote();

    function showOnePizzaInCart(cart_item,numb) {
        var html_code = Templates.PizzaCart_OneItem(cart_item);

        var $node = $(html_code);


        function computePrice(){
            cart_item.sum_price=cart_item.pizza[cart_item.size].price*cart_item.quantity;
            show_price();
        };
        computePrice();
        $node.find(".plus").click(function(){
            cart_item.quantity += 1;
            computePrice();
            updateCart();

        });

        $node.find(".minus").click(function(){

            if(cart_item.quantity>1){
                cart_item.quantity -= 1;
            }else{
                Cart.splice(numb,1);
            }
            computePrice();
            updateCart();
        });

        $node.find(".remove").click(function() {
            Cart.splice(numb, 1);
            updateCart();
        });

        $cart.append($node);
    }

    Cart.forEach(showOnePizzaInCart);

}


exports.addToCart = addToCart;

exports.getPizzaInCart = getPizzaInCart;
exports.initialiseCart = initialiseCart;

exports.PizzaSize = PizzaSize;