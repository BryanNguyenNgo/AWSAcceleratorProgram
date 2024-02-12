import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { ListOrdered, MessageCircle, BadgeDollarSign } from "lucide-react";
import { FC, useState, useEffect } from "react";
import { OrderPanelTabs } from "./OrderPanelTabs";
import OrderPage from "./../../order/page"
import {PaymentPage} from "./../../payment/page"
import { ReservationPage } from "@/app/reservation/page";
//import { QRCodeScannerPage } from "@/app/qrcode/page";
import { useRef } from "react";
interface Prop {
  disable: boolean;
  selectedTab: OrderPanelTabs;
}

export const OrderSelector: FC<Prop> = (props) => {
  const paymentTabRef = useRef<HTMLButtonElement>(null);
  const reservationTabRef = useRef<HTMLButtonElement>(null);
  const orderTabRef = useRef<HTMLButtonElement>(null);

  const [selectedTab, setSelectedTab] = useState<OrderPanelTabs>(
    props.selectedTab
  );

  const onTabsChange = (value: OrderPanelTabs) => {
    setSelectedTab(value);
  };
  const [orderDetails, setOrderDetails] = useState<any>({}); // Update any to the actual type of your order details

  const handleNextClick = (newOrderDetails: any) => {
    // Perform any necessary logic with the new orderDetails
    // For example, you can merge the newOrderDetails with the existing orderDetails
    const updatedOrderDetails = { ...orderDetails, ...newOrderDetails };
    
    // You can also make an API call or perform any other actions with the order details here

    // Set the updated order details and move to the PaymentTab
    setOrderDetails(updatedOrderDetails);
    setSelectedTab(OrderPanelTabs.PaymentTab);
  };
  const handleNextOrderClick = (newOrderDetails: any) => {
    // Perform any necessary logic with the new orderDetails
    // For example, you can merge the newOrderDetails with the existing orderDetails
    const updatedOrderDetails = { ...orderDetails, ...newOrderDetails };
    
    // You can also make an API call or perform any other actions with the order details here

    // Set the updated order details and move to the PaymentTab
    setOrderDetails(updatedOrderDetails);
    setSelectedTab(OrderPanelTabs.OrderTab);
  };
  const handleScanClick = () => {
    // Perform any necessary logic with the new orderDetails
    // For example, you can merge the newOrderDetails with the existing orderDetails
    //const updatedOrderDetails = { ...orderDetails, ...newOrderDetails };
    
    // You can also make an API call or perform any other actions with the order details here

    // Set the updated order details and move to the PaymentTab
    //setOrderDetails(updatedOrderDetails);
    setSelectedTab(OrderPanelTabs.OrderTab);
  };
  useEffect(() => {
    console.log("selectedTab", selectedTab);
    if (selectedTab === OrderPanelTabs.PaymentTab && paymentTabRef.current) {
      paymentTabRef.current.focus();
    }
    if (selectedTab === OrderPanelTabs.OrderTab && orderTabRef.current) {
      orderTabRef.current.focus();
    }
  }, [selectedTab, orderDetails]);
  
  return (
    <div>
      <Tabs
        defaultValue={OrderPanelTabs.ReservationTab}
        onValueChange={(value) => onTabsChange(value as OrderPanelTabs)}
      >
        <TabsList className="grid w-full grid-cols-3 h-12 items-stretch ">
          <TabsTrigger
            ref={OrderPanelTabs.ReservationTab ? reservationTabRef : null}
            value={OrderPanelTabs.ReservationTab}
            className="flex gap-2"
            disabled={props.disable}
          >
             <MessageCircle size={20} /> Customer Details
          </TabsTrigger>
          <TabsTrigger
            ref={OrderPanelTabs.OrderTab ? orderTabRef : null}
            value={OrderPanelTabs.OrderTab}
            className="flex gap-2"
            disabled={props.disable}
          >
            <ListOrdered size={20} /> Order
          </TabsTrigger>
          <TabsTrigger
          ref={selectedTab === OrderPanelTabs.PaymentTab ? paymentTabRef : null}
          value={OrderPanelTabs.PaymentTab}
          className="flex gap-2"
          disabled={props.disable}
        >
          <BadgeDollarSign size={20} /> Payment
        </TabsTrigger>

        </TabsList>
      </Tabs>
      {selectedTab === OrderPanelTabs.OrderTab && <OrderPage onNextClick={handleNextClick} orderDetails={orderDetails}/>}
      {selectedTab === OrderPanelTabs.PaymentTab && (<PaymentPage orderDetails={orderDetails} />)}
      {selectedTab === OrderPanelTabs.ReservationTab && (<ReservationPage orderDetails={orderDetails} onNextClick={handleNextOrderClick}/>)}
      {/* Render other components for different tabs as needed */}
    </div>
  );
};
