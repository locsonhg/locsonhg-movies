import { Server, Play } from "lucide-react";
import type { Episode } from "@/types";

interface ServerListProps {
  servers: Episode[];
  currentServer?: string;
  onServerSelect: (server: Episode) => void;
}

export const ServerList = ({
  servers,
  currentServer,
  onServerSelect,
}: ServerListProps) => {
  if (!servers || servers.length === 0) {
    return null;
  }

  const isCurrentServer = (server: Episode) => {
    return currentServer === server.server_name;
  };

  return (
    <div className="bg-gray-900 rounded-lg p-6 mb-6">
      <div className="flex items-center mb-4">
        <Server className="w-5 h-5 text-green-400 mr-2" />
        <h3 className="text-xl font-bold text-white">
          Chọn Server ({servers.length} server)
        </h3>
      </div>

      <div className="flex flex-wrap gap-3">
        {servers.map((server, index) => {
          const isCurrent = isCurrentServer(server);
          const episodeCount = server.server_data?.length || 0;

          return (
            <button
              key={index}
              onClick={() => onServerSelect(server)}
              className={`
                relative px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 min-w-[140px]
                ${
                  isCurrent
                    ? "bg-green-500 text-white"
                    : "bg-gray-800 text-white hover:bg-gray-700"
                }
                ${!isCurrent ? "hover:scale-105" : ""}
              `}
            >
              <div className="flex flex-col items-center">
                <div className="flex items-center mb-1">
                  {isCurrent && <Play className="w-4 h-4 mr-1" />}
                  <span className="font-semibold">
                    {server.server_name.replace("#", "").trim()}
                  </span>
                </div>
                <span className="text-xs opacity-75">{episodeCount} tập</span>
              </div>

              {isCurrent && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              )}
            </button>
          );
        })}
      </div>

      {/* Server Info */}
      {currentServer && (
        <div className="mt-4 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
          <p className="text-gray-300 text-sm">
            <span className="text-green-400 font-medium">Đang xem:</span>{" "}
            {servers
              .find((s) => s.server_name === currentServer)
              ?.server_name.replace("#", "")
              .trim() || "Server không xác định"}
          </p>
        </div>
      )}
    </div>
  );
};
