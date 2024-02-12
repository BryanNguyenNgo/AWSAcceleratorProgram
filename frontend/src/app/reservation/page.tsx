'use client'

import { FormEvent } from 'react';
import React, { useEffect, useState } from 'react';
import { OrderDetails } from '../api/models';
import { getOrderAPI } from '../api/apiConnector';
import { OrderPanelTabs } from "../components/OrderPanel";
import {QRCodeScannerPage} from '../qrcode/page';

interface Prop {
  orderDetails: OrderDetails;
  onNextClick: (orderDetails: OrderDetails) => void; 
}
export const ReservationPage = ({ orderDetails, onNextClick }: Prop) => {
  const [order, setOrder] = useState(orderDetails);
  const [activeOrderPanelTab, setActiveOrderPanelTab] = useState<OrderPanelTabs | undefined>(undefined);
  const [selectedAnswer, setSelectedAnswer] = useState<number>(0);
  const onToggleTab = (tab: OrderPanelTabs, index: number) => {
    if (activeOrderPanelTab === tab && selectedAnswer === index) {
      setActiveOrderPanelTab(undefined);
    } else {
      setActiveOrderPanelTab(tab);
    }
  }
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const phoneNumber = String(formData.get('phoneNumber'))
    const name = String(formData.get('name'))
    console.log('hello from submit button')
    console.log("name");
    console.log(name);
    
    try {
      const orderDetails: OrderDetails = {
        orderid: "",
        ordercode: "",
        adultprice: 0,
        numberofadults: 0,
        childprice: 0,
        numberofchildren: 0,
        tier: "",
        totalamount: 0,
        senstudprice: 0,
        numberofsenstud: 0,
        paymentoption: "",
        phonenumber:phoneNumber,
        name: name,
        time: ""
        
      };
      // const response = await getOrderAPI(phoneNumber, name);
      setOrder(orderDetails)
      console.log('response from getOrderAPI', order);      
      console.log("hello from orderDetails");
      console.log(orderDetails);
      onNextClick(orderDetails);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  }
  // when random assortment of letters is typed in, orderid from previous transaction is received
  return (
    <div className='content-center' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '25vh' }}>
      <form onSubmit={onSubmit}>

          <div className="flex flex-row gap-4">
            <label className="text-sm font-semibold">Customer name:</label>
            <input type="text" name="name" id="name" className="border rounded-md px-2 py-1 focus:outline-none focus:border-primary" />
          </div>
          <div className="flex flex-row gap-4">
            <label className="text-sm font-semibold">Customer phone number (no spaces):</label>
            <input type="text" name="phoneNumber" id="phoneNumber" className="border rounded-md px-2 py-1 focus:outline-none focus:border-primary" />
          </div>
          <div>
            <button className="w-[80px] h-[40px] p-1 bg-blue-500 relative gap-2 justify-center rounded-lg" type="submit">Next</button>
          </div>
      </form>
    </div>
  );  
}