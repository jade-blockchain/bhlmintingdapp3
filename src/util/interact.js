import { ethers } from 'ethers';
import Web3Modal from "web3modal";



require("dotenv").config();
const alchemyKey = process.env.REACT_APP_Dev_Mode === "1" ? process.env.REACT_APP_Test_Network_URL : process.env.REACT_APP_Main_Network_URL;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);

const contractABI = require("./Contract.json");
const contractAddress = process.env.REACT_APP_contractAddress;

const CheckWhiteList = process.env.REACT_APP_Check_WhiteList;


const NetworkID =  process.env.REACT_APP_Dev_Mode === "1" ? process.env.REACT_APP_Test_Network_Version : process.env.REACT_APP_Main_Network_Version;
const NetworkChainID = process.env.REACT_APP_Dev_Mode === "1" ? process.env.REACT_APP_Test_Network_chainId : process.env.REACT_APP_Main_Network_chainId;
const NetworkName = process.env.REACT_APP_Dev_Mode === "1" ? process.env.REACT_APP_Test_Network_Name : process.env.REACT_APP_Main_Network_Name;
const EtherscanURL = process.env.REACT_APP_Dev_Mode === "1" ? process.env.REACT_APP_Test_Etherscan_url : process.env.REACT_APP_Main_Etherscan_url

// const TestNetworkVersion = Number(process.env.REACT_APP_Test_Network_Version) ;
// const MainNetworkVersion = Number(process.env.REACT_APP_Main_Network_Version) ;

export const _Contract = new web3.eth.Contract(
  contractABI,
  contractAddress
);

export const walletEthBalance = async (address) =>{
  const b= await web3.eth.getBalance(address);
  return b;
}

export const loadMAXNFTPERADDRESSLIMIT = async () => {
  const p = await _Contract.methods.MAX_NFTPERADDRESSLIMIT().call();
  return p;
};

export const loadMINETHVALUE = async () => {
  const p = await _Contract.methods.MINETHVALUE().call();
  return p;
};

export const loadPublicSale = async () => {
  const p = await _Contract.methods.publicSale().call();
  return p;
};

export const loadGoldListSale = async () => {
  const p = await _Contract.methods.goldListSale().call();
  return p;
};

export const LoadStatus = async(address) =>{ // 0: none;  1: public sale; 2: gold sale ; 3: gold sale not whitelisted
   const ps = await loadPublicSale();
   const gs = await loadGoldListSale();
  let s=0;
  if(address === "")
  {
    if(ps)
      s= 1;
    else if (gs)
      s= 3;
  }
  else
  {
    if(gs)
    {
      if(await loadGoldListedUser(address))
        s=2;
    }
     if(s===0 && ps)
        s=1;
      else if(gs)
        s=3;
  }
return s;   
}

export const loadPrice = async (st) => {
  if(st===2 || st===3)
    return await loadGoldListSalePrice();
  else
    return await loadPublicSalePrice();
};


export const loadPublicSalePrice = async () => {
  const p = await _Contract.methods.PUBLIC_SALE_PRICE().call();
  return p;
};

export const loadGoldListSalePrice = async () => {
  const p = await _Contract.methods.GOLDLIST_SALE_PRICE().call();
  return p;
};

export const loadMaxSupply = async () => {
  const ms = await _Contract.methods.MAX_SUPPLY().call();
  return ms;
};

export const loadTotalSupply = async () => {
  const ts = await _Contract.methods.totalSupply().call();
  return ts;
};

export const loadMaxMint = async (st) => {
  if(st===2 || st===3)
    return await loadMaxGoldMint();
  else
    return await loadMaxPublicMint();
}

export const loadMaxPublicMint = async () => {
  const mna = await _Contract.methods.MAX_PUBLIC_MINT().call();
  return mna;
};

export const loadMaxGoldMint = async () => {
  const mna = await _Contract.methods.MAX_GOLDLIST_MINT().call();
  return mna;
};

export const loadTokensMintedPerAddress  = async (st,address) => {
  if(address==="")
    return 0;
  if(st >= 2  )
    return await loadTokensMintedPerGoldAddress(address);
  else
    return await loadTokensMintedPerPublicAddress(address);
}

export const loadTokensMintedPerPublicAddress  = async (address) => {
  const tmpa = await _Contract.methods.totalPublicMint(address).call();
  return parseInt(tmpa);
};

export const loadTokensMintedPerGoldAddress  = async (address) => {
  const tmga = await _Contract.methods.totalGoldlistMint(address).call();
  return parseInt(tmga);
};

