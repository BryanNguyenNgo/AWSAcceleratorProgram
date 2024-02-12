"use client"
import { OrderSelector } from "./components/OrderPanel/OrderSelector";
import { OrderPanelTabs } from './components/OrderPanel/OrderPanelTabs';
import { useEffect, useState } from 'react';
import { ReservationPage } from "./reservation/page";


export default function Page() {
  const [orderTab, setOrderTab] = useState<OrderPanelTabs | undefined>(undefined);

  const onNoButtonClick = () => {
    setOrderTab(OrderPanelTabs.OrderTab);
  };

  const onYesButtonClick = () => {
    setOrderTab(OrderPanelTabs.ReservationTab);
  };

  useEffect(() => {
    console.log("value of orderTab");
    console.log(orderTab);
  }, [orderTab]);

  return (
    <div className="text-align: center">
      <div>
        <OrderSelector disable={false} selectedTab={orderTab || OrderPanelTabs.ReservationTab} />
      </div>
    </div>
  );
}
