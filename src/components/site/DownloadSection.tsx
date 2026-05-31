import { useEffect, useState } from "react";
import { Download, ExternalLink, Loader } from "lucide-react";
import type { VersionInfo } from "@/lib/versions";
import { fetchLatestVersion } from "@/lib/versions";

export function DownloadSection() {
  const [version, setVersion] = useState<VersionInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLatestVersion().then((data) => {
      setVersion(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-12 px-6 rounded-lg shadow-lg">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-2 sm:gap-3 mb-4">
          <Download size={24} className="sm:w-7 sm:h-7" />
          <h2 className="text-2xl sm:text-3xl font-bold">Download Advanced Delivery Drones</h2>
        </div>

        {loading ? (
          <div className="flex items-center gap-2 text-blue-100">
            <Loader size={20} className="animate-spin" />
            <p>Loading latest version...</p>
          </div>
        ) : version ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 pt-4">
              {/* Modrinth Button */}
              <a
                href={version.modrinthUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center gap-1 bg-white text-blue-700 font-semibold py-2 sm:py-3 px-3 sm:px-4 rounded hover:bg-blue-50 transition text-xs sm:text-sm"
              >
                <div className="flex items-center gap-1">
                  <Download size={18} />
                  <span>Modrinth</span>
                </div>
                <ExternalLink size={14} />
              </a>

              {/* Hangar Button */}
              <a
                href={version.hangarUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center gap-1 bg-white text-blue-700 font-semibold py-2 sm:py-3 px-3 sm:px-4 rounded hover:bg-blue-50 transition text-xs sm:text-sm"
              >
                <div className="flex items-center gap-1">
                  <Download size={18} />
                  <span>Hangar</span>
                </div>
                <ExternalLink size={14} />
              </a>

              {/* Spigot Button */}
              <a
                href={version.spigotUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center gap-1 bg-white text-blue-700 font-semibold py-2 sm:py-3 px-3 sm:px-4 rounded hover:bg-blue-50 transition text-xs sm:text-sm"
              >
                <div className="flex items-center gap-1">
                  <Download size={18} />
                  <span>Spigot</span>
                </div>
                <ExternalLink size={14} />
              </a>
            </div>

            {/* Download Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 pt-2">
              <div className="bg-white/10 rounded p-2 sm:p-3 text-center">
                <p className="text-xs sm:text-sm text-blue-200">Version</p>
                <p className="font-semibold text-sm sm:text-base">{version.latestVersion}</p>
              </div>
              <div className="bg-white/10 rounded p-2 sm:p-3 text-center">
                <p className="text-xs sm:text-sm text-blue-200">Modrinth DL</p>
                <p className="font-semibold text-sm sm:text-base">{version.downloads.toLocaleString()}</p>
              </div>
              <div className="bg-white/10 rounded p-2 sm:p-3 text-center">
                <p className="text-xs sm:text-sm text-blue-200">Spigot DL</p>
                <p className="font-semibold text-sm sm:text-base">{(version.spigotDownloads || 0).toLocaleString()}</p>
              </div>
              <div className="bg-white/10 rounded p-2 sm:p-3 text-center">
                <p className="text-xs sm:text-sm text-blue-200">Total</p>
                <p className="font-semibold text-sm sm:text-base">{(version.downloads + (version.spigotDownloads || 0)).toLocaleString()}</p>
              </div>
            </div>

            <p className="text-xs text-blue-100 pt-2">
              Available on Modrinth, Hangar, and Spigot. Download from your preferred source.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
