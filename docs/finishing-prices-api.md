# Finishing prices: proposed save request

`buildFinishingPricesRequest` in `utils/finishingPricing.ts` constructs a full-replacement request for the authenticated tenant. The API should save all records atomically and scope them to the authenticated tenant; the client does not supply a tenant ID. The setup page sends its current setup object through `createFinishingPrice` and loads the saved object through `getFinishingPrices`. The record-based full-replacement payload described below is a proposed contract, not the shape currently sent by the page.

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

The example is abbreviated: the actual builder sends all four lamination types at all five widths, all three spot finishes, and the configured folding bands (29 records with the default two bands). `unitPrice: null` means not configured; `0` is a valid configured price. For folding, bounds are inclusive and a null maximum is unbounded. Bands are configurable, must not overlap, and may have gaps. Unmatched quantities are unpriced. The folding price is a flat charge for the entire job, selected by the band containing the total number of pieces; it is not multiplied by the number of batches. For example, with the default bands, 1,001 pieces cost GHS 15 in total. When saving an estimate line, the flat charge is divided by the displayed batch quantity to preserve the existing quantity-times-unit-price contract; the estimate snapshot retains the actual flat price. Other prices use the unit of their respective calculation.

Before connecting a backend, agree on the endpoint, HTTP method, response/error format, and exact numeric precision. The backend must validate nonnegative finite prices and reject duplicate keys `(category, option, sizeMm, minQuantity, maxQuantity)` and overlapping tiers. The server must scope the setup to the authenticated tenant and return the same setup so users and devices see saved prices. The estimate page loads prices from the API and retains a snapshot in saved estimates.

## Current setup service

`services/finishingPrices.ts` calls `FinishingOptionPrice/ListAll` for a single setup and `FinishingOptionPrice/create` to save one. The setup and estimate pages use the API, not browser storage. No update or delete endpoint is defined in the current service; saving uses the create endpoint. The actual backend contract should be verified independently of the proposed record payload above.
