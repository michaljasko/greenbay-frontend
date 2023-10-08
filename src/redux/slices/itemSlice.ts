import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../../axiosInstance";

export interface Item {
  id: number;
  name: string;
  description: string;
  price: number;
  photo: string | null;
  seller: string;
  buyer: string;
}
interface NewItem {
  name: string;
  description: string;
  price: number;
  photo: string | null;
}

interface ItemState {
  items: Item[];
  itemDetail: Item | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ItemState = {
  items: [],
  itemDetail: null,
  status: "idle",
  error: null,
};

async function fetchItems(): Promise<Item[]> {
  const response = await axiosInstance.get(`/api/item/`);
  return response.data;
}

export const getItems = createAsyncThunk("items/getItems", async () => {
  const response = await fetchItems();
  return response;
});

export const getItemById = createAsyncThunk(
  "items/getItemById",
  async (id: string) => {
    const response = await axiosInstance.get(`/api/item/${id}`, {
      headers: { numberOfElements: 1 },
    });
    return response.data as Item;
  }
);

export const addItem = createAsyncThunk(
  "items/addItem",
  async (item: NewItem, thunkAPI) => {
    try {
      const response = await axiosInstance.post(`/api/item/`, item);
      return response.data as Item;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

export const buyItem = createAsyncThunk(
  "items/buyItem",
  async (data: { id: string; price: number }) => {
    const response = await axiosInstance.put(`/api/item/${data.id}`);
    return { ...response.data, price: data.price };
  }
);

export const itemSlice = createSlice({
  name: "items",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getItems.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getItems.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.filter((item: Item) => {
          return !item.buyer;
        });
      })
      .addCase(getItems.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      })
      .addCase(getItemById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getItemById.fulfilled, (state, action: PayloadAction<Item>) => {
        state.itemDetail = action.payload;
        state.status = "succeeded";
      })
      .addCase(getItemById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message as string;
      })
      .addCase(addItem.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addItem.fulfilled, (state, action: PayloadAction<Item>) => {
        state.status = "succeeded";
        state.items.push(action.payload);
      })
      .addCase(addItem.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      })
      .addCase(buyItem.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        buyItem.fulfilled,
        (state, action: PayloadAction<{ price: number }>) => {
          state.status = "succeeded";
          const money = parseInt(localStorage.getItem("money") || "0");
          const updatedMoney = money - action.payload.price;
          localStorage.setItem("money", updatedMoney.toString());
        }
      )
      .addCase(buyItem.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      });
  },
});

export default itemSlice.reducer;