export const loadSymbol = async () => {
  const smb = await _Contract.methods.symbol().call();
  return smb;
};

export const loadBalanceOf = async (address) => {
  const bo = await _Contract.methods.balanceOf(address).call();
  return bo;
};

export const loadGoldListedUser= async (address) => {
  const bo = await _Contract.methods.isGoldlisted(address).call();
  return bo;
};

let wcprovider=null;
const WalletConnectProvider = window.WalletConnectProvider?.default;
const providerOptions = {
  walletconnect: {
      package: WalletConnectProvider,
      options: {
          rpc: {
              1 : process.env.REACT_APP_Main_Network_URL,
              5 : process.env.REACT_APP_Test_Network_URL
          }
      }
  }
};

const web3Modal = new Web3Modal({
  cacheProvider: true,
  providerOptions,
  disableInjectedProvider: false,
  theme: {
      background: "#FF4950",
      main: "#000",
      secondary: "#000",
      border: "transparent",
      hover: "#fff"
  }
});

export const connectWallet = async () => {

  try {
    const _provider = await web3Modal.connect();
    wcprovider = _provider;

    // _provider.on("accountsChanged", (accounts) => {
    //     fetchAccountData();
    // });
    // _provider.on("chainChanged", (chainId) => {
    //     fetchAccountData();
    // });
    // _provider.on("disconnect", () => {
    //     onDisconnect();
    // });
    return fetchAccountData();
  } catch (e) {
      //console.log("Could not get a wallet connection", e);
      return {
              address: "",
              status: "Wallet Connection Error!" ,
              WAuthorized :"",
              Provider: null,
              Balance:0
            };
  }


};

export const onDisconnect = async () => {
  await web3Modal.clearCachedProvider();
  wcprovider = null;
}

export const fetchAccountData = async () => {
  try
  {
  const library = new ethers.providers.Web3Provider(wcprovider);
  const _accounts = await library.listAccounts();
  const _Netowrk = await library.getNetwork();
  if (_Netowrk.chainId.toString() !== NetworkID) {
     if( await switchNetwork() === false)
     {
         return {
                address: "",
                status: "😥 Unable to switch network to " + NetworkName,
                WAuthorized :"",
                Provider: null,
                Balance:0
                };
     }
  }
  const _selectedAccount = _accounts.length > 0 ? _accounts[0] : "";
  return  {
          //status: await walletEthBalance(_selectedAccount) >= await loadMinEthBalance() ? "" : "❌ You don't have the minimum ETH required in your wallet",
          address: _selectedAccount,
          WAuthorized : await CheckWalletAddress(_selectedAccount),
          Provider: wcprovider,
          Balance: 0// await walletEthBalance(_selectedAccount)
        };
  }
  catch{
    return  {
      status: "Please connect using the top right button.",
      address: "",
      WAuthorized : "",
      Provider: "",
      Balance:0
    };
  }
}

const switchNetwork =async () => {
  try {
      await wcprovider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: NetworkChainID }],
      });
      return true;
  } catch (switchError) {
      return false;
  }
}

export const CheckWalletAddress = async (address) => {
  if(CheckWhiteList === "yes")
  {
    var waresponse= "false";
    try{
     await fetch('./api/whitelist/'  + address.toLowerCase() + '.html' ,{method: "GET" , headers : {"Accept": "application/json","Access-Control-Allow-Origin" :"*","Access-Control-Allow-Headers" : "Content-Type" , "Access-Control-Allow-Methods" :"GET" } })
      .then((response)=>{
        //console.log('whitelist',response.status);
        waresponse = response.status === 404 ? "false" : "true";
      });
      // .then(function(jsonresponse) {
      //   if(jsonresponse.isWhitelist === true){
      //     waresponse="true";
      //   }
      //   else
      //   {
      //     waresponse="false";
      //   }
      // })
      // .catch((err) => {
      //   waresponse="false";
    // });
    }
    catch {
      waresponse="false";
    }
        return waresponse;
  }
  else
  {
    return  "true";
  }
};

export const updateMint = async (address,txHash,amnt) => {
    // try{
    //   const m = process.env.REACT_APP_UpdateMintURL + "_Address=" + encodeURIComponent(address) + "&_TxHash=" + encodeURIComponent(txHash) + "&_MintURL=" + encodeURIComponent(window.location) +"&_MintAmount=" + encodeURIComponent(amnt);
    //   await fetch( m ,{method: "GET" , headers : {"Accept": "application/json","Access-Control-Allow-Origin" :"*","Access-Control-Allow-Headers" : "Content-Type" , "Access-Control-Allow-Methods" :"GET" } });
    // }
    // catch {
    // }
};

