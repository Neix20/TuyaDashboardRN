let Data = {};

import AppLogo from "@assets/svg/AppLogo.svg";
import Yatu from "@assets/svg/Yatu.svg";

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

Data = {
    AppLogo: AppLogo,
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

// FIXME: Temporarily Store Everything in MetaData
Data = {
    ...Data,
    "Absolute Humidity": AbsoluteHumidity,
    "Temperature": Temperature,
    "Relative Humidity": RelativeHumidity,
    "Power": Power,
    "Current": Current,
    "Voltage": Voltage,
    "KWh": KWh,
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
    "Total KiloWatt": KWh,
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
        "Total KiloWatt": KWh,
    }
}

export default Data;