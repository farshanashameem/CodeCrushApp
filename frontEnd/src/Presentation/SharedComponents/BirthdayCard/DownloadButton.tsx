import { toPng } from "html-to-image";
import { useState } from "react";

interface DownloadButtonProps {
  cardId?: string;
  fileName?: string;
}

export default function DownloadButton({
  cardId = "birthday-card",
  fileName = "birthday-card",
}: DownloadButtonProps) {
  const [loading, setLoading] = useState(false);

  const downloadCard = async () => {
    const card = document.getElementById(cardId);

    if (!card) return;

    try {
      setLoading(true);

      const dataUrl = await toPng(card, {
        cacheBust: true,
        pixelRatio: 3,
        backgroundColor: "#ffffff",
      });

      const link = document.createElement("a");

      link.download = `${fileName}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={downloadCard}
      disabled={loading}
      className="
      group
      inline-flex
      items-center
      gap-3
      rounded-full
      bg-gradient-to-r
      from-sky-500
      to-cyan-500
      px-6 py-3 text-base
      font-bold
      text-white
      shadow-xl
      transition-all
      duration-300
      hover:scale-105
      hover:shadow-2xl
      disabled:cursor-not-allowed
      disabled:opacity-70
      "
    >
      {loading ? (
        <>
          <span className="animate-spin">⏳</span>
          Preparing...
        </>
      ) : (
        <>
          <span className="text-2xl transition-transform group-hover:-translate-y-1">
            📥
          </span>
          Download Card
        </>
      )}
    </button>
  );
}
