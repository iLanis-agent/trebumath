// Trebumath engine - trebuchet design physics.
// Model (labeled): counterweight potential energy transfers to the projectile
// with a build-efficiency factor eta (real builds run 20-60%, labeled guidance).
// The projectile then flies as a textbook point mass released at angle theta.
// No air drag (negligible for dense pumpkins and stones, labeled), flat field,
// release at ground-reference height (labeled). Ratio guidance (counterweight
// to projectile, arm long:short, sling to arm) is standard hobby practice,
// labeled where it is guidance.
const G = 9.81;

function range(cwKg, projG, dropM, effPct, releaseDeg){
  if (!(cwKg > 0)) throw new Error('counterweight must be positive');
  if (!(projG > 0)) throw new Error('projectile mass must be positive');
  if (!(dropM > 0)) throw new Error('counterweight drop must be positive');
  if (!(effPct > 0 && effPct <= 100)) throw new Error('efficiency must be 0-100%');
  if (!(releaseDeg > 0 && releaseDeg < 90)) throw new Error('release angle must be 0-90 degrees');
  const m = projG / 1000, eta = effPct / 100;
  const th = releaseDeg * Math.PI / 180;
  const v = Math.sqrt(2 * eta * cwKg * G * dropM / m);
  const rangeM = v * v * Math.sin(2 * th) / G;
  const apexM = Math.pow(v * Math.sin(th), 2) / (2 * G);
  const flightS = 2 * v * Math.sin(th) / G;
  return { exitMps: v, rangeM, apexM, flightS, energyJ: eta * cwKg * G * dropM };
}

// Counterweight-to-projectile ratio verdict (labeled hobby guidance).
function ratioCheck(cwKg, projG){
  if (!(cwKg > 0)) throw new Error('counterweight must be positive');
  if (!(projG > 0)) throw new Error('projectile mass must be positive');
  const r = cwKg * 1000 / projG;
  const verdict = r < 20 ? 'underweight counterweight - most of the drop never reaches the arm'
    : r < 100 ? 'workable - hobby builds live here'
    : 'strong ratio - competition builds run 100:1 and up';
  return { ratio: r, verdict };
}

// What a sloppy build costs: range at current vs better efficiency.
function effPrice(cwKg, projG, dropM, releaseDeg, effNow, effBetter){
  if (!(effNow > 0 && effNow <= 100) || !(effBetter > 0 && effBetter <= 100)) throw new Error('efficiency must be 0-100%');
  if (effBetter < effNow) throw new Error('better efficiency should be the higher one');
  const a = range(cwKg, projG, dropM, effNow, releaseDeg);
  const b = range(cwKg, projG, dropM, effBetter, releaseDeg);
  return { nowM: a.rangeM, betterM: b.rangeM, gainM: b.rangeM - a.rangeM,
    gainPct: (b.rangeM - a.rangeM) / a.rangeM * 100 };
}

// Geometry check: arm long:short and sling:long against labeled guidance.
function armCheck(longMm, shortMm, slingMm){
  if (!(longMm > 0)) throw new Error('long arm must be positive');
  if (!(shortMm > 0)) throw new Error('short arm must be positive');
  if (!(slingMm > 0)) throw new Error('sling must be positive');
  if (longMm <= shortMm) throw new Error('long end should be the longer one');
  const armRatio = longMm / shortMm, slingRatio = slingMm / longMm;
  const armVerdict = armRatio < 2.5 ? 'short throwing end - fast but lazy whip (guidance: 3:1 to 4:1)'
    : armRatio <= 4.5 ? 'in the 3:1-4:1 pocket (labeled guidance)'
    : 'very long throw end - watch the whip timing (guidance: 3:1 to 4:1)';
  const slingVerdict = slingRatio < 0.7 ? 'short sling - early release, high arc (guidance: ~0.8-1.0x arm)'
    : slingRatio <= 1.1 ? 'sling in the pocket (labeled guidance)'
    : 'long sling - late release, flat and risky (guidance: ~0.8-1.0x arm)';
  return { armRatio, slingRatio, armVerdict, slingVerdict };
}

const API = { G, range, ratioCheck, effPrice, armCheck };
if (typeof module !== 'undefined' && module.exports) module.exports = API;
if (typeof window !== 'undefined') window.Trebumath = API;
