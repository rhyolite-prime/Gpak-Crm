# Finishing prices: proposed save request

`buildFinishingPricesRequest` in `utils/finishingPricing.ts` constructs a full-replacement request for the authenticated tenant. The API should save all records atomically and scope them to the authenticated tenant; the client does not supply a tenant ID. No endpoint for these prices currently exists in this repository, so the setup page still saves locally and does **not** send this request.

```json
{
  "currency": "GHS",
  "prices": [
    { "category": "collate", "option": "collate", "sizeMm": null, "minQuantity": null, "maxQuantity": null, "unitPrice": 0.075 },
    { "category": "folding", "option": "folding", "sizeMm": null, "minQuantity": 100, "maxQuantity": 1000, "unitPrice": 20 },
    { "category": "folding", "option": "folding", "sizeMm": null, "minQuantity": 1001, "maxQuantity": null, "unitPrice": 15 },
    { "category": "binding", "option": "perfect-bind", "sizeMm": null, "minQuantity": null, "maxQuantity": null, "unitPrice": null },
    { "category": "binding", "option": "saddle-stitch", "sizeMm": null, "minQuantity": null, "maxQuantity": null, "unitPrice": 0.004 },
    { "category": "binding", "option": "case-bind", "sizeMm": null, "minQuantity": null, "maxQuantity": null, "unitPrice": 0.4 },
    { "category": "lamination", "option": "gloss", "sizeMm": 460, "minQuantity": null, "maxQuantity": null, "unitPrice": 1.3 },
    { "category": "spot-finish", "option": "3d-matt", "sizeMm": null, "minQuantity": null, "maxQuantity": null, "unitPrice": null }
  ]
}
```

The example is abbreviated: the actual builder sends all four lamination types at all five widths, all three spot finishes, and the fixed/tiered prices (29 records total). `unitPrice: null` means not configured; `0` is a valid configured price. For folding, bounds are inclusive and a null maximum is unbounded. Values below 100 are not configured. There is no tier overlap: 1,000 is in the first tier, and 1,001 starts the second. The folding unit price is per 1,000-piece batch; the tier is selected using the number of pieces. Other prices use the unit of their respective calculation.

Before connecting a backend, agree on the endpoint, HTTP method, response/error format, and exact numeric precision. The backend must validate nonnegative finite prices and reject duplicate keys `(category, option, sizeMm, minQuantity, maxQuantity)` and overlapping tiers. It must support fetching the same setup so all users and devices see saved prices. The estimate page currently reads the browser-local setup; adding a POST alone would not make it use database prices.
