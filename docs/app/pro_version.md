
# Version

## 1.2.1

- Features Update:

1. Improved Syncing Data with Tuya Server. Added Fault Handling when Registering to Tuya Cloud Project.
2. Added Tutorial Guide. Tutorial Guide for Scanning Tuya QR Code & Linking Devices.
3. Added Device Rules. Able to Add and Remove Existing Device Rules.
4. Improve Email Engine. OTP and Tuya QR Code for Authorization are now send via Email.
5. Report Template Shall be automatically generated for every new user.
6. Added App Version Checking from Server

## 1.2.2

- Features Update:

1. Fixed Login Keyboard Issue. Keyboard Automatically Close when OTP button is pressed.
2. Fixed QR Issue. QR is now generated with white border to facilitate easy QR Scan.
3. Charting Issue. Fixed X Axis Data Issue.
4. Added OTP Notification to indicate Email is send on the way.

### Version 1.2.3

- Features Update:

1. Added New Chart Controls. Able to Zoom In On Chart, And Select Chart Attribute

## 1.2.4

- Features Update:

1. Chart Update. Added Scroll To Legend
2. Added Smart Plug Data Type for Devices
3. Device Info Update. Added Online Status. Added Icons for Data Attributes.
4. Fixed Null Data Issue For Device Info Page.

## 1.2.5

- Features Update:

1. Chart Update: Update All Charts to Advance Charting
2. Link Device Flow. Added Rollback Error to prevent Server from crashing
3. Sync Update. Device Status, Home Info, List of Devices will be updated per hour.
4. Device Support Update. Unsupported Device will be unable to be added into the server.

## 1.2.6

- Features Update:

1. Orientation Update: Now able to support Landscape View and Portrait View for Graphs
2. Link Device Flow. Enhance Functionality, added overall progress
3. Chart Update: Enhance Chart for timestamp view, instead of date time. Moved Zoom Bar on Top, Legend Bottom.

## 1.2.7

- Features Update:

1. Chart Controls: Improve Data Navigation, Added Zoom Support. Added 3 Different Data Interval Points. Added Dropdown to select based on Existing Attribute.
2. Widget Update: Added Smart Plug Widget & Air Quality Widget. KWh represents total electrical usage for the past day.
3. Fixed Missing Gap Data for interval points.
4. Fixed Chart Scale. Chart now automatically scales based on min and max points.

## 1.2.7

- Features Update:

1. Chart Controls: Improve Data Navigation, Added Zoom Support. Added 3 Different Data Interval Points. Added Dropdown to select based on Existing Attribute.
2. Widget Update: Added Smart Plug Widget & Air Quality Widget. KWh represents total electrical usage for the past day.
3. Fixed Missing Gap Data for interval points.
4. Fixed Chart Scale. Chart now automatically scales based on min and max points.

## 1.2.8

- Features Update:

1. Bug Fixes: 
    i. Fixed Chart Timestamp refresh error when changing attributes.
    ii. Change "Request OTP" to "Resend OTP" after user has requested OTP
    iii. Fixed Chart Data Refreshing Twice on load.
    iv. Update Chart Attribute Dropdown
2. Widget Update: Added Smart Plug & Air Con Device Landing Page. Total Electrical Usage of Smart Plug are grouped by date and shown within Smart Plug Device Chart.
3. Used Data Compression Technique to Store Data Point
4. Chart Update: Added Attribute Unit to all Chart Data Type.

## 1.2.9

- Features Update:

1. UI Fixes: 
    i. Remove "Absolute Humidity", "Relative Humidity" Icon, Use "AH", "RH" to represent icon instead
    ii. Fixed Synchronize Issue. Download now continues even after app is shut down.
    iii. Fixed Empty Device List Issue. Improve Device List Loading Speed.
    iv. Change Log Count to Device Uptime status.
