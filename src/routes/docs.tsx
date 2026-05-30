import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { Github, Download, Terminal, Shield, Code2, Settings2, Languages, Sparkles, Cpu, Radio, Package, Lock, Zap } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/docs")({
  head: () => ({
    meta: [
      { title: "Documentation — Advanced Delivery Drones" },
      {
        name: "description",
        content: "Physical drone delivery system for Minecraft Paper servers.",
      },
      { property: "og:title", content: "Advanced Delivery Drones Documentation" },
      { property: "og:description", content: "Complete guide for drone deliveries." },
      { property: "og:url", content: "/docs" },
    ],
    links: [{ rel: "canonical", href: "/docs" }],
  }),
  component: DocsPage,
});

const tabs = [
  { id: "features", label: "Features", icon: Sparkles },
  { id: "commands", label: "Commands", icon: Terminal },
  { id: "permissions", label: "Permissions", icon: Shield },
  { id: "configuration", label: "Configuration", icon: Settings2 },
  { id: "placeholders", label: "PlaceholderAPI", icon: Code2 },
];

const features = [
  {
    icon: Cpu,
    title: "Custom Drone Appearance",
    desc: "Player-head skulls or custom items via Nexo, Oraxen, ItemsAdder. Glowing entity outline toggle.",
  },
  {
    icon: Radio,
    title: "Physical Drone Flight",
    desc: "0.3 b/t cruise speed with startup, approach phases &amp; smooth eased landing. 3-second launch animations.",
  },
  {
    icon: Package,
    title: "Package System",
    desc: "Compose GUIs (9–54 slots). Collection animation &amp; auto-unload into nearby containers.",
  },
  {
    icon: Lock,
    title: "Delivery Sockets",
    desc: "Global delivery points (max 3/player) with UUID trust lists &amp; per-socket blacklists.",
  },
  {
    icon: Shield,
    title: "Blacklist & Controls",
    desc: "UUID-based player blocking, toggle receiving, decline drones, send cooldowns.",
  },
  {
    icon: Zap,
    title: "Performance & Optimization",
    desc: "Chunk-loading cooldown, batch processing, throttled particles, cached flight paths.",
  },
];

const commandGroups = [
  {
    title: "Sending & Receiving",
    rows: [
      { cmd: "/drone send <player>", desc: "Open compose GUI, select player, add items/animals, send with animation.", perm: "drone.send.players" },
      { cmd: "/drone cancel", desc: "Cancel all outgoing drones (flying only). Items/animals return to sender.", perm: "drone.cancel" },
      { cmd: "/drone preview <uuid>", desc: "View incoming drone contents without picking up.", perm: "drone.preview" },
      { cmd: "/drone toggle", desc: "Toggle receiving drones on/off. Persists in players.yml.", perm: "drone.toggle" },
      { cmd: "/drone decline", desc: "Decline all incoming drones (flying &amp; landed). Items return to senders.", perm: "drone.decline" },
      { cmd: "/drone locate", desc: "Show particle trail to nearest landed drone with sender name &amp; distance.", perm: "drone.locate" },
    ],
  },
  {
    title: "Player Blacklist",
    rows: [
      { cmd: "/drone blacklist", desc: "Open blacklist GUI to manage blocked players.", perm: "drone.blacklist" },
      { cmd: "/drone blacklist player add [player]", desc: "Block player by UUID. Blocks direct deliveries only.", perm: "drone.blacklist.player.add" },
      { cmd: "/drone blacklist player remove [player]", desc: "Unblock player. Removes from personal blacklist.", perm: "drone.blacklist.player.remove" },
      { cmd: "/drone blacklist player list", desc: "List all blocked players with count.", perm: "drone.blacklist.player.list" },
    ],
  },
  {
    title: "Sockets",
    rows: [
      { cmd: "/drone socket place <name>", desc: "Create global socket at your location. Max 3 per player. UUID-owned.", perm: "drone.socket.place" },
      { cmd: "/drone socket remove <name>", desc: "Delete your socket permanently.", perm: "drone.socket.remove" },
      { cmd: "/drone socket list", desc: "Show all your sockets with coordinates &amp; available slots.", perm: "drone.socket.list" },
      { cmd: "/drone socket send <name>", desc: "Send drone to named socket via compose GUI.", perm: "drone.socket.send" },
      { cmd: "/drone socket manage", desc: "Edit trust lists, blacklists, rename sockets via GUI.", perm: "drone.socket.manage" },
      { cmd: "/drone socket rename <old> <new>", desc: "Rename socket. New name must be globally unique.", perm: "drone.socket.rename" },
      { cmd: "/drone socket trust <socket> <player>", desc: "Add player to socket trust list (pickup permission).", perm: "drone.socket.trust" },
      { cmd: "/drone socket untrust <socket> <player>", desc: "Remove player from socket trust list.", perm: "drone.socket.untrust" },
      { cmd: "/drone socket blacklist add <socket> <player>", desc: "Block sender from delivering to socket.", perm: "drone.socket.blacklist" },
      { cmd: "/drone socket blacklist remove <socket> <player>", desc: "Unblock sender from socket.", perm: "drone.socket.blacklist" },
      { cmd: "/drone socket blacklist list <socket>", desc: "View blocked senders for socket.", perm: "drone.socket.blacklist" },
    ],
  },
  {
    title: "Admin",
    rows: [
      { cmd: "/drone admin send <x> <y> <z> [world]", desc: "Admin sends drone to coordinates. Bypasses all checks.", perm: "drone.admin.send" },
      { cmd: "/drone list", desc: "List all active drones with status, senders, receivers &amp; teleport links.", perm: "drone.admin.list" },
      { cmd: "/drone reload", desc: "Reload config, GUI &amp; language files. No server restart.", perm: "drone.admin.reload" },
    ],
  },
];

