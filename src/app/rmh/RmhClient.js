"use client";
import { useState } from "react";
import { useAppState, S, Bar } from "../components";
import { RMH } from "../data";

export default function RmhClient() {
  const { expanded, setExpanded, search, setSearch, cookieConsent, handleCookieConsent, emailCapture, setEmailCapture, ref } = useAppState();
  const [rmhTopic, setRmhTopic] = useState(null);

  if (rmhTopic) {
    const t = rmhTopic;
    const sentences = t.content.split('. ').reduce((acc, s) => {
      if (!acc.length) acc.push(s);
      else if (acc[acc.length-1].length < 120) acc[acc.length-1] += '. ' + s;
      else acc.push(s);
      return acc;
    }, []);
    return (<div style={S.app}><div style={S.hdr}><button style={S.back} onClick={()=>setRmhTopic(null)}>←</button><div style={{flex:1,minWidth:0}}><div style={{fontSize:14,fontWeight:700,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{t.title}</div></div></div>
      <div ref={ref} style={S.body}><div style={{padding:"20px 0 10px"}}>
        {t.keyPoints && t.keyPoints.length > 0 && (
          <div style={{background:"#8b5cf60a",border:"1px solid #8b5cf625",borderRadius:13,padding:14,marginBottom:18}}>
            <div style={{fontSize:10,fontWeight:700,color:"#8b5cf6",textTransform:"uppercase",letterSpacing:".07em",marginBottom:10}}>Quick Reference</div>
            {t.keyPoints.map((kp,ki)=>(
              <div key={ki} style={{display:"flex",gap:8,marginBottom:6,alignItems:"flex-start"}}>
                <div style={{fontSize:11,color:"#8b5cf6",fontWeight:700,marginTop:1,flexShrink:0}}>{'>'}</div>
                <div style={{fontSize:13,color:"#ccc",lineHeight:1.5,fontWeight:500}}>{kp}</div>
              </div>
            ))}
          </div>
        )}
        <div style={{fontSize:10,fontWeight:700,color:"#666",textTransform:"uppercase",letterSpacing:".07em",marginBottom:10}}>Detail</div>
        {sentences.map((p,pi)=>(
          <p key={pi} style={{fontSize:13,color:"#aaa",lineHeight:1.8,margin:"0 0 12px"}}>{p}{p.endsWith('.')?'':'.'}</p>
        ))}
      </div></div>
      <Bar active="rmh" cookieConsent={cookieConsent} handleCookieConsent={handleCookieConsent} emailCapture={emailCapture} setEmailCapture={setEmailCapture}/>
    </div>);
  }

  const f = search ? RMH.map(s=>({...s,topics:s.topics.filter(t=>t.title.toLowerCase().includes(search.toLowerCase())||t.content.toLowerCase().includes(search.toLowerCase()))})).filter(s=>s.topics.length) : RMH;
  return (<div style={S.app}><div style={S.hdr}><div><div style={{fontSize:16,fontWeight:700}}>Ranger Medic Handbook</div><div style={{fontSize:10,color:"#666",marginTop:1,textTransform:"uppercase",letterSpacing:".04em"}}>75th Ranger Regiment</div></div></div>
    <div ref={ref} style={S.body}>
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search handbook..." style={{...S.input,marginTop:14,marginBottom:12}}/>
      <a href="https://jsomonline.org/product/2025-ranger-medic-handbook/" target="_blank" rel="noopener noreferrer" style={{display:"block",textDecoration:"none",marginBottom:14}}><div style={{background:"#ef444414",border:"1px solid #ef444430",borderRadius:12,padding:14}}><div style={{fontSize:13,fontWeight:600,color:"#ef4444"}}>2025 Ranger Medic Handbook ↗</div><div style={{fontSize:11,color:"#777",marginTop:3}}>Latest edition via JSOM</div></div></a>
      {f.map((sec,si)=>(
        <div key={si} style={{marginBottom:8}}>
          <button onClick={()=>setExpanded(expanded===si?null:si)} style={{width:"100%",textAlign:"left",background:expanded===si?`${sec.color}0a`:"#ffffff05",border:`1px solid ${expanded===si?`${sec.color}30`:"#ffffff0f"}`,borderRadius:11,padding:"12px 14px",cursor:"pointer",fontFamily:"inherit",color:"#e8e8ed",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div><div style={{fontSize:14,fontWeight:600}}>{sec.section}</div><div style={{fontSize:11,color:"#555",marginTop:2}}>{sec.topics.length} topics</div></div>
            <span style={{color:sec.color,fontSize:14,transform:expanded===si?"rotate(90deg)":"none",transition:"transform .2s"}}>{'>'}</span>
          </button>
          {expanded===si && <div style={{paddingLeft:6,paddingTop:4}}>{sec.topics.map((t,ti)=>(<div key={ti} style={{background:"#ffffff05",border:"1px solid #ffffff0a",borderRadius:9,padding:"10px 12px",marginBottom:4,cursor:"pointer"}} onClick={()=>setRmhTopic(t)}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div style={{fontSize:13,fontWeight:600,color:"#ccc"}}>{t.title}</div><span style={{fontSize:12,color:sec.color}}>{'>'}</span></div>
            <div style={{fontSize:11,color:"#666",marginTop:3,lineHeight:1.4,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{t.content}</div>
          </div>))}</div>}
        </div>
      ))}
    </div>
    <Bar active="rmh" cookieConsent={cookieConsent} handleCookieConsent={handleCookieConsent} emailCapture={emailCapture} setEmailCapture={setEmailCapture}/>
  </div>);
}
