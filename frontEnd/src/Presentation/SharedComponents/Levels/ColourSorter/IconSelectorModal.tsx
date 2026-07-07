import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { ICON_CATEGORIES } from "../../../../Types/icon";
import type { AppDispatch, RootState } from "../../../../redux/store";

import { fetchIcons } from "../../../../redux/Slices/iconSlice";

interface SelectedIcon {
  id: string;
  name: string;
  iconKey: string;
  category?: string;
  color: string;
}

interface IconSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (icon: SelectedIcon) => void;
}

export const IconSelectorModal = ({
  isOpen,
  onClose,
  onSelect,
}: IconSelectorModalProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const { icons, loading } = useSelector(
    (state: RootState) => state.iconManagement,
  );

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchIcons());
    }
  }, [dispatch, isOpen]);

  const categories = ["all", ...ICON_CATEGORIES];

  const filteredIcons = icons.filter((icon) => {
    const matchesSearch = icon.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "all" ? true : icon.category === category;

    return icon.isActive && matchesSearch && matchesCategory;
  });

  if (!isOpen) return null;

  return (
    <>
      {/* MODAL BACKDROP */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="w-full max-w-6xl overflow-hidden rounded-3xl border border-white/30 bg-white/20 backdrop-blur-md shadow-2xl">
          {/* HEADER */}
          <div className="flex items-center justify-between border-b border-white/20 p-6">
            <div>
              <h2 className="font-mochiy text-lg text-indigo-700">
                Select Icon
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                {filteredIcons.length} icons available
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="h-10 w-10 rounded-xl bg-white/50 hover:bg-white/70"
              >
                ✕
              </button>
            </div>
          </div>

          {/* FILTERS */}
          <div className="grid gap-3 border-b border-white/20 p-6 md:grid-cols-2">
            <input
              type="text"
              placeholder="Search icons..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-xl border border-white/40 bg-white/60 px-4 py-3 outline-none"
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-xl border border-white/40 bg-white/60 px-4 py-3 outline-none"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "all" ? "All Categories" : cat}
                </option>
              ))}
            </select>
          </div>

          {/* CONTENT */}
          <div className="max-h-[600px] overflow-y-auto p-6">
            {loading ? (
              <div className="py-20 text-center text-slate-600">
                Loading Icons...
              </div>
            ) : filteredIcons.length === 0 ? (
              <div className="py-20 text-center text-slate-500">
                No icons found
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
                {filteredIcons.map((icon) => (
                  <button
                    key={icon.id}
                    onClick={() => {
                      onSelect({
                        id: icon.id,
                        name: icon.name,
                        iconKey: icon.iconKey,
                        category: icon.category,
                        color: icon.color,
                      });

                      onClose();
                    }}
                    className="rounded-2xl border border-white/30 bg-white/40 p-2 hover:shadow-lg transition"
                  >
                    <div className="flex h-14 items-center justify-center rounded-lg bg-slate-50 text-2xl">
                      {icon.iconKey}
                    </div>

                    <div className="mt-2">
                      <p className="truncate text-xs font-medium text-slate-700">
                        {icon.name}
                      </p>

                      <p className="text-[10px] text-slate-500 truncate">
                        {icon.category}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default IconSelectorModal;
