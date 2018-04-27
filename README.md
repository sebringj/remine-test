# Remine Interview Project Description (not to be shared)

### Background

This app is built using React Native. Use the Expo toolkit (https://expo.io/learn) to build and run this project on your phone.

The app displays a list of properties, powered by an API we've hosted. Complete this screen by adding some filtering functionality as described below.

You may choose either iOS or Android as your target environment.

### Tasks

Inside screens/HomeScreen.js, do the following tasks:

- Update the UI to add form controls to filter # of beds and # of baths
- Implement the fast filtering of beds, baths, and building types
- If there are no results, display a message within the list indicating the empty result
- Allow users to toggle building types, with a visual indication that it is toggled

Extra credit (not required):
- Add icons inside each row alongside bed/bath/type information.
- Implement text search for addresses
- Support device rotation

We will evaluate app functionality, speed, and your coding decisions

### Front End Interview Test API (for reference)

#### Data Model

The API route that serves the location data is `https://remine-interview-api.herokuapp.com/locations`, and the data it serves up is of shape:
```
{
    "id": 0,
    "address": "293 Ova Extensions Koelpinstad New Hampshire, 86680-5255",
    "beds": 2,
    "baths": 0,
    "buildingType": "singleFamily"
}
```

The API route that serves the building types is `https://remine-interview-api.herokuapp.com/buildingTypes`.  The response is:
```
[
  "multiFamily",
  "condo",
  "business",
  "office",
  "singleFamily"
]
```

The API route for all subscriptionPlans is `https://remine-interview-api.herokuapp.com/subscriptionPlans`.  The response is:
```
[
  {
    "id": 1,
    "maxTrackedItems": 100,
    "creditsPerHousehold": 3,
    "price": {
      "currency": "",
      "value": "Free",
      "paymentInterval": ""
    },
    "additionalFeatures": [
      "Sell Scores"
    ]
  },
  {
    "id": 2,
    "maxTrackedItems": 250,
    "creditsPerHousehold": 2.5,
    "price": {
      "currency": "USD",
      "value": "29",
      "paymentInterval": "month"
    },
    "additionalFeatures": [
      "Sell Scores",
      "Value & Equity Maps"
    ]
  },
  {
    "id": 3,
    "maxTrackedItems": 500,
    "creditsPerHousehold": 1.5,
    "price": {
      "currency": "USD",
      "value": "99",
      "paymentInterval": "month"
    },
    "additionalFeatures": [
      "Sell Scores",
      "Value & Equity Maps"+
    ]
  },
  {
    "id": 4,
    "maxTrackedItems": 10000,
    "creditsPerHousehold": 1,
    "price": {
      "currency": "USD",
      "value": "199",
      "paymentInterval": "month"
    },
    "additionalFeatures": [
      "Sell Scores",
      "Value & Equity Maps"
    ]
  }
]
```

The API route for all users is `https://remine-interview-api.herokuapp.com/user`.  You can request a single user object by appending the id to the previous URL like so: `https://remine-interview-api.herokuapp.com/user/1`.  The data model for a user is:
```
{
  "id": 1,
  "userPlan": {
    "planId": 1
  }
}
```