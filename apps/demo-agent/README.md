# @prova/demo-agent

Agente de referencia que genera **atestaciones reales en Devnet 24/7** usando el
SDK público [`prova-agent-sdk`](../../packages/sdk-typescript). Sirve para dos cosas:

1. **Feed vivo** en el Forensic Explorer (en vez de mocks o datos congelados).
2. **Ejemplo end-to-end** de cómo un agente autónomo sella cada acción on-chain.

En cada tick construye una acción plausible de un bot de DeFi (swap, tool call,
invocación de modelo, decisión, acceso a recurso o chequeo de política), la hashea
(SHA-256) y la firma con Ed25519 a través del SDK, registrándola en el programa
Prova de Solana.

## Variables de entorno

| Variable | Requerida | Default | Descripción |
|---|---|---|---|
| `OPERATOR_SECRET_KEY` | ✅ | — | Keypair de Devnet **con SOL**. Paga fees y firma. Acepta array JSON `[...]` o base58. |
| `RPC_URL` | — | `clusterApiUrl('devnet')` | RPC de Solana. Recomendado Helius para estabilidad. |
| `PROGRAM_ID` | — | Program ID desplegado | Programa Prova. |
| `INTERVAL_MS` | — | `60000` | Frecuencia entre atestaciones (1 min). |
| `MIN_BALANCE_SOL` | — | `0.2` | Por debajo de esto intenta auto-airdrop (solo Devnet). |
| `AGENT_SECRET_KEY` | — | derivado determinista | Identidad del agente. No necesita fondos. |
| `PORT` | — | `8080` | Puerto del health check. |

> El operador es el único secreto que necesita fondos. La identidad del agente se
> deriva de forma determinista (`prova-demo-agent-v1`) para mantener un PDA estable
> entre reinicios sin custodiar otro secret.

## Local

```bash
export OPERATOR_SECRET_KEY='[12,34,...]'   # keypair de Devnet con SOL
pnpm --filter=@prova/demo-agent dev
```

## Deploy a Fly.io

```bash
cd apps/demo-agent
fly launch --no-deploy            # crea la app prova-demo-agent (solo la primera vez)
fly secrets set OPERATOR_SECRET_KEY='[12,34,...]'
fly secrets set RPC_URL='https://devnet.helius-rpc.com/?api-key=...'   # opcional
fly deploy
```

El health check (`GET /health`) devuelve estado, contador y la última atestación,
manteniendo la máquina viva 24/7 (`min_machines_running = 1`).
