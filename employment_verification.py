import requests
import time
from datetime import datetime
from src.models.user import db
from src.models.candidate import EmploymentRecord
from src.models.background_check import VerificationResult

class EmploymentVerificationService:
    """Service for verifying employment records"""
    
    def __init__(self):
        self.verification_sources = {
            'work_number': {
                'url': 'https://api.theworknumber.com/verify',
                'api_key': 'your_api_key_here'
            },
            'manual_verification': {
                'enabled': True
            }
        }
    
    def verify_employment_record(self, employment_record_id, background_check_id):
        """
        Verify an employment record
        
        Args:
            employment_record_id (int): ID of the employment record to verify
            background_check_id (int): ID of the background check
            
        Returns:
            dict: Verification result
        """
        employment_record = EmploymentRecord.query.get(employment_record_id)
        if not employment_record:
            return {'error': 'Employment record not found'}
        
        # Create verification result record
        verification_result = VerificationResult(
            background_check_id=background_check_id,
            verification_type='employment',
            record_id=employment_record_id,
            status='pending',
            verification_method='automated'
        )
        
        db.session.add(verification_result)
        db.session.commit()
        
        try:
            # Try automated verification first
            result = self._automated_verification(employment_record)
            
            if result['status'] == 'verified':
                verification_result.status = 'verified'
                verification_result.result = 'pass'
                verification_result.details = result['details']
                verification_result.verified_by = result['verified_by']
                verification_result.verification_date = datetime.utcnow()
                
                # Update employment record
                employment_record.verified = True
                employment_record.verification_date = datetime.utcnow()
                employment_record.verification_notes = result['details']
                
            elif result['status'] == 'failed':
                verification_result.status = 'failed'
                verification_result.result = 'fail'
                verification_result.details = result['details']
                
            else:  # inconclusive
                verification_result.status = 'inconclusive'
                verification_result.result = 'inconclusive'
                verification_result.details = result['details']
                verification_result.verification_method = 'manual_required'
            
            db.session.commit()
            return verification_result.to_dict()
            
        except Exception as e:
            verification_result.status = 'failed'
            verification_result.details = f'Verification error: {str(e)}'
            db.session.commit()
            return {'error': str(e)}
    
    def _automated_verification(self, employment_record):
        """
        Perform automated verification using external services
        
        Args:
            employment_record: EmploymentRecord object
            
        Returns:
            dict: Verification result
        """
        # Simulate API call to The Work Number or similar service
        verification_data = {
            'company_name': employment_record.company_name,
            'job_title': employment_record.job_title,
            'start_date': employment_record.start_date.isoformat() if employment_record.start_date else None,
            'end_date': employment_record.end_date.isoformat() if employment_record.end_date else None,
            'employee_name': f"{employment_record.candidate.first_name} {employment_record.candidate.last_name}",
            'current_position': employment_record.current_position
        }
        
        # Simulate verification logic
        if self._is_valid_company(employment_record.company_name):
            verification_result = self._check_employment_records(verification_data)
            
            if verification_result['found']:
                details = f"Employment verified: {employment_record.job_title} at {employment_record.company_name}"
                if employment_record.start_date:
                    details += f" from {employment_record.start_date}"
                if employment_record.end_date:
                    details += f" to {employment_record.end_date}"
                elif employment_record.current_position:
                    details += " (current position)"
                
                return {
                    'status': 'verified',
                    'details': details,
                    'verified_by': 'The Work Number'
                }
            else:
                return {
                    'status': 'failed',
                    'details': 'No matching employment records found'
                }
        else:
            return {
                'status': 'inconclusive',
                'details': 'Company not found in verification database - manual verification required'
            }
    
    def _is_valid_company(self, company_name):
        """Check if company is in our database of valid companies"""
        # Simulate company validation
        valid_companies = [
            'Google', 'Microsoft', 'Apple', 'Amazon', 'Facebook', 'Tesla', 'Netflix',
            'IBM', 'Oracle', 'Salesforce', 'Adobe', 'Intel', 'Cisco', 'HP',
            'Dell', 'Uber', 'Airbnb', 'Twitter', 'LinkedIn', 'PayPal'
        ]
        
        return any(valid_company.lower() in company_name.lower() for valid_company in valid_companies)
    
    def _check_employment_records(self, verification_data):
        """Simulate checking employment records"""
        # In a real implementation, this would query external databases
        import random
        return {
            'found': random.choice([True, True, False]),  # 67% success rate
            'dates_match': random.choice([True, False]),
            'title_match': random.choice([True, False])
        }
    
    def verify_with_supervisor(self, employment_record_id, background_check_id):
        """
        Initiate supervisor verification for employment record
        
        Args:
            employment_record_id (int): ID of the employment record
            background_check_id (int): ID of the background check
            
        Returns:
            dict: Verification initiation result
        """
        employment_record = EmploymentRecord.query.get(employment_record_id)
        if not employment_record:
            return {'error': 'Employment record not found'}
        
        if not employment_record.supervisor_contact:
            return {'error': 'No supervisor contact information available'}
        
        # Create verification result record for supervisor verification
        verification_result = VerificationResult(
            background_check_id=background_check_id,
            verification_type='employment',
            record_id=employment_record_id,
            status='pending',
            verification_method='supervisor_contact',
            details='Supervisor verification initiated'
        )
        
        db.session.add(verification_result)
        db.session.commit()
        
        # Simulate sending verification request to supervisor
        verification_request = {
            'type': 'supervisor_verification',
            'employment_record_id': employment_record_id,
            'supervisor_name': employment_record.supervisor_name,
            'supervisor_contact': employment_record.supervisor_contact,
            'employee_name': f"{employment_record.candidate.first_name} {employment_record.candidate.last_name}",
            'verification_questions': [
                'Did this person work at your company?',
                'What was their job title?',
                'What were their employment dates?',
                'Would you rehire this person?',
                'Any additional comments?'
            ],
            'created_at': datetime.utcnow().isoformat()
        }
        
        return {
            'message': 'Supervisor verification request sent',
            'verification_request': verification_request,
            'verification_result_id': verification_result.id
        }
    
    def manual_verification_required(self, employment_record_id):
        """
        Flag an employment record for manual verification
        
        Args:
            employment_record_id (int): ID of the employment record
            
        Returns:
            dict: Status message
        """
        employment_record = EmploymentRecord.query.get(employment_record_id)
        if not employment_record:
            return {'error': 'Employment record not found'}
        
        # Create a manual verification task
        verification_task = {
            'type': 'manual_employment_verification',
            'employment_record_id': employment_record_id,
            'company_contact_required': True,
            'documents_needed': ['Employment letter', 'Pay stubs', 'W-2 forms'],
            'verification_methods': ['Phone call to HR', 'Email verification', 'Document review'],
            'priority': 'normal',
            'created_at': datetime.utcnow().isoformat()
        }
        
        return {
            'message': 'Manual verification task created',
            'task': verification_task
        }
    
    def bulk_verify_employment_records(self, employment_record_ids, background_check_id):
        """
        Verify multiple employment records in bulk
        
        Args:
            employment_record_ids (list): List of employment record IDs
            background_check_id (int): ID of the background check
            
        Returns:
            dict: Bulk verification results
        """
        results = []
        
        for record_id in employment_record_ids:
            result = self.verify_employment_record(record_id, background_check_id)
            results.append(result)
            
            # Add delay to avoid overwhelming external services
            time.sleep(1)
        
        return {
            'total_records': len(employment_record_ids),
            'results': results,
            'summary': self._generate_verification_summary(results)
        }
    
    def _generate_verification_summary(self, results):
        """Generate summary of verification results"""
        verified_count = sum(1 for r in results if r.get('result') == 'pass')
        failed_count = sum(1 for r in results if r.get('result') == 'fail')
        inconclusive_count = sum(1 for r in results if r.get('result') == 'inconclusive')
        
        return {
            'verified': verified_count,
            'failed': failed_count,
            'inconclusive': inconclusive_count,
            'success_rate': f"{(verified_count / len(results) * 100):.1f}%" if results else "0%"
        }
    
    def get_employment_verification_status(self, employment_record_id):
        """
        Get the current verification status of an employment record
        
        Args:
            employment_record_id (int): ID of the employment record
            
        Returns:
            dict: Verification status information
        """
        employment_record = EmploymentRecord.query.get(employment_record_id)
        if not employment_record:
            return {'error': 'Employment record not found'}
        
        verification_results = VerificationResult.query.filter_by(
            verification_type='employment',
            record_id=employment_record_id
        ).order_by(VerificationResult.created_at.desc()).all()
        
        return {
            'employment_record_id': employment_record_id,
            'verified': employment_record.verified,
            'verification_date': employment_record.verification_date.isoformat() if employment_record.verification_date else None,
            'verification_notes': employment_record.verification_notes,
            'verification_attempts': len(verification_results),
            'latest_verification': verification_results[0].to_dict() if verification_results else None
        }