export const getCurrentWalletConnected = async () => {
  if (web3Modal.cachedProvider) {
   return await connectWallet();
  }
  else
  {
    return {
      address: "",
      status: "" ,
      WAuthorized :"",
      Provider: null
      
    };
  }
};

export const mintFunction = async (address, message) => {
  
  const CStatus = await LoadStatus(address);
  if(CStatus===0)
  {
    return {status: "❌ NFT Minting not started"};
  }
  else if(CStatus===3)
  {
    return {status: "❌ You are not whitelisted"};
  }
  
  
  if (typeof (wcprovider) == 'undefined' || wcprovider == null || address==="") {
    connectWallet();
    return {
      status: "Please connect your wallet using the top right button"
    };
}
  
 

  const bo= Number(await loadMaxMint(CStatus));
  const ta= Number(await loadTokensMintedPerAddress(CStatus ,address));
  if( (ta + Number(message)) > bo )
  {
    if(bo===ta)
    {
      return {status: 
        <span>
          ❌ You have already minted 1 free NFT. Head to Opensea to view your Dudelz NFT.<br/><br/>
          <a href='https://opensea.io/collection/dudelz-by-jojami'>https://opensea.io/collection/dudelz-by-jojami</a>
        </span>
        };
    }
    else
    {
      return {status: "❌ Your maximum NFTs to mint is: " + ( bo - ta)};
    }
  }
  const CMaxSpp = Number.parseInt(await loadMaxSupply());
  const ts= Number(await loadTotalSupply());
  if( (ts + Number(message)) > CMaxSpp)
  {
    return {status: "❌ Cannot mint beyond max supply."};
  }

  const meb = Number.parseInt(await loadMINETHVALUE()) / 1000000000000000000 ;
  if(Number.parseInt(await walletEthBalance(address)) < meb )
  {
    return {
      status : "❌ You need a minimum of " + meb.toString() + " ETH in your wallet to qualify for the free mint"
    };
  }

  if(message > Number.parseInt(await loadMAXNFTPERADDRESSLIMIT())){
    return {
      status : "❌ Max NFT per address exceeded"
    };
  }
  const _library = new ethers.providers.Web3Provider(wcprovider);
  const _account = await _library.listAccounts();
  const _Netwrk = await _library.getNetwork();

  if(_Netwrk.chainId.toString() !== NetworkID.toString())
  {
    return {
      status:
        "Please switch the network in your wallet to " + NetworkName,
    };
  }

  if(_account.length === 0){
    return {
      status: "Please connect your wallet using the top right button"
    };
  }

  if (message === 0) {
    return {
      status: "❌ ",
    };
  }
  

  if(CStatus===1 || CStatus ===2){
  const p = await loadPrice(CStatus);
  const transactionParameters = {
    to: contractAddress, 
    from: address, 
    //value: parseInt(web3.utils.toWei(web3.utils.toBN(p * Number(message)) ,'wei')).toString(16) ,
    value: web3.utils.toHex(web3.utils.toWei((p * Number(message)).toString(), "wei")),
    data: CStatus===1 ? _Contract.methods.mint(message).encodeABI() : _Contract.methods.goldlistMint(message).encodeABI() ,
  };

  
  try {
    const txHash = await wcprovider.request({
      method: "eth_sendTransaction",
      params: [transactionParameters],
    });
    //await updateMint(address,txHash,message);
    return {
      status: (
        <span>
          Congratulation! You have minted a Dudelz NFT.<br/><br/>
          Please check the transaction in your wallet, or click <a target="_blank" rel="noreferrer" href={`${EtherscanURL + txHash}`}>here</a>  to view the transaction on ehterscan.<br/><br/>
          Head to Opensea to view your Dudelz NFT.<br/>
          <a href='https://opensea.io/collection/dudelz-by-jojami'>https://opensea.io/collection/dudelz-by-jojami</a>
        </span>
      ),
    };
  } catch (error) {
    return {
      status: "😥 Wallet Error: " + error.message,
    };
  }
}
};


export const addTokenMetamask = async() => {
  const smb = await loadSymbol();
   await window.ethereum.request({
    method: 'wallet_watchAsset',
    params: {
      type: 'ERC20', 
      options: {
        address: contractAddress, 
        symbol: smb, 
        decimals: 0, 
      },
    },
  });
}