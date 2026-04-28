const fs = require('fs');

const tsxContent = fs.readFileSync('src/funder/FunderOnboarding.tsx', 'utf8');

// Strip all imports (including multi-line)
const codeWithoutImports = tsxContent.replace(/import\s+[\s\S]*?from\s+['"][^'"]+['"];?\s*/g, '');

// Strip 'export default '
const codeWithoutExport = codeWithoutImports.replace(/export default function FunderOnboarding/, 'function FunderOnboarding');

// Type declarations like 'type InvestPath = ...' and 'interface FormState' are ignored by babel with typescript preset,
// but we only load standard Babel standalone. Wait, babel standalone supports typescript! 
// We just need to add data-type="module" type="text/babel" data-presets="react,typescript"

const htmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welile Funder Onboarding</title>
  
  <!-- Tailwind CSS -->
  <script src="https://cdn.tailwindcss.com"></script>
  
  <!-- Fonts -->
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@600;700;800&family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
  <style>
    body { font-family: 'Inter', sans-serif; }
    h1, h2, h3, h4, h5, h6 { font-family: 'Manrope', sans-serif; }
  </style>

  <!-- React & ReactDOM -->
  <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
  
  <!-- Framer Motion -->
  <script src="https://unpkg.com/framer-motion@10.16.4/dist/framer-motion.js" crossorigin></script>
  
  <script>window.react = window.React;</script>
  <!-- Lucide React -->
  <script src="https://unpkg.com/lucide-react@0.292.0/dist/umd/lucide-react.js" crossorigin></script>
  
  <!-- Babel -->
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
</head>
<body>
  <div id="root"></div>

  <script type="text/babel" data-presets="react,typescript">
    const { useState, useRef, useEffect } = React;
    const { motion, AnimatePresence, useInView } = window.Motion;
    const lucideObj = window.lucideReact || window.lucide;
    const {
      ArrowLeft, Check, X, Shield, Home, TrendingUp, Banknote,
      ChevronRight, BadgeCheck, Eye, EyeOff, Mail, Phone, Lock,
    } = lucideObj;

    // --- MOCKS ---
    const useNavigate = () => (path) => console.log('Navigating to:', path);
    const useRouteRole = () => 'FUNDER';
    const useAuth = () => ({ updateSession: () => {}, user: null });
    const registerUser = async () => new Promise(res => setTimeout(() => res({ status: 'success', data: { access_token: '123', user: {} } }), 1500));
    const toast = { success: (m) => alert(m), error: (m) => alert(m) };
    const useCurrency = () => ({ symbol: 'USh' });
    const formatCurrencyCompact = (v) => {
      if (v >= 1000000) return (v / 1000000).toFixed(1) + 'M';
      if (v >= 1000) return (v / 1000).toFixed(1) + 'k';
      return v.toString();
    };

    // --- ORIGINAL COMPONENT SOURCE ---
    ${codeWithoutExport}

    // --- RENDER ---
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(<FunderOnboarding />);
  </script>
</body>
</html>`;

fs.writeFileSync('funder-onboarding-standalone.html', htmlTemplate);
console.log('HTML file created successfully.');
