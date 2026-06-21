# Parasol — Domain Glossary

## Node
A vertex in the payment network. Two subtypes:

### Company (node_type = "company")
A pharmaceutical or medical-device company registered in Transparence Santé as a payer.
Identified by `entreprise_id`. Carries: name, SIREN, sector, city, region.

### Beneficiary (node_type = "beneficiary")
A natural person or organisation that received payments from one or more Companies.
Identified by `id_beneficiaire`. Carries: name, profession, category, city, region.
Individuals have a profession; organisations do not.

## Link
A directed payment relationship from a Company to a Beneficiary, typed by `lien_interet`:
- **remuneration** — direct fee or salary
- **convention** — contractual arrangement (sponsorship, hospitality, etc.)
- **avantage** — benefit in kind

A Link aggregates all declarations between a given (source, target, link_type) triple.
Carries: total_amount, nb_declarations, first_date, last_date.

## Canonical Beneficiary
The representative Beneficiary node after entity resolution. Variant spellings of the same
real-world person or organisation are collapsed into one Canonical Beneficiary.
Stored in `beneficiary_canonical` table (original_id → canonical_id).

## Anomaly Flag
A boolean attribute on a Beneficiary node indicating it warrants closer inspection.
Current signals (computed at export time, no LLM):
- **Hub**: Beneficiary receives from ≥ 5 distinct Companies
- **Outlier**: Beneficiary's total received is in the top 1% for their profession/category

## Graph
The full bipartite network: Companies on one side, Beneficiaries on the other, Links as edges.
Exported as `graph.json` by `bin/parasol_export.py` from `transparence_resolved.duckdb`.
