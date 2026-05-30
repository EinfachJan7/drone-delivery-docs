// Version fetching from Modrinth API

export interface ModrinthVersion {
  id: string;
  name: string;
  version_number: string;
  changelog: string;
  downloads: number;
  featured: boolean;
  status: string;
  requested_status: string;
  date_published: string; // Korrigiert von 'published' zu 'date_published'
  date_updated: string;    // Korrigiert von 'updated' zu 'date_updated'
  files: Array<{
    filename: string;
    primary: boolean;
    size: number;
    file_type: string;
    hashes: {
      sha512: string;
      sha1: string;
    };
    url: string;
    mirrors: string[];
  }>;
  dependencies: string[];
  loaders: string[];
  game_versions: string[];
}

export interface VersionInfo {
  latestVersion: string;
  releaseDate: string;
  downloadUrl: string;
  modrinthUrl: string;
  hangarUrl: string;
  downloads: number;
}

const MODRINTH_VERSION_API = "https://api.modrinth.com/v2/project/advanceddeliverydrones/version?include_changelog=false";
const PROJECT_SLUG = "advanceddeliverydrones";

/**
 * Holt die neueste Version dynamisch aus der Modrinth API.
 */
export async function fetchLatestVersion(): Promise<VersionInfo | null> {
  try {
    const response = await fetch(MODRINTH_VERSION_API, {
      mode: "cors",
      headers: {
        Accept: "application/json",
        "User-Agent": "AdvancedDeliveryDrones-Website/1.0",
      },
    });

    if (!response.ok) {
      throw new Error(`API returned status code: ${response.status}`);
    }

    const versions: ModrinthVersion[] = await response.json();

    if (!versions || versions.length === 0) {
      return null;
    }

    const latest = versions[0];
    const downloadFile = latest.files.find((f) => f.primary);

    // Fallback falls date_published fehlt, um den RangeError zu verhindern
    const rawDate = latest.date_published || new Date().toISOString();

    return {
      latestVersion: latest.version_number,
      releaseDate: new Date(rawDate).toISOString().split("T")[0],
      downloadUrl: downloadFile?.url || latest.files[0]?.url || `https://modrinth.com/plugin/${PROJECT_SLUG}/versions`,
      modrinthUrl: `https://modrinth.com/plugin/${PROJECT_SLUG}`,
      hangarUrl: "https://hangar.papermc.io/Baumkrieger69/AdvancedDeliveryDrones",
      downloads: latest.downloads,
    };
  } catch (error) {
    console.error("Error fetching Modrinth versions:", error);
    return null;
  }
}

export async function getAllVersions(limit: number = 10): Promise<ModrinthVersion[]> {
  try {
    const response = await fetch(MODRINTH_VERSION_API, {
      mode: "cors",
      headers: {
        Accept: "application/json",
        "User-Agent": "AdvancedDeliveryDrones-Website/1.0",
      },
    });

    if (!response.ok) {
      return [];
    }

    const versions: ModrinthVersion[] = await response.json();
    return versions.slice(0, limit);
  } catch (error) {
    console.error("Error fetching Modrinth versions list:", error);
    return [];
  }
}