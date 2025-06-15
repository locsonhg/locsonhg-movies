import { useState } from "react";
import { Play, Lock } from "lucide-react";
import type { EpisodeData } from "@/types";

interface EpisodeListProps {
  episodes: EpisodeData[];
  currentEpisode?: string;
  onEpisodeSelect: (episode: EpisodeData) => void;
}

export const EpisodeList = ({
  episodes,
  currentEpisode,
  onEpisodeSelect,
}: EpisodeListProps) => {
  const [showAll, setShowAll] = useState(false);

  if (!episodes || episodes.length === 0) {
    return null;
  }

  // Show first 20 episodes by default, or all if showAll is true
  const displayedEpisodes = showAll ? episodes : episodes.slice(0, 20);
  const hasMoreEpisodes = episodes.length > 20;

  const isCurrentEpisode = (episode: EpisodeData) => {
    return currentEpisode === episode.slug;
  };

  const isEpisodeLocked = (index: number) => {
    // All episodes are free now
    return false;
  };

  return (
    <div className="bg-gray-900 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white">
          Danh sách tập ({episodes.length} tập)
        </h3>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
        {displayedEpisodes.map((episode, index) => {
          const isLocked = isEpisodeLocked(index);
          const isCurrent = isCurrentEpisode(episode);

          return (
            <button
              key={episode.slug}
              onClick={() => !isLocked && onEpisodeSelect(episode)}
              disabled={isLocked}
              className={`
                relative aspect-square rounded-lg font-medium text-sm transition-all duration-200
                ${
                  isCurrent
                    ? "bg-green-500 text-white"
                    : isLocked
                    ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                    : "bg-gray-800 text-white hover:bg-gray-700"
                }
                ${!isLocked && !isCurrent ? "hover:scale-105" : ""}
              `}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                {isLocked ? (
                  <div className="flex flex-col items-center">
                    <Lock className="w-4 h-4 mb-1" />
                    <span className="text-xs">{index + 1}</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    {isCurrent && <Play className="w-4 h-4 mb-1" />}
                    <span className={isCurrent ? "text-xs" : "text-sm"}>
                      {index + 1}
                    </span>
                  </div>
                )}
              </div>

              {isCurrent && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              )}
            </button>
          );
        })}
      </div>

      {hasMoreEpisodes && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-green-400 hover:text-green-300 font-medium"
          >
            {showAll ? "Thu gọn" : `Xem thêm ${episodes.length - 20} tập`}
          </button>
        </div>
      )}
    </div>
  );
};
