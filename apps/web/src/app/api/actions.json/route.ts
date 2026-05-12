// Solana Actions manifest — permite a clientes Blinks descubrir las acciones de este dominio.
// Spec: https://solana.com/docs/advanced/actions#actionsJson

export const runtime = 'edge';

export function GET() {
  const manifest = {
    rules: [
      {
        pathPattern: '/api/actions/verify',
        apiPath: '/api/actions/verify',
      },
      {
        pathPattern: '/explorer/tx/**',
        apiPath: '/api/actions/verify',
      },
    ],
  };

  return Response.json(manifest, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
    },
  });
}
