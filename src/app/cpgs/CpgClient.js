"use client";
import { useAppState, S, Bar } from "../components";
import { CPGS } from "../data";

export default function CpgClient() {
  const { expanded, setExpanded, search, setSearch, cookieConsent, handleCookieConsent, emailCapture, setEmailCapture, ref } = useAppState();
  const f = search ? CPGS.map(c => ({...c, items: c.items.filter(x => x.title.toLowerCase().includes(search.toLowerCase()))})).filter(c => c.items.length) : CPGS;
  return (<div style={S.app}><div style={S.hdr}><div><div style={{fontSize:16,fontWeight:700}}>Clinical Practice Guidelines</div><div style={{fontSize:10,color:"#666",marginTop:1,textTransform:"uppercase",letterSpacing:".04em"}}>JTS / CoTCCC</div></div></div>
    <div ref={ref} style={S.body}>
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search CPGs..." style={{...S.input,marginTop:14,marginBottom:12}}/>
      <a href="https://jts.health.mil/index.cfm/CPGs/cpgs" target="_blank" rel="noopener noreferrer" style={{display:"block",textDecoration:"none",marginBottom:10}}><div style={{background:"#6366f114",border:"1px solid #6366f130",borderRadius:12,padding:14}}><div style={{fontSize:13,fontWeight:600,color:"#8b5cf6"}}>Full JTS CPG Library ↗</div><div style={{fontSize:11,color:"#777",marginTop:3}}>jts.health.mil</div></div></a>
      <a href="https://prolongedfieldcare.org" target="_blank" rel="noopener noreferrer" style={{display:"block",textDecoration:"none",marginBottom:14}}><div style={{background:"#06b6d414",border:"1px solid #06b6d430",borderRadius:12,padding:14}}><div style={{fontSize:13,fontWeight:600,color:"#06b6d4"}}>ProlongedFieldCare.org ↗</div><div style={{fontSize:11,color:"#777",marginTop:3}}>PFC Collective resources & CPGs</div></div></a>
      {f.map((cat, ci) => (
        <div key={ci} style={{marginBottom:8}}>
          <button onClick={()=>setExpanded(expanded===ci?null:ci)} style={{width:"100%",textAlign:"left",background:expanded===ci?"#ffffff0a":"#ffffff05",border:"1px solid #ffffff0f",borderRadius:11,padding:"12px 14px",cursor:"pointer",fontFamily:"inherit",color:"#e8e8ed",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div><div style={{fontSize:14,fontWeight:600}}>{cat.category}</div><div style={{fontSize:11,color:"#666",marginTop:2}}>{cat.items.length} guidelines</div></div>
            <span style={{color:cat.color,fontSize:14,transform:expanded===ci?"rotate(90deg)":"none",transition:"transform .2s"}}>{'>'}</span>
          </button>
          {expanded===ci && <div style={{paddingLeft:6,paddingTop:4}}>{cat.items.map((it,ii)=>(<a key={ii} href={it.url} target="_blank" rel="noopener noreferrer" style={{textDecoration:"none",display:"block"}}><div style={{background:"#ffffff05",border:"1px solid #ffffff0a",borderRadius:9,padding:"10px 12px",marginBottom:4}}><div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:13,fontWeight:600,color:"#d4d4dc"}}>{it.title} ↗</span><span style={{fontSize:10,color:"#555"}}>{it.date}</span></div></div></a>))}</div>}
        </div>
      ))}
    </div>
    <Bar active="cpg" cookieConsent={cookieConsent} handleCookieConsent={handleCookieConsent} emailCapture={emailCapture} setEmailCapture={setEmailCapture}/>
  </div>);
}
