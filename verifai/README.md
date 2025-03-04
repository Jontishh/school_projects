# Verifai

Verifai is a Progressive Web Application (PWA) designed to work with Enaibler's sample scanning devices. It enables experts around the world to verify the decisions of the device's AI.

## Prerequisites

Before running the application, make sure you have the following installed:

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository:

   `git clone https://github.com/yrefors/verifai.git`

2. Navigate to the project directory

   `cd verifai`

3. Install dependencies

   `npm install`

## Usage

To run the application in development mode, run:

   `npm run dev`

This command will start the development server

To build the application for production, run:

   `npm run build`

Then serve the application with:

   `serve -s dist`

   *Using the -s flag, the index.html page will be served for every request, since Verifai is an SPA*

## Installing the app on a phone

- Build and serve the app (for example at 'localhost:3000')
- Enable port forwarding and define ports in Chrome (chrome://inspect/#devices)
  Ex: 3000 / localhost:3000
- Connect phone via USB
- Enable developer mode and USB debugging on phone
- Access app via browser on phone at (Ex:) localhost:3000
- Look for install option in browser