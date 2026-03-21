"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { Analytics } from "@vercel/analytics/react";
import { useRouter, usePathname } from "next/navigation";

export function useAppState() {
  const [fade, setFade] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [search, setSearch] = useState("");
  const [cookieConsent, setCookieConsent] = useState(null);
  const [progress, setProgress] = useState({});
  const [emailCapture, setEmailCapture] = useState({ show: false, email: "", sent: false });
  const [checkStates, setCheckStates] = useState({});
  const ref = useRef(null);
  const router = useRouter();
  const pathname = usePathname();

  const tr = useCallback(fn => { setFade(false); setTimeout(() => { fn(); setFade(true); }, 160); }, []);

  const saveProgress = useCallback((key, data) => {
    try {
      const p = JSON.parse(localStorage.getItem("medeor_progress") || "{}");
      p[key] = { ...data, ts: Date.now() };
      localStorage.setItem("medeor_progress", JSON.stringify(p));
      setProgress(p);
    } catch(e) {}
  }, []);

  const handleCookieConsent = (accepted) => {
    setCookieConsent(accepted);
    try { localStorage.setItem("medeor_cookie_consent", accepted ? "accepted" : "declined"); } catch(e) {}
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("consent", "update", { analytics_storage: accepted ? "granted" : "denied" });
    }
  };

  useEffect(() => { ref.current && (ref.current.scrollTop = 0); }, [pathname]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("medeor_cookie_consent");
      if (stored === "accepted") setCookieConsent(true);
      else if (stored === "declined") setCookieConsent(false);
    } catch(e) {}
    try {
      const p = JSON.parse(localStorage.getItem("medeor_progress") || "{}");
      setProgress(p);
    } catch(e) {}
    try {
      const dismissed = localStorage.getItem("medeor_email_dismissed");
      if (!dismissed) setTimeout(() => setEmailCapture(p => ({ ...p, show: true })), 60000);
    } catch(e) {}
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);

  return { fade, setFade, expanded, setExpanded, search, setSearch, cookieConsent, setCookieConsent, progress, setProgress, emailCapture, setEmailCapture, checkStates, setCheckStates, ref, router, pathname, tr, saveProgress, handleCookieConsent };
}

