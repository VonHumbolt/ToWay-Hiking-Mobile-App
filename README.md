# ToWay Hiking Mobile App

ToWay is a mobile application where users can draw a route or they can track other routes. This project backend is written with JavaScript, Node.js and Express.js. Also, Mobile application is created using React Native and JavaScript.

## Brief Description Of Project

ToWay is a mobile project where users can walk, draw a route or view the route of other users and follow other routes.
Users must be enroll to use this app. There are 4 main screen on this app. User can easily navigate through these pages using BottomTabNavigation Bar.

#### Home Screen

First screen is the home screeen. In this screen, user can viewed popular routes and personized routes. Popular routes are the most completed routes by users in this application. In addition, Personilized routes are those located in the city where the user is located. If user wants, user can go to route detail screen by clicking on the route card and then view the details of the route. On the detail screen, the user can get information about the route, view images of the route, and view reviews of the route. Also, user can save the route and start tracking the route. At the top of home screen, user can search for routes or users using search bar.

#### Map Screen

Second screen is the map screen, user can draw a new route on this screen. While drawing, user can display the route distance, undo the drawing. Also, user can start the tracking without any route. After drawing the route, user can create new route clicking the save button. If user clicks this button, user goes directly to the create route screen.
In this screen, user can add image, add name and description for route, select categories such as hiking, biking, running. In addition, the user can select the difficulty level of the route and change the visibility settings to select who can view the route.

#### Saved Route Screen

In this screen, user can display all saved routes. 

#### Profile Screen

On this screen, the user can change the profile picture, view the entire number of completed routes, the total distance and the total time. Also, routes completed or created by the user are listed on this screen.

#### Tracking Screen

The most important page of the app is on this screen. This screen opens when the user starts tracking. If the user follows a route, the route coordinates are plotted on the map. Also, the app takes the user's current location and plots these coordinates on the map. Thus, user can track the route. During tracking, the user can see the distance he has traveled, how much time has passed, and his current speed. User can start, stop and complete the tracking at any time. When the route is completed, the user can add comments and images for other users to view. If user tracking own route, user can add points such as caves, campgrounds to certain coordinates for other people.

## Technologies

#### Backend

<ul>
    <li>JavaScript</li>
    <li>Node.js</li>
    <li>Express.js</li>
    <li>MongoDB</li>
    <li>Mongoose</li>
    <li>Cloudinary</li>
    <li>Multer</li>
    <li>Jwt</li>
    <li>Docker</li>
</ul>

#### Mobile
<ul>
    <li>JavaScript</li>
    <li>React Native</li>
    <li>React Native Maps and Geolib</li>
    <li>Zustand</li>
    <li>Tailwind CSS</li>
    <li>Axios</li>
    <li>React Hook Form</li>
    <li>Expo Image Picker</li>
</ul>

## Usage of Technologies

#### Backend

Rest api was generated using Express.js. MongoDB and Mongoose were used for database and crud operations. For authorization and authentication processes, Jwt was used. Multer was used upload image and Cloudinary was used for image storage. Docker was used for running MongoDB and Mongo Express container. All backend codes are written with JavaScript. 

#### Mobile

Mobile app was generated React Native with Expo. Written by JavaScript. Axios was used to get and post data from Rest Api. React hook form was used for create account and create new route screen. Jwt token was stored using Expo Secure Store. React Native Maps was used for drawing user location and route coordinates. Also, it is used for tracking the user location. For getting user location from device, Expo location was used. When you start tracking, every 3 seconds, the app takes the user's location and plots it on the map. Every 1 minute, the coordinates of the user's location are sent to the backend for storage. The purpose of storing coordinates in the database is to return the coordinates that the user travels when the application is closed and opened back.

In addition, when the user starts to tracking, tracking time, distance and user coordinates are stored in the global state using Zustand. Thus, we can show them in the mini tracking menu on the other screens. In the Create New Route Screen, I used GeoNames Service to get the country where the user is located from user's coordinates. Expo Image Picker was used for selecting image from image library for adding image to route or comment and the user's profile picture. Nativewind was used to use TailwindCss for app UI design.

## How can I use this project?

