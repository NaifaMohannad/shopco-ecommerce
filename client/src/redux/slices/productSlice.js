import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getProducts, getProductDetail, getCategories, getDressStyles, addReview } from '../../services/api';

// Get all products
export const fetchProducts = createAsyncThunk('products/fetchProducts', async (filters, thunkAPI) => {
    try {
        const response = await getProducts(filters);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});

// Get single product
export const fetchProductDetail = createAsyncThunk('products/fetchProductDetail', async (id, thunkAPI) => {
    try {
        const response = await getProductDetail(id);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});

// Get categories
export const fetchCategories = createAsyncThunk('products/fetchCategories', async (_, thunkAPI) => {
    try {
        const response = await getCategories();
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});

// Get dress styles
export const fetchDressStyles = createAsyncThunk('products/fetchDressStyles', async (_, thunkAPI) => {
    try {
        const response = await getDressStyles();
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});

// Add review
export const addReviewAction = createAsyncThunk('products/addReview', async ({ id, data }, thunkAPI) => {
    try {
        const response = await addReview(id, data);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});

const productSlice = createSlice({
    name: 'products',
    initialState: {
        products: [],
        product: null,
        categories: [],
        dressStyles: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchProductDetail.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchProductDetail.fulfilled, (state, action) => {
                state.loading = false;
                state.product = action.payload;
            })
            .addCase(fetchProductDetail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.categories = action.payload;
            })
            .addCase(fetchDressStyles.fulfilled, (state, action) => {
                state.dressStyles = action.payload;
            })
            .addCase(addReviewAction.fulfilled, (state, action) => {
                if (state.product) {
                    state.product.reviews = [...(state.product.reviews || []), action.payload];
                }
            });
    },
});

export default productSlice.reducer;