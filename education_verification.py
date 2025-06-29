import requests
import time
from datetime import datetime
from src.models.user import db
from src.models.candidate import EducationRecord
from src.models.background_check import VerificationResult

class EducationVerificationService:
    """Service for verifying education records"""
    
    def __init__(self):
        self.verification_sources = {
            'national_student_clearinghouse': {
                'url': 'https://api.studentclearinghouse.org/verify',
                'api_key': 'your_api_key_here'
            },
            'manual_verification': {
                'enabled': True
            }
        }
    
    def verify_education_record(self, education_record_id, background_check_id):
        """
        Verify an education record
        
        Args:
            education_record_id (int): ID of the education record to verify
            background_check_id (int): ID of the background check
            
        Returns:
            dict: Verification result
        """
        education_record = EducationRecord.query.get(education_record_id)
        if not education_record:
            return {'error': 'Education record not found'}
        
        # Create verification result record
        verification_result = VerificationResult(
            background_check_id=background_check_id,
            verification_type='education',
            record_id=education_record_id,
            status='pending',
            verification_method='automated'
        )
        
        db.session.add(verification_result)
        db.session.commit()
        
        try:
            # Try automated verification first
            result = self._automated_verification(education_record)
            
            if result['status'] == 'verified':
                verification_result.status = 'verified'
                verification_result.result = 'pass'
                verification_result.details = result['details']
                verification_result.verified_by = result['verified_by']
                verification_result.verification_date = datetime.utcnow()
                
                # Update education record
                education_record.verified = True
                education_record.verification_date = datetime.utcnow()
                education_record.verification_notes = result['details']
                
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
    
    def _automated_verification(self, education_record):
        """
        Perform automated verification using external services
        
        Args:
            education_record: EducationRecord object
            
        Returns:
            dict: Verification result
        """
        # Simulate API call to National Student Clearinghouse or similar service
        # In a real implementation, you would make actual API calls
        
        verification_data = {
            'institution_name': education_record.institution_name,
            'degree_type': education_record.degree_type,
            'field_of_study': education_record.field_of_study,
            'graduation_date': education_record.graduation_date.isoformat() if education_record.graduation_date else None,
            'student_name': f"{education_record.candidate.first_name} {education_record.candidate.last_name}",
            'date_of_birth': education_record.candidate.date_of_birth.isoformat() if education_record.candidate.date_of_birth else None
        }
        
        # Simulate verification logic
        if self._is_valid_institution(education_record.institution_name):
            if self._check_degree_records(verification_data):
                return {
                    'status': 'verified',
                    'details': f'Degree verified: {education_record.degree_type} in {education_record.field_of_study} from {education_record.institution_name}',
                    'verified_by': 'National Student Clearinghouse'
                }
            else:
                return {
                    'status': 'failed',
                    'details': 'No matching degree records found in institutional database'
                }
        else:
            return {
                'status': 'inconclusive',
                'details': 'Institution not found in verification database - manual verification required'
            }
    
    def _is_valid_institution(self, institution_name):
        """Check if institution is in our database of valid institutions"""
        # Simulate institution validation
        valid_institutions = [
            'Harvard University', 'Stanford University', 'MIT', 'University of California',
            'Yale University', 'Princeton University', 'Columbia University', 'University of Chicago',
            'University of Pennsylvania', 'Northwestern University', 'Duke University',
            'Johns Hopkins University', 'Dartmouth College', 'Brown University', 'Vanderbilt University'
        ]
        
        return any(valid_inst.lower() in institution_name.lower() for valid_inst in valid_institutions)
    
    def _check_degree_records(self, verification_data):
        """Simulate checking degree records"""
        # In a real implementation, this would query external databases
        # For simulation, we'll return True for most cases
        import random
        return random.choice([True, True, True, False])  # 75% success rate
    
    def manual_verification_required(self, education_record_id):
        """
        Flag an education record for manual verification
        
        Args:
            education_record_id (int): ID of the education record
            
        Returns:
            dict: Status message
        """
        education_record = EducationRecord.query.get(education_record_id)
        if not education_record:
            return {'error': 'Education record not found'}
        
        # Create a manual verification task
        verification_task = {
            'type': 'manual_education_verification',
            'education_record_id': education_record_id,
            'institution_contact_required': True,
            'documents_needed': ['Official transcript', 'Degree certificate'],
            'priority': 'normal',
            'created_at': datetime.utcnow().isoformat()
        }
        
        return {
            'message': 'Manual verification task created',
            'task': verification_task
        }
    
    def bulk_verify_education_records(self, education_record_ids, background_check_id):
        """
        Verify multiple education records in bulk
        
        Args:
            education_record_ids (list): List of education record IDs
            background_check_id (int): ID of the background check
            
        Returns:
            dict: Bulk verification results
        """
        results = []
        
        for record_id in education_record_ids:
            result = self.verify_education_record(record_id, background_check_id)
            results.append(result)
            
            # Add delay to avoid overwhelming external services
            time.sleep(1)
        
        return {
            'total_records': len(education_record_ids),
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

