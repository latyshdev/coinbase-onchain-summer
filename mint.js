/* ========================================================================= */
const ethers = require('ethers');
const {gasMultiplicate, waitGwei} = require('./ethers_helper');
const { logError, pause, SECOND, logInfo, logSuccess } = require('./helper');
/* ========================================================================= */
exports.mint = {

  0: {name: "Все", value: `all`, choice: 0},

  1: {
    choice: 1,
    name: `One Year On Base — Still Day One`,
    mint: `0x777777722D078c97c6ad07d9f36801e653E356Ae`,
    NFT: `0xb4703a3a73Aec16E764CBd210b0Fde9EFdAB8941`,
    mintReferral: `0x9652721d02b9db43f4311102820158aBb4ecc95B`,
    value: `0.000111`,
    tokenId: 1,
    ended: true
  }, // Linus 

  2: {
    choice: 2,
    name: `Crypto Vibe`,
    mint: `0x6a43B7e3ebFc915A8021dd05f07896bc092d1415`,
    value: `0.0001`,
    ended: false
  },

  3: {
    choice: 3,
    name: `What if we added a Stand With Crypto Shield as a Head Trait in The Yellow Collective on Base?`,
    mint: `0xea50e58b518435ad2cece84d1e099b2e0878b9cf`,
    value: `0.0001`,
    ended: false   
  },

  4: {
    choice: 4,
    name: `Let The Shield Shine`,
    mint: `0x2a8e46e78ba9667c661326820801695dcf1c403e`,
    value: `0.0001`,
    ended: false 
  },

  5: {
    choice: 5,
    name: `All for One`,
    mint: `0x8e50c64310b55729f8ee67c471e052b1cd7af5b3`,
    value: `0.0001`,
    ended: false 
  },

  6: {
    choice: 6,
    name: `Let's Stand`,
    mint: `0x95ff853a4c66a5068f1ed8aaf7c6f4e3bdbebae1`,
    value: `0.0001`,
    ended: false 
  },  

  7: {
    choice: 7,
    name: `Stand With Crypto Shield Rune`,
    mint: `0x13fCcd944B1D88d0670cae18A00abD272256DDeE`,
    value: `0.0001`,
    ended: false 
  },  

  8: {
    choice: 8,
    name: `Toshi Vibe`,
    mint: `0xbfa3ff9dcdb811037bbec89f89e2751114ecd299`,
    value: `0.0001`,
    ended: false 
  },


  9: {
    choice: 9,
    name: `Stand With Crypto Shield Rune`,
    mint: `0x13fCcd944B1D88d0670cae18A00abD272256DDeE`,
    value: `0.0001`,
    ended: false 
  },

  10: {
    choice: 10,
    name: `The Creative Shield`,
    mint: `0x892Bc2468f20D40F4424eE6A504e354D9D7E1866`,
    value: `0.0001`,
    ended: false 
  },

  //0x6A3dA97Dc82c098038940Db5CB2Aa6B1541f2ebe
  //Shielding the wonder
  11: {
    choice: 11,
    name: `Shielding the wonder`,
    mint: `0x6A3dA97Dc82c098038940Db5CB2Aa6B1541f2ebe`,
    value: `0.0001`,
    ended: false 
  },

  //Earth Stands with Crypto
  //0xd1E1da0b62761b0df8135aE4e925052C8f618458
  12: {
    choice: 12,
    name: `Earth Stands with Crypto`,
    mint: `0xd1E1da0b62761b0df8135aE4e925052C8f618458`,
    value: `0.0001`,
    ended: false 
  },

  13: {
    choice: 13,
    name: `we stand, we build`,
    mint: `0xEb9A3540E6A3dc31d982A47925d5831E02a3Fe1e`,
    value: `0.0001`,
    ended: false 
  },
  
  14: {
    choice: 14,
    name: `Toshi x SWC 3`,
    mint: `0xb620bEdCe2615A3F35273A08b3e45e3431229A60`,
    value: `0.0001`,
    ended: false 
  },

  15: {
    choice: 15,
    name: `en garde`,
    mint: `0x1f006edBc0Bcc528A743ee7A53b5e3dD393A1Df6`,
    value: `0.0001`,
    ended: false 
  },

  16: {
    choice: 16,
    name: `Stand With Crypto | Song A Day #5714`,
    mint: `0x2382456097cC12ce54052084e9357612497FD6be`,
    value: `0.0001`,
    ended: false 
  },

  17: {
    choice: 17,
    name: `cbwallet.cb.id | cbwallet.cb.id`,
    mint: `0x146B627a763DFaE78f6A409CEF5B8ad84dDD4150`,
    value: `0.0001`,
    ended: false 
  },

  18: {
    choice: 18,
    name: `Stand with Crypto Pizza`,
    mint: `0x4beAdC00E2A6b6C4fAc1a43FF340E5D71CBB9F77`,
    value: `0.0001`,
    ended: false 
  },

  // N: {
  //   choice: N,
  //   name: ``,
  //   mint: ``,
  //   value: `0.0001`,
  //   ended: false 
  // },


  // BASE 
  mintFunctions: {
    ended: true,
    name: `Выберите минт`,
    value: false,
    1: zoraMint,
    2: mintWithComment,
    3: mintWithComment,
    4: mintWithComment,
    5: mintWithComment,
    6: mintWithComment,
    7: mintWithComment,
    8: mintWithComment,
    9: mintWithComment,
    10: mintWithComment,
    11: mintWithComment,
    12: mintWithComment,
    13: mintWithComment,
    14: mintWithComment,
    15: mintWithComment,
    16: mintWithComment,
    17: mintWithComment,
    18: mintWithComment,
  }

};

