"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppState, S, Bar, Prog } from "../components";
import { CHECKLISTS, GRADE_SHEETS, MEDICATIONS } from "../data";

// Peds drugs derived from medications.js - single source of truth
interface PedsDrug {
  name: string;
  dose: number;
  unit: string | undefined;
  route: string | undefined;
}

const PEDS_DRUGS: PedsDrug[] = MEDICATIONS.filter(m => m.pedsPerKg).map(m => ({
  name: m.name,
  dose: m.pedsPerKg as number,
  unit: m.pedsUnit,
  route: m.pedsRoute,
}));

type CalcType = "parkland" | "peds" | "gcs" | null;
type StepResult = "go" | "nogo";
type GradeStateMap = Record<string, Record<number, StepResult>>;
type CheckStateMap = Record<string, Record<number, boolean>>;
type DataMsg = { type: "ok" | "err"; text: string } | null;

// Each calculator returns its own result shape. Keeping this loose keeps the
// original runtime behavior intact without shoehorning a discriminated union.
interface CalcResult {
  total?: string | number;
  first8?: string;
  rate8?: string;
  next16?: string;
  rate16?: string;
  dose?: string;
  unit?: string;
  route?: string;
  perkg?: number;
  drug?: string;
  severity?: string;
  airway?: string;
  e?: string;
  v?: string;
  m?: string;
}

