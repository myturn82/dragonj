// package.json의 version을 0.001씩 증가시키는 스크립트
const fs = require('fs');
const path = require('path');
const pkgPath = path.join(__dirname, '../package.json');
const pkg = require(pkgPath);

let [major, minor, patch] = pkg.version.split('.').map(Number);

// 0.001씩 증가 (patch 증가)
patch += 1;
if (patch >= 1000) {
  patch = 0;
  minor += 1;
  if (minor >= 1000) {
    minor = 0;
    major += 1;
  }
}

const newVersion = `${major}.${minor}.${patch.toString().padStart(3, '0')}`;
pkg.version = newVersion;

fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf-8');
console.log(`Version bumped to ${newVersion}`); 