//
async function mintWithComment(BOT, choice) {
  const ABI = `[
    {"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"quantity","type":"uint256"},{"internalType":"string","name":"comment","type":"string"}],"name":"mintWithComment","outputs":[],"stateMutability":"payable","type":"function"}
  ,
    {"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}
  ]`
  const contract = new ethers.Contract(choice.mint, ABI, BOT.wallets["BASE"]);
  const balanceOf = await contract.balanceOf(BOT.wallets["BASE"].address);
  // console.log("balanceOf", balanceOf);
  if (balanceOf > 0) {
    return true;
  } else {
      // Ждем газ
      let gasIsNormal = await waitGwei(BOT, `BASE`);
      if (!gasIsNormal) return false;

      BOT.tx_params["BASE"].value = ethers.parseEther(`${choice.value}`);

      const gasAmount = await contract["mintWithComment"].estimateGas(
        BOT.wallets['BASE'].address, // to
        1, // quantity
        "", // comment
        BOT.tx_params["BASE"]
      );

      BOT.tx_params["BASE"].gasLimit = gasMultiplicate(gasAmount, BOT.configs["BASE"].GAS_AMOUNT_MULTIPLICATOR);
      // console.log(gasAmount, BOT.tx_params["BASE"].gasLimit);
      // return true;

      let tx = await contract["mintWithComment"](
        BOT.wallets['BASE'].address, // to
        1, // quantity
        "", // comment
        BOT.tx_params["BASE"]
      );
      return tx;
  }

}

// elementNFT
async function zoraMint(BOT, choice) {

  // console.log(choice.NFT);

  const ABI_mint = `[{"inputs":[{"internalType":"address","name":"mintTo","type":"address"},{"internalType":"uint256","name":"quantity","type":"uint256"},{"internalType":"address","name":"collection","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"address","name":"mintReferral","type":"address"},{"internalType":"string","name":"comment","type":"string"}],"name":"mint","outputs":[],"stateMutability":"payable","type":"function"}]`;
  const ABI_nft = `[{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}]`;

  const contract = new ethers.Contract(choice.mint, ABI_mint, BOT.wallets["BASE"]);
  const contractNFT = new ethers.Contract(choice.NFT, ABI_nft, BOT.wallets["BASE"]);

  // const balanceOf = await contractNFT.balanceOf(BOT.wallets["BASE"].address);
  // console.log("balanceOf", balanceOf);

  const balanceOf = 0;
  if (balanceOf > 0) {
    return true;
  } else {

    // Ждем газ
    let gasIsNormal = await waitGwei(BOT, `BASE`);
    if (!gasIsNormal) return false;
    // console.log(BOT.tx_params["BASE"]);

    BOT.tx_params["BASE"].value = ethers.parseEther(`${choice.value}`);

    const gasAmount = await contract["mint"].estimateGas(
      BOT.wallets['BASE'].address, // mintTo
      1, // quantity
      choice.NFT, // collection
      choice.tokenId, // tokenId
      choice.mintReferral, // mintReferral
      ``, // comment
      BOT.tx_params["BASE"]
    );
    
    BOT.tx_params["BASE"].gasLimit = gasMultiplicate(gasAmount, BOT.configs["BASE"].GAS_AMOUNT_MULTIPLICATOR);
    console.log(gasAmount, BOT.tx_params["BASE"].gasLimit);
    // return true;

    let tx = await contract.mint(
      BOT.wallets['BASE'].address, // mintTo
      1, // quantity
      choice.NFT, // collection
      choice.tokenId, // tokenId
      choice.mintReferral, // mintReferral
      ``, // comment
      BOT.tx_params["BASE"]
    );
    return tx;
  }
};

