import os
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

def create_discharge_summary(output_path: str):
    doc = SimpleDocTemplate(
        output_path,
        pagesize=letter,
        rightMargin=54,
        leftMargin=54,
        topMargin=54,
        bottomMargin=54
    )
    styles = getSampleStyleSheet()
    
    banner_style = ParagraphStyle(
        'Banner',
        parent=styles['Normal'],
        textColor=colors.HexColor('#B91C1C'),
        fontSize=10,
        alignment=1, # Center
        fontName='Helvetica-Bold'
    )
    
    title_style = ParagraphStyle(
        'HospitalTitle',
        parent=styles['Heading1'],
        fontSize=18,
        alignment=1,
        spaceAfter=12,
        textColor=colors.HexColor('#1E3A8A')
    )
    
    section_style = ParagraphStyle(
        'Section',
        parent=styles['Heading2'],
        fontSize=14,
        spaceBefore=14,
        spaceAfter=8,
        textColor=colors.HexColor('#1F2937')
    )
    
    body_style = ParagraphStyle(
        'Body',
        parent=styles['Normal'],
        fontSize=11,
        leading=16,
        textColor=colors.HexColor('#374151')
    )
    
    story = []
    
    # Page 1
    story.append(Paragraph("SYNTHETIC DEMONSTRATION DATA - NOT A REAL PATIENT RECORD", banner_style))
    story.append(Spacer(1, 10))
    story.append(Paragraph("Apex Memorial Healthcare (Fictional)", title_style))
    story.append(Paragraph("DISCHARGE SUMMARY", ParagraphStyle('Sub', parent=title_style, fontSize=14, textColor=colors.HexColor('#4B5563'))))
    story.append(Spacer(1, 15))
    
    story.append(Paragraph("Patient Demographics & Stay Details", section_style))
    story.append(Paragraph("Patient Name: Ravi Kumar (fictional)", body_style))
    story.append(Paragraph("Patient ID: SYN-0001", body_style))
    story.append(Paragraph("Age / Gender: 34 / Male", body_style))
    story.append(Paragraph("Admission Date: 05 March 2026", body_style))
    story.append(Paragraph("Discharge Date: 08 March 2026", body_style))
    story.append(Paragraph("Attending Physician: Dr. Sunita Rao, MS (Fictional)", body_style))
    story.append(Spacer(1, 20))
    
    story.append(Paragraph("Clinical Course Summary", section_style))
    story.append(Paragraph(
        "The patient presented with acute onset right lower quadrant abdominal pain accompanied by nausea and fever. "
        "Clinical evaluation and abdominal ultrasonography confirmed early-stage uncomplicated acute appendicitis. "
        "Patient underwent prompt surgical management without intraoperative complications.",
        body_style
    ))
    story.append(Spacer(1, 30))
    story.append(Paragraph("--- Continued on Page 2 ---", ParagraphStyle('PageFooter', parent=body_style, alignment=1, textColor=colors.gray)))
    
    # Page 2
    story.append(PageBreak())
    story.append(Paragraph("SYNTHETIC DEMONSTRATION DATA - NOT A REAL PATIENT RECORD", banner_style))
    story.append(Spacer(1, 10))
    story.append(Paragraph("Apex Memorial Healthcare (Fictional) - Discharge Summary (Page 2)", ParagraphStyle('H2', parent=title_style, fontSize=13)))
    story.append(Spacer(1, 15))
    
    story.append(Paragraph("Diagnostic & Procedure Findings", section_style))
    story.append(Paragraph("Final diagnosis: Acute appendicitis (ICD-10: K35.80)", body_style))
    story.append(Paragraph("Procedure: Laparoscopic appendectomy", body_style))
    story.append(Spacer(1, 15))
    
    story.append(Paragraph("Discharge Condition & Medications", section_style))
    story.append(Paragraph("Condition on Discharge: Stable, afebrile, surgical incisions clean and intact.", body_style))
    story.append(Paragraph("Discharge Advice: Oral analgesics, light diet, wound inspection after 5 days.", body_style))
    story.append(Spacer(1, 30))
    story.append(Paragraph("Authorized Signatory: Dr. Sunita Rao, General Surgery (Reg: SYN-MD-9082)", body_style))
    
    doc.build(story)
    print(f"Generated {output_path}")

def create_claim_form(output_path: str):
    doc = SimpleDocTemplate(
        output_path,
        pagesize=letter,
        rightMargin=54,
        leftMargin=54,
        topMargin=54,
        bottomMargin=54
    )
    styles = getSampleStyleSheet()
    
    banner_style = ParagraphStyle(
        'Banner',
        parent=styles['Normal'],
        textColor=colors.HexColor('#B91C1C'),
        fontSize=10,
        alignment=1,
        fontName='Helvetica-Bold'
    )
    
    title_style = ParagraphStyle(
        'ClaimTitle',
        parent=styles['Heading1'],
        fontSize=18,
        alignment=1,
        spaceAfter=12,
        textColor=colors.HexColor('#1E3A8A')
    )
    
    section_style = ParagraphStyle(
        'Section',
        parent=styles['Heading2'],
        fontSize=14,
        spaceBefore=14,
        spaceAfter=8,
        textColor=colors.HexColor('#1F2937')
    )
    
    body_style = ParagraphStyle(
        'Body',
        parent=styles['Normal'],
        fontSize=11,
        leading=18,
        textColor=colors.HexColor('#374151')
    )
    
    story = []
    
    story.append(Paragraph("SYNTHETIC DEMONSTRATION DATA - NOT A REAL PATIENT RECORD", banner_style))
    story.append(Spacer(1, 10))
    story.append(Paragraph("HEALTH INSURANCE CLAIM SUBMISSION FORM", title_style))
    story.append(Spacer(1, 10))
    
    story.append(Paragraph("Section A: Member & Identification", section_style))
    story.append(Paragraph("Patient ID: SYN-0001", body_style))
    story.append(Paragraph("Policy Number: POL-SYN-98741", body_style))
    story.append(Spacer(1, 10))
    
    story.append(Paragraph("Section B: Hospitalization Record", section_style))
    story.append(Paragraph("Admission Date: 05 March 2026", body_style))
    story.append(Paragraph("Discharge Date: 09 March 2026", body_style))
    story.append(Paragraph("Diagnosis: Acute appendicitis", body_style))
    story.append(Paragraph("Procedure: Appendectomy", body_style))
    story.append(Spacer(1, 10))
    
    story.append(Paragraph("Section C: Billing & Settlement", section_style))
    story.append(Paragraph("Claim amount: INR 35,000", body_style))
    story.append(Paragraph("Payment Mode: Reimbursement", body_style))
    story.append(Spacer(1, 20))
    
    story.append(Paragraph("Declaration", section_style))
    story.append(Paragraph(
        "I hereby declare that all synthetic demonstration statements in this claim are provided for prototype evaluation only.",
        body_style
    ))
    
    doc.build(story)
    print(f"Generated {output_path}")

if __name__ == "__main__":
    out_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "synthetic_data")
    os.makedirs(out_dir, exist_ok=True)
    
    ds_path = os.path.join(out_dir, "discharge_summary.pdf")
    cf_path = os.path.join(out_dir, "claim_form.pdf")
    
    create_discharge_summary(ds_path)
    create_claim_form(cf_path)

