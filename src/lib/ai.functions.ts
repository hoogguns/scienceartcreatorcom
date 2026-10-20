import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import { iconIndexForPrompt, getIcon } from "@/lib/icons/catalog";
import type { Draft, DraftItem } from "@/lib/icons/types";
import { dailyDraftCap, isPlanId, type PlanId } from "@/lib/plans";

const draftSchema = z.object({
  title: z.string().min(1).max(80),
  items: z
    .array(
      z.object({
        iconId: z.string().optional(),
        text: z.string().max(80).optional(),
        x: z.number().min(0).max(100),
        y: z.number().min(0).max(100),
        w: z.number().min(4).max(60).optional(),
        angle: z.number().min(-180).max(180).optional(),
      }),
    )
    .min(1)
    .max(16),
});

function extractJson(text: string): unknown {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = fenced?.[1] ?? text;
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start < 0 || end < start) throw new Error("No layout returned");
  return JSON.parse(raw.slice(start, end + 1));
}

function sanitize(parsed: z.infer<typeof draftSchema>): Draft {
  const items: DraftItem[] = [];
  for (const item of parsed.items) {
    if (item.iconId) {
      if (!getIcon(item.iconId)) continue;
      items.push({
        iconId: item.iconId,
        x: item.x,
        y: item.y,
        w: item.w,
        angle: item.angle,
      });
    } else if (item.text?.trim()) {
      items.push({ text: item.text.trim(), x: item.x, y: item.y, w: item.w });
    }
  }
  if (items.length === 0) throw new Error("The draft did not use the icon library");
  return { title: parsed.title, items, source: "grok" };
}

export const draftFigure = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { prompt: string }) => {
    const prompt = (input?.prompt ?? "").trim();
    if (prompt.length < 3 || prompt.length > 400) throw new Error("Describe the figure in a short prompt");
    return { prompt };
  })
  .handler(async ({ context, data }): Promise<{ ok: true; draft: Draft } | { ok: false; error: string }> => {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) return { ok: false, error: "Drafting is not available right now" };

    const sql = await getSql();
    const planRows = await sql<{ plan: string }>`
      select plan from subscriptions where user_id = ${context.userId}
    `;
    const planName = planRows[0]?.plan ?? "free";
    const plan: PlanId = isPlanId(planName) ? planName : "free";
    const cap = dailyDraftCap(plan);
    const usage = await sql<{ calls: number }>`
      select calls from ai_usage where user_id = ${context.userId} and day = current_date
    `;
    const used = usage[0]?.calls ?? 0;
    if (used >= cap) {
      return { ok: false, error: `Daily draft limit reached (${cap}). The library arranger still works.` };
    }

    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-4.5",
        temperature: 0.4,
        max_tokens: 900,
        messages: [
          {
            role: "system",
            content:
              "You lay out editable scientific figures. Reply with JSON only. Schema: {\"title\": string, \"items\": [{\"iconId\"?: string, \"text\"?: string, \"x\": number, \"y\": number, \"w\"?: number, \"angle\"?: number}]}. x and y are centers in percent (8-92). w is width in percent of the page (8-36). Use only these icon ids: " +
              iconIndexForPrompt() +
              ". Place a short title as a text item near the top. Put a text label under important icons. Prefer 4 to 10 items. Do not invent icon ids.",
          },
          { role: "user", content: data.prompt },
        ],
      }),
    });

    if (!res.ok) return { ok: false, error: "The drafter did not respond. Try the library arranger." };

    const body = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const text = body.choices?.[0]?.message?.content ?? "";
    try {
      const json = extractJson(text);
      const parsed = draftSchema.parse(json);
      const draft = sanitize(parsed);
      await sql`
        insert into ai_usage (user_id, day, calls)
        values (${context.userId}, current_date, 1)
        on conflict (user_id, day)
        do update set calls = ai_usage.calls + 1
      `;
      return { ok: true, draft };
    } catch {
      return { ok: false, error: "The draft could not be placed. Try a simpler prompt." };
    }
  });