const permissions = [
  { node: "drone.send", desc: "Parent node for all send operations. Grants drone.send.players &amp; drone.cancel. Respects cooldown &amp; blacklist checks.", def: "true" },
  { node: "drone.send.players", desc: "Send drones to online players. Opens compose GUI with player list. Subject to cooldown timer &amp; player blacklist. Can be toggled per receiver.", def: "true" },
  { node: "drone.cancel", desc: "Cancel active (flying) outgoing drones. Items/animals returned to sender. No effect on landed drones. Separate from drone.send.", def: "true" },
  { node: "drone.use", desc: "Parent node for receiver operations (preview, toggle, decline, locate). Grants all child permissions.", def: "true" },
  { node: "drone.preview", desc: "Read-only preview of incoming drone inventory &amp; animals. Does not modify contents. Useful for confirming suspicious deliveries.", def: "true" },
  { node: "drone.toggle", desc: "Enable/disable personal drone receiving. Toggles can-receive flag. Blacklist still applies even when disabled. Persistent storage in players.yml.", def: "true" },
  { node: "drone.decline", desc: "Bulk-decline all incoming drones (flying &amp; landed). Returns items to senders. One command = all current drones rejected.", def: "true" },
  { node: "drone.locate", desc: "Show particle trail to nearest landed drone in current world. Shows sender name, distance, &amp; coordinates. Works across chunks.", def: "true" },
  { node: "drone.blacklist", desc: "Parent node for blacklist management. Grants drone.blacklist.player.* child permissions.", def: "true" },
  { node: "drone.blacklist.player.*", desc: "Add, remove, &amp; list players on personal blacklist. Blocks direct deliveries from blacklisted players. Socket sends bypass this unless socket-blacklisted.", def: "true" },
  { node: "drone.socket", desc: "Parent node for all socket operations. Grants all socket.* subcommands. Required for socket-based deliveries.", def: "true" },
  { node: "drone.socket.*", desc: "Individual socket subcommands: place, remove, list, send, manage, rename, trust, untrust, blacklist. Each can be restricted separately via LuckPerms.", def: "true" },
  { node: "drone.admin", desc: "Parent node for admin operations. Requires OP or LuckPerms grant. Grants all admin subcommands.", def: "OP" },
  { node: "drone.admin.send", desc: "Send drones to arbitrary coordinates as admin. Receiver is always the sender (admin). Bypasses permission &amp; cooldown checks. Useful for server events &amp; testing.", def: "OP" },
  { node: "drone.admin.list", desc: "List all active drones server-wide with teleport links. Shows flying &amp; landed drones. Real-time updates.", def: "OP" },
  { node: "drone.admin.reload", desc: "Reload all config, GUI, &amp; language files without restarting server. Active drones unaffected. New configs apply to subsequent drones.", def: "OP" },
];

