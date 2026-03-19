const fs = require('fs');
let c = fs.readFileSync('openapi.yaml', 'utf8');

// Fix REST endpoint trailing slashes thrown by redocly
c = c.replace(/  \/api\/upload\/:/g, '  /api/upload:');
c = c.replace(/  \/api\/applications\/:/g, '  /api/applications:');
c = c.replace(/  \/api\/rent-requests\/:/g, '  /api/rent-requests:');

// Generic reusable problem boundaries
const responsesBlock = `
    BadRequest:
      description: Bad Request
      content:
        application/problem+json:
          schema:
            $ref: "#/components/schemas/ProblemDetails"
    Forbidden:
      description: Forbidden
      content:
        application/problem+json:
          schema:
            $ref: "#/components/schemas/ProblemDetails"
    NotFound:
      description: Not Found
      content:
        application/problem+json:
          schema:
            $ref: "#/components/schemas/ProblemDetails"
    InternalError:
      description: Internal Server Error
      content:
        application/problem+json:
          schema:
            $ref: "#/components/schemas/ProblemDetails"
`;

// Insert cleanly beneath responses header if not already there
if (!c.includes('BadRequest:')) {
    if (c.includes('  responses:')) {
        c = c.replace('  responses:', '  responses:' + responsesBlock);
    } else {
        c += '\n  responses:' + responsesBlock;
    }
}

// ProblemDetails Schema Definition
const problemDetailsSchema = `
    ProblemDetails:
      type: object
      required: [type, title, status]
      properties:
        type: { type: string, format: uri }
        title: { type: string }
        status: { type: integer }
        detail: { type: string }
        instance: { type: string, format: uri }
`;

if (!c.includes('ProblemDetails:')) {
   if (c.includes('  schemas:')) {
       c = c.replace('  schemas:', '  schemas:' + problemDetailsSchema);
   } else {
       c = c.replace('components:', 'components:\n  schemas:' + problemDetailsSchema);
   }
}

fs.writeFileSync('openapi.yaml', c);
console.log('Successfully injected missing references.');
