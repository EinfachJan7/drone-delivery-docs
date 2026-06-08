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

// Demo data for fallback
const DEMO_DOWNLOAD_STATS: DownloadStats = {
  modrinth: 5240,
  hangar: 3180,
  spigot: 2960,
  total: 11380,
};

/**
 * Fetch with retry logic for unstable networks (especially mobile)
 */
async function fetchWithRetry(url: string, options: RequestInit, maxRetries: number = 3): Promise<Response | null> {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);
      // Only retry on network errors or 5xx, not on 4xx
      if (response.ok || response.status < 500) {
        return response;
      }
      lastError = new Error(`HTTP ${response.status}`);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      // Exponential backoff: wait before retrying
      if (attempt < maxRetries - 1) {
        const delay = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s
        console.log(`Fetch attempt ${attempt + 1} failed, retrying in ${delay}ms...`, lastError);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  console.error(`Fetch failed after ${maxRetries} attempts:`, lastError);
  return null;
}

/**
 * Fetch Spigot with minimal options to bypass CORS issues
 */
async function fetchSpigotWithMinimalOptions(url: string): Promise<Response | null> {
  try {
    // Spigot has aggressive CORS, so use minimal options
    const response = await fetch(url, {
      method: 'GET',
      mode: 'cors',
      signal: AbortSignal.timeout(10000),
    });
    return response;
  } catch (error) {
    console.warn("✗ Spigot fetch failed (CORS):", error);
    return null;
  }
}

// 1. Standard-Optionen für APIs, die strikte Header erlauben (Modrinth, Hangar)
const getStrictFetchOptions = () => ({
  mode: "cors" as RequestMode,
  cache: "no-store" as RequestCache,
  signal: AbortSignal.timeout(15000), // 15 second timeout
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
  signal: AbortSignal.timeout(15000), // 15 second timeout
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
      const spigotResponse = await fetchSpigotWithMinimalOptions(spigotUrl);
      if (spigotResponse?.ok) {
        const spigotData = await spigotResponse.json();
        spigotDownloads = spigotData.downloads || 0;
        console.log("✓ Spigot downloads:", spigotDownloads);
      }
    } catch (error) {
      console.warn("✗ Could not fetch Spigot data (non-critical):", error);
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
    
    console.log("Fetching all versions...");
    
    // Fetch from Modrinth with retry (primary source)
    const modrinthRes = await fetchWithRetry(modrinthUrl, getStrictFetchOptions());
    
    if (!modrinthRes?.ok) {
      console.warn("✗ Modrinth versions fetch failed");
      return [];
    }

    const versions: ModrinthVersion[] = await modrinthRes.json();
    console.log(`✓ Fetched ${versions.length} versions from Modrinth`);
    
    // Optionally fetch from Hangar and Spigot (for enrichment, but not required)
    let hangarVersions: any[] = [];
    let spigotVersions: any[] = [];

    try {
      const hangarRes = await fetchWithRetry(
        `https://hangar.papermc.io/api/v1/projects/Baumkrieger69/AdvancedDeliveryDrones/versions?limit=100`,
        getStrictFetchOptions()
      );
      if (hangarRes?.ok) {
        const hangarData = await hangarRes.json();
        hangarVersions = hangarData.result || [];
        console.log(`✓ Fetched ${hangarVersions.length} versions from Hangar`);
      }
    } catch (e) {
      console.warn("Could not fetch Hangar versions (non-critical)");
    }

    // Skip Spigot due to CORS issues - it's not critical for version display
    console.log("ℹ Skipping Spigot versions (CORS limitations)");

    const enrichedVersions = versions.map((v) => {
      const versionNumber = v.version_number;
      const hangarMatch = hangarVersions.find((hv: any) => hv.name === versionNumber);

      return {
        ...v,
        hangar_downloads: hangarMatch ? hangarMatch.stats?.totalDownloads || 0 : 0,
        spigot_downloads: 0, // Not fetched due to CORS
      };
    });

    console.log(`✓ Returning ${enrichedVersions.slice(0, limit).length} versions`);
    return enrichedVersions.slice(0, limit);
  } catch (error) {
    console.error("✗ Error fetching versions list:", error);
    return [];
  }
}

/**
 * Holt alle Download-Statistiken komplett live von Modrinth, Hangar und Spigot.
 * Mit Retry-Logik für instabile mobile Netzwerke.
 */
export async function fetchDownloadStats(): Promise<DownloadStats> {
  try {
    const timestamp = Date.now();
    
    console.log("Starting fetch of download stats from all platforms...");
    
    // Fetch Modrinth and Hangar with retry (they have better CORS)
    // Fetch Spigot with minimal options (aggressive CORS)
    const [modrinthRes, hangarRes, spigotRes] = await Promise.all([
      fetchWithRetry(`https://api.modrinth.com/v2/project/advanceddeliverydrones?_t=${timestamp}`, getStrictFetchOptions()),
      fetchWithRetry(`https://hangar.papermc.io/api/v1/projects/Baumkrieger69/AdvancedDeliveryDrones?_t=${timestamp}`, getStrictFetchOptions()),
      fetchSpigotWithMinimalOptions(`${SPIGOT_RESOURCE_API}?_t=${timestamp}`),
    ]);

    let modrinthDownloads: number | null = null;
    let hangarDownloads: number | null = null;
    let spigotDownloads: number | null = null;
    let hasAnySuccess = false;

    if (modrinthRes?.ok) {
      try {
        const modrinthData = await modrinthRes.json();
        modrinthDownloads = modrinthData.downloads || 0;
        hasAnySuccess = true;
        console.log("✓ Modrinth downloads:", modrinthDownloads);
      } catch (e) {
        console.warn("✗ Failed to parse Modrinth response:", e);
      }
    } else {
      console.warn(`✗ Modrinth API failed or returned ${modrinthRes?.status}`);
    }

    if (hangarRes?.ok) {
      try {
        const hangarData = await hangarRes.json();
        hangarDownloads = hangarData.stats?.downloads || 0;
        hasAnySuccess = true;
        console.log("✓ Hangar downloads:", hangarDownloads);
      } catch (e) {
        console.warn("✗ Failed to parse Hangar response:", e);
      }
    } else {
      console.warn(`✗ Hangar API failed or returned ${hangarRes?.status}`);
    }

    if (spigotRes?.ok) {
      try {
        const spigotData = await spigotRes.json();
        spigotDownloads = spigotData.downloads || 0;
        hasAnySuccess = true;
        console.log("✓ Spigot downloads:", spigotDownloads);
      } catch (e) {
        console.warn("✗ Failed to parse Spigot response:", e);
        // Spigot is optional, continue without it
      }
    } else {
      console.warn(`✗ Spigot API failed (CORS issue - non-critical)`);
      // Spigot often fails due to CORS - this is expected and acceptable
    }

    // If at least one API succeeded, use the real data
    if (hasAnySuccess) {
      const result = {
        modrinth: modrinthDownloads ?? 0,
        hangar: hangarDownloads ?? 0,
        spigot: spigotDownloads ?? 0,
        total: (modrinthDownloads ?? 0) + (hangarDownloads ?? 0) + (spigotDownloads ?? 0),
      };
      console.log("✓ Download stats fetched successfully:", result);
      return result;
    }

    // If no API succeeded, use demo data
    console.warn("✗ All APIs failed, using demo data");
    return DEMO_DOWNLOAD_STATS;
  } catch (error) {
    console.error("✗ Error fetching download stats:", error);
    return DEMO_DOWNLOAD_STATS;
  }
}