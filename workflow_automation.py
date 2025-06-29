from datetime import datetime
from src.models.user import db
from src.models.background_check import BackgroundCheck
from src.services.education_verification import EducationVerificationService
from src.services.employment_verification import EmploymentVerificationService
from src.services.criminal_background import CriminalBackgroundService

class BackgroundCheckWorkflow:
    """Workflow automation for background check processes"""
    
    def __init__(self):
        self.education_service = EducationVerificationService()
        self.employment_service = EmploymentVerificationService()
        self.criminal_service = CriminalBackgroundService()
        
        self.workflow_steps = {
            'basic': [
                'verify_education',
                'verify_employment',
                'criminal_check_county'
            ],
            'standard': [
                'verify_education',
                'verify_employment', 
                'criminal_check_county',
                'criminal_check_state',
                'sex_offender_check'
            ],
            'comprehensive': [
                'verify_education',
                'verify_employment',
                'criminal_check_county',
                'criminal_check_state',
                'criminal_check_federal',
                'sex_offender_check',
                'credit_check'
            ]
        }
    
    def start_background_check_workflow(self, background_check_id):
        """
        Start the automated background check workflow
        
        Args:
            background_check_id (int): ID of the background check
            
        Returns:
            dict: Workflow initiation result
        """
        background_check = BackgroundCheck.query.get(background_check_id)
        if not background_check:
            return {'error': 'Background check not found'}
        
        if not background_check.consent_given:
            return {'error': 'Cannot start workflow without candidate consent'}
        
        if background_check.status != 'pending':
            return {'error': 'Background check must be in pending status to start workflow'}
        
        # Update status to in_progress
        background_check.status = 'in_progress'
        background_check.started_at = datetime.utcnow()
        background_check.updated_at = datetime.utcnow()
        db.session.commit()
        
        # Get workflow steps based on check type
        steps = self.workflow_steps.get(background_check.check_type, self.workflow_steps['standard'])
        
        # Create workflow execution plan
        workflow_plan = {
            'background_check_id': background_check_id,
            'check_type': background_check.check_type,
            'steps': steps,
            'started_at': datetime.utcnow().isoformat(),
            'estimated_completion': self._estimate_completion_time(steps),
            'status': 'started'
        }
        
        # Execute workflow steps
        results = self._execute_workflow_steps(background_check, steps)
        
        return {
            'workflow_plan': workflow_plan,
            'execution_results': results
        }
    
    def _execute_workflow_steps(self, background_check, steps):
        """
        Execute the workflow steps for a background check
        
        Args:
            background_check: BackgroundCheck object
            steps (list): List of workflow steps to execute
            
        Returns:
            dict: Execution results
        """
        results = {
            'completed_steps': [],
            'failed_steps': [],
            'pending_steps': []
        }
        
        candidate = background_check.candidate
        
        for step in steps:
            try:
                if step == 'verify_education':
                    education_results = self._verify_all_education_records(background_check.id, candidate)
                    results['completed_steps'].append({
                        'step': step,
                        'status': 'completed',
                        'results': education_results
                    })
                
                elif step == 'verify_employment':
                    employment_results = self._verify_all_employment_records(background_check.id, candidate)
                    results['completed_steps'].append({
                        'step': step,
                        'status': 'completed',
                        'results': employment_results
                    })
                
                elif step.startswith('criminal_check'):
                    criminal_results = self._execute_criminal_check_step(background_check.id, step)
                    results['completed_steps'].append({
                        'step': step,
                        'status': 'completed',
                        'results': criminal_results
                    })
                
                elif step == 'credit_check':
                    # Credit check would be implemented here
                    results['pending_steps'].append({
                        'step': step,
                        'status': 'pending',
                        'reason': 'Credit check service not yet implemented'
                    })
                
                else:
                    results['failed_steps'].append({
                        'step': step,
                        'status': 'failed',
                        'reason': f'Unknown step: {step}'
                    })
            
            except Exception as e:
                results['failed_steps'].append({
                    'step': step,
                    'status': 'failed',
                    'error': str(e)
                })
        
        # Update background check status based on results
        self._update_background_check_status(background_check, results)
        
        return results
    
    def _verify_all_education_records(self, background_check_id, candidate):
        """Verify all education records for a candidate"""
        education_records = candidate.education_records
        
        if not education_records:
            return {'message': 'No education records to verify'}
        
        record_ids = [record.id for record in education_records]
        return self.education_service.bulk_verify_education_records(record_ids, background_check_id)
    
    def _verify_all_employment_records(self, background_check_id, candidate):
        """Verify all employment records for a candidate"""
        employment_records = candidate.employment_records
        
        if not employment_records:
            return {'message': 'No employment records to verify'}
        
        record_ids = [record.id for record in employment_records]
        return self.employment_service.bulk_verify_employment_records(record_ids, background_check_id)
    
    def _execute_criminal_check_step(self, background_check_id, step):
        """Execute a specific criminal check step"""
        if step == 'criminal_check_county':
            return self.criminal_service.conduct_criminal_check(
                background_check_id, 
                jurisdictions=['County']
            )
        elif step == 'criminal_check_state':
            return self.criminal_service.conduct_criminal_check(
                background_check_id,
                jurisdictions=['State']
            )
        elif step == 'criminal_check_federal':
            return self.criminal_service.get_federal_criminal_check(background_check_id)
        elif step == 'sex_offender_check':
            return self.criminal_service.get_sex_offender_check(background_check_id)
        else:
            return {'error': f'Unknown criminal check step: {step}'}
    
    def _update_background_check_status(self, background_check, results):
        """Update background check status based on workflow results"""
        total_steps = len(results['completed_steps']) + len(results['failed_steps']) + len(results['pending_steps'])
        completed_steps = len(results['completed_steps'])
        failed_steps = len(results['failed_steps'])
        
        if failed_steps > 0:
            background_check.status = 'failed'
        elif completed_steps == total_steps:
            background_check.status = 'completed'
            background_check.completed_at = datetime.utcnow()
        else:
            background_check.status = 'in_progress'
        
        background_check.updated_at = datetime.utcnow()
        db.session.commit()
    
    def _estimate_completion_time(self, steps):
        """Estimate completion time for workflow steps"""
        # Estimated time per step in minutes
        step_times = {
            'verify_education': 5,
            'verify_employment': 10,
            'criminal_check_county': 15,
            'criminal_check_state': 20,
            'criminal_check_federal': 30,
            'sex_offender_check': 5,
            'credit_check': 10
        }
        
        total_minutes = sum(step_times.get(step, 10) for step in steps)
        
        estimated_completion = datetime.utcnow()
        estimated_completion = estimated_completion.replace(
            minute=estimated_completion.minute + total_minutes
        )
        
        return estimated_completion.isoformat()
    
    def get_workflow_status(self, background_check_id):
        """
        Get the current status of a background check workflow
        
        Args:
            background_check_id (int): ID of the background check
            
        Returns:
            dict: Workflow status information
        """
        background_check = BackgroundCheck.query.get(background_check_id)
        if not background_check:
            return {'error': 'Background check not found'}
        
        # Get verification results
        verification_results = background_check.verification_results
        criminal_checks = background_check.criminal_checks
        
        # Calculate progress
        expected_steps = len(self.workflow_steps.get(background_check.check_type, []))
        completed_verifications = len([vr for vr in verification_results if vr.status == 'verified'])
        completed_criminal_checks = len([cc for cc in criminal_checks if cc.status == 'completed'])
        
        total_completed = completed_verifications + completed_criminal_checks
        progress_percentage = (total_completed / expected_steps * 100) if expected_steps > 0 else 0
        
        return {
            'background_check_id': background_check_id,
            'status': background_check.status,
            'progress_percentage': round(progress_percentage, 1),
            'started_at': background_check.started_at.isoformat() if background_check.started_at else None,
            'completed_at': background_check.completed_at.isoformat() if background_check.completed_at else None,
            'verification_results': [vr.to_dict() for vr in verification_results],
            'criminal_checks': [cc.to_dict() for cc in criminal_checks],
            'next_steps': self._get_next_steps(background_check)
        }
    
    def _get_next_steps(self, background_check):
        """Determine next steps for a background check"""
        if background_check.status == 'pending':
            return ['Obtain candidate consent', 'Start workflow']
        elif background_check.status == 'in_progress':
            # Determine which steps are still pending
            completed_types = set()
            
            for vr in background_check.verification_results:
                if vr.status == 'verified':
                    completed_types.add(vr.verification_type)
            
            for cc in background_check.criminal_checks:
                if cc.status == 'completed':
                    completed_types.add(f'criminal_{cc.check_type}')
            
            workflow_steps = self.workflow_steps.get(background_check.check_type, [])
            pending_steps = []
            
            for step in workflow_steps:
                if step == 'verify_education' and 'education' not in completed_types:
                    pending_steps.append('Complete education verification')
                elif step == 'verify_employment' and 'employment' not in completed_types:
                    pending_steps.append('Complete employment verification')
                elif step.startswith('criminal_check') and step.replace('criminal_check_', 'criminal_') not in completed_types:
                    pending_steps.append(f'Complete {step.replace("_", " ")}')
            
            return pending_steps if pending_steps else ['Generate final report']
        
        elif background_check.status == 'completed':
            return ['Generate final report', 'Deliver results']
        else:
            return ['Review failed checks', 'Retry or manual intervention required']

