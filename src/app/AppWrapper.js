"use client";
import { useState, useEffect } from "react";
import { Analytics } from "@vercel/analytics/react";
import { S } from "./components";

export default function AppWrapper({ children }) {
  const [cookieConsent, setCookieConsent] = useState(null);
  const [emailCapture, setEmailCapture] = useState({ show: false, email: "", sent: false, dismissed: false });

  useEffect(() => {
    try {
      const s = localStorage.getItem("medeor_cookie_consent");
      if (s === "accepted") setCookieConsent(true);
      else if (s === "declined") setCookieConsent(false);
    } catch(e) {}
    try {
      const d = localStorage.getItem("medeor_email_dismissed");
      if (d) setEmailCapture(p => ({ ...p, dismissed: true }));
    } catch(e) {}
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);

  useEffect(() => {
    if (!emailCapture.dismissed) {
      const t = setTimeout(() => setEmailCapture(p => p.dismissed ? p : ({ ...p, show: true })), 60000);
      return () => clearTimeout(t);
    }
  }, [emailCapture.dismissed]);

  const handleCookieConsent = (accepted) => {
    setCookieConsent(accepted);
    try { localStorage.setItem("medeor_cookie_consent", accepted ? "accepted" : "declined"); } catch(e) {}
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("consent", "update", { analytics_storage: accepted ? "granted" : "denied" });
    }
  };

  return (
    <>
      {children}
      {cookieConsent === null && (
        <div style={{position:"fixed",bottom:68,left:"50%",transform:"translateX(-50%)",width:"calc(100% - 32px)",maxWidth:448,background:"#1a1a24",border:"1px solid #ffffff14",borderRadius:14,padding:"14px 16px",zIndex:50,boxShadow:"0 8px 32px rgba(0,0,0,.6)"}}>
          <div style={{fontSize:13,color:"#ccc",lineHeight:1.5,marginBottom:10}}>We use cookies for analytics to improve this training platform. No personal data is sold or shared with advertisers.</div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>handleCookieConsent(false)} style={{flex:1,padding:"9px 12px",background:"#ffffff08",border:"1px solid #ffffff14",borderRadius:9,color:"#888",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Decline</button>
            <button onClick={()=>handleCookieConsent(true)} style={{flex:1,padding:"9px 12px",background:"#8b5cf6",border:"1px solid #8b5cf6",borderRadius:9,color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Accept</button>
          </div>
        </div>
      )}
      {emailCapture.show && cookieConsent !== null && (
        <div style={{position:"fixed",bottom:68,left:"50%",transform:"translateX(-50%)",width:"calc(100% - 32px)",maxWidth:448,background:"#1a1a24",border:"1px solid #8b5cf625",borderRadius:14,padding:"14px 16px",zIndex:45,boxShadow:"0 8px 32px rgba(0,0,0,.6)"}}>
          <div style={{fontSize:13,fontWeight:600,color:"#ccc",marginBottom:4}}>Get CPG updates and new modules</div>
          <div style={{fontSize:11,color:"#888",marginBottom:10}}>No spam. Just new training content and guideline updates.</div>
          <div style={{display:"flex",gap:6}}>
            <input type="email" placeholder="your@email.com" value={emailCapture.email} onChange={e=>setEmailCapture(p=>({...p,email:e.target.value}))} style={{...S.input,flex:1,padding:"9px 12px",fontSize:12}}/>
            <button onClick={async()=>{
              if(!emailCapture.email.includes("@"))return;
              try{await fetch("https://formspree.io/f/xkoqyklw",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:emailCapture.email,type:"subscribe"})});}catch(e){}
              setEmailCapture({show:false,email:"",sent:true,dismissed:true});
              try{localStorage.setItem("medeor_email_dismissed","1")}catch(e){}
            }} style={{padding:"9px 14px",background:"#8b5cf6",border:"none",borderRadius:9,color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap"}}>Subscribe</button>
          </div>
          <button onClick={()=>{setEmailCapture(p=>({...p,show:false,dismissed:true}));try{localStorage.setItem("medeor_email_dismissed","1")}catch(e){}}} style={{background:"none",border:"none",color:"#555",fontSize:10,cursor:"pointer",fontFamily:"inherit",padding:"8px 0 0",width:"100%",textAlign:"center"}}>No thanks</button>
        </div>
      )}
      <Analytics/>
    </>
  );
}
