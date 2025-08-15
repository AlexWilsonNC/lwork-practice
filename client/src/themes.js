import errorBg from './assets/article-thumbnails/unknown-player.png';
import errorBgGrey from './assets/article-thumbnails/unknown-player-grey.png';

const decklistSvgLight = `
<svg xmlns="http://www.w3.org/2000/svg" width="140%" height="140%">
  <defs>
    <pattern 
      id="patternBg" 
      patternUnits="userSpaceOnUse" 
      width="75" height="75" 
      patternTransform="rotate(45 30 30)scale(1.3)"
    >
      <!-- white background -->
      <rect x="0" y="0" width="100%" height="100%" fill="#ffffff"/>
      <!-- circle pattern in dark grey -->
      <path
         d="M59.995 52.87
     m-14.557 7.125h7.450z
     m15.687 0h7.427z
     a4 4 0 01-4 4 4 4 0 01-4 -4 4 4 0 014 -4 4 4 0 014 4
     zm-6.757-14.547
     c-4.212-.069-8.465 1.673-11.262 4.869
       -4.23 4.606-4.845 11.985-1.55 17.274
       3.09 5.2 9.628 7.954 15.517 6.635
       6.53-1.292 11.604-7.583 11.48-14.231
       .096-5.628-3.495-11.014-8.606-13.298
       -1.757-.813-3.665-1.217-5.58-1.249z"
        fill="none"
        stroke="rgb(210,210,210,0.5)"
        stroke-width="1.75"
      />
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#patternBg)"/>
</svg>
`;
const patternBgLight = `url("data:image/svg+xml;utf8,${encodeURIComponent(decklistSvgLight)}")`;

export const lightTheme = {
  body: '#FFF',
  text: '#000',
  burgerMenu: '#1290eb',
  burgerTxt: '#FFF !important',
  toggleBorder: '#FFF',
  background: '#363537',
  navBg: 'transparent',
  navBtmBorder: 'none',
  featuredheadertext: 'rgb(70, 70, 70)',
  whiteBackground: '#FFF',
  hoverWrappedFeatureBg: 'rgb(250, 250, 250)',
  homepageMainContentBg: 'rgb(240, 240, 240)',
  lightBurgerColor: '#FFF',
  darkBurgerColor: '#000',
  themeName: 'light',
  themeBorder: '2px solid rgb(255, 255, 255)',
  themeBg: 'rgb(0, 47, 89)',
  themeColor: '#FFF',
  buttonBackground: '#1290eb',
  buttonText: '#FFF',
  playerlisthover: 'rgb(230, 234, 240)',
  deckBg: 'rgb(235, 235, 235)',
  deckBorder: "3px solid rgb(180, 180, 180)",
  listCardBg: '#FFF',
  listCardText: '#000',
  cardInfoBg: 'rgba(255, 255, 255, 0.6)',
  otherVers: 'rgb(200, 223, 240)',
  twitterTimeline: {
    'data-theme': 'light'
  },
  searchBg: '#FFF',
  searchTxt: '#000',
  setChangeBtn: 'rgb(240, 240, 240)',
  setChangeHover: '#0721b5 !important',
  setinfodark: 'rgb(236, 240, 244)',
  day1btn: 'rgb(180, 180, 180)',
  chartNumber: '#FFF',
  chartdescrip: '#000',
  spinner: '#1290eb',
  aboutbg: '#f5f5f5',
  abouttxt: '#333',
  modalbg: '#FFF',
  winBg: '#C1E1C1', // light green for wins
  lossBg: '#FAA0A0', // light red for losses
  tieBg: '#fffcc2', // light yellow for ties
  unknownplayer: errorBgGrey,
  blueballopacity: '0.075',
  cardSearchBg: "url(\"data:image/svg+xml,<svg id='patternId' width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'><defs><pattern id='a' patternUnits='userSpaceOnUse' width='40' height='59.428' patternTransform='scale(1) rotate(0)'><rect x='0' y='0' width='100%' height='100%' fill='%23ffffffff'/><path d='M0 70.975V47.881m20-1.692L8.535 52.808v13.239L20 72.667l11.465-6.62V52.808zm0-32.95l11.465-6.62V-6.619L20-13.24 8.535-6.619V6.619L20 13.24m8.535 4.927v13.238L40 38.024l11.465-6.62V18.166L40 11.546zM20 36.333L0 47.88m0 0v23.094m0 0l20 11.548 20-11.548V47.88m0 0L20 36.333m0 0l20 11.549M0 11.547l-11.465 6.619v13.239L0 38.025l11.465-6.62v-13.24L0 11.548v-23.094l20-11.547 20 11.547v23.094M20 36.333V13.24'  stroke-linecap='square' stroke-width='1.5' stroke='%238c8c8c26' fill='none'/></pattern></defs><rect width='800%' height='800%' transform='translate(0,0)' fill='url(%23a)'/></svg>\"), linear-gradient(to top right, rgb(182, 201, 214), rgb(194, 196, 202))",
  supportPatreonBtn: 'linear-gradient(to bottom right, rgb(255, 255, 255), rgb(229, 229, 229))',
  supportPatreonBg: '1.5px solid rgba(0, 0, 0, 0.2)',
  burgernavhr: '5px solid rgba(0, 47, 89, 0.3)',
  loginbg: '#f4f5f8',
  loginBoxbg: '#FFF',
  loginInput: '#FFF',
  loginINPUTbORDER: '1px solid grey',
  savedDeckBg: '#FFF',
  favoriteHeart: 'rgb(183, 183, 183)',
  favoriteHeartRed: 'red',
  profileSliderBg: 'rgb(176, 176, 176)',
  listVersionedFolderLabel: '#81c0ed',
  deckModalAccountList: patternBgLight,
  decklistModalAccountPopupView: 'linear-gradient(to bottom right, rgb(235, 235, 235) , rgb(240, 240, 240))',
  modalCloseAccountList: '#000',
  decklistOpenedBtnBg: 'rgb(169, 169, 169)',
  profilesettingsbg: 'rgba(235, 235, 235, 0.557)',
  dropdownsbg: '#fff',
  cardModalContentZoomCard: 'linear-gradient(to bottom right, rgb(172, 175, 181), rgb(239, 244, 245))',

};

