// package.json의 version을 .env.local에 기록
const fs = require('fs');
const path = require('path');
const pkg = require(path.join(__dirname, '../package.json'));
const version = pkg.version;
const envPath = path.join(__dirname, '../.env.local');

let envContent = '';
if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, 'utf-8');
  // 기존 버전 정보 제거
  envContent = envContent.replace(/^NEXT_PUBLIC_APP_VERSION=.*$/m, '');
}
// 맨 아래에 버전 추가
envContent = envContent.trim() + `\nNEXT_PUBLIC_APP_VERSION=${version}\n`;
fs.writeFileSync(envPath, envContent.trim() + '\n', 'utf-8'); 