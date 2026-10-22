// 입력값은 이 기기 브라우저에만 저장한다 (서버 전송 없음).
// 시크릿 모드 등에서 localStorage가 막혀 있어도 앱은 동작해야 한다.

export function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function save(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* 저장 실패는 무시 */
  }
}

export function remove(key: string) {
  try {
    localStorage.removeItem(key);
  } catch {
    /* noop */
  }
}
