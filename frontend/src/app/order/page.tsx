'use client'
import dotenv from 'dotenv';
dotenv.config();

import React, { useState, useContext, createContext, useReducer, ReactNode, useEffect, FC } from 'react';
import { FormEvent } from 'react';

import { MenuPrice, OrderDetails } from "./../api/models"
import uuid from 'react-uuid';

import { retrievePrice } from '../api/apiConnector';
import { getAllMenu } from '../api/apiConnector';

interface OrderDetailsPageProps {
  orderDetails: OrderDetails;
  onNextClick: (orderDetails: any) => void; // Update any to the actual type of your order details
}

const OrderPage: React.FC<OrderDetailsPageProps> = ({ orderDetails, onNextClick }) => {
    // Your OrderPage component logic here
  const [selectedTier, setSelectedTier] = useState('');
  const [menuPrices, setMenuPrices] = useState<MenuPrice[]>([]);
  const [adultPrice, setAdultPrice] = useState<number>(0);
  const [senStudPrice, setSenStudPrice] = useState<number>(0);
  const [childPrice, setChildPrice] = useState<number>(0);
  const[numberOfAdults, setNumberOfAdults] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [order, setOrder] = useState<OrderDetails>(orderDetails);
  const now = new Date()
  const formattedDateTime = now.toLocaleString();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const allMenu = await getAllMenu();
        // Assuming getAllMenu returns an array of menu items
        console.log("reponse from getAllMenu")
        
        console.log(allMenu)
        
        // write code to loop items from allMenu into list of MenuPrice

        setMenuPrices(allMenu);
      } catch (error) {
        console.error('Error fetching menu:', error);
        // Handle the error accordingly, e.g., set an error state
      }
    };

    fetchData(); // Call the fetchData function
  }, []); // The empty dependency array ensures that the effect runs only once on mount

  // const router = useRouter()
  
  
 
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log('hello from submit button');

    const formData = new FormData(event.currentTarget);
    const numberofadults = Number(formData.get('NumberOfAdults')) || 0;
    const adultprice = adultPrice
    console.log("adultprice at onSubmit");
    console.log(adultprice);
    
    const childprice = childPrice
    const numberofchildren = Number(formData.get('NumberOfChildren')) || 0
    const numberofsenstud = Number(formData.get('NumberOfSenStud')) || 0
    const senstudprice = senStudPrice || 0
    // const totalmount = numberofadults * adultPrice + numberofchildren * childprice + numberofsenstud * senStudPrice
    // const totalamount = totalmount

   
    const orderId = uuid();
    const currentDate = new Date();
    const yyyymmdd = currentDate.toISOString().slice(0, 10).replace(/-/g, '');
    const last5Chars = orderId.slice(-5);
    const ordercode = `REF/${yyyymmdd}/${last5Chars}`;
    try {

      // Convert to decimal number with two decimal places
      let decimalTotalAmount: number = parseFloat(totalAmount.toFixed(2));
      const orderDetails: OrderDetails = {
        orderid: orderId,
        ordercode: ordercode,
        adultprice: parseFloat(adultPrice.toFixed(2)),
        numberofadults: numberofadults,
        childprice: parseFloat(childprice.toFixed(2)),
        numberofchildren: numberofchildren,
        tier: selectedTier,
        totalamount: decimalTotalAmount,
        senstudprice: parseFloat(senstudprice.toFixed(2)),
        numberofsenstud: numberofsenstud,
        paymentoption: "",
        phonenumber: order.phonenumber,
        name: order.name,
        time: formattedDateTime
        
      };
      // const response = createOrderAPI(data);

      // console.log('response from createOrderAPI', response);
      console.log("here at order page");
      console.log(orderDetails);
      onNextClick(orderDetails);
      // After submit, you can perform additional actions, such as redirecting to a new page
      // router.push(`/payment?orderid=${orderId}`);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
   
  }
  const getPaxTypeNumber = (numberOfPaxInput: HTMLInputElement): number => {
    console.log("numberOfPaxInput");
    console.log(numberOfPaxInput);

    let numberOfPaxValue: number = 0;

    if (numberOfPaxInput && numberOfPaxInput.value !== undefined) {
        numberOfPaxValue = parseInt(numberOfPaxInput.value, 10);
    }

    return numberOfPaxValue;
};

