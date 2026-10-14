/**
 * Client-side handoff for the "Select Candidate → Create Introduction" flow.
 * The chosen CandidateMatchView is stashed in sessionStorage keyed by the
 * requester request id so the review page can render the full pairing without
 * a second search.
 */
export const CANDIDATE_SELECTION_KEY = (requestId: string) =>
  `mm:selected-candidate:${requestId}`;
