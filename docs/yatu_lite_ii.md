
# Flow Chart

Embed JSON Data Into QRCode:

1. Individual QR
2. Group QR

```mermaid
flowchart TD
    1[Login]
    2[Device]
    3[Auth Tuya Module]
    4[Scan QR]
    7[Yatu Package]
    5[Profile]
    6[Token Wallet]
    8[Dashboard]

    1 -->|Activation Filter: If Not Auth| 8
    
    1 --> 2
    2 -->|If New User| 3
    3 -->|When Complete| 2

    2 -->|Use QR Code| 4
    
    4 --> 7
    7 -->|Populate User Device| 2

    4 -->|Add To Credit| 6

    1 --> 5 --> 6
```

# Thoughts

When I Scan Json, it should populate

* Device List
  * Smart Plug
  * Temp & Humd
  * Air Quality

## Yatu Lite

1. When User Login to Yatu Lite App, it will ask for User Email & OTP code
2. When User input correct email & OTP Code, User will create a Yatu Account and Go To Empty Device Listing Page
3. If User first time login, a tutorial will show user how to use Yatu App
   1. The Tutorial will show User to scan their newly bought Yatu Package from Shopee / Lazada, using Yatu QR Scanner
4. When User Scan the Yatu Package, it will add the devices BUT will blocked the device with a blur filter
   1. The filter will be removed when the system has sync with SmartLife app.
   2. The filter will ask user to check SmartLife app for sync status
5. If User has not authenticate with Yatu Package, a blur filter will ask User to complete Authentication process.
   1. Unauthenticated User can only view Yatu Viewer, Yatu Profile & Yatu device. They cannot view Yatu Dashboard

```mermaid
flowchart TD
  1[Login]
  2[Device]
  3[Dashboard]
  4[Profile]

  21[Scan QR]
  22[Scan QR Pop-up]
  211[Scan Yatu Package]
  212[Scan Yatu Device]

  41[Token Wallet]
  411[Activate Token]
  4111[Token Error]
  412[Check Token Info]


  1 -->|1. Sign Up\n2.Not Tuya-Synced Users| 2
  1 -->|1. Normal Login & Synced| 3
  1 --> 4

  2 --> 21
  2 -->|If User is Unsynced| 22
  22 --> 21

  21 --> 211
  21 --> 212

  211 -->|Populate User Device| 2
  212 -->|Add Unsynced Device| 2

  4 --> 41

  41 -->|Show Token Credit| 41
  41 --> 411
  41 --> 412

  411 -->|Success| 41
  411 -->|Fail| 4111
```

## Packages

- [x] Check Installed Apps
  - [x] Directly Open SmartLife / Tuya App in Google Play Store
  - [ ] Directly Open SmartLife / Tuya App in App Store
- [ ] React Native QR Scanner
s
- [x] react-native-app-link
- [x] react-native-qrcode-scanner

## Tasks

- [x] Summarize Meeting 2024-01-26
- [ ] Scan QR Code to Auto Insert Device
  - [ ] Delete All When Syncing Devices
  - [ ] Filter to show Account is not authenticated, so ask them to authenticate
