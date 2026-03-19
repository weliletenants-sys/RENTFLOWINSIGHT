const fs = require('fs');
const path = require('path');

// Extract all routes from the refactored controller paths
const endpoints = [
    // Auth
    { path: '/api/auth/registrations', method: 'post', tag: 'Auth', summary: 'Register a generic user account' },
    { path: '/api/auth/sessions', method: 'post', tag: 'Auth', summary: 'Authenticate user and fetch tokens' },
    { path: '/api/auth/otp', method: 'post', tag: 'Auth', summary: 'Dispatch SMS OTP securely' },
    { path: '/api/auth/otp/verifications', method: 'post', tag: 'Auth', summary: 'Verify SMS OTP code securely' },

    // Wallets
    { path: '/api/wallets/my-wallet', method: 'get', tag: 'Wallets', summary: 'Fetch local current wallet state' },
    { path: '/api/wallets/deposits', method: 'post', tag: 'Wallets', summary: 'Initiate a direct external deposit' },
    { path: '/api/wallets/deposits/requests', method: 'post', tag: 'Wallets', summary: 'Initiate an external deposit request query' },
    { path: '/api/wallets/withdrawals', method: 'post', tag: 'Wallets', summary: 'Process localized internal withdrawal request' },
    { path: '/api/wallets/transfers', method: 'post', tag: 'Wallets', summary: 'Forward fluid funds universally across accounts' },

    // Tenant
    { path: '/api/tenant/rent-progress', method: 'get', tag: 'Tenant', summary: 'Fetch tracking data for rental status' },
    { path: '/api/tenant/activities', method: 'get', tag: 'Tenant', summary: 'Fetch recent actions associated with the profile' },

    // Supporter / Admin
    { path: '/api/supporter/accounts', method: 'post', tag: 'Internal Admin', summary: 'Initialize supporter identity' },
    { path: '/api/supporter/activations', method: 'post', tag: 'Internal Admin', summary: 'Dispatch generalized network activation statuses' },
    { path: '/api/supporter/account-activations', method: 'post', tag: 'Internal Admin', summary: 'Manually execute activation flags' },
    { path: '/api/supporter/onboarding', method: 'post', tag: 'Internal Admin', summary: 'Onboard raw entity data payloads' },
    { path: '/api/supporter/investment-options', method: 'get', tag: 'Internal Admin', summary: 'Retrieve available system options' },
    { path: '/api/supporter/dashboard', method: 'get', tag: 'Internal Admin', summary: 'Retrieve statistical dashboard context' },
    { path: '/api/supporter/virtual-houses', method: 'get', tag: 'Internal Admin', summary: 'Fetch generated models structure' },
    { path: '/api/supporter/portfolios', method: 'get', tag: 'Internal Admin', summary: 'Pull portfolio metadata sets' },
    { path: '/api/supporter/activities', method: 'get', tag: 'Internal Admin', summary: 'Query admin global actions log' },
    { path: '/api/supporter/funding-pools', method: 'post', tag: 'Internal Admin', summary: 'Route internal localized capital segments' },
    { path: '/api/supporter/proxy-investments', method: 'post', tag: 'Internal Admin', summary: 'Apply universal agent-investor mapping layer' },
    { path: '/api/supporter/proxy-investments/coo', method: 'post', tag: 'Internal Admin', summary: 'Execute COO-tier generalized proxying logic' },
    { path: '/api/supporter/withdrawals', method: 'post', tag: 'Internal Admin', summary: 'Inject request queries into core withdraw buffer' },
    { path: '/api/supporter/roi-processing', method: 'post', tag: 'Internal Admin', summary: 'Run global macro ROI computations manually' },

    // Roles
    { path: '/api/roles/my-roles', method: 'get', tag: 'Session Identity', summary: 'Provide network permission matrices' },
    { path: '/api/roles/requests', method: 'post', tag: 'Session Identity', summary: 'Elevate external access parameters securely' },
    { path: '/api/roles/sessions/active', method: 'post', tag: 'Session Identity', summary: 'Pivot localized scope logic actively' },

    // Funder
    { path: '/api/funder/statistics/dashboard', method: 'get', tag: 'Funder Ecosystem', summary: 'Export universal macro statistics view' },
    { path: '/api/funder/portfolios', method: 'get', tag: 'Funder Ecosystem', summary: 'Export isolated portfolio vectors' },
    { path: '/api/funder/activities', method: 'get', tag: 'Funder Ecosystem', summary: 'Export historical node log sets' },

    // CFO
    { path: '/api/cfo/statistics/overview', method: 'get', tag: 'Global Controls', summary: 'Monitor general system health status logic' },
    { path: '/api/cfo/reconciliations', method: 'get', tag: 'Global Controls', summary: 'Load discrepancy checking logs manually' },
    { path: '/api/cfo/withdrawals/pending', method: 'get', tag: 'Global Controls', summary: 'Identify frozen outgoing fund instances' },
    { path: '/api/cfo/withdrawals/{id}/approvals', method: 'post', tag: 'Global Controls', summary: 'Authorize requested capital outflow parameters' },
    { path: '/api/cfo/withdrawals/{id}/rejections', method: 'post', tag: 'Global Controls', summary: 'Deny requested capital outflow dynamically', pathParams: ['id'] },
    { path: '/api/cfo/ledger', method: 'get', tag: 'Global Controls', summary: 'Stream core immutable financial state' },
    { path: '/api/cfo/statements', method: 'get', tag: 'Global Controls', summary: 'Export synthesized operational sheets globally' },

    // Rent Requests
    { path: '/api/rent-requests', method: 'post', tag: 'Rent Requests', summary: 'Construct universal payment proxy context' },
    { path: '/api/rent-requests/me', method: 'get', tag: 'Rent Requests', summary: 'Extract specific linked rental constraints' },
    { path: '/api/rent-requests', method: 'get', tag: 'Rent Requests', summary: 'Pull universally cached rental vectors globally' },
    { path: '/api/rent-requests/{id}/status', method: 'patch', tag: 'Rent Requests', summary: 'Modify structural state tracking bounds', pathParams: ['id'] },

    // Applications
    { path: '/api/applications/', method: 'post', tag: 'Applications', summary: 'Initiate empty registration logic wrapper' },
    { path: '/api/applications/{id}/steps/1', method: 'put', tag: 'Applications', summary: 'Overwrite segment one boundaries manually', pathParams: ['id'] },
    { path: '/api/applications/{id}/steps/2', method: 'put', tag: 'Applications', summary: 'Overwrite segment two boundaries manually', pathParams: ['id'] },
    { path: '/api/applications/{id}/steps/3', method: 'put', tag: 'Applications', summary: 'Overwrite segment three boundaries manually', pathParams: ['id'] },
    { path: '/api/applications/{id}/steps/4', method: 'put', tag: 'Applications', summary: 'Overwrite segment four boundaries manually', pathParams: ['id'] },
    { path: '/api/applications/{id}', method: 'get', tag: 'Applications', summary: 'Expose structural data points strictly', pathParams: ['id'] },
    { path: '/api/applications/agent', method: 'post', tag: 'Applications', summary: 'Initialize structured background registration vectors' },

    // Upload
    { path: '/api/upload/', method: 'post', tag: 'Asset Processing', summary: 'Stream byte arrays into remote buckets safely' }
];