export default function ToolsClient() {
  const { ref } = useAppState();
  const router = useRouter();
  const [calcType, setCalcType] = useState<CalcType>(null);
  const [calcInputs, setCalcInputs] = useState<Record<string, string>>({});
  const [toolView, setToolView] = useState<number | null>(null);
  const [checkStates, setCheckStates] = useState<CheckStateMap>({});
  const [gradeSheet, setGradeSheet] = useState<number | null>(null);
  const [gradeStates, setGradeStates] = useState<GradeStateMap>({});
  const [dataMsg, setDataMsg] = useState<DataMsg>(null);

  const exportData = () => {
    try {
      const data: Record<string, string> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("medeor")) {
          const val = localStorage.getItem(key);
          if (val !== null) data[key] = val;
        }
      }
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `medeor-backup-${new Date().toISOString().split("T")[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
      setDataMsg({ type: "ok", text: "Data exported" });
      setTimeout(() => setDataMsg(null), 3000);
    } catch (e) {
      setDataMsg({ type: "err", text: "Export failed" });
    }
  };

  const importData = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = async (e) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (!file) return;
      try {
        const text = await file.text();
        const data = JSON.parse(text);
        const keys = Object.keys(data).filter(k => k.startsWith("medeor"));
        if (keys.length === 0) { setDataMsg({ type: "err", text: "No Medeor data found in file" }); return; }
        keys.forEach(key => localStorage.setItem(key, data[key]));
        setDataMsg({ type: "ok", text: `Imported ${keys.length} items. Reload to apply.` });
      } catch (e) {
        setDataMsg({ type: "err", text: "Invalid file format" });
      }
    };
    input.click();
  };

  // GRADE SHEET VIEW
  if (gradeSheet !== null) {
    const gs = GRADE_SHEETS[gradeSheet];
    const key = `gs_${gradeSheet}`;
    const states = gradeStates[key] || {};
    const criticalSteps = gs.steps.filter(s => s.critical);
    const criticalPassed = criticalSteps.filter((s) => states[gs.steps.indexOf(s)] === "go").length;
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
              <button onClick={()=>{const ns:Record<number,StepResult>={...states,[si]:"go"};setGradeStates({...gradeStates,[key]:ns})}} style={{width:28,height:28,borderRadius:6,border:`2px solid ${st==="go"?"#10b981":"#ffffff18"}`,background:st==="go"?"#10b981":"transparent",color:st==="go"?"#fff":"#555",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center"}}>GO</button>
              <button onClick={()=>{const ns:Record<number,StepResult>={...states,[si]:"nogo"};setGradeStates({...gradeStates,[key]:ns})}} style={{width:34,height:28,borderRadius:6,border:`2px solid ${st==="nogo"?"#ef4444":"#ffffff18"}`,background:st==="nogo"?"#ef4444":"transparent",color:st==="nogo"?"#fff":"#555",fontSize:9,fontWeight:700,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center"}}>NO</button>
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
    let result: CalcResult | null = null;
    let warning: string | null = null;
    if (calcType === "parkland" && calcInputs.weight && calcInputs.tbsa) {
      const weight = parseFloat(calcInputs.weight);
      const burnPercent = parseFloat(calcInputs.tbsa);
      if (weight < 1 || weight > 300) warning = "Weight outside expected range (1-300 kg)";
      if (burnPercent < 1 || burnPercent > 100) warning = "TBSA must be between 1-100%";
      const totalFluid = 4 * weight * burnPercent;
      const firstEight = totalFluid / 2;
      result = { total: totalFluid.toFixed(0), first8: firstEight.toFixed(0), rate8: (firstEight / 8).toFixed(0), next16: (totalFluid / 2).toFixed(0), rate16: ((totalFluid / 2) / 16).toFixed(0) };
    } else if (calcType === "peds" && calcInputs.weight && calcInputs.drug) {
      const weight = parseFloat(calcInputs.weight);
      if (weight < 1 || weight > 150) warning = "Weight outside expected range (1-150 kg)";
      else if (weight > 80) warning = "Weight exceeds typical pediatric range. Verify patient is pediatric.";
      const drugInfo = PEDS_DRUGS.find(d => d.name === calcInputs.drug);
      if (drugInfo) result = { dose: (drugInfo.dose * weight).toFixed(1), unit: drugInfo.unit, route: drugInfo.route, perkg: drugInfo.dose, drug: calcInputs.drug };
    } else if (calcType === "gcs" && calcInputs.eye && calcInputs.verbal && calcInputs.motor) {
      const total = parseInt(calcInputs.eye) + parseInt(calcInputs.verbal) + parseInt(calcInputs.motor);
      const severity = total <= 8 ? "Severe TBI" : total <= 12 ? "Moderate TBI" : "Mild TBI";
      const airway = total <= 8 ? "Definitive airway recommended (GCS ≤8)" : "Monitor airway, NPA if needed";
      result = { total, severity, airway, e: calcInputs.eye, v: calcInputs.verbal, m: calcInputs.motor };
    }

    return (<div style={S.app}><div style={S.hdr}><button style={S.back} onClick={()=>setCalcType(null)}>←</button><div style={{fontSize:15,fontWeight:700}}>
      {calcType === "parkland" ? "Parkland Burn Calculator" : calcType === "peds" ? "Pediatric Dosing" : "GCS Calculator"}</div></div>
      <div ref={ref} style={S.body}><div style={{padding:"16px 0"}}>
        {warning && <div style={{background:"#f59e0b10",border:"1px solid #f59e0b30",borderRadius:10,padding:"8px 12px",marginBottom:12}}><div style={{fontSize:11,color:"#f59e0b",fontWeight:600}}>⚠ {warning}</div></div>}
        {calcType === "parkland" && (<>
          <div style={{marginBottom:12}}><label style={{fontSize:12,color:"#888",display:"block",marginBottom:4}}>Patient Weight (kg)</label><input type="number" style={S.input} placeholder="70" value={calcInputs.weight||""} onChange={e=>setCalcInputs({...calcInputs,weight:e.target.value})}/></div>
          <div style={{marginBottom:16}}><label style={{fontSize:12,color:"#888",display:"block",marginBottom:4}}>Burn % TBSA</label><input type="number" style={S.input} placeholder="30" value={calcInputs.tbsa||""} onChange={e=>setCalcInputs({...calcInputs,tbsa:e.target.value})}/></div>
          {result && (<div style={{background:"#f9731510",border:"1px solid #f9731525",borderRadius:12,padding:16}}>
            <div style={{fontSize:12,fontWeight:700,color:"#f97316",textTransform:"uppercase",letterSpacing:".06em",marginBottom:10}}>Results</div>
            <div style={{fontSize:14,color:"#ccc",lineHeight:2}}>
              Total 24hr fluid: <b style={{color:"#fff"}}>{result.total} ml</b><br/>
              First 8 hours: <b style={{color:"#fff"}}>{result.first8} ml</b> ({result.rate8} ml/hr)<br/>
              Next 16 hours: <b style={{color:"#fff"}}>{result.next16} ml</b> ({result.rate16} ml/hr)<br/>
              <span style={{fontSize:11,color:"#888"}}>Formula: 4ml x {calcInputs.weight}kg x {calcInputs.tbsa}% TBSA = {result.total}ml</span><br/>
              <span style={{fontSize:11,color:"#f97316"}}>Time starts from moment of BURN, not presentation</span>
            </div>
          </div>)}
        </>)}
        {calcType === "peds" && (<>
          <div style={{marginBottom:12}}><label style={{fontSize:12,color:"#888",display:"block",marginBottom:4}}>Patient Weight (kg)</label><input type="number" style={S.input} placeholder="25" value={calcInputs.weight||""} onChange={e=>setCalcInputs({...calcInputs,weight:e.target.value})}/></div>
          <div style={{marginBottom:16}}><label style={{fontSize:12,color:"#888",display:"block",marginBottom:4}}>Medication</label>
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              {PEDS_DRUGS.map(drug=>(<button key={drug.name} onClick={()=>setCalcInputs({...calcInputs,drug:drug.name})} style={{background:calcInputs.drug===drug.name?"#6366f120":"#ffffff08",border:`1px solid ${calcInputs.drug===drug.name?"#6366f1":"#ffffff14"}`,borderRadius:9,padding:"8px 12px",color:calcInputs.drug===drug.name?"#c7c8ff":"#aaa",fontSize:12,cursor:"pointer",textAlign:"left",fontFamily:"inherit"}}>{drug.name}</button>))}
            </div>
          </div>
          {result && (<div style={{background:"#10b98110",border:"1px solid #10b98125",borderRadius:12,padding:16}}>
            <div style={{fontSize:12,fontWeight:700,color:"#10b981",textTransform:"uppercase",letterSpacing:".06em",marginBottom:10}}>Dose</div>
            <div style={{fontSize:20,fontWeight:700,color:"#fff"}}>{result.dose} {result.unit}</div>
            <div style={{fontSize:13,color:"#aaa",marginTop:4}}>{result.drug} at {result.perkg}{result.unit}/kg x {calcInputs.weight}kg</div>
            <div style={{fontSize:12,color:"#888",marginTop:2}}>Route: {result.route}</div>
          </div>)}
        </>)}
        {calcType === "gcs" && (<>
          <div style={{marginBottom:12}}><label style={{fontSize:12,color:"#888",display:"block",marginBottom:6}}>Eye Opening (1-4)</label>
            {[["4","Spontaneous"],["3","To voice"],["2","To pain"],["1","None"]].map(([v,l])=>(<button key={v} onClick={()=>setCalcInputs({...calcInputs,eye:v})} style={{display:"block",width:"100%",background:calcInputs.eye===v?"#8b5cf620":"#ffffff08",border:`1px solid ${calcInputs.eye===v?"#8b5cf6":"#ffffff14"}`,borderRadius:9,padding:"8px 12px",color:calcInputs.eye===v?"#c7c8ff":"#aaa",fontSize:12,cursor:"pointer",textAlign:"left",fontFamily:"inherit",marginBottom:4}}>{v} - {l}</button>))}
          </div>
          <div style={{marginBottom:12}}><label style={{fontSize:12,color:"#888",display:"block",marginBottom:6}}>Verbal Response (1-5)</label>
            {[["5","Oriented"],["4","Confused"],["3","Inappropriate words"],["2","Incomprehensible"],["1","None"]].map(([v,l])=>(<button key={v} onClick={()=>setCalcInputs({...calcInputs,verbal:v})} style={{display:"block",width:"100%",background:calcInputs.verbal===v?"#8b5cf620":"#ffffff08",border:`1px solid ${calcInputs.verbal===v?"#8b5cf6":"#ffffff14"}`,borderRadius:9,padding:"8px 12px",color:calcInputs.verbal===v?"#c7c8ff":"#aaa",fontSize:12,cursor:"pointer",textAlign:"left",fontFamily:"inherit",marginBottom:4}}>{v} - {l}</button>))}
          </div>
          <div style={{marginBottom:16}}><label style={{fontSize:12,color:"#888",display:"block",marginBottom:6}}>Motor Response (1-6)</label>
            {[["6","Obeys commands"],["5","Localizes pain"],["4","Withdrawal"],["3","Abnormal flexion"],["2","Extension"],["1","None"]].map(([v,l])=>(<button key={v} onClick={()=>setCalcInputs({...calcInputs,motor:v})} style={{display:"block",width:"100%",background:calcInputs.motor===v?"#8b5cf620":"#ffffff08",border:`1px solid ${calcInputs.motor===v?"#8b5cf6":"#ffffff14"}`,borderRadius:9,padding:"8px 12px",color:calcInputs.motor===v?"#c7c8ff":"#aaa",fontSize:12,cursor:"pointer",textAlign:"left",fontFamily:"inherit",marginBottom:4}}>{v} - {l}</button>))}
          </div>
          {result && (<div style={{background:"#8b5cf610",border:"1px solid #8b5cf625",borderRadius:12,padding:16}}>
            <div style={{fontSize:12,fontWeight:700,color:"#8b5cf6",textTransform:"uppercase",letterSpacing:".06em",marginBottom:10}}>GCS Score</div>
            <div style={{fontSize:36,fontWeight:800,color:"#fff"}}>{result.total}</div>
            <div style={{fontSize:14,color:typeof result.total === "number" && result.total<=8?"#ef4444":typeof result.total === "number" && result.total<=12?"#f59e0b":"#10b981",fontWeight:600,marginTop:4}}>{result.severity}</div>
            <div style={{fontSize:12,color:"#aaa",marginTop:6}}>E{result.e} V{result.v} M{result.m} = {result.total}</div>
            <div style={{fontSize:12,color:"#888",marginTop:4}}>{result.airway}</div>
          </div>)}
        </>)}
      </div></div>
      <Bar active="tools"/>
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
          {cl.items.map((item,ii)=>(<div key={ii} onClick={()=>{const ns:Record<number,boolean>={...states,[ii]:!states[ii]};setCheckStates({...checkStates,[key]:ns})}} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"10px 0",borderBottom:"1px solid #ffffff08",cursor:"pointer"}}>
            <div style={{width:20,height:20,borderRadius:6,border:`2px solid ${states[ii]?cl.color:"#ffffff20"}`,background:states[ii]?cl.color:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1,transition:"all .2s"}}>{states[ii]&&<span style={{color:"#fff",fontSize:12,fontWeight:700}}>✓</span>}</div>
            <div style={{fontSize:13,color:states[ii]?"#666":"#ccc",lineHeight:1.5,textDecoration:states[ii]?"line-through":"none",transition:"all .2s"}}>{typeof item === "string" ? item : item.text}</div>
          </div>))}
        </div>
        <button style={{...S.btn("#555",false),marginTop:16}} onClick={()=>setCheckStates({...checkStates,[key]:{}})}>Reset Checklist</button>
      </div></div>
      <Bar active="tools"/>
    </div>);
  }

  // TOOLS HOME
  return (<div style={S.app}><div style={S.hdr}><div><div style={{fontSize:16,fontWeight:700}}>Tools</div><div style={{fontSize:10,color:"#666",marginTop:1,textTransform:"uppercase",letterSpacing:".04em"}}>Calculators, Checklists & Gear</div></div></div>
    <div ref={ref} style={S.body}>
      <div style={{background:"#f59e0b08",border:"1px solid #f59e0b18",borderRadius:10,padding:"10px 14px",margin:"12px 0 8px"}}><div style={{fontSize:10,fontWeight:700,color:"#f59e0b",textTransform:"uppercase",letterSpacing:".06em",marginBottom:3}}>Training Tool Only</div><div style={{fontSize:10,color:"#888",lineHeight:1.5}}>Medeor is a training and study aid. It is not a substitute for clinical judgment, licensed medical advice, or hands-on instruction. Dosages and protocols reflect CoTCCC/JTS CPG guidelines current as of March 2026. Always verify against your unit SOPs and current references.</div></div>
   <div style={{padding:"14px 0 8px",fontSize:12,color:"#666",fontWeight:600,textTransform:"uppercase",letterSpacing:".05em"}}>Documentation</div>
      <div style={S.card} onClick={()=>router.push("/tools/documentation")}>
        <div style={{display:"flex",alignItems:"center",gap:11}}><span style={{fontSize:22}}>{"\u{1F4DD}"}</span><div style={{flex:1}}><div style={{fontSize:14,fontWeight:600}}>Patient Charting</div><div style={{fontSize:11,color:"#666",marginTop:2}}>SF 600 and other medical documentation forms, offline-first</div></div><span style={{color:"#444"}}>{'>'}</span></div>
      </div>
      <div style={{padding:"14px 0 8px",fontSize:12,color:"#666",fontWeight:600,textTransform:"uppercase",letterSpacing:".05em"}}>Calculators</div>
      {[{k:"parkland" as const,icon:"🔥",title:"Parkland Burn Calculator",desc:"4ml x kg x %TBSA fluid resuscitation"},{k:"peds" as const,icon:"💊",title:"Pediatric Dosing",desc:"Weight-based medication calculations"},{k:"gcs" as const,icon:"🧠",title:"GCS Calculator",desc:"Glasgow Coma Scale with severity and airway guidance"}].map(c=>(
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
      <div style={{padding:"18px 0 8px",fontSize:12,color:"#666",fontWeight:600,textTransform:"uppercase",letterSpacing:".05em"}}>Data Management</div>
      <div style={{fontSize:11,color:"#555",marginBottom:8,lineHeight:1.5}}>Export your progress, quiz scores, and PFC card data as a backup file. Import on another device or after clearing browser data.</div>
      {dataMsg && <div style={{background:dataMsg.type==="ok"?"#10b98110":"#ef444410",border:`1px solid ${dataMsg.type==="ok"?"#10b98130":"#ef444430"}`,borderRadius:8,padding:"6px 12px",marginBottom:8}}><div style={{fontSize:11,color:dataMsg.type==="ok"?"#10b981":"#ef4444",fontWeight:600}}>{dataMsg.text}</div></div>}
      <div style={{display:"flex",gap:8,marginBottom:16}}>
        <button onClick={exportData} style={{flex:1,padding:"12px 16px",background:"#ffffff08",border:"1px solid #ffffff14",borderRadius:10,color:"#ccc",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Export Backup</button>
        <button onClick={importData} style={{flex:1,padding:"12px 16px",background:"#ffffff08",border:"1px solid #ffffff14",borderRadius:10,color:"#ccc",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Import Backup</button>
      </div>
      <div style={{padding:"18px 0 8px",fontSize:12,color:"#666",fontWeight:600,textTransform:"uppercase",letterSpacing:".05em"}}>Gear & Resources</div>
      <a href="https://www.narescue.com" target="_blank" rel="noopener noreferrer" style={{textDecoration:"none",display:"block"}}><div style={{...S.card,background:"#dc262610",border:"1px solid #dc262625"}}><div style={{fontSize:14,fontWeight:600,color:"#ef4444"}}>North American Rescue ↗</div><div style={{fontSize:11,color:"#888",marginTop:3}}>CAT tourniquets, chest seals, IFAKs, decompression needles</div></div></a>
      <a href="https://www.darkangelmedical.com" target="_blank" rel="noopener noreferrer" style={{textDecoration:"none",display:"block"}}><div style={{...S.card,background:"#6366f110",border:"1px solid #6366f125"}}><div style={{fontSize:14,fontWeight:600,color:"#8b5cf6"}}>Dark Angel Medical ↗</div><div style={{fontSize:11,color:"#888",marginTop:3}}>Training tourniquets, trauma kits, medical training</div></div></a>
      <a href="https://www.crisis-medicine.com" target="_blank" rel="noopener noreferrer" style={{textDecoration:"none",display:"block"}}><div style={{...S.card,background:"#10b98110",border:"1px solid #10b98125"}}><div style={{fontSize:14,fontWeight:600,color:"#10b981"}}>Crisis Medicine ↗</div><div style={{fontSize:11,color:"#888",marginTop:3}}>TCCC/TECC training courses, quick tips, resources</div></div></a>
      <a href="https://jsomonline.org/product/2025-ranger-medic-handbook/" target="_blank" rel="noopener noreferrer" style={{textDecoration:"none",display:"block"}}><div style={{...S.card,background:"#f59e0b10",border:"1px solid #f59e0b25"}}><div style={{fontSize:14,fontWeight:600,color:"#f59e0b"}}>2025 Ranger Medic Handbook ↗</div><div style={{fontSize:11,color:"#888",marginTop:3}}>Latest edition, waterproof, pocket-sized field reference</div></div></a>
    </div>
    <Bar active="tools"/>
  </div>);
}
