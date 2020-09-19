
export interface OnPlayerInitMessage{
    id : String,
    player : {
        name : String,
    },
    itter : Array<String>
}

export interface OnValidReconnectMessage{
    id : String,
    player :{
        name : String
    },
    card :any,
}

export interface NewRoomAddedMessage{
    itter : Array<any>
}

export interface RoomItem{
    id : String, 
    ship : String,
}

export interface OnRoomInitMessage{
    player : {name : String,
    card : any,
    id : String,
    isCreator : Boolean }
}