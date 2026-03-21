export const metadata = {
  title: "Terms of Use | Medeor",
  description: "Medeor terms of use. Usage guidelines for the TCCC training platform.",
  alternates: { canonical: "https://medeor.app/terms" },
};

export default function TermsPage() {
  return (
    <div style={{fontFamily:"'DM Sans',system-ui,sans-serif",background:"#0a0a0f",color:"#ccc",minHeight:"100vh",maxWidth:480,margin:"0 auto",padding:"20px 16px 60px"}}>
      <a href="/" style={{color:"#8b5cf6",fontSize:12,textDecoration:"none"}}>← Back to Medeor</a>
      <h1 style={{fontSize:22,fontWeight:700,color:"#e8e8ed",marginTop:16}}>Terms of Use</h1>
      <p style={{fontSize:11,color:"#666"}}>Last updated: March 20, 2026</p>

      <h2 style={{fontSize:15,fontWeight:600,color:"#e8e8ed",marginTop:24}}>Acceptance</h2>
      <p style={{fontSize:13,lineHeight:1.8}}>By using Medeor (medeor.app), you agree to these terms. If you do not agree, do not use the app.</p>

      <h2 style={{fontSize:15,fontWeight:600,color:"#e8e8ed",marginTop:24}}>Educational Purpose Only</h2>
      <p style={{fontSize:13,lineHeight:1.8}}>Medeor is a training and educational reference tool. The content is designed to supplement, not replace, formal medical training, certification courses, or clinical judgment. All medical information is based on published JTS Clinical Practice Guidelines and TCCC protocols, but may not reflect the most current updates. Always follow your unit's SOPs, your medical director's guidance, and current published guidelines.</p>

      <h2 style={{fontSize:15,fontWeight:600,color:"#e8e8ed",marginTop:24}}>No Medical Advice</h2>
      <p style={{fontSize:13,lineHeight:1.8}}>Nothing on this platform constitutes medical advice, diagnosis, or treatment. Do not use this app as a substitute for professional medical training or consultation. In an emergency, follow your training and contact appropriate medical personnel.</p>

      <h2 style={{fontSize:15,fontWeight:600,color:"#e8e8ed",marginTop:24}}>Content Accuracy</h2>
      <p style={{fontSize:13,lineHeight:1.8}}>We strive for accuracy in all training content, quiz questions, dosing calculations, and clinical references. However, errors may exist. If you find an error, please report it through the feedback form. Drug dosages, protocols, and guidelines change over time. Always verify critical information against current published sources before clinical application.</p>

      <h2 style={{fontSize:15,fontWeight:600,color:"#e8e8ed",marginTop:24}}>Calculator Disclaimer</h2>
      <p style={{fontSize:13,lineHeight:1.8}}>The Parkland burn calculator, pediatric dosing calculator, and GCS calculator are educational tools only. Always verify calculations independently before clinical use. These tools do not account for patient-specific factors that may alter dosing or treatment decisions.</p>

      <h2 style={{fontSize:15,fontWeight:600,color:"#e8e8ed",marginTop:24}}>Third-Party Content</h2>
      <p style={{fontSize:13,lineHeight:1.8}}>Medeor links to JTS Clinical Practice Guidelines, Deployed Medicine YouTube videos, and other third-party resources. We do not control or guarantee the accuracy, availability, or content of these external resources. Links to CPG PDFs point to files hosted on jts.health.mil and may change without notice.</p>

      <h2 style={{fontSize:15,fontWeight:600,color:"#e8e8ed",marginTop:24}}>Intellectual Property</h2>
      <p style={{fontSize:13,lineHeight:1.8}}>The Medeor app design, code, and original training content are the property of Medeor. JTS Clinical Practice Guidelines are public domain U.S. government documents. Deployed Medicine videos are the property of their respective creators and are linked, not hosted, by Medeor.</p>

      <h2 style={{fontSize:15,fontWeight:600,color:"#e8e8ed",marginTop:24}}>Limitation of Liability</h2>
      <p style={{fontSize:13,lineHeight:1.8}}>Medeor is provided "as is" without warranties of any kind. We are not liable for any damages arising from the use of this app, including but not limited to errors in content, calculator outputs, or reliance on training material. Use this app at your own risk and always verify information against authoritative sources.</p>

      <h2 style={{fontSize:15,fontWeight:600,color:"#e8e8ed",marginTop:24}}>Changes</h2>
      <p style={{fontSize:13,lineHeight:1.8}}>We may update these terms at any time. Continued use of the app after changes constitutes acceptance of the updated terms.</p>

      <h2 style={{fontSize:15,fontWeight:600,color:"#e8e8ed",marginTop:24}}>Contact</h2>
      <p style={{fontSize:13,lineHeight:1.8}}>Questions? Use the feedback form at medeor.app/contact.</p>
    </div>
  );
}
