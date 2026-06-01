import { useEffect, useState } from "react";
import { Download, ExternalLink, Loader, CheckCircle, Server, Gamepad2 } from "lucide-react";
import type { VersionInfo } from "@/lib/versions";
import { fetchLatestVersion } from "@/lib/versions";

// System Requirements
const SYSTEM_REQUIREMENTS = {
  java: "Java 17+",
  server: "Paper/Spigot 1.20.1+",
  ram: "512 MB (recommended 1 GB+)",
};

// Supported Minecraft Versions
const SUPPORTED_VERSIONS = [
  "1.20.5",
  "1.20.4",
  "1.20.3",
  "1.20.2",
  "1.20.1",
  "1.20",
  "1.19.3",
  "1.19.2",
];

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

            {/* System Requirements Section */}
            <div className="bg-white/10 rounded-lg p-4 sm:p-5 mt-6">
              <div className="flex items-center gap-2 mb-3">
                <Server size={18} className="text-yellow-300" />
                <h3 className="text-lg font-semibold">System Requirements</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-white/5 rounded p-3">
                  <p className="text-xs text-blue-200 mb-1">Java Version</p>
                  <p className="font-semibold text-sm flex items-center gap-1">
                    <CheckCircle size={14} className="text-green-400" />
                    {SYSTEM_REQUIREMENTS.java}
                  </p>
                </div>
                <div className="bg-white/5 rounded p-3">
                  <p className="text-xs text-blue-200 mb-1">Server Type</p>
                  <p className="font-semibold text-sm flex items-center gap-1">
                    <CheckCircle size={14} className="text-green-400" />
                    {SYSTEM_REQUIREMENTS.server}
                  </p>
                </div>
                <div className="bg-white/5 rounded p-3">
                  <p className="text-xs text-blue-200 mb-1">Recommended RAM</p>
                  <p className="font-semibold text-sm flex items-center gap-1">
                    <CheckCircle size={14} className="text-green-400" />
                    {SYSTEM_REQUIREMENTS.ram}
                  </p>
                </div>
              </div>
            </div>

            {/* Supported Minecraft Versions */}
            <div className="bg-white/10 rounded-lg p-4 sm:p-5 mt-4">
              <div className="flex items-center gap-2 mb-3">
                <Gamepad2 size={18} className="text-green-300" />
                <h3 className="text-lg font-semibold">Supported Minecraft Versions</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {SUPPORTED_VERSIONS.map((ver) => (
                  <span
                    key={ver}
                    className="inline-flex items-center gap-1 bg-white/20 hover:bg-white/30 transition px-3 py-1 rounded-full text-xs font-medium"
                  >
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                    {ver}
                  </span>
                ))}
              </div>
              <p className="text-xs text-blue-100 mt-3">
                Additional versions may be supported. Check Modrinth for the latest compatibility list.
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
