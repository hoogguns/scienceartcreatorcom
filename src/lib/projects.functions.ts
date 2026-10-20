import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import { isPlanId, projectCap, type PlanId } from "@/lib/plans";

export type ProjectSummary = {
  id: string;
  title: string;
  updatedAt: string;
};

const idOk = (id: string) => /^[0-9a-f-]{16,64}$/i.test(id);

async function planFor(userId: string): Promise<PlanId> {
  const sql = await getSql();
  const rows = await sql<{ plan: string }>`
    select plan from subscriptions where user_id = ${userId}
  `;
  const plan = rows[0]?.plan ?? "free";
  return isPlanId(plan) ? plan : "free";
}

export const listProjects = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<ProjectSummary[]> => {
    const sql = await getSql();
    const rows = await sql<{ id: string; title: string; updated_at: string }>`
      select id, title, updated_at::text as updated_at
      from projects
      where user_id = ${context.userId}
      order by updated_at desc
    `;
    return rows.map((row) => ({
      id: row.id,
      title: row.title,
      updatedAt: row.updated_at,
    }));
  });

export const getProject = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((input: { id: string }) => {
    if (!input || !idOk(input.id)) throw new Error("Invalid figure");
    return input;
  })
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const rows = await sql<{ title: string; canvas_json: string; updated_at: string }>`
      select title, canvas_json, updated_at::text as updated_at
      from projects
      where id = ${data.id} and user_id = ${context.userId}
    `;
    const row = rows[0];
    if (!row) return null;
    return {
      id: data.id,
      title: row.title,
      canvasJson: row.canvas_json,
      updatedAt: row.updated_at,
    };
  });

export const saveProject = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id: string; title: string; canvasJson: string }) => {
    if (!input || !idOk(input.id)) throw new Error("Invalid figure");
    const title = (input.title || "Untitled figure").trim().slice(0, 120);
    if (!input.canvasJson || input.canvasJson.length > 1_500_000) {
      throw new Error("Figure is too large to save");
    }
    return { id: input.id, title, canvasJson: input.canvasJson };
  })
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const existing = await sql<{ id: string }>`
      select id from projects where id = ${data.id} and user_id = ${context.userId}
    `;
    if (existing.length === 0) {
      const plan = await planFor(context.userId);
      const cap = projectCap(plan);
      if (cap != null) {
        const counts = await sql<{ n: number }>`
          select count(*)::int as n from projects where user_id = ${context.userId}
        `;
        if ((counts[0]?.n ?? 0) >= cap) {
          return { ok: false as const, error: `The ${plan} plan holds ${cap} figures. Open pricing to raise the limit.` };
        }
      }
      await sql`
        insert into projects (id, user_id, title, canvas_json)
        values (${data.id}, ${context.userId}, ${data.title}, ${data.canvasJson})
      `;
    } else {
      await sql`
        update projects
        set title = ${data.title}, canvas_json = ${data.canvasJson}, updated_at = now()
        where id = ${data.id} and user_id = ${context.userId}
      `;
    }
    return { ok: true as const };
  });

export const deleteProject = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id: string }) => {
    if (!input || !idOk(input.id)) throw new Error("Invalid figure");
    return input;
  })
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await sql`delete from projects where id = ${data.id} and user_id = ${context.userId}`;
    return { ok: true as const };
  });
