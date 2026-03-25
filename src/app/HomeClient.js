"use client";
import { useAppState, S, Bar } from "./components";
import { TOPICS } from "./data";
import { useRouter } from "next/navigation";

export default function HomeClient() {
  const { progress, ref } = useAppState();
  const router = useRouter();
  return (
    <div style={S.app}>
      <div style={S.hdr}>
        <div>
          <div style={{fontSize:11,color:"#10b981",fontWeight:700,letterSpacing:".12em",textTransform:"uppercase",marginBottom:2}}>MEDEOR</div>
          <div style={{fontSize:16,fontWeight:700}}>TCCC / CLS / PFC Training</div>
          <div style={{fontSize:10,color:"#666",marginTop:1,textTransform:"uppercase",letterSpacing:".04em"}}>Interactive Modules</div>
        </div>
      </div>
      <div ref={ref} style={S.body}>
        <div style={{padding:"16px 0 8px"}}>
          <p style={{fontSize:12,color:"#666",lineHeight:1.6,margin:0}}>MARCH, E-PAWS-B, RAVINES, hemorrhage control, airway management, walking blood bank, and tactical scenarios.</p>
        </div>
        {TOPICS.map(topic=>{
          const stepsDone = progress[`steps_${topic.id}`];
          const quizProgress = progress[`quiz_${topic.id}`];
          const flashDone = progress[`flash_${topic.id}`];
          const hasProgress = stepsDone || quizProgress || flashDone;
          const badges = [];
          if (stepsDone) badges.push("Steps");
          if (quizProgress) badges.push(`Quiz ${quizProgress.score}%`);
          if (flashDone) badges.push("Cards");
          return (<div key={topic.id} style={S.card} onMouseEnter={e=>{e.currentTarget.style.background="#ffffff0f";e.currentTarget.style.borderColor=`${topic.color}30`}} onMouseLeave={e=>{e.currentTarget.style.background="#ffffff08";e.currentTarget.style.borderColor="#ffffff0f"}} onClick={()=>router.push(`/${topic.id}`)}>
            <div style={{display:"flex",alignItems:"center",gap:11}}>
              <div style={{fontSize:22,width:40,height:40,display:"flex",alignItems:"center",justifyContent:"center",borderRadius:11,background:`${topic.color}14`,position:"relative"}}>{topic.icon}{hasProgress&&<div style={{position:"absolute",top:-2,right:-2,width:12,height:12,borderRadius:6,background:"#10b981",display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{color:"#fff",fontSize:8,fontWeight:700}}>✓</span></div>}</div>
              <div style={{flex:1}}><div style={{fontSize:14,fontWeight:600}}>{topic.title}</div><div style={{fontSize:11,color:"#666",marginTop:2}}>{topic.subtitle}</div>
                {badges.length > 0 && <div style={{display:"flex",gap:4,marginTop:4}}>{badges.map((badge,bi)=>(<span key={bi} style={{fontSize:9,color:"#10b981",background:"#10b98114",padding:"1px 6px",borderRadius:4,fontWeight:600}}>{badge}</span>))}</div>}
              </div>
              <span style={{color:"#444",fontSize:14}}>›</span>
            </div>
          </div>)})}
      </div>
      <Bar active="train"/>
    </div>
  );
}
