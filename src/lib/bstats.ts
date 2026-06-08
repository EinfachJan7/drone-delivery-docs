// bStats API integration for Advanced Delivery Drones plugin
const PLUGIN_ID = import.meta.env.VITE_BSTATS_PLUGIN_ID || "31663";
const BSTATS_API = "https://bstats.org/api/v1/plugins";

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
        console.log(`bStats attempt ${attempt + 1} failed, retrying in ${delay}ms...`, lastError);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  console.error(`bStats fetch failed after ${maxRetries} attempts:`, lastError);
  return null;
}

export interface BStatsLatest {
  servers: number;
  players: number;
  serversSeries: Array<[number, number]>;
  playersSeries: Array<[number, number]>;
}

export interface BStatsBreakdowns {
  minecraftVersion: Array<{ name: string; y: number }>;
  serverSoftware: Array<{ name: string; y: number }>;
  javaVersion: Array<{ name: string; y: number }>;
  coreCount: Array<{ name: string; y: number }>;
  osArch: Array<{ name: string; y: number }>;
}

// Demo data for development/fallback
const DEMO_LATEST: BStatsLatest = {
  servers: 1240,
  players: 18560,
  serversSeries: Array.from({ length: 288 }, (_, i) => [
    Date.now() - (287 - i) * 5 * 60 * 1000,
    950 + Math.floor(Math.sin(i / 50) * 100),
  ]) as Array<[number, number]>,
  playersSeries: Array.from({ length: 288 }, (_, i) => [
    Date.now() - (287 - i) * 5 * 60 * 1000,
    17500 + Math.floor(Math.sin(i / 40) * 2000),
  ]) as Array<[number, number]>,
};

const DEMO_BREAKDOWNS: BStatsBreakdowns = {
  minecraftVersion: [
    { name: "1.21", y: 480 },
    { name: "1.20.4", y: 350 },
    { name: "1.20.1", y: 240 },
    { name: "1.19.2", y: 170 },
  ],
  serverSoftware: [
    { name: "Paper", y: 650 },
    { name: "Spigot", y: 380 },
    { name: "Purpur", y: 120 },
    { name: "Bukkit", y: 90 },
  ],
  javaVersion: [
    { name: "Java 21", y: 540 },
    { name: "Java 17", y: 450 },
    { name: "Java 11", y: 200 },
    { name: "Java 8", y: 50 },
  ],
  coreCount: [
    { name: "4 cores", y: 320 },
    { name: "8 cores", y: 480 },
    { name: "16 cores", y: 280 },
    { name: "32+ cores", y: 160 },
  ],
  osArch: [
    { name: "x86_64", y: 1050 },
    { name: "aarch64", y: 190 },
  ],
};

