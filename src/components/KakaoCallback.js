import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const KakaoCallback = () => {
    const navigate = useNavigate();
    // 환경 변수 REACT_APP_API_BASE_URL이 설정되어 있지 않다면 기본값으로 'http://localhost:8080' 사용
    // 다른 컴포넌트들(Mypage, Bottom 등)과의 일관성을 위해 REACT_APP_API_BASE_URL 사용을 권장합니다.
    const SPRING_BOOT_API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

    useEffect(() => {
        const url = new URL(window.location.href);
        const code = url.searchParams.get('code'); // URL에서 'code' 파라미터 추출

        // 1. 인가 코드가 없다면 바로 리다이렉트 (에러 또는 직접 접근)
        if (!code) {
            console.warn("URL에서 카카오 인가 코드를 찾을 수 없습니다. 로그인 페이지로 리다이렉트합니다.");
            navigate('/login?error=no_kakao_code', { replace: true }); // replace: true를 사용하여 뒤로 가기 방지
            return; // 코드 실행 중단
        }

        // 2. 인가 코드가 있다면 즉시 URL 정리 (중요!)
        // 'invalid_grant' 오류를 해결하고, 새로고침 시 중복 요청을 방지합니다.
        if (window.history.replaceState) {
            url.searchParams.delete('code'); // URL에서 code 파라미터 제거
            window.history.replaceState({}, document.title, url.toString());
        }

        console.log("카카오 인가 코드:", code);
        console.log("백엔드 API 기본 URL:", SPRING_BOOT_API_BASE_URL); // 디버깅을 위해 추가

        // 3. 백엔드 API 호출
        // 백엔드가 @RequestParam String code를 받으므로 쿼리 파라미터로 POST 요청
        // 백엔드 컨트롤러의 실제 매핑 경로에 따라 URL을 정확히 확인해야 합니다.
        // 예를 들어, AuthController가 @RequestMapping("/api/auth")라면 아래 경로가 맞습니다.
        // 하지만 UserController(@RequestMapping("/api/users")) 안에 있다면 '/api/users/oauth/kakao/callback'이 되어야 합니다.
        fetch(`${SPRING_BOOT_API_BASE_URL}/api/auth/oauth/kakao/callback?code=${code}`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json' // API 표준을 위해 유지
            },
            // body는 쿼리 파라미터로 보내므로 필요 없음
        })
        .then(response => {
            if (!response.ok) {
                // HTTP 상태 코드가 2xx가 아닐 경우 에러 처리
                return response.json().then(errorData => {
                    throw new Error(errorData.message || `카카오 로그인 처리 중 오류 발생: HTTP ${response.status}`);
                });
            }
            return response.json();
        })
        .then(data => {
            // 백엔드에서 사용자 정보 (예: ID, 이름)를 응답으로 받습니다.
            // 세션 ID는 HTTP 응답 헤더의 Set-Cookie에 담겨 자동으로 브라우저에 저장됩니다.
            if (data && data.id) { // 사용자 ID가 응답에 있다면 로그인 성공으로 간주
                console.log("카카오 로그인 성공! 사용자 정보:", data);
                // 로컬 스토리지에 사용자 정보 저장 (필요한 경우)
                localStorage.setItem('userId', data.id);
                localStorage.setItem('userName', data.name);
                // ... (필요하다면 다른 사용자 정보도 저장)

                // 4. 로그인 성공 후 마이페이지로 리다이렉트 (요청에 따라 변경)
                navigate('/mypage', { replace: true }); // ✅ /mypage로 이동하도록 수정!
            } else {
                console.error("카카오 로그인 실패: 응답에 필수 사용자 정보 없음", data);
                // 5. 실패 시 로그인 페이지로 리다이렉트
                navigate('/login?error=kakao_login_failed_no_user_info', { replace: true });
            }
        })
        .catch(error => {
            console.error("카카오 로그인 과정에서 오류 발생:", error);
            // 6. 오류 발생 시 로그인 페이지로 리다이렉트
            navigate(`/login?error=${encodeURIComponent(error.message || 'unknown_error')}`, { replace: true });
        });
    }, [navigate, SPRING_BOOT_API_BASE_URL]); // 의존성 배열에 navigate와 SPRING_BOOT_API_BASE_URL 추가

    return (
        <div>
            <p>카카오 로그인 처리 중입니다. 잠시만 기다려 주세요...</p>
            {/* 사용자에게 로딩 중임을 알리는 UI를 추가할 수 있습니다. */}
        </div>
    );
};

export default KakaoCallback;