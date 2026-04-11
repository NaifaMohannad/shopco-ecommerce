import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getCart, addToCart, removeFromCart ,updateCart} from '../../services/api';

// Get cart
export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, thunkAPI) => {
    try {
        const response = await getCart();
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});

// Add to cart
export const addItemToCart = createAsyncThunk('cart/addItem', async (data, thunkAPI) => {
    try {
        const response = await addToCart(data);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});

// Remove from cart
export const removeItemFromCart = createAsyncThunk('cart/removeItem', async (data, thunkAPI) => {
    try {
        const response = await removeFromCart(data);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});
// Update cart item quantity
export const updateCartItem = createAsyncThunk('cart/updateItem', async (data, thunkAPI) => {
    try {
        const response = await updateCart(data);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});
const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        cart: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCart.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.loading = false;
                state.cart = action.payload;
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addItemToCart.fulfilled, (state, action) => {
                state.cart = action.payload;
            })
            .addCase(removeItemFromCart.fulfilled, (state, action) => {
                state.cart = action.payload;
            })
            .addCase(updateCartItem.fulfilled, (state, action) => {
                state.cart = action.payload;
            });
    },
});

export default cartSlice.reducer;