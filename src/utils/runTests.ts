// Development test runner - use with ts-node
// Run with: npx ts-node src/utils/runTests.ts

import { validateRequiredFields, detectApplicationChanges, validateApplication } from './applicationValidation';
import { JobApplication } from '../types/job-application-types';

// Mock data helper
const createMockApplication = (overrides: Partial<JobApplication> = {}): JobApplication => ({
  id: 'test-id',
  company: 'Test Company',
  position: 'Software Engineer',
  status: { text: 'Applied', color: '#184e77' },
  appliedDate: '2025-01-01',
  description: '',
  salary: '',
  location: '',
  notes: '',
  link: '',
  questions: [],
  ...overrides
});

function test(name: string, assertion: boolean, message: string) {
  if (assertion) {
    console.log(`✓ ${name}: ${message}`);
  } else {
    console.error(`❌ ${name}: ${message}`);
    process.exit(1);
  }
}

function runTests() {
  console.log('🧪 Running Application Validation Tests\n');

  // Validation tests
  console.log('📋 Testing validateRequiredFields...');
  const validApp = createMockApplication();
  test('Valid app', validateRequiredFields(validApp).length === 0, 'Should have no missing fields');
  
  const invalidApp = createMockApplication({ company: '', position: '' });
  const errors = validateRequiredFields(invalidApp);
  test('Invalid app', errors.length === 2, `Should have 2 errors, got ${errors.length}`);
  test('Missing company', errors.includes('Company Name'), 'Should detect missing company');
  test('Missing position', errors.includes('Position Title'), 'Should detect missing position');

  // Change detection tests
  console.log('\n🔍 Testing detectApplicationChanges...');
  const original = createMockApplication();
  const unchanged = createMockApplication();
  test('No changes', !detectApplicationChanges(unchanged, original), 'Identical apps should show no changes');
  
  const changed = createMockApplication({ company: 'New Company' });
  test('Has changes', detectApplicationChanges(changed, original), 'Modified app should show changes');

  // Comprehensive validation tests
  console.log('\n📊 Testing validateApplication...');
  const validation = validateApplication(validApp);
  test('Validation result', validation.isValid, 'Valid app should pass comprehensive validation');
  test('Has warnings', validation.warnings.length > 0, 'Should have warnings for optional fields');

  console.log('\n🎉 All tests passed successfully!');
}

// Run the tests
runTests();
