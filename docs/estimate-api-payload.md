# New estimate API payload and round trip

The new estimate form posts the same object shape to `estimation/create` or `estimation/update` (the latter includes the estimate `id`). It retrieves estimates from `estimation/getdetails?id=…`. The exact backend schema, storage limits and endpoint behavior must be confirmed against the deployed API; this repository contains the frontend only.

## Standard payload

```json
{
  "businessName": "Example client",
  "jobName": "Example job",
  "quantity": 200,
  "size": "A4",
  "date": "2026-11-02",
  "marginPercentage": 35,
  "isTemplate": false,
  "summary": {
    "subTotal": 100,
    "unitCostOfProduction": 0.5,
    "marginAmount": 35,
    "totalExclVat": 135,
    "nhisGetFundAmount": 0,
    "vatAmount": 27,
    "grandTotal": 162,
    "taxRates": { "nhisGetFund": 0, "vat": 20 }
  },
  "details": [
    { "itemName": "Cover paper", "quantity": 100, "unitPrice": 1, "isFormula": false, "isSteppingStone": false, "formulaOutput": 0, "formulaId": "", "expression": "", "isPercentagePlugin": false, "percentageTarget": "", "percentageRate": 0, "_category": "Paper info", "_inventoryItemId": "paper-id", "_variantName": "", "_optionName": "", "_computedTotal": 0, "quantityManuallyEdited": false, "_id": "row-1" }
  ],
  "variables": [
    { "name": "Template Type", "systemName": "templateType", "value": "bookwork" },
    { "name": "Summaries", "systemName": "summaries", "value": [{ "label": "Summary 1", "value": "Example" }] },
    { "name": "Finishing selection", "systemName": "finishingSelection", "value": { "binding": "", "surface": "", "laminateType": "gloss", "laminateSize": "460", "spotType": "3d-matt", "spotOvers": 0 } },
    { "name": "Finishing prices", "systemName": "finishingPrices", "value": { "collate": 1.3, "foldingTiers": [], "perfectBind": null, "saddleStitch": null, "caseBind": null, "lamination": { "gloss": { "460": 2.3 }, "matt": {}, "soft-touch": {}, "saudy": {} }, "spot": { "3d-matt": null, "3d-gloss": null, "3d-pattern": null } } },
    { "name": "Estimate rows", "systemName": "estimateRows", "value": [{ "id": "row-1", "category": "Paper info", "description": "Cover paper", "quantity": 100, "unitPrice": 1, "inventoryItemId": "paper-id" }] },
    { "name": "New estimate snapshot", "systemName": "newEstimateSnapshot", "value": {
      "version": 1,
      "form": {
        "templateType": "bookwork", "date": "2026-11-02", "noOfCoverSides": "1", "client": "Example client", "jobName": "Example job", "quantity": 200, "size": "A4", "pages": 32, "pagesToView": 8, "pagesOut": 2, "noOfColoursCover": 4, "noOfColoursText": 4, "noOfCoversPerSheet": 2, "noOfInsidePlates": 16, "noOfCoverPlates": 1, "wasteFactor": 0.1, "marginPercentage": 35, "taxPercentage": 20,
        "summaries": [{ "label": "Summary 1", "value": "Example" }],
        "tableRows": [{ "id": "row-1", "category": "Paper info", "description": "Cover paper", "quantity": 100, "unitPrice": 1, "inventoryItemId": "paper-id" }]
      },
      "finishingSelection": { "binding": "", "surface": "", "laminateType": "gloss", "laminateSize": "460", "spotType": "3d-matt", "spotOvers": 0 },
      "finishingPrices": { "collate": 1.3, "foldingTiers": [], "perfectBind": null, "saddleStitch": null, "caseBind": null, "lamination": { "gloss": { "460": 2.3 }, "matt": {}, "soft-touch": {}, "saudy": {} }, "spot": { "3d-matt": null, "3d-gloss": null, "3d-pattern": null } },
      "productionRequest": null,
      "productionRequestId": ""
    } }
  ],
  "estimatedCost": 162,
  "description": "Example job (Qty: 200, Size: A4)",
  "taxes": [{ "taxName": "VAT", "rate": 20, "isPercentage": true, "taxAmount": 27 }]
}
```

The example omits some scalar variables for brevity. All structured variable values, including the snapshot, are native JSON objects or arrays, not JSON-encoded strings. The client also sends the individual legacy variables (`pages`, `pagesToView`, `pagesOut`, `noOfColoursCover`, `noOfColoursText`, `noOfCoversPerSheet`, `noOfInsidePlates`, `noOfCoverPlates`, `noOfCoverSides`, `wasteFactor`, `marginPercentage`, `taxPercentage`, `summaries`, `finishingSelection`, `finishingPrices`, `estimateRows`). If linked, `productionRequestId` is also included at the top level. Server-assigned identity and lifecycle fields must not be inferred from the example.

## Snapshot v1

- `form` contains every form field, all summaries, and `tableRows` in order. Rows retain IDs, category, description, quantities, prices (including null and zero), inventory variant and size, percentage target ID and rate, manual-quantity flag and computed total, finishing kind and selected lamination type and size.
- `finishingSelection` preserves the automatic bookwork finishing selections; `finishingPrices` preserves the API price configuration used by the estimate, including dynamic lamination sizes and folding tiers. This is an estimate snapshot, not a change to the current setup.
- `productionRequestId` and the small `productionRequest` display object preserve the link and banner, without embedding the full request.
- The screen restores the snapshot without running calculation watchers during hydration. Later edits trigger the normal calculations. Legacy estimates without the snapshot use the existing individual-variable/row fallback. An invalid or unsupported snapshot blocks saving rather than silently overwriting it.
- The legacy `details` and `summary` remain for existing consumers. Folding's detail `unitPrice` is the flat band charge divided by folding quantity so quantity × unit price remains the flat charge; the snapshot keeps the actual displayed flat price. Percentage target IDs refer to the row IDs in the snapshot, not backend-generated detail IDs.

## Backend requirements to verify or implement

1. Change the estimate variable DTO and persistence to accept and return native JSON objects and arrays in `value` (as well as legacy scalar strings). Persist every `variables` entry, including unknown `systemName` values, without truncation, stringification, or dropping nested fields. In particular, `newEstimateSnapshot.value` is an object; `summaries` and `estimateRows` values are arrays, and `finishingSelection` and `finishingPrices` values are objects. The detail endpoint must return them as the same JSON types.
2. Treat updates as an atomic replacement/upsert of the estimate's variables and details, preserving all entries and the production request link. Do not drop empty, zero, null, or nested snapshot fields. Scope reads/writes to the authenticated tenant and perform authorization and validation server-side.
3. Preserve the canonical top-level fields, detail rows, taxes and totals for reporting and existing consumers. Do not treat the snapshot as trusted financial data: validate/recalculate according to server business rules, and agree on rounding and precedence if server calculations differ.
4. Verify actual request/response size limits, JSON storage capacity, any required DTO fields and API behavior. Existing string-only variable DTOs or databases must be changed to support structured JSON. The frontend can read old string-encoded snapshots but sends new structured values only. Older records that never stored full rows cannot be perfectly reconstructed.

An end-to-end create → getdetails → edit → update → getdetails test against the real backend is required to establish that the API preserves this contract; frontend tests alone cannot prove it.
