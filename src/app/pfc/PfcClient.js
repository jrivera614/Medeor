"use client";
import { useState, useCallback, useEffect } from "react";
import { useAppState, S, Bar, Prog } from "../components";

const SAVE_KEY = "medeor_pfc_card";

const TABS = ["Info","MIST","Hx","TQ","Labs","Tx","Vitals","Vent","PPGC"];

const TX_ITEMS = [
  "Send MIST Report","Stop Massive Bleeding","Pelvic/Feet Binder",
  "Convert TQ <4hrs","Open Airway","Upgrade/Secure Airway",
  "Awake/Post-Cric Checklist","BVM or Vent w/ PEEP",
  "Needle-D / Finger-T / Thoracostomy","Initiate Blood Transfusion",
  "TXA 2g Slow Push (<3 hrs)","Calcium","2nd IV/IO",
  "Pressors for Distributive Shock?","Peripheral Pulses",
  "Hypothermia Tx/Prevention","Analgesia Management",
  "Procedural Sedation","Antibiotics/War Wound Tx",
  "Irrigate/Debride/Dress","Tetanus Status",
  "Reduce/Pad/Splint Fx","Position/Pad Patient",
  "DVT Prophylaxis","Foley/Bladder Tap","UA Dipstick",
  "Labs (if available)","Fasciotomy","Confirm TBSA & Burn Fluids",
  "Escharotomy","Teleconsult Prep & Call","Expose Patient",
  "Reassess All Treatments","US: EFAST/RUSH/ONDS",
  "Detailed Exam","Attach Monitors","GCS/Neuro/MACE",
  "NG/OG Tube","Adjust Vent (ABG?)","X-Ray/Imaging",
  "PreOp Eval","Amputation","Shunt",
  "Preperitoneal Pelvic Packing","Clear C-Spine",
];

const PRIORITIES = [
  "Complete initial life saving TCCC","Initiate palliative care for expectants",
  "Delineate roles and responsibilities","Perform comprehensive exam and history",
  "Make problem list","Chart and trend vital signs","Perform telemedical consult",
  "Create a nursing care plan","Plan for resupply and electrical issues",
  "Perform tactical timeout/mini rounds","Implement wake/rest/chow plan",
  "Obtain and interpret lab studies","Make detailed analgesia & sedation plan",
  "Perform necessary surgical procedures","Prepare handover documentation & supply",
  "Prepare team for evac care","Submit medical AAR to JTS",
  "Submit operational AAR to Command","Send lessons to prolongedfieldcare.org",
];

const LABS = [
  {n:"pH",r:"7.32-.41"},{n:"pCO2",r:"42-53"},{n:"pO2",r:"35-42"},
  {n:"HCO3",r:"24-28"},{n:"SO2%",r:"70-75"},{n:"Base D/E",r:"-2 to 2"},
  {n:"Na+",r:"136-145"},{n:"K+",r:"3.5-5.0"},{n:"Ca++",r:"8.6-10.2"},
  {n:"Cl-",r:"98-106"},{n:"BUN",r:"8-20"},{n:"Creat",r:"M:.7-1.3/F:.5-1.1"},
  {n:"Gluc",r:"70-99"},{n:"WBC",r:"3200-9800"},{n:"PLT",r:"150-450"},
  {n:"HCT%",r:"M:42-50/F:37-47"},{n:"Hgb",r:"M:14-18/F:12-16"},
  {n:"Agap",r:"7-13"},{n:"PT/INR",r:"11-13/0.8-1.2"},{n:"Lact",r:"0.4-2.3"},
];

const VENT_FIELDS = ["Mode","Flow Rate","Tidal Volume","Vent Rate","FiO2%","PEEP","Pplat","Drive P","PIP","I:E Ratio"];

const inp = { width:"100%",padding:"9px 12px",background:"#ffffff08",border:"1px solid #ffffff14",borderRadius:10,color:"#e8e8ed",fontSize:13,fontFamily:"inherit",outline:"none",boxSizing:"border-box" };
const lbl = { fontSize:11,color:"#666",display:"block",marginBottom:3,letterSpacing:".03em" };
const sec = { fontSize:13,fontWeight:700,color:"#8b5cf6",textTransform:"uppercase",letterSpacing:".06em",padding:"14px 0 8px",borderBottom:"1px solid #ffffff10",marginBottom:10 };

