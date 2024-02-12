// pages/index.tsx
"use client";
import React, { useState, useCallback , useEffect} from 'react';
import { QrReader } from 'react-qr-reader'; // Use the correct named export
import { useBoolean } from "@fluentui/react-hooks"
import { DialogType, Dialog } from "@fluentui/react";
import { ErrorMessage } from '../api/models';
import { OrderSelector } from "../components/OrderPanel/OrderSelector";
import { OrderPanelTabs } from '../components/OrderPanel/OrderPanelTabs';
import { FormEvent } from 'react';

interface Prop {
  onNextClick: (orderDetails: any) => void; 
}
export const QRCodeScannerPage = ({ onNextClick }: Prop) => {
  const [result, setResult] = useState<string | undefined>(undefined);
  const [hideErrorDialog, { toggle: toggleErrorDialog }] = useBoolean(true);
  const [errorMsg, setErrorMsg] = useState<ErrorMessage | null>();
  const [orderTab, setOrderTab] = useState<OrderPanelTabs | undefined>(undefined);

  const handleScan = (data: string | null) => {
    alert("Hello");
    setErrorMsg({
      title: 'QR Code scanned',
      subtitle: 'Thank you!',
    });
    toggleErrorDialog();
    
    if (data) {
      setResult(data);
      console.log(data); // Use the current value of data instead of result
    }
  };

  const handleError = (err: any) => {
    console.error(err);
  };

  const resetScanner = useCallback(() => {
    setResult(undefined);
  }, []);
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
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    //alert("hello here");
    handleScan("");
    onNextClick(undefined);
    setOrderTab(OrderPanelTabs.OrderTab);
    
  }
  return (
    <div>
       <h5>Please show your QR Code from Our Seoul Digital or enter your phone number</h5>
       <h1>Enter your phone number (no spaces)</h1>
      <input type="text" name="phoneNumber" />
      <form onSubmit={onSubmit}>
        <button className="w-[80px] h-[40px] p-1 text-primary bg-blue-350 relative gap-2 justify-center rounded-lg" type="submit">Scan</button>
      </form>
      <h1>QR Code Scanner</h1>
      {result ? (
        <div>
          <p>Result: {result}</p>
          <button onClick={resetScanner}>Scan Again</button>
        </div>
      ) : (
        <QrReader
          delay={300} // Add delay as a direct prop
          onError={handleError}
          onScan={handleScan}
          style={{ width: '50%' }}
          legacyMode={true} // Enable legacy mode for continuous scanning
        />
        
      )}
      <Dialog hidden={hideErrorDialog} onDismiss={handleErrorDialogClose} dialogContentProps={errorDialogContentProps} modalProps={modalProps}></Dialog>
      <div>
      {/* <OrderSelector disable={false} selectedTab={orderTab || OrderPanelTabs.ReservationTab} /> */}
      </div>
    </div>
  );
}
