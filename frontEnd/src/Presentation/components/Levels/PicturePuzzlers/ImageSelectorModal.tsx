import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch, RootState } from "../../../../redux/store";
import { fetchImages } from "../../../../redux/Slices/imageSlice";

import type { PicturePuzzleStepForm } from "../../../../Types/level";

interface ImageSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenUpload: () => void;
  onSelect: (step: PicturePuzzleStepForm, editIndex?: number) => void;
  editIndex?: number;
}

const ImageSelectorModal = ({
  isOpen,
  onClose,
  onOpenUpload,
  onSelect,
  editIndex,
}: ImageSelectorModalProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const { images, loading } = useSelector(
    (state: RootState) => state.imageManagement,
  );

  const [search, setSearch] = useState("");

  useEffect(() => {
    if (isOpen) dispatch(fetchImages());
  }, [dispatch, isOpen]);

  if (!isOpen) return null;

  const filteredImages = images.filter(
    (image) =>
      image.isActive && image.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-6xl rounded-3xl border border-white/30 bg-white/20 backdrop-blur-md shadow-2xl overflow-hidden">
        {/* Header */}

        <div className="flex items-center justify-between border-b border-white/20 p-6">
          <h2 className="font-mochiy text-lg text-indigo-700">Select Image</h2>

          <button
            onClick={onClose}
            className="h-10 w-10 rounded-xl bg-white/50 hover:bg-white/70"
          >
            ✕
          </button>
        </div>

        {/* Search */}

        <div className="flex gap-3 border-b border-white/20 p-6">
          <input
            type="text"
            value={search}
            placeholder="Search images..."
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 rounded-xl border border-white/40 bg-white/60 px-4 py-3 outline-none"
          />

          <button
            onClick={onOpenUpload}
            className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700"
          >
            + Upload
          </button>
        </div>

        {/* Content */}

        <div className="max-h-[600px] overflow-y-auto p-6">
          {loading ? (
            <div className="py-16 text-center text-slate-600">
              Loading Images...
            </div>
          ) : filteredImages.length === 0 ? (
            <div className="py-16 text-center text-slate-500">
              No Images Found
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
              {filteredImages.map((image) => (
                <div
                  key={image.id}
                  onClick={() => {
                    onSelect(
                      {
                        imageId: image.id,
                        imageName: image.name,
                        imageUrl: image.imageUrl,
                        answer: image.name,
                      },
                      editIndex,
                    );

                    onClose();
                  }}
                  className="cursor-pointer overflow-hidden rounded-3xl border border-white/30 bg-white/40 backdrop-blur-md transition hover:-translate-y-1 hover:border-indigo-400 hover:shadow-xl"
                >
                  <div className="aspect-square bg-slate-100">
                    <img
                      src={image.imageUrl}
                      alt={image.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="p-4">
                    <p className="truncate text-center font-semibold text-slate-700">
                      {image.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageSelectorModal;
