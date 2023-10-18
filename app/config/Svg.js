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

Data = {
    ...Data,
    Temperature: Temperature,
    "Absolute Humidity": AbsoluteHumidity,
    "Relative Humidity": RelativeHumidity,
    Power: Power,
    Current: Current,
    Voltage: Voltage,
    Formaldehyde: Formaldehyde,
    "Particle Matter": ParticleMatter,
    "Carbon Dioxide": CarbonDioxide,
    "KWh": Power,
}

Data = {
    ...Data,
    MetaData_Header: {
        Temperature: Temperature,
        "Absolute Humidity": AbsoluteHumidity,
        "Relative Humidity": RelativeHumidity,
        Power: Power,
        Current: Current,
        Voltage: Voltage,
        Formaldehyde: Formaldehyde,
        "Particle Matter": ParticleMatter,
        "Carbon Dioxide": CarbonDioxide,
        KWh: Power,
    }
}

export default Data;