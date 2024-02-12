import os
import boto3
from chalice import Chalice
import logging
from boto3.dynamodb.conditions import Key
from datetime import datetime
from botocore.exceptions import ClientError
from chalice import CORSConfig
from decimal import Decimal
cors_config = CORSConfig(
    allow_origin='http://localhost:3000/',
    allow_headers=['X-Special-Header'],
    max_age=600,
    expose_headers=['X-Special-Header'],
    allow_credentials=True
)

app = Chalice(app_name='cdkdemo1')
app.log.setLevel(logging.DEBUG)

dynamodb = boto3.resource('dynamodb')
dynamodb_table = dynamodb.Table(os.environ.get('APP_TABLE_NAME', ''))
dynamodb_table_order = dynamodb.Table(os.environ.get('ORDER_TABLE_NAME', ''))
dynamodb_table_menu = dynamodb.Table(os.environ.get('MENU_TABLE_NAME', ''))





# #################### Add api for Orders #################### 
@app.route('/orders', methods=['POST'],  cors=True)
def create_order():
    request = app.current_request.json_body
    app.log.debug("request at create_order")
    app.log.debug(request)
    item = {
        'PK': 'Order#%s' % request['orderid'],
        'SK': 'OrderID#%s' % request['orderid'],
        'orderid': request['orderid'],
        'ordercode': request['ordercode'],
        
        'childprice': Decimal(str(request['childprice'])),
        'numberofchildren': request['numberofchildren'],

        'adultprice': Decimal(str(request['adultprice'])),
        'numberofadults': request['numberofadults'],

        'senstudprice': Decimal(str(request['senstudprice'])),
        'numberofsenstud': request['numberofsenstud'],
    

        'tier' : request['tier'],
        'totalamount': Decimal(str(request['totalamount'])),
        'paymentoption': request['paymentoption'],
        'time': request['time'],
        'name': request['name'],
        'phonenumber': request['phonenumber'],

    }
    app.log.debug("item")
    app.log.debug(item)
    # item.update(request)
    app.log.debug("request")
    app.log.debug(request)
    # app.log.debug("item after updated")
    # app.log.debug(item)
    try:
        dynamodb_table_order.put_item(Item=item)
        app.log.debug("item is inserted")
        # return inserted item
        orderid = request.get('orderid')

        item = get_order(orderid)
        # item = get_order_details(orderid)
        return item
    except Exception as e:
        app.log.error(f"Error inserting item into DynamoDB: {e}")
        return {"error": "Failed to insert item into DynamoDB"}

@app.route('/orders/{orderid}', methods=['GET'],  cors=True)
def get_order(order_id):
    if "REF" in order_id:
        item = get_order_details_by_code(order_id)
    else:
        item = get_order_details(order_id)
    return item


def get_order_details(orderid):
    key = {
        'PK': 'Order#%s' % orderid,
        'SK': 'OrderID#%s' % orderid,
    }
    item = dynamodb_table_order.get_item(Key=key)['Item']
    del item['PK']
    del item['SK']
    return item


def get_order_details_by_code(ordercode):
    key = {
        'PK': 'Order#%s' % ordercode,
        'SK': 'OrderID#%s' % ordercode,
    }
    try:
        item = dynamodb_table_order.get_item(Key=key)['Item']
        del item['PK']
        del item['SK']
        return item
    except KeyError:
        return None
    
    
# #################### Add api for MenuPrice #################### 


import boto3
from boto3.dynamodb.conditions import Key
from datetime import datetime


def retrieve_price(days, start_time, end_time, paxtype, tier):

    # Convert the day, start_time, and end_time to the expected format
    # Adjust the format based on the actual structure of your data
    days = days[:3]  # Extract the first three characters to match 'Mon', 'Tue', etc.
    start_time = f"{start_time[:8]}Z"  # Add 'Z' to indicate UTC time
    end_time = f"{end_time[:8]}Z"

    try:
        response = dynamodb_table_order.scan(
            FilterExpression="#day IN (:day) AND #start_time BETWEEN :start_time AND :end_time AND #paxtype = :paxtype AND #tier = :tier",
            ExpressionAttributeValues={
                ":days": days,
                ":start_time": start_time,
                ":end_time": end_time,
                ":paxtype": paxtype,
                ":tier": tier
            },
            ExpressionAttributeNames={
                "#day": "days",
                "#start_time": "start_time",
                # "#end_time" : "end_time",
                "#paxtype": "paxtype",
                "#tier": "tier"
            }
        )
        logging.debug("response at retrieve_price")
        logging.debug(response)
        items = response.get('Items', [])
        return items

    except ClientError as e:
        print(f"Error retrieving data: {e}")
        logging.debug(f"Error retrieving data: {e}")
        # Handle the error accordingly, e.g., return an error message or re-raise the exception
        return []
@app.route('/orders/getprice', methods=['POST'],  cors=True)
def get_price():
    request = app.current_request.json_body
    app.log.debug("request at getprice")
    app.log.debug(request)
    
    # Example usage
    # day = "Tue"
    # start_time = datetime.strptime("11:30:00", "%H:%M:%S")  # Replace with your actual start time
    # end_time = datetime.strptime("15:59:59", "%H:%M:%S")  # Replace with your actual end time
    # paxtype = "Adult"
    # tier = "Regular"
    days = request.get('days')
    start_time = request.get('start_time')
    end_time = request.get('end_time')
    paxtype = request.get('paxtype')
    tier = request.get('tier')
    days = days[:3]  # Extract the first three characters to match 'Mon', 'Tue', etc.
    start_time = f"{start_time[:8]}Z"  # Add 'Z' to indicate UTC time
    end_time = f"{end_time[:8]}Z"
   
    items = retrieve_price(days, start_time, end_time, paxtype, tier, menu="1")
    logging.debug("items")
    logging.debug(items)

    if items != []:
        price = items[0].price
        print(f"The price for day '{days}', time range '{start_time} - {end_time}', paxtype '{paxtype}', and tier '{tier}' is: {price}")
        logging.debug(f"The price for day '{days}', time range '{start_time} - {end_time}', paxtype '{paxtype}', and tier '{tier}' is: {price}")
    else:
        print("Price not found.")
        # return inserted item
        logging.debug("Price not found.")
        price = None
    return price



@app.route('/menus', methods=['GET'], cors=True)
def get_all_menus():
    try:
        # Use the scan operation to retrieve all items from the table
        app.log.debug("here at get_all_menus")
        response = dynamodb_table_menu.scan()

        # Extract the 'Items' from the response
        items = response.get('Items', [])

        # Remove PK and SK from each item if needed
        for item in items:
            del item['PK']
            del item['SK']
        app.log.debug("items")
        app.log.debug(items)
        #return {'items': items}
        return items
    except Exception as e:
        return {'error': str(e)}, 500

if __name__ == '__main__':
    app.run(debug=True)
