export interface Payment{
    amount : number,
    transCode : string,
    accountId : number,
    createdAt : string,
    status : string,
    // private int paymentId;
    // private double amount;
    // private Date createdAt;
    // private int userId;
    // private byte status;
    // private String transCode;

}

export interface GetPaymentJava {
    paymentId : number,
    amount : number,
    transCode : string,
    userId : number,
    createdAt : string,
    status : string,
}