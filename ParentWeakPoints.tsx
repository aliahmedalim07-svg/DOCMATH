// Auto-generated from config.yml - DO NOT EDIT
export const CONFIG = {
  "features": {
    "pages": {
      "public": {
        "home": true,
        "about": true,
        "contact": true,
        "privacy": true,
        "terms": true
      },
      "teacher": {
        "dashboard": true,
        "students": true,
        "parents": true,
        "admins": true,
        "courses": true,
        "books": true,
        "questions": true,
        "topics": true,
        "assignments": true,
        "resources": true,
        "sessions": true,
        "register-user": true
      },
      "student": {
        "dashboard": true,
        "books": true,
        "assignments": true,
        "skills": true,
        "weak-points": true,
        "checkpoint": true,
        "sessions": true,
        "mistake-history": true,
        "parent-dashboard": true,
        "courses": true
      },
      "parent": {
        "dashboard": true
      }
    },
    "services": {
      "baileyswp": false
    }
  }
} as const;
export type Config = typeof CONFIG;
