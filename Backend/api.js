
var Pizza_List = require('./data/Pizza_List');

exports.getPizzaList = function(req, res) {
    res.send(Pizza_List);
};

exports.createOrder = function(req, res) {
    var order_info = req.body;
    console.log("Creating Order", order_info);
    var totalPrice =0;
    order_info.order.forEach(function (obj) {
        totalPrice+=obj.sum_price;
    });
    res.send({
        success: true,
        pizzas: order_info.order.length,
        priceOrder:totalPrice
    });
};