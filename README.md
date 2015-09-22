# Angular 2 Starter

The goal of this starter app is to provide
a simple way to get started with Angular 2 while also showing key Angular 2 features. The sample
relies on JSPM/System.js to load ES6 modules and the required scripts used in the application.

The sample is based on Angular Alpha 37.

Simply clone the project or download and extract the .zip to get started.

## Angular 2 Concepts Covered

* ES6 version that relies on classes and modules
* Required scripts are downloaded locally using JSPM
* ES6 modules are loaded with System.js
* Defining routes and using router-outlet
* Using Custom Components
* Using Custom Directives
* Defining Properties and Using Events in Components/Directives
* Using the Http object for Ajax calls
* Working with Utility and Service classes (such as for sorting and Ajax calls)
* Using the New Databinding Syntax [], () and [()]

## Usage

1. Install global dependencies **if necessary**

        npm install -g jspm superstatic live-server

2. Install node packages:

        jspm install

3. Start the server

        ss
        
   **Optional**: If you want a "live reload" server then `cd` into the `src` directory and run `live-server` from the command-line.

4. Open a browser and navigate to the site/port shown by Superstatic. 
If you use the live reload option then a browser will automatically be displayed and any changes to files will cause it to reload.


**Note:** 

Bundling isn't used in this project since the overall goal is to provide a starter project for people interested in
playing around with an early version of Angular 2.
