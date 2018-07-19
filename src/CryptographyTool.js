import React from 'react';
import { encrypt, decrypt } from './bitcoin-encrypt';
import Button from '@material-ui/core/Button';
import Textarea from 'react-expanding-textarea';
import { Checkbox } from '@trendmicro/react-checkbox';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import ToggleButton from 'react-toggle-button'
import '@trendmicro/react-checkbox/dist/react-checkbox.css';
import 'react-tabs/style/react-tabs.css';
import './CryptographyTool.css';
const base91 = require('./node-base91');
var RIPEMD160 = require('ripemd160');
var egSPublicKey = "03C1093EBBDF3ED1BE87BC8D723191CC0633406181B78A62229F79CCCB8722BD41";
var egRPublicKey = "030AA82DAB26EAB8069FE069C1FBB3AA6350640118B4FDF107AFBB19E183009DBB";
var egSPrivateKey = "7BBC52B8945AA22779E37937D909CCA744E92310A89DD9A531D06ABD8E3A0B97";
var egRPrivateKey = "5E551F6B2F81F7CB14795B9F1CBA6496F18BBD9F676820FFFB11423FE2F54780";
const borderRadiusStyle = { borderRadius:2 }

export class CryptographyTool extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sPublicKey: '',
      sPrivateKey: '',
      rPublicKey: '',
      rPrivateKey: '',
      messageToEncrypt: '',
      encryptedMessage: '',
      encryptedMessageDigest: '',
      messageToDecrypt: '',
      messageToDecryptDigest: '',
      decryptedMessage: '',
      decryptedMessageHex: '',
      encryptedMessageCharCount:0,
      hexBoxChecked:false,
      copied:false,
      keyError0:'',
      keyError1:'',
      keyError2:'',
      keyError3:'',
      infoToggled:false
    };
    this.handleChangeRecipientsPublicKey = this.handleChangeRecipientsPublicKey.bind(this);
    this.handleChangeRecipientsPrivateKey = this.handleChangeRecipientsPrivateKey.bind(this);
    this.handleChangeSendersPrivateKey = this.handleChangeSendersPrivateKey.bind(this);
    this.handleChangeSendersPublicKey = this.handleChangeSendersPublicKey.bind(this);
    this.handleChangeMessageToEncrypt = this.handleChangeMessageToEncrypt.bind(this);
    this.handleChangeMessageToDecrypt = this.handleChangeMessageToDecrypt.bind(this);
    this.handleSubmitEncrypt = this.handleSubmitEncrypt.bind(this);
    this.handleSubmitDecrypt = this.handleSubmitDecrypt.bind(this);
    this.updateCharCount = this.updateCharCount.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleChangeHexBox = this.handleChangeHexBox.bind(this);
    this.copyEncryptedMessage = this.copyEncryptedMessage.bind(this);
    this.onBlurKey = this.onBlurKey.bind(this);
  }
  handleChangeMessageToEncrypt(event) {
    this.setState({ messageToEncrypt: event.target.value });
  }
  handleChangeMessageToDecrypt(event) {
    this.setState({ messageToDecrypt: event.target.value }, () => {
      this.updateMessageToDecryptDigest();
    });
  }
  handleChangeRecipientsPublicKey(event) {
    var trimmed = event.target.value.toString().trim();
    this.setState({ rPublicKey:trimmed },);
  }
  handleChangeSendersPublicKey(event) {
    var trimmed = event.target.value.toString().trim();
    this.setState({ sPublicKey: trimmed });
  }
  handleChangeSendersPrivateKey(event) {
    var trimmed = event.target.value.toString().trim();
    this.setState({ sPrivateKey: trimmed});
  }
  handleChangeRecipientsPrivateKey(event) {
    var trimmed = event.target.value.toString().trim();
    this.setState({ rPrivateKey: trimmed });
  }
  updateMessageToDecryptDigest() {
    var digest = new RIPEMD160().update(this.state.messageToDecrypt).digest('hex');
    this.setState({ messageToDecryptDigest: digest });
  }
  updateCharCount() {
    var count = this.state.encryptedMessage.length;
    this.setState({ encryptedMessageCharCount: count },()=>{
      this.scrollToBottom();
    });
  }
  handleSubmitEncrypt(event) {
    if (this.state.keyError0 == '' && this.state.keyError1 == '' && this.state.rPublicKey!='' && this.state.sPrivateKey!='') {
      var fullMessage = this.state.messageToEncrypt;
      var encrypted = encrypt(this.state.rPublicKey, this.state.sPrivateKey, fullMessage);
      var b91encoded = base91.encode(encrypted);
      this.setState({ encryptedMessage: b91encoded }, () => {
        this.updateEncryptedMessageDigest();
      });
    }
    event.preventDefault();
  }
  updateEncryptedMessageDigest() {
    var digest = new RIPEMD160().update(this.state.encryptedMessage).digest('hex');
    this.setState({ encryptedMessageDigest: digest }, () => {
      this.updateCharCount();
  });
  }
  handleSubmitDecrypt(event) {
    if (this.state.keyError2 == '' && this.state.keyError3 == '' && this.state.sPublicKey!='' && this.state.rPrivateKey!='') {
      var fullMessage = this.state.messageToDecrypt;
      var b91decoded = base91.decode(fullMessage, 'utf8');
      try {
        var decrypted = decrypt(this.state.sPublicKey, this.state.rPrivateKey, b91decoded);
        this.setState({ decryptedMessage: decrypted, decryptedMessageHex: this.toHexString(decrypted) },()=>{
          this.scrollToBottom();
        });
    }
    catch(err) {
        alert("Decryption ERROR"+'\n'+"Ciphertext IV corrupted :/");
        this.setState({ decryptedMessage: "", decryptedMessageHex: ""});
    }
    }
    event.preventDefault();
  }
  handleFocus(event) {
    event.target.select();
}
handleChangeChk(index) {
  if(index==0&&this.state.rPublicKey==''){this.setState({rPublicKey:egRPublicKey});this.keyInput0.focus();}
  if(index==1&&this.state.sPrivateKey==''){this.setState({sPrivateKey:egSPrivateKey});this.keyInput1.focus();}
  if(index==2&&this.state.sPublicKey==''){this.setState({sPublicKey:egSPublicKey});this.keyInput2.focus();}
  if(index==3&&this.state.rPrivateKey==''){this.setState({rPrivateKey:egRPrivateKey});this.keyInput3.focus();}
}
handleChangeHexBox() {
  if(this.state.decryptedMessageHex!=''){
    this.setState({hexBoxChecked: !this.state.hexBoxChecked});
  }
}
copyEncryptedMessage(event){
  this.setState({copied:true});
}
isHexadecimal(str) {
  var re = new RegExp('^[A-Fa-f0-9]+$');
  if(re.test(str))
    return true
  else return false;
}
onBlurKey(index, keyLength){
  var errorMsg = '';
  var keyToTest = '';
  switch(index){
    case 0:keyToTest = this.state.rPublicKey;break;
    case 1:keyToTest = this.state.sPrivateKey;break;
    case 2:keyToTest = this.state.sPublicKey;break;
    case 3:keyToTest = this.state.rPrivateKey;break;
  }
  if (!this.isHexadecimal(keyToTest))
    errorMsg = 'Key should be hexadecimal characters only';
  else if(keyToTest.length!=keyLength)
    errorMsg+='Key should be '+keyLength+' characters';
  switch(index){
    case 0:this.setState({keyError0:errorMsg});break;
    case 1:this.setState({keyError1:errorMsg});break;
    case 2:this.setState({keyError2:errorMsg});break;
    case 3:this.setState({keyError3:errorMsg});break;
  }
}
scrollToBottom() {
  console.log("Scrolling");
  this.bottomOfPage.scrollIntoView({ behavior: 'smooth' });
}
  render() {
    return (
      <div className="inner">
      <hr/>
      <div className="wrapper" style={{textAlign:"left", marginBottom:"8px"}}>
            <div id="leftDiv"><label >Info:</label>
            <div id="rightDiv" style={{marginLeft:"20px"}}>
      <ToggleButton
        value={ this.state.infoToggled || false }
        thumbStyle={borderRadiusStyle}
        trackStyle={borderRadiusStyle}
        style={{clear:"both"}}
        onToggle={(value) => {
          this.setState({
            infoToggled: !value,
          })
        }}> </ToggleButton></div>
        </div></div>
      <div className="infoBox" style={{display: this.state.infoToggled!='' ? 'block' : 'none' }}>
          
      <div className="info">
      <p>This is simple 256-bit symmetric key AES encryption tool utilising <a href="https://www.npmjs.com/package/bitcoin-encrypt"target="_blank">bitcoin-encrypt's</a> Elliptic Curve shared secret cryptography for <a href="https://www.memo.cash"target="_blank">memo.cash</a> messaging. (Credit:<a href="https://memo.cash/profile/13mhMRukDWBMve3dqZiD2dPeQ1c2rfTEze"target="_blank">kevinejohn</a>)</p>
      <p>You should save the webpage (or checkout the code <a href="https://github.com/freddiehonohan/memcrypt.cash"target="_blank">here</a>) and encrypt/decrypt offline with a private key that is stored safely.</p>
      </div>
      </div>
        <Tabs defaultIndex={0} onSelect={tabIndex => this.setState({ tabIndex })}>
    <TabList style={{fontSize:"20px"}}>
      <Tab>Encrypt</Tab>
      <Tab>Decrypt</Tab>
      <Tab disabled>Bulk Ops</Tab>
    </TabList>
    <TabPanel>
          <section>
          <label className="sectionTitle">
        Encryption
        </label>
        <hr/>
          <div className="leftLabel">
            <label>
              Message to Encrypt:
            </label>
          </div>
          <Textarea className="resizableInput"
              rows="1"
              maxLength="524288"
              value={this.state.messageToEncrypt}
              onChange={ this.handleChangeMessageToEncrypt } />
              <br/>
              <br/>
          <div className="leftLabel">
            <label>
              Send to Public-Key:
            </label>
          </div>
            <input className="keyValueInput"
              type="text"
              value={this.state.rPublicKey} 
              onChange={this.handleChangeRecipientsPublicKey}
              ref={(input) => { this.keyInput0=input;}} 
              onBlur={(event) => {this.onBlurKey(0,66);
                event.stopPropagation();
            }}/>
            {this.state.keyError0 != '' ? <div className="keyError">{this.state.keyError0}</div> : ''}
              
<div className="tooltip">
            <label className="exampleKey">
              e.g. <u>{egRPublicKey}</u>
          <Checkbox onChange={(event) => {
                    this.handleChangeChk(0);
                    event.stopPropagation();
                }}
                style={{display:"none"}}/>
          </label>
  <span className="tooltiptext">Use example key</span>
          </div>
          <div className="leftLabel">
            <label>
              Send from Private-Key:
          </label>
          </div>
          
          <input className="keyValueInput"
              type="password"
              value={this.state.sPrivateKey} 
              onChange={this.handleChangeSendersPrivateKey} 
              ref={(input) => { this.keyInput1=input;}} 
              onBlur={(event) => {this.onBlurKey(1,64);
                event.stopPropagation();
            }}/>
            {this.state.keyError1 != '' ? <div className="keyError">{this.state.keyError1}</div> : ''}
<div className="tooltip">
            <label className="exampleKey">
              e.g. <u>{egSPrivateKey}</u>
          <Checkbox onChange={(event) => {
                    this.handleChangeChk(1);
                    event.stopPropagation();
                }}
                style={{display:"none"}}/>
          </label>
  <span className="tooltiptext">Use example key</span>
          </div>
          <div className="buttonContainer">
            <Button  variant="contained" color="secondary" className="Button" style={{fontWeight:"bold",fontStyle:"italic"}}  onClick={this.handleSubmitEncrypt}>Encrypt</Button>
          </div>
        <br/>
          <div style={{display: this.state.encryptedMessage!='' ? 'block' : 'none' }}>
          <div style={{clear: "both",overflow:"auto"}}> 
          <CopyToClipboard text={this.state.encryptedMessage} onCopy={this.copyEncryptedMessage}>
          <button className="copyButton"><img src="./copy-icon-white.png" style={{width:"30px",height:"36px"}}/></button>
        </CopyToClipboard>
        <label className="leftLabel"> 
          </label>  
            <label className="leftLabel">
            &nbsp;
          </label>     
            <label style={{display:"hidden"}}className="leftLabel">
              Encrypted Message:
          </label>     
          </div>
          <Textarea className="resizableOutput" onFocus={this.handleFocus} 
              rows="1"
              maxLength="1048576"
              value={this.state.encryptedMessage}
              readOnly/>
          <div id="wrapper">
            <div id="leftDiv">
            <label className="leftLabelSmall"> RipeMD160:</label><label className="updateabelLabel">{this.state.encryptedMessageDigest}</label>
            </div>
            <div id="rightDiv">
            <label className="leftLabelSmall"> Characters:</label><label className="updateabelLabel">{this.state.encryptedMessageCharCount}</label>
            </div>
          </div>
          {this.state.encryptedMessageCharCount > 217 ? <div className="keyError">This message is too long to be sent on memo as it is longer than 217 characters. However, if it is close, try encrypt again as the random IV can induce a shorter message length.
          <br/>
          <br/>
          <div style={{color:"white",fontWeight:"normal"}}>
          You should post this <u>encrypted message</u> online* and then combine that link with <u>this</u> encrypted message's RipeMD160 identifier shown above (e.g. "paste.site/linkurl {this.state.encryptedMessageDigest}") then encrypt <u>that</u> message and post it on memo.
          <br/>          <br/>
          * e.g. <a href="https://pastebin.com"target="_blank">Pastebin</a>
          , <a href="https://hastebin.com"target="_blank">Hastebin</a>
          , <a href="https://ghostbin.com"target="_blank">Ghostbin</a>
          , <a href="https://paste.city"target="_blank">Paste.city</a>
          , <a href="https://paste.ee"target="_blank">Paste.ee</a>
          , <a href="https://0bin.net"target="_blank">0bin</a>
          , <a href="https://privatebin.net"target="_blank">Privatebin</a></div>
          </div> : ''}
          </div>
          </section>
    </TabPanel>
    <TabPanel>
          <section>
          <label className="sectionTitle">
        Decryption
        </label>
        <hr/>
        <div className="leftLabel">
        <label>
              Message to Decrypt:
              </label>
          </div>
              <Textarea className="resizableInput"
              rows="1"
              maxLength="1048576"
              value={this.state.messageToDecrypt}
              onChange={ this.handleChangeMessageToDecrypt } />
              
          <div style={{display: this.state.messageToDecryptDigest!='' ? 'block' : 'none' }}>
              <label className="leftLabelSmall">
                RipeMD160:
          </label>
            <label className="updateabelLabel">{this.state.messageToDecryptDigest}</label>
            </div>
            <br/>
              <br/>
            <div>
            <div className="leftLabel">
              <label>
                Sender's Public-Key:
          </label>
          </div>
          <input  className="keyValueInput"
              type="text"
              value={this.state.sPublicKey} 
              onChange={this.handleChangeSendersPublicKey}
              ref={(input) => { this.keyInput2=input;}} 
              onBlur={(event) => {this.onBlurKey(2,66);
                event.stopPropagation();
            }}/>
            {this.state.keyError2 != '' ? <div className="keyError">{this.state.keyError2}</div> : ''}
<div className="tooltip">
                <label className="exampleKey">
              e.g. <u>{egSPublicKey}</u>
          <Checkbox onChange={(event) => {
                    this.handleChangeChk(2);
                    event.stopPropagation();
                }}
                style={{display:"none"}}/>
        </label>
  <span className="tooltiptext">Use example key</span>
        </div>
            <div className="leftLabel">
            <label>
              Receiver's Private-Key:
          </label>
              </div>
          <input  className="keyValueInput"
              type="password"
              value={this.state.rPrivateKey} 
              onChange={this.handleChangeRecipientsPrivateKey}
              ref={(input) => { this.keyInput3=input;}} 
              onBlur={(event) => {this.onBlurKey(3,64);
                event.stopPropagation();
            }}/>
            {this.state.keyError3 != '' ? <div className="keyError">{this.state.keyError3}</div> : ''}
<div className="tooltip">
              <label className="exampleKey">
              e.g. <u>{egRPrivateKey}</u>
          <Checkbox onChange={(event) => {
                    this.handleChangeChk(3);
                    event.stopPropagation();
                }}
                style={{display:"none"}}/>
        </label>
  <span className="tooltiptext">Use example key</span>
              </div>
              </div>
          <div className="buttonContainer">
            <Button  variant="contained" color="secondary" className="Button" style={{fontWeight:"bold",fontStyle:"italic"}} onClick={this.handleSubmitDecrypt}>Decrypt</Button>
          </div>
          <div style={{display: this.state.decryptedMessage!='' ? 'block' : 'none' }}>
          <div className="leftLabel">
            <label>
              Decrypted Message:
          </label>
          </div>
          <Textarea className="resizableOutput" onFocus={this.handleFocus} 
              rows="1"
              maxLength="524288"
              value={this.state.decryptedMessage}
              readOnly/>
      </div>
      </section>
    </TabPanel>
  </Tabs>
  <div ref={el => { this.bottomOfPage = el; }} />
      </div>
    );
  }
  toHexString(str, hex) {
    try {
      hex = unescape(encodeURIComponent(str))
        .split('').map(function (v) {
          return v.charCodeAt(0).toString(16)
        }).join('')
    }
    catch (e) {
      hex = str
      console.log('invalid text input: ' + str)
    }
    return hex
  }
  fromHex(hex, str) {
    try {
      str = decodeURIComponent(hex.replace(/(..)/g, '%$1'))
    }
    catch (e) {
      str = hex
      console.log('invalid hex input: ' + hex)
    }
    return str
  }
}
