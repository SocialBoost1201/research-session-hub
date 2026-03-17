// アプリケーション共通の型定義

export type Role = 'viewer' | 'presenter' | 'office';

export type PaperStatus =
  | 'draft'
  | 'submitted'
  | 'revision_requested'
  | 'resubmitted'
  | 'scheduled'
  | 'published_members_only'
  | 'free_public'
  | 'archived';

export type Visibility = 'private' | 'members_only' | 'free_public';

export type SubmissionStatus = 'pending' | 'approved' | 'rejected';

export type ReviewType = 'revision_request' | 'approval' | 'schedule_set';

export type ReviewDecision = 'request_revision' | 'approve' | 'schedule';

export type ThreadStatus = 'open' | 'closed';

// ---- DB テーブル型 ----

export interface Profile {
  id: string;
  role: Role;
  display_name: string;
  affiliation: string | null;
  created_at: string;
  updated_at: string;
}

export interface Paper {
  id: string;
  title: string;
  abstract: string;
  category: string;
  author_name: string;
  affiliation: string;
  presenter_id: string;
  current_submission_id: string | null;
  visibility: Visibility;
  status: PaperStatus;
  scheduled_publish_at: string | null;
  discussion_start_at: string | null;
  discussion_end_at: string | null;
  published_at: string | null;
  free_public_at: string | null;
  archived_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Submission {
  id: string;
  paper_id: string;
  version_no: number;
  file_path: string;
  file_name: string;
  submitted_by: string;
  submission_note: string | null;
  office_feedback: string | null;
  status: SubmissionStatus;
  created_at: string;
}

export interface Review {
  id: string;
  paper_id: string;
  submission_id: string;
  reviewer_id: string;
  review_type: ReviewType;
  decision: ReviewDecision;
  comment: string | null;
  created_at: string;
}

export interface Thread {
  id: string;
  paper_id: string;
  status: ThreadStatus;
  opened_at: string;
  closed_at: string | null;
  visibility: Visibility;
  created_at: string;
}

export interface Comment {
  id: string;
  thread_id: string;
  paper_id: string;
  user_id: string;
  parent_comment_id: string | null;
  body: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

// ---- API レスポンス型 ----

export interface ApiSuccess<T> {
  data: T;
  error: null;
}

export interface ApiError {
  data: null;
  error: {
    code: string;
    message: string;
  };
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

// ---- エラーコード ----

export const ERROR_CODES = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  INVALID_STATE: 'INVALID_STATE',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  OWNERSHIP_ERROR: 'OWNERSHIP_ERROR',
  UPLOAD_FAILED: 'UPLOAD_FAILED',
  STORAGE_ERROR: 'STORAGE_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
  DISCUSSION_CLOSED: 'DISCUSSION_CLOSED',
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  FILE_TYPE_NOT_ALLOWED: 'FILE_TYPE_NOT_ALLOWED',
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];
