import React, { useCallback } from "react";
import logo from './images/logo-head.png';
import Button from 'react-bootstrap/Button';
import logoNFT from './images/NFT3.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState } from "react";
import Countdown from 'react-countdown';
import Discord from './images/discord.png';
import Twitter from './images/twitter.png';
import Instagram from './images/instagram.png';
import OpenSea from './images/Opensea_Button.png';
import logoFooter from './images/logo-footer.png';
import Form from 'react-bootstrap/Form';
import {
  connectWallet,
  onDisconnect,
  mintFunction,
  LoadStatus,
  loadPrice,
  loadMaxSupply,
  loadTotalSupply,
  loadMaxMint,
  loadTokensMintedPerAddress,
  getCurrentWalletConnected,
  CheckWalletAddress,
  MinEthBalance,
  loadMAXNFTPERADDRESSLIMIT,
  fetchAccountData,
  loadMINETHVALUE
} from "./util/interact.js";

var renderer = null

const MainPage = () => {
  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");
  const [WAuthorized, setWAuthorized] = useState("");
  const [MintAmount, setMintAmount] = useState(0);
  const [Price, setPrice] = useState(0);

  const [CStatus, setCStatus] = useState(0);
  const [TotalSupply, setTotalSupply] = useState(0);
  const [MaxMintAmount, setMaxMintAmount] = useState(10);
  const [tokenMintedAddress, setTokenMintedAddress] = useState(0);
  const [MaxSupply, setMaxSupply] = useState(5555);
  const [MinEthBalance, setMinEthBalance] = useState(0);
  const [MAXNFTPERADDRESSLIMIT, setMAXNFTPERADDRESSLIMIT] = useState(0);

  const temporaryInit = useCallback(async () => {
    // const Cost = await loadCost();
    // setCost(Cost);
    
    const { address, status,WAuthorized,Provider } = await getCurrentWalletConnected();
     
    setWallet(address);
    setStatus(status);
    setWAuthorized(WAuthorized);
    addWalletListener(Provider);

    const CStatus = await LoadStatus(address);
    setCStatus(CStatus);
    const TotalSupply = await loadTotalSupply();
    setTotalSupply(TotalSupply);
    const MaxMintAmount = await loadMaxMint(CStatus);
    setMaxMintAmount(MaxMintAmount);
    const meb = await loadMINETHVALUE();
    setMinEthBalance(meb);
    const mnal =Number.parseInt(await loadMAXNFTPERADDRESSLIMIT());
    setMAXNFTPERADDRESSLIMIT(mnal);
    //addWalletListener();
    const tma = await loadTokensMintedPerAddress(CStatus,address);
    setTokenMintedAddress(tma);
    //setMintAmount(MaxMintAmount-tma);
    setMintAmount(mnal);
    const p = await loadPrice(CStatus);
    setPrice(p / 1000000000000000000);
  }, []);

  useEffect(() => {
    temporaryInit();
  }, [temporaryInit]);

  // useEffect(async () => {
  //   const timer = setTimeout(async () =>  { const TotalSupply2 = await  loadTotalSupply();setTotalSupply(TotalSupply2); }, 60e3)
  //   return () => clearTimeout(timer)
  //  });

const  addWalletListener =  (prvdr) => {
  if(prvdr!==null){
       prvdr.on("accountsChanged", async(accounts) => {
        const r = await fetchAccountData();
        setWallet(r.address);
        setStatus(r.status);
        setWAuthorized(r.WAuthorized);
        if(r.address===""){
          await onDisconnect();
        }
        else
        {
          const tma = await loadTokensMintedPerAddress(CStatus,r.address);
          setTokenMintedAddress(tma);
          //setMintAmount(MaxMintAmount-tma);
        }
      });
      prvdr.on("chainChanged", async (chainId) => {
        const r = await fetchAccountData();
        setWallet(r.address);
        setStatus(r.status);
        setWAuthorized(r.WAuthorized);
      });
      prvdr.on("disconnect", () => {
        onDisconnect();
      });
    }
  }
 function updateWallet(wa,wst,watz){
  setWallet(wa);
  setStatus(wst);
  setWAuthorized(watz);
}

  const connectWalletPressed = async () => {
    if(walletAddress===""){
        const walletResponse = await connectWallet();
        setStatus(walletResponse.status);
        setWallet(walletResponse.address);
        setWAuthorized(walletResponse.WAuthorized);
        const tma = await loadTokensMintedPerAddress(CStatus,walletResponse.address);
        setTokenMintedAddress(tma);
        //setMintAmount(MaxMintAmount-tma);
        await addWalletListener(walletResponse.Provider);
      }
    else
    {
      await onDisconnect();
      setStatus("");
      setWallet("");
      setWAuthorized("");
      setTokenMintedAddress(0);
      //setMintAmount(MaxMintAmount);
    }
  };

  
  const onMintPressed = async () => {
     setStatus('');
     const { status } = await mintFunction(walletAddress, MintAmount);
     setStatus(status);
  };

  const renderer = ({days, hours, minutes, seconds, completed }) => {
    if (completed) {
      //setCStatus(false);
      return <span></span>;
    } else {
      return <div className="">
        <div className="divCountDown">
        <div><span className="divCountDownNumber">{days}</span><br/>Days</div>
        <div><span className="divCountDownNumber">{hours}</span> <br/>Hours</div>
        <div><span className="divCountDownNumber">{minutes}</span> <br/>Minutes</div>
        <div><span className="divCountDownNumber">{seconds}</span> <br/>Seconds</div>
      </div>
      </div>
      //<Countdown date={Date.now() + ((new Date(2022, 2, 18, 20, 0, 0)).getTime() - new Date(new Date().getUTCFullYear(), new Date().getUTCMonth(), new Date().getUTCDate(), new Date().getUTCHours(), new Date().getUTCMinutes(), new Date().getUTCSeconds()).getTime() )} renderer={renderer} />
    }
  };

 
  return (
    <div>
      <div className='main-body'>
     <header>
      <div className="container container-sm">
        <div className="row align-items-center">
          <div className="col-6">
            <div className="nabvar-brand">
              <a href="/">
                <img src={logo} alt="logo"/>
              </a>
            </div>
          </div>
          <div className="col-6 text-right">
          <div className="btn-theme-box">
            <button className="btn btn-theme" onClick={connectWalletPressed} title={walletAddress ==="" ? "" : "Click to disconnect"}>
               {walletAddress.length > 0 ? (
                  <span>Connected: <br/> 
                    {String(walletAddress).substring(0, 6) + '...' + String(walletAddress).substring(38)}
                     </span>
                  ) : (
                    <span>CONNECT <br/>WALLET</span>
                  )
                  }
            </button>
          </div>
          </div>
        </div>
      </div>
    </header>
    
    
    <div className="buy-nft">
      <div className="container container-sm">
      <div className="row">
        <div className="col-md-12 text-center">
          <a href="#" className="footer-logo"><img src={logoFooter} alt="logo" className="img-fluid"/></a>
        </div>
      </div>
        <div className="row">
          <div className="col-12">
            <div className="heading text-center">
              <h2>MINT YOUR NFT</h2>
            </div>
          </div>
        </div>
        <div className="row">
          
          <div className="col-md-6">
            <div className="nft-img-sec">
              <img src={logoNFT} alt="nft" className="img-fluid"/>
            </div>
          </div>
          <div className="col-md-6">
            <div className="buyDesc">
              <ul className="f-figures">
                <li>
                  <p>STATUS</p>
                  <p>{CStatus ===0 ? 'PAUSED'  : (CStatus===1 ? "PUBLIC MINT" : "GOLD MINT")}</p>
                </li>
                {CStatus < 2 ? <li></li> : 
                <li>
                  <p>WHITELIST</p>
                  <p>{CStatus ===2 ? "YES" : "NO"}</p>
                </li>
                }
                <li>
                  <p>NETWORK</p>
                  <p>{process.env.REACT_APP_Dev_Mode ===1 ? process.env.REACT_APP_Test_Network_Name : process.env.REACT_APP_Main_Network_Name}</p>
                </li>
                <li>
                  <p>PRICE</p>
                  <p>{Price} ETH</p>
                </li>
                <li>
                  <p>MIN ETH BALANCE</p>
                  <p>{MinEthBalance / 1000000000000000000} ETH</p>
                </li>
                <li>
                  <p>MAX MINT</p>
                  <p>{MAXNFTPERADDRESSLIMIT} PER WALLET</p>
                </li>
              </ul>
              <div className="buyCalculator">
                <p>{TotalSupply}/{MaxSupply} Minted</p>
                <div className="progress mb-3">
                  <div className="progress-bar" role="progressbar" style={ {width: `${TotalSupply / MaxSupply * 100}%` }} aria-valuenow="10" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
                {/* <p className="">How many NFT's to mint?</p> */}
                <div className="mintDiv">
                <div className="buyCounter0" >
                  {/* <div className="btn-theme-box">
                    <Button variant="theme" className="btn-no-line" onClick={ (e) => { document.getElementById('txtNumber').stepDown(); setMintAmount(parseInt(document.getElementById('txtNumber').value)) ; }}>
                      <FontAwesomeIcon icon={faMinus} />
                    </Button>
                  </div> */}
                  {/* <input type="text" min-value="1" value="1" /> */}
                  {/* <Form.Control type="number" min='1' max={MAXNFTPERADDRESSLIMIT} name='txtNumber' id="txtNumber" readOnly   value={MAXNFTPERADDRESSLIMIT} /> */}
                  {/* onChange={(e) => setMintAmount(parseInt(e.target.value))} */}
                  {/* <div className="btn-theme-box">
                    <Button variant="theme" className="btn-no-line" onClick={ (e) => { document.getElementById('txtNumber').stepUp() ; setMintAmount(parseInt(document.getElementById('txtNumber').value)) ;} }>
                      <FontAwesomeIcon icon={faPlus} />
                    </Button>
                  </div>               */}
                </div>
                <div className="btn-theme-box">
                  <Button variant="theme" size="lg" onClick={onMintPressed}>
                    <span>MINT</span></Button>
                </div>
                </div>
              </div>
              <p id="status" className="text-center pt-2">{status}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
    <footer>
      <div className="bg-theme">
        <div className="container container-sm">
          <div className="row align-items-center">
            <div className="col-md-6">
              <p>© 2022, Dudelz</p>
            </div>
            <div className="col-md-6">
              <ul className="social-media-list">
                <li><a target={`_blank`} href="https://opensea.io/collection/dudelz-by-jojami"><img src={OpenSea} width='32px' height='32px' alt="logo"/></a></li>
                <li><a href="#"><img src={Discord} alt="logo"/></a></li>
                <li><a href="#"><img src={Twitter} alt="logo"/></a></li>
                <li><a href="#"><img src={Instagram} alt="logo"/></a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
    </div>
  );
};

export default MainPage;

