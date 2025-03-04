import { createStore } from 'redux';

console.disableYellowBox = true;

const initialState = {
  products: '',
};

function reducer(state = initialState, action) {
  console.log('hej');
  switch (action.type) {
    case 'SET_PRODUCT':
      var product = action.payload;
      console.log('produkten:', product);

      //om product inte är en array, gör till en array
      if (Array.isArray(product)) {
        var productWithAmount = product.map(item => ({...item, amount: action.amount}));
      } else { 
        product = [product];
        var productWithAmount = product.map(item => ({...item, amount: action.amount}));
      }

      var productWithAmount = product.map(item => ({...item, amount: action.amount}));
      var product_found;
      if(state.products === ''){
        product_found = false;
      }
      else{
        product_found = state.products.flat().find((item) => item.id === product[0].id);
      }
      if(!product_found){
        return {
          ...state,
          products: [...state.products, productWithAmount], 
        };
      }
      else {
        const amount = state.products.flat().find((item) => item.id === product[0].id).amount;
        const new_amount = amount + action.amount; //sätt ny amount
        return {
          ...state,
          products: state.products.map((productsList) =>
            productsList.map((product) => {
              return product.id === action.payload[0].id
                ? { ...product, amount: new_amount }
                : product;
            })
          ),
        };
      }
    ;
    case 'REMOVE_PRODUCT':
    return {
        ...state,
        products: state.products.filter((item) => item[0].id !== action.payload.id),
    };
    case 'UPDATE_PRODUCT': 
      return {
        ...state,
        products: state.products.map((productsList) =>
          productsList.map((product) => {
            return product.id === action.payload.id
              ? { ...product, amount: action.payload.amount}
              : product;
          })
        ),
    };
    case 'DELETE_PRODUCTS':
      return{
        ...state,
        products: []
      }
    default:
      return state;
  }
}

const store = createStore(reducer);

export default store;