useEffect(() => {
}, [adultPrice, childPrice, senStudPrice, totalAmount]);  
  const getMenuPrice = (tier: string, paxtype: string, days: string, start_time: string, end_time: string): number => {
    try {
      console.log("menuPrices at getMenuPrice");
      console.log(menuPrices);
      console.log("tier at getMenuPrice");
      console.log(tier);
      if (!Array.isArray(menuPrices)) {
        throw new Error('menuPrices is not an array');
      }
        // Assuming you have a variable called 'selectedTier' representing the tier you want to filter by
        const selectedTier = tier;
        
        const currentDateTime = new Date(); // You can use your preferred method to get the current date and time
        const currentDay = currentDateTime.toLocaleString('en-US', { weekday: 'long' })
        console.log("day at getMenuPrice")
        const  day = currentDay.substring(0, 3);
        console.log(day)
// Filtering the menuPrices array based on the selected tier

        // Filtering the menuPrices array based on the selected tier
        const filteredMenuPricesByTier = menuPrices.filter((menuPrice) => menuPrice.tier === selectedTier);
        console.log("######## paxtype here at getMenuPrice");
        console.log(paxtype);
        const filteredMenuPricesByPaxType = filteredMenuPricesByTier.filter((menuPrice) => menuPrice.paxtype === paxtype);

        // Filtering the array based on whether the current day is within the specified 'days' array
        const filteredMenuPricesByDay = filteredMenuPricesByPaxType.filter((menuPrice) => {
          const daysArray = menuPrice.days.split(',').map(days => days.trim()); // Assuming 'days' is a comma-separated string of days

          // Check if the current day is in the 'days' array
          return daysArray.includes(day);
        });
        const filteredMenuPricesByTime = filteredMenuPricesByDay.filter((menuPrice) => {

          const formattedDate = currentDateTime.toISOString().split('T')[0];

          console.log(formattedDate);
          const startTime = new Date(`${formattedDate} ${menuPrice.start_time}`);
          const endTime = new Date(`${formattedDate} ${menuPrice.end_time}`);
          // console.log("startTime");
          // console.log(startTime);
          // console.log("endTime");
          // console.log(endTime);
          // console.log("currentDateTime");
          // console.log(currentDateTime);
          
          return currentDateTime >= startTime && currentDateTime <= endTime;
        });
      
        // Now 'filteredMenuPrices' contains only the records with the selected tier
        
        const filteredAllMenuPrices = filteredMenuPricesByTime 
        console.log("filteredMenuPricesByTier")
        console.log(filteredMenuPricesByTier);
        console.log("filteredMenuPricesByPaxType")
        console.log(filteredMenuPricesByPaxType)
        console.log("filteredMenuPricesByDay")
        console.log(filteredMenuPricesByDay)
        console.log("filteredMenuPricesByTime")
        console.log(filteredMenuPricesByTime)
        console.log("filteredAllMenuPrices:")
        console.log(filteredAllMenuPrices);
        

        if (filteredAllMenuPrices.length > 0) {
            console.log("filteredAllMenuPrices[0].price")
            console.log(filteredAllMenuPrices[0].price)
            return filteredAllMenuPrices[0].price
            
        } else {
            throw new Error('No matching menu price found.');
        }
    } catch (error) {
        console.error('Error retrieving menu price:', error);
        return 0;
    }
};

