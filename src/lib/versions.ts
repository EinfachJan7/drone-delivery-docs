// Version fetching from Modrinth API

export interface ModrinthVersion {
  id: string;
  name: string;
  version_number: string;
  changelog: string | null;
  downloads: string;
  featured: boolean;
  status: string;
  requested_status: string;
  date_published: string;
  date_updated: string;
  published: string;
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
  hangar_downloads?: number;
  spigot_downloads?: number;
}

export interface VersionInfo {
  latestVersion: string;
  releaseDate: string;
  downloadUrl: string;
  modrinthUrl: string;
  hangarUrl: string;
  spigotUrl: string;
  downloads: number;
  spigotDownloads?: number;
}

export interface DownloadStats {
  modrinth: number;
  hangar: number;
  spigot: number;
  total: number;
}

const MODRINTH_VERSION_API = "https://api.modrinth.com/v2/project/advanceddeliverydrones/version?include_changelog=true";
const PROJECT_SLUG = "advanceddeliverydrones";
const SPIGOT_RESOURCE_API = "https://api.spiget.org/v2/resources/135544";

// 1. Standard-Optionen für APIs, die strikte Header erlauben (Modrinth, Hangar)
const getStrictFetchOptions = () => ({
  mode: "cors" as RequestMode,
  cache: "no-store" as RequestCache,
  headers: {
    Accept: "application/json",
    "User-Agent": "AdvancedDeliveryDrones-Website/1.0",
    "Cache-Control": "no-cache, no-store, must-revalidate",
    Pragma: "no-cache",
    Expires: "0",
  },
});

// 2. Lockere Optionen für Spiget (Keine Cache-Header, um CORS Preflight-Blockaden zu verhindern)
const getLooseFetchOptions = () => ({
  mode: "cors" as RequestMode,
  headers: {
    Accept: "application/json",
    "User-Agent": "AdvancedDeliveryDrones-Website/1.0",
  },
});

/**
 * Holt die neueste Version dynamisch aus der Modrinth API.
 */
export async function fetchLatestVersion(): Promise<VersionInfo | null> {
  try {
    const modrinthUrl = `${MODRINTH_VERSION_API}&_t=${Date.now()}`;
    const response = await fetch(modrinthUrl, getStrictFetchOptions());

    if (!response.ok) {
      throw new Error(`Modrinth API returned status code: ${response.status}`);
    }

    const versions: ModrinthVersion[] = await response.json();

    if (!versions || versions.length === 0) {
      return null;
    }

    const latest = versions[0];
    const downloadFile = latest.files.find((f) => f.primary);
    const rawDate = latest.date_published || new Date().toISOString();

    let spigotDownloads = 0;
    try {
      const spigotUrl = `${SPIGOT_RESOURCE_API}?_t=${Date.now()}`;
      const spigotResponse = await fetch(spigotUrl, getLooseFetchOptions());
      if (spigotResponse.ok) {
        const spigotData = await spigotResponse.json();
        spigotDownloads = spigotData.downloads || 0;
      }
    } catch (error) {
      console.warn("Error fetching Spigot data in fetchLatestVersion:", error);
    }

    return {
      latestVersion: latest.version_number,
      releaseDate: new Date(rawDate).toISOString().split("T")[0],
      downloadUrl: downloadFile?.url || latest.files[0]?.url || `https://modrinth.com/plugin/${PROJECT_SLUG}/versions`,
      modrinthUrl: `https://modrinth.com/plugin/${PROJECT_SLUG}`,
      hangarUrl: "https://hangar.papermc.io/Baumkrieger69/AdvancedDeliveryDrones",
      spigotUrl: "https://www.spigotmc.org/resources/advanced-delivery-drones.135544/",
      downloads: latest.downloads + spigotDownloads,
      spigotDownloads,
    };
  } catch (error) {
    console.error("Error fetching Modrinth versions:", error);
    return null;
  }
}

export async function getAllVersions(limit: number = 10): Promise<ModrinthVersion[]> {
  try {
    const timestamp = Date.now();
    const modrinthUrl = `${MODRINTH_VERSION_API}&_t=${timestamp}`;
    
    const [modrinthRes, hangarRes, spigotRes] = await Promise.all([
      fetch(modrinthUrl, getStrictFetchOptions()),
      fetch(`https://hangar.papermc.io/api/v1/projects/Baumkrieger69/AdvancedDeliveryDrones/versions?limit=100`, getStrictFetchOptions()),
      fetch(`${SPIGOT_RESOURCE_API}/versions?size=100&sort=-releaseDate`, getLooseFetchOptions()),
    ]);

    if (!modrinthRes.ok) {
      return [];
    }

    const versions: ModrinthVersion[] = await modrinthRes.json();
    let hangarVersions: any[] = [];
    let spigotVersions: any[] = [];

    if (hangarRes.ok) {
      try {
        const hangarData = await hangarRes.json();
        hangarVersions = hangarData.result || [];
      } catch (e) {
        console.warn("Failed to parse hangar versions");
      }
    }

    if (spigotRes.ok) {
      try {
        spigotVersions = await spigotRes.json();
      } catch (e) {
        console.warn("Failed to parse spigot versions");
      }
    }

    const enrichedVersions = versions.map((v) => {
      const versionNumber = v.version_number;
      const hangarMatch = hangarVersions.find((hv: any) => hv.name === versionNumber);
      const spigotMatch = spigotVersions.find((sv: any) => sv.name === versionNumber);

      return {
        ...v,
        hangar_downloads: hangarMatch ? hangarMatch.stats?.totalDownloads || 0 : 0,
        spigot_downloads: spigotMatch ? spigotMatch.downloads || 0 : 0,
      };
    });

    return enrichedVersions.slice(0, limit);
  } catch (error) {
    console.error("Error fetching versions list:", error);
    return [];
  }
}

/**
 * Holt alle Download-Statistiken komplett live von Modrinth, Hangar und Spigot.
 */
export async function fetchDownloadStats(): Promise<DownloadStats | null> {
  try {
    const timestamp = Date.now();
    
    const [modrinthRes, hangarRes, spigotRes] = await Promise.all([
      fetch(`https://api.modrinth.com/v2/project/advanceddeliverydrones?_t=${timestamp}`, getStrictFetchOptions()),
      fetch(`https://hangar.papermc.io/api/v1/projects/Baumkrieger69/AdvancedDeliveryDrones?_t=${timestamp}`, getStrictFetchOptions()),
      fetch(`${SPIGOT_RESOURCE_API}?_t=${timestamp}`, getLooseFetchOptions()),
    ]);

    let modrinthDownloads = 0;
    let hangarDownloads = 0;
    let spigotDownloads = 0;

    if (modrinthRes.ok) {
      const modrinthData = await modrinthRes.json();
      modrinthDownloads = modrinthData.downloads || 0;
    }

    if (hangarRes.ok) {
      const hangarData = await hangarRes.json();
      hangarDownloads = hangarData.stats?.downloads || 0;
    }

    if (spigotRes.ok) {
      const spigotData = await spigotRes.json();
      spigotDownloads = spigotData.downloads || 0;
    }

    return {
      modrinth: modrinthDownloads,
      hangar: hangarDownloads,
      spigot: spigotDownloads,
      total: modrinthDownloads + hangarDownloads + spigotDownloads,
    };
  } catch (error) {
    console.error("Error fetching download stats:", error);
    return null;
  }
}