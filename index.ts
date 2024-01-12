class PricingRules {
    private rules: Map<string, Rule>;

    constructor() {
        this.rules = new Map<string, Rule>();
    }

    addRule(sku: string, rule: Rule) {
        this.rules.set(sku, rule);
    }

    getRule(sku: string): Rule | undefined {
        return this.rules.get(sku);
    }
}

class Checkout {
    private pricingRules: PricingRules;
    private cart: Map<string, number>;

    constructor(pricingRules: PricingRules) {
        this.pricingRules = pricingRules;
        this.cart = new Map<string, number>();
    }

    scan(sku: string) {
        const count = this.cart.get(sku) || 0;
        this.cart.set(sku, count + 1);
    }

    total() {
        let totalPrice = 0;

        this.cart.forEach((quantity, sku) => {
            const rule = this.pricingRules.getRule(sku);
            const price = getPrice(sku);

            if (rule) {
                totalPrice += rule.calculatePrice(quantity, price);
            } else {
                totalPrice += quantity * price;
            }
        });

        console.log(`Total expected: $${totalPrice.toFixed(2)}`);
    }
}

interface Rule {
    calculatePrice(quantity: number, price: number): number;
}

class BulkDiscountRule implements Rule {
    private threshold: number;
    private discountedPrice: number;

    constructor(threshold: number, discountedPrice: number) {
        this.threshold = threshold;
        this.discountedPrice = discountedPrice;
    }

    calculatePrice(quantity: number, price: number): number {
        if (quantity <= this.threshold) {
            return quantity * price;
        }
        return quantity * this.discountedPrice;
    }
}

class BuyXPayForYRule implements Rule {
    private x: number;
    private y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    calculatePrice(quantity: number, price: number): number {
        return this.y * price;
    }
}

function getPrice(sku: string): number {
    const prices: { [key: string]: number } = {
        ipd: 549.99,
        mbp: 1399.99,
        atv: 109.5,
        vga: 30.0,
    };

    return prices[sku] || 0;
}

const items: { sku: string; name: string; price: number }[] = [
    { sku: 'ipd', name: 'Super iPad', price: 549.99 },
    { sku: 'mbp', name: 'MacBook Pro', price: 1399.99 },
    { sku: 'atv', name: 'Apple TV', price: 109.5 },
    { sku: 'vga', name: 'VGA adapter', price: 30.0 },
];

const pricingRules = new PricingRules();

pricingRules.addRule(items[0].sku, new BulkDiscountRule(4, 499.99));
pricingRules.addRule(items[2].sku, new BuyXPayForYRule(3, 2));

const co = new Checkout(pricingRules);

co.scan('atv');
co.scan('ipd');
co.scan('ipd');
co.scan('atv');
co.scan('ipd');
co.scan('ipd');
co.scan('ipd');

co.total();

const co2 = new Checkout(pricingRules);

co2.scan('atv');
co2.scan('atv');
co2.scan('atv');
co2.scan('vga');

co2.total();