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
  { id: "gui", label: "GUI", icon: Settings2 },
  { id: "advanced", label: "Advanced", icon: Code2 },
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
    icon: Settings2,
    title: "Blacklist & Controls",
    desc: "UUID-based player blocking, toggle receiving, decline drones, send cooldowns.",
  },
  {
    icon: Zap,
    title: "Performance & Optimization",
    desc: "Chunk-loading cooldown, batch processing, throttled particles, cached flight paths.",
  },
  {
    icon: Settings2,
    title: "In-Game Config Editor",
    desc: "Edit all configuration values directly in-game using the /drone config GUI.",
  },
  {
    icon: Settings2,
    title: "Database Storage",
    desc: "Store active drones in MySQL or YAML. Seamlessly convert between them with /drone convert.",
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
      { cmd: "/drone config", desc: "Open the in-game configuration editor GUI.", perm: "drone.admin.config" },
      { cmd: "/drone convert <yaml-to-mysql|mysql-to-yaml>", desc: "Convert data between YAML and MySQL storage.", perm: "drone.admin.convert" },
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
  { node: "drone.admin.config", desc: "Access the in-game config editor.", def: "OP" },
  { node: "drone.admin.convert", desc: "Allows conversion between YAML and MySQL databases.", def: "OP" },
  { node: "drone.admin.update-notify", desc: "Receive notifications about plugin updates on join.", def: "OP" },
  { node: "drone.send.max.*", desc: "Allows N concurrent outgoing drones, overriding the max-active-per-sender config.", def: "false" },
  { node: "drone.leashed.max.*", desc: "Allows N leashed animals per drone, overriding the max-leashed-animals-per-drone config.", def: "false" },
  { node: "drone.sockets.max.*", desc: "Allows N delivery sockets per player, overriding max-sockets-per-player config.", def: "false" },
];

