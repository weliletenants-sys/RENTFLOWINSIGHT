const fs = require('fs');
const path = require('path');

// Mappings for refactoring Backend routes to RESTful nouns
// We target specific .routes.ts files to narrowly replace the strings.
const routeReplacements = {
    'wallets.routes.ts': [
        { old: "'/deposit'", new: "'/deposits'" },
        { old: "'/request-deposit'", new: "'/deposits/requests'" },
        { old: "'/withdraw'", new: "'/withdrawals'" },
        { old: "'/transfer'", new: "'/transfers'" }
    ],
    'tenant.routes.ts': [
        { old: "'/recent-activities'", new: "'/activities'" }
    ],
    'supporter.routes.ts': [
        { old: "'/signup'", new: "'/accounts'" },
        { old: "'/dispatch-activations'", new: "'/activations'" },
        { old: "'/activate-account'", new: "'/account-activations'" },
        { old: "'/onboard'", new: "'/onboarding'" },
        { old: "'/fund-pool'", new: "'/funding-pools'" },
        { old: "'/proxy-invest'", new: "'/proxy-investments'" },
        { old: "'/coo-proxy-invest'", new: "'/proxy-investments/coo'" },
        { old: "'/request-withdrawal'", new: "'/withdrawals'" },
        { old: "'/process-roi'", new: "'/roi-processing'" }
    ],
    'roles.routes.ts': [
        { old: "'/request'", new: "'/requests'" },
        { old: "'/switch'", new: "'/sessions/active'" }
    ],
    'funder.routes.ts': [
        { old: "'/dashboard'", new: "'/statistics/dashboard'" }
    ],
    'cfo.routes.ts': [
        { old: "'/overview'", new: "'/statistics/overview'" },
        { old: "'/reconciliation'", new: "'/reconciliations'" },
        { old: "'/approvals/withdrawals'", new: "'/withdrawals/pending'" },
        { old: "'/approvals/withdrawals/:id/approve'", new: "'/withdrawals/:id/approvals'" },
        { old: "'/approvals/withdrawals/:id/reject'", new: "'/withdrawals/:id/rejections'" }
    ],
    'auth.routes.ts': [
        { old: "'/register'", new: "'/registrations'" },
        { old: "'/login'", new: "'/sessions'" },
        { old: "'/otp/send'", new: "'/otp'" },
        { old: "'/otp/verify'", new: "'/otp/verifications'" }
    ],
    'applications.routes.ts': [
        { old: "'/start'", new: "'/'" },
        { old: "'/:id/step1'", new: "'/:id/steps/1'" },
        { old: "'/:id/step2'", new: "'/:id/steps/2'" },
        { old: "'/:id/step3'", new: "'/:id/steps/3'" },
        { old: "'/:id/step4'", new: "'/:id/steps/4'" },
        { old: "'/agent/start'", new: "'/agent'" }
    ]
};

// Global mapping for Frontend to intercept all Axios calls
const frontendReplacements = [
    { old: "'/wallets/deposit'", new: "'/wallets/deposits'" },
    { old: "'/wallets/request-deposit'", new: "'/wallets/deposits/requests'" },
    { old: "'/wallets/withdraw'", new: "'/wallets/withdrawals'" },
    { old: "'/wallets/transfer'", new: "'/wallets/transfers'" },
    
    { old: "'/tenant/recent-activities'", new: "'/tenant/activities'" },
    
    { old: "'/supporter/signup'", new: "'/supporter/accounts'" },
    { old: "'/supporter/dispatch-activations'", new: "'/supporter/activations'" },
    { old: "'/supporter/activate-account'", new: "'/supporter/account-activations'" },
    { old: "'/supporter/onboard'", new: "'/supporter/onboarding'" },
    { old: "'/supporter/fund-pool'", new: "'/supporter/funding-pools'" },
    { old: "'/supporter/proxy-invest'", new: "'/supporter/proxy-investments'" },
    { old: "'/supporter/coo-proxy-invest'", new: "'/supporter/proxy-investments/coo'" },
    { old: "'/supporter/request-withdrawal'", new: "'/supporter/withdrawals'" },
    { old: "'/supporter/process-roi'", new: "'/supporter/roi-processing'" },
    
    { old: "'/roles/request'", new: "'/roles/requests'" },
    { old: "'/roles/switch'", new: "'/roles/sessions/active'" },
    
    { old: "'/funder/dashboard'", new: "'/funder/statistics/dashboard'" },
    
    { old: "'/cfo/overview'", new: "'/cfo/statistics/overview'" },
    { old: "'/cfo/reconciliation'", new: "'/cfo/reconciliations'" },
    { old: "'/cfo/approvals/withdrawals'", new: "'/cfo/withdrawals/pending'" },
    
    { old: "'/auth/register'", new: "'/auth/registrations'" },
    { old: "'/auth/login'", new: "'/auth/sessions'" },
    { old: "'/auth/otp/send'", new: "'/auth/otp'" },
    { old: "'/auth/otp/verify'", new: "'/auth/otp/verifications'" },
    
    { old: "'/applications/start'", new: "'/applications/'" },
    { old: "'/applications/agent/start'", new: "'/applications/agent'" }
];

