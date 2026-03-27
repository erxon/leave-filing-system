# Online Leave Filing system

**Key Features:**

- **Smart Conflict Detection:** Managers can set a "threshold" for their department. If too many people request the same day, the system flags it instantly.
- **Department-Wide Calendar:** A unified view of leaves synced with Philippines Holidays.
- **Seamless Reporting:** One-click CSV exports for payroll and records.

**The Tech Behind It:**

- **Multi-tenancy:** Built with a strict multi-tenant architecture to ensure total data isolation between different companies.
- **Supabase RPC:** Used for efficient, server-side conflict detection logic.
- **Google Calendar API:** Integrated for localized holiday tracking.
