export const metadata = {
  title: "Privacy Policy | Medeor",
  description: "Medeor privacy policy. How we handle your data, cookies, and analytics.",
  alternates: { canonical: "https://medeor.app/privacy" },
};

export default function PrivacyPage() {
  return (
    <div style={{fontFamily:"'DM Sans',system-ui,sans-serif",background:"#0a0a0f",color:"#ccc",minHeight:"100vh",maxWidth:480,margin:"0 auto",padding:"20px 16px 60px"}}>
      <a href="/" style={{color:"#8b5cf6",fontSize:12,textDecoration:"none"}}>{"<-"} Back to Medeor</a>
      <h1 style={{fontSize:22,fontWeight:700,color:"#e8e8ed",marginTop:16}}>Privacy Policy</h1>
      <p style={{fontSize:11,color:"#666"}}>Last updated: March 20, 2026</p>
      <h2 style={{fontSize:15,fontWeight:600,color:"#e8e8ed",marginTop:24}}>What We Collect</h2>
      <p style={{fontSize:13,lineHeight:1.8}}>Medeor collects minimal data. We do not require accounts, logins, or personal information to use the app. If you voluntarily submit the contact form or email signup, we collect only the information you provide (name, email, message).</p>
      <h2 style={{fontSize:15,fontWeight:600,color:"#e8e8ed",marginTop:24}}>Cookies and Analytics</h2>
      <p style={{fontSize:13,lineHeight:1.8}}>We use Google Analytics (GA4) and Vercel Analytics to understand how people use the app. Google Analytics uses cookies to track page views, session duration, and general usage patterns. Vercel Analytics is cookieless and privacy-friendly. You can accept or decline analytics cookies via the cookie consent banner. If you decline, Google Analytics will not track your session.</p>
      <h2 style={{fontSize:15,fontWeight:600,color:"#e8e8ed",marginTop:24}}>Google AdSense</h2>
      <p style={{fontSize:13,lineHeight:1.8}}>We use Google AdSense to display advertisements. Google may use cookies to serve ads based on your prior visits to this or other websites. You can opt out of personalized advertising by visiting Google Ad Settings at adssettings.google.com.</p>
      <h2 style={{fontSize:15,fontWeight:600,color:"#e8e8ed",marginTop:24}}>Amazon Associates</h2>
      <p style={{fontSize:13,lineHeight:1.8}}>Medeor is a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to amazon.com. When you click an affiliate link and make a purchase, we may earn a small commission at no additional cost to you.</p>
      <h2 style={{fontSize:15,fontWeight:600,color:"#e8e8ed",marginTop:24}}>Local Storage</h2>
      <p style={{fontSize:13,lineHeight:1.8}}>We use your browser local storage to save quiz progress, checklist states, cookie consent preference, and email signup dismissal. This data stays on your device and is never sent to our servers.</p>
      <h2 style={{fontSize:15,fontWeight:600,color:"#e8e8ed",marginTop:24}}>Data Sharing</h2>
      <p style={{fontSize:13,lineHeight:1.8}}>We do not sell, trade, or rent your personal information to anyone. Analytics data is aggregated and anonymous.</p>
      <h2 style={{fontSize:15,fontWeight:600,color:"#e8e8ed",marginTop:24}}>Contact</h2>
      <p style={{fontSize:13,lineHeight:1.8}}>Questions about this policy? Use the feedback form at medeor.app/contact.</p>
    </div>
  );
}
