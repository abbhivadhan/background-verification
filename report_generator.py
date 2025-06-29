from reportlab.lib.pagesizes import letter, A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from datetime import datetime
import os

class BackgroundCheckReportGenerator:
    def __init__(self):
        self.styles = getSampleStyleSheet()
        self.setup_custom_styles()
    
    def setup_custom_styles(self):
        """Setup custom paragraph styles for the report"""
        self.styles.add(ParagraphStyle(
            name='CustomTitle',
            parent=self.styles['Heading1'],
            fontSize=24,
            spaceAfter=30,
            alignment=TA_CENTER,
            textColor=colors.darkblue
        ))
        
        self.styles.add(ParagraphStyle(
            name='SectionHeader',
            parent=self.styles['Heading2'],
            fontSize=16,
            spaceAfter=12,
            spaceBefore=20,
            textColor=colors.darkblue,
            borderWidth=1,
            borderColor=colors.darkblue,
            borderPadding=5
        ))
        
        self.styles.add(ParagraphStyle(
            name='FieldLabel',
            parent=self.styles['Normal'],
            fontSize=10,
            textColor=colors.grey,
            spaceAfter=2
        ))
        
        self.styles.add(ParagraphStyle(
            name='FieldValue',
            parent=self.styles['Normal'],
            fontSize=12,
            spaceAfter=8,
            leftIndent=20
        ))

    def generate_comprehensive_report(self, background_check_data, output_path):
        """Generate a comprehensive background check report"""
        doc = SimpleDocTemplate(
            output_path,
            pagesize=letter,
            rightMargin=72,
            leftMargin=72,
            topMargin=72,
            bottomMargin=18
        )
        
        story = []
        
        # Title
        story.append(Paragraph("BACKGROUND CHECK REPORT", self.styles['CustomTitle']))
        story.append(Spacer(1, 20))
        
        # Report Information
        report_info = [
            ['Report ID:', f"#{background_check_data['id']}"],
            ['Generated:', datetime.now().strftime('%B %d, %Y at %I:%M %p')],
            ['Report Type:', background_check_data.get('checkType', 'Comprehensive').title()],
            ['Status:', background_check_data.get('status', 'Unknown').title()]
        ]
        
        report_table = Table(report_info, colWidths=[2*inch, 4*inch])
        report_table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ]))
        story.append(report_table)
        story.append(Spacer(1, 30))
        
        # Candidate Information
        story.append(Paragraph("CANDIDATE INFORMATION", self.styles['SectionHeader']))
        
        candidate = background_check_data.get('candidate', {})
        candidate_info = [
            ['Full Name:', f"{candidate.get('firstName', '')} {candidate.get('lastName', '')}"],
            ['Email Address:', candidate.get('email', 'N/A')],
            ['Phone Number:', candidate.get('phone', 'N/A')],
            ['Address:', candidate.get('address', 'N/A')]
        ]
        
        candidate_table = Table(candidate_info, colWidths=[2*inch, 4*inch])
        candidate_table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
            ('GRID', (0, 0), (-1, -1), 1, colors.lightgrey),
        ]))
        story.append(candidate_table)
        story.append(Spacer(1, 20))
        
        # Verification Results
        story.append(Paragraph("VERIFICATION RESULTS", self.styles['SectionHeader']))
        
        verification_results = background_check_data.get('verificationResults', [])
        if verification_results:
            verification_data = [['Type', 'Status', 'Result', 'Details']]
            
            for result in verification_results:
                verification_data.append([
                    result.get('type', '').title(),
                    result.get('status', '').title(),
                    result.get('result', 'N/A').title(),
                    result.get('details', 'No details available')[:50] + '...' if len(result.get('details', '')) > 50 else result.get('details', 'No details available')
                ])
            
            verification_table = Table(verification_data, colWidths=[1.2*inch, 1*inch, 1*inch, 2.8*inch])
            verification_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.darkblue),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, -1), 9),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
                ('GRID', (0, 0), (-1, -1), 1, colors.black),
                ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ]))
            story.append(verification_table)
        else:
            story.append(Paragraph("No verification results available.", self.styles['Normal']))
        
        story.append(Spacer(1, 20))
        
        # Criminal Background Checks
        story.append(Paragraph("CRIMINAL BACKGROUND CHECKS", self.styles['SectionHeader']))
        
        criminal_checks = background_check_data.get('criminalChecks', [])
        if criminal_checks:
            criminal_data = [['Jurisdiction', 'Type', 'Status', 'Result', 'Details']]
            
            for check in criminal_checks:
                criminal_data.append([
                    check.get('jurisdiction', 'N/A'),
                    check.get('checkType', '').title(),
                    check.get('status', '').title(),
                    check.get('result', 'N/A').title(),
                    check.get('details', 'No details available')[:40] + '...' if len(check.get('details', '')) > 40 else check.get('details', 'No details available')
                ])
            
            criminal_table = Table(criminal_data, colWidths=[1.5*inch, 0.8*inch, 0.8*inch, 0.8*inch, 2.1*inch])
            criminal_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.darkred),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, -1), 9),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
                ('GRID', (0, 0), (-1, -1), 1, colors.black),
                ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ]))
            story.append(criminal_table)
        else:
            story.append(Paragraph("No criminal background checks performed.", self.styles['Normal']))
        
        story.append(Spacer(1, 20))
        
        # Credit Check
        story.append(Paragraph("CREDIT CHECK", self.styles['SectionHeader']))
        
        credit_check = background_check_data.get('creditCheck', {})
        if credit_check.get('status') == 'completed':
            credit_info = [
                ['Credit Score:', str(credit_check.get('creditScore', 'N/A'))],
                ['Credit Rating:', credit_check.get('creditRating', 'N/A')],
                ['Details:', credit_check.get('details', 'No details available')]
            ]
            
            credit_table = Table(credit_info, colWidths=[2*inch, 4*inch])
            credit_table.setStyle(TableStyle([
                ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, -1), 10),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
                ('GRID', (0, 0), (-1, -1), 1, colors.lightgrey),
            ]))
            story.append(credit_table)
        else:
            story.append(Paragraph(f"Credit check status: {credit_check.get('status', 'Not performed').title()}", self.styles['Normal']))
            if credit_check.get('details'):
                story.append(Paragraph(credit_check['details'], self.styles['Normal']))
        
        story.append(Spacer(1, 30))
        
        # Summary and Recommendations
        story.append(Paragraph("SUMMARY AND RECOMMENDATIONS", self.styles['SectionHeader']))
        
        # Calculate overall status
        verification_passed = all(r.get('result') == 'pass' for r in verification_results if r.get('result'))
        criminal_clear = all(c.get('result') == 'clear' for c in criminal_checks if c.get('result'))
        
        if verification_passed and criminal_clear:
            overall_status = "CLEARED"
            recommendation = "The candidate has successfully passed all background verification checks. No adverse findings were discovered during the screening process."
            status_color = colors.green
        elif not verification_passed or not criminal_clear:
            overall_status = "REQUIRES REVIEW"
            recommendation = "Some verification checks require further review. Please examine the detailed results above before making a hiring decision."
            status_color = colors.orange
        else:
            overall_status = "PENDING"
            recommendation = "Background check is still in progress. Final recommendation will be available upon completion of all verification processes."
            status_color = colors.blue
        
        # Overall Status
        status_style = ParagraphStyle(
            name='StatusStyle',
            parent=self.styles['Normal'],
            fontSize=16,
            textColor=status_color,
            alignment=TA_CENTER,
            spaceAfter=10
        )
        
        story.append(Paragraph(f"<b>OVERALL STATUS: {overall_status}</b>", status_style))
        story.append(Paragraph(recommendation, self.styles['Normal']))
        
        story.append(Spacer(1, 30))
        
        # Footer
        footer_style = ParagraphStyle(
            name='Footer',
            parent=self.styles['Normal'],
            fontSize=8,
            textColor=colors.grey,
            alignment=TA_CENTER
        )
        
        story.append(Paragraph("This report is confidential and intended solely for the use of authorized personnel.", footer_style))
        story.append(Paragraph(f"Generated by BackgroundCheck Pro on {datetime.now().strftime('%B %d, %Y')}", footer_style))
        
        # Build the PDF
        doc.build(story)
        return output_path

    def generate_summary_report(self, background_check_data, output_path):
        """Generate a summary background check report"""
        doc = SimpleDocTemplate(
            output_path,
            pagesize=letter,
            rightMargin=72,
            leftMargin=72,
            topMargin=72,
            bottomMargin=18
        )
        
        story = []
        
        # Title
        story.append(Paragraph("BACKGROUND CHECK SUMMARY", self.styles['CustomTitle']))
        story.append(Spacer(1, 20))
        
        # Basic Information
        candidate = background_check_data.get('candidate', {})
        basic_info = [
            ['Candidate:', f"{candidate.get('firstName', '')} {candidate.get('lastName', '')}"],
            ['Report ID:', f"#{background_check_data['id']}"],
            ['Date:', datetime.now().strftime('%B %d, %Y')],
            ['Status:', background_check_data.get('status', 'Unknown').title()]
        ]
        
        basic_table = Table(basic_info, colWidths=[2*inch, 4*inch])
        basic_table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 12),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
            ('GRID', (0, 0), (-1, -1), 1, colors.lightgrey),
        ]))
        story.append(basic_table)
        story.append(Spacer(1, 30))
        
        # Quick Results Summary
        story.append(Paragraph("RESULTS SUMMARY", self.styles['SectionHeader']))
        
        verification_results = background_check_data.get('verificationResults', [])
        criminal_checks = background_check_data.get('criminalChecks', [])
        
        # Count results
        education_verified = sum(1 for r in verification_results if r.get('type') == 'education' and r.get('result') == 'pass')
        employment_verified = sum(1 for r in verification_results if r.get('type') == 'employment' and r.get('result') == 'pass')
        criminal_clear = sum(1 for c in criminal_checks if c.get('result') == 'clear')
        
        summary_data = [
            ['Check Type', 'Status'],
            ['Education Verification', f"{education_verified} verified" if education_verified > 0 else "Not verified"],
            ['Employment Verification', f"{employment_verified} verified" if employment_verified > 0 else "Not verified"],
            ['Criminal Background', f"{criminal_clear} jurisdictions clear" if criminal_clear > 0 else "Pending/Issues found"],
            ['Credit Check', background_check_data.get('creditCheck', {}).get('status', 'Not performed').title()]
        ]
        
        summary_table = Table(summary_data, colWidths=[3*inch, 3*inch])
        summary_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.darkblue),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 11),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ]))
        story.append(summary_table)
        
        story.append(Spacer(1, 30))
        
        # Overall Recommendation
        story.append(Paragraph("RECOMMENDATION", self.styles['SectionHeader']))
        
        verification_passed = all(r.get('result') == 'pass' for r in verification_results if r.get('result'))
        criminal_clear_all = all(c.get('result') == 'clear' for c in criminal_checks if c.get('result'))
        
        if verification_passed and criminal_clear_all:
            recommendation = "✓ APPROVED - Candidate has passed all background checks."
            rec_color = colors.green
        else:
            recommendation = "⚠ REVIEW REQUIRED - Please review detailed findings before proceeding."
            rec_color = colors.orange
        
        rec_style = ParagraphStyle(
            name='RecommendationStyle',
            parent=self.styles['Normal'],
            fontSize=14,
            textColor=rec_color,
            alignment=TA_CENTER,
            spaceAfter=20
        )
        
        story.append(Paragraph(f"<b>{recommendation}</b>", rec_style))
        
        # Footer
        footer_style = ParagraphStyle(
            name='Footer',
            parent=self.styles['Normal'],
            fontSize=8,
            textColor=colors.grey,
            alignment=TA_CENTER
        )
        
        story.append(Spacer(1, 50))
        story.append(Paragraph("For detailed results, please refer to the comprehensive report.", footer_style))
        story.append(Paragraph(f"Generated by BackgroundCheck Pro on {datetime.now().strftime('%B %d, %Y')}", footer_style))
        
        # Build the PDF
        doc.build(story)
        return output_path

