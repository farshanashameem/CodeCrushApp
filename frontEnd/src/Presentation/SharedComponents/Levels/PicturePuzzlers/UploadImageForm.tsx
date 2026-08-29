import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../../redux/store";
import { createImage, fetchImages } from "../../../../redux/Slices/imageSlice";
import toast from "react-hot-toast";
import { imageSchema } from "../../../../Lib/Imagevalidator";
import { ZodError } from "zod";

interface UploadImageFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const UploadImageForm = ({ isOpen, onClose }: UploadImageFormProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const { loading } = useSelector((state: RootState) => state.imageManagement);

  const [name, setName] = useState("");

  const [file, setFile] = useState<File | null>(null);
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    if (selectedFile.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5 MB");
      event.target.value = "";
      return;
    }

    setFile(selectedFile);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      imageSchema.parse({ name });

      if (!file) return toast.error("Please select an image");

      const formData = new FormData();
      formData.append("name", name);
      formData.append("image", file);

      await dispatch(createImage(formData)).unwrap();

      toast.success("Image uploaded successfully");

      dispatch(fetchImages());

      setName("");
      setFile(null);
      onClose();
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        toast.error(error.issues[0]?.message ?? "Invalid image name");
        return;
      }

      if (error instanceof Error) {
        toast.error(error.message);
        return;
      }

      toast.error("Failed to upload image");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-xl">
        {/* Header */}

        <div className="flex justify-between items-center border-b p-5">
          <h2 className="font-bold text-xl text-indigo-700">
            Upload New Image
          </h2>

          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700"
          >
            ✕
          </button>
        </div>

        {/* Form */}

        <form onSubmit={handleSubmit} className="p-5 space-y-5 ">
          {/* Image Name */}

          <div>
            <label className="block text-sm font-semibold mb-2">
              Image Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter image name"
              className="w-full border rounded-xl px-4 py-3"
            />
          </div>

          {/* Image Upload */}

          <div>
            <label className="block text-sm font-semibold mb-2">
              Upload Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full border rounded-xl px-4 py-3"
            />

            {file && (
              <div className="mt-4">
                <img
                  src={URL.createObjectURL(file)}
                  alt="Preview"
                  className="w-40 h-40 object-cover rounded-xl border"
                />

                <p className="text-sm text-slate-500 mt-2">{file.name}</p>
              </div>
            )}
          </div>

          {/* Footer */}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
            >
              {loading ? "Uploading..." : "Save Image"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadImageForm;
