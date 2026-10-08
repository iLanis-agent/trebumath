# Trebumath

Trebuchet design without the folklore. Enter the counterweight, projectile, drop height, build efficiency and release angle; get the exit speed, range, apex and flight time, plus verdicts on the counterweight ratio, the price of a sloppy build, and the arm/sling geometry.

## Anchors

- 100% efficiency at 45 degrees reduces exactly to textbook energy transfer (v = sqrt(2&middot;CW&middot;g&middot;h / m)) and projectile range (v&sup2;/g). Anchor-tested.
- Range is linear in efficiency and counterweight, inverse in projectile mass.

## Labeled simplifications

Build efficiency as a single factor (real builds 20-60%), no air drag (dense projectiles), flat field, release at reference height. Ratio guidance (CW:projectile 100:1+, arm 3:1-4:1, sling 0.8-1.0x arm) is standard hobby practice, labeled as guidance in the app.

## Run tests

```
node test.js
```

211 checks: 195 randomized cases against an independent Python oracle, exact anchors, monotonicity properties, and error cases.
