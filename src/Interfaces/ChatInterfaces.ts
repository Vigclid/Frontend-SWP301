export interface Chat {
    chatId : number | undefined
    user1Id : number | undefined
    user2Id : number | undefined
    status : number | undefined

}


export interface Message {
    messageId : number | undefined
    senderId : number | undefined
    receiverId : number | undefined
    messageContetn : string | null
    dateSent : string | null
    isRead : number | undefined
}