# Task List

## 2024-01-28

- [x] Insert Into TDevice_Yatu
  - [x] Title, Description, Online_Status, Status
- [x] Complete "Have you Authenticated" Top Down Modal
- [x] Complete "Empty Device"
  - [x] Insert Token Category for 1 Device
- [x] Change Icon to "Yatu White / Blue"
- [x] Change Header to "Yatu Lite / Blue"

- [x] Completed "Token Wallet" System
- [x] Yatu Viewer
  - [x] Just Put Empty Input
  - [x] Same Response Code as Token
- [x] Design Yatu QR Code & Token

- [x] Move Sync Button down
- [x] Make Sync Device Into Backend
- [x] Token Info Button
- [x] Shopee & Lazada Button
- [ ] Fix Toggle Device Count

## 2024-01-30

- [ ] OneSignal v5
- [x] Qr Code Scanner
  - [x] react-native-vision-camera
  - [x] yarn remove react-native-permissions
  - [x] yarn remove react-native-camera
  - [x] yarn remove react-native-qrcode-scanner
  - [x] Make Into Button to Open QrCode Scanner
  - [x] When Scanned, Code Switch to non Active
  - [x] Draw Marker

## 2024-01-31

### Video

- [x] Smart Life Authenticate App Flow
  - [x] Share to Google Drive
- [x] Smart Life Sync Devices
  - [x] Share to Google Drive
- [x] Yatu Authentication Flow
  - [x] Share To Google Drive
- [x] Yatu Sync Data
  - [x] Share To Google Drive

### Storyboard

- [x] Generate APK For Android
- [x] Generate TestFlight for iOS
- [x] Prepare Storyboard for Each Scene (9 Scenes)

### Shopee / Lazada Link

- [x] Automatically Call CheckTuyaEmail When Login to Page
- [x] When Complete Auth, Redirect to ScanQR
- [x] Modify Token Page to Include QR Code
- [x] Do Function to CheckIfTuyaEmail is Empty
- [x] "Please wait, your data are downloading"
  - [x] Send Notification, to say Data is Downloading?

- [x] Disable Back Button
- [x] Modify GetDeviceByUserII

## 2024-02-03

- [x] Make Gif To Replace QR Code [Yatu-Dashboard]
  - [x] Show Gif React-Native
- [ ] Replace Components with Demo Components [Yatu-Dashboard]
  - [x] Global Tutorial Redux-Replace
    - [ ] When I Set `Global Tutorial` True, It Will Auto-Start the Tutorial Process
  - [x] Auto Insert New Devices to Its Associated Profile Workspace [Yatu-Selenium]
  - [x] Auto Insert New Devices to Its Associated Profile Workspace [Data-Alert] (When Add-New Device)
- [x] Only Show Yatu Devices [Yatu-WS] (Longer)
  - [x] Trace Date of Package Active
  - [x] Assume that Device is Added 6 Hours Prior
  - [x] Only Add Device That Has Been Added 6 Hours Prior
- [x] Scenario
  - [x] SmartLife Account with 2 Device
    - [x] Email: `neixchobby@gmail.com`
    - [x] Smart IR
    - [x] Temperature & Humidity Alarm
    - [x] Get Device Information
  - [ ] Differentiate Between Yatu
    - [x] Add `IsYatu` to Device QR
    - [ ] C#, Add `IsYatu` Column

- [x]  Insert Yatu Instruction Tutorial to Devices
- [x]  Alter Scan Yatu Pages
- [x]  Modify `YatuSelenium`

## Business Requirements (Do Before Sleep)

- [x] As a new Yatu User, After i Synced the Device, The Device List Should be Empty
  - [x] It Should be automatically Inserted into my Profile Workspace
- [ ] As a new Yatu User, After I Scan my Yatu Device
  - [ ] The Device Name in SmartLife Should Change to Yatu device (Advanced)
  - [ ] The Device Should then only be added to my Yatu Devices

## Bugs

- [x] If I Press Refresh, I Get Sent Out (High Traffic) (TUserToken)
- [ ] Token Activation, Show that `YatuToken` is already activated

## 2024-02-22

- [x] Modify Faq
- [x] Modify Yatu
- [x] Modify Faq
- [x] Modifgy Tnc
- [x] Modify Policy

## 2024-02-22 FlowChart

Two Actors: Alice, Bob

- [ ] How? Alice Generates Random 6 Digit Code For Share Session When they start Share
- [ ] How? Bob Joins Alice Session from the Share Code Provided.
  - [ ] What? The Share Code Allows Bob to View Alice Data
- [ ] Hint? Session has Expiry, Once Time Limit is Up, auto kick (Zoom Meeting)
  - [ ] Push Notification
- [ ] Hint? Limit Number of Active User. Only 5 Max
- [x] Deleted Login Modal, Popout Deleted
- [x] Record Video of Adding New Devices
  - [ ] Try Again
- [x] Test `txen2000@gmail.com`
  - [x] Test `neixchobby@gmail.com`
- [x] Modify `GetParamApi` for Yatu

## Tutorial

~~- Sync Data Complete, Data is Downloaded & Devices Added to Home Screen~~
~~  - Pop Message Saying Sync Your Data by selecting our Device~~
~~- Select "Sync Now" After Selecting Device~~
~~  - Select "Link"~~
~~- Redirect User to "Profile Workspace", to add / remove device ?~~
~~- When Data has Downloaded, Redirect User To Dashboard~~
~~Test Notification~~
