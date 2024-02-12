import * as dotenv from 'dotenv';
import { MenuPrice, OrderDetails } from './models';
import uuid from "react-uuid";
import { DayOfWeek } from '@fluentui/react';

// Load environment variables from .env file
dotenv.config();
const APP_API_ENDPOINT = process.env.APP_API_ENDPOINT || "https://cevjqshd22.execute-api.ap-southeast-1.amazonaws.com/api/"
// export async function createHeaders(): Promise<Headers> {
//     // To pass access token to Python protected API endpoint
//     const headers = new Headers();
//     headers.append("Content-Type", "application/json");
    
//     return headers;
// }
// export async function createOrderAPI(request: request) {
//     const headers = await createHeaders();

//     return await fetch(`${APP_API_ENDPOINT}/chat`, {
//         method: "POST",
//         headers: headers,
//         body: JSON.stringify(request)
//     });
// }


export async function createOrderAPI(orderDetails: OrderDetails) {
    try {
        const inputData = {
            orderid: orderDetails.orderid,
            ordercode: orderDetails.ordercode,
            phonenumber: orderDetails.phonenumber,
            name: orderDetails.name,
            adultprice: orderDetails.adultprice,
            numberofadults: orderDetails.numberofadults,
            childprice: orderDetails.childprice,
            numberofchildren: orderDetails.numberofchildren,
            senstudprice: orderDetails.senstudprice,
            numberofsenstud: orderDetails.numberofsenstud,
            tier: orderDetails.tier,
            totalamount: orderDetails.totalamount,
            paymentoption: orderDetails.paymentoption,
            time: orderDetails.time

        }

        console.log("inputData");
        console.log(inputData);

        const url = `${APP_API_ENDPOINT}orders`
        console.log("url")
        console.log(url)
        
        const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // Add other headers as needed
        },
        body: JSON.stringify(
            // Your JSON data goes here
            inputData       
        ),
        });
        
        if (response.ok) {
            const data = await response.json();
            return data
        }
        // Handle response if necessary
        

    
        // ...

    } catch (error) {
        console.error('Error submitting form:', error);
    }
}
export async function getOrderAPI(orderid: string): Promise<OrderDetails> {
    try {
      const url = `${APP_API_ENDPOINT}orders/${orderid}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add other headers as needed
        },
      });
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error retrieving data:', error);
      // You might want to handle the error differently based on your use case
      throw error;
    }
  }
export async function retrievePrice(day: string, start_time: string, end_time: string, paxtype: string, tier: string): Promise<number | null>  {
    try {
        const inputData = {
            day: day,
            start_time: start_time,
            end_time: end_time,
            paxtype: paxtype,
            tier: tier
        };

        console.log("inputData");
        console.log(inputData);

        const url = `${APP_API_ENDPOINT}orders/getprice`;
        console.log("url")
        console.log(url)
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Add other headers as needed
            },
            body: JSON.stringify(inputData),
        });

        if (response.ok) {
            const data = await response.json();
            if (data && data.price != undefined){
                const price = data.price;
                console.log('Price:', price);
                return price;
            }  else {
                console.error('Error: Price property not found in the response.');
                // Handle the absence of 'price' property, e.g., return an error message
                return null
            }
        } else {
            // Handle non-OK responses, if needed
            console.error('Error retrieving data. Status:', response.status);
            throw new Error('Failed to retrieve data');
        }

    } catch (error) {
        console.error('Error retrieving data:', error);
        // You might want to handle the error differently based on your use case
        throw error;
    }
}

export async function getAllMenu(): Promise<MenuPrice[]> {
  try {
    const url = `${APP_API_ENDPOINT}menus/`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add other headers as needed
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error retrieving data:', error);
    // You might want to handle the error differently based on your use case
    throw error;
  }
}

