type Serializable = string | number | boolean | { [key: string]: Serializable } | Array<Serializable>;

// TODO: get from kalm directly
interface KalmTransport {
    (params: any, emitter: NodeJS.EventEmitter): Socket
}
interface Socket {
    bind: () => void
    remote: (handle: SocketHandle) => Remote
    connect: (handle?: SocketHandle) => SocketHandle
    stop: () => void
    send: (handle: SocketHandle, message: number[] | Buffer) => void
    disconnect: (handle: SocketHandle) => void
}

type SocketHandle = NodeJS.Socket | UDPSocketHandle | WebSocket

type Remote = {
    host: string
    port: number
}

type UDPSocketHandle = {
    socket: any
    port: number
    host: string
}
// :END TODO

interface P3 {
    connect: (config: P3ClientOptions) => P3ClientNode
    listen: (config: P3ServerOptions) => P3ServerNode
}

interface P3ClientOptions {
    id?: string
    host?: string
    port?: number | string
    transport: KalmTransport
}

type P3ClientEvents = 'error' | 'frame' | 'connect' | 'disconnect'
type P3ServerEvents = P3ClientEvents & 'connection' | 'disconnection' | 'frameDropped' | 'frameDeleted'
type P3ConnectionEvents = 'error' | 'entityCreated' | 'entityUpdated'

interface P3Node extends NodeJS.EventEmitter {
    getFrame: (frameIndex: number) => P3Frame
    getEntities: (options?: P3FrameQueryOptions) => P3Entity[]
    createEntity: (entityType: string, body?: P3EntityBody) => string
    updateEntity: (entityId: string, body: P3EntityBody) => string
    killEntity: (entityId: string) => void
}

interface P3ClientNode extends P3Node {
    setInputState: (entityId: string, inputs: P3InputList) => string
    on: (event: P3ClientEvents, handler: any) => any
}

interface P3FrameQueryOptions {
    frameOffset?: number
    connection?: string
}

interface P3ServerOptions {
    id?: string
    host?: string
    port?: number | string
    transport: KalmTransport
    tickRate?: number
    bufferFrame?: number
}

interface P3ServerNode extends P3Node {
    createEntityType: (entityType: string, config: P3EntityConfig) => string
    getConnections: () => P3Connection[]
    on: (event: P3ServerEvents, handler: any) => any
}

interface P3Connection extends NodeJS.EventEmitter {
    id: string
    createdAt: number
    updatedAt: number
    deletedAt: number
    on: (event: P3ConnectionEvents, handler: any) => any
}

/*type P3GossipNode = {
    gossipChannel: string
    isSeed: boolean
    seedHost: string
    pairedHosts: string[]
}*/

interface P3Frame {
    frame: number
    type: 'verified' | 'predicted' | 'generated' | 'corrected'
    entityUpdates: ({ entityId: string } & P3EntityBody)[]
}

interface P3EntityBody {
    [field: string]: Serializable
}

interface P3EntityConfig {
    fields: {
        [field: string]: {
            type: string
            min?: number
            max?: number
            access?: 'client' | 'server' | 'seed'
        }
    }
    connectionBound: boolean
}

type P3Entity = {
    id: string
    entityType: string
    createdAt: number
    updatedAt: number
    deletedAt: number
    connectionId?: string
    body: P3EntityBody
}

type P3EntityInput = {
    isActive: (inputName: string) => boolean
} & P3InputList

type P3InputList = {
    [inputName: string]: boolean
}