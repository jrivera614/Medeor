"use client";
import { useState } from "react";
import { useAppState, S, Bar, Prog } from "../components";
import { GRADE_SHEETS } from "../data";

export default function GradesClient() {
  const { ref } = useAppState();
  const [gradeSheet, setGradeSheet] = useState(null);
  const [gradeStates, setGradeStates] = useState({});

  if (gradeSheet !== null) {
    const gs = GRADE_SHEETS[gradeSheet];
    const key = `gs_${gradeSheet}`;
    const states = gradeStates[key] || {};
    const criticalSteps = gs.steps.filter(s => s.critical);
    const criticalPassed = criticalSteps.filter((s) => states[gs.steps.indexOf(s)] === "go").length;
    const criticalFailed = criticalSteps.some((s) => states[gs.steps.indexOf(s)] === "nogo");
    const allCriticalDone = criticalSteps.every((s) => states[gs.steps.indexOf(s)]);
    const result = allCriticalDone ? (criticalFailed ? "NO-GO" : "GO") : null;
    return (<div style={S.app}><div style={S.hdr}><button style={S.back} onClick={()=>setGradeSheet(null)}>{"<-"}</button><div style={{flex:1}}><div style={{fontSize:14,fontWeight:700}}>{gs.title}</div><div style={{fontSize:11,color:"#666"}}>{gs.tier} | {criticalPassed}/{criticalSteps.length} critical passed</div></div></div>
      <div ref={ref} style={S.body}><div style={{padding:"12px 0"}}>
        {result && <div style={{background:result==="GO"?"#10b9810f":"#ef44440f",border:"1px solid "+(result==="GO"?"#10b98130":"#ef444430"),borderRadius:11,padding:14,marginBottom:14,textAlign:"center"}}><div style={{fontSize:22,fontWeight:800,color:result==="GO"?"#10b981":"#ef4444"}}>{result}</div><div style={{fontSize:11,color:"#888",marginTop:4}}>{result==="GO"?"All critical tasks passed":"Failed one or more critical tasks"}</div></div>}
        {gs.steps.map((step,si)=>{
          const st = states[si];
          return (<div key={si} style={{display:"flex",alignItems:"flex-start",gap:8,padding:"10px 0",borderBottom:"1px solid #ffffff08"}}>
            <div style={{display:"flex",gap:4,flexShrink:0,marginTop:2}}>
              <button onClick={()=>{const ns={...states,[si]:"go"};setGradeStates({...gradeStates,[key]:ns})}} style={{width:28,height:28,borderRadius:6,border:"2px solid "+(st==="go"?"#10b981":"#ffffff18"),background:st==="go"?"#10b981":"transparent",color:st==="go"?"#fff":"#555",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center"}}>GO</button>
              <button onClick={()=>{const ns={...states,[si]:"nogo"};setGradeStates({...gradeStates,[key]:ns})}} style={{width:34,height:28,borderRadius:6,border:"2px solid "+(st==="nogo"?"#ef4444":"#ffffff18"),background:st==="nogo"?"#ef4444":"transparent",color:st==="nogo"?"#fff":"#555",fontSize:9,fontWeight:700,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center"}}>NO</button>
            </div>
            <div style={{flex:1}}>
              <div style={{fontSize:13,color:st==="go"?"#888":st==="nogo"?"#ef4444":"#ccc",lineHeight:1.5}}>{step.critical&&<span style={{fontSize:9,fontWeight:700,color:"#f59e0b",background:"#f59e0b18",padding:"1px 4px",borderRadius:3,marginRight:6}}>C</span>}{step.text}</div>
            </div>
          </div>)
        })}
        <button style={{...S.btn("#555",false),marginTop:16}} onClick={()=>setGradeStates({...gradeStates,[key]:{}})}>Reset Grade Sheet</button>
      </div></div>
      <Bar active="grades"/>
    </div>);
  }

  return (<div style={S.app}><div style={S.hdr}><div><div style={{fontSize:16,fontWeight:700}}>Skills Grade Sheets</div><div style={{fontSize:10,color:"#666",marginTop:1,textTransform:"uppercase",letterSpacing:".04em"}}>TCCC GO / NO-GO Evaluation</div></div></div>
    <div ref={ref} style={S.body}>
      <div style={{fontSize:12,color:"#666",lineHeight:1.6,padding:"14px 0 12px"}}>Practice to the official TCCC evaluation standard. Critical tasks marked (C) must all pass for GO.</div>
      {GRADE_SHEETS.map((gs,gi)=>(
        <div key={gi} style={S.card} onClick={()=>setGradeSheet(gi)}>
          <div style={{display:"flex",alignItems:"center",gap:11}}><div style={{width:10,height:10,borderRadius:3,background:gs.color,flexShrink:0}}/><div style={{flex:1}}><div style={{fontSize:14,fontWeight:600}}>{gs.title}</div><div style={{fontSize:11,color:"#666",marginTop:2}}>{gs.tier} | {gs.steps.length} steps | {gs.steps.filter(s=>s.critical).length} critical</div></div><span style={{color:"#444"}}>{">"}</span></div>
        </div>
      ))}
    </div>
    <Bar active="grades"/>
  </div>);
}