const configKeys = [
  { key: "language", desc: "Locale for all messages (de_DE, en_EN, es_ES, fr_FR, ru_RU, zh_CN). Live reload with /drone reload. Separate language file per locale with MiniMessage formatting." },
  { key: "players-enabled", desc: "Enable/disable all player-to-player drone deliveries. When false, /drone send is unavailable. Sockets remain functional if sockets-enabled is true." },
  { key: "sockets-enabled", desc: "Enable/disable entire socket system. When false, all socket commands are blocked. Player-to-player remains available if players-enabled is true." },
  { key: "settings.drone.speed", desc: "Cruise flight speed in blocks per tick. Default 0.3 b/t (typical flight ~30 blocks/second). Higher values = faster drones but more lag." },
  { key: "settings.drone.startup-speed", desc: "Speed during initial startup phase in blocks per tick. Default 0.2 b/t. Slower than cruise for smooth launch. Uses cubic ease-in-out easing." },
  { key: "settings.drone.startup-seconds", desc: "Duration of startup phase in seconds. Default 3s. Phase ends before cruise begins. Launch animation plays concurrently." },
  { key: "settings.drone.approach-speed", desc: "Final approach speed (landing phase) in blocks per tick. Default 0.2 b/t. Slower for precise landing." },
  { key: "settings.drone.approach-distance", desc: "Distance threshold to begin approach phase in blocks. Default 150 blocks. Activates when drone within this distance of target." },
  { key: "settings.drone.delivery-radius", desc: "Maximum radius for landing zone in blocks. Drone lands within this radius of target player. Affects airborne follow activation." },
  { key: "settings.drone.inventory-size", desc: "Compose GUI inventory size (9-54 slots, must be multiple of 9). Default 54 (6x9 chest). 9 = single row." },
  { key: "settings.drone.despawn-time-minutes", desc: "Minutes until landed drone despawns. Default 10. Timer starts AFTER landing, not during flight. Collection animation plays on despawn (if COLLECT mode)." },
  { key: "settings.drone.despawn-mode", desc: "COLLECT = return items to sender, DELETE = destroy items. Modes affect what happens when timer expires or /decline is used." },
  { key: "settings.drone.max-active-per-sender", desc: "Max concurrent outgoing drones per player. Default 3. Sender cannot launch new drone until one lands. Affects server performance with many players." },
  { key: "settings.drone.max-sockets-per-player", desc: "Max socket count per player. Default 3. Player cannot place more sockets once limit reached. Affects storage &amp; memory usage." },
  { key: "settings.drone.max-leashed-animals-per-drone", desc: "Max animals per drone delivery. Default 5. If set to 0, animal transport disabled entirely." },
  { key: "settings.drone.carry-leashed-animals", desc: "Enable/disable animal transport feature entirely. When false, animal selection GUI hidden from compose flow." },
  { key: "settings.drone.follow-gliding-player", desc: "Enable elytra-glide following. When enabled, drone tracks player during elytra flight with +5 block Y-offset." },
  { key: "settings.drone.follow-airborne-player-before-landing", desc: "Enable airborne follow. When enabled, drone tracks airborne receiver before first ground contact (fallfollow)." },
  { key: "settings.drone.airborne-follow-min-height", desc: "Min height above ground to trigger airborne follow in blocks. Default 5. Players below this height won't trigger follow." },
  { key: "settings.drone.airborne-follow-max-seconds-after-start", desc: "Max duration of airborne follow in seconds after launch. Default 15. Prevents infinite following loops." },
  { key: "settings.drone.send-cooldown-seconds-player", desc: "Cooldown between player-to-player sends in seconds. Default 0 (no cooldown). Enforced per-player in players.yml." },
  { key: "settings.drone.send-cooldown-seconds-socket", desc: "Cooldown between socket sends in seconds. Default 0. Separate from player cooldown - both are checked." },
  { key: "settings.drone.allow-send-to-self-player", desc: "Allow player to send drone to themselves. When false, self-sends blocked in player selection GUI." },
  { key: "settings.drone.allow-send-to-self-socket", desc: "Allow player to send drone to their own sockets. When false, socket send to self blocked." },
  { key: "settings.drone.blocked-worlds", desc: "YAML list of world names where drone sends are forbidden (case-insensitive). Example: [nether, end, pvp_zone]." },
  { key: "launch-animation.enabled", desc: "Enable 3-second launch animation (rise + spin). When disabled, drone starts flying immediately without visual effect." },
  { key: "launch-animation.duration-ticks", desc: "Duration of launch animation in ticks (20 ticks = 1 second). Overrides startup-seconds for animation only." },
  { key: "hologram.enabled", desc: "Show hologram above landed drones with recipient name. When disabled, no name tag visible above drone." },
  { key: "hologram.show-despawn-countdown", desc: "Display countdown timer in hologram (e.g., 'Expires in 5:30'). Updates every second when enabled." },
  { key: "bossbar.enabled", desc: "Show boss bar to receiver during drone flight. When disabled, no progress bar shown." },
  { key: "bossbar.show-distance-and-eta", desc: "Show distance &amp; ETA in boss bar title. When disabled, only 'Incoming Drone' shown." },
  { key: "locate-particles.enabled", desc: "Enable particle trail for /drone locate command. When disabled, command still works but no visual effect." },
  { key: "collection-animation.enabled", desc: "Enable 2-second collection animation when receiver picks up drone. Drone rises 3 blocks with particles &amp; sound. When disabled, instant pickup." },
  { key: "container-integration.enabled", desc: "Enable auto-unload into nearby containers (chests, hoppers, etc.). When disabled, drone must be manually picked up." },
  { key: "container-integration.search-radius", desc: "Search radius in blocks for auto-unload. Default 0 = exact location only. Radius &gt; 0 triggers spiral search &amp; fine-pass coarse optimization." },
  { key: "discord.enabled", desc: "Enable Discord webhook notifications for drone events (sent, delivered, declined, etc.). Requires valid webhook URL in config." },
  { key: "custom-model.provider", desc: "Drone model provider: NONE (default player skull), NEXO, ORAXEN, or ITEMSADDER. Requires plugin installed if not NONE." },
  { key: "custom-model.item-id", desc: "Item ID for custom drone model when provider is not NONE. Example: 'nexo:custom_drone'. Must exist in provider plugin." },
  { key: "glowing-enabled", desc: "Enable entity outline glow effect on drone (makes it glow through walls). When disabled, drone is not outlined." },
];

