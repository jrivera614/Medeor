"use client";
import { useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppState, S, Bar, Prog } from "../components";
import { TOPICS } from "../data";

export default function ModulePage() {
  const params = useParams();
  const router = useRouter();
  const { progress, saveProgress, cookieConsent, handleCookieConsent, emailCapture, setEmailCapture, ref, fade, tr } = useAppState();

   const reserved = ["cpgs","videos","rmh","tools","contact","privacy","terms","grades"];
  if (reserved.includes(params.module)) return null;
  const topic = TOPICS.find(t => t.id === params.module);
  const [view, setView] = useState("menu");
  const [quiz, setQuiz] = useState({ i: 0, ans: [], done: false, sel: null });
  const [flash, setFlash] = useState({ i: 0, flip: false });
  const [step, setStep] = useState({ i: 0 });
  const [scen, setScen] = useState({ si: 0, di: 0, sel: null, hist: [], done: false });
  const [missedCards, setMissedCards] = useState([]);
  const [spacedMode, setSpacedMode] = useState(false);

  const nav = useCallback((v, fn) => { tr(() => { fn && fn(); setView(v); }); }, [tr]);

  if (!topic) return (<div style={S.app}><div style={S.hdr}><button style={S.back} onClick={()=>router.push("/")}>←</button><div>Module not found</div></div><Bar active="train" cookieConsent={cookieConsent} handleCookieConsent={handleCookieConsent} emailCapture={emailCapture} setEmailCapture={setEmailCapture}/></div>);

  const isScen = !!topic.scenarios;
  const bodyStyle = {...S.body, opacity: fade ? 1 : 0, transform: fade ? "none" : "translateY(5px)"};

  // TOPIC MENU
  if (view === "menu") {
    const modes = isScen ? [{ key:"scenarios",label:"Tactical Scenarios",desc:`${topic.scenarios.length} scenarios`,icon:"⏱️" }]
      : [{ key:"steps",label:"Step-by-Step",desc:`${topic.steps.length} steps`,icon:"📖" },{ key:"quiz",label:"Quiz",desc:`${topic.quiz.length} questions`,icon:"✅" },{ key:"flashcards",label:"Flashcards",desc:`${topic.flashcards.length} cards`,icon:"🃏" }];
    const qp = progress[`quiz_${topic.id}`];
    return (<div style={S.app}><div style={S.hdr}><button style={S.back} onClick={()=>router.push("/")}>←</button><div><div style={{fontSize:15,fontWeight:700}}>{topic.icon} {topic.title}</div><div style={{fontSize:11,color:"#666"}}>{topic.subtitle}</div></div></div>
      <div ref={ref} style={bodyStyle}><div style={{padding:"16px 0"}}>
        {qp && <div style={{background:"#10b9810a",border:"1px solid #10b98120",borderRadius:10,padding:"10px 14px",marginBottom:12,display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontSize:12,color:"#10b981"}}>Best quiz score</span><span style={{fontSize:16,fontWeight:700,color:"#10b981"}}>{qp.score}%</span></div>}
        {modes.map(m=>(<div key={m.key} style={{...S.card,display:"flex",alignItems:"center",gap:11}} onMouseEnter={e=>e.currentTarget.style.background="#ffffff0f"} onMouseLeave={e=>e.currentTarget.style.background="#ffffff08"} onClick={()=>{
          if(m.key==="steps") nav("steps",()=>setStep({i:0}));
          else if(m.key==="quiz") nav("quiz",()=>setQuiz({i:0,ans:[],done:false,sel:null}));
          else if(m.key==="flashcards") nav("flashcards",()=>{setFlash({i:0,flip:false});setMissedCards([]);setSpacedMode(false);});
          else if(m.key==="scenarios") nav("scenarios");
        }}><span style={{fontSize:20}}>{m.icon}</span><div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>{m.label}</div><div style={{fontSize:11,color:"#666",marginTop:1}}>{m.desc}</div></div><span style={{color:"#444"}}>›</span></div>))}
      </div></div><Bar active="train" cookieConsent={cookieConsent} handleCookieConsent={handleCookieConsent} emailCapture={emailCapture} setEmailCapture={setEmailCapture}/></div>);
  }

  // STEPS
  if (view === "steps") {
    const st = topic.steps[step.i];
    return (<div style={S.app}><div style={S.hdr}><button style={S.back} onClick={()=>nav("menu")}>←</button><div style={{flex:1}}><div style={{fontSize:12,fontWeight:600}}>Step {step.i+1}/{topic.steps.length}</div><Prog c={step.i+1} t={topic.steps.length}/></div></div>
      <div ref={ref} style={bodyStyle}><div style={{padding:"20px 0 10px"}}>
        <span style={{fontSize:10,fontWeight:700,color:topic.color,textTransform:"uppercase",letterSpacing:".06em",background:`${topic.color}18`,padding:"2px 8px",borderRadius:6}}>{topic.title}</span>
        <h2 style={{fontSize:18,fontWeight:700,marginTop:12,marginBottom:8,lineHeight:1.3}}>{st.title}</h2>
        <p style={{fontSize:13,color:"#aaa",lineHeight:1.7,margin:"0 0 16px"}}>{st.detail}</p>
        <div style={{background:`${topic.color}0a`,border:`1px solid ${topic.color}25`,borderRadius:11,padding:14}}>
          <div style={{fontSize:9,fontWeight:700,color:topic.color,textTransform:"uppercase",letterSpacing:".08em",marginBottom:6}}>Field Instruction</div>
          <p style={{fontSize:12,color:"#ccc",lineHeight:1.7,margin:0}}>{st.instruction}</p>
        </div>
      </div>
      <div style={{display:"flex",gap:8,paddingTop:10}}>
        <button style={{...S.btn("#555",false),opacity:step.i===0?.3:1}} disabled={step.i===0} onClick={()=>tr(()=>setStep({i:step.i-1}))}>Prev</button>
        <button style={S.btn(topic.color,true)} onClick={()=>step.i<topic.steps.length-1?tr(()=>setStep({i:step.i+1})):(() => {saveProgress(`steps_${topic.id}`, {done:true});nav("menu")})()}>{step.i<topic.steps.length-1?"Next":"Done"}</button>
      </div></div><Bar active="train" cookieConsent={cookieConsent} handleCookieConsent={handleCookieConsent} emailCapture={emailCapture} setEmailCapture={setEmailCapture}/></div>);
  }

  // QUIZ
  if (view === "quiz") {
    if (quiz.done) {
      const c=quiz.ans.filter((a,i)=>a===topic.quiz[i].correct).length; const p=Math.round(c/topic.quiz.length*100);
      const prev = progress[`quiz_${topic.id}`]; const isBest = !prev || p > prev.score;
      if (isBest) saveProgress(`quiz_${topic.id}`, { score: p, correct: c, total: topic.quiz.length });
      return (<div style={S.app}><div style={S.hdr}><button style={S.back} onClick={()=>nav("menu")}>←</button><div style={{fontSize:14,fontWeight:600}}>Results</div></div>
        <div ref={ref} style={bodyStyle}><div style={{textAlign:"center",padding:"36px 0 20px"}}>
          <div style={{fontSize:50,fontWeight:800,background:p>=80?"linear-gradient(135deg,#10b981,#6ee7b7)":p>=60?"linear-gradient(135deg,#f59e0b,#fcd34d)":"linear-gradient(135deg,#ef4444,#fca5a5)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{p}%</div>
          <div style={{fontSize:13,color:"#888",marginTop:4}}>{c}/{topic.quiz.length} correct</div>
          {isBest && prev && <div style={{fontSize:11,color:"#10b981",marginTop:6}}>New best score!</div>}
          {prev && !isBest && <div style={{fontSize:11,color:"#666",marginTop:6}}>Best: {prev.score}%</div>}
          <div style={{fontSize:12,color:"#555",marginTop:12,lineHeight:1.6}}>{p>=80?"Strong performance.":p>=60?"Good foundation. Review missed areas.":"Needs more study. Hit the step-by-step guide."}</div>
        </div>
        <div style={{display:"flex",gap:8}}><button style={S.btn("#555",false)} onClick={()=>nav("quiz",()=>setQuiz({i:0,ans:[],done:false,sel:null}))}>Retry</button><button style={S.btn(topic.color,true)} onClick={()=>nav("menu")}>Back</button></div>
        </div><Bar active="train" cookieConsent={cookieConsent} handleCookieConsent={handleCookieConsent} emailCapture={emailCapture} setEmailCapture={setEmailCapture}/></div>);
    }
    const q=topic.quiz[quiz.i], a=quiz.sel!==null;
    return (<div style={S.app}><div style={S.hdr}><button style={S.back} onClick={()=>nav("menu")}>←</button><div style={{flex:1}}><div style={{fontSize:12,fontWeight:600}}>Q {quiz.i+1}/{topic.quiz.length}</div><Prog c={quiz.i+1} t={topic.quiz.length}/></div></div>
      <div ref={ref} style={bodyStyle}><div style={{padding:"20px 0 14px"}}><h3 style={{fontSize:16,fontWeight:600,lineHeight:1.5,margin:0}}>{q.q}</h3></div>
        <div style={{display:"flex",flexDirection:"column",gap:7}}>{q.options.map((o,i)=>(<button key={i} style={S.opt(quiz.sel===i,q.correct===i,a)} onClick={()=>!a&&setQuiz(p=>({...p,sel:i}))}><span style={{fontWeight:600,marginRight:7,opacity:.5}}>{String.fromCharCode(65+i)}</span>{o}</button>))}</div>
        {a&&q.why&&<div style={{marginTop:12,background:quiz.sel===q.correct?"#10b9810c":"#ef44440c",border:`1px solid ${quiz.sel===q.correct?"#10b98120":"#ef444420"}`,borderRadius:11,padding:13}}><div style={{fontSize:10,fontWeight:700,color:quiz.sel===q.correct?"#10b981":"#ef4444",textTransform:"uppercase",letterSpacing:".06em",marginBottom:5}}>{quiz.sel===q.correct?"Correct":"Incorrect"}</div><div style={{fontSize:12,color:"#bbb",lineHeight:1.6}}>{q.why}</div></div>}
        {a&&<div style={{marginTop:12}}><button style={S.btn(topic.color,true)} onClick={()=>{const na=[...quiz.ans,quiz.sel];quiz.i<topic.quiz.length-1?tr(()=>setQuiz({i:quiz.i+1,ans:na,done:false,sel:null})):tr(()=>setQuiz({...quiz,ans:na,done:true}))}}>{quiz.i<topic.quiz.length-1?"Next":"Results"}</button></div>}
      </div><Bar active="train" cookieConsent={cookieConsent} handleCookieConsent={handleCookieConsent} emailCapture={emailCapture} setEmailCapture={setEmailCapture}/></div>);
  }

  // FLASHCARDS with spaced repetition
  if (view === "flashcards") {
    const deck = spacedMode && missedCards.length > 0 ? missedCards.map(i => topic.flashcards[i]) : topic.flashcards;
    const c = deck[flash.i]; const isLast = flash.i >= deck.length - 1;
    return (<div style={S.app}><div style={S.hdr}><button style={S.back} onClick={()=>{setSpacedMode(false);setMissedCards([]);nav("menu");}}>←</button><div style={{flex:1}}><div style={{fontSize:12,fontWeight:600}}>{spacedMode?"Review Mode: ":""}Card {flash.i+1}/{deck.length}</div><Prog c={flash.i+1} t={deck.length}/></div></div>
      <div ref={ref} style={bodyStyle}><div style={{padding:"24px 0"}}>
        <div onClick={()=>setFlash(p=>({...p,flip:!p.flip}))} style={{background:flash.flip?`${topic.color}0a`:"#ffffff08",border:`1.5px solid ${flash.flip?`${topic.color}30`:"#ffffff14"}`,borderRadius:16,padding:24,minHeight:160,display:"flex",flexDirection:"column",justifyContent:"center",cursor:"pointer"}}>
          <div style={{fontSize:9,fontWeight:700,color:flash.flip?topic.color:"#555",textTransform:"uppercase",letterSpacing:".08em",marginBottom:12}}>{flash.flip?"Answer":"Question"}</div>
          <div style={{fontSize:flash.flip?13:17,fontWeight:flash.flip?400:600,lineHeight:1.6,color:flash.flip?"#ccc":"#e8e8ed"}}>{flash.flip?c.back:c.front}</div>
          {!flash.flip&&<div style={{fontSize:10,color:"#444",marginTop:16,textAlign:"center"}}>Tap to reveal</div>}
        </div>
      </div>
      {flash.flip ? (
        <div style={{display:"flex",gap:8}}>
          <button style={S.btn("#ef4444",false)} onClick={()=>{
            const origIdx = spacedMode ? missedCards[flash.i] : flash.i;
            if (!missedCards.includes(origIdx)) setMissedCards(p=>[...p,origIdx]);
            isLast ? (missedCards.length > 0 ? tr(()=>{setSpacedMode(true);setFlash({i:0,flip:false})}) : (() => {saveProgress(`flash_${topic.id}`,{done:true});nav("menu")})()) : tr(()=>setFlash({i:flash.i+1,flip:false}));
          }}>Review Again</button>
          <button style={S.btn("#10b981",true)} onClick={()=>{
            if (spacedMode) { const nm = missedCards.filter((_,idx)=>idx!==flash.i); setMissedCards(nm); }
            if (isLast) { if (spacedMode && missedCards.filter((_,idx)=>idx!==flash.i).length > 0) { tr(()=>{setFlash({i:0,flip:false})}) } else { saveProgress(`flash_${topic.id}`,{done:true}); nav("menu"); } }
            else tr(()=>setFlash({i:flash.i+1,flip:false}));
          }}>Got It</button>
        </div>
      ) : (
        <div style={{display:"flex",gap:8}}><button style={{...S.btn("#555",false),opacity:flash.i===0?.3:1}} disabled={flash.i===0} onClick={()=>tr(()=>setFlash({i:flash.i-1,flip:false}))}>Prev</button><button style={S.btn(topic.color,true)} onClick={()=>setFlash(p=>({...p,flip:true}))}>Flip</button></div>
      )}
      </div><Bar active="train" cookieConsent={cookieConsent} handleCookieConsent={handleCookieConsent} emailCapture={emailCapture} setEmailCapture={setEmailCapture}/></div>);
  }

  // SCENARIOS LIST
  if (view === "scenarios" && topic?.scenarios) {
    return (<div style={S.app}><div style={S.hdr}><button style={S.back} onClick={()=>nav("menu")}>←</button><div style={{fontSize:14,fontWeight:600}}>Tactical Scenarios</div></div>
      <div ref={ref} style={bodyStyle}><div style={{padding:"16px 0"}}>
        {topic.scenarios.map((sc,i)=>(<div key={i} style={S.card} onMouseEnter={e=>e.currentTarget.style.background="#ffffff0f"} onMouseLeave={e=>e.currentTarget.style.background="#ffffff08"} onClick={()=>nav("scen-play",()=>setScen({si:i,di:0,sel:null,hist:[],done:false}))}>
          <div style={{fontSize:14,fontWeight:600,marginBottom:4}}>{sc.title}</div><div style={{fontSize:11,color:"#777"}}>{sc.decisions.length} decisions</div>
        </div>))}
      </div></div><Bar active="train" cookieConsent={cookieConsent} handleCookieConsent={handleCookieConsent} emailCapture={emailCapture} setEmailCapture={setEmailCapture}/></div>);
  }

  // SCENARIO PLAY
  if (view === "scen-play" && topic?.scenarios) {
    const sc = topic.scenarios[scen.si];
    if (scen.done) { const cc=scen.hist.filter(h=>h.ok).length;
      return (<div style={S.app}><div style={S.hdr}><button style={S.back} onClick={()=>nav("scenarios")}>←</button><div style={{fontSize:14,fontWeight:600}}>Complete</div></div>
        <div ref={ref} style={bodyStyle}><div style={{textAlign:"center",padding:"32px 0 20px"}}><div style={{fontSize:40}}>{cc===sc.decisions.length?"🏆":"📋"}</div><div style={{fontSize:18,fontWeight:700,marginTop:10}}>{sc.title}</div><div style={{fontSize:13,color:"#888",marginTop:6}}>{cc}/{sc.decisions.length} optimal</div></div>
          {scen.hist.map((h,i)=>(<div key={i} style={{background:h.ok?"#10b9810f":"#ef44440f",border:`1px solid ${h.ok?"#10b98120":"#ef444420"}`,borderRadius:10,padding:12,marginBottom:8}}><div style={{fontSize:12,fontWeight:600,color:h.ok?"#10b981":"#ef4444",marginBottom:4}}>Decision {i+1}: {h.ok?"Correct":"Suboptimal"}</div><div style={{fontSize:11,color:"#aaa",lineHeight:1.5}}>{h.result}</div></div>))}
          <div style={{display:"flex",gap:8,marginTop:12}}><button style={S.btn("#555",false)} onClick={()=>nav("scen-play",()=>setScen({si:scen.si,di:0,sel:null,hist:[],done:false}))}>Retry</button><button style={S.btn(topic.color,true)} onClick={()=>nav("scenarios")}>All Scenarios</button></div>
        </div><Bar active="train" cookieConsent={cookieConsent} handleCookieConsent={handleCookieConsent} emailCapture={emailCapture} setEmailCapture={setEmailCapture}/></div>);
    }
    const d=sc.decisions[scen.di];
    return (<div style={S.app}><div style={S.hdr}><button style={S.back} onClick={()=>nav("scenarios")}>←</button><div style={{flex:1}}><div style={{fontSize:12,fontWeight:600}}>{sc.title}</div><Prog c={scen.di+1} t={sc.decisions.length}/></div></div>
      <div ref={ref} style={bodyStyle}><div style={{padding:"16px 0"}}>
        {scen.di===0&&<div style={{background:"#f9731510",border:"1px solid #f9731525",borderRadius:12,padding:14,marginBottom:14}}><div style={{fontSize:9,fontWeight:700,color:"#f97316",textTransform:"uppercase",letterSpacing:".08em",marginBottom:6}}>Situation</div><p style={{fontSize:12,color:"#ccc",lineHeight:1.7,margin:0}}>{sc.setup}</p></div>}
        <h3 style={{fontSize:15,fontWeight:600,lineHeight:1.5,margin:"0 0 12px"}}>{d.prompt}</h3>
        <div style={{display:"flex",flexDirection:"column",gap:7}}>{d.options.map((o,i)=>(<button key={i} style={S.opt(scen.sel===i,o.correct,scen.sel!==null)} onClick={()=>scen.sel===null&&setScen(p=>({...p,sel:i}))}>{o.text}</button>))}</div>
        {scen.sel!==null&&<div style={{marginTop:12}}>
          <div style={{background:d.options[scen.sel].correct?"#10b9810f":"#ef44440f",border:`1px solid ${d.options[scen.sel].correct?"#10b98120":"#ef444420"}`,borderRadius:12,padding:14,marginBottom:12}}><p style={{fontSize:12,color:"#ccc",lineHeight:1.7,margin:0}}>{d.options[scen.sel].result}</p></div>
          <button style={S.btn(topic.color,true)} onClick={()=>{const nh=[...scen.hist,{ok:d.options[scen.sel].correct,result:d.options[scen.sel].result}];scen.di<sc.decisions.length-1?tr(()=>setScen(p=>({...p,di:p.di+1,sel:null,hist:nh}))):tr(()=>setScen(p=>({...p,done:true,hist:nh})))}}>{scen.di<sc.decisions.length-1?"Next Decision":"Results"}</button>
        </div>}
      </div></div><Bar active="train" cookieConsent={cookieConsent} handleCookieConsent={handleCookieConsent} emailCapture={emailCapture} setEmailCapture={setEmailCapture}/></div>);
  }

  return <div style={S.app}><Bar active="train" cookieConsent={cookieConsent} handleCookieConsent={handleCookieConsent} emailCapture={emailCapture} setEmailCapture={setEmailCapture}/></div>;
}
