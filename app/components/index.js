// #region Navigation
import BcStackNavigator from "./Navigation/StackNavigator";
import BcTabNavigator from "./Navigation/TabNavigator";

export {
    BcStackNavigator,
    BcTabNavigator,
};
// #endregion

// #region Utils
import BcBoxShadow from "./BoxShadow";

import BcDisable from "./Disable";

import BcLoading from "./Loading/Normal";
import BcProgressBarLoading from "./Loading/ProgressBar";

import BcDateTimer from "./Timer/Date";
import BcTimer from "./Timer/Normal";

import BcSvgIcon from "./SvgIcon";

export {
    BcBoxShadow,
    BcDisable,
    BcLoading,
    BcSvgIcon,
    BcProgressBarLoading,
    BcTimer,
    BcDateTimer,
}
// #endregion

// #region Layout
import BcHeader from "./Header/Normal";
import BcFooter from "./Footer";

export {
    BcHeader,
    BcFooter
}
// #endregion


// #region Modals
import BaseModal from "./Modal";

// import BcReferralModal from "./Modal/Referral";
import BcBirthdayModal from "./Modal/Birthday";
import BcGenderModal from "./Modal/Gender";

import BcLogoutModal from "./Modal/Logout";

export {
    BaseModal,
    BcGenderModal,
    BcBirthdayModal,
    // BcReferralModal,
    BcLogoutModal,
}