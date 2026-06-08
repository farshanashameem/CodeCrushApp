import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

import api from "../../Lib/axios";
import { API_ROUTES } from "../../Constants/api.routes";
import type {
  Child,
  ChildState,
  FetchChildrenResponse,
  AddChildPayload,
  UpdateChildPayload,
  ToggleChildStatusArgs,
  ToggleChildStatusPayload,
} from "../../Types/ChildManagement";


const initialState: ChildState = {

  loading: false,
  error: null,
  children: [],
  selectedChild: null,
};

//====Fetch children====/

export const fetchChildren = createAsyncThunk< FetchChildrenResponse, void, { rejectValue: string }>(
  "parent/fetchChildren",

  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get( API_ROUTES.PARENT.CHILDREN.GET_ALL );

      if (!response.data.success) {
        return rejectWithValue("Invalid response");
      }

      return response.data.data;
    } catch (error) {
      const err = error as AxiosError<{ message: string;}>;

      return rejectWithValue(
        err.response?.data?.message ||
          "Failed fetching children"
      );
    }
  }
);

//====Child details ====/
export const getChildDetail = createAsyncThunk< { child: Child }, { id: string }, { rejectValue: string }>(
  "parent/getChildDetail",
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await api.get( API_ROUTES.PARENT.CHILDREN.BY_ID(id) );

      if (!response.data.success) {
        return rejectWithValue("Invalid response");
      }

      return {
        child: response.data.data,
      };
    } catch (error) {
      const err = error as AxiosError<{
        message: string;
      }>;

      return rejectWithValue(
        err.response?.data?.message ||
          "Failed getting child"
      );
    }
  }
);

//==== Add Child ==== //
export const addChild = createAsyncThunk< Child, AddChildPayload, { rejectValue: string } >(
  "parent/addChild",

  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.post( API_ROUTES.PARENT.CHILDREN.ADD,  payload );

      if (!response.data.success) {
        return rejectWithValue("Invalid response");
      }

      return response.data.data;
    } catch (error) {
      const err = error as AxiosError<{
        message: string;
      }>;

      return rejectWithValue(
        err.response?.data?.message ||
          "Failed adding child"
      );
    }
  }
);


// ==== Update Child ==== /
export const updateChild = createAsyncThunk< Child,  UpdateChildPayload, { rejectValue: string } >(
  "parent/updateChild",

  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.put( API_ROUTES.PARENT.CHILDREN.BY_ID(payload.id), payload );

      if (!response.data.success) {
        return rejectWithValue("Invalid response");
      }

      return response.data.data;
    } catch (error) {
      const err = error as AxiosError<{
        message: string;
      }>;

      return rejectWithValue(
        err.response?.data?.message ||
          "Failed updating child"
      );
    }
  }
);

// ==== toggle the status ====/
export const toggleChildStatus = createAsyncThunk< ToggleChildStatusPayload, ToggleChildStatusArgs, { rejectValue: string }>(
  "parent/toggleChildStatus",

  async ({ id, action }, { rejectWithValue }) => {
    try {
      const response = await api.patch( API_ROUTES.PARENT.CHILDREN.STATUS(id),  { action,}  );

      if (!response.data.success) {
        return rejectWithValue("Invalid response");
      }

      return {
        id: response.data.data.id,
        status: response.data.data.status,
      };
    } catch (error) {
      const err = error as AxiosError<{
        message: string;
      }>;

      return rejectWithValue(
        err.response?.data?.message ||
          "Failed updating status"
      );
    }
  }
);

//==== Admin toggle child status ====/
export const adminToggleChildStatus = createAsyncThunk< ToggleChildStatusPayload, ToggleChildStatusArgs, { rejectValue: string } >(
  "admin/toggleChildStatus",

  async ({ id, action }, { rejectWithValue }) => {
    try {
      const response = await api.patch( API_ROUTES.ADMIN.CHILDREN.STATUS(id), { action } );

      if (!response.data.success) {
        return rejectWithValue("Invalid response");
      }

      return {
        id: response.data.data.id,
        status: response.data.data.status,
      };
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;

      return rejectWithValue(
        err.response?.data?.message ||
          "Failed updating child status"
      );
    }
  }
);

//===== AdminGetChilddetails ====//
export const adminGetChildDetail = createAsyncThunk<  { child: Child }, { id: string },  { rejectValue: string } >(
  "admin/getChildDetail",

  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await api.get( API_ROUTES.ADMIN.CHILDREN.BY_ID(id) );

      if (!response.data.success) {
        return rejectWithValue("Invalid response");
      }

      return {
        child: response.data.data,
      };
    } catch (error) {
      const err = error as AxiosError<{
        message: string;
      }>;

      return rejectWithValue(
        err.response?.data?.message ||
          "Failed getting child"
      );
    }
  }
);


// ==== Slice ==== //
const childManagementSlice = createSlice({

  name: "childManagement",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },

    clearSelectedChild: (state) => {
      state.selectedChild = null;
    },
  },

  extraReducers: (builder) => {
    builder

      /* FETCH CHILDREN */

      .addCase(fetchChildren.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchChildren.fulfilled, (state, action) => {
        state.loading = false;
        state.children = action.payload.children;
      })

      .addCase(fetchChildren.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed fetching children";
      })

      /* GET CHILD */

      .addCase(getChildDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getChildDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedChild = action.payload.child;
      })

      .addCase(getChildDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed getting child";
      })

      /* ADD CHILD */

      .addCase(addChild.fulfilled, (state, action) => {
        state.children.push(action.payload);
      })

      /* UPDATE CHILD */

      .addCase(updateChild.fulfilled, (state, action) => {
        const index = state.children.findIndex(
          (c) => c.id === action.payload.id );

        if (index !== -1) {
          state.children[index] = action.payload;
        }

        if (
          state.selectedChild &&
          state.selectedChild.id === action.payload.id
        ) {
          state.selectedChild = action.payload;
        }
      })

      /* TOGGLE STATUS */

      .addCase(toggleChildStatus.fulfilled, (state, action) => {
        const { id, status } = action.payload;
        const child = state.children.find((c) => c.id === id );

        if (child) {
          child.status = status;
        }

        if (
          state.selectedChild &&
          state.selectedChild.id === id
        ) {
          state.selectedChild.status = status;
        }
      })

      /* Admin Toggle status */
       .addCase(adminToggleChildStatus.fulfilled, (state, action) => {
            const { id, status } = action.payload;
            const child = state.children.find(  (c) => c.id === id );

            if (child) {
                child.status = status;
            }

            if (
                state.selectedChild &&
                state.selectedChild.id === id
            ) {
                state.selectedChild.status = status;
            }
        }) 
      /*  Adin Child details */
      .addCase(adminGetChildDetail.pending, (state) => {
          state.loading = true;
        })

        .addCase(adminGetChildDetail.fulfilled, (state, action) => {
          state.loading = false;
          state.selectedChild = action.payload.child;
        })

        .addCase(adminGetChildDetail.rejected, (state) => {
            state.loading = false;
          })
            },
       });

export const {
  clearError,
  clearSelectedChild,
} = childManagementSlice.actions;

export default childManagementSlice.reducer;