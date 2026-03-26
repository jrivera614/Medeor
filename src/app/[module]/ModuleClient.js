"use client";
import { useState, useCallback } from "react";
import { useParams, useRouter, notFound } from "next/navigation";
import { useAppState, S, Bar, Prog } from "../components";
import { TOPICS } from "../data";

export default function ModulePage() {
  const params = useParams();
  const router = useRouter();
  const { progress, saveProgress, ref, fade, tr } = useAppState();

  const topic = TOPICS.find(t => t.id === params.module);
  const [view, setView] = useState("menu");
  const [quizState, setQuizState] = useState({ index: 0, answers: [], done: false, selected: null });
  const [flashState, setFlashState] = useState({ index: 0, flipped: false });
  const [stepState, setStepState] = useState({ index: 0 });
  const [scenarioState, setScenarioState] = useState({ scenarioIndex: 0, decisionIndex: 0, selected: null, history: [], done: false });
  const [missedCards, setMissedCards] = useState([]);
  const [spacedMode, setSpacedMode] = useState(false);

  const navigate = useCallback((targetView, setupFn) => { tr(() => { setupFn && setupFn(); setView(targetView); }); }, [tr]);

  if (!topic) { notFound(); return null; }

  const isScenarioModule = !!topic.scenarios;
  const bodyStyle = {...S.body, opacity: fade ? 1 : 0, transform: fade ? "none" : "translateY(5px)"};

  // TOPIC MENU
  if (view === "menu") {
    const modes = isScenarioModule ? [{ key:"scenarios",label:"Tactical Scenarios",desc:`${topic.scenarios.length} scenarios`,icon:"⏱️" }]
      : [{ key:"steps",label:"Step-by-Step",desc:`${topic.steps.length} steps`,icon:"📖" },{ key:"quiz",label:"Quiz",desc:`${topic.quiz.length} questions`,icon:"✅" },{ key:"flashcards",label:"Flashcards",desc:`${topic.flashcards.length} cards`,icon:"🃏" }];
    const quizProgress = progress[`quiz_${topic.id}`];
    return (<div style={S.app}><div style={S.hdr}><button style={S.back} onClick={()=>router.push("/")}>←</button><div><div style={{fontSize:15,fontWeight:700}}>{topic.icon} {topic.title}</div><div style={{fontSize:11,color:"#666"}}>{topic.subtitle}</div></div></div>
      <div ref={ref} style={bodyStyle}><div style={{padding:"16px 0"}}>
        {quizProgress && <div style={{background:"#10b9810a",border:"1px solid #10b98120",borderRadius:10,padding:"10px 14px",marginBottom:12,display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontSize:12,color:"#10b981"}}>Best quiz score</span><span style={{fontSize:16,fontWeight:700,color:"#10b981"}}>{quizProgress.score}%</span></div>}
        {modes.map(mode=>(<div key={mode.key} style={{...S.card,display:"flex",alignItems:"center",gap:11}} onMouseEnter={e=>e.currentTarget.style.background="#ffffff0f"} onMouseLeave={e=>e.currentTarget.style.background="#ffffff08"} onClick={()=>{
          if(mode.key==="steps") navigate("steps",()=>setStepState({index:0}));
          else if(mode.key==="quiz") navigate("quiz",()=>setQuizState({index:0,answers:[],done:false,selected:null}));
          else if(mode.key==="flashcards") navigate("flashcards",()=>{setFlashState({index:0,flipped:false});setMissedCards([]);setSpacedMode(false);});
          else if(mode.key==="scenarios") navigate("scenarios");
        }}><span style={{fontSize:20}}>{mode.icon}</span><div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>{mode.label}</div><div style={{fontSize:11,color:"#666",marginTop:1}}>{mode.desc}</div></div><span style={{color:"#444"}}>›</span></div>))}
      </div></div><Bar active="train"/></div>);
  }

  // STEPS
  if (view === "steps") {
    const currentStep = topic.steps[stepState.index];
    return (<div style={S.app}><div style={S.hdr}><button style={S.back} onClick={()=>navigate("menu")}>←</button><div style={{flex:1}}><div style={{fontSize:12,fontWeight:600}}>Step {stepState.index+1}/{topic.steps.length}</div><Prog c={stepState.index+1} t={topic.steps.length}/></div></div>
      <div ref={ref} style={bodyStyle}><div style={{padding:"20px 0 10px"}}>
        <span style={{fontSize:10,fontWeight:700,color:topic.color,textTransform:"uppercase",letterSpacing:".06em",background:`${topic.color}18`,padding:"2px 8px",borderRadius:6}}>{topic.title}</span>
        <h2 style={{fontSize:18,fontWeight:700,marginTop:12,marginBottom:8,lineHeight:1.3}}>{currentStep.title}</h2>
        <p style={{fontSize:13,color:"#aaa",lineHeight:1.7,margin:"0 0 16px"}}>{currentStep.detail}</p>
        {currentStep.diagram && <div style={{margin:"0 0 16px",borderRadius:11,overflow:"hidden",border:"1px solid #ffffff14"}}><img src={currentStep.diagram} alt={currentStep.title + " diagram"} style={{width:"100%",display:"block"}}/></div>}
        <div style={{background:`${topic.color}0a`,border:`1px solid ${topic.color}25`,borderRadius:11,padding:14}}>
          <div style={{fontSize:9,fontWeight:700,color:topic.color,textTransform:"uppercase",letterSpacing:".08em",marginBottom:6}}>Field Instruction</div>
          <p style={{fontSize:12,color:"#ccc",lineHeight:1.7,margin:0}}>{currentStep.instruction}</p>
        </div>
      </div>
      <div style={{display:"flex",gap:8,paddingTop:10}}>
        <button style={{...S.btn("#555",false),opacity:stepState.index===0?.3:1}} disabled={stepState.index===0} onClick={()=>tr(()=>setStepState({index:stepState.index-1}))}>Prev</button>
        <button style={S.btn(topic.color,true)} onClick={()=>stepState.index<topic.steps.length-1?tr(()=>setStepState({index:stepState.index+1})):(() => {saveProgress(`steps_${topic.id}`, {done:true});navigate("menu")})()}>{stepState.index<topic.steps.length-1?"Next":"Done"}</button>
      </div></div><Bar active="train"/></div>);
  }

  // QUIZ
  if (view === "quiz") {
    if (quizState.done) {
      const correctCount = quizState.answers.filter((answer, idx) => answer === topic.quiz[idx].correct).length;
      const scorePercent = Math.round(correctCount / topic.quiz.length * 100);
      const previousBest = progress[`quiz_${topic.id}`];
      const isNewBest = !previousBest || scorePercent > previousBest.score;
      if (isNewBest) saveProgress(`quiz_${topic.id}`, { score: scorePercent, correct: correctCount, total: topic.quiz.length });
      return (<div style={S.app}><div style={S.hdr}><button style={S.back} onClick={()=>navigate("menu")}>←</button><div style={{fontSize:14,fontWeight:600}}>Results</div></div>
        <div ref={ref} style={bodyStyle}><div style={{textAlign:"center",padding:"36px 0 20px"}}>
          <div style={{fontSize:50,fontWeight:800,background:scorePercent>=80?"linear-gradient(135deg,#10b981,#6ee7b7)":scorePercent>=60?"linear-gradient(135deg,#f59e0b,#fcd34d)":"linear-gradient(135deg,#ef4444,#fca5a5)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{scorePercent}%</div>
          <div style={{fontSize:13,color:"#888",marginTop:4}}>{correctCount}/{topic.quiz.length} correct</div>
          {isNewBest && previousBest && <div style={{fontSize:11,color:"#10b981",marginTop:6}}>New best score!</div>}
          {previousBest && !isNewBest && <div style={{fontSize:11,color:"#666",marginTop:6}}>Best: {previousBest.score}%</div>}
          <div style={{fontSize:12,color:"#555",marginTop:12,lineHeight:1.6}}>{scorePercent>=80?"Strong performance.":scorePercent>=60?"Good foundation. Review missed areas.":"Needs more study. Hit the step-by-step guide."}</div>
        </div>
        <div style={{display:"flex",gap:8}}><button style={S.btn("#555",false)} onClick={()=>navigate("quiz",()=>setQuizState({index:0,answers:[],done:false,selected:null}))}>Retry</button><button style={S.btn(topic.color,true)} onClick={()=>navigate("menu")}>Back</button></div>
        </div><Bar active="train"/></div>);
    }
    const currentQuestion = topic.quiz[quizState.index];
    const hasAnswered = quizState.selected !== null;
    return (<div style={S.app}><div style={S.hdr}><button style={S.back} onClick={()=>navigate("menu")}>←</button><div style={{flex:1}}><div style={{fontSize:12,fontWeight:600}}>Q {quizState.index+1}/{topic.quiz.length}</div><Prog c={quizState.index+1} t={topic.quiz.length}/></div></div>
      <div ref={ref} style={bodyStyle}><div style={{padding:"20px 0 14px"}}><h3 style={{fontSize:16,fontWeight:600,lineHeight:1.5,margin:0}}>{currentQuestion.q}</h3></div>
        <div style={{display:"flex",flexDirection:"column",gap:7}}>{currentQuestion.options.map((option,optIdx)=>(<button key={optIdx} style={S.opt(quizState.selected===optIdx,currentQuestion.correct===optIdx,hasAnswered)} onClick={()=>!hasAnswered&&setQuizState(prev=>({...prev,selected:optIdx}))}><span style={{fontWeight:600,marginRight:7,opacity:.5}}>{String.fromCharCode(65+optIdx)}</span>{option}</button>))}</div>
        {hasAnswered&&currentQuestion.why&&<div style={{marginTop:12,background:quizState.selected===currentQuestion.correct?"#10b9810c":"#ef44440c",border:`1px solid ${quizState.selected===currentQuestion.correct?"#10b98120":"#ef444420"}`,borderRadius:11,padding:13}}><div style={{fontSize:10,fontWeight:700,color:quizState.selected===currentQuestion.correct?"#10b981":"#ef4444",textTransform:"uppercase",letterSpacing:".06em",marginBottom:5}}>{quizState.selected===currentQuestion.correct?"Correct":"Incorrect"}</div><div style={{fontSize:12,color:"#bbb",lineHeight:1.6}}>{currentQuestion.why}</div></div>}
        {hasAnswered&&<div style={{marginTop:12}}><button style={S.btn(topic.color,true)} onClick={()=>{const updatedAnswers=[...quizState.answers,quizState.selected];quizState.index<topic.quiz.length-1?tr(()=>setQuizState({index:quizState.index+1,answers:updatedAnswers,done:false,selected:null})):tr(()=>setQuizState({...quizState,answers:updatedAnswers,done:true}))}}>{quizState.index<topic.quiz.length-1?"Next":"Results"}</button></div>}
      </div><Bar active="train"/></div>);
  }

  // FLASHCARDS with spaced repetition
  if (view === "flashcards") {
    const deck = spacedMode && missedCards.length > 0 ? missedCards.map(idx => topic.flashcards[idx]) : topic.flashcards;
    const currentCard = deck[flashState.index];
    const isLastCard = flashState.index >= deck.length - 1;
    return (<div style={S.app}><div style={S.hdr}><button style={S.back} onClick={()=>{setSpacedMode(false);setMissedCards([]);navigate("menu");}}>←</button><div style={{flex:1}}><div style={{fontSize:12,fontWeight:600}}>{spacedMode?"Review Mode: ":""}Card {flashState.index+1}/{deck.length}</div><Prog c={flashState.index+1} t={deck.length}/></div></div>
      <div ref={ref} style={bodyStyle}><div style={{padding:"24px 0"}}>
        <div onClick={()=>setFlashState(prev=>({...prev,flipped:!prev.flipped}))} style={{background:flashState.flipped?`${topic.color}0a`:"#ffffff08",border:`1.5px solid ${flashState.flipped?`${topic.color}30`:"#ffffff14"}`,borderRadius:16,padding:24,minHeight:160,display:"flex",flexDirection:"column",justifyContent:"center",cursor:"pointer"}}>
          <div style={{fontSize:9,fontWeight:700,color:flashState.flipped?topic.color:"#555",textTransform:"uppercase",letterSpacing:".08em",marginBottom:12}}>{flashState.flipped?"Answer":"Question"}</div>
          <div style={{fontSize:flashState.flipped?13:17,fontWeight:flashState.flipped?400:600,lineHeight:1.6,color:flashState.flipped?"#ccc":"#e8e8ed"}}>{flashState.flipped?currentCard.back:currentCard.front}</div>
          {!flashState.flipped&&<div style={{fontSize:10,color:"#444",marginTop:16,textAlign:"center"}}>Tap to reveal</div>}
        </div>
      </div>
      {flashState.flipped ? (
        <div style={{display:"flex",gap:8}}>
          <button style={S.btn("#ef4444",false)} onClick={()=>{
            const originalIndex = spacedMode ? missedCards[flashState.index] : flashState.index;
            if (!missedCards.includes(originalIndex)) setMissedCards(prev=>[...prev,originalIndex]);
            isLastCard ? (missedCards.length > 0 ? tr(()=>{setSpacedMode(true);setFlashState({index:0,flipped:false})}) : (() => {saveProgress(`flash_${topic.id}`,{done:true});navigate("menu")})()) : tr(()=>setFlashState({index:flashState.index+1,flipped:false}));
          }}>Review Again</button>
          <button style={S.btn("#10b981",true)} onClick={()=>{
            if (spacedMode) { const remainingMissed = missedCards.filter((_,idx)=>idx!==flashState.index); setMissedCards(remainingMissed); }
            if (isLastCard) { if (spacedMode && missedCards.filter((_,idx)=>idx!==flashState.index).length > 0) { tr(()=>{setFlashState({index:0,flipped:false})}) } else { saveProgress(`flash_${topic.id}`,{done:true}); navigate("menu"); } }
            else tr(()=>setFlashState({index:flashState.index+1,flipped:false}));
          }}>Got It</button>
        </div>
      ) : (
        <div style={{display:"flex",gap:8}}><button style={{...S.btn("#555",false),opacity:flashState.index===0?.3:1}} disabled={flashState.index===0} onClick={()=>tr(()=>setFlashState({index:flashState.index-1,flipped:false}))}>Prev</button><button style={S.btn(topic.color,true)} onClick={()=>setFlashState(prev=>({...prev,flipped:true}))}>Flip</button></div>
      )}
      </div><Bar active="train"/></div>);
  }

  // SCENARIOS LIST
  if (view === "scenarios" && topic?.scenarios) {
    return (<div style={S.app}><div style={S.hdr}><button style={S.back} onClick={()=>navigate("menu")}>←</button><div style={{fontSize:14,fontWeight:600}}>Tactical Scenarios</div></div>
      <div ref={ref} style={bodyStyle}><div style={{padding:"16px 0"}}>
        {topic.scenarios.map((scenario,idx)=>(<div key={idx} style={S.card} onMouseEnter={e=>e.currentTarget.style.background="#ffffff0f"} onMouseLeave={e=>e.currentTarget.style.background="#ffffff08"} onClick={()=>navigate("scen-play",()=>setScenarioState({scenarioIndex:idx,decisionIndex:0,selected:null,history:[],done:false}))}>
          <div style={{fontSize:14,fontWeight:600,marginBottom:4}}>{scenario.title}</div><div style={{fontSize:11,color:"#777"}}>{scenario.decisions.length} decisions</div>
        </div>))}
      </div></div><Bar active="train"/></div>);
  }

  // SCENARIO PLAY
  if (view === "scen-play" && topic?.scenarios) {
    const scenario = topic.scenarios[scenarioState.scenarioIndex];
    if (scenarioState.done) {
      const correctDecisions = scenarioState.history.filter(entry => entry.ok).length;
      return (<div style={S.app}><div style={S.hdr}><button style={S.back} onClick={()=>navigate("scenarios")}>←</button><div style={{fontSize:14,fontWeight:600}}>Complete</div></div>
        <div ref={ref} style={bodyStyle}><div style={{textAlign:"center",padding:"32px 0 20px"}}><div style={{fontSize:40}}>{correctDecisions===scenario.decisions.length?"🏆":"📋"}</div><div style={{fontSize:18,fontWeight:700,marginTop:10}}>{scenario.title}</div><div style={{fontSize:13,color:"#888",marginTop:6}}>{correctDecisions}/{scenario.decisions.length} optimal</div></div>
          {scenarioState.history.map((entry,idx)=>(<div key={idx} style={{background:entry.ok?"#10b9810f":"#ef44440f",border:`1px solid ${entry.ok?"#10b98120":"#ef444420"}`,borderRadius:10,padding:12,marginBottom:8}}><div style={{fontSize:12,fontWeight:600,color:entry.ok?"#10b981":"#ef4444",marginBottom:4}}>Decision {idx+1}: {entry.ok?"Correct":"Suboptimal"}</div><div style={{fontSize:11,color:"#aaa",lineHeight:1.5}}>{entry.result}</div></div>))}
          <div style={{display:"flex",gap:8,marginTop:12}}><button style={S.btn("#555",false)} onClick={()=>navigate("scen-play",()=>setScenarioState({scenarioIndex:scenarioState.scenarioIndex,decisionIndex:0,selected:null,history:[],done:false}))}>Retry</button><button style={S.btn(topic.color,true)} onClick={()=>navigate("scenarios")}>All Scenarios</button></div>
        </div><Bar active="train"/></div>);
    }
    const currentDecision = scenario.decisions[scenarioState.decisionIndex];
    return (<div style={S.app}><div style={S.hdr}><button style={S.back} onClick={()=>navigate("scenarios")}>←</button><div style={{flex:1}}><div style={{fontSize:12,fontWeight:600}}>{scenario.title}</div><Prog c={scenarioState.decisionIndex+1} t={scenario.decisions.length}/></div></div>
      <div ref={ref} style={bodyStyle}><div style={{padding:"16px 0"}}>
        {scenarioState.decisionIndex===0&&<div style={{background:"#f9731510",border:"1px solid #f9731525",borderRadius:12,padding:14,marginBottom:14}}><div style={{fontSize:9,fontWeight:700,color:"#f97316",textTransform:"uppercase",letterSpacing:".08em",marginBottom:6}}>Situation</div><p style={{fontSize:12,color:"#ccc",lineHeight:1.7,margin:0}}>{scenario.setup}</p></div>}
        <h3 style={{fontSize:15,fontWeight:600,lineHeight:1.5,margin:"0 0 12px"}}>{currentDecision.prompt}</h3>
        <div style={{display:"flex",flexDirection:"column",gap:7}}>{currentDecision.options.map((option,optIdx)=>(<button key={optIdx} style={S.opt(scenarioState.selected===optIdx,option.correct,scenarioState.selected!==null)} onClick={()=>scenarioState.selected===null&&setScenarioState(prev=>({...prev,selected:optIdx}))}>{option.text}</button>))}</div>
        {scenarioState.selected!==null&&<div style={{marginTop:12}}>
          <div style={{background:currentDecision.options[scenarioState.selected].correct?"#10b9810f":"#ef44440f",border:`1px solid ${currentDecision.options[scenarioState.selected].correct?"#10b98120":"#ef444420"}`,borderRadius:12,padding:14,marginBottom:12}}><p style={{fontSize:12,color:"#ccc",lineHeight:1.7,margin:0}}>{currentDecision.options[scenarioState.selected].result}</p></div>
          <button style={S.btn(topic.color,true)} onClick={()=>{const updatedHistory=[...scenarioState.history,{ok:currentDecision.options[scenarioState.selected].correct,result:currentDecision.options[scenarioState.selected].result}];scenarioState.decisionIndex<scenario.decisions.length-1?tr(()=>setScenarioState(prev=>({...prev,decisionIndex:prev.decisionIndex+1,selected:null,history:updatedHistory}))):tr(()=>setScenarioState(prev=>({...prev,done:true,history:updatedHistory})))}}>{scenarioState.decisionIndex<scenario.decisions.length-1?"Next Decision":"Results"}</button>
        </div>}
      </div></div><Bar active="train"/></div>);
  }

  return <div style={S.app}><Bar active="train"/></div>;
}
