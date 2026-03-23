"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppState, S, Bar } from "../components";

export default function ContactClient() {
  const router = useRouter();
  const { cookieConsent, handleCookieConsent, emailCapture, setEmailCapture, ref } = useAppState();
  const [form, setForm] = useState({ name: "", email: "", type: "feedback", msg: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = async () => {
    if (!form.msg.trim()) return;
    try {
      await fetch("https://formspree.io/f/xkoqyklw", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, type: form.type, message: form.msg })
      });
    } catch(e) {}
    setSent(true);
  };

  return (<div style={S.app}><div style={S.hdr}><button style={S.back} onClick={()=>router.back()}>←</button><div style={{fontSize:15,fontWeight:700}}>Contact & Feedback</div></div>
    <div ref={ref} style={{...S.body,padding:"0 16px 40px"}}>
      {sent ? (
        <div style={{textAlign:"center",padding:"60px 0"}}>
          <div style={{fontSize:36,marginBottom:12}}>✓</div>
          <div style={{fontSize:18,fontWeight:700,marginBottom:8}}>Thanks for the feedback</div>
          <div style={{fontSize:13,color:"#888",marginBottom:24,lineHeight:1.6}}>Your message has been sent. We appreciate you helping us improve Medeor.</div>
          <button style={S.btn("#8b5cf6",true)} onClick={()=>router.push("/")}>Back to App</button>
        </div>
      ) : (
        <div style={{padding:"20px 0"}}>
          <p style={{fontSize:13,color:"#888",lineHeight:1.6,margin:"0 0 20px"}}>Found an error in the medical content? Have a feature request? Want to contribute? Let us know.</p>
          <div style={{marginBottom:14}}>
            <label style={{fontSize:11,color:"#666",display:"block",marginBottom:4,textTransform:"uppercase",letterSpacing:".04em"}}>Name (optional)</label>
            <input style={S.input} placeholder="Your name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
          </div>
          <div style={{marginBottom:14}}>
            <label style={{fontSize:11,color:"#666",display:"block",marginBottom:4,textTransform:"uppercase",letterSpacing:".04em"}}>Email (optional)</label>
            <input style={S.input} type="email" placeholder="your@email.com" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/>
          </div>
          <div style={{marginBottom:14}}>
            <label style={{fontSize:11,color:"#666",display:"block",marginBottom:4,textTransform:"uppercase",letterSpacing:".04em"}}>Type</label>
            <div style={{display:"flex",gap:6}}>
              {[["feedback","Feedback"],["bug","Bug Report"],["content","Content Error"],["feature","Feature Request"]].map(([v,l])=>(
                <button key={v} onClick={()=>setForm({...form,type:v})} style={{flex:1,background:form.type===v?"#8b5cf620":"#ffffff08",border:`1px solid ${form.type===v?"#8b5cf6":"#ffffff14"}`,borderRadius:8,padding:"8px 4px",color:form.type===v?"#c7c8ff":"#888",fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>{l}</button>
              ))}
            </div>
          </div>
          <div style={{marginBottom:20}}>
            <label style={{fontSize:11,color:"#666",display:"block",marginBottom:4,textTransform:"uppercase",letterSpacing:".04em"}}>Message *</label>
            <textarea style={{...S.input,minHeight:120,resize:"vertical"}} placeholder="Your feedback, bug report, or suggestion..." value={form.msg} onChange={e=>setForm({...form,msg:e.target.value})}/>
          </div>
          <button style={{...S.btn("#8b5cf6",true),opacity:form.msg.trim()?1:.4}} onClick={handleSubmit} disabled={!form.msg.trim()}>Send Feedback</button>
          <p style={{fontSize:10,color:"#444",textAlign:"center",marginTop:12}}>Your feedback helps improve training content for medics and first responders.</p>
        </div>
      )}
    </div>
    <Bar active="" cookieConsent={cookieConsent} handleCookieConsent={handleCookieConsent} emailCapture={emailCapture} setEmailCapture={setEmailCapture}/>
  </div>);
}