const decklistSvgDark = `
<svg xmlns='http://www.w3.org/2000/svg' width='140%' height='140%'>
  <defs>
    <pattern id='patternBg' patternUnits='userSpaceOnUse' width='75' height='75' patternTransform='rotate(45 30 30)scale(1.3)'>
      <rect x='0' y='0' width='100%' height='100%' fill='#2e2e32ff'/>
        <path
         d="M59.995 52.87
     m-14.557 7.125h7.450z
     m15.687 0h7.427z
     a4 4 0 01-4 4 4 4 0 01-4 -4 4 4 0 014 -4 4 4 0 014 4
     zm-6.757-14.547
     c-4.212-.069-8.465 1.673-11.262 4.869
       -4.23 4.606-4.845 11.985-1.55 17.274
       3.09 5.2 9.628 7.954 15.517 6.635
       6.53-1.292 11.604-7.583 11.48-14.231
       .096-5.628-3.495-11.014-8.606-13.298
       -1.757-.813-3.665-1.217-5.58-1.249z"
        stroke-width='1.5'
        stroke='#393E40'
        fill='none'
      />
    </pattern>
  </defs>
  <rect width='100%' height='100%' fill='url(#patternBg)'/>
</svg>
`
const patternUrl = `url("data:image/svg+xml;utf8,${encodeURIComponent(decklistSvgDark)}")`;

