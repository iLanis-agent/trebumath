const e = require('./engine.js');
const exp = require('./expected.json');
let pass = 0, fail = 0;
const close = (a, b, tol) => typeof a === 'number' && typeof b === 'number' && Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
function cmp(g, w, path){
  if (typeof w === 'string'){ if (g !== w) throw new Error(path + ': got "' + g + '" want "' + w + '"'); return; }
  if (typeof w === 'object'){ Object.keys(w).forEach(k => cmp(g[k], w[k], path + '.' + k)); return; }
  if (!close(g, w, 1e-12)) throw new Error(path + ': got ' + g + ' want ' + w);
}
exp.cases.forEach((c, i) => {
  try {
    const got = c.kind === 'range' ? e.range(...c.args) : c.kind === 'ratio' ? e.ratioCheck(...c.args) : c.kind === 'eff' ? e.effPrice(...c.args) : e.armCheck(...c.args);
    cmp(got, c.out, 'case' + i);
    pass++;
  } catch (err){ fail++; console.log('FAIL case', i, c.kind, err.message); }
});
// Anchors: 100% efficiency, 45 deg release reduces to textbook energy + projectile.
(function(){
  const r = e.range(50, 1000, 2, 100, 45);
  const v = Math.sqrt(2 * 50 * 9.81 * 2 / 1);
  if (!close(r.exitMps, v, 1e-12)) throw new Error('anchor exit');
  if (!close(r.rangeM, v * v / 9.81, 1e-12)) throw new Error('anchor range');
  if (!close(r.apexM, v * v / 2 / (2 * 9.81), 1e-12)) throw new Error('anchor apex');
  if (!close(r.energyJ, 50 * 9.81 * 2, 1e-12)) throw new Error('anchor energy');
  pass += 4;
})();
// Properties.
(function(){
  // Heavier counterweight never shorter.
  const a = e.range(50, 1000, 2, 35, 45), b = e.range(100, 1000, 2, 35, 45);
  if (!(b.rangeM > a.rangeM)) throw new Error('cw monotonicity');
  // Higher efficiency never shorter.
  const c = e.range(50, 1000, 2, 50, 45);
  if (!(c.rangeM > a.rangeM)) throw new Error('eff monotonicity');
  // Range symmetric-ish around 45 (sin2theta): 40 deg beats 20 deg.
  const d = e.range(50, 1000, 2, 35, 40), f = e.range(50, 1000, 2, 35, 20);
  if (!(d.rangeM > f.rangeM)) throw new Error('angle ordering');
  // effPrice gain consistent with sqrt scaling of efficiency.
  const g = e.effPrice(50, 1000, 2, 45, 25, 50);
  if (!close(g.betterM / g.nowM, 2, 1e-12)) throw new Error('eff linear in range');
  pass += 4;
})();
// Error cases.
(function(){
  const bad = [
    () => e.range(0, 1000, 2, 35, 45),
    () => e.range(50, 0, 2, 35, 45),
    () => e.range(50, 1000, 0, 35, 45),
    () => e.range(50, 1000, 2, 0, 45),
    () => e.range(50, 1000, 2, 120, 45),
    () => e.range(50, 1000, 2, 35, 90),
    () => e.effPrice(50, 1000, 2, 45, 50, 20),
    () => e.armCheck(500, 800, 400),
  ];
  bad.forEach((f2, i) => {
    try { f2(); fail++; console.log('FAIL error case', i, 'did not throw'); }
    catch (err){ pass++; }
  });
})();
console.log(pass + '/' + (pass + fail) + ' checks pass');
process.exit(fail ? 1 : 0);
