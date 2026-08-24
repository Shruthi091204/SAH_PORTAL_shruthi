const fs = require('fs');

const rawData = fs.readFileSync('data/sihProblemStatements.json', 'utf-8');
const psList = JSON.parse(rawData);

let sql = `-- Remove problem statement associations from existing teams to avoid foreign key errors
UPDATE public.teams SET ps_id = NULL;

-- Clear existing dummy problem statements
DELETE FROM public.problem_statements;

-- Insert real SIH 2024 problem statements
INSERT INTO public.problem_statements (ps_code, title, category, domain, organization, description) VALUES
`;

const escapeSql = (str) => {
    if (!str) return 'NULL';
    return "'" + str.replace(/'/g, "''") + "'";
};

const values = psList.map(ps => {
    return `(${escapeSql(ps.psNumber)}, ${escapeSql(ps.title)}, ${escapeSql(ps.category)}, ${escapeSql(ps.theme)}, ${escapeSql(ps.org)}, ${escapeSql('')})`;
});

sql += values.join(',\n') + ';';

fs.writeFileSync('supabase/insert_real_ps.sql', sql);
console.log('Successfully generated supabase/insert_real_ps.sql');
