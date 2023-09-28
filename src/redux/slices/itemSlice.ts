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
  photo: File | null;
}

interface ItemState {
  items: Item[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ItemState = {
  items: [],
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

export const addItem = createAsyncThunk(
  "items/addItem",
  async (item: NewItem, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append("name", item.name);
      formData.append("description", item.description);
      formData.append("price", item.price.toString());
      if (item.photo) {
        formData.append("photo", item.photo);
      }

      const response = await axiosInstance.post(`/api/item/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data as Item;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
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
        state.items = action.payload;
      })
      .addCase(getItems.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
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
      });
  },
});

export default itemSlice.reducer;
