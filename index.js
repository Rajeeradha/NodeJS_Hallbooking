//require("dotenv").config();
const express = require("express");
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const rooms = [
  {
    room_no: "100",
    room_type: "Executive Suites",
    seats: 50,
    amenities: ["Free Wi-Fi", "gym", "restaurants", "Swimming pool"],
    price_per_hour: 4999,
  },
  {
    room_no: "101",
    room_type: "Standard Room",
    seats: 50,
    amenities: ["Free Wi-Fi", "restaurants"],
    price_per_hour: 1999,
  },
];

const bookingDetails = [
  {
    customer_name: "Mr. Smith",
    room_no: "100",
    room_type: "Executive Suites",
    date: new Date("2022-01-01"),
    start_time: "08:00 AM",
    end_time: "09:00 PM",
    status: "Confirmed",
  },
  {
    customer_name: "Anderson",
    room_no: "101",
    room_type: "Standard Room",
    date: new Date("2022-01-01"),
    start_time: "10:00 AM",
    end_time: "06:00 PM",
    status: "Confirmed",
  },
];

app.get("/", (req, res) => {
  res.send("Welcome to our Hall Booking Application");
});

// CREATE ROOMS
app.post("/create", (req, res) => {
  let number = rooms.length + 100;
  req.body.room_no = number;
  rooms.push({
    room_no: req.body.room_no,
    room_type: req.body.room_type,
    seats: req.body.seats,
    amenities: req.body.amenities,
    price_per_hour: req.body.price_per_hour,
  });
  res.status(201).send(`The room number ${number} is created successfully`);
});

// ROOM BOOKING
app.post("/booking", (req, res) => {
  let number = bookingDetails.length + 1;
  req.body.booked_room_no = number;
  try {
    req.body.date = new Date(req.body.date);
    let booking_detail = {
      customerName: req.body.customerName,
      booked_room_no: req.body.booked_room_no,
      room_type: req.body.room_type,
      date: req.body.date,
      start_time: req.body.start_time,
      end_time: req.body.end_time,
      status: "Confirmed",
    };

    let result = undefined;
    for (const book of bookingDetails) {
      if (book.date.getTime() == req.body.date.getTime() && book.start_time === req.body.start_time) {
        console.log(book.date.getTime(), req.body.date.getTime());
        result = 0;
        return res.status(400).send({ message: "The room is not available in this time slot" });
      } else {
        result = 1;
        bookingDetails.push(booking_detail);
        return res.status(201).send({message: `Room number ${req.body.booked_room_no} is successfully`});
      }
    }
  } catch (error) {
    res.status(500).send({message: "Internal server error"});
  }
});

// BOOKED ROOM DETAILS

app.get('/bookedRoom', (req, res) => {
  let roomList = [];

  bookingDetails.forEach((customer) => {
    let roomDetails = {};

    roomDetails.room_no = customer.room_no;
    roomDetails.room_type = customer.room_type;
    roomDetails.status = customer.status;
    roomDetails.customer_name = customer.customer_name;
    roomDetails.date = customer.date;
    roomDetails.start_time = customer.start_time;
    roomDetails.end_time = customer.end_time;
    roomList.push(roomDetails);
  });

  res.status(200).send(roomList);
});

// CUSTOMER DETAILS

app.get('/customer-details', (req, res) => {
  let customerList = [];

  bookingDetails.forEach((customer) => {
    let customerDetails = {};
    customerDetails.customer_name = customer.customer_name;
    customerDetails.room_no = customer.room_no;
    customerDetails.room_type = customer.room_type;
    customerDetails.date = customer.date;
    customerDetails.start_time = customer.start_time;
    customerDetails.end_time = customer.end_time;
    customerList.push(customerDetails);
  });

  res.status(200).send(customerList);
});


//const PORT = process.env.PORT || 4001;

app.listen(4001, () => {
  console.log(`Application is running on PORT 4001`);
});
