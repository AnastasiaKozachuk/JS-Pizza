var API = require('../API');
var Templates = require('../Templates');
var PizzaCart = require('./PizzaCart');
var Pizza_List = {};

//HTML едемент куди будуть додаватися піци
var $pizza_list = $("#pizza_list");

function showPizzaList(list) {
    //Очищаємо старі піци в кошику
    $pizza_list.html("");

    //Онволення однієї піци
    function showOnePizza(pizza) {
        var html_code = Templates.PizzaMenu_OneItem({pizza: pizza});

        var $node = $(html_code);

        $node.find(".buy-big").click(function(){
                PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Big);
        });
        $node.find(".buy-small").click(function(){
                PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Small);

        });

        $pizza_list.append($node);
    }

    list.forEach(showOnePizza);
}

function filterPizza(filter) {
    //Масив куди потраплять піци які треба показати
    var pizza_shown = [];
    var numbOfPizza = 0;
    Pizza_List.forEach(function(pizza){
        if(pizza.type==String(filter)){
            pizza_shown.push(pizza);
            numbOfPizza++;
        }else if (String(filter)=="all"){
            pizza_shown.push(pizza);
            numbOfPizza++;
        }else if(String(filter)==pizza.content.pineapple){
            pizza_shown.push(pizza);
            numbOfPizza++;
        }else if(String(filter)==pizza.content.mushroom){
            pizza_shown.push(pizza);
            numbOfPizza++;
        }

    });

    //Показати відфільтровані піци
    showPizzaList(pizza_shown);
    $(".amount").text( numbOfPizza);
}

function deleteActive(){
    $("#all").removeClass("active");
    $("#meat").removeClass("active");
    $("#pineapple").removeClass("active");
    $("#mushrooms").removeClass("active");
    $("#seafood").removeClass("active");
    $("#vega").removeClass("active");
}

$("#all").click(function(){
    deleteActive();
    $("#all").addClass("active");
    $("#all").removeClass("new-but");
    $("#meat").addClass("new-but");
    $("#pineapple").addClass("new-but");
    $("#mushrooms").addClass("new-but");
    $("#seafood").addClass("new-but");
    $("#vega").addClass("new-but");
    $("#name-top-line").text("Усі піци");
    filterPizza('all');


});
$("#meat").click(function(){
    deleteActive();
    $("#meat").addClass("active");
    $("#meat").removeClass("new-but");
    $("#all").addClass("new-but");
    $("#pineapple").addClass("new-but");
    $("#mushrooms").addClass("new-but");
    $("#seafood").addClass("new-but");
    $("#vega").addClass("new-but");
    $("#name-top-line").text("М’ясні піци");
    filterPizza('М’ясна піца');

});

$("#pineapple").click(function(){
    deleteActive();
    $("#pineapple").addClass("active");
    $("#pineapple").removeClass("new-but");
    $("#all").addClass("new-but");
    $("#meat").addClass("new-but");
    $("#mushrooms").addClass("new-but");
    $("#seafood").addClass("new-but");
    $("#vega").addClass("new-but");
    $("#name-top-line").text("Піци з ананнасами");
    filterPizza('ананаси');
});
$("#mushrooms").click(function(){
    deleteActive();
    $("#mushrooms").addClass("active");
    $("#mushrooms").removeClass("new-but");
    $("#all").addClass("new-but");
    $("#meat").addClass("new-but");
    $("#pineapple").addClass("new-but");
    $("#seafood").addClass("new-but");
    $("#vega").addClass("new-but");
    $("#name-top-line").text("Піци з грибами ");
    filterPizza('шампінйони');
});
$("#seafood").click(function(){
    deleteActive();
    $("#seafood").addClass("active");
    $("#seafood").removeClass("new-but");
    $("#all").addClass("new-but");
    $("#meat").addClass("new-but");
    $("#pineapple").addClass("new-but");
    $("#mushrooms").addClass("new-but");
    $("#vega").addClass("new-but");
    $("#name-top-line").text("Піци з морепродуктами");
    filterPizza('Морська піца');
});
$("#vega").click(function(){
    deleteActive();
    $("#vega").addClass("active");
    $("#vega").removeClass("new-but");
    $("#all").addClass("new-but");
    $("#meat").addClass("new-but");
    $("#pineapple").addClass("new-but");
    $("#mushrooms").addClass("new-but");
    $("#seafood").addClass("new-but");
    $("#name-top-line").text("Вегетаріанські піци");
    filterPizza('Вега піца');
});

$("#next_step_order").click(function () {
    if(!($("#forAddr").hasClass("has-error")||$("#forName").hasClass("has-error")||$("#forTeleph").hasClass("has-error")))
        PizzaCart.createOrder(function (err, data) {
            var result ;
            if(err){
                alert("Can't create order.");
            }else{
                LiqPayCheckout.init({
                    data:	data.data,
                    signature:	data.signature,
                    embedTo:	"#liqpay",
                    mode:	"popup"	//	embed	||	popup
                }).on("liqpay.callback",	function(data){

                    result = data.result;

                }).on("liqpay.ready",	function(data){

                }).on("liqpay.close",	function(data){
                    if(result=="success"){
                        alert("Success!");
                    }else{
                        alert("Failure!");
                    }
                });


            }
        });
    });



function initialiseMenu() {

    API.getPizzaList(function (err,list) {
        if(err){
            alert("Can't load pizzas");
        }else{
            Pizza_List = list;
            showPizzaList(Pizza_List);
        }
    });

}


exports.filterPizza = filterPizza;
exports.initialiseMenu = initialiseMenu;