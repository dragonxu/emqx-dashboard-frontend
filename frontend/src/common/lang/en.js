import enLocale from 'element-ui/lib/locale/lang/en'


export default {
  ...enLocale,
  // leftbar
  leftbar: {
    // MONITORING
    monitoring: 'MONITORING',
    overview: 'Overview',
    clients: 'Clients',
    sessions: 'Sessions',
    routes: 'Routes',
    subscriptions: 'Subscriptions',
    // MANAGEMENT
    management: 'MANAGEMENT',
    plugins: 'Plugins',
    listeners: 'Listeners',
    // TOOLS
    tools: 'TOOLS',
    websocket: 'Websocket',
    api: 'HTTP API',
    // ADMIN
    admin: 'ADMIN',
    users: 'Users',
  },
  // overview
  overview: {
    // Broker
    broker: 'Broker',
    systemName: 'System Name',
    version: 'Version',
    uptime: 'Uptime',
    systemTime: 'System Time',
    // Nodes
    nodes: 'Nodes',
    name: 'Name',
    erlangProcesses: 'Erlang Processes',
    cpuInfo: 'CPU Info',
    memoryInfo: 'Memory Info',
    maxFds: 'MaxFds',
    status: 'Status',
    // Stats
    stats: 'Stats',
    clientsCount: 'Clients/Count',
    clientsMax: 'Clients/Max',
    retainedCount: 'Retained/Count',
    retainedMax: 'Retained/Max',
    routesCount: 'Routes/Count',
    routesMax: 'Routes/Max',
    sessionsCount: 'Sessions/Count',
    subscribersCount: 'Subscribers/Count',
    topicsCount: 'Topics/Count',
    topicsMax: 'Topics/Max',
    // Metrics
    metrics: 'Metrics',
    packetsData: 'The packets data',
    messagesData: 'The messages data',
    bytesData: 'The bytes data',
  },
}
