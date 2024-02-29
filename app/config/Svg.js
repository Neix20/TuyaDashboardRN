let Data = {};

import AppLogo from "@assets/svg/AppLogo.svg";
import AppLogoLite from "@assets/svg/AppLogoLite.svg";
// import Yatu from "@assets/svg/Yatu.svg";
import Yatu from "@assets/svg/yatulite_header_logo.svg";

import CardGradientBlue from "@assets/svg/card_gradient_blue.svg";
import CardGradientGreen from "@assets/svg/card_gradient_green.svg";
import CardGradientGrey from "@assets/svg/card_gradient_grey.svg";
import CardGradientOrange from "@assets/svg/card_gradient_orange.svg";
import CardGradientPurple from "@assets/svg/card_gradient_purple.svg";
import CardGradientRed from "@assets/svg/card_gradient_red.svg";

import WhatsApp from "@assets/svg/WhatsApp.svg";
import Envelope from "@assets/svg/Envelope.svg";
import PhoneBook from "@assets/svg/PhoneBook.svg";

import Power from "@assets/svg/Power.svg";
import Current from "@assets/svg/Current.svg";
import Voltage from "@assets/svg/Voltage.svg";

import KWh from "@assets/svg/KWh.svg";

import Temperature from "@assets/svg/Temperature";
import AbsoluteHumidity from "@assets/svg/Absolute_Humidity.svg";
import RelativeHumidity from "@assets/svg/Relative_Humidity.svg";

import Formaldehyde from "@assets/svg/Formaldehyde.svg";
import ParticleMatter from "@assets/svg/Particle_Matter.svg";
import CarbonDioxide from "@assets/svg/Carbon_Dioxide.svg";

import ECard from "@assets/svg/ECard.svg";
import Fpx from "@assets/svg/Fpx.svg";
import EWallet from "@assets/svg/EWallet.svg";

import DataBackup from "@assets/svg/data-backup.svg";
import DataAnalysis from "@assets/svg/data-analysis.svg";
import LinkDevice from "@assets/svg/link-device.svg";
import CustSupport from "@assets/svg/cust-support.svg";
import InfoIcon from "@assets/svg/info-icon.svg";
import DataStorage from "@assets/svg/data-storage.svg";
import EmailArchive from "@assets/svg/email-archive.svg";

import QrScan from "@assets/svg/Qr_Scan.svg";

Data = {
    AppLogo: AppLogo,
    AppLogoLite: AppLogoLite,
    Yatu: Yatu,
};

Data = {
    ...Data,
    CardGradientBlue: CardGradientBlue,
    CardGradientGreen: CardGradientGreen,
    CardGradientGrey: CardGradientGrey,
    CardGradientOrange: CardGradientOrange,
    CardGradientPurple: CardGradientPurple,
    CardGradientRed: CardGradientRed,
}

Data = {
    ...Data,
    WhatsApp: WhatsApp,
    Envelope: Envelope,
    PhoneBook: PhoneBook,
}

Data = {
    ...Data,
    ECard: ECard,
    Fpx: Fpx,
    EWallet: EWallet,
}

Data = {
    ...Data,
    InfoIcon: InfoIcon,
    DataAnalysis: DataAnalysis,
    DataStorage: DataStorage,
    DataBackup: DataBackup,
    CustSupport: CustSupport,
    LinkDevice: LinkDevice,
    EmailArchive: EmailArchive,
    QrScan: QrScan
};

// hack: Temporarily Store Everything in MetaData
Data = {
    ...Data,
    "Absolute Humidity": AbsoluteHumidity,
    "Temperature": Temperature,
    "Relative Humidity": RelativeHumidity,
    "Power": Power,
    "Current": Current,
    "Voltage": Voltage,
    "KWh": KWh,
    "Total KiloWatt": KWh,
    "Formaldehyde": Formaldehyde,
    "Particle Matter": ParticleMatter,
    "Carbon Dioxide": CarbonDioxide,
    "Temperature (℃)": Temperature,
    "Relative Humidity (%)": RelativeHumidity,
    "Voltage (V)": Voltage,
    "Power (W)": Power,
    "Current (mA)": Current,
    "Formaldehyde (mg/m3)": Formaldehyde,
    "Carbon Dioxide (ppm)": CarbonDioxide,
    "Particle Matter (ug/m3)": ParticleMatter,
    "Formaldehyde (CH2O)": Formaldehyde,
    "Carbon Dioxide (CO2)": ParticleMatter,
    "Particle Matter (PM2.5)": CarbonDioxide,
    "Total KiloWatt (KWh)": KWh,
    "Average Absolute Humidity": AbsoluteHumidity,
    "Average Temperature (℃)": Temperature,
    "Average Relative Humidity (%)": RelativeHumidity,
    "Average Voltage (V)": Voltage,
    "Average Power (W)": Power,
    "Average Current (mA)": Current,
    "Average Formaldehyde (mg/m3)": Formaldehyde,
    "Average Carbon Dioxide (ppm)": CarbonDioxide,
    "Average Particle Matter (ug/m3)": ParticleMatter,
    "Average Formaldehyde (CH2O)": Formaldehyde,
    "Average Carbon Dioxide (CO2)": ParticleMatter,
    "Average Particle Matter (PM2.5)": CarbonDioxide,
    "Average Total KiloWatt (KWh)": KWh,
}

Data = {
    ...Data,
    MetaData_Header: {
        "Absolute Humidity": AbsoluteHumidity,
        "Temperature": Temperature,
        "Relative Humidity": RelativeHumidity,
        "Power": Power,
        "Current": Current,
        "Voltage": Voltage,
        "KWh": KWh,
        "Total KiloWatt": KWh,
        "Formaldehyde": Formaldehyde,
        "Particle Matter": ParticleMatter,
        "Carbon Dioxide": CarbonDioxide,
        "Temperature (℃)": Temperature,
        "Relative Humidity (%)": RelativeHumidity,
        "Voltage (V)": Voltage,
        "Power (W)": Power,
        "Current (mA)": Current,
        "Formaldehyde (mg/m3)": Formaldehyde,
        "Carbon Dioxide (ppm)": CarbonDioxide,
        "Particle Matter (ug/m3)": ParticleMatter,
        "Formaldehyde (CH2O)": Formaldehyde,
        "Carbon Dioxide (CO2)": ParticleMatter,
        "Particle Matter (PM2.5)": CarbonDioxide,
        "Total KiloWatt (KWh)": KWh,
        "Average Absolute Humidity": AbsoluteHumidity,
        "Average Temperature (℃)": Temperature,
        "Average Relative Humidity (%)": RelativeHumidity,
        "Average Voltage (V)": Voltage,
        "Average Power (W)": Power,
        "Average Current (mA)": Current,
        "Average Formaldehyde (mg/m3)": Formaldehyde,
        "Average Carbon Dioxide (ppm)": CarbonDioxide,
        "Average Particle Matter (ug/m3)": ParticleMatter,
        "Average Formaldehyde (CH2O)": Formaldehyde,
        "Average Carbon Dioxide (CO2)": ParticleMatter,
        "Average Particle Matter (PM2.5)": CarbonDioxide,
        "Average Total KiloWatt (KWh)": KWh,
    }
}

import RedeemSucess from "@assets/svg/tokens/redeem_sucess.svg";
import RedeemTokens from "@assets/svg/tokens/redeem_tokens.svg";

Data = {
    ...Data,
    RedeemSucess: RedeemSucess,
    RedeemTokens: RedeemTokens,
}

export default Data;