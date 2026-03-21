"use client";
import { useState } from "react";
import { useAppState, S, Bar, Prog } from "../components";
import { CHECKLISTS, GRADE_SHEETS } from "../data";

export default function ToolsClient() {
  const { cookieConsent, handleCookieConsent, emailCapture, setEmailCapture, ref } = useAppState();
  const [calcType, setCalcType] = useState(null);
  const [calcInputs, setCalcInputs] = useState({});
  const [toolView, setToolView] = useState(null);
  const [checkStates, setCheckStates] = useState({});
  const [gradeSheet, setGradeSheet] = useState(null);
  const [gradeStates, setGradeStates] = useState({});

  // GRADE SHEET VIEW
  if (gradeSheet !== null) {
    const gs = GRADE_SHEETS[gradeSheet];
    const key = `gs_${gradeSheet}`;
    const states = gradeStates[key] || {};
    const criticalSteps = gs.steps.filter(s => s.critical);
    const criticalPassed = criticalSteps.filter((s, i) => states[gs.steps.indexOf(s)] === "go").length;
    const criticalFailed = criticalSteps.some((s) => states[gs.steps.indexOf(s)] === "nogo");
    const allCriticalDone = criticalSteps.every((s) => states[gs.steps.indexOf(s)]);
    const result = allCriticalDone ? (criticalFailed ? "NO-GO" : "GO") : null;
    return (<div style={S.app}><div style={S.hdr}><button style={S.back} onClick={()=>setGradeSheet(null)}>{'<-'}</button><div style={{flex:1}}><div style={{fontSize:14,fontWeight:700}}>{gs.title}</div><div style={{fontSize:11,color:"#666"}}>{gs.tier} | {criticalPassed}/{criticalSteps.length} critical passed</div></div></div>
      <div ref={ref} style={S.body}><div style={{padding:"12px 0"}}>
        {result && <div style={{background:result==="GO"?"#10b9810f":"#ef44440f",border:`1px solid ${result==="GO"?"#10b98130":"#ef444430"}`,borderRadius:11,padding:14,marginBottom:14,textAlign:"center"}}><div style={{fontSize:22,fontWeight:800,color:result==="GO"?"#10b981":"#ef4444"}}>{result}</div><div style={{fontSize:11,color:"#888",marginTop:4}}>{result==="GO"?"All critical tasks passed":"Failed one or more critical tasks"}</div></div>}
        {gs.steps.map((step,si)=>{
          const st = states[si];
          return (<div key={si} style={{display:"flex",alignItems:"flex-start",gap:8,padding:"10px 0",borderBottom:"1px solid #ffffff08"}}>
            <div style={{display:"flex",gap:4,flexShrink:0,marginTop:2}}>
              <button onClick={()=>{const ns={...states,[si]:"go"};setGradeStates({...gradeStates,[key]:ns})}} style={{width:28,height:28,borderRadius:6,border:`2px solid ${st==="go"?"#10b981":"#ffffff18"}`,background:st==="go"?"#10b981":"transparent",color:st==="go"?"#fff":"#555",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center"}}>GO</button>
              <button onClick={()=>{const ns={...states,[si]:"nogo"};setGradeStates({...gradeStates,[key]:ns})}} style={{width:34,height:28,borderRadius:6,border:`2px solid ${st==="nogo"?"#ef4444":"#ffffff18"}`,background:st==="nogo"?"#ef4444":"transparent",color:st==="nogo"?"#fff":"#555",fontSize:9,fontWeight:700,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center"}}>NO</button>
            </div>
            <div style={{flex:1}}>
              <div style={{fontSize:13,color:st==="go"?"#888":st==="nogo"?"#ef4444":"#ccc",lineHeight:1.5}}>{step.critical&&<span style={{fontSize:9,fontWeight:700,color:"#f59e0b",background:"#f59e0b18",padding:"1px 4px",borderRadius:3,marginRight:6}}>C</span>}{step.text}</div>
            </div>
          </div>)
        })}
        <button style={{...S.btn("#555",false),marginTop:16}} onClick={()=>setGradeStates({...gradeStates,[key]:{}})}>Reset Grade Sheet</button>
      </div></div>
      <Bar active="tools"/>
    </div>);
  }

  // CALCULATOR VIEW
  if (calcType) {
    const ci = calcInputs;
    let result = null;
    if (calcType === "parkland" && ci.weight && ci.tbsa) {
      const total = 4 * parseFloat(ci.weight) * parseFloat(ci.tbsa);
      const first8 = total / 2;
      result = { total: total.toFixed(0), first8: first8.toFixed(0), rate8: (first8 / 8).toFixed(0), next16: (total/2).toFixed(0), rate16: ((total/2) / 16).toFixed(0) };
    } else if (calcType === "peds" && ci.weight && ci.drug) {
      const w = parseFloat(ci.weight);
      const drugs = {
        "Ketamine (analgesic)": { dose: 0.5, unit: "mg", route: "IV" },
        "Ketamine (procedural)": { dose: 1.5, unit: "mg", route: "IV" },
        "Succinylcholine": { dose: 1.5, unit: "mg", route: "IV" },
        "Rocuronium": { dose: 1, unit: "mg", route: "IV" },
        "Midazolam": { dose: 0.1, unit: "mg", route: "IV/IM/IN" },
        "Epinephrine": { dose: 0.01, unit: "mg", route: "IV/IO" },
        "TXA": { dose: 15, unit: "mg", route: "IV" },
        "Keppra": { dose: 20, unit: "mg", route: "IV" }
      };
      const d = drugs[ci.drug];
      if (d) result = { dose: (d.dose * w).toFixed(1), unit: d.unit, route: d.route, perkg: d.dose, drug: ci.drug };
    } else if (calcType === "gcs" && ci.eye && ci.verbal && ci.motor) {
      const total = parseInt(ci.eye) + parseInt(ci.verbal) + parseInt(ci.motor);
      const sev = total <= 8 ? "Severe TBI" : total <= 12 ? "Moderate TBI" : "Mild TBI";
      const airway = total <= 8 ? "Definitive airway recommended (GCS ≤8)" : "Monitor airway, NPA if needed";
      result = { total, severity: sev, airway, e: ci.eye, v: ci.verbal, m: ci.motor };
    }

    return (<div style={S.app}><div style={S.hdr}><button style={S.back} onClick={()=>setCalcType(null)}>←</button><div style={{fontSize:15,fontWeight:700}}>
      {calcType === "parkland" ? "Parkland Burn Calculator" : calcType === "peds" ? "Pediatric Dosing" : "GCS Calculator"}</div></div>
      <div ref={ref} style={S.body}><div style={{padding:"16px 0"}}>
        {calcType === "parkland" && (<>
          <div style={{marginBottom:12}}><label style={{fontSize:12,color:"#888",display:"block",marginBottom:4}}>Patient Weight (kg)</label><input type="number" style={S.input} placeholder="70" value={ci.weight||""} onChange={e=>setCalcInputs({...ci,weight:e.target.value})}/></div>
          <div style={{marginBottom:16}}><label style={{fontSize:12,color:"#888",display:"block",marginBottom:4}}>Burn % TBSA</label><input type="number" style={S.input} placeholder="30" value={ci.tbsa||""} onChange={e=>setCalcInputs({...ci,tbsa:e.target.value})}/></div>
          {result && (<div style={{background:"#f9731510",border:"1px solid #f9731525",borderRadius:12,padding:16}}>
            <div style={{fontSize:12,fontWeight:700,color:"#f97316",textTransform:"uppercase",letterSpacing:".06em",marginBottom:10}}>Results</div>
            <div style={{fontSize:14,color:"#ccc",lineHeight:2}}>
              Total 24hr fluid: <b style={{color:"#fff"}}>{result.total} ml</b><br/>
              First 8 hours: <b style={{color:"#fff"}}>{result.first8} ml</b> ({result.rate8} ml/hr)<br/>
              Next 16 hours: <b style={{color:"#fff"}}>{result.next16} ml</b> ({result.rate16} ml/hr)<br/>
              <span style={{fontSize:11,color:"#888"}}>Formula: 4ml x {ci.weight}kg x {ci.tbsa}% TBSA = {result.total}ml</span><br/>
              <span style={{fontSize:11,color:"#f97316"}}>Time starts from moment of BURN, not presentation</span>
            </div>
          </div>)}
        </>)}
        {calcType === "peds" && (<>
          <div style={{marginBottom:12}}><label style={{fontSize:12,color:"#888",display:"block",marginBottom:4}}>Patient Weight (kg)</label><input type="number" style={S.input} placeholder="25" value={ci.weight||""} onChange={e=>setCalcInputs({...ci,weight:e.target.value})}/></div>
          <div style={{marginBottom:16}}><label style={{fontSize:12,color:"#888",display:"block",marginBottom:4}}>Medication</label>
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              {["Ketamine (analgesic)","Ketamine (procedural)","Succinylcholine","Rocuronium","Midazolam","Epinephrine","TXA","Keppra"].map(d=>(<button key={d} onClick={()=>setCalcInputs({...ci,drug:d})} style={{background:ci.drug===d?"#6366f120":"#ffffff08",border:`1px solid ${ci.drug===d?"#6366f1":"#ffffff14"}`,borderRadius:9,padding:"8px 12px",color:ci.drug===d?"#c7c8ff":"#aaa",fontSize:12,cursor:"pointer",textAlign:"left",fontFamily:"inherit"}}>{d}</button>))}
            </div>
          </div>
          {result && (<div style={{background:"#10b98110",border:"1px solid #10b98125",borderRadius:12,padding:16}}>
            <div style={{fontSize:12,fontWeight:700,color:"#10b981",textTransform:"uppercase",letterSpacing:".06em",marginBottom:10}}>Dose</div>
            <div style={{fontSize:20,fontWeight:700,color:"#fff"}}>{result.dose} {result.unit}</div>
            <div style={{fontSize:13,color:"#aaa",marginTop:4}}>{result.drug} at {result.perkg}{result.unit}/kg x {ci.weight}kg</div>
            <div style={{fontSize:12,color:"#888",marginTop:2}}>Route: {result.route}</div>
          </div>)}
        </>)}
        {calcType === "gcs" && (<>
          <div style={{marginBottom:12}}><label style={{fontSize:12,color:"#888",display:"block",marginBottom:6}}>Eye Opening (1-4)</label>
            {[["4","Spontaneous"],["3","To voice"],["2","To pain"],["1","None"]].map(([v,l])=>(<button key={v} onClick={()=>setCalcInputs({...ci,eye:v})} style={{display:"block",width:"100%",background:ci.eye===v?"#8b5cf620":"#ffffff08",border:`1px solid ${ci.eye===v?"#8b5cf6":"#ffffff14"}`,borderRadius:9,padding:"8px 12px",color:ci.eye===v?"#c7c8ff":"#aaa",fontSize:12,cursor:"pointer",textAlign:"left",fontFamily:"inherit",marginBottom:4}}>{v} - {l}</button>))}
          </div>
          <div style={{marginBottom:12}}><label style={{fontSize:12,color:"#888",display:"block",marginBottom:6}}>Verbal Response (1-5)</label>
            {[["5","Oriented"],["4","Confused"],["3","Inappropriate words"],["2","Incomprehensible"],["1","None"]].map(([v,l])=>(<button key={v} onClick={()=>setCalcInputs({...ci,verbal:v})} style={{display:"block",width:"100%",background:ci.verbal===v?"#8b5cf620":"#ffffff08",border:`1px solid ${ci.verbal===v?"#8b5cf6":"#ffffff14"}`,borderRadius:9,padding:"8px 12px",color:ci.verbal===v?"#c7c8ff":"#aaa",fontSize:12,cursor:"pointer",textAlign:"left",fontFamily:"inherit",marginBottom:4}}>{v} - {l}</button>))}
          </div>
          <div style={{marginBottom:16}}><label style={{fontSize:12,color:"#888",display:"block",marginBottom:6}}>Motor Response (1-6)</label>
            {[["6","Obeys commands"],["5","Localizes pain"],["4","Withdrawal"],["3","Abnormal flexion"],["2","Extension"],["1","None"]].map(([v,l])=>(<button key={v} onClick={()=>setCalcInputs({...ci,motor:v})} style={{display:"block",width:"100%",background:ci.motor===v?"#8b5cf620":"#ffffff08",border:`1px solid ${ci.motor===v?"#8b5cf6":"#ffffff14"}`,borderRadius:9,padding:"8px 12px",color:ci.motor===v?"#c7c8ff":"#aaa",fontSize:12,cursor:"pointer",textAlign:"left",fontFamily:"inherit",marginBottom:4}}>{v} - {l}</button>))}
          </div>
          {result && (<div style={{background:"#8b5cf610",border:"1px solid #8b5cf625",borderRadius:12,padding:16}}>
            <div style={{fontSize:12,fontWeight:700,color:"#8b5cf6",textTransform:"uppercase",letterSpacing:".06em",marginBottom:10}}>GCS Score</div>
            <div style={{fontSize:36,fontWeight:800,color:"#fff"}}>{result.total}</div>
            <div style={{fontSize:14,color:result.total<=8?"#ef4444":result.total<=12?"#f59e0b":"#10b981",fontWeight:600,marginTop:4}}>{result.severity}</div>
            <div style={{fontSize:12,color:"#aaa",marginTop:6}}>E{result.e} V{result.v} M{result.m} = {result.total}</div>
            <div style={{fontSize:12,color:"#888",marginTop:4}}>{result.airway}</div>
          </div>)}
        </>)}
      </div></div>
      <Bar active="tools" cookieConsent={cookieConsent} handleCookieConsent={handleCookieConsent} emailCapture={emailCapture} setEmailCapture={setEmailCapture}/>
    </div>);
  }

  // CHECKLIST VIEW
  if (toolView !== null && typeof toolView === "number") {
    const cl = CHECKLISTS[toolView];
    const key = `cl_${toolView}`;
    const states = checkStates[key] || {};
    const checked = Object.values(states).filter(Boolean).length;
    return (<div style={S.app}><div style={S.hdr}><button style={S.back} onClick={()=>setToolView(null)}>←</button><div style={{flex:1}}><div style={{fontSize:14,fontWeight:700}}>{cl.title}</div><div style={{fontSize:11,color:"#666"}}>{checked}/{cl.items.length} complete</div></div></div>
      <div ref={ref} style={S.body}><div style={{padding:"12px 0"}}>
        <Prog c={checked} t={cl.items.length}/>
        <div style={{marginTop:14}}>
          {cl.items.map((item,ii)=>(<div key={ii} onClick={()=>{const ns={...states,[ii]:!states[ii]};setCheckStates({...checkStates,[key]:ns})}} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"10px 0",borderBottom:"1px solid #ffffff08",cursor:"pointer"}}>
            <div style={{width:20,height:20,borderRadius:6,border:`2px solid ${states[ii]?cl.color:"#ffffff20"}`,background:states[ii]?cl.color:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1,transition:"all .2s"}}>{states[ii]&&<span style={{color:"#fff",fontSize:12,fontWeight:700}}>✓</span>}</div>
            <div style={{fontSize:13,color:states[ii]?"#666":"#ccc",lineHeight:1.5,textDecoration:states[ii]?"line-through":"none",transition:"all .2s"}}>{item}</div>
          </div>))}
        </div>
        <button style={{...S.btn("#555",false),marginTop:16}} onClick={()=>setCheckStates({...checkStates,[key]:{}})}>Reset Checklist</button>
      </div></div>
      <Bar active="tools" cookieConsent={cookieConsent} handleCookieConsent={handleCookieConsent} emailCapture={emailCapture} setEmailCapture={setEmailCapture}/>
    </div>);
  }

  // TOOLS HOME
  return (<div style={S.app}><div style={S.hdr}><div><div style={{fontSize:16,fontWeight:700}}>Tools</div><div style={{fontSize:10,color:"#666",marginTop:1,textTransform:"uppercase",letterSpacing:".04em"}}>Calculators, Checklists & Gear</div></div></div>
    <div ref={ref} style={S.body}>
      <div style={{padding:"14px 0 8px",fontSize:12,color:"#666",fontWeight:600,textTransform:"uppercase",letterSpacing:".05em"}}>Calculators</div>
      {[{k:"parkland",icon:"🔥",title:"Parkland Burn Calculator",desc:"4ml x kg x %TBSA fluid resuscitation"},{k:"peds",icon:"💊",title:"Pediatric Dosing",desc:"Weight-based medication calculations"},{k:"gcs",icon:"🧠",title:"GCS Calculator",desc:"Glasgow Coma Scale with severity and airway guidance"}].map(c=>(
        <div key={c.k} style={S.card} onClick={()=>{setCalcType(c.k);setCalcInputs({});}}>
          <div style={{display:"flex",alignItems:"center",gap:11}}><span style={{fontSize:22}}>{c.icon}</span><div style={{flex:1}}><div style={{fontSize:14,fontWeight:600}}>{c.title}</div><div style={{fontSize:11,color:"#666",marginTop:2}}>{c.desc}</div></div><span style={{color:"#444"}}>{'>'}</span></div>
        </div>
      ))}
      <div style={{padding:"18px 0 8px",fontSize:12,color:"#666",fontWeight:600,textTransform:"uppercase",letterSpacing:".05em"}}>Checklists</div>
      {CHECKLISTS.map((cl,ci)=>(
        <div key={ci} style={S.card} onClick={()=>setToolView(ci)}>
          <div style={{display:"flex",alignItems:"center",gap:11}}><div style={{width:10,height:10,borderRadius:3,background:cl.color,flexShrink:0}}/><div style={{flex:1}}><div style={{fontSize:14,fontWeight:600}}>{cl.title}</div><div style={{fontSize:11,color:"#666",marginTop:2}}>{cl.items.length} items</div></div><span style={{color:"#444"}}>{'>'}</span></div>
        </div>
      ))}
      <div style={{padding:"18px 0 8px",fontSize:12,color:"#666",fontWeight:600,textTransform:"uppercase",letterSpacing:".05em"}}>Skills Grade Sheets</div>
      <div style={{fontSize:11,color:"#555",marginBottom:8,lineHeight:1.5}}>Practice to the official TCCC evaluation standard. Critical tasks marked (C) must all pass for GO.</div>
      {GRADE_SHEETS.map((gs,gi)=>(
        <div key={gi} style={S.card} onClick={()=>setGradeSheet(gi)}>
          <div style={{display:"flex",alignItems:"center",gap:11}}><div style={{width:10,height:10,borderRadius:3,background:gs.color,flexShrink:0}}/><div style={{flex:1}}><div style={{fontSize:14,fontWeight:600}}>{gs.title}</div><div style={{fontSize:11,color:"#666",marginTop:2}}>{gs.tier} | {gs.steps.length} steps | {gs.steps.filter(s=>s.critical).length} critical</div></div><span style={{color:"#444"}}>{'>'}</span></div>
        </div>
      ))}
      <div style={{padding:"18px 0 8px",fontSize:12,color:"#666",fontWeight:600,textTransform:"uppercase",letterSpacing:".05em"}}>Gear & Resources</div>
      <a href="https://www.narescue.com" target="_blank" rel="noopener noreferrer" style={{textDecoration:"none",display:"block"}}><div style={{...S.card,background:"#dc262610",border:"1px solid #dc262625"}}><div style={{fontSize:14,fontWeight:600,color:"#ef4444"}}>North American Rescue ↗</div><div style={{fontSize:11,color:"#888",marginTop:3}}>CAT tourniquets, chest seals, IFAKs, decompression needles</div></div></a>
      <a href="https://www.darkangelmedical.com" target="_blank" rel="noopener noreferrer" style={{textDecoration:"none",display:"block"}}><div style={{...S.card,background:"#6366f110",border:"1px solid #6366f125"}}><div style={{fontSize:14,fontWeight:600,color:"#8b5cf6"}}>Dark Angel Medical ↗</div><div style={{fontSize:11,color:"#888",marginTop:3}}>Training tourniquets, trauma kits, medical training</div></div></a>
      <a href="https://www.crisis-medicine.com" target="_blank" rel="noopener noreferrer" style={{textDecoration:"none",display:"block"}}><div style={{...S.card,background:"#10b98110",border:"1px solid #10b98125"}}><div style={{fontSize:14,fontWeight:600,color:"#10b981"}}>Crisis Medicine ↗</div><div style={{fontSize:11,color:"#888",marginTop:3}}>TCCC/TECC training courses, quick tips, resources</div></div></a>
      <a href="https://jsomonline.org/product/2025-ranger-medic-handbook/" target="_blank" rel="noopener noreferrer" style={{textDecoration:"none",display:"block"}}><div style={{...S.card,background:"#f59e0b10",border:"1px solid #f59e0b25"}}><div style={{fontSize:14,fontWeight:600,color:"#f59e0b"}}>2025 Ranger Medic Handbook ↗</div><div style={{fontSize:11,color:"#888",marginTop:3}}>Latest edition, waterproof, pocket-sized field reference</div></div></a>
    </div>
    <Bar active="tools" cookieConsent={cookieConsent} handleCookieConsent={handleCookieConsent} emailCapture={emailCapture} setEmailCapture={setEmailCapture}/>
  </div>);
}