const phPlayer = [
  { ph: "can_receive", desc: "Can receive drones (true/false)" },
  { ph: "receive_enabled", desc: "Alias for can_receive" },
  { ph: "outgoing_count", desc: "Outgoing drones (as sender)" },
  { ph: "incoming_count", desc: "Incoming drones (as receiver)" },
  { ph: "incoming_flying_count", desc: "Incoming drones still flying" },
  { ph: "incoming_landed_count", desc: "Incoming drones landed" },
  { ph: "active_outgoing", desc: "Active send slots used" },
  { ph: "outgoing_active", desc: "Alias for active_outgoing" },
  { ph: "active_slots_max", desc: "Max concurrent outgoing drones" },
  { ph: "max_active", desc: "Alias for active_slots_max" },
  { ph: "can_send", desc: "May send another drone" },
  { ph: "can_launch", desc: "Alias for can_send" },
  { ph: "blacklist_count", desc: "Players on personal blacklist" },
  { ph: "blacklist_names", desc: "Blacklisted player names (comma-separated)" },
  { ph: "socket_count", desc: "Owned sockets" },
  { ph: "socket_max", desc: "Max sockets per player" },
  { ph: "max_sockets", desc: "Alias for socket_max" },
  { ph: "socket_names", desc: "Socket names (comma-separated)" },
  { ph: "socket_slots_free", desc: "Remaining socket slots" },
  { ph: "cooldown_player", desc: "Player send cooldown (config, seconds)" },
  { ph: "send_cooldown_player", desc: "Alias for cooldown_player" },
  { ph: "cooldown_socket", desc: "Socket send cooldown (config, seconds)" },
  { ph: "send_cooldown_socket", desc: "Alias for cooldown_socket" },
  { ph: "cooldown_player_remaining", desc: "Remaining player cooldown (seconds)" },
  { ph: "cooldown_socket_remaining", desc: "Remaining socket cooldown (seconds)" },
  { ph: "pending_returns", desc: "Pending return item stacks" },
  { ph: "has_incoming", desc: "Has incoming drones (boolean)" },
  { ph: "has_outgoing", desc: "Has outgoing drones (boolean)" },
  { ph: "has_landed_incoming", desc: "Has landed incoming drones (boolean)" },
  { ph: "nearest_landed_distance", desc: "Distance to nearest landed drone (metres)" },
  { ph: "nearest_landed_world", desc: "World of nearest landed drone" },
  { ph: "nearest_landed_x", desc: "X coordinate of nearest landed drone" },
  { ph: "nearest_landed_y", desc: "Y coordinate of nearest landed drone" },
  { ph: "nearest_landed_z", desc: "Z coordinate of nearest landed drone" },
  { ph: "nearest_landed_uuid", desc: "Drone UUID of nearest landed drone" },
  { ph: "nearest_landed_sender", desc: "Sender name of nearest landed drone" },
  { ph: "nearest_landed_sender_name", desc: "Alias for nearest_landed_sender" },
  { ph: "players_enabled", desc: "Player-to-player deliveries enabled" },
  { ph: "sockets_enabled", desc: "Socket system enabled" },
  { ph: "glowing_enabled", desc: "Drone glow effect enabled" },
  { ph: "custom_model_provider", desc: "Current custom model provider" },
  { ph: "custom_model_item_id", desc: "Current custom model item ID" },
  { ph: "version", desc: "Plugin version" },
  { ph: "plugin_version", desc: "Alias for version" },
  { ph: "database_type", desc: "Database storage type" },
  { ph: "language", desc: "Current language locale" },
];

