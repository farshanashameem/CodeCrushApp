import React from "react";

interface ConfirmationModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModal: React.FC<
  ConfirmationModalProps
> = ({
  isOpen,
  title = "Confirm Action",
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">

      <div className="bg-white rounded-3xl w-[90%] max-w-md p-8 shadow-2xl animate-in fade-in zoom-in duration-200">

        {/* title */}
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          {title}
        </h2>

        {/* message */}
        <p className="text-center text-gray-500 mb-8">
          {message}
        </p>

        {/* buttons */}
        <div className="flex gap-4 justify-center">

          <button
            onClick={onCancel}
            className="px-8 py-3 rounded-2xl bg-gray-200 hover:bg-gray-300 font-semibold transition"
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            className="px-8 py-3 rounded-2xl bg-red-500 text-white hover:bg-red-600 font-semibold transition"
          >
            {confirmText}
          </button>

        </div>

      </div>

    </div>
  );
};

export default ConfirmationModal;