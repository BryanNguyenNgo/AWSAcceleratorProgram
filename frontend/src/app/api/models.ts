
export type OrderDetails = {
    orderid: string,
    ordercode: string,
    phonenumber: string,
    name: string, 
    childprice: number,
    numberofchildren: number,
    numberofsenstud: number,
    senstudprice: number,
    adultprice: number,
    numberofadults: number,
    tier: string,
    totalamount: number,
    paymentoption: string,
    time: string
};

export enum PaxType {
    Adult = "Adult",
    Children = "Children"
}

export type ErrorMessage = {
    title: string;
    subtitle: string;
};
export type MenuPrice = {
    PK: string,
    SK: string,
    days: string,
    end_time: string,
    menutype: string,
    start_time: string,
    paxtype: string,
    tier: string,
    price: number,
    remarks: string,
};
