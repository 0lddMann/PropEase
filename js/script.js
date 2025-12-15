(function() {
  // Initialize demo users if not present
  window.appInit = function() {
    const users = JSON.parse(localStorage.getItem('pe_users') || 'null');
    if (!users) {
      const demo = [
        { email: 'admin@demo.com', password: 'admin123', role: 'admin', name: 'Admin User' },
        { email: 'manager@demo.com', password: 'manager123', role: 'manager', name: 'Manager User' },
        { email: 'tenant@demo.com', password: 'tenant123', role: 'tenant', name: 'Tenant User' },
        { email: 'client@demo.com', password: 'client123', role: 'client', name: 'Client User' }
      ];
      localStorage.setItem('pe_users', JSON.stringify(demo));
      console.log('Demo users seeded');
    }
  };

  // Helper: get users
  function getUsers() {
    return JSON.parse(localStorage.getItem('pe_users') || '[]');
  }

  // Login handling on index.html
  document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();
        const role = document.getElementById('role').value;
        const errorMsg = document.getElementById('errorMsg');

        const users = getUsers();
        const user = users.find(u => u.email === email && u.password === password && u.role === role);

        if (user) {
          // Store session
          sessionStorage.setItem('pe_session', JSON.stringify({ email: user.email, role: user.role, name: user.name }));
          // Redirect based on role (multi-page)
          if (user.role === 'admin') window.location.href = 'admin.html';
          else if (user.role === 'manager') window.location.href = 'manager.html';
          else if (user.role === 'tenant') window.location.href = 'tenant.html';
          else if (user.role === 'client') window.location.href = 'client.html';
          else window.location.href = 'index.html';
        } else {
          errorMsg.textContent = 'Invalid credentials for that role. Check email/password/role.';
          setTimeout(() => errorMsg.textContent = '', 4000);
        }
      });
    }

    document.addEventListener('DOMContentLoaded', function(){
      // elements
      const ham = document.querySelector('.hamburger');
      const sidebar = document.querySelector('.sidebar');

      // create overlay for mobile sidebar
      let overlay = document.querySelector('.sidebar-overlay');
      if(!overlay){
        overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        overlay.style.display = 'none';
        document.body.appendChild(overlay);
      }

      // hamburger toggles sidebar (works on small screens)
      if(ham && sidebar){
        ham.addEventListener('click', ()=> {
          const isOpen = sidebar.classList.toggle('open');
          document.body.classList.toggle('sidebar-open', isOpen);
          overlay.style.display = isOpen ? 'block' : 'none';
        });
      }

      // clicking overlay closes sidebar
      overlay.addEventListener('click', ()=>{
        if(sidebar) sidebar.classList.remove('open');
        overlay.style.display = 'none';
        document.body.classList.remove('sidebar-open');
      });

      // basic search demo
      const searchBtn = document.getElementById('searchBtn');
      if(searchBtn){
        searchBtn.addEventListener('click', ()=>{
          const q = document.getElementById('mainSearch') && document.getElementById('mainSearch').value;
          // replace alert with real search later
          alert('Search demo: ' + (q || 'empty'));
        });
      }

      // auto-highlight nav item
      const path = location.pathname.split('/').pop();
      document.querySelectorAll('.sidebar nav a').forEach(a=>{
        const href = a.getAttribute('href') || '';
        if(href === path) a.classList.add('active'); else a.classList.remove('active');
      });

      // demo generator + renderer
      function generateDemo(role){
        const list = [];
        for(let i=1;i<=10;i++){
          list.push({
            title: `${role.charAt(0).toUpperCase()+role.slice(1)} Demo Item ${i}`,
            desc: `This is a sample ${role} demo item #${i}. Use this to preview layout, actions and metadata.`,
            meta: `ID: ${role.substring(0,3).toUpperCase()}-${1000+i} • Status: ${i % 3 === 0 ? 'Pending' : 'Active'}`
          });
        }
        return list;
      }

      window.renderDemo = function(role){
        const container = document.getElementById('demoContent');
        if(!container) return;
        const items = generateDemo(role || (document.body.dataset.role || 'guest'));
        container.innerHTML = items.map(it=>`
          <div class="card" style="padding:14px;border-radius:10px;">
            <h3 style="margin:0 0 6px">${it.title}</h3>
            <p style="margin:0 0 8px;color:var(--muted)">${it.desc}</p>
            <div style="font-size:13px;color:#8b8b8b">${it.meta}</div>
          </div>
        `).join('');
      };

      // auto-render if body has data-role
      const bodyRole = document.body.dataset.role;
      if(bodyRole) renderDemo(bodyRole);

      // attach logout if available
      const lb = document.getElementById('logoutBtn'); if(lb) lb.addEventListener('click', logout);
    });

    document.addEventListener('DOMContentLoaded', function(){
      // Insert brand header (logo + RACERSREALESTATE.CO) into every .topbar
      try {
        const topbars = document.querySelectorAll('.topbar');
        topbars.forEach(tb => {
          if (tb.querySelector('.brand-header')) return; // already added
          // preserve existing hamburger and top-actions if present
          const hamburger = tb.querySelector('.hamburger');
          const topActions = tb.querySelector('.top-actions');
          // create brand node
          const brand = document.createElement('div');
          brand.className = 'brand-header';
          const img = document.createElement('img');
          img.className = 'site-logo--small';
          img.src = '../assets/logo.jpg';
          img.alt = 'RACERSREALESTATE.CO';
          const text = document.createElement('div');
          text.className = 'brand-text';
          text.textContent = 'RACERSREALESTATE.CO';
          brand.appendChild(img);
          brand.appendChild(text);

          // insert after hamburger if exists, otherwise prepend
          if (hamburger && hamburger.parentNode) {
            hamburger.insertAdjacentElement('afterend', brand);
          } else {
            tb.insertBefore(brand, tb.firstChild);
          }

          // ensure top-actions is at the end (right side)
          if (topActions) tb.appendChild(topActions);
        });
      } catch (e) {
        // silent fail; header not critical
        console.warn('brand header injection failed', e);
      }

      // Demo login handler: redirects to selected role page and stores role
      function demoLogin() {
        const sel = document.getElementById('roleSelect');
        if(!sel) return;
        const role = sel.value || 'admin';
        const map = {
          admin: 'admin.html',
          manager: 'manager.html',
          client: 'client.html',
          tenant: 'tenant.html'
        };
        // store demo role (pages can read localStorage.userRole if needed)
        try { localStorage.setItem('userRole', role); } catch(e){}
        const target = map[role] || 'admin.html';
        // quick UI feedback
        const t = document.createElement('div');
        t.textContent = 'Signing in as ' + role + '...';
        Object.assign(t.style,{position:'fixed',right:'18px',bottom:'18px',background:'#111',color:'#fff',padding:'10px 12px',borderRadius:'8px',zIndex:9999});
        document.body.appendChild(t);
        setTimeout(()=>{ window.location.href = target; }, 600);
      }

      const demoBtn = document.getElementById('demoLoginBtn');
      if(demoBtn) demoBtn.addEventListener('click', demoLogin);

      // optional: pre-fill role from previous demo session
      try {
        const prev = localStorage.getItem('userRole');
        if(prev){
          const sel = document.getElementById('roleSelect');
          if(sel) sel.value = prev;
        }
      } catch(e){}

      // ensure demo users exist
      if (typeof window.appInit === 'function') window.appInit();

      // Sign-in button handler (matches index.html IDs)
      const signInBtn = document.getElementById('signInBtn');
      if (signInBtn) {
        signInBtn.addEventListener('click', function () {
          const email = (document.getElementById('emailInput') && document.getElementById('emailInput').value || '').trim();
          const password = (document.getElementById('passwordInput') && document.getElementById('passwordInput').value || '').trim();
          const role = (document.getElementById('roleSelect') && document.getElementById('roleSelect').value) || 'admin';
          const users = getUsers();
          const user = users.find(u => u.email === email && u.password === password && u.role === role);
          if (user) {
            sessionStorage.setItem('pe_session', JSON.stringify({ email: user.email, role: user.role, name: user.name }));
            const map = { admin: 'admin.html', manager: 'manager.html', client: 'client.html', tenant: 'tenant.html' };
            window.location.href = map[user.role] || 'index.html';
          } else {
            const t = document.createElement('div');
            t.textContent = 'Invalid credentials for that role.';
            Object.assign(t.style, { position: 'fixed', right: '18px', bottom: '18px', background: '#b91c1c', color: '#fff', padding: '10px 12px', borderRadius: '8px', zIndex: 9999 });
            document.body.appendChild(t);
            setTimeout(() => t.remove(), 3200);
          }
        });
      }
    });
  });

  // Page protection and helpers used in other pages
  window.protectPage = function(requiredRoles) {
    const session = JSON.parse(sessionStorage.getItem('pe_session') || 'null');
    if (!session) {
      alert('Please login first.');
      window.location.href = 'index.html';
      return;
    }
    let allowed = false;
    if (typeof requiredRoles === 'string') {
      allowed = session.role === requiredRoles;
    } else if (Array.isArray(requiredRoles)) {
      allowed = requiredRoles.includes(session.role);
    } else {
      allowed = true;
    }
    if (!allowed) {
      alert('Access denied for your role.');
      window.location.href = 'index.html';
      return;
    }
  };

  window.renderWelcome = function() {
    const session = JSON.parse(sessionStorage.getItem('pe_session') || 'null');
    if (session) {
      const el = document.getElementById('welcome');
      if (el) el.textContent = `Hi, ${session.name} (${session.role})`;
    }
  };

  window.logout = function() {
    sessionStorage.removeItem('pe_session');
    window.location.href = 'index.html';
  };

  // determine current user role (session first, fallback to localStorage)
  function currentUserRole() {
    try {
      const s = sessionStorage.getItem('pe_session');
      if (s) {
        const parsed = JSON.parse(s);
        if (parsed && parsed.role) return parsed.role;
      }
    } catch (e) { /* ignore */ }
    try {
      const r = localStorage.getItem('userRole');
      if (r) return r;
    } catch(e){}
    return null;
  }

  // Apply tenant restrictions: only allow viewing leases & payment history
  function applyTenantRestrictions() {
    const role = currentUserRole();
    if (role !== 'tenant') return;

    // Allowed pages for tenant (added mail & notifications)
    const allowedPages = ['leases.html','payments.html','tenant.html','index.html','mail.html','notifications.html'];
    const current = window.location.pathname.split('/').pop() || 'index.html';
    if (!allowedPages.includes(current)) {
      // redirect tenant to leases page
      window.location.replace('leases.html');
      return;
    }

    // Sidebar: only show Leases, Payments, Mail and Notifications (keep tenant/home links and Logout)
    try {
      document.querySelectorAll('.sidebar nav a').forEach(a => {
        const href = (a.getAttribute('href') || '').toLowerCase();
        if (href.includes('leases') || href.includes('payments') || href.includes('tenant') || href.includes('mail') || href.includes('notifications') || href.includes('client')) {
          a.style.display = '';
        } else {
          a.style.display = 'none';
        }
      });
    } catch(e){}

    // Hide global quick-action buttons that should not be available to tenants
    try {
      // allow additional safe keywords for tenant (message/contact/inbox/notify/history/payment/view)
      const allowKeywords = ['view','payment','history','download','receipt','message','contact','inbox','notify'];
      document.querySelectorAll('.main .btn, .card .btn, button.btn').forEach(btn => {
        const txt = (btn.textContent || '').trim().toLowerCase();
        // keep logout/topbar actions
        if (btn.id === 'logoutBtn' || btn.closest && btn.closest('.top-actions')) return;
        const ok = allowKeywords.some(k => txt.includes(k));
        if (!ok) {
          btn.style.display = 'none';
        }
      });
      // Also hide inline action links in tables (Edit, Approve, Renew, Notify, Archive, New, Create, Export, Invite)
      const denyWords = ['edit','approve','renew','archive','new','create','export','invite','pay now','refund','delete','remove'];
      document.querySelectorAll('a, button').forEach(el=>{
        const txt = (el.textContent||'').trim().toLowerCase();
        if (denyWords.some(w=> txt.includes(w))) el.style.display = 'none';
      });
    } catch(e){}
    
    // If on leases page, ensure only "View" buttons are visible and any sensitive columns hidden
    try {
      if (current.includes('leases')) {
        document.querySelectorAll('table tbody tr').forEach(row=>{
          row.querySelectorAll('td').forEach(td=>{
            td.querySelectorAll('button, a').forEach(el=>{
              const txt = (el.textContent||'').trim().toLowerCase();
              if (!txt.includes('view') && !txt.includes('history') && !txt.includes('payment') && !txt.includes('download')) el.style.display = 'none';
            });
          });
        });
      }
    } catch(e){}
  }

  // Apply manager restrictions: allow managing tenants, properties, clients and generating property reports
  function applyManagerRestrictions() {
    const role = currentUserRole();
    if (role !== 'manager') return;

    // pages manager can access
    const allowedPages = ['manager.html','properties.html','clients.html','tenants.html','reports.html','leases.html','index.html'];
    const current = window.location.pathname.split('/').pop() || 'index.html';
    if (!allowedPages.includes(current)) {
      // redirect manager to manager dashboard
      window.location.replace('manager.html');
      return;
    }

    // Sidebar: show only manager-relevant links
    try {
      document.querySelectorAll('.sidebar nav a').forEach(a => {
        const href = (a.getAttribute('href') || '').toLowerCase();
        if (href.includes('properties') || href.includes('clients') || href.includes('tenants') || href.includes('reports') || href.includes('manager') || href.includes('leases')) {
          a.style.display = '';
        } else {
          a.style.display = 'none';
        }
      });
    } catch (e) {}

    // Allow manager-specific actions; hide unrelated actions (payments, admin controls)
    try {
      const allowKeywords = ['create','new','add','edit','manage','generate','report','view','export','invite'];
      document.querySelectorAll('button, .btn, a').forEach(el => {
        // keep topbar/logout actions
        if (el.id === 'logoutBtn' || el.closest && el.closest('.top-actions')) return;
        const txt = (el.textContent || '').trim().toLowerCase();
        const ok = allowKeywords.some(k => txt.includes(k));
        // keep links that are page navigation to allowed pages
        const href = el.getAttribute && el.getAttribute('href') || '';
        const navOk = allowedPages.some(p => (href||'').toLowerCase().includes(p.replace('.html','')));
        if (!ok && !navOk) el.style.display = 'none';
      });

      // For tables on allowed pages, hide actions unrelated to manager duties
      const denyWords = ['approve','pay','refund','delete','archive','terminate','settings','system','export data'];
      document.querySelectorAll('table tbody tr').forEach(row=>{
        row.querySelectorAll('button, a').forEach(el=>{
          const txt = (el.textContent||'').trim().toLowerCase();
          if (denyWords.some(w => txt.includes(w))) el.style.display = 'none';
        });
      });
    } catch (e) {}
  }
  
  // Apply agent restrictions: agent-focused view for leads, clients, viewings & communication
  function applyAgentRestrictions() {
    const role = currentUserRole();
    if (role !== 'agent') return;

    const allowedPages = ['agent.html','clients.html','leads.html','properties.html','mail.html','notifications.html','index.html'];
    const current = window.location.pathname.split('/').pop() || 'index.html';
    if (!allowedPages.includes(current)) {
      window.location.replace('agent.html');
      return;
    }

    // Sidebar: show only client, leads, mail, properties, notifications
    try {
      document.querySelectorAll('.sidebar nav a').forEach(a => {
        const href = (a.getAttribute('href') || '').toLowerCase();
        if (href.includes('clients') || href.includes('leads') || href.includes('mail') || href.includes('notifications') || href.includes('properties') || href.includes('agent')) {
          a.style.display = '';
        } else {
          a.style.display = 'none';
        }
      });
    } catch(e){}

    // Allow agent-specific actions; hide admin-only actions
    try {
      const allowKeywords = ['contact','message','view','viewing','schedule','lead','client','follow','export','download'];
      document.querySelectorAll('button, .btn, a').forEach(el => {
        if (el.id === 'logoutBtn' || (el.closest && el.closest('.top-actions'))) return;
        const txt = (el.textContent || '').trim().toLowerCase();
        const ok = allowKeywords.some(k => txt.includes(k));
        const href = el.getAttribute && el.getAttribute('href') || '';
        const navOk = allowedPages.some(p => (href||'').toLowerCase().includes(p.replace('.html','')));
        if (!ok && !navOk) el.style.display = 'none';
      });
    } catch(e){}
  }
  
  // Apply client restrictions: focus on submitting inquiries & viewing agent-scheduled listings
  function applyClientRestrictions() {
    const role = currentUserRole();
    if (role !== 'client') return;

    const allowedPages = ['client.html','properties.html','mail.html','notifications.html','leases.html','index.html'];
    const current = window.location.pathname.split('/').pop() || 'index.html';
    if (!allowedPages.includes(current)) {
      window.location.replace('client.html');
      return;
    }

    // Sidebar: show only Home, Properties, Messages, Notifications, Leases
    try {
      document.querySelectorAll('.sidebar nav a').forEach(a => {
        const href = (a.getAttribute('href') || '').toLowerCase();
        if (href.includes('client') || href.includes('properties') || href.includes('mail') || href.includes('notifications') || href.includes('leases')) {
          a.style.display = '';
        } else {
          a.style.display = 'none';
        }
      });
    } catch(e){}

    // Hide actions not relevant to clients (create/edit/approve/admin)
    try {
      const denyWords = ['create','new','add','approve','approve','delete','export','invite','settings','system','admin','pay now','refund'];
      document.querySelectorAll('button, a').forEach(el=>{
        if (el.id === 'logoutBtn' || (el.closest && el.closest('.top-actions'))) return;
        const txt = (el.textContent||'').trim().toLowerCase();
        if (denyWords.some(w=> txt.includes(w))) el.style.display = 'none';
      });
    } catch(e){}
  }
  
  // Apply leasing officer restrictions: focus UI for leasing-officer role
  function applyLeasingOfficerRestrictions() {
    try {
      if (typeof currentUserRole !== 'function' || currentUserRole() !== 'leasing-officer') return;
    } catch(e){ return; }

    // allowed pages for leasing officer
    const allowed = ['leasing-officer.html','leases.html','properties.html','tenants.html','index.html'];
    const current = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
    if (!allowed.includes(current)) {
      window.location.replace('leasing-officer.html');
      return;
    }

    // Sidebar: show only lease/property/tenant links
    try {
      document.querySelectorAll('.sidebar nav a').forEach(a=>{
        const href = (a.getAttribute('href')||'').toLowerCase();
        if (href.includes('leases') || href.includes('properties') || href.includes('tenants')) a.style.display='';
        else a.style.display='none';
      });
    } catch(e){}

    // Hide non-relevant controls (create/admin/etc) — keep export available
    try {
      const hideWords = ['create','new','add','admin','settings','invite'];
      document.querySelectorAll('button, a').forEach(el=>{
        if (!el || el.id === 'logoutBtn' || (el.closest && el.closest('.top-actions'))) return;
        const txt = (el.textContent||'').toLowerCase();
        if (hideWords.some(w=>txt.includes(w))) el.style.display='none';
      });
    } catch(e){}
  }

  // ensure role restrictions run after DOM ready
  function onReady() {
    console.log('script.js onReady running'); // <-- debug log

    // init demo users
    if (typeof window.appInit === 'function') {
      try { window.appInit(); console.log('appInit() executed'); } catch(e){ console.error('appInit error', e); }
    }

    // Demo Login button
    const demoBtn = document.getElementById('demoLoginBtn');
    if (demoBtn) {
      demoBtn.addEventListener('click', function() {
        const sel = document.getElementById('roleSelect');
        const role = (sel && sel.value) || 'admin';
        const map = { admin: 'admin.html', manager: 'manager.html', client: 'client.html', tenant: 'tenant.html' };
        try { localStorage.setItem('userRole', role); } catch(e){}
        const toast = document.createElement('div');
        toast.textContent = 'Signing in as ' + role + '...';
        Object.assign(toast.style,{position:'fixed',right:'18px',bottom:'18px',background:'#111',color:'#fff',padding:'10px 12px',borderRadius:'8px',zIndex:9999});
        document.body.appendChild(toast);
        setTimeout(()=>{ window.location.href = map[role] || 'admin.html'; }, 500);
      });
      console.log('demoLoginBtn handler attached');
    } else console.log('demoLoginBtn not found');

    // Sign in button handler
    const signInBtn = document.getElementById('signInBtn');
    if (signInBtn) {
      signInBtn.addEventListener('click', function () {
        console.log('signInBtn clicked');
        const email = (document.getElementById('emailInput') && document.getElementById('emailInput').value || '').trim();
        const password = (document.getElementById('passwordInput') && document.getElementById('passwordInput').value || '').trim();
        const role = (document.getElementById('roleSelect') && document.getElementById('roleSelect').value) || 'admin';
        console.log('credentials', {email, role});
        const users = getUsers();
        const user = users.find(u => u.email === email && u.password === password && u.role === role);
        if (user) {
          try { sessionStorage.setItem('pe_session', JSON.stringify({ email: user.email, role: user.role, name: user.name })); } catch(e){}
          const map = { admin: 'admin.html', manager: 'manager.html', client: 'client.html', tenant: 'tenant.html' };
          window.location.href = map[user.role] || 'admin.html';
        } else {
          const t = document.createElement('div');
          t.textContent = 'Invalid credentials for that role.';
          Object.assign(t.style, { position: 'fixed', right: '18px', bottom: '18px', background: '#b91c1c', color: '#fff', padding: '10px 12px', borderRadius: '8px', zIndex: 9999 });
          document.body.appendChild(t);
          setTimeout(() => t.remove(), 3000);
          console.warn('login failed for', email, role);
        }
      });
      console.log('signInBtn handler attached');
    } else console.log('signInBtn not found');

    // convenience: prefill when role changes
    const roleSel = document.getElementById('roleSelect');
    if (roleSel) {
      roleSel.addEventListener('change', function(){
        const r = roleSel.value;
        const preset = { admin: ['admin@demo.com','admin'], manager: ['manager@demo.com','manager'], client: ['client@demo.com','client'], tenant: ['tenant@demo.com','tenant'] };
        if (preset[r]) {
          const e = document.getElementById('emailInput'); const p = document.getElementById('passwordInput');
          if (e) e.value = preset[r][0]; if (p) p.value = preset[r][1];
        }
      });
      roleSel.dispatchEvent(new Event('change'));
    }

    // last resort: if elements didn't exist, try attaching via click delegation
    if (!signInBtn) {
      document.addEventListener('click', function (ev) {
        const t = ev.target;
        if (t && (t.id === 'signInBtn' || t.closest && t.closest('#signInBtn'))) {
          console.log('delegated signIn click');
          // trigger the same click programmatically if handler not attached
          if (typeof t.click === 'function') t.click();
        }
      }, { once: true });
    }

    // don't apply role-based UI restrictions on the login page
    const currentPage = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
    if (currentPage !== 'index.html' && currentPage !== '') {
      try { applyAgentRestrictions(); } catch(e){ console.warn('applyAgentRestrictions failed', e); }
      try { applyManagerRestrictions(); } catch(e){ console.warn('applyManagerRestrictions failed', e); }
      try { applyTenantRestrictions(); } catch(e){ console.warn('applyTenantRestrictions failed', e); }
      try { applyClientRestrictions(); } catch(e){ console.warn('applyClientRestrictions failed', e); }
     try { applyLeasingOfficerRestrictions(); } catch(e){ console.warn('applyLeasingOfficerRestrictions failed', e); }
    } else {
      console.log('index page detected — skipping role UI restrictions to keep sign-in controls visible');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onReady);
  } else {
    onReady();
  }
})();