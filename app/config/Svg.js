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

export default Data;