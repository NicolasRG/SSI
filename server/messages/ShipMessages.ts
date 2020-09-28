export interface OnGameInitMessage{
    playerState : {
        name : String,
        id : String,
        card : any
    }
}

export interface CMD{
    playerState : {
        name : String,
        id : String,
        card : any
    }
}

export interface CMDMessage{
    msg : String
}