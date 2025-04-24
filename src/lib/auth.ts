// 임시 사용자 데이터
export const DEMO_USER = {
  email: 'test@example.com',
  password: 'test1234',
  name: '테스트 사용자'
};

export function validateCredentials(email: string, password: string) {
  return email === DEMO_USER.email && password === DEMO_USER.password;
} 