function DocsPage() {
  const [activeTab, setActiveTab] = useState("features");

  return (
    <SiteLayout>
      <section className="container-page py-16">
        {/* Header */}
        <header className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight">Documentation</h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Physical drone deliveries for Paper servers
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <a href="https://github.com/EinfachJan7/AdvancedDeliveryDrones/releases" target="_blank" rel="noreferrer" className="btn-brand h-10 text-sm">
              <Download className="h-4 w-4" /> Latest release
            </a>
            <a href="https://github.com/EinfachJan7/AdvancedDeliveryDrones" target="_blank" rel="noreferrer" className="btn-ghost h-10 text-sm">
              <Github className="h-4 w-4" /> Source
            </a>
          </div>
        </header>

        {/* Tab Navigation */}
        <div className="mb-8 border-b border-white/10">
          <div className="flex flex-wrap gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 rounded-t-md px-4 py-2 text-sm font-medium transition ${
                    activeTab === tab.id
                      ? "border-b-2 border-[var(--color-accent)] bg-white/5 text-foreground"
                      : "text-muted-foreground hover:bg-white/5"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="animate-in fade-in duration-200">
          {/* Features */}
          {activeTab === "features" && (
            <div>
              <h2 className="mb-6 text-2xl font-bold">Features</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {features.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <div key={feature.title} className="card-surface space-y-3 p-6">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-accent)]/20">
                        <Icon className="h-5 w-5 text-[var(--color-accent)]" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{feature.title}</h3>
                        <p className="mt-2 text-sm text-muted-foreground">{feature.desc}</p>
                      </div>
                    </div>
                  );
                })}
                {/* Additional Features */}
                <div className="card-surface space-y-3 p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-accent)]/20">
                    <Sparkles className="h-5 w-5 text-[var(--color-accent)]" />
                  </div>
                  <div>
                    <h3 className="font-semibold">🪂 Elytra & Airborne Follow</h3>
                    <p className="mt-2 text-sm text-muted-foreground">Drone tracks gliding receivers (+5 Y-offset) &amp; airborne players (&gt;5 blocks high). Dynamic relocation on ground contact.</p>
                  </div>
                </div>
                <div className="card-surface space-y-3 p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-accent)]/20">
                    <Sparkles className="h-5 w-5 text-[var(--color-accent)]" />
                  </div>
                  <div>
                    <h3 className="font-semibold">🐾 Animal Transport</h3>
                    <p className="mt-2 text-sm text-muted-foreground">Send leashed animals via GUI. Invulnerable in transit, respawned at destination. Configurable max per drone.</p>
                  </div>
                </div>
                <div className="card-surface space-y-3 p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-accent)]/20">
                    <Sparkles className="h-5 w-5 text-[var(--color-accent)]" />
                  </div>
                  <div>
                    <h3 className="font-semibold">🔔 Discord Webhooks</h3>
                    <p className="mt-2 text-sm text-muted-foreground">Real-time webhook notifications for sent, delivered, declined &amp; expired drones with rich embeds.</p>
                  </div>
                </div>
                <div className="card-surface space-y-3 p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-accent)]/20">
                    <Sparkles className="h-5 w-5 text-[var(--color-accent)]" />
                  </div>
                  <div>
                    <h3 className="font-semibold">🖥 GUIs & Customization</h3>
                    <p className="mt-2 text-sm text-muted-foreground">Main menu, player/socket selection, socket edit with sign rename. Live reload with /drone reload.</p>
                  </div>
                </div>
                <div className="card-surface space-y-3 p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-accent)]/20">
                    <Sparkles className="h-5 w-5 text-[var(--color-accent)]" />
                  </div>
                  <div>
                    <h3 className="font-semibold">💾 Persistence & Safety</h3>
                    <p className="mt-2 text-sm text-muted-foreground">UUID-based tracking with YAML storage. Server restart returns items to senders &amp; cleans orphaned entities.</p>
                  </div>
                </div>
                <div className="card-surface space-y-3 p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-accent)]/20">
                    <Sparkles className="h-5 w-5 text-[var(--color-accent)]" />
                  </div>
                  <div>
                    <h3 className="font-semibold">📍 Locate Landed Drones</h3>
                    <p className="mt-2 text-sm text-muted-foreground">/drone locate shows particle trail to nearest drone. Displays sender name, distance &amp; coordinates.</p>
                  </div>
                </div>
                <div className="card-surface space-y-3 p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-accent)]/20">
                    <Sparkles className="h-5 w-5 text-[var(--color-accent)]" />
                  </div>
                  <div>
                    <h3 className="font-semibold">✨ Hologram & Boss Bar</h3>
                    <p className="mt-2 text-sm text-muted-foreground">Hologram shows recipient name &amp; live despawn countdown. Boss bar displays distance &amp; ETA.</p>
                  </div>
                </div>
                <div className="card-surface space-y-3 p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-accent)]/20">
                    <Sparkles className="h-5 w-5 text-[var(--color-accent)]" />
                  </div>
                  <div>
                    <h3 className="font-semibold">🌐 Multi-Language Support</h3>
                    <p className="mt-2 text-sm text-muted-foreground">6 languages built-in (de_DE, en_EN, es_ES, fr_FR, ru_RU, zh_CN). MiniMessage formatting with live reload.</p>
                  </div>
                </div>
              </div>
            </div>
          )}


          {/* Commands */}
          {activeTab === "commands" && (
            <div>
              <h2 className="mb-6 text-2xl font-bold">Commands</h2>
              <p className="mb-6 text-sm text-muted-foreground">Root: <code className="code-inline">/drone</code> — Opens main GUI when run without arguments.</p>
              <div className="space-y-6">
                {commandGroups.map((group) => (
                  <div key={group.title}>
                    <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">{group.title}</h3>
                    <div className="card-surface overflow-hidden">
                      <table className="table-docs">
                        <thead>
                          <tr>
                            <th>Command</th>
                            <th>Description</th>
                            <th>Permission</th>
                          </tr>
                        </thead>
                        <tbody>
                          {group.rows.map((row) => (
                            <tr key={row.cmd}>
                              <td><code className="code-inline text-xs">{row.cmd}</code></td>
                              <td className="text-muted-foreground">{row.desc}</td>
                              <td><code className="code-inline text-xs">{row.perm}</code></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Permissions */}
          {activeTab === "permissions" && (
            <div>
              <h2 className="mb-6 text-2xl font-bold">Permissions</h2>
              <p className="mb-6 text-sm text-muted-foreground">Hierarchical permission tree. Parent nodes grant all children.</p>
              <div className="card-surface overflow-hidden">
                <table className="table-docs">
                  <thead>
                    <tr>
                      <th>Node</th>
                      <th>Description</th>
                      <th>Default</th>
                    </tr>
                  </thead>
                  <tbody>
                    {permissions.map((perm) => (
                      <tr key={perm.node}>
                        <td><code className="code-inline text-xs">{perm.node}</code></td>
                        <td className="text-muted-foreground">{perm.desc}</td>
                        <td><span className="badge-soft">{perm.def}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Configuration */}
          {activeTab === "configuration" && (
            <div>
              <h2 className="mb-6 text-2xl font-bold">Configuration</h2>
              <p className="mb-6 text-sm text-muted-foreground">All behavior in <code className="code-inline">config.yml</code>. GUIs in <code className="code-inline">gui.yml</code>. Use <code className="code-inline">/drone reload</code> to apply changes.</p>
              <div className="card-surface overflow-hidden">
                <table className="table-docs">
                  <thead>
                    <tr>
                      <th>Key</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {configKeys.map((config) => (
                      <tr key={config.key}>
                        <td className="whitespace-nowrap"><code className="code-inline text-xs">{config.key}</code></td>
                        <td className="text-muted-foreground">{config.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* PlaceholderAPI */}
          {activeTab === "placeholders" && (
            <div>
              <h2 className="mb-6 text-2xl font-bold">PlaceholderAPI</h2>
              <div className="card-surface mb-6 p-6">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Identifier</p>
                    <p className="mt-1 font-mono text-sm font-semibold">deliverydrones</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Syntax</p>
                    <p className="mt-1 font-mono text-sm">%deliverydrones_&lt;key&gt;%</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Test Command</p>
                    <p className="mt-1 font-mono text-sm">/papi parse me %deliverydrones_outgoing_count%</p>
                  </div>
                </div>
              </div>

              <h3 className="mb-4 text-lg font-semibold">Player Placeholders</h3>
              <div className="card-surface overflow-hidden mb-6">
                <table className="table-docs">
                  <thead>
                    <tr>
                      <th>Placeholder</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {phPlayer.map((ph) => (
                      <tr key={ph.ph}>
                        <td><code className="code-inline text-xs">%deliverydrones_{ph.ph}%</code></td>
                        <td className="text-muted-foreground text-sm">{ph.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h3 className="mb-4 text-lg font-semibold">Server Totals</h3>
              <div className="card-surface overflow-hidden mb-6">
                <table className="table-docs">
                  <tbody>
                    <tr>
                      <td><code className="code-inline text-xs">%deliverydrones_total_drones%</code></td>
                      <td className="text-muted-foreground text-sm">All active drones</td>
                    </tr>
                    <tr>
                      <td><code className="code-inline text-xs">%deliverydrones_total_flying%</code></td>
                      <td className="text-muted-foreground text-sm">Flying drones</td>
                    </tr>
                    <tr>
                      <td><code className="code-inline text-xs">%deliverydrones_total_landed%</code></td>
                      <td className="text-muted-foreground text-sm">Landed drones</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="mb-4 text-lg font-semibold">Outgoing / Incoming Drone Fields</h3>
              <p className="mb-3 text-xs text-muted-foreground">Use indexed placeholders like <code className="code-inline">%deliverydrones_outgoing_1_sender%</code> or omit index for first: <code className="code-inline">%deliverydrones_outgoing_sender%</code></p>
              <div className="card-surface overflow-hidden mb-6">
                <table className="table-docs">
                  <thead>
                    <tr>
                      <th>Field</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code className="code-inline text-xs">sender / sender_name</code></td>
                      <td className="text-muted-foreground text-sm">Sender player name</td>
                    </tr>
                    <tr>
                      <td><code className="code-inline text-xs">sender_uuid</code></td>
                      <td className="text-muted-foreground text-sm">Sender UUID</td>
                    </tr>
                    <tr>
                      <td><code className="code-inline text-xs">receiver / receiver_name</code></td>
                      <td className="text-muted-foreground text-sm">Receiver player name (socket owner for socket deliveries)</td>
                    </tr>
                    <tr>
                      <td><code className="code-inline text-xs">receiver_uuid</code></td>
                      <td className="text-muted-foreground text-sm">Receiver UUID</td>
                    </tr>
                    <tr>
                      <td><code className="code-inline text-xs">socket / socket_name</code></td>
                      <td className="text-muted-foreground text-sm">Socket name (empty if player delivery)</td>
                    </tr>
                    <tr>
                      <td><code className="code-inline text-xs">is_socket</code></td>
                      <td className="text-muted-foreground text-sm">Socket delivery (true/false)</td>
                    </tr>
                    <tr>
                      <td><code className="code-inline text-xs">uuid / id</code></td>
                      <td className="text-muted-foreground text-sm">Drone UUID</td>
                    </tr>
                    <tr>
                      <td><code className="code-inline text-xs">stand_uuid / entity_uuid</code></td>
                      <td className="text-muted-foreground text-sm">Armor stand entity UUID</td>
                    </tr>
                    <tr>
                      <td><code className="code-inline text-xs">world, x, y, z</code></td>
                      <td className="text-muted-foreground text-sm">Current position</td>
                    </tr>
                    <tr>
                      <td><code className="code-inline text-xs">target_world, target_x, target_y, target_z</code></td>
                      <td className="text-muted-foreground text-sm">Target position</td>
                    </tr>
                    <tr>
                      <td><code className="code-inline text-xs">distance / distance_target</code></td>
                      <td className="text-muted-foreground text-sm">Distance to target (metres)</td>
                    </tr>
                    <tr>
                      <td><code className="code-inline text-xs">eta / eta_seconds</code></td>
                      <td className="text-muted-foreground text-sm">Estimated arrival (seconds, 0 if landed)</td>
                    </tr>
                    <tr>
                      <td><code className="code-inline text-xs">flying / is_flying</code></td>
                      <td className="text-muted-foreground text-sm">In flight (boolean)</td>
                    </tr>
                    <tr>
                      <td><code className="code-inline text-xs">landed / is_landed</code></td>
                      <td className="text-muted-foreground text-sm">Landed (boolean)</td>
                    </tr>
                    <tr>
                      <td><code className="code-inline text-xs">opened / was_opened</code></td>
                      <td className="text-muted-foreground text-sm">Opened by receiver (boolean)</td>
                    </tr>
                    <tr>
                      <td><code className="code-inline text-xs">animals_only</code></td>
                      <td className="text-muted-foreground text-sm">Animals-only delivery (boolean)</td>
                    </tr>
                    <tr>
                      <td><code className="code-inline text-xs">item_count / items</code></td>
                      <td className="text-muted-foreground text-sm">Filled inventory slots</td>
                    </tr>
                    <tr>
                      <td><code className="code-inline text-xs">animal_count / animals</code></td>
                      <td className="text-muted-foreground text-sm">Animals in transit</td>
                    </tr>
                    <tr>
                      <td><code className="code-inline text-xs">despawn_seconds / despawn_remaining</code></td>
                      <td className="text-muted-foreground text-sm">Seconds until despawn (landed only)</td>
                    </tr>
                    <tr>
                      <td><code className="code-inline text-xs">distance_player</code></td>
                      <td className="text-muted-foreground text-sm">Distance from viewer to drone (same world)</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="mb-4 text-lg font-semibold">Socket Fields</h3>
              <p className="mb-3 text-xs text-muted-foreground">Example: <code className="code-inline">%deliverydrones_socket_1_trusted_names%</code> or <code className="code-inline">%deliverydrones_socket_trusted_names%</code> for first socket</p>
              <div className="card-surface overflow-hidden mb-6">
                <table className="table-docs">
                  <tbody>
                    <tr>
                      <td><code className="code-inline text-xs">name</code></td>
                      <td className="text-muted-foreground text-sm">Socket name</td>
                    </tr>
                    <tr>
                      <td><code className="code-inline text-xs">world, x, y, z</code></td>
                      <td className="text-muted-foreground text-sm">Socket location</td>
                    </tr>
                    <tr>
                      <td><code className="code-inline text-xs">coords / coordinates</code></td>
                      <td className="text-muted-foreground text-sm">Coordinates as 'x, y, z' string</td>
                    </tr>
                    <tr>
                      <td><code className="code-inline text-xs">owner</code></td>
                      <td className="text-muted-foreground text-sm">Socket owner name</td>
                    </tr>
                    <tr>
                      <td><code className="code-inline text-xs">trusted_count / trusted_names</code></td>
                      <td className="text-muted-foreground text-sm">Trust list size / names</td>
                    </tr>
                    <tr>
                      <td><code className="code-inline text-xs">blacklist_count / blacklist_names</code></td>
                      <td className="text-muted-foreground text-sm">Socket blacklist size / names</td>
                    </tr>
                    <tr>
                      <td><code className="code-inline text-xs">created</code></td>
                      <td className="text-muted-foreground text-sm">Creation timestamp (milliseconds)</td>
                    </tr>
                    <tr>
                      <td><code className="code-inline text-xs">uuid / id</code></td>
                      <td className="text-muted-foreground text-sm">Socket UUID</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="mb-4 text-lg font-semibold">Config Mirrors</h3>
              <p className="mb-3 text-xs text-muted-foreground">Access config values with <code className="code-inline">%deliverydrones_config_*%</code> to mirror <code className="code-inline">settings.drone.*</code> keys.</p>
              <div className="card-surface overflow-hidden">
                <table className="table-docs">
                  <thead>
                    <tr>
                      <th>Placeholder</th>
                      <th>Maps to (settings.drone.*)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code className="code-inline text-xs">%deliverydrones_config_speed%</code></td>
                      <td className="text-muted-foreground text-sm"><code className="code-inline text-xs">speed</code></td>
                    </tr>
                    <tr>
                      <td><code className="code-inline text-xs">%deliverydrones_config_startup_speed%</code></td>
                      <td className="text-muted-foreground text-sm"><code className="code-inline text-xs">startup-speed</code></td>
                    </tr>
                    <tr>
                      <td><code className="code-inline text-xs">%deliverydrones_config_startup_seconds%</code></td>
                      <td className="text-muted-foreground text-sm"><code className="code-inline text-xs">startup-seconds</code></td>
                    </tr>
                    <tr>
                      <td><code className="code-inline text-xs">%deliverydrones_config_approach_speed%</code></td>
                      <td className="text-muted-foreground text-sm"><code className="code-inline text-xs">approach-speed</code></td>
                    </tr>
                    <tr>
                      <td><code className="code-inline text-xs">%deliverydrones_config_approach_distance%</code></td>
                      <td className="text-muted-foreground text-sm"><code className="code-inline text-xs">approach-distance</code></td>
                    </tr>
                    <tr>
                      <td><code className="code-inline text-xs">%deliverydrones_config_delivery_radius%</code></td>
                      <td className="text-muted-foreground text-sm"><code className="code-inline text-xs">delivery-radius</code></td>
                    </tr>
                    <tr>
                      <td><code className="code-inline text-xs">%deliverydrones_config_despawn_minutes%</code></td>
                      <td className="text-muted-foreground text-sm"><code className="code-inline text-xs">despawn-time-minutes</code></td>
                    </tr>
                    <tr>
                      <td><code className="code-inline text-xs">%deliverydrones_config_despawn_mode%</code></td>
                      <td className="text-muted-foreground text-sm"><code className="code-inline text-xs">despawn-mode</code></td>
                    </tr>
                    <tr>
                      <td><code className="code-inline text-xs">%deliverydrones_config_inventory_size%</code></td>
                      <td className="text-muted-foreground text-sm"><code className="code-inline text-xs">inventory-size</code></td>
                    </tr>
                    <tr>
                      <td><code className="code-inline text-xs">%deliverydrones_config_max_active_per_sender%</code></td>
                      <td className="text-muted-foreground text-sm"><code className="code-inline text-xs">max-active-per-sender</code></td>
                    </tr>
                    <tr>
                      <td><code className="code-inline text-xs">%deliverydrones_config_max_sockets_per_player%</code></td>
                      <td className="text-muted-foreground text-sm"><code className="code-inline text-xs">max-sockets-per-player</code></td>
                    </tr>
                    <tr>
                      <td><code className="code-inline text-xs">%deliverydrones_config_max_leashed_animals%</code></td>
                      <td className="text-muted-foreground text-sm"><code className="code-inline text-xs">max-leashed-animals-per-drone</code></td>
                    </tr>
                    <tr>
                      <td><code className="code-inline text-xs">%deliverydrones_config_carry_leashed_animals%</code></td>
                      <td className="text-muted-foreground text-sm"><code className="code-inline text-xs">carry-leashed-animals</code></td>
                    </tr>
                    <tr>
                      <td><code className="code-inline text-xs">%deliverydrones_config_follow_gliding%</code></td>
                      <td className="text-muted-foreground text-sm"><code className="code-inline text-xs">follow-gliding-player</code></td>
                    </tr>
                    <tr>
                      <td><code className="code-inline text-xs">%deliverydrones_config_follow_airborne%</code></td>
                      <td className="text-muted-foreground text-sm"><code className="code-inline text-xs">follow-airborne-player-before-landing</code></td>
                    </tr>
                    <tr>
                      <td><code className="code-inline text-xs">%deliverydrones_config_airborne_follow_min_height%</code></td>
                      <td className="text-muted-foreground text-sm"><code className="code-inline text-xs">airborne-follow-min-height</code></td>
                    </tr>
                    <tr>
                      <td><code className="code-inline text-xs">%deliverydrones_config_airborne_follow_max_seconds%</code></td>
                      <td className="text-muted-foreground text-sm"><code className="code-inline text-xs">airborne-follow-max-seconds-after-start</code></td>
                    </tr>
                    <tr>
                      <td><code className="code-inline text-xs">%deliverydrones_config_hologram_enabled%</code></td>
                      <td className="text-muted-foreground text-sm"><code className="code-inline text-xs">hologram.enabled</code></td>
                    </tr>
                    <tr>
                      <td><code className="code-inline text-xs">%deliverydrones_config_bossbar_enabled%</code></td>
                      <td className="text-muted-foreground text-sm"><code className="code-inline text-xs">bossbar.enabled</code></td>
                    </tr>
                    <tr>
                      <td><code className="code-inline text-xs">%deliverydrones_config_container_integration%</code></td>
                      <td className="text-muted-foreground text-sm"><code className="code-inline text-xs">container-integration.enabled</code></td>
                    </tr>
                    <tr>
                      <td><code className="code-inline text-xs">%deliverydrones_config_container_search_radius%</code></td>
                      <td className="text-muted-foreground text-sm"><code className="code-inline text-xs">container-integration.search-radius</code></td>
                    </tr>
                    <tr>
                      <td><code className="code-inline text-xs">%deliverydrones_config_launch_animation%</code></td>
                      <td className="text-muted-foreground text-sm"><code className="code-inline text-xs">launch-animation.enabled</code></td>
                    </tr>
                    <tr>
                      <td><code className="code-inline text-xs">%deliverydrones_config_collection_animation%</code></td>
                      <td className="text-muted-foreground text-sm"><code className="code-inline text-xs">collection-animation.enabled</code></td>
                    </tr>
                    <tr>
                      <td><code className="code-inline text-xs">%deliverydrones_config_locate_particles%</code></td>
                      <td className="text-muted-foreground text-sm"><code className="code-inline text-xs">locate-particles.enabled</code></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
