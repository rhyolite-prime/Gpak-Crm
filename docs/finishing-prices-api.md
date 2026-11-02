# Finishing price setup API

The frontend currently calls `GET FinishingOptionPrice/ListAll` for one setup and `POST FinishingOptionPrice/create` to save a setup. The POST body is the **setup object below**, not the record-based format produced by the internal validation helper. No update or delete endpoint is defined by this frontend; the current create endpoint must return a successful response and the list endpoint must subsequently expose the saved setup. Confirm the backend's create/versioning behavior before deployment.

## Dynamic lamination sizes

Keep `lamination` as a JSON object keyed first by the existing type (`gloss`, `matt`, `soft-touch`, `saudy`) and then by the width in millimetres as a numeric string. Widths are independently configurable per type. Example POST body (other fields abbreviated):

```json
{
  "collate": 1.3,
  "perfectBind": 2.2,
  "saddleStitch": 2,
  "caseBind": 2,
  "foldingTiers": [{ "minQuantity": 100, "maxQuantity": 1000, "price": 20 }],
  "lamination": {
    "gloss": { "460": 2.3, "825.5": 3.1 },
    "matt": { "510": 2.5 },
    "soft-touch": {},
    "saudy": { "640": null }
  },
  "spot": { "3d-matt": 2, "3d-gloss": 2.8, "3d-pattern": 2.9 }
}
```

Backend changes to make or verify:

- Accept, persist and return arbitrary positive numeric width keys, including decimals, for each existing type. Replace fixed-width DTO fields, database columns or validation lists with a dictionary/JSON object or child records keyed by setup, type and numeric width. Preserve old values when migrating existing setups.
- Treat the submitted lamination object as the complete set of sizes for that setup: a removed key stays removed and `{}` means no sizes for that type. Do not merge deleted widths back from defaults. Save atomically with the rest of the setup, scoped to the authenticated tenant.
- Validate positive finite widths and non-negative finite prices; normalize numeric width keys so `460` and `460.0` cannot coexist for the same type. `null` is an unset price; `0` is valid. Preserve both and return numeric prices (not strings).
- `ListAll` must return the same type-to-width-to-price shape (including custom widths and nulls) inside its existing response envelope. Existing fixed-size objects in this shape continue to load. The frontend still uses the existing `create` endpoint, so verify its semantics and any backend restrictions before relying on changes being visible across sessions.

On the new estimate, each lamination row lists widths configured for its own type. A selected width supplies the unit price and feeds the existing quantity formula. Saved estimate snapshots retain their own configuration; a previously selected width that is no longer configured is shown as unavailable rather than silently changed.

Folding bands remain inclusive, non-overlapping and may contain gaps. A null maximum is unbounded. The job quantity selects one band and its price is charged once as a flat amount. Legacy folding fields are read for migration but excluded from outgoing setup payloads.

Folding quantity is `ceil(pages in a section × max(job quantity, 1000) / 1000)`. The minimum quantity applies only to this calculation; price-band selection and other quantities use the actual job quantity.
