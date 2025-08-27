// Elements
const totalEmployeesEl = document.getElementById('totalEmployees');
const totalCommissionsEl = document.getElementById('totalCommissions');
const totalAlertsEl = document.getElementById('totalAlerts');
const complianceTable = document.getElementById('complianceTable');
const commissionsTable = document.getElementById('commissionsTable');
const rulesTable = document.getElementById('rulesTable');
const ruleForm = document.getElementById('ruleForm');

// Performance Chart
const ctx = document.getElementById('performanceChart').getContext('2d');
let performanceChart = new Chart(ctx, {
  type: 'line',
  data: { labels: [], datasets: [{ label: 'Performance', data: [], borderColor: 'rgba(75,192,192,1)', fill: false }] },
  options: { responsive: true, maintainAspectRatio: false }
});

// Load Employees
db.collection('employees').onSnapshot(snapshot => {
  const employees = snapshot.docs.map(doc => doc.data());
  totalEmployeesEl.textContent = employees.length;

  // Performance chart
  const labels = employees.map(e => e.name);
  const data = employees.map(e => e.performance || 0);
  performanceChart.data.labels = labels;
  performanceChart.data.datasets[0].data = data;
  performanceChart.update();
});

// Load Compliance
db.collection('compliance').onSnapshot(snapshot => {
  const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  totalAlertsEl.textContent = items.filter(i => !i.completed).length;
  complianceTable.innerHTML = '';
  items.forEach(i => {
    complianceTable.innerHTML += `
      <tr>
        <td class="p-2">${i.name}</td>
        <td class="p-2">${i.deadline}</td>
        <td class="p-2">
          <span class="px-2 py-1 rounded-full text-white ${i.completed ? 'bg-green-500':'bg-red-500'}">${i.completed?'Completed':'Pending'}</span>
        </td>
      </tr>
    `;
  });
});

// Load Commissions
db.collection('commissions').onSnapshot(snapshot => {
  const commissions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  totalCommissionsEl.textContent = commissions.length;
  commissionsTable.innerHTML = '';
  commissions.forEach(c => {
    commissionsTable.innerHTML += `
      <tr>
        <td class="p-2">${c.employeeName}</td>
        <td class="p-2">${c.lotteryName}</td>
        <td class="p-2">$${c.amount}</td>
        <td class="p-2">
          <span class="px-2 py-1 rounded-full text-white ${c.paid?'bg-green-500':'bg-yellow-500'}">${c.paid?'Paid':'Pending'}</span>
        </td>
      </tr>
    `;
  });
});

// Rules Management
ruleForm.addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('ruleName').value;
  const percentage = parseFloat(document.getElementById('percentage').value);
  const threshold = parseFloat(document.getElementById('threshold').value);
  if(!name || isNaN(percentage) || isNaN(threshold)) return alert('Fill all fields');

  db.collection('rules').add({ name, percentage, threshold }).then(()=>ruleForm.reset());
});

function loadRules() {
  db.collection('rules').onSnapshot(snapshot => {
    rulesTable.innerHTML = '';
    snapshot.docs.forEach(doc => {
      const rule = doc.data();
      const row = document.createElement('tr');
      row.innerHTML = `
        <td class="p-2">${rule.name}</td>
        <td class="p-2">${rule.percentage}%</td>
        <td class="p-2">${rule.threshold}</td>
        <td class="p-2">
          <button class="bg-yellow-500 text-white px-2 py-1 rounded mr-2" onclick="editRule('${doc.id}','${rule.name}',${rule.percentage},${rule.threshold})">Edit</button>
          <button class="bg-red-500 text-white px-2 py-1 rounded" onclick="deleteRule('${doc.id}')">Delete</button>
        </td>
      `;
      rulesTable.appendChild(row);
    });
  });
}
loadRules();

function deleteRule(id){ db.collection('rules').doc(id).delete(); }

function editRule(id,name,percentage,threshold){
  const newName = prompt("Rule Name:", name);
  const newPercentage = prompt("Percentage:", percentage);
  const newThreshold = prompt("Threshold:", threshold);
  if(newName && newPercentage && newThreshold){
    db.collection('rules').doc(id).update({ name: newName, percentage: parseFloat(newPercentage), threshold: parseFloat(newThreshold) });
  }
}

// Auto-calculate Commissions
db.collection('employees').onSnapshot(empSnap => {
  db.collection('rules').onSnapshot(ruleSnap => {
    empSnap.docs.forEach(empDoc => {
      const employee = empDoc.data();
      ruleSnap.docs.forEach(ruleDoc => {
        const rule = ruleDoc.data();
        const sales = employee.sales || 0;
        if(sales >= rule.threshold){
          const amount = sales * (rule.percentage/100);
          db.collection('commissions')
            .where('employeeName','==',employee.name)
            .where('ruleApplied','==',rule.name)
            .get()
            .then(res => {
              if(res.empty){
                db.collection('commissions').add({
                  employeeName: employee.name,
                  lotteryName: employee.lottery || 'N/A',
                  amount: amount,
                  ruleApplied: rule.name,
                  paid:false
                });
              }
            });
        }
      });
    });
  });
});
