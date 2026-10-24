# DevPay Africa — Discovery Working Draft & Decision Log

## Phase A: Vision & Product Identity

### Confirmed Decisions

| # | Topic | Decision | Architectural & Product Implications | Status |
|---|---|---|---|---|
| **A-1** | Launch Geography | **Ghana as Day 1 Anchor Market** | • Primary currency: Ghanaian Cedi (GHS).<br>• Core payment rails: Mobile Money (MTN MoMo, Telecel Cash, AT Money) and local card/bank transfer via Ghana-supported gateways (e.g., Paystack Ghana, Hubtel).<br>• Primary KYC: National ID / Ghana Card verification integration.<br>• System architecture must support multi-country/multi-currency schema from Day 1 without rebuilding. | **Confirmed** |

### Key Architectural Guidelines Established
- **Multi-tenant/multi-country readiness:** Store currency codes (ISO 4217), country codes (ISO 3166-1 alpha-2), and international phone dial codes (E.164) natively.
- **Pluggable Payment Gateway Strategy:** Abstract payment integrations behind an adapter pattern (`PaymentProviderInterface`) so adding future gateways (e.g., Nigeria, Kenya, Côte d'Ivoire) requires only a new driver without touching core transaction logic.