2. Smart Plug Report Update: Use Average Current, Power & Voltage based on device count. (Device Updats every 30 minutes.)
3. Chart Update: Show total KWh (Electrical usage) for smart plug devices in same home.

## 1.2.10

- Features Update:

1. UI Fixes:
    i. Fixed Chart Toggle Issue. Added New "SE" toggle button, to switch between first-half and last-half of graph.
    ii. Fixed Synchronize II Issue. App no longer sleeps when synchronizing data between devices.
    iii. Profile Update. Added Date Joined, Earliest Data Available and Account Type.
2. New Chart Widget. Added Total Device Distribution to show all available device types under current account.
3. Sub-Member User Update. Managers are now able to add new or existing sub-users to current home to help manage account. Managers can control the access of sub-users account.
4. Account Type Update. Account Types now have "Free" and "Premium". Both account types have varying access to available data (7-day and 90-day period).

## 1.2.11

- Features Update:

1. Chart Widget Update: User are now able to selectively toggle tooltip 
2. Change Weekday Terms to Short Form. I.e. "Wednesday" => "Wed"
3. Hide Label from tooltip, Place Color Dot Instead.

## 1.2.12

- Features Update:

1. Login Update: Modified Onboarding Page.
2. Payment Subscription Support. Added Web Payment to facilitate Payment Services
3. Yatu Add-Ons. Added Yatu Module Add-Ons to Enhance User Experience

## 1.2.13

- Features Update:

1. New User Fixes:
    1. Improve Tuya User Authentication Flow. Ensures User whom joined Yatu App Are registered SmartLife Users
    2. Implemented Tuya Queue System. Show "High Traffic Alert" when multiple user authenticate Server.
    3. Profile Update. Added Subscription Expiry Date and Account Type.
2. Payment Subscription Support:
    1. Modifed Subscription to "Basic", "Professional" Packages
    2. Show 4 Time Based "Professional" Packages for User.
3. Yatu Add-Ons Support:
    1. Added Yatu Module Add-Ons to Enhance User Experience.

## 1.2.14

- Features Update:

1. Ui Fixes:
    1. Modified Payment Subscription Page. Added Tooltip for Viewing more Information.
    2. Added Payment Subscription Pop-up Modal.
2. Demo Login:
    1. Added Demo Test Account for First Time User. User is able to test out all of YatuDashboard functionalities
3. Yatu Company Info:
    1. Added 4 Sections: "About Us", "Terms & Conditions", "Privacy Policy", "Frequently Asked Questions"

## 1.2.20

- Features Update:

1. In-App Purchasing:
    1. Huge Update to our payment service. Moved Payment gateway service to another container.
    2. Added In-App Purchase with Google Play & App Store

## 1.2.31

- Removed "Try As Guest"
- If Havent upgrade to pro, continue to Paywall
- Change “Add-On” to “View Pay Subscription”
- View “Token Wallet” to View “Yatu Tokens”
- “Profile Workspace” Change To “Profile Selection”
- “User Tokens” Change To “Yatu Tokens”
- “Share Session” To “Share Viewer Session”
- Put Meaningful Terms on Top of Email

## 1.2.32

- Update "Profile Email" to Use Viewer Email
- Change "Status" to "Viewer"
- Remove "Sync Now" from "Devices"
- Remove "Download" from View Shot Modal
- Remove "Add To Favorite" from "Devices"
- Re-design "Device Item"
- Removed Functions that are "unnecessary"
- Added Error to "Scan Qr"
- Remove Tutorial "Toast Message"

## 1.2.33

- Fix: Camera QR Crashing after Scan QR Code

## 1.2.34

- Feature: Energy Cost Usage are now calculated based on User Tariff Rates
- Feature: Added Tutorial for First Time Setup for Yatu Viewer
- Fix: Color Opacity for App Variants
- Fix: Update Landing Page on App Store for Yatu Pro
- Fix: Enhanced Animation for Pop-Up Modal. Added User-Controls to switch between photo Gallery
