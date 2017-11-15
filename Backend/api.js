var LIQPAY_PUBLIC_KEY = "i38055554028";
var LIQPAY_PRIVATE_KEY = "HAEOxYQmJwZNf8vyGHxWes1kKzqzDdVSts3qxWPu";
var Pizza_List = require('./data/Pizza_List');

var crypto	=	require('crypto');
function	sha1(string)	{
    var sha1	=	crypto.createHash('sha1');
    sha1.update(string);
    return	sha1.digest('base64');
}

function	base64(str)	 {
    return	new	Buffer(str).toString('base64');
}


exports.getPizzaList = function(req, res) {
    res.send(Pizza_List);
};

exports.createOrder = function(req, res) {
    var order_info = req.body;
    var totalPrice =0;
    var list_pizza ="Список замовлених піц :\n";
    order_info.order.forEach(function (obj) {
        totalPrice+=obj.sum_price;
        if(obj.size=="big_size"){
            list_pizza+=obj.pizza.title+" (Велика) - " +obj.quantity +"шт. \n";
        }else{
            list_pizza+=obj.pizza.title+" (Мала) - " +obj.quantity +"шт. \n";
        }

    });

    var description ="Ім'я клієнта: "+order_info.name +"\nНомер телефону: "+order_info.phone +"\nАдреса доставки: "+order_info.address+"\n";

    var order	=	{
        version:	3,
        public_key:	LIQPAY_PUBLIC_KEY,
        action:	"pay",
        amount:	totalPrice,
        currency:	"UAH",
        description: description+list_pizza,
        order_id:	Math.random(),
//!!!Важливо щоб було 1,	бо інакше візьме гроші!!!
        sandbox:	1
    };

    var data	=	base64(JSON.stringify(order));
    var signature	=	sha1(LIQPAY_PRIVATE_KEY	+	data	+	LIQPAY_PRIVATE_KEY);



    res.send({
        success: true,
        data: data,
        signature: signature
    });
};