
# Yatu List

## Variables

* Membership
* Expiry Date
* Deivce Quantity

## Business Rules

* Set 20 Device for Default User
  * Show Device Count at Device Listing
  * If Max Device, Unable to Sync
* Token Redemption, Determine Member Type
  * Types:
    * Normal Device: 20 User
    * 50 Device User
  * Once redeemed, unable to refund
  * If token expired, need to redeem again
  * Token Package:
    * 1 Month
    * 3 Month
    * 6 Month
    * 1 Year

## Flowchart

```mermaid
flowchart TD
    
    2[Login]
    3[Check Device Listing]
    4[Dashboard]
    5[Activate Token]

    6[Check is Authenticated]
    7[Please top-up / Activate Tokesn]
    8[Token Listing]

    9["Device Listing (Standalone)"]
    10[Auth Module]

    11[Yatu Normal Flow]

    2 --> 3
    3 -->|Empty| 5
    3 -->|Not Empty| 4

    5 --> 8

    8 -->|Has Token| 6
    8 -->|Empty Token Listing| 7

    7 --> 6

    6 -->|Authenticated| 9
    6 -->|Not Authenticated| 10

    10 -->|Complete Auth| 9

    9 --> 11

```
