"use client";
import { useAppState, S, Bar } from "../components";
import { VIDEOS } from "../data";

export default function VideoClient() {
  const { expanded, setExpanded, search, setSearch, cookieConsent, handleCookieConsent, emailCapture, setEmailCapture, ref } = useAppState();
  const f = search ? VIDEOS.map(m=>({...m,vids:m.vids.filter(v=>v.name.toLowerCase().includes(search.toLowerCase()))})).filter(m=>m.vids.length) : VIDEOS;
  return (<div style={S.app}><div style={S.hdr}><div><div style={{fontSize:16,fontWeight:700}}>Skills Video Library</div><div style={{fontSize:10,color:"#666",marginTop:1,textTransform:"uppercase",letterSpacing:".04em"}}>TCCC Training Videos</div></div></div>
    <div ref={ref} style={S.body}>
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search skills..." style={{...S.input,marginTop:14,marginBottom:12}}/>
      {f.map((mod,mi)=>(
        <div key={mi} style={{marginBottom:8}}>
          <button onClick={()=>setExpanded(expanded===mi?null:mi)} style={{width:"100%",textAlign:"left",background:expanded===mi?`${mod.color}0a`:"#ffffff05",border:`1px solid ${expanded===mi?`${mod.color}30`:"#ffffff0f"}`,borderRadius:11,padding:"12px 14px",cursor:"pointer",fontFamily:"inherit",color:"#e8e8ed",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div><div style={{fontSize:10,color:mod.color,fontWeight:700,textTransform:"uppercase",letterSpacing:".05em"}}>Module {mod.mod}</div><div style={{fontSize:13,fontWeight:600,marginTop:2}}>{mod.title}</div><div style={{fontSize:11,color:"#555",marginTop:1}}>{mod.vids.length} videos</div></div>
            <span style={{color:mod.color,fontSize:14,transform:expanded===mi?"rotate(90deg)":"none",transition:"transform .2s"}}>{'>'}</span>
          </button>
          {expanded===mi && <div style={{paddingLeft:0,paddingTop:6}}>
            {mod.vids.map((v,vi)=>(<div key={vi} style={{marginBottom:10}}>
              <div style={{fontSize:13,fontWeight:600,color:"#ccc",marginBottom:6,paddingLeft:6}}>{v.name}</div>
              {v.ext ? (
                <a href={`https://www.youtube.com/watch?v=${v.yt}`} target="_blank" rel="noopener noreferrer" style={{textDecoration:"none",display:"block"}}>
                  <div style={{borderRadius:10,overflow:"hidden",background:"#111",aspectRatio:"16/9",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",position:"relative"}}>
                    <img src={`https://img.youtube.com/vi/${v.yt}/hqdefault.jpg`} alt={v.name} style={{position:"absolute",top:0,left:0,width:"100%",height:"100%",objectFit:"cover",opacity:.4}}/>
                    <div style={{position:"relative",zIndex:1,textAlign:"center"}}>
                      <div style={{width:48,height:48,borderRadius:24,background:"rgba(255,0,0,.9)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 8px"}}><span style={{color:"#fff",fontSize:20,marginLeft:3}}>▶</span></div>
                      <div style={{fontSize:12,color:"#ccc",fontWeight:600}}>Watch on YouTube ↗</div>
                    </div>
                  </div>
                </a>
              ) : (
                <div style={{borderRadius:10,overflow:"hidden",background:"#000",aspectRatio:"16/9"}}>
                  <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${v.yt}`} title={v.name} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen style={{display:"block"}}/>
                </div>
              )}
            </div>))}
          </div>}
        </div>
      ))}
    </div>
    <Bar active="videos" cookieConsent={cookieConsent} handleCookieConsent={handleCookieConsent} emailCapture={emailCapture} setEmailCapture={setEmailCapture}/>
  </div>);
}
