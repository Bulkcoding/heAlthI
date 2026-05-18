# STRONGER 초기 DB 스키마 설계

## 1. 설계 원칙

- 운동 기록은 세션과 세트 단위로 분리한다.
- 추천 결과는 생성 시점의 스냅샷으로 저장한다.
- 프로그램 규칙은 별도 테이블로 분리한다.
- 소셜 이벤트는 피드 생성용 이벤트 모델을 둔다.
- 장비 인식 결과는 이미지 원본과 분리한다.

## 2. 핵심 테이블

## users
- id
- email
- password_hash
- nickname
- profile_image_url
- birth_year
- gender
- height_cm
- weight_kg
- experience_level
- primary_goal
- weekly_workout_days
- preferred_session_minutes
- is_premium
- status
- created_at
- updated_at

목적:
- 계정과 기본 프로필 저장

## user_settings
- id
- user_id
- theme
- locale
- timezone
- notification_push_enabled
- notification_email_enabled
- privacy_profile
- privacy_workout
- privacy_feed
- created_at
- updated_at

목적:
- 사용자별 설정 저장

## programs
- id
- name
- type
- description
- difficulty
- is_system
- created_at
- updated_at

목적:
- 웬들러, 스트롱리프트 등 프로그램 메타 저장

## program_weeks
- id
- program_id
- week_number
- label
- created_at

목적:
- 프로그램 주차 관리

## program_workouts
- id
- program_week_id
- day_index
- title
- estimated_minutes
- created_at

목적:
- 주차별 운동일 구성

## program_exercises
- id
- program_workout_id
- exercise_id
- order_no
- target_sets
- target_reps
- intensity_rule
- progression_rule
- is_optional
- created_at

목적:
- 프로그램에 포함된 운동 규칙 저장

## exercises
- id
- name_ko
- name_en
- body_part
- movement_pattern
- equipment_type
- difficulty
- description
- created_at
- updated_at

목적:
- 운동 종목 마스터 데이터

## exercise_equipment_map
- id
- exercise_id
- equipment_id
- created_at

목적:
- 기구와 운동 연결

## equipments
- id
- name
- category
- brand
- description
- created_at

목적:
- 기구 마스터 데이터

## user_programs
- id
- user_id
- program_id
- started_at
- ended_at
- current_week
- current_day_index
- status
- created_at
- updated_at

목적:
- 사용자가 현재 어떤 프로그램을 수행 중인지 저장

## workout_sessions
- id
- user_id
- user_program_id
- workout_date
- started_at
- ended_at
- total_minutes
- session_type
- total_volume_kg
- estimated_1rm_score
- performance_score
- fatigue_score
- note
- status
- created_at
- updated_at

목적:
- 한 번의 운동 세션 저장

## workout_exercises
- id
- workout_session_id
- exercise_id
- order_no
- planned_sets
- planned_reps
- planned_weight_kg
- completed_sets
- completed_reps
- max_weight_kg
- total_volume_kg
- created_at

목적:
- 세션 내 운동별 요약 저장

## workout_sets
- id
- workout_exercise_id
- set_no
- weight_kg
- reps
- rpe
- rest_seconds
- is_success
- memo
- created_at

목적:
- 실제 세트 단위 원천 데이터 저장

## recommendations
- id
- user_id
- source_workout_session_id
- target_workout_date
- recommendation_type
- reason_summary
- confidence_score
- is_applied
- user_feedback
- created_at

목적:
- 추천 결과 메타 저장

## recommendation_items
- id
- recommendation_id
- exercise_id
- order_no
- recommended_sets
- recommended_reps
- recommended_weight_kg
- recommended_rest_seconds
- adjustment_reason
- created_at

목적:
- 추천안의 운동별 상세 저장

## workout_analytics_daily
- id
- user_id
- analytics_date
- total_sessions
- total_volume_kg
- total_minutes
- total_pr_count
- avg_performance_score
- created_at

목적:
- 일 단위 집계 캐시

## workout_analytics_weekly
- id
- user_id
- year
- week_number
- total_sessions
- total_volume_kg
- total_minutes
- body_part_distribution_json
- avg_performance_score
- created_at

목적:
- 주간 대시보드 및 리포트용 집계

## personal_records
- id
- user_id
- exercise_id
- record_type
- value
- unit
- achieved_at
- workout_session_id
- created_at

목적:
- PR 관리

## follows
- id
- follower_user_id
- following_user_id
- status
- created_at

목적:
- 팔로우 관계 저장

## friendships
- id
- user_a_id
- user_b_id
- status
- created_at

목적:
- 친구 관계 저장

## feed_events
- id
- actor_user_id
- event_type
- target_id
- visibility
- payload_json
- created_at

목적:
- 친구 피드 생성용 이벤트 저장

## achievements
- id
- code
- name
- description
- category
- created_at

목적:
- 업적 마스터 데이터

## user_achievements
- id
- user_id
- achievement_id
- achieved_at
- created_at

목적:
- 유저 배지 획득 기록

## uploaded_images
- id
- user_id
- storage_url
- original_filename
- mime_type
- created_at

목적:
- 업로드 이미지 저장 메타

## equipment_recognitions
- id
- user_id
- uploaded_image_id
- predicted_equipment_id
- confidence_score
- verified_equipment_id
- status
- created_at

목적:
- 장비 인식 결과와 수정 결과 저장

## notifications
- id
- user_id
- type
- title
- body
- is_read
- related_target_type
- related_target_id
- created_at

목적:
- 앱 내 알림 저장

## admin_reports
- id
- reporter_user_id
- target_type
- target_id
- reason
- status
- reviewed_by_admin_id
- created_at
- updated_at

목적:
- 신고 데이터 저장

## 3. 핵심 관계

- users 1:N workout_sessions
- workout_sessions 1:N workout_exercises
- workout_exercises 1:N workout_sets
- users 1:N recommendations
- recommendations 1:N recommendation_items
- users N:M programs, through user_programs
- users N:M users, through follows
- users N:M users, through friendships
- users 1:N feed_events
- users 1:N user_achievements

## 4. 초기에 꼭 필요한 인덱스

- users.email unique
- workout_sessions.user_id + workout_date
- workout_sets.workout_exercise_id + set_no
- personal_records.user_id + exercise_id
- follows.follower_user_id + following_user_id unique
- feed_events.actor_user_id + created_at
- notifications.user_id + is_read

## 5. MVP에서 우선 구현할 테이블

무조건 먼저 만드는 테이블:
- users
- user_settings
- exercises
- programs
- user_programs
- workout_sessions
- workout_exercises
- workout_sets
- recommendations
- recommendation_items
- workout_analytics_weekly

2차로 붙이는 테이블:
- personal_records
- follows
- feed_events
- achievements
- user_achievements
- uploaded_images
- equipment_recognitions
- notifications

## 6. 설계 메모

- body_part_distribution_json 같은 필드는 초기 속도를 위해 JSON으로 두고, 추후 정규화 여부를 검토한다.
- recommendation은 생성 결과를 스냅샷으로 저장해서 나중에 추천 정확도와 수락률을 분석할 수 있게 한다.
- 운동 마스터와 프로그램 규칙은 운영자가 수정 가능한 구조로 잡는다.
- 장비 인식은 항상 사용자의 최종 확인 값을 남겨서 학습용 검수 데이터로도 활용할 수 있게 한다.
