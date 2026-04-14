import { create } from 'zustand';

const useCartStore = create((set) => ({
    cartItems: localStorage.getItem('cartItems')
        ? JSON.parse(localStorage.getItem('cartItems'))
        : [],

    addToCart: (product, qty, size) => {
        set((state) => {
            const existItem = state.cartItems.find(
                (x) => x.product === product._id && x.size === size
            );

            let newCartItems;
            if (existItem) {
                newCartItems = state.cartItems.map((x) =>
                    x.product === product._id && x.size === size
                        ? { ...x, qty: x.qty + qty }
                        : x
                );
            } else {
                newCartItems = [
                    ...state.cartItems,
                    {
                        product: product._id,
                        name: product.name,
                        image: product.images[0],
                        price: product.price,
                        stock: product.stock,
                        qty,
                        size,
                    },
                ];
            }
            localStorage.setItem('cartItems', JSON.stringify(newCartItems));
            return { cartItems: newCartItems };
        });
    },

    removeFromCart: (id, size) => {
        set((state) => {
            const newCartItems = state.cartItems.filter(
                (x) => !(x.product === id && x.size === size)
            );
            localStorage.setItem('cartItems', JSON.stringify(newCartItems));
            return { cartItems: newCartItems };
        });
    },

    clearCart: () => {
        localStorage.removeItem('cartItems');
        set({ cartItems: [] });
    },
}));

export default useCartStore;