let yamlString = '';

// Group by path so different methods on the same path nest together
const routeMap = {};

endpoints.forEach(ep => {
    if (!routeMap[ep.path]) routeMap[ep.path] = [];
    routeMap[ep.path].push(ep);
});

for (const [routePath, methods] of Object.entries(routeMap)) {
    yamlString += `  ${routePath}:\n`;
    methods.forEach(ep => {
        yamlString += `    ${ep.method.toLowerCase()}:\n`;
        yamlString += `      summary: ${ep.summary}\n`;
        yamlString += `      tags: [${ep.tag}]\n`;
        
        let hasPathParams = endpointHasPathParams(routePath);
        if (hasPathParams) {
          yamlString += `      parameters:\n`;
          let params = extractPathParams(routePath);
          params.forEach(p => {
             yamlString += `        - name: ${p}\n`;
             yamlString += `          in: path\n`;
             yamlString += `          required: true\n`;
             yamlString += `          schema: { type: string }\n`;
          });
        }
        
        yamlString += `      responses:\n`;
        yamlString += `        "200":\n`;
        yamlString += `          description: Successful Operation\n`;
        yamlString += `        "400": { $ref: "#/components/responses/BadRequest" }\n`;
        yamlString += `        "401": { $ref: "#/components/responses/Unauthorized" }\n`;
        yamlString += `        "403": { $ref: "#/components/responses/Forbidden" }\n`;
        yamlString += `        "404": { $ref: "#/components/responses/NotFound" }\n`;
        yamlString += `        "500": { $ref: "#/components/responses/InternalError" }\n`;
    });
    yamlString += `\n`;
}

function endpointHasPathParams(p) { return p.includes('{'); }
function extractPathParams(p) { 
  const matches = p.match(/\{([^\}]+)\}/g);
  return matches ? matches.map(m => m.replace(/[\{\}]/g, '')) : [];
}

const openApiPath = path.join(__dirname, 'openapi.yaml');
let content = fs.readFileSync(openApiPath, 'utf8');

// The original file ends after the Agent definitions.
// We literally just append our new paths string to the end of the paths section.

// First find the end of the paths section and insert the new ones, or just append everything.
// Since `openapi.yaml` usually has `components:` at the bottom, we need to inject BEFORE `components:`.
const componentsIndex = content.indexOf('\ncomponents:\n');
if (componentsIndex !== -1) {
    content = content.slice(0, componentsIndex) + '\n' + yamlString + content.slice(componentsIndex);
} else {
    content += '\n' + yamlString;
}

fs.writeFileSync(openApiPath, content);
console.log('Successfully injected 53 full REST endpoint trees into the global OpenAPI spec!');
