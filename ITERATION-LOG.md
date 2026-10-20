# Iteration log

## Iteration 1 — foundation studio

Shipped a working figure studio in the live app.

Successes:

- Fabric plate: select, drag, scale, rotate, layer, undo, text, shapes.
- Vector symbol library and eight starter plates.
- Local drafts without an account. Signed-in drafts use Grok and only catalog icons.
- Accounts and per-user saved figures.
- PNG, SVG, and journal PDF export.
- Pricing for Starter, Unlimited, and Lifetime. Stripe checkout is coded and inactive until keys exist.

Still open:

- Stripe keys are not connected.
- Remote still holds the earlier StudioApp tree. Do not partial-overwrite it.
- Arrows do not stick to objects yet.


## Iteration 3 — snap and plot marks

Successes:

- Snap guides (10 px) on move and scale, with a side-panel toggle.
- Western blot, bar chart, line plot, and histology icons added to the marks library.

Still open:

- Connectors do not stick yet.
- Stripe keys still not connected.


## Iteration 4 — connectors and labeled scale bars

Successes:

- Orthogonal Connector tool with endpoint snap to nearby objects.
- Scale bars now show unit labels; added nm variant, multi-lane blot, and scatter plot.

Still open:

- Connectors do not re-route when objects move.
- Stripe keys still not connected.
