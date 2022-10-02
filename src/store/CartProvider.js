import CartContext from "./cart-context";
import { useReducer } from "react";

const defaultCartState = {
  items: [],
  totalAmount: 0,
};

function cartReducer(state, action) {
  if (action.type === "ADD_ITEM") {
    const updatedTotalAmount =
      state.totalAmount + action.item.price * action.item.amount;

    const exsitingCartItemIndex = state.items.findIndex(
      (item) => item.id === action.item.id
    );

    const exsitingCartItem = state.items[exsitingCartItemIndex];

    let updatedItems;

    if (exsitingCartItem) {
      const updatedItem = {
        ...exsitingCartItem,
        amount: exsitingCartItem.amount + action.item.amount,
      };
      updatedItems = [...state.items];
      updatedItems[exsitingCartItemIndex] = updatedItem;
    } else {
      updatedItems = state.items.concat(action.item);
    }

    return {
      items: updatedItems,
      totalAmount: updatedTotalAmount,
    };
  }

  if (action.type === "REMOVE_ITEM") {
    const exsitingCartItemIndex = state.items.findIndex(
      (item) => item.id === action.id
    );

    const exsitingItem = state.items[exsitingCartItemIndex];
    const updatedTotalAmount = state.totalAmount - exsitingItem.price;
    let updatedItems;
    if (exsitingItem.amount === 1) {
      updatedItems = state.items.filter((item) => item.id !== action.id);
    } else {
      const updatedItem = { ...exsitingItem, amount: exsitingItem.amount - 1 };
      updatedItems = [...state.items];
      updatedItems[exsitingCartItemIndex] = updatedItem;
    }

    return {
      items: updatedItems,
      totalAmount: updatedTotalAmount,
    };
  }
}

function CartProvider(props) {
  const [cartState, dispatchCartAction] = useReducer(
    cartReducer,
    defaultCartState
  );

  function addItemToCartHandler(item) {
    dispatchCartAction({ type: "ADD_ITEM", item: item });
  }

  function removeItemFromCartHandler(id) {
    dispatchCartAction({ type: "REMOVE_ITEM", id: id });
  }

  const cartContext = {
    items: cartState.items,
    totalAmount: cartState.totalAmount,
    addItem: addItemToCartHandler,
    removeItem: removeItemFromCartHandler,
  };

  return (
    <CartContext.Provider value={cartContext}>
      {props.children}
    </CartContext.Provider>
  );
}

export default CartProvider;
