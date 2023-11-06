const defaultValueSelect = (state) => state.defaultValue;
const userIdSelect = (state) => state.userId;
const homeIdSelect = (state) => state.homeId;
const roomIdSelect = (state) => state.roomId;
const wifiSelect = (state) => state.wifi;
const tuyaHomeIdSelect = (state) => state.tuyaHomeId;
const firstTimeLinkSelect = (state) => state.firstTimeLink;

const linkTimerSelect = (state) => state.linkTimer;
const linkTotalDurationSelect = (state) => state.linkTotalDuration;
const linkDeviceLsSelect = (state) => state.linkDeviceLs;
const linkTsStartSelect = (state) => state.linkTsStart;

const subUserAccessSelect = (state) => state.subUserAccess;

export {
    defaultValueSelect,
    userIdSelect,
    homeIdSelect,
    roomIdSelect,
    wifiSelect,
    tuyaHomeIdSelect,
    firstTimeLinkSelect,
    linkTimerSelect,
    linkTotalDurationSelect,
    linkDeviceLsSelect,
    linkTsStartSelect,
    subUserAccessSelect
}