"use client";
import { useAppState, S, Bar } from "./components";
import { TOPICS } from "./data";
import { useRouter } from "next/navigation";

export default function Home() {
  const { progress, cookieConsent, handleCookieConsent, emailCapture, setEmailCapture, ref } = useAppState();
  const router = useRouter();

  return (<div style={S.app}><div style={S.hdr}><div><div style={{fontSize:16,fontWeight:700}}>TCCC / CLS / PFC Training</div><div style={{fontSize:10,color:"#666",marginTop:1,textTransform:"uppercase",letterSpacing:".04em"}}>Interactive Modules</div></div></div>
    <div ref={ref} style={S.body}>
      <div style={{padding:"16px 0 8px"}}><p style={{fontSize:12,color:"#666",lineHeight:1.6,margin:0}}>Free interactive training for combat medics, corpsmen, and CLS certified personnel. Study MARCH protocol, E-PAWS-B secondary survey, RAVINES prolonged field care, hemorrhage control, airway management, and walking blood bank procedures. Includes 74 quiz questions with clinical rationale, spaced repetition flashcards, 86 JTS CPG direct PDF links, 31 Deployed Medicine skill videos, Parkland burn calculator, GCS calculator, pediatric dosing, and the full Ranger Medic Handbook field reference..</p></div>
      {TOPICS.map(t=>{
        const sp = progress[`steps_${t.id}`]; const qp = progress[`quiz_${t.id}`]; const fp = progress[`flash_${t.id}`];
        const done = sp || qp || fp; const badges = [];
        if (sp) badges.push("Steps");
        if (qp) badges.push(`Quiz ${qp.score}%`);
        if (fp) badges.push("Cards");
        return (<div key={t.id} style={S.card} onMouseEnter={e=>{e.currentTarget.style.background="#ffffff0f";e.currentTarget.style.borderColor=`${t.color}30`}} onMouseLeave={e=>{e.currentTarget.style.background="#ffffff08";e.currentTarget.style.borderColor="#ffffff0f"}} onClick={()=>router.push(`/${t.id}`)}>
          <div style={{display:"flex",alignItems:"center",gap:11}}>
            <div style={{fontSize:22,width:40,height:40,display:"flex",alignItems:"center",justifyContent:"center",borderRadius:11,background:`${t.color}14`,position:"relative"}}>{t.icon}{done&&<div style={{position:"absolute",top:-2,right:-2,width:12,height:12,borderRadius:6,background:"#10b981",display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{color:"#fff",fontSize:8,fontWeight:700}}>✓</span></div>}</div>
            <div style={{flex:1}}><div style={{fontSize:14,fontWeight:600}}>{t.title}</div><div style={{fontSize:11,color:"#666",marginTop:2}}>{t.subtitle}</div>
              {badges.length > 0 && <div style={{display:"flex",gap:4,marginTop:4}}>{badges.map((b,bi)=>(<span key={bi} style={{fontSize:9,color:"#10b981",background:"#10b98114",padding:"1px 6px",borderRadius:4,fontWeight:600}}>{b}</span>))}</div>}
            </div>
            <span style={{color:"#444",fontSize:14}}>›</span>
          </div>
        </div>)})}
    </div>
    <Bar active="train" cookieConsent={cookieConsent} handleCookieConsent={handleCookieConsent} emailCapture={emailCapture} setEmailCapture={setEmailCapture}/>
  </div>);
}
