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
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <Download size={28} />
          <h2 className="text-3xl font-bold">Download Advanced Delivery Drones</h2>
        </div>

        {loading ? (
          <div className="flex items-center gap-2 text-blue-100">
            <Loader size={20} className="animate-spin" />
            <p>Loading latest version...</p>
          </div>
        ) : version ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              {/* Modrinth Button */}
              <a
                href={version.modrinthUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-white text-blue-700 font-semibold py-3 px-6 rounded hover:bg-blue-50 transition"
              >
                <Download size={20} />
                Download from Modrinth
                <ExternalLink size={16} className="ml-auto" />
              </a>

              {/* Hangar Button */}
              <a
                href={version.hangarUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-white text-blue-700 font-semibold py-3 px-6 rounded hover:bg-blue-50 transition"
              >
                <Download size={20} />
                Download from Hangar
                <ExternalLink size={16} className="ml-auto" />
              </a>
            </div>

            <p className="text-xs text-blue-100 pt-2">
              Both platforms are supported. Download from your preferred source.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
