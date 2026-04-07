export const PREDICTIONS = [
  "Your bags will pump when you least expect it. HODL.",
  "A major CEX listing is in your future. Stay vigilant.",
  "The gas fees will be low when you need them most.",
  "You will find a 100x gem in a sea of rugpulls.",
  "Vitalik will smile upon your wallet today.",
  "Your favorite memecoin is going to the moon. 🚀",
  "Beware of the FOMO, it leads to the dark side of the charts.",
  "A whale is watching your moves. Stay calm.",
  "Your private keys are safe, but your sanity is at risk.",
  "The next bull run starts with your next trade.",
  "You will successfully bridge to Base without a hitch.",
  "A crypto meme will make you laugh and then make you rich.",
  "Your NFT will finally find a buyer who appreciates its 'art'.",
  "The dip is just a discount for the brave.",
  "Satoshi is proud of your diamond hands.",
  "You will win a gas war against a bot.",
  "A random airdrop will land in your wallet today.",
  "Your portfolio will turn green before the sun sets.",
  "Don't check the charts for 24 hours. Your mental health will thank you.",
  "The alpha you seek is hidden in plain sight."
];

export const FORTUNE_COOKIE_ABI = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_prediction",
        "type": "string"
      }
    ],
    "name": "crackCookie",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_user",
        "type": "address"
      }
    ],
    "name": "getUserCookies",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "owner",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "prediction",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "timestamp",
            "type": "uint256"
          }
        ],
        "internalType": "struct FortuneCookie.Cookie[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalCookies",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

export const CONTRACT_ADDRESS = "0xb159fD5c272a3019444ADC0dC21Ed07aDa640FDb";
export const DEVELOPER_ADDRESS = "0xf489494098a045Aa3401F8261e9c7d5ab5d6684b";
