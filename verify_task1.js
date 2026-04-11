const fs = require('fs');
const sql = fs.readFileSync('supabase/migrations/20260318_phase3_roles_casos.sql', 'utf8');
const checks = [
  'CREATE TABLE IF NOT EXISTS user_roles',
  'CREATE TABLE IF NOT EXISTS casos',
  'ENABLE ROW LEVEL SECURITY',
  'SECURITY DEFINER',
  'casos_admin_all',
  'casos_presidente_all',
  'casos_user_select',
  'authenticated_upload_casos'
];
checks.forEach(c => {
  if (!sql.includes(c)) throw new Error('Missing: ' + c);
});
console.log('SQL migration valid — all required sections present');
