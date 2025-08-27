import { Store } from './store.js';

/**
 * Users — 닉네임 기반 초간단 인증 레이어
 * - localStorage만 사용 (백엔드 없이 데모/정적 호스팅 대응)
 * - 닉네임 검증(2~20자, 한글/영문/숫자/_, -, #)
 * - 게스트 표기/로그인 유도 헬퍼 제공
 */

const NICK_RULE = /^[\p{L}\p{N}_\-#]{2,20}$/u; // 유니코드 글자/숫자/특수 일부 허용

export const Users = {
  /** 현재 사용자 닉네임 가져오기 (없으면 null) */
  current: () => Store.load(Store.NICK, null),

  /** 닉네임 저장 (검증 포함) */
  set: (nick) => {
    const n = (nick || '').trim();
    if (!NICK_RULE.test(n)) {
      throw new Error('닉네임은 2~20자, 한글/영문/숫자/_, -, #만 가능해요.');
    }
    Store.save(Store.NICK, n);
    return n;
  },

  /** 랜덤 닉네임 생성 (분위기 살짝 먹향 스타일) */
  random: () => {
    const A = ['서늘','묵향','잔향','안개','새벽','그믐','흑연','먹빛'];
    const B = ['고양이','수달','너구리','비둘기','제비','담비','도마뱀'];
    return `${A[Math.floor(Math.random()*A.length)]}${B[Math.floor(Math.random()*B.length)]}#${Math.floor(100+Math.random()*900)}`;
  },

  /** 로그인(닉 저장) */
  login: (nick) => Users.set(nick),

  /** 로그아웃(닉 제거) */
  logout: () => {
    localStorage.removeItem(Store.NICK);
  },

  /** 로그인 여부 */
  loggedIn: () => !!Users.current(),

  /** 게스트 표기용 표시명 */
  displayName: () => Users.current() || '게스트',

  /**
   * 로그인 보장 헬퍼
   * - 미로그인 상태면 nudge()를 호출(모달 열기 등)
   * - 로그인 상태면 onReady() 실행
   */
  ensure: (onReady, nudge) => {
    if (Users.loggedIn()) {
      onReady?.(Users.current());
      return true;
    }
    nudge?.();
    return false;
  },

  /**
   * (선택) 관리자 플래그 — 필요 시 확장
   * 예) Store.FLAGS = { admin: true }
   */
  isAdmin: () => {
    const flags = Store.load('ovra_flags', { admin: false });
    return !!flags.admin;
  },
  setAdmin: (v) => {
    const flags = Store.load('ovra_flags', { admin: false });
    flags.admin = !!v;
    Store.save('ovra_flags', flags);
  }
};
