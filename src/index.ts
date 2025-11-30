// крок 1: визначення усіх типів
type BaseProduct = {
    id: number;
    name: string;
    price: number;
    inStock: boolean;
};

type Electronics = BaseProduct & {
    category: "electronics";
    warrantyMonths: number;
};

type Clothes = BaseProduct & {
    category: "clothes";
    size: string;
};

type Book = BaseProduct & {
    category: "book";
    author: string;
};



// крок 2
// пошук товару за ID
const findProduct = <T extends BaseProduct>(products: T[], id: number): T | undefined => {
    if (!Array.isArray(products)) {
        console.error("findProduct error: products is not an array");
        return undefined;
    }
    return products.find((p) => p.id === id);
};

// фільтр за ціною
const filterByPrice = <T extends BaseProduct>(products: T[], maxPrice: number): T[] => {
    if (!Array.isArray(products)) return [];
    if (typeof maxPrice !== "number") return [];
    return products.filter((p) => p.price <= maxPrice);
};



// крок 3
// елемент кошика
type CartItem<T> = {
    product: T;
    quantity: number;
};

// додавання товару
const addToCart = <T extends BaseProduct>(cart: CartItem<T>[], product: T | undefined, quantity: number): CartItem<T>[] => {
    if (!product) {
        console.error("addToCart error: product is undefined");
        return cart;
    }

    if (quantity <= 0) {
        console.error("addToCart error: quantity must be > 0");
        return cart;
    }

    const existing = cart.find((c) => c.product.id === product.id);
    if (existing) {
        existing.quantity += quantity;
        return cart;
    }

    return [...cart, { product, quantity }];
};

// підрахунок загальної вартості
const calculateTotal = <T extends BaseProduct>(cart: CartItem<T>[]): number => {
    return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
};


// крок 4: тести
const electronics: Electronics[] = [
    {
        id: 1,
        name: "Samsung Galaxy S21 FE 5G",
        price: 21000,
        category: "electronics",
        inStock: true,
        warrantyMonths: 24,
    },
    {
        id: 2,
        name: "Dell Vostro 15 3000",
        price: 34000,
        category: "electronics",
        inStock: true,
        warrantyMonths: 36,
    },
    {
        id: 3,
        name: "Razor DeathAdder Essential",
        price: 5000,
        category: "electronics",
        inStock: true,
        warrantyMonths: 18,
    },
];

const clothes: Clothes[] = [
    {
        id: 10,
        name: "Pants",
        price: 40,
        category: "clothes",
        inStock: true,
        size: "L",
    },
    {
        id: 11,
        name: "Jacket",
        price: 1600,
        category: "clothes",
        inStock: false,
        size: "XL",
    },
];

const books: Book[] = [
    {
        id: 20,
        name: "Harry Potter - The Anthology",
        price: 7000,
        category: "book",
        inStock: true,
        author: "J. K. Rowling",
    },
    {
        id: 21,
        name: "1984",
        price: 300,
        category: "book",
        inStock: true,
        author: "George Orwell",
    },
];

console.log("Item search:");
const phone = findProduct(electronics, 1);
console.log("Found:\n", phone);

console.log("\nFilter electronics with price under 15000:");
console.log(filterByPrice(electronics, 15000));

console.log("\nCreating cart...");
let cart: CartItem<BaseProduct>[] = [];
cart = addToCart(cart, phone, 1);
cart = addToCart(cart, findProduct(books, 20), 2);
cart = addToCart(cart, findProduct(clothes, 10), 3);

console.log("Cart:", cart);

const total = calculateTotal(cart);
console.log("\nTotal checkout sum: ", total);