import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { AxiosError } from "axios";

import api from "../../Lib/axios";
import { API_ROUTES } from "../../Constants/api.routes";
import type { Image } from "../../Types/image";



// ======================
// THUNKS
// ======================

export const fetchImages = createAsyncThunk< Image[], void, { rejectValue: string } >(
  "admin/fetchImages",

  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get( API_ROUTES.ADMIN.IMAGES.GET_ALL );

      return response.data.data.images;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;

      return rejectWithValue(
        err.response?.data?.message ||
        "Failed fetching images"
      );
    }
  }
);

export const getImageDetail = createAsyncThunk< Image, string, { rejectValue: string } >(
  "admin/getImageDetail",

  async (imageId, { rejectWithValue }) => {
    try {
      const response = await api.get( API_ROUTES.ADMIN.IMAGES.BY_ID(imageId) );

      return response.data.data;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;

      return rejectWithValue(
        err.response?.data?.message ||
        "Failed fetching image"
      );
    }
  }
);

export const createImage = createAsyncThunk< Image, FormData, { rejectValue: string } >(
  "admin/createImage",

  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post(
        API_ROUTES.ADMIN.IMAGES.CREATE,
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      return response.data.data.image;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;

      return rejectWithValue(
        err.response?.data?.message ||
        "Failed creating image"
      );
    }
  }
);

export const updateImage = createAsyncThunk<
  { success: boolean; message: string },
  {
    imageId: string;
    data: Partial<Image>;
  },  { rejectValue: string } >(
  "admin/updateImage",

  async ({ imageId, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(
        API_ROUTES.ADMIN.IMAGES.BY_ID(imageId),
        data
      );

      return response.data.data;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;

      return rejectWithValue(
        err.response?.data?.message ||
        "Failed updating image"
      );
    }
  }
);

export const deleteImage = createAsyncThunk< string,  string, { rejectValue: string } >(
  "admin/deleteImage",

  async (imageId, { rejectWithValue }) => {
    try {
      await api.delete( API_ROUTES.ADMIN.IMAGES.BY_ID(imageId) );

      return imageId;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;

      return rejectWithValue(
        err.response?.data?.message ||
        "Failed deleting image"
      );
    }
  }
);


// ======================
// STATE
// ======================

interface ImageState {
  images: Image[];
  selectedImage: Image | null;
  loading: boolean;
  error: string | null;
}

const initialState: ImageState = {
  images: [],
  selectedImage: null,
  loading: false,
  error: null,
};


// ======================
// SLICE
// ======================

const imageSlice = createSlice({
  name: "imageManagement",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder

      // FETCH IMAGES
      .addCase(fetchImages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchImages.fulfilled, (state, action) => {
        state.loading = false;
        state.images = action.payload;
      })
      .addCase(fetchImages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || null;
      })

      // GET IMAGE DETAIL
      .addCase(getImageDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getImageDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedImage = action.payload;
      })
      .addCase(getImageDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || null;
      })

      // CREATE IMAGE
      .addCase(createImage.pending, (state) => {
        state.loading = true;
      })
      .addCase(createImage.fulfilled, (state, action) => {
        state.loading = false;

        state.images.unshift(action.payload);
      })
      .addCase(createImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || null;
      })

      // UPDATE IMAGE
      .addCase(updateImage.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateImage.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || null;
      })

      // DELETE IMAGE
      .addCase(deleteImage.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteImage.fulfilled, (state, action) => {
        state.loading = false;

        state.images = state.images.filter(
          (image) => image.id !== action.payload
        );

        if (
          state.selectedImage &&
          state.selectedImage.id === action.payload
        ) {
          state.selectedImage = null;
        }
      })
      .addCase(deleteImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || null;
      });
  },
});

export default imageSlice.reducer;