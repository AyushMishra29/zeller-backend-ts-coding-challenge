var PricingRules = /** @class */ (function () {
    function PricingRules() {
        this.rules = new Map();
    }
    PricingRules.prototype.addRule = function (sku, rule) {
        this.rules.set(sku, rule);
    };
    PricingRules.prototype.getRule = function (sku) {
        return this.rules.get(sku);
    };
    return PricingRules;
}());
var Checkout = /** @class */ (function () {
    function Checkout(pricingRules) {
        this.pricingRules = pricingRules;
        this.cart = new Map();
    }
    Checkout.prototype.scan = function (sku) {
        var count = this.cart.get(sku) || 0;
        this.cart.set(sku, count + 1);
    };
    Checkout.prototype.total = function () {
        var _this = this;
        var totalPrice = 0;
        this.cart.forEach(function (quantity, sku) {
            var rule = _this.pricingRules.getRule(sku);
            var price = getPrice(sku);
            if (rule) {
                totalPrice += rule.calculatePrice(quantity, price);
            }
            else {
                totalPrice += quantity * price;
            }
        });
        console.log("Total expected: $".concat(totalPrice.toFixed(2)));
    };
    return Checkout;
}());
var BulkDiscountRule = /** @class */ (function () {
    function BulkDiscountRule(threshold, discountedPrice) {
        this.threshold = threshold;
        this.discountedPrice = discountedPrice;
    }
    BulkDiscountRule.prototype.calculatePrice = function (quantity, price) {
        if (quantity <= this.threshold) {
            return quantity * price;
        }
        return quantity * this.discountedPrice;
    };
    return BulkDiscountRule;
}());
var BuyXPayForYRule = /** @class */ (function () {
    function BuyXPayForYRule(x, y) {
        this.x = x;
        this.y = y;
    }
    BuyXPayForYRule.prototype.calculatePrice = function (quantity, price) {
        return this.y * price;
    };
    return BuyXPayForYRule;
}());
function getPrice(sku) {
    var prices = {
        ipd: 549.99,
        mbp: 1399.99,
        atv: 109.5,
        vga: 30.0,
    };
    return prices[sku] || 0;
}
var items = [
    { sku: 'ipd', name: 'Super iPad', price: 549.99 },
    { sku: 'mbp', name: 'MacBook Pro', price: 1399.99 },
    { sku: 'atv', name: 'Apple TV', price: 109.5 },
    { sku: 'vga', name: 'VGA adapter', price: 30.0 },
];
var pricingRules = new PricingRules();
pricingRules.addRule(items[0].sku, new BulkDiscountRule(4, 499.99));
pricingRules.addRule(items[2].sku, new BuyXPayForYRule(3, 2));
var co = new Checkout(pricingRules);
co.scan('atv');
co.scan('ipd');
co.scan('ipd');
co.scan('atv');
co.scan('ipd');
co.scan('ipd');
co.scan('ipd');
co.total();
var co2 = new Checkout(pricingRules);
co2.scan('atv');
co2.scan('atv');
co2.scan('atv');
co2.scan('vga');
co2.total();