export const S = {
  app: { fontFamily: "'DM Sans',system-ui,sans-serif", background: "#0a0a0f", color: "#e8e8ed", height: "100vh", display: "flex", flexDirection: "column", maxWidth: 480, margin: "0 auto", overflow: "hidden" },
  hdr: { padding: "12px 16px", display: "flex", alignItems: "center", gap: 10, borderBottom: "1px solid #ffffff0f", background: "rgba(10,10,15,.97)", backdropFilter: "blur(20px)", position: "sticky", top: 0, zIndex: 10 },
  back: { background: "#ffffff0f", border: "none", color: "#888", fontSize: 16, width: 32, height: 32, borderRadius: 9, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" },
  body: { flex: 1, padding: "0 16px 130px", overflowY: "auto", transition: "all .18s ease" },
  card: { background: "#ffffff08", border: "1px solid #ffffff0f", borderRadius: 13, padding: 14, cursor: "pointer", transition: "all .2s", marginBottom: 8 },
  btn: (c, f) => ({ background: f ? c : "transparent", border: `1.5px solid ${c}50`, color: f ? "#fff" : c, padding: "12px 18px", borderRadius: 11, fontSize: 14, fontWeight: 600, cursor: "pointer", width: "100%", fontFamily: "inherit" }),
  opt: (sel, ok, rev) => {
    let bg = "#ffffff08", bd = "#ffffff14", cl = "#e8e8ed";
    if (rev && ok) { bg = "#10b98120"; bd = "#10b981"; cl = "#10b981"; }
    else if (rev && sel && !ok) { bg = "#ef444420"; bd = "#ef4444"; cl = "#ef4444"; }
    else if (sel && !rev) { bg = "#6366f120"; bd = "#6366f1"; cl = "#c7c8ff"; }
    return { background: bg, border: `1.5px solid ${bd}`, color: cl, padding: "12px 13px", borderRadius: 10, fontSize: 13, cursor: rev ? "default" : "pointer", width: "100%", textAlign: "left", fontFamily: "inherit", lineHeight: 1.5 };
  },
  tabBtn: a => ({ flex: 1, padding: "10px 0 8px", background: "none", border: "none", color: a ? "#8b5cf6" : "#555", fontSize: 10, fontWeight: 600, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 2, fontFamily: "inherit" }),
  input: { width: "100%", padding: "10px 14px", background: "#ffffff08", border: "1px solid #ffffff14", borderRadius: 11, color: "#e8e8ed", fontSize: 13, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }
};

export function Prog({ c, t }) {
  return <div style={{width:"100%",height:3,background:"#ffffff14",borderRadius:2,overflow:"hidden"}}><div style={{width:`${(c/t)*100}%`,height:"100%",background:"linear-gradient(90deg,#6366f1,#8b5cf6)",borderRadius:2,transition:"width .4s ease"}}/></div>;
}

export function Bar({ active, cookieConsent, handleCookieConsent, emailCapture, setEmailCapture }) {
  const router = useRouter();
  const tabs = [
    ["train", "/", "🎯", "Train"],
    ["cpg", "/cpgs", "📋", "CPGs"],
    ["videos", "/videos", "🎬", "Videos"],
    ["rmh", "/rmh", "📕", "RMH"],
    ["grades", "/table8", "Ⅷ", "Table 8"],
    ["tools", "/tools", "🔧", "Tools"]
  ];

  const CookieBanner = () => cookieConsent === null ? (
    <div style={{position:"fixed",bottom:90,left:"50%",transform:"translateX(-50%)",width:"calc(100% - 32px)",maxWidth:448,background:"#1a1a24",border:"1px solid #ffffff14",borderRadius:14,padding:"14px 16px",zIndex:50,boxShadow:"0 8px 32px rgba(0,0,0,.6)"}}>
      <div style={{fontSize:13,color:"#ccc",lineHeight:1.5,marginBottom:10}}>We use cookies for analytics to improve this training platform. No personal data is sold or shared with advertisers.</div>
      <div style={{display:"flex",gap:8}}>
        <button onClick={()=>handleCookieConsent(false)} style={{flex:1,padding:"9px 12px",background:"#ffffff08",border:"1px solid #ffffff14",borderRadius:9,color:"#888",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Decline</button>
        <button onClick={()=>handleCookieConsent(true)} style={{flex:1,padding:"9px 12px",background:"#8b5cf6",border:"1px solid #8b5cf6",borderRadius:9,color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Accept</button>
      </div>
    </div>
  ) : null;

  const EmailPopup = () => (emailCapture.show && cookieConsent !== null) ? (
    <div style={{position:"fixed",bottom:90,left:"50%",transform:"translateX(-50%)",width:"calc(100% - 32px)",maxWidth:448,background:"#1a1a24",border:"1px solid #8b5cf625",borderRadius:14,padding:"14px 16px",zIndex:45,boxShadow:"0 8px 32px rgba(0,0,0,.6)"}}>
      {emailCapture.sent ? (
        <div style={{textAlign:"center",padding:"8px 0"}}><div style={{fontSize:14,fontWeight:600,color:"#10b981"}}>You're in.</div><div style={{fontSize:12,color:"#888",marginTop:4}}>We'll notify you when new content drops.</div></div>
      ) : (<>
        <div style={{fontSize:13,fontWeight:600,color:"#ccc",marginBottom:4}}>Get CPG updates and new modules</div>
        <div style={{fontSize:11,color:"#888",marginBottom:10}}>No spam. Just new training content and guideline updates.</div>
        <div style={{display:"flex",gap:6}}>
          <input type="email" placeholder="your@email.com" value={emailCapture.email} onChange={e=>setEmailCapture(p=>({...p,email:e.target.value}))} style={{...S.input,flex:1,padding:"9px 12px",fontSize:12}}/>
          <button onClick={async()=>{
            if(!emailCapture.email.includes("@"))return;
            try{await fetch("https://formspree.io/f/xkoqyklw",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:emailCapture.email,type:"subscribe"})});}catch(e){}
            setEmailCapture({show:true,email:"",sent:true});
            setTimeout(()=>setEmailCapture(p=>({...p,show:false})),2000);
          }} style={{padding:"9px 14px",background:"#8b5cf6",border:"none",borderRadius:9,color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap"}}>Subscribe</button>
        </div>
        <button onClick={()=>{setEmailCapture(p=>({...p,show:false}));try{localStorage.setItem("medeor_email_dismissed","1")}catch(e){}}} style={{background:"none",border:"none",color:"#555",fontSize:10,cursor:"pointer",fontFamily:"inherit",padding:"8px 0 0",width:"100%",textAlign:"center"}}>No thanks</button>
      </>)}
    </div>
  ) : null;

  return (
    <>
    <CookieBanner/>
    <EmailPopup/>
    <Analytics/>
    <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,zIndex:20}}>
      <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:0,padding:"6px 0",background:"rgba(10,10,15,.95)",borderTop:"1px solid #ffffff08",flexWrap:"wrap"}}>
        <button onClick={()=>router.push("/contact")} style={{background:"none",border:"none",color:"#555",fontSize:10,cursor:"pointer",fontFamily:"inherit",padding:"2px 6px"}}>Feedback</button>
        <span style={{color:"#ffffff10",fontSize:10}}>·</span>
        <button onClick={()=>router.push("/privacy")} style={{background:"none",border:"none",color:"#555",fontSize:10,cursor:"pointer",fontFamily:"inherit",padding:"2px 6px"}}>Privacy</button>
        <span style={{color:"#ffffff10",fontSize:10}}>·</span>
        <button onClick={()=>router.push("/terms")} style={{background:"none",border:"none",color:"#555",fontSize:10,cursor:"pointer",fontFamily:"inherit",padding:"2px 6px"}}>Terms</button>
        <span style={{color:"#ffffff10",fontSize:10}}>·</span>
        <span style={{fontSize:10,color:"#333",padding:"2px 6px"}}>medeor.app</span>
      </div>
      <div style={{display:"flex",background:"rgba(10,10,15,.97)",borderTop:"1px solid #ffffff0f"}}>
        {tabs.map(([k,path,ic,lb]) => (
          <button key={k} style={S.tabBtn(active===k)} onClick={() => router.push(path)}><span style={{fontSize:14}}>{ic}</span>{lb}</button>
        ))}
      </div>
    </div>
    </>
  );
}
