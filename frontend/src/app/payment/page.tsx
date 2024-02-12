"use client"
import dotenv from 'dotenv';
dotenv.config();
import { FormEvent } from 'react';

import React, { useEffect, useState } from 'react';
import { OrderDetails } from '../api/models';
import { createOrderAPI } from '../api/apiConnector';
import { useBoolean } from "@fluentui/react-hooks"
import { DialogType, Dialog } from "@fluentui/react";
import { ErrorMessage } from '../api/models';
import Popup from '../components/popup'

interface Prop {
  orderDetails: OrderDetails;
}
export const PaymentPage = ({  orderDetails }: Prop) => {
  // Your PaymentPage component logic here
  console.log("Order Details in PaymentPage:", orderDetails);
  const [selectedOption, setSelectedOption] = useState('undefined');
  const [order, setOrder] = useState(orderDetails);
  console.log("Order Details in order:", order);
  const [hideErrorDialog, { toggle: toggleErrorDialog }] = useBoolean(true);
  const [errorMsg, setErrorMsg] = useState<ErrorMessage | null>();
  const [hideFeedbackDialog, { toggle: toggleFeedbackDialog }] = useBoolean(true);
  const [isPopupVisible, setPopupVisible] = useState(false);
  // ==============Function to display pop up message=====================
  const dialogContentProps = {
    type: DialogType.close,
    title: "Provide additional feedback",
    closeButtonAriaLabel: "Close"
  };
  const handleErrorDialogClose = () => {
    toggleErrorDialog();
    // Reset the error state immediately
    setErrorMsg(null);
  };
  const errorDialogContentProps = {
    type: DialogType.close,
    title: errorMsg?.title,
    closeButtonAriaLabel: "Close",
    subText: errorMsg?.subtitle
  };

  const modalProps = {
    titleAriaId: "labelId",
    subtitleAriaId: "subTextId",
    isBlocking: true,
    styles: { main: { maxWidth: 300 } }
  };
  const showPopup = () => {
    setPopupVisible(true);
    setTimeout(() => {
      setPopupVisible(false);
    }, 6000); // Adjust the duration (in milliseconds) as needed
  };
  // ==============Function when click confirm button
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log('hello from submit button: order details here');
    try {
      order.paymentoption = selectedOption;
      console.log(order);

      const response = await createOrderAPI(order);
      // after saved to dynamodb, retrieve saved record and return to ui
      //setOrder(response)

      console.log('response from createOrderAPI', response);
      let subtitle = 'Payment is submitted successfully'
      setErrorMsg({
        title: `
        Your table is Table ${randomNum}
        `,
        subtitle: `Order Code: ${response.ordercode}`,
      })
      toggleErrorDialog();
      // After submit, you can perform additional actions, such as redirecting to a new page
      // router.push(`/payment?orderid=${orderId}`);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  }
  const handleSelectChange = (e: any) => {
    const option = e.target.value;
    
    setSelectedOption(option);
    showPopup()
    
  }
  let message = "Please insert cash"
  if (selectedOption == "Card"){
    message = "Please swipe, insert or tap card on reader"
  }
  
  function getRandomNumber(min: number, max: number): number {
    // Generate a random number between 0 (inclusive) and 1 (exclusive)
    const randomFraction = Math.random();
  
    // Scale the random number to fit within the specified range
    const randomNumberInRange = Math.floor(min + (randomFraction * (max - min + 1)));
  
    return randomNumberInRange;
  }
  // Create a new Date object
  
  const randomNum = getRandomNumber(1, 20);
  return (
    <div className='content-center' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '35vh' }}>
    
    <form onSubmit={onSubmit}>
    <table>
      
      {/* Displaying orderid */}
      <tr>
      <h5 className="text-sm font-semibold"> Time of order: {orderDetails.time}</h5>
      <h5 className="text-sm font-semibold">Order Code: {orderDetails.ordercode}</h5>
      <h5 className="text-sm font-semibold"> Name: {orderDetails.name}</h5>
      <h5 className="text-sm font-semibold"> PhoneNumber: {orderDetails.phonenumber}</h5>
      
      </tr>
      {/* Displaying NumberOfAdults and NumberOfChildren from state */}
      {orderDetails && (
        <>
        <tr>
        <td><label className="text-sm font-semibold">Number Of Adults: {orderDetails.numberofadults}</label></td>
        </tr>
        <tr>
        <td><label className="text-sm font-semibold">Number Of Children: {orderDetails.numberofchildren}</label></td>
        </tr>
        <tr>
        <td><label className="text-sm font-semibold">Number Of Seniors and Students: {orderDetails.numberofsenstud}</label></td>
        </tr>
        <tr>
        <td><label className="text-sm font-semibold">Total Amount: ${orderDetails.totalamount.toFixed(2)}</label></td>
        </tr>
        <tr>
          <td><label className="text-sm font-semibold">Select Payment Option:</label></td>
          <td><select
            id="payingTier"
            name="payingTier"
            value={selectedOption}
            onChange={handleSelectChange}
          >
            <option value="">Select an Option</option>
            <option value="Cash">Cash</option>
            <option value="Card">Card</option>
          </select>
          </td>
        </tr>
         
        {isPopupVisible && (
        <Popup
          message={message}
          onClose={() => setPopupVisible(false)}
        />
      )}
          <Dialog hidden={hideErrorDialog} onDismiss={handleErrorDialogClose} dialogContentProps={errorDialogContentProps} modalProps={modalProps}></Dialog>
        </>
        
      )}
       
   

  </table>
    <button className="w-[80px] h-[40px] p-1 bg-blue-500 relative gap-2 justify-center rounded-lg" type="submit">Confirm</button>
    </form>
    </div>
  );
};