// Helper to recursively fetch files
function getFiles(dir, matchExt) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) { 
            results = results.concat(getFiles(filePath, matchExt));
        } else if (filePath.endsWith(matchExt)) {
            results.push(filePath);
        }
    });
    return results;
}

// Ensure execution directory
const backendApiDir = path.join(__dirname, 'src', 'api');
const frontendServicesDir = path.join(__dirname, '..', 'frontend', 'src');

console.log('--- STARTING BACKEND REFACTOR ---');
const backendFiles = getFiles(backendApiDir, '.routes.ts');
backendFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    const filename = path.basename(file);
    if (routeReplacements[filename]) {
        let changed = false;
        routeReplacements[filename].forEach(rep => {
            if (content.includes(rep.old)) {
                content = content.replace(rep.old, rep.new);
                changed = true;
                console.log(`[Backend] Synced ${filename}: ${rep.old} -> ${rep.new}`);
            }
        });
        if (changed) fs.writeFileSync(file, content);
    }
});

console.log('\\n--- STARTING FRONTEND REFACTOR ---');
const frontendFiles = getFiles(frontendServicesDir, '.ts').concat(getFiles(frontendServicesDir, '.tsx'));
frontendFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;
    
    frontendReplacements.forEach(rep => {
        // Front-ends utilize backticks or double quotes or single quotes dynamically.
        // Doing exact string matching to be safe.
        if (content.includes(rep.old)) {
            content = content.replace(new RegExp(rep.old, 'g'), rep.new);
            changed = true;
            console.log(`[Frontend] Synced ${path.basename(file)}: ${rep.old} -> ${rep.new}`);
        }
        
        // Also check template literals starting with those prefixes (e.g. \`/cfo/approvals/withdrawals/\${id}/approve\`)
        const tlOld1 = rep.old.slice(1, -1);
        const tlNew1 = rep.new.slice(1, -1);
        if (content.includes('\`' + tlOld1)) {
            content = content.replace(new RegExp('\`' + tlOld1, 'g'), '\`' + tlNew1);
            changed = true;
        }
    });

    // Sub-replace for CFO parameterized approval endpoints
    if (content.includes('/approvals/withdrawals/${id}/approve')) {
        content = content.replace('/approvals/withdrawals/${id}/approve', '/withdrawals/${id}/approvals');
        changed = true;
    }
    if (content.includes('/approvals/withdrawals/${id}/reject')) {
        content = content.replace('/approvals/withdrawals/${id}/reject', '/withdrawals/${id}/rejections');
        changed = true;
    }
    
    // Sub-replace for Applications parameterized step endpoints
    for(let i=1; i<=4; i++) {
        const oldStep = `/\${id}/step${i}`;
        const newStep = `/\${id}/steps/${i}`;
        if (content.includes(oldStep)) {
            content = content.replace(oldStep, newStep);
            changed = true;
        }
    }

    if (changed) fs.writeFileSync(file, content);
});

console.log('\\n--- REFACTORING COMPLETE ---');