const configKeys = [
  { key: "plugin.check-updates", desc: "Check for updates on Modrinth on startup." },
  { key: "plugin.config-editor-messages-enabled", desc: "Show notifications when config settings are changed in the editor." },
  { key: "database.type", desc: "Storage type for active Drones: YAML or MYSQL. (Sockets, blacklists, player settings are always YAML)" },
  { key: "language", desc: "Locale for all messages (de_DE, en_EN, es_ES, fr_FR, ru_RU, zh_CN). Live reload with /drone reload. Separate language file per locale with MiniMessage formatting." },
  { key: "players-enabled", desc: "Enable/disable all player-to-player drone deliveries. When false, /drone send is unavailable. Sockets remain functional if sockets-enabled is true." },
  { key: "sockets-enabled", desc: "Enable/disable entire socket system. When false, all socket commands are blocked. Player-to-player remains available if players-enabled is true." },
  { key: "settings.drone.socket-name-validation.use-allowed-list", desc: "If true, ONLY allowed characters can be used for sockets. If false, ANY character EXCEPT prohibited ones." },
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
  { key: "settings.drone.animal-return-mode", desc: "How aborted animal deliveries return to the sender: FLY or TELEPORT." },
  { key: "settings.drone.mob-sending.enabled", desc: "Enable animal selection GUI for picking animals nearby." },
  { key: "settings.drone.mob-sending.radius", desc: "Radius in blocks to detect animals around the sender." },
  { key: "settings.drone.mob-sending.leashable-only", desc: "If true, only leashable animals (e.g. cows, pigs) are shown in GUI." },
  { key: "settings.drone.mob-sending.persist-nbt-data", desc: "If true, keeps precise NBT data (color, name, health, etc.) during transit." },
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
  { key: "database.mysql.*", desc: "MySQL connection details (host, port, database, username, password, table-prefix)." },
  { key: "settings.drone.skull-texture", desc: "Base64 texture string for the default drone player head." },
  { key: "settings.drone.socket-name-validation.allowed-characters", desc: "String of allowed characters if use-allowed-list is true." },
  { key: "settings.drone.socket-name-validation.prohibited-characters", desc: "String of forbidden characters if use-allowed-list is false." },
  { key: "settings.drone.animal-return-mode", desc: "How animals return when delivery aborts: FLY (drone flies back) or TELEPORT (instant return). Affects realism vs. speed." },
  { key: "settings.drone.container-integration.enabled", desc: "Auto-unload drone contents to nearby containers (hoppers, chests, etc.) when landing near socket." },
  { key: "settings.drone.container-integration.search-radius", desc: "Horizontal radius in blocks to search for containers. 0 = only socket block & block below." },
  { key: "settings.drone.container-integration.blacklist", desc: "List of container materials to ignore (e.g., TRAPPED_CHEST). Example: [TRAPPED_CHEST, BEACON]." },
  { key: "settings.drone.particle-types", desc: "List of particle effects for the drone flight trail (e.g. ELECTRIC_SPARK or DUST:255,0,0:1.0)." },
  { key: "settings.drone.particle-count", desc: "Number of particles spawned per tick." },
  { key: "settings.drone.particle-trail-length", desc: "Length of the drone flight particle trail." },
  { key: "settings.drone.particle-y-offset", desc: "Vertical offset for the flight particles." },
  { key: "settings.drone.flight-sound", desc: "Sound played continuously during flight (e.g. entity.elytra.flying)." },
  { key: "settings.drone.hologram.offset-y", desc: "Vertical offset for the landed drone hologram." },
  { key: "settings.drone.hologram.format", desc: "MiniMessage format string for the player delivery hologram." },
  { key: "settings.drone.hologram.format-socket", desc: "MiniMessage format string for the socket delivery hologram." },
  { key: "settings.drone.bossbar.format", desc: "Bossbar text format (supports placeholders)." },
  { key: "settings.drone.bossbar.format-socket", desc: "Bossbar text format for socket deliveries." },
  { key: "settings.drone.bossbar.color", desc: "Color of the Bossbar (PINK, BLUE, RED, GREEN, YELLOW, PURPLE, WHITE)." },
  { key: "settings.drone.launch-animation.sound", desc: "Sound effect played upon drone launch." },
  { key: "settings.drone.launch-animation.sound-volume", desc: "Volume of the launch sound effect." },
  { key: "launch-animation.seconds", desc: "Duration of launch animation in seconds. Overrides startup-seconds for animation only." },
  { key: "discord.enabled", desc: "Enable or disable Discord webhook integration." },
  { key: "discord.webhook-url", desc: "The URL of the Discord webhook." },
  { key: "discord.username", desc: "Username for the webhook bot. Default: Delivery Drone." },
  { key: "discord.avatar-url", desc: "Avatar URL for the webhook bot." },
  { key: "discord.embed.enabled", desc: "Use rich embeds for messages. If false, sends simple text." },
  { key: "discord.embed.color", desc: "Hex color for the embed border. Default: #00ff00." },
  { key: "discord.include-items", desc: "Include a list of sent items in the notification." },
  { key: "discord.include-animals", desc: "Include a list of sent animals in the notification." },
  { key: "discord.max-items-display", desc: "Maximum number of item types to display before adding '...'." },
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
      <section className="container-page py-8 sm:py-16">
        {/* Header */}
        <header className="mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Documentation</h1>
          <p className="mt-2 sm:mt-3 text-base sm:text-lg text-muted-foreground">
            Physical drone deliveries for Paper servers
          </p>
          <div className="mt-4 sm:mt-5 flex flex-wrap gap-2">
            <a href="https://modrinth.com/plugin/advanceddeliverydrones#download" target="_blank" rel="noreferrer" className="btn-brand h-10 text-xs sm:text-sm px-3 sm:px-4">
              <Download className="h-4 w-4" /> Latest release
            </a>
            <a href="https://github.com/EinfachJan7/AdvancedDeliveryDrones" target="_blank" rel="noreferrer" className="btn-ghost h-10 text-xs sm:text-sm px-3 sm:px-4">
              <Github className="h-4 w-4" /> Source
            </a>
          </div>
        </header>

        {/* Tab Navigation */}
        <div className="mb-6 sm:mb-8 border-b border-white/10 overflow-x-auto">
          <div className="flex flex-nowrap gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 rounded-t-md px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-b-2 border-[var(--color-accent)] bg-white/5 text-foreground"
                      : "text-muted-foreground hover:bg-white/5"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
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
              <h2 className="mb-4 sm:mb-6 text-2xl sm:text-3xl font-bold">Features</h2>
              <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
                {features.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <div key={feature.title} className="card-surface space-y-2 sm:space-y-3 p-4 sm:p-6">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-accent)]/20">
                        <Icon className="h-5 w-5 text-[var(--color-accent)]" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm sm:text-base">{feature.title}</h3>
                        <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-muted-foreground">{feature.desc}</p>
                      </div>
                    </div>
                  );
                })}
                {/* Additional Features */}
                <div className="card-surface space-y-2 sm:space-y-3 p-4 sm:p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-accent)]/20">
                    <Sparkles className="h-5 w-5 text-[var(--color-accent)]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm sm:text-base">🪂 Elytra & Airborne Follow</h3>
                    <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-muted-foreground">Drone tracks gliding receivers (+5 Y-offset) &amp; airborne players (&gt;5 blocks high). Dynamic relocation on ground contact.</p>
                  </div>
                </div>
                <div className="card-surface space-y-2 sm:space-y-3 p-4 sm:p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-accent)]/20">
                    <Sparkles className="h-5 w-5 text-[var(--color-accent)]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm sm:text-base">🐾 Animal Transport</h3>
                    <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-muted-foreground">Send animals via GUI. Radius-based selection with full NBT persistence. Invulnerable in transit, respawned at destination. Configurable max per drone.</p>
                  </div>
                </div>
                <div className="card-surface space-y-2 sm:space-y-3 p-4 sm:p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-accent)]/20">
                    <Sparkles className="h-5 w-5 text-[var(--color-accent)]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm sm:text-base">🔔 Discord Webhooks</h3>
                    <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-muted-foreground">Real-time webhook notifications for sent, delivered, declined &amp; expired drones with rich embeds.</p>
                  </div>
                </div>
                <div className="card-surface space-y-2 sm:space-y-3 p-4 sm:p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-accent)]/20">
                    <Sparkles className="h-5 w-5 text-[var(--color-accent)]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm sm:text-base">🖥 GUIs & Customization</h3>
                    <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-muted-foreground">Main menu, player/socket selection, socket edit with sign rename. Live reload with /drone reload.</p>
                  </div>
                </div>
                <div className="card-surface space-y-2 sm:space-y-3 p-4 sm:p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-accent)]/20">
                    <Sparkles className="h-5 w-5 text-[var(--color-accent)]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm sm:text-base">💾 Persistence & Safety</h3>
                    <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-muted-foreground">UUID-based tracking with YAML storage. Server restart returns items to senders &amp; cleans orphaned entities.</p>
                  </div>
                </div>
                <div className="card-surface space-y-2 sm:space-y-3 p-4 sm:p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-accent)]/20">
                    <Sparkles className="h-5 w-5 text-[var(--color-accent)]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm sm:text-base">📍 Locate Landed Drones</h3>
                    <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-muted-foreground">/drone locate shows particle trail to nearest drone. Displays sender name, distance &amp; coordinates.</p>
                  </div>
                </div>
                <div className="card-surface space-y-2 sm:space-y-3 p-4 sm:p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-accent)]/20">
                    <Sparkles className="h-5 w-5 text-[var(--color-accent)]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm sm:text-base">✨ Hologram & Boss Bar</h3>
                    <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-muted-foreground">Hologram shows recipient name &amp; live despawn countdown. Boss bar displays distance &amp; ETA.</p>
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
              <h2 className="mb-4 sm:mb-6 text-2xl sm:text-3xl font-bold">Commands</h2>
              <p className="mb-4 sm:mb-6 text-xs sm:text-sm text-muted-foreground">Root: <code className="code-inline">/drone</code> — Opens main GUI when run without arguments.</p>
              <div className="space-y-6">
                {commandGroups.map((group) => (
                  <div key={group.title}>
                    <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">{group.title}</h3>
                    <div className="card-surface overflow-x-auto">
                      <table className="table-docs">
                        <thead>
                          <tr>
                            <th className="whitespace-nowrap">Command</th>
                            <th className="hidden sm:table-cell">Description</th>
                            <th className="hidden md:table-cell">Permission</th>
                          </tr>
                        </thead>
                        <tbody>
                          {group.rows.map((row) => (
                            <tr key={row.cmd}>
                              <td className="whitespace-nowrap"><code className="code-inline text-xs">{row.cmd}</code></td>
                              <td className="hidden sm:table-cell text-muted-foreground text-sm">{row.desc}</td>
                              <td className="hidden md:table-cell"><code className="code-inline text-xs">{row.perm}</code></td>
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
              <h2 className="mb-4 sm:mb-6 text-2xl sm:text-3xl font-bold">Permissions</h2>
              <p className="mb-4 sm:mb-6 text-xs sm:text-sm text-muted-foreground">Hierarchical permission tree. Parent nodes grant all children.</p>
              <div className="card-surface overflow-x-auto">
                <table className="table-docs">
                  <thead>
                    <tr>
                      <th className="whitespace-nowrap">Node</th>
                      <th>Description</th>
                      <th className="hidden sm:table-cell whitespace-nowrap">Default</th>
                    </tr>
                  </thead>
                  <tbody>
                    {permissions.map((perm) => (
                      <tr key={perm.node}>
                        <td className="whitespace-nowrap"><code className="code-inline text-xs">{perm.node}</code></td>
                        <td className="text-muted-foreground text-sm">{perm.desc}</td>
                        <td className="hidden sm:table-cell"><span className="badge-soft text-xs">{perm.def}</span></td>
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
              <h2 className="mb-4 sm:mb-6 text-2xl sm:text-3xl font-bold">Configuration</h2>
              <p className="mb-4 sm:mb-6 text-xs sm:text-sm text-muted-foreground">All behavior in <code className="code-inline">config.yml</code>. GUIs in <code className="code-inline">gui.yml</code>. Use <code className="code-inline">/drone reload</code> to apply changes.</p>
              <div className="card-surface overflow-x-auto">
                <table className="table-docs">
                  <thead>
                    <tr>
                      <th className="whitespace-nowrap">Key</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {configKeys.map((config) => (
                      <tr key={config.key}>
                        <td className="whitespace-nowrap"><code className="code-inline text-xs">{config.key}</code></td>
                        <td className="text-muted-foreground text-sm">{config.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* GUI Configuration */}
          {activeTab === "gui" && (
            <div>
              <h2 className="mb-4 sm:mb-6 text-2xl sm:text-3xl font-bold">GUI Configuration</h2>
              <p className="mb-4 sm:mb-6 text-xs sm:text-sm text-muted-foreground">Every inventory menu in the plugin is fully customizable via <code className="code-inline">gui.yml</code>. You can change titles, sizes, and any item layout. Supports MiniMessage formatting.</p>
              
              <div className="space-y-6">
                <div className="card-surface p-4 sm:p-6">
                  <h3 className="text-lg font-semibold mb-3">Global Settings</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    The <code className="code-inline">global</code> section defines the default filler items and back button used across all menus.
                  </p>
                  <pre className="p-3 bg-black/40 rounded-md overflow-x-auto text-xs"><code>{`global:
  fill-item:
    material: "GRAY_STAINED_GLASS_PANE"
    name: " "
  back-item:
    material: "ARROW"
    name: "<!italic><yellow>⟵ ʙᴀᴄᴋ</yellow>"
    lore:
      - "<!italic><gray>  Zurück"`}</code></pre>
                </div>

                <div className="card-surface p-4 sm:p-6">
                  <h3 className="text-lg font-semibold mb-3">Menu Customization</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Each menu (like <code className="code-inline">main-menu</code>, <code className="code-inline">socket-management</code>, etc.) has its own section where you can define:
                  </p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground mb-4 space-y-1">
                    <li><code className="code-inline">title</code>: The inventory title (supports MiniMessage).</li>
                    <li><code className="code-inline">size</code>: Number of slots (must be multiple of 9).</li>
                    <li><code className="code-inline">items</code>: The exact positions, materials, names, and lores of interactive items.</li>
                  </ul>
                  <pre className="p-3 bg-black/40 rounded-md overflow-x-auto text-xs"><code>{`main-menu:
  title: "<!italic><gold>ᴅʀᴏɴᴇ ᴍᴇɴᴜ</gold>"
  size: 54
  items:
    send:
      position: 20
      material: "PLAYER_HEAD"
      name: "<!italic><green><bold>✈ sᴇɴᴅ ᴅʀᴏɴᴇ</bold></green>"
      lore:
        - "<!italic><gray>  sᴇɴᴅ ᴀ ᴅʀᴏɴᴇ ᴛᴏ"`}</code></pre>
                </div>

                <div className="card-surface p-4 sm:p-6">
                  <h3 className="text-lg font-semibold mb-3">Custom Skull Textures</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Any item can use a custom player head by setting <code className="code-inline">material: "PLAYER_HEAD"</code> and providing a Base64 <code className="code-inline">value</code>.
                  </p>
                  <pre className="p-3 bg-black/40 rounded-md overflow-x-auto text-xs"><code>{`send:
  material: "PLAYER_HEAD"
  value: "eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly..."`}</code></pre>
                </div>
                
                <div className="card-surface p-4 sm:p-6">
                  <h3 className="text-lg font-semibold mb-3">Dynamic Data Injection</h3>
                  <p className="text-sm text-muted-foreground">
                    Many GUIs (like Player Selection or Socket Selection) use template items (e.g., <code className="code-inline">player-head-item</code> or <code className="code-inline">socket-item-format</code>) that define how dynamic entries are displayed. You can use placeholders like <code className="code-inline">&lt;player&gt;</code>, <code className="code-inline">&lt;name&gt;</code>, or <code className="code-inline">&lt;owner&gt;</code> directly in these formats.
                  </p>
                  
                  <h4 className="mt-4 font-medium mb-2">NBT Mob Sending Variables</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    When using the <code className="code-inline">mob-sending</code> GUI, you can access detailed NBT properties in <code className="code-inline">animal-item.lore</code> and <code className="code-inline">animal-item.selected-lore</code> to display precise animal information. Below is a comprehensive reference of all available variables:
                  </p>
                  
                  <div className="space-y-4 mb-4">
                    <div className="card-surface p-4 bg-black/20">
                      <h5 className="font-semibold text-sm mb-3">🐾 Basic Information</h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="p-2 bg-black/30 rounded">
                          <code className="code-inline text-[0.7rem]">&lt;type&gt;</code>
                          <p className="text-muted-foreground mt-1">Animal entity type name (e.g., &quot;Cow&quot;, &quot;Pig&quot;, &quot;Horse&quot;)</p>
                        </div>
                        <div className="p-2 bg-black/30 rounded">
                          <code className="code-inline text-[0.7rem]">&lt;custom-name&gt;</code>
                          <p className="text-muted-foreground mt-1">Custom display name if set, empty string otherwise</p>
                        </div>
                      </div>
                    </div>

                    <div className="card-surface p-4 bg-black/20">
                      <h5 className="font-semibold text-sm mb-3">❤️ Health & Attributes</h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="p-2 bg-black/30 rounded">
                          <code className="code-inline text-[0.7rem]">&lt;health&gt;</code>
                          <p className="text-muted-foreground mt-1">Current health points (decimal, e.g., &quot;18.5&quot;)</p>
                        </div>
                        <div className="p-2 bg-black/30 rounded">
                          <code className="code-inline text-[0.7rem]">&lt;max-health&gt;</code>
                          <p className="text-muted-foreground mt-1">Maximum health attribute (default 20.0 for most mobs)</p>
                        </div>
                        <div className="p-2 bg-black/30 rounded">
                          <code className="code-inline text-[0.7rem]">&lt;speed&gt;</code>
                          <p className="text-muted-foreground mt-1">Movement speed attribute (0.1-1.0, default 0.2)</p>
                        </div>
                        <div className="p-2 bg-black/30 rounded">
                          <code className="code-inline text-[0.7rem]">&lt;jump&gt;</code>
                          <p className="text-muted-foreground mt-1">Jump strength (Horses only, decimal value)</p>
                        </div>
                      </div>
                    </div>

                    <div className="card-surface p-4 bg-black/20">
                      <h5 className="font-semibold text-sm mb-3">🎨 Appearance & Colors</h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="p-2 bg-black/30 rounded">
                          <code className="code-inline text-[0.7rem]">&lt;color&gt;</code>
                          <p className="text-muted-foreground mt-1">Color (Sheep, Wolves, Cats - e.g., &quot;WHITE&quot;, &quot;RED&quot;)</p>
                        </div>
                        <div className="p-2 bg-black/30 rounded">
                          <code className="code-inline text-[0.7rem]">&lt;variant&gt;</code>
                          <p className="text-muted-foreground mt-1">Specific variant (Axolotl, Fox, Frog, Llama, Panda, etc.)</p>
                        </div>
                        <div className="p-2 bg-black/30 rounded">
                          <code className="code-inline text-[0.7rem]">&lt;tropical-pattern&gt;</code>
                          <p className="text-muted-foreground mt-1">Tropical fish pattern type</p>
                        </div>
                        <div className="p-2 bg-black/30 rounded">
                          <code className="code-inline text-[0.7rem]">&lt;tropical-body-color&gt;</code>
                          <p className="text-muted-foreground mt-1">Tropical fish body color</p>
                        </div>
                        <div className="p-2 bg-black/30 rounded">
                          <code className="code-inline text-[0.7rem]">&lt;tropical-pattern-color&gt;</code>
                          <p className="text-muted-foreground mt-1">Tropical fish pattern color</p>
                        </div>
                        <div className="p-2 bg-black/30 rounded">
                          <code className="code-inline text-[0.7rem]">&lt;size&gt;</code>
                          <p className="text-muted-foreground mt-1">Mob size (Slimes &amp; Magma Cubes, 1-4)</p>
                        </div>
                      </div>
                    </div>

                    <div className="card-surface p-4 bg-black/20">
                      <h5 className="font-semibold text-sm mb-3">👤 Behavior & State</h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="p-2 bg-black/30 rounded">
                          <code className="code-inline text-[0.7rem]">&lt;age&gt;</code>
                          <p className="text-muted-foreground mt-1">Age status (&quot;Adult&quot; or &quot;Baby&quot;)</p>
                        </div>
                        <div className="p-2 bg-black/30 rounded">
                          <code className="code-inline text-[0.7rem]">&lt;can-breed&gt;</code>
                          <p className="text-muted-foreground mt-1">&quot;Yes&quot; if animal is ready to breed, null otherwise</p>
                        </div>
                        <div className="p-2 bg-black/30 rounded">
                          <code className="code-inline text-[0.7rem]">&lt;sitting&gt;</code>
                          <p className="text-muted-foreground mt-1">&quot;Yes&quot; if mob is sitting (Foxes, Cats)</p>
                        </div>
                        <div className="p-2 bg-black/30 rounded">
                          <code className="code-inline text-[0.7rem]">&lt;sleeping&gt;</code>
                          <p className="text-muted-foreground mt-1">&quot;Yes&quot; if Fox is sleeping</p>
                        </div>
                        <div className="p-2 bg-black/30 rounded">
                          <code className="code-inline text-[0.7rem]">&lt;crouching&gt;</code>
                          <p className="text-muted-foreground mt-1">&quot;Yes&quot; if Fox is crouching</p>
                        </div>
                        <div className="p-2 bg-black/30 rounded">
                          <code className="code-inline text-[0.7rem]">&lt;awake&gt;</code>
                          <p className="text-muted-foreground mt-1">&quot;Yes&quot; if Bat is awake</p>
                        </div>
                      </div>
                    </div>

                    <div className="card-surface p-4 bg-black/20">
                      <h5 className="font-semibold text-sm mb-3">🔥 Special Properties</h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="p-2 bg-black/30 rounded">
                          <code className="code-inline text-[0.7rem]">&lt;owner&gt;</code>
                          <p className="text-muted-foreground mt-1">Owner name if tamed (Dogs, Cats, Horses)</p>
                        </div>
                        <div className="p-2 bg-black/30 rounded">
                          <code className="code-inline text-[0.7rem]">&lt;saddled&gt;</code>
                          <p className="text-muted-foreground mt-1">&quot;Yes&quot; if has saddle (Pigs, Horses, Striders)</p>
                        </div>
                        <div className="p-2 bg-black/30 rounded">
                          <code className="code-inline text-[0.7rem]">&lt;sheared&gt;</code>
                          <p className="text-muted-foreground mt-1">&quot;Yes&quot; if Sheep has been sheared</p>
                        </div>
                        <div className="p-2 bg-black/30 rounded">
                          <code className="code-inline text-[0.7rem]">&lt;anger&gt;</code>
                          <p className="text-muted-foreground mt-1">&quot;Angry&quot; if hostile state (Bees, Wolves)</p>
                        </div>
                        <div className="p-2 bg-black/30 rounded">
                          <code className="code-inline text-[0.7rem]">&lt;powered&gt;</code>
                          <p className="text-muted-foreground mt-1">&quot;Yes&quot; if Creeper is powered by lightning</p>
                        </div>
                        <div className="p-2 bg-black/30 rounded">
                          <code className="code-inline text-[0.7rem]">&lt;charged&gt;</code>
                          <p className="text-muted-foreground mt-1">&quot;Yes&quot; if Wither is charged</p>
                        </div>
                        <div className="p-2 bg-black/30 rounded">
                          <code className="code-inline text-[0.7rem]">&lt;ignited&gt;</code>
                          <p className="text-muted-foreground mt-1">&quot;Yes&quot; if Creeper is ignited/exploding</p>
                        </div>
                        <div className="p-2 bg-black/30 rounded">
                          <code className="code-inline text-[0.7rem]">&lt;shivering&gt;</code>
                          <p className="text-muted-foreground mt-1">&quot;Yes&quot; if Strider is cold/shivering</p>
                        </div>
                      </div>
                    </div>

                    <div className="card-surface p-4 bg-black/20">
                      <h5 className="font-semibold text-sm mb-3">👨‍🌾 Villager & Profession</h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="p-2 bg-black/30 rounded">
                          <code className="code-inline text-[0.7rem]">&lt;profession&gt;</code>
                          <p className="text-muted-foreground mt-1">Villager profession (e.g., &quot;FARMER&quot;, &quot;LIBRARIAN&quot;)</p>
                        </div>
                        <div className="p-2 bg-black/30 rounded">
                          <code className="code-inline text-[0.7rem]">&lt;villager-type&gt;</code>
                          <p className="text-muted-foreground mt-1">Biome type (Villager &amp; ZombieVillager)</p>
                        </div>
                        <div className="p-2 bg-black/30 rounded">
                          <code className="code-inline text-[0.7rem]">&lt;villager-level&gt;</code>
                          <p className="text-muted-foreground mt-1">Trade level (1-5, 1=Novice, 5=Master)</p>
                        </div>
                        <div className="p-2 bg-black/30 rounded">
                          <code className="code-inline text-[0.7rem]">&lt;villager-experience&gt;</code>
                          <p className="text-muted-foreground mt-1">Trade experience points (numeric)</p>
                        </div>
                      </div>
                    </div>

                    <div className="card-surface p-4 bg-black/20">
                      <h5 className="font-semibold text-sm mb-3">🐴 Horse & Domestication</h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="p-2 bg-black/30 rounded">
                          <code className="code-inline text-[0.7rem]">&lt;domestication&gt;</code>
                          <p className="text-muted-foreground mt-1">Current taming level (0-100)</p>
                        </div>
                        <div className="p-2 bg-black/30 rounded">
                          <code className="code-inline text-[0.7rem]">&lt;max-domestication&gt;</code>
                          <p className="text-muted-foreground mt-1">Maximum taming level (usually 100)</p>
                        </div>
                      </div>
                    </div>

                    <div className="card-surface p-4 bg-black/20">
                      <h5 className="font-semibold text-sm mb-3">🐼 Panda & Genetics</h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="p-2 bg-black/30 rounded">
                          <code className="code-inline text-[0.7rem]">&lt;panda-main-gene&gt;</code>
                          <p className="text-muted-foreground mt-1">Primary panda gene (determines personality)</p>
                        </div>
                        <div className="p-2 bg-black/30 rounded">
                          <code className="code-inline text-[0.7rem]">&lt;panda-hidden-gene&gt;</code>
                          <p className="text-muted-foreground mt-1">Recessive panda gene (from breeding)</p>
                        </div>
                      </div>
                    </div>

                    <div className="card-surface p-4 bg-black/20">
                      <h5 className="font-semibold text-sm mb-3">🦌 Goats & Other Variants</h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="p-2 bg-black/30 rounded">
                          <code className="code-inline text-[0.7rem]">&lt;left-horn&gt;</code>
                          <p className="text-muted-foreground mt-1">&quot;Yes&quot; if Goat has left horn</p>
                        </div>
                        <div className="p-2 bg-black/30 rounded">
                          <code className="code-inline text-[0.7rem]">&lt;right-horn&gt;</code>
                          <p className="text-muted-foreground mt-1">&quot;Yes&quot; if Goat has right horn</p>
                        </div>
                        <div className="p-2 bg-black/30 rounded">
                          <code className="code-inline text-[0.7rem]">&lt;carried-block&gt;</code>
                          <p className="text-muted-foreground mt-1">Block name carried by Enderman (e.g., &quot;DIRT&quot;)</p>
                        </div>
                        <div className="p-2 bg-black/30 rounded">
                          <code className="code-inline text-[0.7rem]">&lt;derp&gt;</code>
                          <p className="text-muted-foreground mt-1">&quot;Yes&quot; if Snowman has derp expression</p>
                        </div>
                      </div>
                    </div>

                    <div className="card-surface p-4 bg-black/20">
                      <h5 className="font-semibold text-sm mb-3">🧟 Zombies & Undead</h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="p-2 bg-black/30 rounded">
                          <code className="code-inline text-[0.7rem]">&lt;zombie-baby&gt;</code>
                          <p className="text-muted-foreground mt-1">&quot;Yes&quot; if Zombie is baby/small</p>
                        </div>
                        <div className="p-2 bg-black/30 rounded">
                          <code className="code-inline text-[0.7rem]">&lt;trusting&gt;</code>
                          <p className="text-muted-foreground mt-1">&quot;Yes&quot; if Ocelot trusts the player</p>
                        </div>
                        <div className="p-2 bg-black/30 rounded">
                          <code className="code-inline text-[0.7rem]">&lt;player-created&gt;</code>
                          <p className="text-muted-foreground mt-1">&quot;Yes&quot; if IronGolem was built by player</p>
                        </div>
                        <div className="p-2 bg-black/30 rounded">
                          <code className="code-inline text-[0.7rem]">&lt;has-egg&gt;</code>
                          <p className="text-muted-foreground mt-1">&quot;Yes&quot; if Turtle female with eggs</p>
                        </div>
                      </div>
                    </div>

                    <div className="card-surface p-4 bg-black/20">
                      <h5 className="font-semibold text-sm mb-3">⚡ Advanced / Version-Specific</h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="p-2 bg-black/30 rounded">
                          <code className="code-inline text-[0.7rem]">&lt;anger-level&gt;</code>
                          <p className="text-muted-foreground mt-1">Warden's anger level (1.19+)</p>
                        </div>
                        <div className="p-2 bg-black/30 rounded">
                          <code className="code-inline text-[0.7rem]">&lt;immune-to-zombification&gt;</code>
                          <p className="text-muted-foreground mt-1">&quot;Yes&quot; if Piglin can't zombify (1.16+)</p>
                        </div>
                        <div className="p-2 bg-black/30 rounded">
                          <code className="code-inline text-[0.7rem]">&lt;patrol-leader&gt;</code>
                          <p className="text-muted-foreground mt-1">&quot;Yes&quot; if Raider leads patrol</p>
                        </div>
                        <div className="p-2 bg-black/30 rounded">
                          <code className="code-inline text-[0.7rem]">&lt;can-duplicate&gt;</code>
                          <p className="text-muted-foreground mt-1">&quot;Yes&quot; if Allay can duplicate (1.20+)</p>
                        </div>
                        <div className="p-2 bg-black/30 rounded">
                          <code className="code-inline text-[0.7rem]">&lt;sniffer-state&gt;</code>
                          <p className="text-muted-foreground mt-1">Sniffer state (IDLE, SEARCHING, DIGGING)</p>
                        </div>
                        <div className="p-2 bg-black/30 rounded">
                          <code className="code-inline text-[0.7rem]">&lt;dragon-phase&gt;</code>
                          <p className="text-muted-foreground mt-1">Ender Dragon phase (CIRCLING, STRAFING, etc.)</p>
                        </div>
                        <div className="p-2 bg-black/30 rounded">
                          <code className="code-inline text-[0.7rem]">&lt;drinking-potion&gt;</code>
                          <p className="text-muted-foreground mt-1">&quot;Yes&quot; if Witch is drinking potion</p>
                        </div>
                        <div className="p-2 bg-black/30 rounded">
                          <code className="code-inline text-[0.7rem]">&lt;puff-state&gt;</code>
                          <p className="text-muted-foreground mt-1">PufferFish puff level (0-2)</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="card-surface p-4 bg-blue/10 border border-blue/20 text-sm">
                    <p className="text-muted-foreground"><strong>💡 Tip:</strong> Variables that don't apply to an animal type (e.g., <code className="code-inline">&lt;saddled&gt;</code> for a Cow) will be silently skipped. Use conditional placeholders in your YAML config to show/hide specific lines.</p>
                  </div>

                  <h4 className="mt-6 font-medium mb-3">Example: Animal Selection GUI Configuration</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Configure the animal selection inventory in <code className="code-inline">gui.yml</code> to customize the mob-sending experience:
                  </p>
                  <pre className="p-4 bg-black/40 rounded-md overflow-x-auto text-xs mb-4"><code>{`mob-sending:
  animal-selection:
    title: "<!italic><gold>sᴇʟᴇᴄᴛ ᴀɴɪᴍᴀʟs</gold>"
    size: 54
    fill-item:
      material: "GRAY_STAINED_GLASS_PANE"
      name: " "
    
    animal-item:
      material: "NAME_TAG"  # Fallback material
      name: "<!italic><green><<type>></green>"
      lore:
        - "<!italic><gray>❤ Health: <health>/<max-health>"
        - "<!italic><gray>⚡ Speed: <speed>"
        - "<!italic><gray>🎨 Color: <color>"
        - "<!italic><gray>📍 Variant: <variant>"
        - "<!italic><gray>👤 Age: <age>"
        - "<!italic><gray>📝 Custom Name: <custom-name>"
        - "<!italic><gray>Owner: <owner>"
        - " "
        - "<!italic><yellow>Click to select!"
    
    animal-item-selected:
      name: "<!italic><gold>✓ <type></gold>"
      lore:
        - "<!italic><gray>Status: Selected"
        - "<!italic><gray>❤ Health: <health>/<max-health>"
        - " "
        - "<!italic><yellow>Click to deselect!"
    
    back:
      position: 49
      material: "ARROW"
      name: "<!italic><yellow>⟵ ʙᴀᴄᴋ"
    
    previous-page:
      position: 47
      material: "OAK_BUTTON"
      name: "<!italic><yellow>◄ Previous"
    
    next-page:
      position: 51
      material: "OAK_BUTTON"
      name: "<!italic><yellow>Next ►"`}</code></pre>
                </div>
              </div>
            </div>
          )}

          {/* Advanced Features */}
          {activeTab === "advanced" && (
            <div>
              <h2 className="mb-4 sm:mb-6 text-2xl sm:text-3xl font-bold">Advanced Features</h2>
              
              <div className="space-y-6">
                {/* Collection Animation */}
                <div className="card-surface p-4 sm:p-6">
                  <div className="flex items-start gap-3 mb-3">
                    <Sparkles className="h-5 w-5 text-[var(--color-accent)] mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-semibold">Collection Animation</h3>
                      <p className="text-xs text-muted-foreground mt-1">When a player opens a landed drone, items float out in an animation.</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">Visual effect when collecting items from a drone. Duration: 2 seconds (40 ticks).</p>
                  <div className="p-3 bg-black/30 rounded text-xs font-mono">
                    <code>settings.drone.collection-animation.enabled: true</code>
                  </div>
                </div>

                {/* Boss Bar & Hologram */}
                <div className="card-surface p-4 sm:p-6">
                  <div className="flex items-start gap-3 mb-3">
                    <Radio className="h-5 w-5 text-[var(--color-accent)] mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-semibold">Live Tracking Display</h3>
                      <p className="text-xs text-muted-foreground mt-1">Real-time visual feedback for drone deliveries.</p>
                    </div>
                  </div>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <div>
                      <p className="font-semibold text-foreground mb-1">📊 Boss Bar</p>
                      <p>Shows distance to drone and estimated arrival time (ETA). Updates every second with color customization (PINK, BLUE, RED, GREEN, YELLOW, PURPLE, WHITE).</p>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground mb-1">📍 Hologram</p>
                      <p>Displays recipient name and live countdown timer above the drone. Y-offset is configurable, and formats differ between player and socket deliveries.</p>
                    </div>
                  </div>
                </div>

                {/* Elytra & Airborne Following */}
                <div className="card-surface p-4 sm:p-6">
                  <div className="flex items-start gap-3 mb-3">
                    <Zap className="h-5 w-5 text-[var(--color-accent)] mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-semibold">Dynamic Flight Tracking</h3>
                      <p className="text-xs text-muted-foreground mt-1">Drones adapt to player movement in real-time.</p>
                    </div>
                  </div>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <div>
                      <p className="font-semibold text-foreground mb-1">🪂 Elytra Glide Following</p>
                      <p>When a receiver glides with elytra, the drone follows with a +5 block Y-offset until they land. Seamless tracking during flight.</p>
                      <code className="text-xs bg-black/30 px-2 py-1 rounded inline-block mt-1">follow-gliding-player: true</code>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground mb-1">📉 Airborne Follow</p>
                      <p>Before landing, if receiver is significantly airborne (&gt;5 blocks high), drone follows until grounded, then lands. Max 15 seconds from flight start.</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1 text-xs">
                        <code className="bg-black/30 px-2 py-1 rounded">follow-airborne-player-before-landing: true</code>
                        <code className="bg-black/30 px-2 py-1 rounded">airborne-follow-min-height: 5.0</code>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Container Integration */}
                <div className="card-surface p-4 sm:p-6">
                  <div className="flex items-start gap-3 mb-3">
                    <Package className="h-5 w-5 text-[var(--color-accent)] mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-semibold">Container Auto-Unload</h3>
                      <p className="text-xs text-muted-foreground mt-1">Drones can automatically unload items to nearby containers when arriving at sockets.</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>Perfect for automated farms and storage systems. Searches for containers (chests, hoppers, barrels, etc.) within configurable radius and attempts to move items.</p>
                    <div className="p-3 bg-black/30 rounded text-xs space-y-1">
                      <p><code>enabled: true</code> — Activation toggle</p>
                      <p><code>search-radius: 0</code> — Horizontal search (0 = socket block only)</p>
                      <p><code>blacklist: [TRAPPED_CHEST, ...]</code> — Ignored container types</p>
                    </div>
                  </div>
                </div>

                {/* Discord Integration */}
                <div className="card-surface p-4 sm:p-6">
                  <div className="flex items-start gap-3 mb-3">
                    <Radio className="h-5 w-5 text-[var(--color-accent)] mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-semibold">Discord Webhooks</h3>
                      <p className="text-xs text-muted-foreground mt-1">Send delivery events to Discord with rich embeds.</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>Events: Delivery Started, Completed, Declined, Expired. Rich embeds support custom colors, thumbnails, images, and footers. Can include item and animal lists.</p>
                    <div className="p-3 bg-black/30 rounded text-xs space-y-1">
                      <p><code>enabled: true</code> — Master toggle</p>
                      <p><code>webhook-url: "https://..."</code> — Discord webhook URL</p>
                      <p><code>embed.enabled: true</code> — Use rich embeds vs plain text</p>
                      <p><code>include-items: true</code> — List items in message</p>
                      <p><code>include-animals: true</code> — List animals in message</p>
                    </div>
                  </div>
                </div>

                {/* In-Game Config Editor */}
                <div className="card-surface p-4 sm:p-6">
                  <div className="flex items-start gap-3 mb-3">
                    <Settings2 className="h-5 w-5 text-[var(--color-accent)] mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-semibold">In-Game Config Editor</h3>
                      <p className="text-xs text-muted-foreground mt-1">Edit all settings without restarting the server.</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>Admins can open an interactive GUI to edit all <code className="code-inline">config.yml</code> values in-game. Changes apply immediately with live validation.</p>
                    <div className="p-3 bg-black/30 rounded text-xs space-y-1">
                      <p><code>/drone config</code> — Open editor (requires <code>drone.admin.config</code>)</p>
                      <p><code>plugin.config-editor-messages-enabled: true</code> — Show chat notifications for changes</p>
                    </div>
                  </div>
                </div>

                {/* Database Conversion */}
                <div className="card-surface p-4 sm:p-6">
                  <div className="flex items-start gap-3 mb-3">
                    <Shield className="h-5 w-5 text-[var(--color-accent)] mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-semibold">YAML ↔ MySQL Migration</h3>
                      <p className="text-xs text-muted-foreground mt-1">Seamlessly convert active drone data between storage formats.</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>Migrate all active drone data without downtime. Sockets, blacklists, and player settings always remain in YAML.</p>
                    <div className="p-3 bg-black/30 rounded text-xs space-y-1">
                      <p><code>/drone convert yaml-to-mysql</code> — Export to MySQL</p>
                      <p><code>/drone convert mysql-to-yaml</code> — Export to YAML</p>
                      <p><code>database.type: YAML|MYSQL</code> — Set default storage</p>
                    </div>
                  </div>
                </div>

                {/* Compose Draft Persistence */}
                <div className="card-surface p-4 sm:p-6">
                  <div className="flex items-start gap-3 mb-3">
                    <Package className="h-5 w-5 text-[var(--color-accent)] mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-semibold">Compose Draft Auto-Save</h3>
                      <p className="text-xs text-muted-foreground mt-1">Items stay in the compose GUI even after closing.</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">When you close the compose GUI, your selected items and animals are automatically saved. Open <code className="code-inline">/drone send</code> again and your draft is restored.</p>
                </div>

                {/* Blocked Worlds */}
                <div className="card-surface p-4 sm:p-6">
                  <div className="flex items-start gap-3 mb-3">
                    <Shield className="h-5 w-5 text-[var(--color-accent)] mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-semibold">World Restrictions</h3>
                      <p className="text-xs text-muted-foreground mt-1">Admins can disable drone sends in specific worlds.</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>Block drones from being sent to/from certain worlds (e.g., creative mode, minigames, PvP arenas).</p>
                    <div className="p-3 bg-black/30 rounded text-xs">
                      <code>blocked-worlds: [creative, minigame_arena, pvp_zone]</code>
                    </div>
                  </div>
                </div>

                {/* Cooldowns & Self-Send */}
                <div className="card-surface p-4 sm:p-6">
                  <div className="flex items-start gap-3 mb-3">
                    <Zap className="h-5 w-5 text-[var(--color-accent)] mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-semibold">Rate Limiting & Self-Sends</h3>
                      <p className="text-xs text-muted-foreground mt-1">Control send frequency and allow/block self-deliveries.</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>Separate cooldowns for player-to-player and player-to-socket deliveries. Toggle whether players can send to themselves.</p>
                    <div className="p-3 bg-black/30 rounded text-xs space-y-1">
                      <p><code>send-cooldown-seconds-player: 0</code> — Seconds between player sends (0 = none)</p>
                      <p><code>send-cooldown-seconds-socket: 0</code> — Seconds between socket sends</p>
                      <p><code>allow-send-to-self-player: false</code> — Block sending to yourself</p>
                      <p><code>allow-send-to-self-socket: false</code> — Block sending to own sockets</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PlaceholderAPI */}
          {activeTab === "placeholders" && (
            <div>
              <h2 className="mb-4 sm:mb-6 text-2xl sm:text-3xl font-bold">PlaceholderAPI</h2>
              <div className="card-surface mb-4 sm:mb-6 p-4 sm:p-6">
                <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 md:grid-cols-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Identifier</p>
                    <p className="mt-1 font-mono text-xs sm:text-sm font-semibold break-all">deliverydrones</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Syntax</p>
                    <p className="mt-1 font-mono text-xs sm:text-sm break-all">%deliverydrones_&lt;key&gt;%</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Test Command</p>
                    <p className="mt-1 font-mono text-xs sm:text-sm break-all">/papi parse me %deliverydrones_outgoing_count%</p>
                  </div>
                </div>
              </div>

              <h3 className="mb-3 sm:mb-4 text-base sm:text-lg font-semibold">Player Placeholders</h3>
              <div className="card-surface overflow-x-auto mb-6">
                <table className="table-docs">
                  <thead>
                    <tr>
                      <th className="whitespace-nowrap">Placeholder</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {phPlayer.map((ph) => (
                      <tr key={ph.ph}>
                        <td className="whitespace-nowrap"><code className="code-inline text-xs">%deliverydrones_{ph.ph}%</code></td>
                        <td className="text-muted-foreground text-sm">{ph.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h3 className="mb-3 sm:mb-4 text-base sm:text-lg font-semibold">Server Totals</h3>
              <div className="card-surface overflow-x-auto mb-4 sm:mb-6">
                <table className="table-docs">
                  <tbody>
                    <tr>
                      <td className="whitespace-nowrap"><code className="code-inline text-xs">%deliverydrones_total_drones%</code></td>
                      <td className="text-muted-foreground text-sm">All active drones</td>
                    </tr>
                    <tr>
                      <td className="whitespace-nowrap"><code className="code-inline text-xs">%deliverydrones_total_flying%</code></td>
                      <td className="text-muted-foreground text-sm">Flying drones</td>
                    </tr>
                    <tr>
                      <td className="whitespace-nowrap"><code className="code-inline text-xs">%deliverydrones_total_landed%</code></td>
                      <td className="text-muted-foreground text-sm">Landed drones</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="mb-3 sm:mb-4 text-base sm:text-lg font-semibold">Outgoing / Incoming Drone Fields</h3>
              <p className="mb-2 sm:mb-3 text-xs text-muted-foreground">Use indexed placeholders like <code className="code-inline">%deliverydrones_outgoing_1_sender%</code> or omit index for first: <code className="code-inline">%deliverydrones_outgoing_sender%</code></p>
              <div className="card-surface overflow-x-auto mb-6">
                <table className="table-docs">
                  <thead>
                    <tr>
                      <th className="whitespace-nowrap">Field</th>
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
                      <td className="text-muted-foreground text-sm">Total number of unique item stacks</td>
                    </tr>
                    <tr>
                      <td><code className="code-inline text-xs">animal_count / animals</code></td>
                      <td className="text-muted-foreground text-sm">Total number of animals</td>
                    </tr>
                    <tr>
                      <td><code className="code-inline text-xs">has_items</code></td>
                      <td className="text-muted-foreground text-sm">Returns true if the drone contains any items</td>
                    </tr>
                    <tr>
                      <td><code className="code-inline text-xs">has_animals</code></td>
                      <td className="text-muted-foreground text-sm">Returns true if the drone contains any animals</td>
                    </tr>
                    <tr>
                      <td><code className="code-inline text-xs">items_summary</code></td>
                      <td className="text-muted-foreground text-sm">Grouped item overview (e.g., 3x Diamond, 10x Iron Ingot)</td>
                    </tr>
                    <tr>
                      <td><code className="code-inline text-xs">items_list</code></td>
                      <td className="text-muted-foreground text-sm">Slot-by-slot item list</td>
                    </tr>
                    <tr>
                      <td><code className="code-inline text-xs">items_total</code></td>
                      <td className="text-muted-foreground text-sm">Total count of all items combined</td>
                    </tr>
                    <tr>
                      <td><code className="code-inline text-xs">animals_summary</code></td>
                      <td className="text-muted-foreground text-sm">Grouped animal overview (e.g., 2x Cow, 1x Pig)</td>
                    </tr>
                    <tr>
                      <td><code className="code-inline text-xs">animals_list</code></td>
                      <td className="text-muted-foreground text-sm">Full list of animals (e.g., Cow, Pig, Cow)</td>
                    </tr>
                    <tr>
                      <td><code className="code-inline text-xs">contents_summary</code></td>
                      <td className="text-muted-foreground text-sm">Combined items and animals summary</td>
                    </tr>
                    <tr>
                      <td><code className="code-inline text-xs">item_1_name</code></td>
                      <td className="text-muted-foreground text-sm">Name of the first item (index dynamically)</td>
                    </tr>
                    <tr>
                      <td><code className="code-inline text-xs">item_1_amount</code></td>
                      <td className="text-muted-foreground text-sm">Amount of the first item (index dynamically)</td>
                    </tr>
                    <tr>
                      <td><code className="code-inline text-xs">animal_1_name</code></td>
                      <td className="text-muted-foreground text-sm">Name of the first animal (index dynamically)</td>
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
              <p className="mb-2 sm:mb-3 text-xs text-muted-foreground">Access config values with <code className="code-inline">%deliverydrones_config_*%</code> to mirror <code className="code-inline">settings.drone.*</code> keys.</p>
              <div className="card-surface overflow-x-auto">
                <table className="table-docs">
                  <thead>
                    <tr>
                      <th className="whitespace-nowrap">Placeholder</th>
                      <th className="whitespace-nowrap">Maps to (settings.drone.*)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="whitespace-nowrap"><code className="code-inline text-xs">%deliverydrones_config_speed%</code></td>
                      <td className="whitespace-nowrap"><code className="code-inline text-xs">speed</code></td>
                    </tr>
                    <tr>
                      <td className="whitespace-nowrap"><code className="code-inline text-xs">%deliverydrones_config_startup_speed%</code></td>
                      <td className="whitespace-nowrap"><code className="code-inline text-xs">startup-speed</code></td>
                    </tr>
                    <tr>
                      <td className="whitespace-nowrap"><code className="code-inline text-xs">%deliverydrones_config_startup_seconds%</code></td>
                      <td className="whitespace-nowrap"><code className="code-inline text-xs">startup-seconds</code></td>
                    </tr>
                    <tr>
                      <td className="whitespace-nowrap"><code className="code-inline text-xs">%deliverydrones_config_approach_speed%</code></td>
                      <td className="whitespace-nowrap"><code className="code-inline text-xs">approach-speed</code></td>
                    </tr>
                    <tr>
                      <td className="whitespace-nowrap"><code className="code-inline text-xs">%deliverydrones_config_approach_distance%</code></td>
                      <td className="whitespace-nowrap"><code className="code-inline text-xs">approach-distance</code></td>
                    </tr>
                    <tr>
                      <td className="whitespace-nowrap"><code className="code-inline text-xs">%deliverydrones_config_delivery_radius%</code></td>
                      <td className="whitespace-nowrap"><code className="code-inline text-xs">delivery-radius</code></td>
                    </tr>
                    <tr>
                      <td className="whitespace-nowrap"><code className="code-inline text-xs">%deliverydrones_config_despawn_minutes%</code></td>
                      <td className="whitespace-nowrap"><code className="code-inline text-xs">despawn-time-minutes</code></td>
                    </tr>
                    <tr>
                      <td className="whitespace-nowrap"><code className="code-inline text-xs">%deliverydrones_config_despawn_mode%</code></td>
                      <td className="whitespace-nowrap"><code className="code-inline text-xs">despawn-mode</code></td>
                    </tr>
                    <tr>
                      <td className="whitespace-nowrap"><code className="code-inline text-xs">%deliverydrones_config_inventory_size%</code></td>
                      <td className="whitespace-nowrap"><code className="code-inline text-xs">inventory-size</code></td>
                    </tr>
                    <tr>
                      <td className="whitespace-nowrap"><code className="code-inline text-xs">%deliverydrones_config_max_active_per_sender%</code></td>
                      <td className="whitespace-nowrap"><code className="code-inline text-xs">max-active-per-sender</code></td>
                    </tr>
                    <tr>
                      <td className="whitespace-nowrap"><code className="code-inline text-xs">%deliverydrones_config_max_sockets_per_player%</code></td>
                      <td className="whitespace-nowrap"><code className="code-inline text-xs">max-sockets-per-player</code></td>
                    </tr>
                    <tr>
                      <td className="whitespace-nowrap"><code className="code-inline text-xs">%deliverydrones_config_max_leashed_animals%</code></td>
                      <td className="whitespace-nowrap"><code className="code-inline text-xs">max-leashed-animals-per-drone</code></td>
                    </tr>
                    <tr>
                      <td className="whitespace-nowrap"><code className="code-inline text-xs">%deliverydrones_config_carry_leashed_animals%</code></td>
                      <td className="whitespace-nowrap"><code className="code-inline text-xs">carry-leashed-animals</code></td>
                    </tr>
                    <tr>
                      <td className="whitespace-nowrap"><code className="code-inline text-xs">%deliverydrones_config_follow_gliding%</code></td>
                      <td className="whitespace-nowrap"><code className="code-inline text-xs">follow-gliding-player</code></td>
                    </tr>
                    <tr>
                      <td className="whitespace-nowrap"><code className="code-inline text-xs">%deliverydrones_config_follow_airborne%</code></td>
                      <td className="whitespace-nowrap"><code className="code-inline text-xs">follow-airborne-player-before-landing</code></td>
                    </tr>
                    <tr>
                      <td className="whitespace-nowrap"><code className="code-inline text-xs">%deliverydrones_config_airborne_follow_min_height%</code></td>
                      <td className="whitespace-nowrap"><code className="code-inline text-xs">airborne-follow-min-height</code></td>
                    </tr>
                    <tr>
                      <td className="whitespace-nowrap"><code className="code-inline text-xs">%deliverydrones_config_airborne_follow_max_seconds%</code></td>
                      <td className="whitespace-nowrap"><code className="code-inline text-xs">airborne-follow-max-seconds-after-start</code></td>
                    </tr>
                    <tr>
                      <td className="whitespace-nowrap"><code className="code-inline text-xs">%deliverydrones_config_hologram_enabled%</code></td>
                      <td className="whitespace-nowrap"><code className="code-inline text-xs">hologram.enabled</code></td>
                    </tr>
                    <tr>
                      <td className="whitespace-nowrap"><code className="code-inline text-xs">%deliverydrones_config_bossbar_enabled%</code></td>
                      <td className="whitespace-nowrap"><code className="code-inline text-xs">bossbar.enabled</code></td>
                    </tr>
                    <tr>
                      <td className="whitespace-nowrap"><code className="code-inline text-xs">%deliverydrones_config_container_integration%</code></td>
                      <td className="whitespace-nowrap"><code className="code-inline text-xs">container-integration.enabled</code></td>
                    </tr>
                    <tr>
                      <td className="whitespace-nowrap"><code className="code-inline text-xs">%deliverydrones_config_container_search_radius%</code></td>
                      <td className="whitespace-nowrap"><code className="code-inline text-xs">container-integration.search-radius</code></td>
                    </tr>
                    <tr>
                      <td className="whitespace-nowrap"><code className="code-inline text-xs">%deliverydrones_config_launch_animation%</code></td>
                      <td className="whitespace-nowrap"><code className="code-inline text-xs">launch-animation.enabled</code></td>
                    </tr>
                    <tr>
                      <td className="whitespace-nowrap"><code className="code-inline text-xs">%deliverydrones_config_collection_animation%</code></td>
                      <td className="whitespace-nowrap"><code className="code-inline text-xs">collection-animation.enabled</code></td>
                    </tr>
                    <tr>
                      <td className="whitespace-nowrap"><code className="code-inline text-xs">%deliverydrones_config_locate_particles%</code></td>
                      <td className="whitespace-nowrap"><code className="code-inline text-xs">locate-particles.enabled</code></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="mb-4 mt-6 text-lg font-semibold">Item & Animal Index Access</h3>
              <p className="mb-3 text-xs text-muted-foreground">Access specific items or animals from a drone by index:</p>
              <div className="card-surface overflow-x-auto mb-6">
                <table className="table-docs">
                  <thead>
                    <tr>
                      <th>Placeholder</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code className="code-inline text-xs">%deliverydrones_item_&lt;index&gt;_name%</code></td>
                      <td className="text-muted-foreground text-sm">Name of the item at position (1-based index). Example: <code className="code-inline text-xs">%deliverydrones_item_1_name%</code></td>
                    </tr>
                    <tr>
                      <td><code className="code-inline text-xs">%deliverydrones_item_&lt;index&gt;_amount%</code></td>
                      <td className="text-muted-foreground text-sm">Stack size of the item (e.g., 64, 1, 16)</td>
                    </tr>
                    <tr>
                      <td><code className="code-inline text-xs">%deliverydrones_item_&lt;index&gt;_material%</code></td>
                      <td className="text-muted-foreground text-sm">Material type of the item (e.g., DIAMOND, IRON_INGOT)</td>
                    </tr>
                    <tr>
                      <td><code className="code-inline text-xs">%deliverydrones_animal_&lt;index&gt;_name%</code></td>
                      <td className="text-muted-foreground text-sm">Type of animal (1-based index). Example: <code className="code-inline text-xs">%deliverydrones_animal_1_name%</code></td>
                    </tr>
                    <tr>
                      <td><code className="code-inline text-xs">%deliverydrones_animal_&lt;index&gt;_type%</code></td>
                      <td className="text-muted-foreground text-sm">Animal entity type (e.g., COW, PIG, HORSE)</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="mb-4 text-lg font-semibold">UUID-based Drone Access</h3>
              <p className="mb-3 text-xs text-muted-foreground">Access drone information by UUID instead of player context:</p>
              <div className="card-surface p-4 bg-blue/10 border border-blue/20 text-sm mb-6">
                <p className="text-muted-foreground"><strong>Format:</strong> <code className="code-inline">%deliverydrones_id_&lt;uuid&gt;_&lt;field&gt;%</code> or <code className="code-inline">%deliverydrones_drone_&lt;uuid&gt;_&lt;field&gt;%</code></p>
                <p className="text-muted-foreground mt-2"><strong>Example:</strong> <code className="code-inline">%deliverydrones_id_550e8400-e29b-41d4-a716-446655440000_receiver%</code></p>
                <p className="text-muted-foreground mt-2">Use any field from the "Outgoing/Incoming Drone Fields" table above (sender, receiver, distance, eta, items_summary, etc.)</p>
              </div>

              <h3 className="mb-4 text-lg font-semibold">UUID to Name Resolution</h3>
              <p className="mb-3 text-xs text-muted-foreground">Resolve a player name from UUID (works even for offline players):</p>
              <div className="card-surface overflow-x-auto">
                <table className="table-docs">
                  <tbody>
                    <tr>
                      <td><code className="code-inline text-xs">%deliverydrones_playername_&lt;uuid&gt;%</code></td>
                      <td className="text-muted-foreground text-sm">Player name from UUID</td>
                    </tr>
                    <tr>
                      <td><code className="code-inline text-xs">%deliverydrones_player_name_&lt;uuid&gt;%</code></td>
                      <td className="text-muted-foreground text-sm">Alias for playername</td>
                    </tr>
                    <tr>
                      <td><code className="code-inline text-xs">%deliverydrones_name_&lt;uuid&gt;%</code></td>
                      <td className="text-muted-foreground text-sm">Short form</td>
                    </tr>
                    <tr>
                      <td><code className="code-inline text-xs">%deliverydrones_uuid_to_name_&lt;uuid&gt;%</code></td>
                      <td className="text-muted-foreground text-sm">Explicit form</td>
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