export async function fetchBstatsLatest(): Promise<BStatsLatest> {
  try {
    const response = await fetchWithRetry(`${BSTATS_API}/${PLUGIN_ID}`, {
      mode: 'cors',
      signal: AbortSignal.timeout(15000),
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response?.ok) {
      console.warn(`bStats API error, using demo data`);
      return DEMO_LATEST;
    }

    const data = await response.json();
    
    // Get chart IDs from metadata
    const serverChartId = data.charts?.servers?.uid;
    const playerChartId = data.charts?.players?.uid;

    let servers = 0;
    let players = 0;
    let serversSeries: Array<[number, number]> = [];
    let playersSeries: Array<[number, number]> = [];

    // Fetch servers data
    if (serverChartId) {
      try {
        const serverData = await fetchWithRetry(`${BSTATS_API}/${PLUGIN_ID}/charts/servers/data`, {
          mode: 'cors',
          signal: AbortSignal.timeout(15000),
          headers: { 'Accept': 'application/json' },
        });
        if (serverData?.ok) {
          const serversArray = await serverData.json();
          if (Array.isArray(serversArray) && serversArray.length > 0) {
            servers = serversArray[serversArray.length - 1][1] || 0;
            serversSeries = serversArray.slice(-288) as Array<[number, number]>;
          }
        }
      } catch (e) {
        console.error("Failed to fetch servers data:", e);
      }
    }

    // Fetch players data
    if (playerChartId) {
      try {
        const playerData = await fetchWithRetry(`${BSTATS_API}/${PLUGIN_ID}/charts/players/data`, {
          mode: 'cors',
          signal: AbortSignal.timeout(15000),
          headers: { 'Accept': 'application/json' },
        });
        if (playerData?.ok) {
          const playersArray = await playerData.json();
          if (Array.isArray(playersArray) && playersArray.length > 0) {
            players = playersArray[playersArray.length - 1][1] || 0;
            playersSeries = playersArray.slice(-288) as Array<[number, number]>;
          }
        }
      } catch (e) {
        console.error("Failed to fetch players data:", e);
      }
    }

    return {
      servers,
      players,
      serversSeries,
      playersSeries,
    };
  } catch (error) {
    console.error("Failed to fetch bStats latest data:", error);
    return DEMO_LATEST;
  }
}

export async function fetchBstatsBreakdowns(): Promise<BStatsBreakdowns> {
  try {
    const response = await fetchWithRetry(`${BSTATS_API}/${PLUGIN_ID}`, {
      mode: 'cors',
      signal: AbortSignal.timeout(15000),
      headers: {
        'Accept': 'application/json',
      },
    });
    if (!response?.ok) {
      console.warn(`bStats API error, using demo data`);
      return DEMO_BREAKDOWNS;
    }

    let minecraftVersion: Array<{ name: string; y: number }> = [];
    let serverSoftware: Array<{ name: string; y: number }> = [];
    let javaVersion: Array<{ name: string; y: number }> = [];
    let coreCount: Array<{ name: string; y: number }> = [];
    let osArch: Array<{ name: string; y: number }> = [];

    // Fetch individual chart data
    const chartNames = ['minecraftVersion', 'serverSoftware', 'javaVersion', 'coreCount', 'osArch'];

    for (const chartName of chartNames) {
      try {
        const chartResponse = await fetchWithRetry(`${BSTATS_API}/${PLUGIN_ID}/charts/${chartName}/data`, {
          mode: 'cors',
          signal: AbortSignal.timeout(15000),
          headers: { 'Accept': 'application/json' },
        });
        if (chartResponse?.ok) {
          const chartData = await chartResponse.json();
          console.log(`Chart ${chartName} data:`, chartData);
          
          let parsed: Array<{ name: string; y: number }> = [];
          
          // Handle different response formats
          if (Array.isArray(chartData)) {
            // Direct array format: [{name: '1.21.11', y: 1}]
            parsed = chartData.filter(item => item && typeof item === 'object' && 'name' in item && 'y' in item);
          } else if (typeof chartData === 'object' && chartData !== null) {
            // Object format - prefer seriesData over drilldownData
            if (Array.isArray(chartData.seriesData)) {
              parsed = chartData.seriesData.filter(item => item && 'name' in item && 'y' in item);
            } else if (Array.isArray(chartData.drilldownData)) {
              parsed = chartData.drilldownData
                .filter(item => item && 'name' in item)
                .map(item => ({ name: item.name, y: 1 })); // fallback mapping
            }
          }
          
          // Sort by y value descending
          parsed = parsed.sort((a, b) => b.y - a.y);
          
          if (chartName === 'minecraftVersion') minecraftVersion = parsed;
          else if (chartName === 'serverSoftware') serverSoftware = parsed;
          else if (chartName === 'javaVersion') javaVersion = parsed;
          else if (chartName === 'coreCount') coreCount = parsed;
          else if (chartName === 'osArch') osArch = parsed;
        }
      } catch (e) {
        console.warn(`Failed to fetch ${chartName}:`, e);
      }
    }

    return {
      minecraftVersion: minecraftVersion.length > 0 ? minecraftVersion : DEMO_BREAKDOWNS.minecraftVersion,
      serverSoftware: serverSoftware.length > 0 ? serverSoftware : DEMO_BREAKDOWNS.serverSoftware,
      javaVersion: javaVersion.length > 0 ? javaVersion : DEMO_BREAKDOWNS.javaVersion,
      coreCount: coreCount.length > 0 ? coreCount : DEMO_BREAKDOWNS.coreCount,
      osArch: osArch.length > 0 ? osArch : DEMO_BREAKDOWNS.osArch,
    };
  } catch (error) {
    console.error("Failed to fetch bStats breakdowns:", error);
    return DEMO_BREAKDOWNS;
  }
}