export const darkTheme = {
  body: '#27292c',
  text: '#FAFAFA',
  burgerMenu: 'rgb(60, 65, 71)',
  toggleBorder: '#6B8096',
  burgerTxt: '#FAFAFA !important',
  background: '#999',
  navBg: 'rgb(27, 27, 29)',
  navBtmBorder: '1px solid rgba(128, 128, 128, 0.737)',
  featuredheadertext: '#e1e1e1',
  whiteBackground: 'rgb(29, 30, 31)',
  hoverWrappedFeatureBg: 'rgb(24, 24, 24)',
  homepageMainContentBg: 'transparent',
  lightBurgerColor: '#FFF',
  darkBurgerColor: '#FFF',
  themeName: 'dark',
  themeBorder: '2px solid #FFF',
  themeBg: 'rgb(0, 136, 255)',
  themeColor: '#FFF',
  buttonBackground: '#333',
  buttonText: '#FFF',
  playerlisthover: 'rgba(101, 127, 153, 0.15)',
  deckBg: 'rgb(27, 27, 29)',
  deckBorder: "3px solid rgb(40, 40, 40)",
  listCardBg: 'rgb(67, 73, 85)',
  listCardText: 'rgb(230, 230, 230)',
  cardInfoBg: 'rgba(29, 36, 55, 0.75)',
  otherVers: 'rgba(2, 24, 40, 0.497)',
  twitterTimeline: {
    'data-theme': 'dark'
  },
  searchBg: '#27292c',
  searchTxt: '#FFF',
  setChangeBtn: '#1d1e21',
  setChangeHover: '#FFF !important',
  setinfodark: 'rgb(48, 55, 65)',
  day1btn: 'rgb(80, 80, 80)',
  chartNumber: 'rgb(200, 200, 200)',
  chartdescrip: 'grey',
  spinner: '#1290eb',
  aboutbg: 'rgb(27, 27, 29)',
  abouttxt: 'rgb(210, 210, 210)',
  modalbg: '#2b3135',
  winBg: '#739e73', // darker green for wins
  lossBg: '#b54a4a', // darker red for losses
  tieBg: '#bab461',  // darker yellow for ties
  unknownplayer: errorBg,
  blueballopacity: '0.038',
  cardSearchBg: "url(\"data:image/svg+xml,<svg id='patternId' width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'><defs><pattern id='a' patternUnits='userSpaceOnUse' width='40' height='59.428' patternTransform='scale(1) rotate(0)'><rect x='0' y='0' width='100%' height='100%' fill='%23101115ff'/><path d='M0 70.975V47.881m20-1.692L8.535 52.808v13.239L20 72.667l11.465-6.62V52.808zm0-32.95l11.465-6.62V-6.619L20-13.24 8.535-6.619V6.619L20 13.24m8.535 4.927v13.238L40 38.024l11.465-6.62V18.166L40 11.546zM20 36.333L0 47.88m0 0v23.094m0 0l20 11.548 20-11.548V47.88m0 0L20 36.333m0 0l20 11.549M0 11.547l-11.465 6.619v13.239L0 38.025l11.465-6.62v-13.24L0 11.548v-23.094l20-11.547 20 11.547v23.094M20 36.333V13.24'  stroke-linecap='square' stroke-width='1.5' stroke='%23ffffff12' fill='none'/></pattern></defs><rect width='800%' height='800%' transform='translate(0,0)' fill='url(%23a)'/></svg>\")",
  supportPatreonBtn: 'linear-gradient(to bottom right, rgb(90, 90, 90), rgb(68, 68, 68))',
  supportPatreonBg: '1.5px solid rgba(255, 255, 255, 0.3)',
  burgernavhr: '5px solid rgba(170, 170, 170, 0.3)',
  loginbg: '#27292c',
  loginBoxbg: 'rgba(0, 0, 0, 0.2)',
  loginInput: 'rgb(70, 70, 70)',
  loginINPUTbORDER: 'none',
  savedDeckBg: 'rgb(29, 30, 31)',
  favoriteHeart: 'rgb(85, 85, 85)',
  favoriteHeartRed: 'rgb(220, 93, 93)',
  profileSliderBg: 'rgb(87, 87, 87)',
  listVersionedFolderLabel: 'rgb(56, 82, 105)',
  deckModalAccountList: patternUrl,
  decklistModalAccountPopupView: 'linear-gradient(to top left, rgb(57, 61, 71) , rgb(45, 47, 52))',
  modalCloseAccountList: '#FFF',
  decklistOpenedBtnBg: 'rgb(100, 100, 100)',
  profilesettingsbg: 'rgba(21, 21, 21, 0.25)',
  dropdownsbg: 'rgba(0, 0, 0, 0.42)',
  cardModalContentZoomCard: 'linear-gradient(to bottom right, rgb(47, 49, 54), rgb(21, 25, 35))',

};
