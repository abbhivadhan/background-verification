import requests
import time
from datetime import datetime
from src.models.user import db
from src.models.background_check import CriminalCheck, BackgroundCheck

class CriminalBackgroundService:
    """Service for conducting criminal background checks"""
    
    def __init__(self):
        self.verification_sources = {
            'county_courts': {
                'enabled': True,
                'coverage': 'local'
            },
            'state_repositories': {
                'enabled': True,
                'coverage': 'state'
            },
            'federal_databases': {
                'enabled': True,
                'coverage': 'federal'
            },
            'sex_offender_registry': {
                'enabled': True,
                'coverage': 'national'
            }
        }
    
    def conduct_criminal_check(self, background_check_id, jurisdictions=None):
        """
        Conduct criminal background check across specified jurisdictions
        
        Args:
            background_check_id (int): ID of the background check
            jurisdictions (list): List of jurisdictions to check (optional)
            
        Returns:
            dict: Criminal check results
        """
        background_check = BackgroundCheck.query.get(background_check_id)
        if not background_check:
            return {'error': 'Background check not found'}
        
        candidate = background_check.candidate
        
        # Default jurisdictions based on candidate's address
        if not jurisdictions:
            jurisdictions = self._determine_jurisdictions(candidate)
        
        results = []
        
        for jurisdiction in jurisdictions:
            for check_type in ['county', 'state', 'federal', 'sex_offender']:
                if self._should_run_check(jurisdiction, check_type):
                    result = self._run_criminal_check(
                        background_check_id, 
                        jurisdiction, 
                        check_type, 
                        candidate
                    )
                    results.append(result)
                    
                    # Add delay between checks
                    time.sleep(0.5)
        
        return {
            'background_check_id': background_check_id,
            'total_checks': len(results),
            'results': results,
            'summary': self._generate_criminal_check_summary(results)
        }
    
    def _determine_jurisdictions(self, candidate):
        """Determine jurisdictions to check based on candidate information"""
        jurisdictions = []
        
        # Add current address jurisdiction
        if candidate.state:
            jurisdictions.append(f"{candidate.city}, {candidate.state}" if candidate.city else candidate.state)
        
        # Add common jurisdictions (in a real system, this would be more sophisticated)
        default_jurisdictions = [
            'Federal',
            'National Sex Offender Registry'
        ]
        
        jurisdictions.extend(default_jurisdictions)
        return list(set(jurisdictions))  # Remove duplicates
    
    def _should_run_check(self, jurisdiction, check_type):
        """Determine if a specific check should be run"""
        # Business logic to determine which checks to run
        if check_type == 'federal':
            return 'Federal' in jurisdiction
        elif check_type == 'sex_offender':
            return 'Sex Offender' in jurisdiction
        elif check_type == 'state':
            return any(state in jurisdiction for state in [
                'CA', 'NY', 'TX', 'FL', 'IL', 'PA', 'OH', 'GA', 'NC', 'MI'
            ])
        elif check_type == 'county':
            return ',' in jurisdiction  # Has city and state
        
        return True
    
    def _run_criminal_check(self, background_check_id, jurisdiction, check_type, candidate):
        """
        Run a specific criminal check
        
        Args:
            background_check_id (int): Background check ID
            jurisdiction (str): Jurisdiction to check
            check_type (str): Type of criminal check
            candidate: Candidate object
            
        Returns:
            dict: Criminal check result
        """
        # Create criminal check record
        criminal_check = CriminalCheck(
            background_check_id=background_check_id,
            jurisdiction=jurisdiction,
            check_type=check_type,
            status='pending'
        )
        
        db.session.add(criminal_check)
        db.session.commit()
        
        try:
            # Simulate criminal check process
            check_result = self._simulate_criminal_search(candidate, jurisdiction, check_type)
            
            # Update criminal check record
            criminal_check.status = 'completed'
            criminal_check.result = check_result['result']
            criminal_check.records_found = check_result['records_found']
            criminal_check.record_details = check_result['details']
            criminal_check.search_date = datetime.utcnow()
            
            db.session.commit()
            
            return criminal_check.to_dict()
            
        except Exception as e:
            criminal_check.status = 'failed'
            criminal_check.record_details = f'Check failed: {str(e)}'
            db.session.commit()
            return {'error': str(e)}
    
    def _simulate_criminal_search(self, candidate, jurisdiction, check_type):
        """
        Simulate criminal record search
        
        Args:
            candidate: Candidate object
            jurisdiction (str): Jurisdiction being searched
            check_type (str): Type of check
            
        Returns:
            dict: Search result
        """
        import random
        
        # Simulate different outcomes based on check type
        if check_type == 'sex_offender':
            # Sex offender checks typically have very low hit rates
            has_records = random.random() < 0.01  # 1% chance
        elif check_type == 'federal':
            # Federal checks have low hit rates
            has_records = random.random() < 0.05  # 5% chance
        else:
            # County and state checks have higher hit rates
            has_records = random.random() < 0.15  # 15% chance
        
        if has_records:
            # Generate simulated criminal record details
            record_types = ['Misdemeanor', 'Felony', 'Traffic Violation', 'Civil Infraction']
            charges = [
                'Theft', 'DUI', 'Assault', 'Drug Possession', 'Fraud', 
                'Vandalism', 'Disorderly Conduct', 'Speeding'
            ]
            
            record_details = {
                'case_number': f"CR-{random.randint(100000, 999999)}",
                'charge': random.choice(charges),
                'type': random.choice(record_types),
                'date': (datetime.now().replace(year=datetime.now().year - random.randint(1, 10))).strftime('%Y-%m-%d'),
                'disposition': random.choice(['Convicted', 'Dismissed', 'Pending', 'Acquitted']),
                'jurisdiction': jurisdiction
            }
            
            return {
                'result': 'records_found',
                'records_found': True,
                'details': f"Record found: {record_details['charge']} ({record_details['type']}) - {record_details['disposition']}"
            }
        else:
            return {
                'result': 'clear',
                'records_found': False,
                'details': f'No criminal records found in {jurisdiction} ({check_type})'
            }
    
    def _generate_criminal_check_summary(self, results):
        """Generate summary of criminal check results"""
        total_checks = len(results)
        clear_checks = sum(1 for r in results if r.get('result') == 'clear')
        records_found = sum(1 for r in results if r.get('records_found', False))
        failed_checks = sum(1 for r in results if 'error' in r)
        
        return {
            'total_checks': total_checks,
            'clear_results': clear_checks,
            'records_found': records_found,
            'failed_checks': failed_checks,
            'overall_status': 'clear' if records_found == 0 and failed_checks == 0 else 'records_found' if records_found > 0 else 'incomplete'
        }
    
    def get_sex_offender_check(self, background_check_id):
        """
        Perform specific sex offender registry check
        
        Args:
            background_check_id (int): Background check ID
            
        Returns:
            dict: Sex offender check result
        """
        background_check = BackgroundCheck.query.get(background_check_id)
        if not background_check:
            return {'error': 'Background check not found'}
        
        return self._run_criminal_check(
            background_check_id,
            'National Sex Offender Registry',
            'sex_offender',
            background_check.candidate
        )
    
    def get_federal_criminal_check(self, background_check_id):
        """
        Perform federal criminal background check
        
        Args:
            background_check_id (int): Background check ID
            
        Returns:
            dict: Federal criminal check result
        """
        background_check = BackgroundCheck.query.get(background_check_id)
        if not background_check:
            return {'error': 'Background check not found'}
        
        return self._run_criminal_check(
            background_check_id,
            'Federal',
            'federal',
            background_check.candidate
        )
    
    def get_criminal_check_status(self, background_check_id):
        """
        Get status of all criminal checks for a background check
        
        Args:
            background_check_id (int): Background check ID
            
        Returns:
            dict: Criminal check status summary
        """
        criminal_checks = CriminalCheck.query.filter_by(
            background_check_id=background_check_id
        ).all()
        
        if not criminal_checks:
            return {
                'background_check_id': background_check_id,
                'status': 'not_started',
                'checks': []
            }
        
        completed_checks = [c for c in criminal_checks if c.status == 'completed']
        pending_checks = [c for c in criminal_checks if c.status == 'pending']
        failed_checks = [c for c in criminal_checks if c.status == 'failed']
        
        overall_status = 'completed' if len(completed_checks) == len(criminal_checks) else 'in_progress'
        
        return {
            'background_check_id': background_check_id,
            'status': overall_status,
            'total_checks': len(criminal_checks),
            'completed': len(completed_checks),
            'pending': len(pending_checks),
            'failed': len(failed_checks),
            'checks': [check.to_dict() for check in criminal_checks],
            'summary': self._generate_criminal_check_summary([c.to_dict() for c in completed_checks])
        }

