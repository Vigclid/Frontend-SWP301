export interface Notification {
    notificationId: number
    message: string | undefined
    interactId:number | undefined
    profileNoti: number | false
    artworkNoti: number | undefined
    isRead : number 
    followID : number | undefined
    amount : number | undefined
    transferID: number | undefined
}