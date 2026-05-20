# Supabase 인증 메일 적용 가이드

## 적용 위치
- `Supabase Dashboard`
- `Authentication`
- `Emails`
- `Confirm signup`

## 제목 추천
- `R-FORCE 이메일 인증을 완료해주세요`

## 본문 템플릿
- 아래 파일 내용을 그대로 붙여넣으면 됩니다.
- [confirm-signup.html](C:/Users/Admin/Documents/Codex/2026-05-13/files-mentioned-by-the-user-chatgpt-2/supabase/email-templates/confirm-signup.html)

## 적용 메모
- 인증 버튼 링크는 `{{ .ConfirmationURL }}` 그대로 유지해야 합니다.
- 디자인은 Supabase 메일 편집기에서 추가로 손봐도 되지만, 링크 변수는 바꾸지 않는 것이 안전합니다.