function F({label,value,onChange,area,half}){
  const w = half ? {width:"48%",display:"inline-block",verticalAlign:"top",marginRight:"2%"} : {};
  return <div style={{marginBottom:10,...w}}><label style={lbl}>{label}</label>
    {area ? <textarea value={value} onChange={e=>onChange(e.target.value)} rows={2} style={{...inp,resize:"vertical"}}/> :
    <input type="text" value={value} onChange={e=>onChange(e.target.value)} style={inp}/>}
  </div>;
}

export default function PfcClient(){
  const {ref} = useAppState();
  const [loaded,setLoaded] = useState(false);
  const [tab,setTab] = useState(0);
  const [pt,setPt] = useState({name:"",id:"",date:new Date().toISOString().split("T")[0],time:new Date().toTimeString().slice(0,5),tz:"",wtkg:"",wtlbs:"",ht:"",ibw:"",blood:"",titer:"",triage:"",evac:"",status:""});
  const [mist,setMist] = useState({m:"",i:"",s:"",t:"",time:"",to:""});
  const [hx,setHx] = useState({allergies:"",meds:"",past:"",oral:"",events:""});
  const [tq,setTq] = useState({t1on:"",t1c:"",t2on:"",t2c:"",t3on:"",t3c:"",t4on:"",t4c:"",txa:"",ca:""});
  const [labR,setLabR] = useState(()=>Object.fromEntries(LABS.map(l=>[l.n,""])));
  const [checks,setChecks] = useState(()=>Object.fromEntries(TX_ITEMS.map(i=>[i,false])));
  const [checkT,setCheckT] = useState(()=>Object.fromEntries(TX_ITEMS.map(i=>[i,""])));
  const [prio,setPrio] = useState(()=>Object.fromEntries(PRIORITIES.map(p=>[p,false])));
  const [vitals,setVitals] = useState([]);
  const [vent,setVent] = useState(()=>Object.fromEntries(VENT_FIELDS.map(f=>[f,""])));
  const [ppgc,setPpgc] = useState({problems:"",plans:"",goals:"",concerns:""});

  // Load from localStorage on mount
  useEffect(()=>{
    try{
      const raw = localStorage.getItem(SAVE_KEY);
      if(raw){
        const s = JSON.parse(raw);
        if(s.tab!==undefined) setTab(s.tab);
        if(s.pt) setPt(s.pt);
        if(s.mist) setMist(s.mist);
        if(s.hx) setHx(s.hx);
        if(s.tq) setTq(s.tq);
        if(s.labR) setLabR(s.labR);
        if(s.checks) setChecks(s.checks);
        if(s.checkT) setCheckT(s.checkT);
        if(s.prio) setPrio(s.prio);
        if(s.vitals) setVitals(s.vitals);
        if(s.vent) setVent(s.vent);
        if(s.ppgc) setPpgc(s.ppgc);
      }
    }catch(e){}
    setLoaded(true);
  },[]);

  // Save to localStorage on every state change
  useEffect(()=>{
    if(!loaded) return;
    try{
      localStorage.setItem(SAVE_KEY, JSON.stringify({tab,pt,mist,hx,tq,labR,checks,checkT,prio,vitals,vent,ppgc}));
    }catch(e){}
  },[loaded,tab,pt,mist,hx,tq,labR,checks,checkT,prio,vitals,vent,ppgc]);

  const up = s => (k,v) => s(p=>({...p,[k]:v}));
  const txDone = Object.values(checks).filter(Boolean).length;
  const prioDone = Object.values(prio).filter(Boolean).length;

  const toggleTx = (item) => {
    const next = !checks[item];
    setChecks(p=>({...p,[item]:next}));
    if(next) setCheckT(p=>({...p,[item]:new Date().toTimeString().slice(0,5)}));
  };

  const addVital = () => {
    setVitals(p=>[...p,{time:new Date().toTimeString().slice(0,5),hr:"",bp:"",rr:"",spo2:"",etco2:"",temp:"",gcs:"",pain:"",notes:""}]);
  };
  const upV = (i,k,v) => setVitals(p=>p.map((x,j)=>j===i?{...x,[k]:v}:x));

  // PDF EXPORT
  const exportPDF = () => {
    const w = window.open("","_blank");
    const h = (t) => `<div style="background:#111;color:#fff;padding:4px 8px;font-size:12px;font-weight:700;letter-spacing:1px;margin:14px 0 6px">${t}</div>`;
    const f = (l,v) => `<div style="display:inline-block;margin:2px 8px 2px 0"><span style="font-size:9px;color:#888;text-transform:uppercase">${l}</span><div style="font-size:12px;border-bottom:1px solid #ccc;min-width:60px;padding:1px 0">${v||"&mdash;"}</div></div>`;
    const chk = (label,done,time) => `<div style="display:flex;align-items:center;gap:4px;padding:2px 0;font-size:11px;${done?"color:#2e7d32":""}"><span style="display:inline-block;width:11px;height:11px;border:1px solid ${done?"#2e7d32":"#999"};${done?"background:#2e7d32;color:#fff;":""}font-size:9px;text-align:center;line-height:11px">${done?"✓":""}</span>${label}${time?` <span style="color:#999;font-size:9px">(${time})</span>`:""}</div>`;

    w.document.write(`<!DOCTYPE html><html><head><title>PFC Card - ${pt.name||"Patient"}</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:-apple-system,sans-serif;font-size:11px;padding:12px;max-width:960px;margin:0 auto}table{width:100%;border-collapse:collapse}th,td{border:1px solid #ddd;padding:3px 6px;font-size:10px;text-align:left}th{background:#f0f0f0;font-weight:600}.cols{display:flex;gap:8px}.cols>div{flex:1}@media print{body{padding:6px}}</style></head><body>`);
    w.document.write(`<div style="text-align:center;font-size:15px;font-weight:800;border-bottom:2px solid #000;padding-bottom:4px;margin-bottom:8px">PROLONGED FIELD CARE CASUALTY CARD</div>`);
    w.document.write(`<div style="text-align:right;font-size:8px;color:#999;margin-top:-6px;margin-bottom:6px">Generated ${new Date().toLocaleString()} | Based on PFC CC v25</div>`);

    // Patient
    w.document.write(h("PATIENT INFO"));
    [["Name",pt.name],["ID",pt.id],["Date",pt.date],["Time",pt.time],["TZ",pt.tz],["Wt kg",pt.wtkg],["Wt lbs",pt.wtlbs],["Ht",pt.ht],["IBW",pt.ibw],["Blood",pt.blood],["Titer",pt.titer],["Triage",pt.triage],["EVAC",pt.evac],["Status",pt.status]].forEach(([l,v])=>w.document.write(f(l,v)));

    // MIST
    w.document.write(h("M.I.S.T. REPORT"));
    [["Mechanism",mist.m],["Injuries",mist.i],["Signs/Symptoms",mist.s],["Treatment",mist.t],["Report Time",mist.time],["Reported To",mist.to]].forEach(([l,v])=>w.document.write(`<div style="margin-bottom:4px"><span style="font-size:9px;color:#888">${l}</span><div style="font-size:11px;border-bottom:1px solid #eee;min-height:14px">${v||""}</div></div>`));

    // History
    w.document.write(h("MEDICAL HISTORY"));
    [["Allergies",hx.allergies],["Medications",hx.meds],["Past Hx",hx.past],["Last Oral Intake",hx.oral],["Events",hx.events]].forEach(([l,v])=>w.document.write(`<div style="margin-bottom:4px"><span style="font-size:9px;color:#888">${l}</span><div style="font-size:11px;border-bottom:1px solid #eee;min-height:14px">${v||""}</div></div>`));

    // TQ
    w.document.write(h("TOURNIQUET / TXA / CALCIUM"));
    [["TQ1 On",tq.t1on],["TQ1 Conv",tq.t1c],["TQ2 On",tq.t2on],["TQ2 Conv",tq.t2c],["TQ3 On",tq.t3on],["TQ3 Conv",tq.t3c],["TQ4 On",tq.t4on],["TQ4 Conv",tq.t4c],["TXA 2g",tq.txa],["Ca 1g",tq.ca]].forEach(([l,v])=>w.document.write(f(l,v)));

    // Labs
    w.document.write(h("LAB VALUES"));
    w.document.write(`<table><tr><th>Test</th><th>Reference</th><th>Result</th></tr>`);
    LABS.forEach(l=>w.document.write(`<tr><td>${l.n}</td><td style="color:#888">${l.r}</td><td style="font-weight:600">${labR[l.n]||""}</td></tr>`));
    w.document.write(`</table>`);

    // Treatment
    w.document.write(h(`TREATMENT CHECKLIST (${txDone}/${TX_ITEMS.length})`));
    w.document.write(`<div class="cols"><div>`);
    const half = Math.ceil(TX_ITEMS.length/2);
    TX_ITEMS.forEach((item,i)=>{
      if(i===half) w.document.write(`</div><div>`);
      w.document.write(chk(item,checks[item],checkT[item]));
    });
    w.document.write(`</div></div>`);

    // Priorities
    w.document.write(h(`PRIORITIES (${prioDone}/${PRIORITIES.length})`));
    w.document.write(`<div class="cols"><div>`);
    const phalf = Math.ceil(PRIORITIES.length/2);
    PRIORITIES.forEach((p,i)=>{
      if(i===phalf) w.document.write(`</div><div>`);
      w.document.write(chk(p,prio[p],""));
    });
    w.document.write(`</div></div>`);

    // Vitals
    if(vitals.length){
      w.document.write(h("VITAL SIGNS"));
      w.document.write(`<table><tr><th>Time</th><th>HR</th><th>BP</th><th>RR</th><th>SpO2</th><th>ETCO2</th><th>Temp</th><th>GCS</th><th>Pain</th><th>Notes</th></tr>`);
      vitals.forEach(v=>w.document.write(`<tr><td>${v.time}</td><td>${v.hr}</td><td>${v.bp}</td><td>${v.rr}</td><td>${v.spo2}</td><td>${v.etco2}</td><td>${v.temp}</td><td>${v.gcs}</td><td>${v.pain}</td><td>${v.notes}</td></tr>`));
      w.document.write(`</table>`);
    }

    // Vent
    w.document.write(h("VENTILATOR SETTINGS"));
    VENT_FIELDS.forEach(vf=>w.document.write(f(vf,vent[vf])));

    // PPGC
    w.document.write(h("PROBLEMS / PLANS / GOALS / CONCERNS"));
    w.document.write(`<div class="cols">`);
    [["Problems",ppgc.problems],["Plans",ppgc.plans],["Goals",ppgc.goals],["Concerns",ppgc.concerns]].forEach(([l,v])=>w.document.write(`<div style="border:1px solid #ddd;padding:6px;min-height:50px"><div style="font-weight:700;font-size:10px;margin-bottom:2px">${l}</div><div style="font-size:11px">${v||""}</div></div>`));
    w.document.write(`</div>`);

    w.document.write(`<div style="text-align:center;margin-top:12px;font-size:8px;color:#aaa">Based on PFC CC v25 (8July2023) | prolongedfieldcare.org | Generated via medeor.app</div>`);
    w.document.write(`<script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.2/html2pdf.bundle.min.js"><\/script>`);
    w.document.write(`<script>
      window.onload = function(){
        const el = document.body;
        const name = "${(pt.name||"Patient").replace(/[^a-zA-Z0-9]/g,"_")}";
        const dt = "${pt.date||new Date().toISOString().split("T")[0]}";
        html2pdf().set({
          margin:[8,8,8,8],
          filename:"PFC_Card_"+name+"_"+dt+".pdf",
          image:{type:"jpeg",quality:0.98},
          html2canvas:{scale:2},
          jsPDF:{unit:"mm",format:"letter",orientation:"portrait"}
        }).from(el).save();
      };
    <\/script>`);
    w.document.write(`</body></html>`);
    w.document.close();
  };

  const content = () => {
    switch(tab){
      case 0: return <>
        <div style={sec}>Patient Information</div>
        <F label="Name" value={pt.name} onChange={v=>up(setPt)("name",v)}/>
        <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
          <div style={{flex:"1 1 48%"}}><F label="ID Number" value={pt.id} onChange={v=>up(setPt)("id",v)}/></div>
          <div style={{flex:"1 1 30%"}}><F label="Date" value={pt.date} onChange={v=>up(setPt)("date",v)}/></div>
          <div style={{flex:"1 1 18%"}}><F label="Time" value={pt.time} onChange={v=>up(setPt)("time",v)}/></div>
        </div>
        <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
          {[["Time Zone","tz"],["Wt kg","wtkg"],["Wt lbs","wtlbs"],["Height","ht"],["Ideal Body Wt","ibw"]].map(([l,k])=>
            <div key={k} style={{flex:"1 1 18%"}}><F label={l} value={pt[k]} onChange={v=>up(setPt)(k,v)}/></div>
          )}
        </div>
        <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
          {[["Blood Type","blood"],["Titer","titer"],["Triage","triage"],["EVAC","evac"]].map(([l,k])=>
            <div key={k} style={{flex:"1 1 22%"}}><F label={l} value={pt[k]} onChange={v=>up(setPt)(k,v)}/></div>
          )}
        </div>
        <label style={lbl}>Status</label>
        <div style={{display:"flex",gap:8,marginBottom:10}}>
          {["Stable","Unstable"].map(s=>(
            <button key={s} onClick={()=>up(setPt)("status",s)} style={{flex:1,padding:"10px",borderRadius:10,border:`2px solid ${pt.status===s?(s==="Stable"?"#10b981":"#ef4444"):"#ffffff14"}`,background:pt.status===s?(s==="Stable"?"#10b98118":"#ef444418"):"transparent",color:pt.status===s?(s==="Stable"?"#10b981":"#ef4444"):"#666",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>{s}</button>
          ))}
        </div>
      </>;
      case 1: return <>
        <div style={sec}>M.I.S.T. Report</div>
        <F label="M - Mechanism of Injury" value={mist.m} onChange={v=>up(setMist)("m",v)} area/>
        <F label="I - Injuries Found" value={mist.i} onChange={v=>up(setMist)("i",v)} area/>
        <F label="S - Signs / Symptoms" value={mist.s} onChange={v=>up(setMist)("s",v)} area/>
        <F label="T - Treatment Given" value={mist.t} onChange={v=>up(setMist)("t",v)} area/>
        <div style={{display:"flex",gap:8}}>
          <div style={{flex:1}}><F label="Report Time" value={mist.time} onChange={v=>up(setMist)("time",v)}/></div>
          <div style={{flex:1}}><F label="Reported To" value={mist.to} onChange={v=>up(setMist)("to",v)}/></div>
        </div>
      </>;
      case 2: return <>
        <div style={sec}>Medical History</div>
        <F label="Allergies" value={hx.allergies} onChange={v=>up(setHx)("allergies",v)} area/>
        <F label="Medications" value={hx.meds} onChange={v=>up(setHx)("meds",v)} area/>
        <F label="Past Pertinent History" value={hx.past} onChange={v=>up(setHx)("past",v)} area/>
        <F label="Last Oral Intake" value={hx.oral} onChange={v=>up(setHx)("oral",v)}/>
        <F label="Events Leading to Illness/Injury" value={hx.events} onChange={v=>up(setHx)("events",v)} area/>
      </>;
      case 3: return <>
        <div style={sec}>Tourniquet / TXA / Calcium</div>
        {[1,2,3,4].map(i=>(
          <div key={i} style={{display:"flex",gap:8,marginBottom:2}}>
            <div style={{flex:1}}><F label={`TQ ${i} Time On`} value={tq[`t${i}on`]} onChange={v=>up(setTq)(`t${i}on`,v)}/></div>
            <div style={{flex:1}}><F label={`TQ ${i} Converted`} value={tq[`t${i}c`]} onChange={v=>up(setTq)(`t${i}c`,v)}/></div>
          </div>
        ))}
        <div style={{height:1,background:"#ffffff10",margin:"6px 0 10px"}}/>
        <div style={{display:"flex",gap:8}}>
          <div style={{flex:1}}><F label="2g TXA Slow Push" value={tq.txa} onChange={v=>up(setTq)("txa",v)}/></div>
          <div style={{flex:1}}><F label="1g Calcium Given At" value={tq.ca} onChange={v=>up(setTq)("ca",v)}/></div>
        </div>
        <div style={{fontSize:10,color:"#555",fontStyle:"italic"}}>1g elemental Ca = 10cc CaCl or 30cc Ca Gluconate</div>
      </>;
      case 4: return <>
        <div style={sec}>Lab Values</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 100px 90px",gap:0,fontSize:10,borderBottom:"1px solid #ffffff10",padding:"4px 0"}}>
          <div style={{fontWeight:700,color:"#888"}}>Test</div><div style={{fontWeight:700,color:"#888"}}>Reference</div><div style={{fontWeight:700,color:"#888"}}>Result</div>
        </div>
        {LABS.map((l,i)=>(
          <div key={l.n} style={{display:"grid",gridTemplateColumns:"1fr 100px 90px",gap:0,padding:"5px 0",borderBottom:"1px solid #ffffff06",background:i%2===0?"#ffffff04":"transparent"}}>
            <div style={{fontSize:12,fontWeight:500,color:"#ccc"}}>{l.n}</div>
            <div style={{fontSize:10,color:"#666"}}>{l.r}</div>
            <div><input type="text" value={labR[l.n]} onChange={e=>setLabR(p=>({...p,[l.n]:e.target.value}))} style={{...inp,padding:"4px 6px",fontSize:12,borderRadius:6}}/></div>
          </div>
        ))}
      </>;
      case 5: return <>
        <div style={{...sec,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span>Treatment Checklist</span>
          <span style={{fontSize:12,color:txDone===TX_ITEMS.length?"#10b981":"#666",fontWeight:400}}>{txDone}/{TX_ITEMS.length}</span>
        </div>
        <Prog c={txDone} t={TX_ITEMS.length}/>
        <div style={{marginTop:10}}>
          {TX_ITEMS.map(item=>(
            <div key={item} onClick={()=>toggleTx(item)} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 0",borderBottom:"1px solid #ffffff06",cursor:"pointer"}}>
              <div style={{width:22,height:22,borderRadius:6,border:`2px solid ${checks[item]?"#10b981":"#ffffff18"}`,background:checks[item]?"#10b981":"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all .15s"}}>
                {checks[item]&&<span style={{color:"#fff",fontSize:12,fontWeight:700}}>✓</span>}
              </div>
              <div style={{flex:1,fontSize:13,color:checks[item]?"#666":"#ccc",textDecoration:checks[item]?"line-through":"none",transition:"all .15s"}}>{item}</div>
              {checkT[item]&&<span style={{fontSize:10,color:"#555",fontFamily:"monospace"}}>{checkT[item]}</span>}
            </div>
          ))}
        </div>
        <div style={{...sec,display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:16}}>
          <span>Priorities & Principles</span>
          <span style={{fontSize:12,color:prioDone===PRIORITIES.length?"#10b981":"#666",fontWeight:400}}>{prioDone}/{PRIORITIES.length}</span>
        </div>
        <Prog c={prioDone} t={PRIORITIES.length}/>
        <div style={{marginTop:10}}>
          {PRIORITIES.map(p=>(
            <div key={p} onClick={()=>setPrio(prev=>({...prev,[p]:!prev[p]}))} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:"1px solid #ffffff06",cursor:"pointer"}}>
              <div style={{width:20,height:20,borderRadius:5,border:`2px solid ${prio[p]?"#8b5cf6":"#ffffff18"}`,background:prio[p]?"#8b5cf6":"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all .15s"}}>
                {prio[p]&&<span style={{color:"#fff",fontSize:11,fontWeight:700}}>✓</span>}
              </div>
              <div style={{flex:1,fontSize:12,color:prio[p]?"#666":"#bbb",textDecoration:prio[p]?"line-through":"none"}}>{p}</div>
            </div>
          ))}
        </div>
      </>;
      case 6: return <>
        <div style={sec}>Vital Signs</div>
        <button onClick={addVital} style={{...S.btn("#8b5cf6",true),marginBottom:14,padding:"10px 16px",fontSize:13}}>+ Record Vitals</button>
        {vitals.length===0&&<div style={{color:"#555",fontSize:13,padding:12}}>No vitals recorded. Tap above to add a set.</div>}
        {vitals.map((v,idx)=>(
          <div key={idx} style={{background:"#ffffff06",border:"1px solid #ffffff0f",borderRadius:12,padding:12,marginBottom:10}}>
            <div style={{fontSize:11,fontWeight:700,color:"#8b5cf6",marginBottom:8,fontFamily:"monospace"}}>Set {idx+1} — {v.time}</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
              {[["HR","hr"],["BP","bp"],["RR","rr"],["SpO2","spo2"],["ETCO2","etco2"],["Temp","temp"],["GCS","gcs"],["Pain","pain"]].map(([l,k])=>(
                <div key={k} style={{flex:"1 1 22%",minWidth:60}}>
                  <label style={{fontSize:9,color:"#666"}}>{l}</label>
                  <input type="text" value={v[k]} onChange={e=>upV(idx,k,e.target.value)} style={{...inp,padding:"5px 8px",fontSize:12,borderRadius:7}}/>
                </div>
              ))}
            </div>
            <div style={{marginTop:6}}><F label="Notes" value={v.notes} onChange={val=>upV(idx,"notes",val)}/></div>
          </div>
        ))}
      </>;
      case 7: return <>
        <div style={sec}>Ventilator Settings</div>
        {VENT_FIELDS.map(vf=>(
          <F key={vf} label={vf} value={vent[vf]} onChange={v=>setVent(p=>({...p,[vf]:v}))}/>
        ))}
      </>;
      case 8: return <>
        <div style={sec}>Problems / Plans / Goals / Concerns</div>
        <F label="Problems" value={ppgc.problems} onChange={v=>up(setPpgc)("problems",v)} area/>
        <F label="Plans" value={ppgc.plans} onChange={v=>up(setPpgc)("plans",v)} area/>
        <F label="Goals" value={ppgc.goals} onChange={v=>up(setPpgc)("goals",v)} area/>
        <F label="Concerns" value={ppgc.concerns} onChange={v=>up(setPpgc)("concerns",v)} area/>
      </>;
    }
  };

  return (
    <div style={{fontFamily:"'DM Sans',system-ui,sans-serif",background:"#0a0a0f",color:"#e8e8ed",minHeight:"100dvh",maxWidth:480,margin:"0 auto"}}>
      <style dangerouslySetInnerHTML={{__html:`.pfc-tabs::-webkit-scrollbar{display:none}`}}/>

      {/* Header */}
      <div style={{position:"fixed",top:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,zIndex:20,background:"rgba(10,10,15,.97)",borderBottom:"1px solid #ffffff0f",padding:"12px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",backdropFilter:"blur(20px)"}}>
        <div>
          <div style={{fontSize:14,fontWeight:700}}>PFC Casualty Card</div>
          <div style={{fontSize:9,color:"#555"}}>Based on PFC CC v25 | Interactive + PDF Export</div>
        </div>
        <button onClick={exportPDF} style={{background:"#8b5cf6",border:"none",color:"#fff",padding:"6px 12px",borderRadius:8,fontSize:11,fontWeight:700,cursor:"pointer",letterSpacing:".04em",fontFamily:"inherit"}}>EXPORT</button>
      </div>

      {/* Tabs */}
      <div className="pfc-tabs" style={{position:"fixed",top:53,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,zIndex:19,display:"flex",overflowX:"auto",borderBottom:"1px solid #ffffff0f",background:"rgba(10,10,15,.97)",WebkitOverflowScrolling:"touch",scrollbarWidth:"none",msOverflowStyle:"none"}}>
        {TABS.map((t,i)=>(
          <button key={t} onClick={()=>setTab(i)} style={{padding:"8px 14px",fontSize:11,fontWeight:tab===i?700:400,color:tab===i?"#8b5cf6":"#555",background:tab===i?"#8b5cf618":"transparent",border:"none",borderBottom:tab===i?"2px solid #8b5cf6":"2px solid transparent",cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap",flexShrink:0}}>
            {t}
            {i===5&&txDone>0&&<span style={{marginLeft:3,fontSize:8,background:"#10b981",color:"#fff",borderRadius:6,padding:"1px 4px"}}>{txDone}</span>}
          </button>
        ))}
      </div>

      {/* Content - uses native page scroll */}
      <div style={{paddingTop:90,paddingBottom:120,paddingLeft:16,paddingRight:16}}>
        {content()}
      </div>

      {/* Nav */}
      <div style={{position:"fixed",bottom:52,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 16px",background:"rgba(10,10,15,.97)",borderTop:"1px solid #ffffff08",zIndex:15}}>
        <button onClick={()=>setTab(Math.max(0,tab-1))} disabled={tab===0} style={{padding:"7px 18px",background:tab===0?"#ffffff06":"#ffffff10",border:"none",borderRadius:8,color:tab===0?"#333":"#aaa",fontSize:12,fontWeight:600,cursor:tab===0?"default":"pointer",fontFamily:"inherit"}}>← Back</button>
        <span style={{fontSize:10,color:"#444",alignSelf:"center",fontFamily:"monospace"}}>{tab+1}/{TABS.length}</span>
        <button onClick={()=>setTab(Math.min(TABS.length-1,tab+1))} disabled={tab===TABS.length-1} style={{padding:"7px 18px",background:tab===TABS.length-1?"#ffffff06":"#8b5cf6",border:"none",borderRadius:8,color:tab===TABS.length-1?"#333":"#fff",fontSize:12,fontWeight:600,cursor:tab===TABS.length-1?"default":"pointer",fontFamily:"inherit"}}>Next →</button>
      </div>

      <Bar active="tools"/>
    </div>
  );
}