const handleTierChange = (e: any) => {
  const tier = e.target.value;
  
  setSelectedTier(tier);
  // To get the adult pax type
  let paxTypeAdult: string = ""
  const paxTypeAdultNumber = getPaxTypeNumber(document.getElementById("NumberOfAdults") as HTMLInputElement);
  if(paxTypeAdultNumber > 0){
     paxTypeAdult = "Adult"
  }
  let paxTypeChild: string = ""
  const paxTypeChildNumber = getPaxTypeNumber(document.getElementById("NumberOfChildren") as HTMLInputElement);
  if(paxTypeChildNumber > 0){
     paxTypeChild = "Child"
  }
  let paxTypeSenStud: string = ""
  const paxTypeSenStudNumber = getPaxTypeNumber(document.getElementById("NumberOfSenStud") as HTMLInputElement);
  if(paxTypeSenStudNumber > 0){
     paxTypeSenStud = "Senior/Student"
  }
  // To get the child pax type
  const currentDateTime = new Date()
  const days = currentDateTime.toLocaleString('en-US', { weekday: 'long' })
  
  const hours = currentDateTime.getHours();
  const minutes = currentDateTime.getMinutes();
  const seconds = currentDateTime.getSeconds();

  // Format the time as HH:MM:SS
  const start_time = `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
  const end_time = `${padZero(hours)+4}:${padZero(minutes)}:${padZero(seconds)}`;

  function padZero(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }
  const startHour = start_time
  const endHour = end_time
  // First get price for specific tier, pax, day, start_time, end_time tier
  const menuPriceAdult = getMenuPrice(tier, paxTypeAdult, days, startHour, endHour )
  const menuPriceSenStud = getMenuPrice(tier, paxTypeSenStud, days, startHour, endHour )
  const menuPriceChild = getMenuPrice(tier, paxTypeChild, days, startHour, endHour )
  console.log("menuPriceAdult here")
  console.log(menuPriceAdult);
  setAdultPrice(menuPriceAdult);

  console.log("adultPrice here")
  console.log(adultPrice);

  setSenStudPrice(menuPriceSenStud)
  setChildPrice(menuPriceChild)
  const totalamount = (paxTypeAdultNumber * menuPriceAdult) + (paxTypeChildNumber * menuPriceChild) + (paxTypeSenStudNumber * menuPriceSenStud)
  console.log("paxtypeChildNumber")
  console.log(paxTypeChildNumber)
  console.log("paxtypeAdultNumber")
  console.log(paxTypeAdultNumber)
  console.log("paxtypeSenStudNumber")
  console.log(paxTypeSenStudNumber)
  const totalAmountString: string = totalamount.toString();
  const decimalTotalAmount: number = parseFloat(totalAmountString);

  setTotalAmount(decimalTotalAmount)
 
  console.log("adultPrice");
  console.log(adultPrice);
  console.log("senStudPrice")
  console.log(senStudPrice)

  
};
function getRandomName(names: string[]): string | null {
  // Check if the names array is not empty
  if (names.length === 0) {
    return null; // Return null if the array is empty
  }

  // Generate a random index within the range of the names array
  const randomIndex = Math.floor(Math.random() * names.length);

  // Return the randomly picked name
  return names[randomIndex];
}

// Example: Array of names
const namesArray = ["Regular", "Premium", "Supreme"];

// Get a random name from the array
const randomName = getRandomName(namesArray);

  return (
    <div className='content-center' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '35vh' }}>
      
      <form onSubmit={onSubmit}>
        <table>
        <h5 className="text-sm font-semibold">Hello {orderDetails.name}</h5>
      <h5 className="text-sm font-semibold">How many people are in your group?</h5>
          <tr>
            <td><label className="text-sm font-semibold">Number of Adults:</label></td>
            <td><input type="text" name="NumberOfAdults" id="NumberOfAdults" className="border rounded-md px-2 py-1 focus:outline-none focus:border-primary"/></td>
            <td><label className="text-sm font-semibold">Unit price: </label></td>
            <td><label className="text-sm font-semibold">${adultPrice}</label></td>
          </tr>
          <tr>
          <td><label className="text-sm font-semibold">Number of Children:</label></td>
          <td><input type="text" name="NumberOfChildren" id="NumberOfChildren" className="border rounded-md px-2 py-1 focus:outline-none focus:border-primary"/></td>
          <td><label className="text-sm font-semibold">Unit price: </label></td>
          <td><label className="text-sm font-semibold">${childPrice}</label></td>
        </tr>
        <tr>
          <td><label className="text-sm font-semibold">Number of Seniors/Students:</label></td>
          <td><input type="text" name="NumberOfSenStud" id="NumberOfSenStud" className="border rounded-md px-2 py-1 focus:outline-none focus:border-primary"/></td>
          <td><label className="text-sm font-semibold">Unit price:</label></td>
          <td><label className="text-sm font-semibold">${senStudPrice}</label></td>
        </tr>
        <tr>
          <td><label className="text-sm font-semibold">We recommend you get: </label></td>
          <td><label className="text-sm font-semibold bg-orange-500">Regular </label></td>
          
        </tr>
        <tr>
          <td><label className="text-sm font-semibold">Select Paying Tier:</label></td>
          <td><select
            id="payingTier"
            name="payingTier"
            value={selectedTier}
            onChange={handleTierChange}
          >
            <option value="">Select a Tier</option>
            <option value="Regular">Regular</option>
            <option value="Premium">Premium</option>
            <option value="Supreme">Supreme</option>
          </select>
          </td>
        </tr>
        <tr>
          <label className="text-sm font-semibold">Total Amount: ${totalAmount.toFixed(2)}</label>
        </tr>
        <tr>
          <td><button className="w-[80px] h-[40px] p-1 bg-blue-500 relative gap-2 justify-center rounded-lg" type="submit">Next</button>
</td>
        </tr>
        </table>
        
      </form>

    </div>
  );
}
export default OrderPage